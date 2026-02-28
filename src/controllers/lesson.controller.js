const prisma = require("../prisma");

const create = async (req, res) => {
    try {
        const { title } = req.body;
        const lesson = await prisma.lessons.create({
            data: { title }
        });
        res.json(lesson);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const lessons = await prisma.lessons.findMany();
        res.json(lessons);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = await prisma.lessons.findUnique({
            where: { lesson_id: Number(id) }
        });
        res.json(lesson);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const lesson = await prisma.lessons.update({
            where: { lesson_id: Number(id) },
            data: { title }
        });
        res.json(lesson);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = await prisma.lessons.delete({
            where: { lesson_id: Number(id) }
        });
        res.json(lesson);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { create, getAll, getOne, update, remove };