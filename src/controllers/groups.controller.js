const prisma = require('../prisma');

const getAll = async (req, res) => {
    try {
        const groups = await prisma.groups.findMany({
            include: { specialization: true }
        });
        res.json(groups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getOne = async (req, res) => {
    try {
        const group_id = parseInt(req.params.id);
        const group = await prisma.groups.findUnique({
            where: { group_id }
        });
        res.json(group);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const create = async (req, res) => {
    try {
        const { group_number, course_number, semester, specialization_id } = req.body;
        const group = await prisma.groups.create({
            data: {
                group_number,
                course_number,
                semester: semester ? Number(semester) : 1,
                specialization_id: specialization_id ? Number(specialization_id) : null
            }
        });
        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const update = async (req, res) => {
    try {
        const group_id = parseInt(req.params.id);
        const { group_number, course_number, semester, specialization_id } = req.body;
        const group = await prisma.groups.update({
            where: { group_id },
            data: {
                group_number,
                course_number,
                semester: semester ? Number(semester) : undefined,
                specialization_id: specialization_id !== undefined ? (specialization_id ? Number(specialization_id) : null) : undefined
            }
        });
        res.json(group);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const remove = async (req, res) => {
    try {
        const group_id = parseInt(req.params.id);
        const group = await prisma.groups.delete({
            where: { group_id }
        });
        res.json(group);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getAll, getOne, create, update, remove };