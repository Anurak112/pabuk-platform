/**
 * GET /api/points/leaderboard - Get leaderboard rankings
 */

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type LeaderboardCategory =
    | "TOTAL_POINTS"
    | "QUALITY_AVERAGE"
    | "GEOGRAPHIC_COVERAGE"
    | "CONTRIBUTION_COUNT";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = (searchParams.get("category") || "TOTAL_POINTS") as LeaderboardCategory;
        const period = searchParams.get("period") || "all-time";
        const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
        const offset = parseInt(searchParams.get("offset") || "0");

        const prisma = (await import("@/lib/prisma")).default;
        const { auth } = await import("@/lib/auth");
        const session = await auth();

        // Build order by based on category
        let orderBy: Record<string, "asc" | "desc">;
        let select: Record<string, boolean | object>;

        switch (category) {
            case "QUALITY_AVERAGE":
                orderBy = { averageQualityRating: "desc" };
                break;
            case "GEOGRAPHIC_COVERAGE":
                orderBy = { provincesCovered: "desc" };
                break;
            case "CONTRIBUTION_COUNT":
                orderBy = { approvedContributions: "desc" };
                break;
            case "TOTAL_POINTS":
            default:
                orderBy = { points: "desc" };
                break;
        }

        // Base select
        select = {
            id: true,
            name: true,
            image: true,
            points: true,
            level: true,
            approvedContributions: true,
            averageQualityRating: true,
            provincesCovered: true,
        };

        // Time filter for period
        let createdAtFilter = {};
        if (period === "monthly") {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            createdAtFilter = { createdAt: { gte: monthAgo } };
        } else if (period === "weekly") {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            createdAtFilter = { createdAt: { gte: weekAgo } };
        }

        // Get leaderboard
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where: {
                    points: { gt: 0 },
                    ...createdAtFilter,
                },
                select,
                orderBy,
                take: limit,
                skip: offset,
            }),
            prisma.user.count({
                where: { points: { gt: 0 }, ...createdAtFilter },
            }),
        ]);

        // Format rankings
        const rankings = users.map((user, index) => ({
            rank: offset + index + 1,
            userId: user.id,
            name: user.name || "Anonymous",
            image: user.image,
            points: user.points,
            level: user.level,
            contributions: user.approvedContributions,
            qualityRating: user.averageQualityRating,
            provinces: user.provincesCovered,
        }));

        // Get current user's rank if authenticated
        let currentUser = null;
        if (session?.user?.id) {
            const userRank = await prisma.user.count({
                where: {
                    points: {
                        gt: (await prisma.user.findUnique({
                            where: { id: session.user.id },
                            select: { points: true },
                        }))?.points || 0,
                    },
                },
            });

            const userData = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: { points: true, level: true },
            });

            currentUser = {
                rank: userRank + 1,
                points: userData?.points || 0,
                level: userData?.level || "Bronze",
            };
        }

        return NextResponse.json({
            success: true,
            data: {
                category,
                period,
                updatedAt: new Date().toISOString(),
                rankings,
                total,
                currentUser,
            },
        });
    } catch (error) {
        console.error("Get leaderboard error:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดในระบบ", error: String(error) },
            { status: 500 }
        );
    }
}
