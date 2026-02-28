const router = require("express").Router();
const c = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth");
const { allowRoles } = require("../middlewares/roles");


/**
 * @openapi
 * components:
 *   schemas:
 *     Auth:
 *       type: object
 *       properties:
 *         full_name:
 *           type: string
 *           example: "Alijon Valiyev"
 *         email:
 *           type: string
 *           example: "example@gmail.com"
 *         password:
 *           type: string
 *           example: "admin"
 *         role:
 *           type: string
 *           example: "ADMIN"
 */


/**
 * @openapi
 * components:
 *   schemas:
 *     AuthLogin:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: "example@gmail.com"
 *         password:
 *           type: string
 *           example: "admin"
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Ro‘yxatdan o‘tish
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       201:
 *         description: Yaratildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auth'
 *       400:
 *         description: Xatolik
 */
router.post("/register", c.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Kirish
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLogin'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthLogin'
 *       400:
 *         description: Xatolik
 */
router.post("/login", c.login);

/**
 * @openapi
 * /auth/users:
 *   get:
 *     security: 
 *       - bearerAuth: []
 *     summary: Barcha foydalanuvchilarni olish
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Foydalanuvchilar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Auth'
 *       400:
 *         description: Xatolik
 */
router.get("/users", authenticate, allowRoles("ADMIN"), c.getAllUsers);

module.exports = router;