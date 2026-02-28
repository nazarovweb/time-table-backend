const express = require('express');
const c = require("../controllers/groups.controller");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const { allowRoles } = require("../middlewares/roles");
/**
 * @openapi
 * components:
 *   schemas:
 *     Group:
 *       type: object
 *       properties:
 *         group_id:
 *           type: integer
 *           example: 1
 *         group_number:
 *           type: integer
 *           example: 101
 *         course_number:
 *           type: integer
 *           example: 1
 *     GroupCreate:
 *       type: object
 *       required:
 *         - group_number
 *         - course_number
 *       properties:
 *         group_number:
 *           type: integer
 *           example: 101
 *         course_number:
 *           type: integer
 *           example: 1
 */

/**
 * @openapi
 * /groups:
 *   post:
 *     security: [{ bearerAuth: [] }]   
 *     summary: Group yaratish
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GroupCreate'
 *     responses:
 *       201:
 *         description: Yaratildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       400:
 *         description: Xatolik
 */
router.post("/", authenticate, allowRoles("ADMIN"), c.create);

/**
 * @openapi
 * /groups:
 *   get:
 *     summary: Groups ro‘yxati
 *     tags: [Groups]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Group'
 */
router.get("/", c.getAll);

/**
 * @openapi
 * /groups/{id}:
 *   get:
 *     summary: Bitta group olish
 *     tags: [Groups]
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
 *               $ref: '#/components/schemas/Group'
 *       404:
 *         description: Topilmadi
 */
router.get("/:id", c.getOne);

/**
 * @openapi
 * /groups/{id}:
 *   put:
 *     security: [{ bearerAuth: [] }]
 *     summary: Group yangilash
 *     tags: [Groups]
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
 *             $ref: '#/components/schemas/GroupCreate'
 *     responses:
 *       200:
 *         description: Yangilandi
 *       400:
 *         description: Xatolik
 */
router.put("/:id", authenticate, allowRoles("ADMIN"), c.update);

/**
 * @openapi
 * /groups/{id}:
 *   delete:
 *     security: [{ bearerAuth: [] }]
 *     summary: Group o‘chirish
 *     tags: [Groups]
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
