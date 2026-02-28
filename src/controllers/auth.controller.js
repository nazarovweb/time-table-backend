const prisma = require("../prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signToken = (user) => {
    return jwt.sign(
        { userId: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await prisma.users.findMany();
        res.json(users);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};
// POST /auth/register
exports.register = async (req, res) => {
    try {
        const { full_name, email, password, role } = req.body;

        const exists = await prisma.users.findUnique({ where: { email } });
        if (exists) return res.status(409).json({ error: "Email band" });

        const hash = await bcrypt.hash(password, 10);

        const user = await prisma.users.create({
            data: {
                full_name,
                email,
                password: hash,
                // role ni hozircha faqat admin yaratadi degan qoidani keyin qo‘yamiz,
                // o‘rganish uchun qoldirdim:
                role: role || "STUDENT",
            },
        });

        const token = signToken(user);

        res.status(201).json({
            token,
            user: { user_id: user.user_id, full_name: user.full_name, email: user.email, role: user.role },
        });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

// POST /auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ error: "Email yoki parol xato" });

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ error: "Email yoki parol xato" });

        const token = signToken(user);

        res.json({
            token,
            user: { user_id: user.user_id, full_name: user.full_name, email: user.email, role: user.role },
        });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};