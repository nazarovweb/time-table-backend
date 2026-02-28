const router = require("express").Router();
const c = require("../controllers/academic.controller");
const { authenticate } = require("../middlewares/auth");
const { allowRoles } = require("../middlewares/roles");

// Admin huquqi kerak
router.use(authenticate, allowRoles("ADMIN"));

/**
 * @openapi
 * /academic/specializations:
 *   get:
 *     summary: Barcha yo'nalishlarni olish
 *     tags: [Academic]
 *   post:
 *     summary: Yangi yo'nalish yaratish
 *     tags: [Academic]
 */
router.get("/specializations", c.getSpecializations);
router.post("/specializations", c.createSpecialization);

/**
 * @openapi
 * /academic/curriculum:
 *   get:
 *     summary: O'quv rejasini olish
 *     tags: [Academic]
 *   put:
 *     summary: O'quv rejasini yangilash yoki yaratish (upsert)
 *     tags: [Academic]
 */
router.get("/curriculum", c.getCurriculum);
router.put("/curriculum", c.updateCurriculum);

/**
 * @openapi
 * /academic/generate:
 *   post:
 *     summary: Jadvalni avtomatik generatsiya qilish
 *     tags: [Academic]
 */
router.post("/generate", c.generateTimetable);

module.exports = router;
