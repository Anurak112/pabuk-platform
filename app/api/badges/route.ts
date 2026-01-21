/**
 * GET /api/badges - Get all badge definitions
 */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const { AchievementService } = await import(
            "@/lib/services/achievement.service"
        );

        const badges = await AchievementService.getAllBadges();

        return NextResponse.json({
            success: true,
            data: badges,
        });
    } catch (error) {
        console.error("Get badges error:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดในระบบ", error: String(error) },
            { status: 500 }
        );
    }
}
