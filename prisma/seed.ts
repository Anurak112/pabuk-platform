import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding Pabuk.ai database...");

    // Create pilot provinces
    const provinces = await Promise.all([
        prisma.province.upsert({
            where: { nameEn: "Bangkok" },
            update: {},
            create: {
                nameEn: "Bangkok",
                nameTh: "กรุงเทพมหานคร",
                region: "CENTRAL",
                description: "Capital city of Thailand, cultural and economic hub",
            },
        }),
        prisma.province.upsert({
            where: { nameEn: "Chiang Mai" },
            update: {},
            create: {
                nameEn: "Chiang Mai",
                nameTh: "เชียงใหม่",
                region: "NORTH",
                description: "Northern cultural capital, home to Lanna traditions",
            },
        }),
        prisma.province.upsert({
            where: { nameEn: "Nakhon Si Thammarat" },
            update: {},
            create: {
                nameEn: "Nakhon Si Thammarat",
                nameTh: "นครศรีธรรมราช",
                region: "SOUTH",
                description: "Southern province with rich Buddhist heritage",
            },
        }),
        prisma.province.upsert({
            where: { nameEn: "Chaiyaphum" },
            update: {},
            create: {
                nameEn: "Chaiyaphum",
                nameTh: "ชัยภูมิ",
                region: "NORTHEAST",
                description: "Northeastern province known for Siam tulip fields and Pha Hin Ngam national park",
            },
        }),
    ]);

    console.log(`✅ Created ${provinces.length} pilot provinces`);

    // Create sample tags
    const tags = await Promise.all([
        prisma.tag.upsert({
            where: { name: "folklore" },
            update: {},
            create: { name: "folklore", nameTh: "นิทานพื้นบ้าน" },
        }),
        prisma.tag.upsert({
            where: { name: "proverb" },
            update: {},
            create: { name: "proverb", nameTh: "สุภาษิต" },
        }),
        prisma.tag.upsert({
            where: { name: "dialect" },
            update: {},
            create: { name: "dialect", nameTh: "ภาษาถิ่น" },
        }),
        prisma.tag.upsert({
            where: { name: "festival" },
            update: {},
            create: { name: "festival", nameTh: "เทศกาล" },
        }),
    ]);

    console.log(`✅ Created ${tags.length} tags`);

    console.log("🎉 Seeding complete!");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
