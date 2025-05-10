import { Router } from "express";
import { getQuizHistoryHandler } from "../controllers/quizHistory.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Quiz History
 *   description: Quiz history management API
 */

/**
 * @swagger
 * /api/quiz-history/{userId}/history:
 *   get:
 *     summary: Get quiz history for a user
 *     tags: [Quiz History]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: Quiz history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quiz'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/:userId/history", getQuizHistoryHandler);

export default router;