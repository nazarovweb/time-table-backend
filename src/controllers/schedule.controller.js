const prisma = require("../prisma");

const includeAll = {
    group: true,
    teacher: true,
    lesson: true,
    room: true,
};

// ─── Conflict tekshiruvi ──────────────────────────────────────────────────────
async function checkConflicts(day_of_week, lesson_order, { teacher_id, group_id, room_id }, excludeId = null) {
    const conflicts = [];

    // O'qituvchi konflikti
    const teacherConflict = await prisma.schedule.findFirst({
        where: {
            teacher_id: Number(teacher_id),
            day_of_week: Number(day_of_week),
            lesson_order: Number(lesson_order),
            ...(excludeId ? { NOT: { schedule_id: Number(excludeId) } } : {})
        },
        include: { group: true, lesson: true }
    });
    if (teacherConflict) {
        conflicts.push({
            type: "teacher",
            message: `O'qituvchi shu vaqtda allaqachon "${teacherConflict.lesson.title}" darsida (${teacherConflict.group.course_number}-kurs, ${teacherConflict.group.group_number}-guruh)`
        });
    }

    // Guruh konflikti
    const groupConflict = await prisma.schedule.findFirst({
        where: {
            group_id: Number(group_id),
            day_of_week: Number(day_of_week),
            lesson_order: Number(lesson_order),
            ...(excludeId ? { NOT: { schedule_id: Number(excludeId) } } : {})
        },
        include: { lesson: true, teacher: true }
    });
    if (groupConflict) {
        conflicts.push({
            type: "group",
            message: `Guruhda shu vaqtda allaqachon "${groupConflict.lesson.title}" darsi bor (${groupConflict.teacher.first_name} ${groupConflict.teacher.last_name})`
        });
    }

    // Xona konflikti
    const roomConflict = await prisma.schedule.findFirst({
        where: {
            room_id: Number(room_id),
            day_of_week: Number(day_of_week),
            lesson_order: Number(lesson_order),
            ...(excludeId ? { NOT: { schedule_id: Number(excludeId) } } : {})
        },
        include: { group: true, lesson: true, teacher: true }
    });
    if (roomConflict) {
        conflicts.push({
            type: "room",
            message: `Xona shu vaqtda band: "${roomConflict.lesson.title}" (${roomConflict.teacher.first_name} ${roomConflict.teacher.last_name}, ${roomConflict.group.course_number}-kurs ${roomConflict.group.group_number}-guruh)`
        });
    }

    return conflicts;
}

// ─── GET Barcha hafta — guruh bo'yicha ───────────────────────────────────────
const getWeekByGroup = async (req, res) => {
    try {
        const { group_id } = req.params;
        const schedule = await prisma.schedule.findMany({
            where: { group_id: Number(group_id) },
            include: includeAll,
            orderBy: [{ day_of_week: "asc" }, { lesson_order: "asc" }]
        });
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ─── GET Barcha hafta — o'qituvchi bo'yicha ──────────────────────────────────
const getWeekByTeacher = async (req, res) => {
    try {
        const { teacher_id } = req.params;
        const schedule = await prisma.schedule.findMany({
            where: { teacher_id: Number(teacher_id) },
            include: includeAll,
            orderBy: [{ day_of_week: "asc" }, { lesson_order: "asc" }]
        });
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const { group_id, lesson_id, teacher_id, room_id, day_of_week, lesson_order } = req.body;

        const conflicts = await checkConflicts(day_of_week, lesson_order, { teacher_id, group_id, room_id });
        if (conflicts.length > 0) {
            return res.status(409).json({ error: "Jadval ziddiyati", conflicts });
        }

        const schedule = await prisma.schedule.create({
            data: { group_id, lesson_id, teacher_id, room_id, day_of_week, lesson_order },
            include: includeAll
        });
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const schedule = await prisma.schedule.findMany({ include: includeAll });
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const schedule = await prisma.schedule.findUnique({
            where: { schedule_id: Number(id) },
            include: includeAll
        });
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getByGroup = async (req, res) => {
    try {
        const { group_id, day_of_week } = req.params;
        const schedule = await prisma.schedule.findMany({
            where: { group_id: Number(group_id), day_of_week: Number(day_of_week) },
            include: includeAll,
            orderBy: { lesson_order: "asc" }
        });
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getByTeacher = async (req, res) => {
    try {
        const { teacher_id, day_of_week } = req.params;
        const schedule = await prisma.schedule.findMany({
            where: { teacher_id: Number(teacher_id), day_of_week: Number(day_of_week) },
            include: includeAll,
            orderBy: { lesson_order: "asc" }
        });
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getByRoom = async (req, res) => {
    try {
        const { room_id, day_of_week } = req.params;
        const schedule = await prisma.schedule.findMany({
            where: { room_id: Number(room_id), day_of_week: Number(day_of_week) },
            include: includeAll,
            orderBy: { lesson_order: "asc" }
        });
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ─── UPDATE — conflict tekshiruvi bilan ──────────────────────────────────────
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { group_id, lesson_id, teacher_id, room_id, day_of_week, lesson_order } = req.body;

        // Mavjud schedule ni olish (o'zini tekshirishdan chiqarish uchun)
        const existing = await prisma.schedule.findUnique({
            where: { schedule_id: Number(id) }
        });
        if (!existing) return res.status(404).json({ error: "Jadval topilmadi" });

        const finalTeacher = teacher_id ?? existing.teacher_id;
        const finalGroup = group_id ?? existing.group_id;
        const finalRoom = room_id ?? existing.room_id;
        const finalDay = day_of_week ?? existing.day_of_week;
        const finalOrder = lesson_order ?? existing.lesson_order;

        const conflicts = await checkConflicts(
            finalDay, finalOrder,
            { teacher_id: finalTeacher, group_id: finalGroup, room_id: finalRoom },
            id
        );

        if (conflicts.length > 0) {
            return res.status(409).json({ error: "Jadval ziddiyati", conflicts });
        }

        const schedule = await prisma.schedule.update({
            where: { schedule_id: Number(id) },
            data: {
                group_id: finalGroup,
                lesson_id: lesson_id ?? existing.lesson_id,
                teacher_id: finalTeacher,
                room_id: finalRoom,
                day_of_week: finalDay,
                lesson_order: finalOrder
            },
            include: includeAll
        });
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const schedule = await prisma.schedule.delete({
            where: { schedule_id: Number(id) }
        });
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    create, getAll, getOne,
    getByGroup, getByTeacher, getByRoom,
    getWeekByGroup, getWeekByTeacher,
    update, remove
};