/**
 * GET /api/achievements/user - Get user's achievements
 * POST /api/achievements/check - Check for new achievements
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

        const { AchievementService } = await import(
            "@/lib/services/achievement.service"
        );

        const achievements = await AchievementService.getUserAchievements(
            session.user.id
        );

        return NextResponse.json({
            success: true,
            data: achievements,
        });
    } catch (error) {
        console.error("Get achievements error:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดในระบบ", error: String(error) },
            { status: 500 }
        );
    }
}

export async function POST() {
    try {
        const { auth } = await import("@/lib/auth");
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "กรุณาเข้าสู่ระบบก่อน" },
                { status: 401 }
            );
        }

        const { AchievementService } = await import(
            "@/lib/services/achievement.service"
        );

        const newAchievements = await AchievementService.checkAndAward(
            session.user.id
        );

        return NextResponse.json({
            success: true,
            data: {
                newAchievements,
                count: newAchievements.length,
            },
        });
    } catch (error) {
        console.error("Check achievements error:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดในระบบ", error: String(error) },
            { status: 500 }
        );
    }
}
