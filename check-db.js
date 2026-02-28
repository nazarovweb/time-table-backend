const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const schedules = await prisma.schedule.findMany({
        include: { group: true, lesson: true }
    });
    console.log(`Total schedules: ${schedules.length}`);
    schedules.forEach(s => {
        console.log(`- Day ${s.day_of_week}, Order ${s.lesson_order}: Group ${s.group.group_number} - ${s.lesson.title}`);
    });

    const groups = await prisma.groups.findMany();
    console.log('\nGroups:');
    groups.forEach(g => {
        console.log(`ID: ${g.group_id}, Num: ${g.group_number}, Course: ${g.course_number}, Sem: ${g.semester}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
