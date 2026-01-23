import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Prevent static generation - this route requires database access
export const dynamic = "force-dynamic";

// GET - List road reports with optional filters
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const severity = searchParams.get("severity");
        const damageType = searchParams.get("damageType");
        const limit = parseInt(searchParams.get("limit") || "50");
        const offset = parseInt(searchParams.get("offset") || "0");

        const where: Record<string, unknown> = {};

        if (status) {
            where.status = status;
        }
        if (severity) {
            where.severity = severity;
        }
        if (damageType) {
            where.damageType = damageType;
        }

        const [reports, total] = await Promise.all([
            prisma.roadReport.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                    road: {
                        select: {
                            id: true,
                            name: true,
                            roadNumber: true,
                            district: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                take: limit,
                skip: offset,
            }),
            prisma.roadReport.count({ where }),
        ]);

        return NextResponse.json({
            success: true,
            data: reports,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + reports.length < total,
            },
        });
    } catch (error) {
        console.error("Error fetching road reports:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch reports" },
            { status: 500 }
        );
    }
}

// POST - Create new road report
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            location,
            latitude,
            longitude,
            severity,
            damageType,
            description,
            imageUrls,
            roadId,
        } = body;

        // Validation
        if (!location || typeof location !== "string") {
            return NextResponse.json(
                { success: false, error: "Location is required" },
                { status: 400 }
            );
        }
        if (typeof latitude !== "number" || typeof longitude !== "number") {
            return NextResponse.json(
                { success: false, error: "Valid coordinates are required" },
                { status: 400 }
            );
        }
        if (!severity || !["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(severity)) {
            return NextResponse.json(
                { success: false, error: "Valid severity is required" },
                { status: 400 }
            );
        }
        if (!damageType) {
            return NextResponse.json(
                { success: false, error: "Damage type is required" },
                { status: 400 }
            );
        }

        // Create the report
        const report = await prisma.roadReport.create({
            data: {
                userId: session.user.id,
                location,
                latitude,
                longitude,
                severity: severity as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
                damageType: damageType as "POTHOLE" | "CRACK" | "COLLAPSE" | "EROSION" | "FLOODING" | "SURFACE_WEAR" | "BRIDGE_DAMAGE" | "SHOULDER_DAMAGE" | "OTHER",
                description: description || null,
                imageUrls: imageUrls || [],
                roadId: roadId || null,
                status: "PENDING",
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        // Award initial points for submitting a report
        await prisma.pointTransaction.create({
            data: {
                userId: session.user.id,
                type: "ADMIN_ADJUSTMENT", // Using existing type for now
                amount: 10,
                reason: "ส่งรายงานถนนชำรุด",
                metadata: { roadReportId: report.id },
            },
        });

        // Update user points
        await prisma.user.update({
            where: { id: session.user.id },
            data: { points: { increment: 10 } },
        });

        return NextResponse.json({
            success: true,
            data: report,
            message: "Report submitted successfully",
            pointsAwarded: 10,
        });
    } catch (error) {
        console.error("Error creating road report:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create report" },
            { status: 500 }
        );
    }
}
