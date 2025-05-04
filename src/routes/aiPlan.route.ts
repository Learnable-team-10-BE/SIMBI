import { Router } from "express";
import AIPlanController from "../controllers/aiPlan.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: AI Study Plan
 *   description: AI-generated study plans using Gemini
 */

/**
 * @swagger
 * /api/ai/ask-simbi:
 *   post:
 *     summary: Generate a personalized AI study plan
 *     tags: [AI Study Plan]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - educationLevel
 *               - learningStyle
 *               - subject
 *               - goals
 *             properties:
 *               educationLevel:
 *                 type: string
 *                 example: "Secondary School"
 *               learningStyle:
 *                 type: string
 *                 example: "Visual"
 *               subject:
 *                 type: string
 *                 example: "Mathematics"
 *               goals:
 *                 type: string
 *                 example: "Improve exam scores and understand algebra"
 *     responses:
 *       200:
 *         description: Successfully generated AI study plan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "AI-generated study plan"
 *                 plan:
 *                   type: string
 *                   example: "1. Review algebra basics... 2. Watch Khan Academy videos..."
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to generate AI study plan
 */

// Protected AI plan generation route
router.post("/ask-simbi", authMiddleware, AIPlanController.generate);

export default router;

