const express = require('express');
const c = require("../controllers/schedule.controller");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const { allowRoles } = require("../middlewares/roles");

/**
 * @openapi
 * components:
 *   schemas:
 *     Schedule:
 *       type: object
 *       properties:
 *         schedule_id:
 *           type: integer
 *           example: 1
 *         group_id:
 *           type: integer
 *           example: 1
 *         lesson_id:
 *           type: integer
 *           example: 1
 *         teacher_id:
 *           type: integer
 *           example: 1
 *         room_id:
 *           type: integer
 *           example: 1
 *         lesson_order:
 *           type: integer
 *           example: 1
 *     ScheduleCreate:
 *       type: object
 *       required:
 *         - group_id
 *         - lesson_id
 *         - teacher_id
 *         - room_id
 *         - lesson_order
 *       properties:
 *         group_id:
 *           type: integer
 *           example: 1
 *         lesson_id:
 *           type: integer
 *           example: 1
 *         teacher_id:
 *           type: integer
 *           example: 1
 *         room_id:
 *           type: integer
 *           example: 1
 *         day_of_week:
 *           type: integer
 *           example: 1 
 *         lesson_order:
 *           type: integer
 *           example: 1
 */


/**
 * @openapi
 * /schedule:
 *   post:
 *     security: [{ bearerAuth: [] }]
 *     summary: Jadval yaratish
 *     tags: [Schedule]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScheduleCreate'
 *     responses:
 *       201:
 *         description: Yaratildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       400:
 *         description: Xatolik
 */
router.post("/", authenticate, allowRoles("ADMIN"), c.create);

/**
 * @openapi
 * /schedule:
 *   get:
 *     summary: Jadval ro‘yxati
 *     tags: [Schedule]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 */
router.get("/", c.getAll);

/**
 * @openapi
 * /schedule/week/group/{group_id}:
 *   get:
 *     summary: Guruhning butun haftalik jadvali
 *     tags: [Schedule]
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/week/group/:group_id", c.getWeekByGroup);

/**
 * @openapi
 * /schedule/week/teacher/{teacher_id}:
 *   get:
 *     summary: O'qituvchining butun haftalik jadvali
 *     tags: [Schedule]
 *     parameters:
 *       - in: path
 *         name: teacher_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/week/teacher/:teacher_id", c.getWeekByTeacher);

/**
 * @openapi
 * /schedule/{id}:
 *   get:
 *     summary: Bitta jadval olish
 *     tags: [Schedule]
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
 *               $ref: '#/components/schemas/Schedule'
 *       404:
 *         description: Topilmadi
 */
router.get("/:id", c.getOne);

/**
 * @openapi
 * /schedule/group/{group_id}/{day_of_week}:
 *   get:
 *     summary: Guruh bo‘yicha jadval olish
 *     tags: [Schedule]
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: path
 *         name: day_of_week
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
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 *       404:
 *         description: Topilmadi
 */
router.get("/group/:group_id/:day_of_week", c.getByGroup);

/**
 * @openapi
 * /schedule/teacher/{teacher_id}/{day_of_week}:
 *   get:
 *     summary: O‘qituvchi bo‘yicha jadval olish
 *     tags: [Schedule]
 *     parameters:
 *       - in: path
 *         name: teacher_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: path
 *         name: day_of_week
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
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 *       404:
 *         description: Topilmadi
 */
router.get("/teacher/:teacher_id/:day_of_week", c.getByTeacher);

/**
 * @openapi
 * /schedule/room/{room_id}/{day_of_week}:
 *   get:
 *     summary: Xona bo‘yicha jadval olish
 *     tags: [Schedule]
 *     parameters:
 *       - in: path
 *         name: room_id
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
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 *       404:
 *         description: Topilmadi
 */
router.get("/room/:room_id/:day_of_week", c.getByRoom);

/**
 * @openapi
 * /schedule/{id}:
 *   put:
 *     security: [{ bearerAuth: [] }]
 *     summary: Jadvalni yangilash
 *     tags: [Schedule]
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
 *             $ref: '#/components/schemas/ScheduleCreate'
 *     responses:
 *       200:
 *         description: Yangilandi
 *       400:
 *         description: Xatolik
 */
router.put("/:id", authenticate, allowRoles("ADMIN"), c.update);

/**
 * @openapi
 * /schedule/{id}:
 *   delete:
 *     security: [{ bearerAuth: [] }]
 *     summary: Jadvalni o‘chirish
 *     tags: [Schedule]
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

