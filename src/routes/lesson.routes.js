const express = require('express');
const c = require("../controllers/lesson.controller");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const { allowRoles } = require("../middlewares/roles");
/**
 * @openapi
 * components:
 *   schemas:
 *     Lesson:
 *       type: object
 *       properties:
 *         lesson_id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Math"
 *     LessonCreate:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           example: "Math"
 */

/**
 * @openapi
 * /lessons:
 *   post:
 *     security: [{ bearerAuth: [] }]
 *     summary: Lesson yaratish
 *     tags: [Lessons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LessonCreate'
 *     responses:
 *       201:
 *         description: Yaratildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Xatolik
 */
router.post("/", authenticate, allowRoles("ADMIN"), c.create);

/**
 * @openapi
 * /lessons:
 *   get:
 *     summary: Lessons ro‘yxati
 *     tags: [Lessons]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 */
router.get("/", c.getAll);

/**
 * @openapi
 * /lessons/{id}:
 *   get:
 *     summary: Bitta lesson olish
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Topilmadi
 */
router.get("/:id", c.getOne);

/**
 * @openapi
 * /lessons/{id}:
 *   put:
 *     security: [{ bearerAuth: [] }]
 *     summary: Lesson yangilash    
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LessonCreate'
 *     responses:
 *       200:
 *         description: Yangilandi
 *       400:
 *         description: Xatolik
 */
router.put("/:id", authenticate, allowRoles("ADMIN"), c.update);

/**0
 * @openapi
 * /lessons/{id}:
 *   delete:
 *     security: [{ bearerAuth: [] }]
 *     summary: Lesson o‘chirish
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: O‘chirildi
 *       400:
 *         description: Xatolik
 */
router.delete("/:id", authenticate, allowRoles("ADMIN"), c.remove);

module.exports = router;