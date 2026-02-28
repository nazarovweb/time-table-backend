const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // 1. Get Specializations
    const commonSpec = await prisma.specializations.findFirst({
        where: { name: { contains: '1kurs', mode: 'insensitive' } }
    });
    const frontend = await prisma.specializations.findFirst({
        where: { name: { contains: 'Frontend', mode: 'insensitive' } }
    });

    // 2. Fix Semester/Course mapping
    const groups = await prisma.groups.findMany();
    for (const group of groups) {
        let expectedSemester = 1;
        if (group.course_number === 2) expectedSemester = 3;
        if (group.course_number === 3) expectedSemester = 5;
        if (group.course_number === 4) expectedSemester = 7;

        await prisma.groups.update({
            where: { group_id: group.group_id },
            data: { semester: expectedSemester }
        });
        console.log(`Updated Group ${group.group_number} -> Sem ${expectedSemester}`);
    }

    // 3. Create baseline curricula for Sem 3, 5, 7 to avoid empty results
    const lessons = await prisma.lessons.findMany();
    const semesters = [3, 5, 7];

    for (const sem of semesters) {
        // Just add 2-3 lessons per semester to common spec or frontend
        if (lessons.length >= 3) {
            for (let i = 0; i < 3; i++) {
                await prisma.curriculum.upsert({
                    where: {
                        specialization_id_semester_lesson_id: {
                            specialization_id: commonSpec.specialization_id,
                            semester: sem,
                            lesson_id: lessons[i].lesson_id
                        }
                    },
                    update: {},
                    create: {
                        specialization_id: commonSpec.specialization_id,
                        semester: sem,
                        lesson_id: lessons[i].lesson_id,
                        times_per_week: 2
                    }
                });
            }
        }
    }

    // 4. Trigger Re-generation
    const academicController = require('./src/controllers/academic.controller');
    const req = { body: { finalize: true } };
    const resMock = {
        json: (data) => console.log(`\nGeneration complete. Total: ${data.count}`),
        status: () => ({ json: () => { } })
    };
    await academicController.generateTimetable(req, resMock);
}

main().catch(console.error).finally(() => prisma.$disconnect());
