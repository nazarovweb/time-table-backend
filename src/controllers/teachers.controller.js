const prisma = require("../prisma");

const getTeachers = async (req, res) => {
    try {
        const teachers = await prisma.techers.findMany();
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getTeacherById = async (req, res) => {
    try {
        const teacher = await prisma.techers.findUnique({ where: { teacher_id: Number(req.params.id) } });
        res.json(teacher);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const createTeacher = async (req, res) => {
    try {
        const teacher = await prisma.techers.create({ data: req.body });
        res.json(teacher);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateTeacher = async (req, res) => {
    try {
        const teacher = await prisma.techers.update({ where: { teacher_id: Number(req.params.id) }, data: req.body });
        res.json(teacher);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteTeacher = async (req, res) => {
    try {
        const teacher = await prisma.techers.delete({ where: { teacher_id: Number(req.params.id) } });
        res.json(teacher);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getTeachers, getTeacherById, createTeacher, updateTeacher, deleteTeacher };