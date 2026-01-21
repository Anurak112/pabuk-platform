/**
 * POST /api/admin/contributions/approve - Approve contribution and award full points
 */

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const { auth } = await import("@/lib/auth");
        const prisma = (await import("@/lib/prisma")).default;
        const { PointTransactionService } = await import("@/lib/services/point-transaction.service");
        const { StreakService } = await import("@/lib/services/streak.service");
        const { AchievementService } = await import("@/lib/services/achievement.service");

        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "กรุณาเข้าสู่ระบบก่อน" },
                { status: 401 }
            );
        }

        // Check admin role
        if (session.user.role !== "ADMIN") {
            return NextResponse.json(
                { message: "ไม่มีสิทธิ์เข้าถึง" },
                { status: 403 }
            );
        }

        const { contributionId, qualityRating } = await req.json();

        if (!contributionId) {
            return NextResponse.json(
                { message: "กรุณาระบุ ID ของการส่งผลงาน" },
                { status: 400 }
            );
        }

        // Get contribution
        const contribution = await prisma.contribution.findUnique({
            where: { id: contributionId },
            include: { user: true },
        });

        if (!contribution) {
            return NextResponse.json(
                { message: "ไม่พบผลงานนี้" },
                { status: 404 }
            );
        }

        if (contribution.status !== "PENDING") {
            return NextResponse.json(
                { message: "ผลงานนี้ได้รับการตรวจสอบแล้ว" },
                { status: 400 }
            );
        }

        const oldStatus = contribution.status;

        // Update contribution status and quality rating
        const updatedContribution = await prisma.contribution.update({
            where: { id: contributionId },
            data: {
                status: "APPROVED",
                qualityRating: qualityRating || 3,
            },
        });

        // Award points for status change
        await PointTransactionService.updateStatusChange(
            updatedContribution,
            oldStatus,
            "APPROVED",
            { qualityRating: qualityRating || 3 }
        );

        // Update streak and check achievements
        const streakResult = await StreakService.updateStreak(contribution.userId);
        const newAchievements = await AchievementService.checkAndAward(contribution.userId);

        // Update user's approved count
        await prisma.user.update({
            where: { id: contribution.userId },
            data: {
                approvedContributions: { increment: 1 },
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                message: "อนุมัติผลงานสำเร็จ",
                contribution: updatedContribution,
                streak: streakResult,
                newAchievements: newAchievements.map(a => a.badgeName),
            },
        });
    } catch (error) {
        console.error("Approve contribution error:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดในระบบ", error: String(error) },
            { status: 500 }
        );
    }
}
