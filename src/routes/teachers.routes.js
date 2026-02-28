const express = require('express');
const c = require("../controllers/teachers.controller");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const { allowRoles } = require("../middlewares/roles");
/**
 * @openapi
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       properties:
 *         teacher_id:
 *           type: integer
 *           example: 1
 *         full_name:
 *           type: string
 *           example: "Alijon Valiyev"
 *         department:
 *           type: string
 *           example: "Informatika"
 *         position:
 *           type: string
 *           example: "Dotsent"
 *     TeacherCreate:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *       properties:
 *         first_name:
 *           type: string
 *           example: "Alijon"
 *         last_name:
 *           type: string
 *           example: "Valiyev"
 */

/**
 * @openapi
 * /teachers:
 *   post:
 *     security: [{ bearerAuth: [] }]
 *     summary: Teacher yaratish
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeacherCreate'
 *     responses:
 *       201:
 *         description: Yaratildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       400:
 *         description: Xatolik
 */
router.post("/", authenticate, allowRoles("ADMIN"), c.createTeacher);

/**
 * @openapi
 * /teachers:
 *   get:
 *     summary: Teacherlar ro‘yxati
 *     tags: [Teachers]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teacher'
 */
router.get("/", c.getTeachers);

/**
 * @openapi
 * /teachers/{id}:
 *   get:
 *     summary: Bitta teacher olish
 *     tags: [Teachers]
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
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Topilmadi
 */
router.get("/:id",c.getTeacherById);

/**
 * @openapi
 * /teachers/{id}:
 *   put:
 *     security: [{ bearerAuth: [] }]
 *     summary: Teacher yangilash
 *     tags: [Teachers]
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
 *             $ref: '#/components/schemas/TeacherCreate'
 *     responses:
 *       200:
 *         description: Yangilandi
 *       400:
 *         description: Xatolik
 */
router.put("/:id", authenticate, allowRoles("ADMIN"), c.updateTeacher);

/**
 * @openapi
 * /teachers/{id}:
 *   delete:
 *     security: [{ bearerAuth: [] }]
 *     summary: Teacher o‘chirish
 *     tags: [Teachers]
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
router.delete("/:id", authenticate, allowRoles("ADMIN"), c.deleteTeacher);

module.exports = router;

