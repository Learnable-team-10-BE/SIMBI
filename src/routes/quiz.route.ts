
/**
 * @swagger
 * components:
 *   schemas:
 *     Quiz:
 *       type: object
 *       required:
 *         - userId
 *         - topic
 *         - academicLevel
 *         - difficulty
 *         - numberOfQuestions
 *         - questions
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the quiz
 *         userId:
 *           type: string
 *           description: The id of the user who created the quiz
 *         topic:
 *           type: string
 *           description: The topic of the quiz
 *         academicLevel:
 *           type: string
 *           enum: [secondary school, university, personal development]
 *           description: The academic level of the quiz
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *           description: The difficulty level of the quiz
 *         numberOfQuestions:
 *           type: number
 *           description: The number of questions in the quiz
 *         duration:
 *           type: number
 *           description: The duration of the quiz in minutes
 *         questions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               correct_answer:
 *                 type: string
 *         answers:
 *           type: array
 *           items:
 *             type: string
 *         progress:
 *           type: number
 *           description: The progress of the quiz (0 to 1)
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

import { Router } from "express";
import { generateQuizHandler, submitAnswerHandler,
    getQuizHandler, getProgressHandler
 } from "../controllers/quiz.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.post("/generate", generateQuizHandler);
router.post('/:quizId/answer', submitAnswerHandler);

/**
 * @swagger
 * /api/quiz/{quizId}:
 *   get:
 *     summary: Get a quiz by ID
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         schema:
 *           type: string
 *         required: true
 *         description: The quiz id
 *     responses:
 *       200:
 *         description: Quiz retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.get('/:quizId', getQuizHandler);

/**
 * @swagger
 * /api/quiz/{quizId}/progress:
 *   get:
 *     summary: Get quiz progress
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         schema:
 *           type: string
 *         required: true
 *         description: The quiz id
 *     responses:
 *       200:
 *         description: Progress retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 progress:
 *                   type: number
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.get('/:quizId/progress', getProgressHandler);

export default router;