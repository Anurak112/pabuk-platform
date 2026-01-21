/**
 * GET /api/streaks/current - Get current streak info
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

        const { StreakService } = await import("@/lib/services/streak.service");

        const status = await StreakService.getStreakStatus(session.user.id);

        return NextResponse.json({
            success: true,
            data: status,
        });
    } catch (error) {
        console.error("Get streak error:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดในระบบ", error: String(error) },
            { status: 500 }
        );
    }
}
