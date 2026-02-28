require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
    const rooms = await prisma.rooms.createMany({
        data: [
            { floor: 1, room_number: "101", type: 1 },
            { floor: 1, room_number: "102", type: 1 },
            { floor: 1, room_number: "103", type: 2 },
            { floor: 2, room_number: "201", type: 1 },
            { floor: 2, room_number: "202", type: 1 },
            { floor: 2, room_number: "203", type: 2 },
            { floor: 3, room_number: "301", type: 1 },
            { floor: 3, room_number: "302", type: 2 },
            { floor: 3, room_number: "303", type: 1 },
            { floor: 4, room_number: "401", type: 2 },
        ],
    });
    console.log(`✅ Rooms: ${rooms.count} ta yaratildi`);

    // --- TEACHERS ---
    const teachers = await prisma.techers.createMany({
        data: [
            { first_name: "Anvar", last_name: "Karimov" },
            { first_name: "Dilnoza", last_name: "Usmanova" },
            { first_name: "Bobur", last_name: "Rahimov" },
            { first_name: "Gulnora", last_name: "Saidova" },
            { first_name: "Rustam", last_name: "Toshmatov" },
            { first_name: "Shahlo", last_name: "Nazarova" },
            { first_name: "Jasur", last_name: "Aliyev" },
            { first_name: "Madina", last_name: "Ismoilova" },
        ],
    });
    console.log(`✅ Teachers: ${teachers.count} ta yaratildi`);

    // --- LESSONS ---
    const lessons = await prisma.lessons.createMany({
        data: [
            { title: "Matematika" },
            { title: "Fizika" },
            { title: "Informatika" },
            { title: "Ingliz tili" },
            { title: "Tarix" },
            { title: "Kimyo" },
            { title: "Biologiya" },
            { title: "Ona tili" },
            { title: "Adabiyot" },
            { title: "Jismoniy tarbiya" },
        ],
    });
    console.log(`✅ Lessons: ${lessons.count} ta yaratildi`);

    // --- GROUPS ---
    const groups = await prisma.groups.createMany({
        data: [
            { group_number: 101, course_number: 1 },
            { group_number: 102, course_number: 1 },
            { group_number: 201, course_number: 2 },
            { group_number: 202, course_number: 2 },
            { group_number: 301, course_number: 3 },
            { group_number: 302, course_number: 3 },
            { group_number: 401, course_number: 4 },
            { group_number: 402, course_number: 4 },
        ],
    });
    console.log(`✅ Groups: ${groups.count} ta yaratildi`);

    console.log("\n🎉 Seed muvaffaqiyatli yakunlandi!");
}

main()
    .catch((e) => {
        console.error("❌ Seed xatolik:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
