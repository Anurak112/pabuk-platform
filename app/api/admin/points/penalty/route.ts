/**
 * POST /api/admin/points/penalty - Apply penalty
 */

import { NextRequest, NextResponse } from "next/server";
import { TransactionType } from "@/app/generated/prisma";

export const dynamic = "force-dynamic";

const PENALTY_TYPES: Record<string, TransactionType> = {
    spam: TransactionType.PENALTY_SPAM,
    duplicate: TransactionType.PENALTY_DUPLICATE,
    low_quality: TransactionType.PENALTY_LOW_QUALITY,
};

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

        const { userId, penaltyType, amount, reason, contributionId } = await req.json();

        if (!userId || !penaltyType || !amount || !reason) {
            return NextResponse.json(
                { message: "กรุณากรอกข้อมูลให้ครบถ้วน" },
                { status: 400 }
            );
        }

        const transactionType = PENALTY_TYPES[penaltyType];
        if (!transactionType) {
            return NextResponse.json(
                { message: "ประเภทบทลงโทษไม่ถูกต้อง" },
                { status: 400 }
            );
        }

        const { PointTransactionService } = await import(
            "@/lib/services/point-transaction.service"
        );

        const transaction = await PointTransactionService.applyPenalty(
            userId,
            transactionType,
            amount,
            `[Admin: ${session.user.id}] ${reason}`,
            contributionId
        );

        return NextResponse.json({
            success: true,
            data: {
                transaction,
                message: `บทลงโทษ -${Math.abs(amount)} แต้ม สำเร็จ`,
            },
        });
    } catch (error) {
        console.error("Admin penalty error:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดในระบบ", error: String(error) },
            { status: 500 }
        );
    }
}
