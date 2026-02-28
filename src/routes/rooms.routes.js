const express = require('express');
const c = require("../controllers/rooms.controller");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const { allowRoles } = require("../middlewares/roles");
/**
 * @openapi
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       properties:
 *         room_id:
 *           type: integer
 *           example: 1
 *         floor:
 *           type: integer
 *           example: 2
 *         room_number:
 *           type: string
 *           example: "201"
 *         type:
 *           type: integer
 *           example: 1
 *     RoomCreate:
 *       type: object
 *       required:
 *         - floor
 *         - room_number
 *         - type
 *       properties:
 *         floor:
 *           type: integer
 *           example: 2
 *         room_number:
 *           type: string
 *           example: "201"
 *         type:
 *           type: integer
 *           example: 1
 */

/**
 * @openapi
 * /rooms:
 *   post:
 *     security: [{ bearerAuth: [] }]
 *     summary: Room yaratish
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoomCreate'
 *     responses:
 *       201:
 *         description: Yaratildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       400:
 *         description: Xatolik
 */
router.post("/", authenticate, allowRoles("ADMIN"), c.create);

/**
 * @openapi
 * /rooms:
 *   get:
 *     summary: Roomlar ro‘yxati
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 */
router.get("/", c.getAll);

/**
 * @openapi
 * /rooms/{id}:
 *   get:
 *     summary: Bitta room olish
 *     tags: [Rooms]
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
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Topilmadi
 */
router.get("/:id", c.getOne);

/**
 * @openapi
 * /rooms/{id}:
 *   put:
 *     security: [{ bearerAuth: [] }]
 *     summary: Room yangilash
 *     tags: [Rooms]
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
 *             $ref: '#/components/schemas/RoomCreate'
 *     responses:
 *       200:
 *         description: Yangilandi
 *       400:
 *         description: Xatolik
 */
router.put("/:id", authenticate, allowRoles("ADMIN"), c.update);

/**
 * @openapi
 * /rooms/{id}:
 *   delete:
 *     security: [{ bearerAuth: [] }]
 *     summary: Room o‘chirish
 *     tags: [Rooms]
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
