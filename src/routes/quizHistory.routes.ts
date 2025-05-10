import { Router } from "express";
import {
  getQuizHistoryByIdHandler,
  getTotalQuizHistoryHandler,
} from "../controllers/quizHistory.controller";
const router = Router();

router.get("/history", getTotalQuizHistoryHandler);
/**
 * @swagger
 * /api/quiz/history:
 *   get:
 *     summary: Get total quiz history
 *     tags: [Quiz History]
 *     responses:
 *       200:
 *         description: Quiz history retrieved successfully
 *       400:
 *         description: User ID is required
 *       500:
 *         description: Internal server error
 */
router.get("/history/:quizId", getQuizHistoryByIdHandler);
/**
 * @swagger
 * /api/quiz/history/{quizId}:
 *   get:
 *     summary: Get quiz history by ID
 *     tags: [Quiz History]
 *     parameters:
 *       - name: quizId
 *         in: path
 *         required: true
 *         description: The ID of the quiz
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quiz history retrieved successfully
 *       400:
 *         description: Invalid quiz ID or user ID is required
 *       500:
 *         description: Internal server error
 */

export default router;
