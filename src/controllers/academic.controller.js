const prisma = require("../prisma");

// ─── Specializations ─────────────────────────────────────────────────────────
const getSpecializations = async (req, res) => {
    try {
        const specs = await prisma.specializations.findMany();
        res.json(specs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createSpecialization = async (req, res) => {
    try {
        const { name, description } = req.body;
        const spec = await prisma.specializations.create({ data: { name, description } });
        res.json(spec);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ─── Curriculum ──────────────────────────────────────────────────────────────
const getCurriculum = async (req, res) => {
    try {
        const { specialization_id, semester } = req.query;
        const where = {};
        if (specialization_id) where.specialization_id = Number(specialization_id);
        if (semester) where.semester = Number(semester);

        const curricula = await prisma.curriculum.findMany({
            where,
            include: { lesson: true, specialization: true }
        });
        res.json(curricula);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCurriculum = async (req, res) => {
    try {
        const { specialization_id, semester, lesson_id, times_per_week } = req.body;

        const curriculum = await prisma.curriculum.upsert({
            where: {
                specialization_id_semester_lesson_id: {
                    specialization_id: Number(specialization_id),
                    semester: Number(semester),
                    lesson_id: Number(lesson_id)
                }
            },
            update: { times_per_week: Number(times_per_week) },
            create: {
                specialization_id: Number(specialization_id),
                semester: Number(semester),
                lesson_id: Number(lesson_id),
                times_per_week: Number(times_per_week)
            }
        });
        res.json(curriculum);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ─── Auto Generator Algoritmi ────────────────────────────────────────────────
const generateTimetable = async (req, res) => {
    try {
        const { finalize = false } = req.body;

        const allGroups = await prisma.groups.findMany({
            include: { specialization: true }
        });
        const allTeachers = await prisma.techers.findMany();
        const allRooms = await prisma.rooms.findMany();

        let newSchedule = [];
        let logs = [];

        // Common specialization ID ni topish
        const commonSpec = await prisma.specializations.findFirst({
            where: { name: { contains: 'Common', mode: 'insensitive' } }
        }) || await prisma.specializations.findFirst({
            where: { name: { contains: '1kurs', mode: 'insensitive' } }
        });

        for (const group of allGroups) {
            let curriculum = await prisma.curriculum.findMany({
                where: { specialization_id: group.specialization_id || -1, semester: group.semester },
                include: { lesson: true }
            });

            // Fallback to Common/1kurs if nothing found for specific spec
            if (curriculum.length === 0 && commonSpec) {
                curriculum = await prisma.curriculum.findMany({
                    where: { specialization_id: commonSpec.specialization_id, semester: group.semester },
                    include: { lesson: true }
                });
            }

            if (curriculum.length === 0) {
                logs.push(`Guruh ${group.group_number}: Semestr ${group.semester} uchun o'quv rejasi topilmadi.`);
                continue;
            }

            for (const item of curriculum) {
                for (let i = 0; i < item.times_per_week; i++) {
                    const slot = findAvailableSlot(
                        group, item.lesson_id, allTeachers, allRooms, newSchedule
                    );
                    if (slot) {
                        newSchedule.push(slot);
                    } else {
                        logs.push(`Guruh ${group.group_number}: "${item.lesson.title}" uchun bo'sh slot (o'qituvchi/xona) topilmadi.`);
                    }
                }
            }
        }

        if (finalize) {
            await prisma.$transaction([
                prisma.schedule.deleteMany({}),
                prisma.schedule.createMany({ data: newSchedule })
            ]);
            return res.json({ success: true, count: newSchedule.length, logs });
        }

        res.json({ preview: newSchedule, count: newSchedule.length, logs });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

function findAvailableSlot(group, lesson_id, teachers, rooms, currentSchedule) {
    // Randomize days and orders to distribute more evenly
    const days = [1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
    const orders = [1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5);

    for (const day of days) {
        for (const order of orders) {
            // 1. Group check
            const groupBusy = currentSchedule.find(s =>
                s.group_id === group.group_id && s.day_of_week === day && s.lesson_order === order
            );
            if (groupBusy) continue;

            // 2. Teacher check (randomized teacher selection)
            const availableTeachers = teachers.filter(t => {
                const busy = currentSchedule.find(s =>
                    s.teacher_id === t.teacher_id && s.day_of_week === day && s.lesson_order === order
                );
                return !busy;
            });
            if (availableTeachers.length === 0) continue;
            const teacher = availableTeachers[Math.floor(Math.random() * availableTeachers.length)];

            // 3. Room check
            const availableRooms = rooms.filter(r => {
                const busy = currentSchedule.find(s =>
                    s.room_id === r.room_id && s.day_of_week === day && s.lesson_order === order
                );
                return !busy;
            });
            if (availableRooms.length === 0) continue;
            const room = availableRooms[Math.floor(Math.random() * availableRooms.length)];

            return {
                group_id: group.group_id,
                teacher_id: teacher.teacher_id,
                lesson_id: lesson_id,
                room_id: room.room_id,
                day_of_week: day,
                lesson_order: order
            };
        }
    }
    return null;
}

module.exports = {
    getSpecializations, createSpecialization,
    getCurriculum, updateCurriculum,
    generateTimetable
};
