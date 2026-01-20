import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { name, email, provinceId } = await req.json();

        // Validate required fields
        if (!name || !email || !provinceId) {
            return NextResponse.json(
                { message: "กรุณากรอกข้อมูลให้ครบถ้วน" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "อีเมลนี้ถูกใช้งานแล้ว" },
                { status: 409 }
            );
        }

        // Create new user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                provinceId,
                role: "CONTRIBUTOR",
            },
        });

        return NextResponse.json(
            { message: "สมัครสมาชิกสำเร็จ", userId: user.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดในระบบ" },
            { status: 500 }
        );
    }
}
