const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const teachers = await prisma.techers.findMany();
    const rooms = await prisma.rooms.findMany();
    const currs = await prisma.curriculum.findMany({ include: { specialization: true } });

    console.log(`Teachers: ${teachers.length}`);
    console.log(`Rooms: ${rooms.length}`);
    console.log('\nCurricula:');
    currs.forEach(c => {
        console.log(`- Spec: ${c.specialization?.name || 'General'}, Sem: ${c.semester}, Lesson: ${c.lesson_id}, Times: ${c.times_per_week}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
