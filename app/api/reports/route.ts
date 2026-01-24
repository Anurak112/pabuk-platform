import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Prevent static generation - this route requires database access
export const dynamic = "force-dynamic";

// Demo data for when database is not available
const DEMO_REPORTS = [
    {
        id: "demo-1",
        location: "ถนนมิตรภาพ กม. 215 อ.เมือง จ.ชัยภูมิ",
        latitude: 15.8068,
        longitude: 102.0316,
        severity: "CRITICAL",
        damageType: "POTHOLE",
        status: "PENDING",
        description: "หลุมขนาดใหญ่กลางถนน อันตรายมาก",
        createdAt: new Date().toISOString(),
        user: { id: "demo-user", name: "ผู้รายงานตัวอย่าง" },
    },
    {
        id: "demo-2",
        location: "ทางหลวง 201 กม. 58 อ.บ้านเขว้า",
        latitude: 15.7521,
        longitude: 102.1234,
        severity: "HIGH",
        damageType: "CRACK",
        status: "VERIFIED",
        description: "รอยแตกยาวตามขวางถนน",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        user: { id: "demo-user-2", name: "ชาวบ้าน" },
    },
    {
        id: "demo-3",
        location: "ถนนชัยภูมิ-ตาดโตน กม. 12",
        latitude: 15.8500,
        longitude: 101.9800,
        severity: "MEDIUM",
        damageType: "SURFACE_WEAR",
        status: "IN_PROGRESS",
        description: "ผิวถนนชำรุดจากรถบรรทุกอ้อย",
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        user: { id: "demo-user-3", name: "อาสาสมัคร" },
    },
    {
        id: "demo-4",
        location: "ถนนสายบ้านค่าย-หนองบัวแดง กม. 8",
        latitude: 15.9200,
        longitude: 102.0800,
        severity: "LOW",
        damageType: "SHOULDER_DAMAGE",
        status: "REPAIRED",
        description: "ไหล่ทางทรุด ซ่อมแซมแล้ว",
        createdAt: new Date(Date.now() - 604800000).toISOString(),
        user: { id: "demo-user-4", name: "ผู้ดูแลถนน" },
    },
    {
        id: "demo-5",
        location: "ทางหลวง 225 อ.คอนสวรรค์",
        latitude: 15.7000,
        longitude: 102.2000,
        severity: "CRITICAL",
        damageType: "COLLAPSE",
        status: "PENDING",
        description: "ถนนทรุดตัวจากน้ำท่วม",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        user: { id: "demo-user-5", name: "เจ้าหน้าที่ อบต." },
    },
    {
        id: "demo-6",
        location: "ถนนเทศบาล ซอย 5 อ.เมืองชัยภูมิ",
        latitude: 15.7900,
        longitude: 102.0500,
        severity: "HIGH",
        damageType: "FLOODING",
        status: "VERIFIED",
        description: "น้ำท่วมขังเมื่อฝนตก",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        user: { id: "demo-user-6", name: "ประชาชน" },
    },
];

// Try to import prisma, but handle the case when database is not available
async function getPrismaClient() {
    try {
        const { prisma } = await import("@/lib/prisma");
        return prisma;
    } catch {
        return null;
    }
}

// GET - List road reports with optional filters
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const severity = searchParams.get("severity");
    const useDemoMode = searchParams.get("demo") === "true";

    // Try database first
    if (!useDemoMode) {
        try {
            const prisma = await getPrismaClient();
            if (prisma) {
                const status = searchParams.get("status");
                const damageType = searchParams.get("damageType");
                const limit = parseInt(searchParams.get("limit") || "50");
                const offset = parseInt(searchParams.get("offset") || "0");

                const where: Record<string, unknown> = {};

                if (status) where.status = status;
                if (severity) where.severity = severity;
                if (damageType) where.damageType = damageType;

                const [reports, total] = await Promise.all([
                    prisma.roadReport.findMany({
                        where,
                        include: {
                            user: {
                                select: { id: true, name: true, image: true },
                            },
                            road: {
                                select: { id: true, name: true, roadNumber: true, district: true },
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
                    pagination: { total, limit, offset, hasMore: offset + reports.length < total },
                    mode: "database",
                });
            }
        } catch (error) {
            console.log("Database not available, falling back to demo mode:", error);
        }
    }

    // Fallback to demo data
    let filteredReports = [...DEMO_REPORTS];
    if (severity && severity !== "ALL") {
        filteredReports = filteredReports.filter(r => r.severity === severity);
    }

    return NextResponse.json({
        success: true,
        data: filteredReports,
        pagination: { total: filteredReports.length, limit: 50, offset: 0, hasMore: false },
        mode: "demo",
        message: "⚠️ แสดงข้อมูลตัวอย่าง - กรุณาตั้งค่าฐานข้อมูลเพื่อใช้งานจริง",
    });
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

        const prisma = await getPrismaClient();
        if (!prisma) {
            return NextResponse.json(
                { success: false, error: "Database not configured. Reports cannot be saved in demo mode." },
                { status: 503 }
            );
        }

        const body = await request.json();
        const { location, latitude, longitude, severity, damageType, description, imageUrls, roadId } = body;

        // Validation
        if (!location || typeof location !== "string") {
            return NextResponse.json({ success: false, error: "Location is required" }, { status: 400 });
        }
        if (typeof latitude !== "number" || typeof longitude !== "number") {
            return NextResponse.json({ success: false, error: "Valid coordinates are required" }, { status: 400 });
        }
        if (!severity || !["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(severity)) {
            return NextResponse.json({ success: false, error: "Valid severity is required" }, { status: 400 });
        }
        if (!damageType) {
            return NextResponse.json({ success: false, error: "Damage type is required" }, { status: 400 });
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
                user: { select: { id: true, name: true } },
            },
        });

        // Award initial points
        await prisma.pointTransaction.create({
            data: {
                userId: session.user.id,
                type: "ADMIN_ADJUSTMENT",
                amount: 10,
                reason: "ส่งรายงานถนนชำรุด",
                metadata: { roadReportId: report.id },
            },
        });

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
