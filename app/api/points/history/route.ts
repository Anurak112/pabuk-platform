/**
 * GET /api/points/history - Get user's point transaction history
 */

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const { auth } = await import("@/lib/auth");
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "กรุณาเข้าสู่ระบบก่อน" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "20");
        const offset = parseInt(searchParams.get("offset") || "0");
        const type = searchParams.get("type") || undefined;

        const { PointTransactionService } = await import(
            "@/lib/services/point-transaction.service"
        );

        const result = await PointTransactionService.getHistory(session.user.id, {
            limit,
            offset,
            type: type as any,
        });

        return NextResponse.json({
            success: true,
            data: {
                transactions: result.transactions,
                total: result.total,
                limit,
                offset,
            },
        });
    } catch (error) {
        console.error("Get point history error:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดในระบบ", error: String(error) },
            { status: 500 }
        );
    }
}
