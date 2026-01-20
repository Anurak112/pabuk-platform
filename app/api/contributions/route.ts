import { NextRequest, NextResponse } from "next/server";

// Dynamic route - skip static generation
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        // Lazy load prisma and auth to avoid build-time database connections
        const { auth } = await import("@/lib/auth");
        const prisma = (await import("@/lib/prisma")).default;

        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "กรุณาเข้าสู่ระบบก่อน" },
                { status: 401 }
            );
        }

        const { type, category, provinceId, title, titleTh, content, dialect } = await req.json();

        // Validate required fields
        if (!type || !category || !provinceId || !titleTh) {
            return NextResponse.json(
                { message: "กรุณากรอกข้อมูลให้ครบถ้วน" },
                { status: 400 }
            );
        }

        // Create contribution
        const contribution = await prisma.contribution.create({
            data: {
                type,
                category,
                provinceId,
                title: title || titleTh,
                titleTh,
                content,
                dialect,
                status: "PENDING",
                userId: session.user.id,
            },
        });

        return NextResponse.json(
            { message: "ส่งข้อมูลสำเร็จ รอการตรวจสอบ", id: contribution.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Contribution error:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดในระบบ" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        // Lazy load prisma to avoid build-time database connections
        const prisma = (await import("@/lib/prisma")).default;

        const { searchParams } = new URL(req.url);
        const provinceId = searchParams.get("provinceId");
        const type = searchParams.get("type");
        const status = searchParams.get("status") || "APPROVED";
        const limit = parseInt(searchParams.get("limit") || "20");
        const offset = parseInt(searchParams.get("offset") || "0");

        const where: Record<string, unknown> = { status };
        if (provinceId) where.provinceId = provinceId;
        if (type) where.type = type;

        const [contributions, total] = await Promise.all([
            prisma.contribution.findMany({
                where,
                include: {
                    province: true,
                    user: {
                        select: { name: true, image: true },
                    },
                },
                orderBy: { createdAt: "desc" },
                take: limit,
                skip: offset,
            }),
            prisma.contribution.count({ where }),
        ]);

        return NextResponse.json({ contributions, total });
    } catch (error) {
        console.error("Get contributions error:", error);
        return NextResponse.json(
            { contributions: [], total: 0, message: "Database not connected" },
            { status: 200 }
        );
    }
}
