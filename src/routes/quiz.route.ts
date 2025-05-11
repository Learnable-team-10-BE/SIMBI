
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
import { generateQuizHandler, submitAnswerHandler, getQuizHandler, getProgressHandler } from "../controllers/quiz.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

// Apply auth middleware to all quiz routes
router.use(authMiddleware);

/**
 * @swagger
 * /api/quiz/generate:
 *   post:
 *     summary: Generate a new quiz
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *               academicLevel:
 *                 type: string
 *                 enum: [secondary school, university, personal development]
 *               numberOfQuestions:
 *                 type: number
 *               duration:
 *                 type: number
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Quiz generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 quizId:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Quiz'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/generate", generateQuizHandler);

/**
 * @swagger
 * /api/quiz/{quizId}/answer:
 *   post:
 *     summary: Submit an answer for a quiz question
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionIndex
 *               - answer
 *             properties:
 *               questionIndex:
 *                 type: number
 *               answer:
 *                 type: string
 *     responses:
 *       200:
 *         description: Answer submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 progress:
 *                   type: number
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
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