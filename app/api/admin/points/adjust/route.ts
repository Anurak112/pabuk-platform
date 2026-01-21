/**
 * POST /api/admin/points/adjust - Manual point adjustment
 */

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const { auth } = await import("@/lib/auth");
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

        const { userId, amount, reason } = await req.json();

        if (!userId || amount === undefined || !reason) {
            return NextResponse.json(
                { message: "กรุณากรอกข้อมูลให้ครบถ้วน" },
                { status: 400 }
            );
        }

        const { PointTransactionService } = await import(
            "@/lib/services/point-transaction.service"
        );

        const transaction = await PointTransactionService.adminAdjust(
            userId,
            amount,
            reason,
            session.user.id
        );

        return NextResponse.json({
            success: true,
            data: {
                transaction,
                message: `ปรับแต้ม ${amount > 0 ? "+" : ""}${amount} สำเร็จ`,
            },
        });
    } catch (error) {
        console.error("Admin adjust error:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดในระบบ", error: String(error) },
            { status: 500 }
        );
    }
}
