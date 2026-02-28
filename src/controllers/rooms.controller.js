const prisma = require('../prisma');

const getAll = async (req, res) => {
    try {
        const rooms = await prisma.rooms.findMany();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getOne = async (req, res) => {
    try {
        const room_id = parseInt(req.params.id);
        const room = await prisma.rooms.findUnique({
            where: { room_id }
        });
        res.json(room);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const create = async (req, res) => {
    try {
        const { floor, room_number, type } = req.body;
        const room = await prisma.rooms.create({
            data: { floor, room_number, type }
        });
        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const update = async (req, res) => {
    try {
        const room_id = parseInt(req.params.id);
        const { floor, room_number, type } = req.body;
        const room = await prisma.rooms.update({
            where: { room_id },
            data: { floor, room_number, type }
        });
        res.json(room);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const remove = async (req, res) => {
    try {
        const room_id = parseInt(req.params.id);
        const room = await prisma.rooms.delete({
            where: { room_id }
        });
        res.json(room);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getAll, getOne, create, update, remove };