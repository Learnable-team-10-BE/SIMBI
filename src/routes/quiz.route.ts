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
    getQuizHandler, getProgressHandler, getQuizScoreHandler, retakeQuizHandler
 } from "../controllers/quiz.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

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
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *               - academicLevel
 *               - difficulty
 *               - numberOfQuestions
 *             properties:
 *               topic:
 *                 type: string
 *                 description: The topic of the quiz
 *               academicLevel:
 *                 type: string
 *                 enum: [secondary, university, personal development]
 *                 description: The academic level of the quiz
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 description: The difficulty level of the quiz
 *               numberOfQuestions:
 *                 type: number
 *                 description: The number of questions in the quiz
 *               duration:
 *                 type: number
 *                 description: The duration of the quiz in minutes
 *     responses:
 *       201:
 *         description: Quiz generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/generate", authMiddleware, generateQuizHandler);

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
 *                 description: The index of the question being answered
 *               answer:
 *                 type: string
 *                 description: The user's answer
 *     responses:
 *       200:
 *         description: Answer submitted successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.post('/:quizId/answer', authMiddleware, submitAnswerHandler);

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
router.get('/:quizId', authMiddleware, getQuizHandler);

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
router.get('/:quizId/progress', authMiddleware, getProgressHandler);

/**
 * @swagger
 * /api/quiz/{quizId}/score:
 *   get:
 *     summary: Get quiz score
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
 *         description: Score retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 score:
 *                   type: number
 *                 totalQuestions:
 *                   type: number
 *                 correctAnswers:
 *                   type: number
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.get('/:quizId/score', authMiddleware, getQuizScoreHandler);

/**
 * @swagger
 * /api/quiz/{quizId}/retake:
 *   post:
 *     summary: Retake a quiz
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
 *         description: Quiz retaken successfully
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
router.post('/:quizId/retake', authMiddleware, retakeQuizHandler);

export default router;