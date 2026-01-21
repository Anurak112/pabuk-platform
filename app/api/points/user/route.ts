/**
 * GET /api/points/user - Get current user's point summary
 */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const { auth } = await import("@/lib/auth");
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "กรุณาเข้าสู่ระบบก่อน" },
                { status: 401 }
            );
        }

        const { PointTransactionService } = await import(
            "@/lib/services/point-transaction.service"
        );

        const summary = await PointTransactionService.getUserSummary(session.user.id);

        // Get rank (simplified - count users with more points)
        const prisma = (await import("@/lib/prisma")).default;
        const higherRanked = await prisma.user.count({
            where: { points: { gt: summary.totalPoints } },
        });
        const rank = higherRanked + 1;

        return NextResponse.json({
            success: true,
            data: {
                userId: session.user.id,
                points: summary.totalPoints,
                level: summary.level,
                rank,
                breakdown: summary.breakdown,
                recentTransactions: summary.recentTransactions.slice(0, 5),
            },
        });
    } catch (error) {
        console.error("Get user points error:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดในระบบ", error: String(error) },
            { status: 500 }
        );
    }
}
