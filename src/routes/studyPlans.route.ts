import { Router } from 'express';
import StudySessionController from '../controllers/studyPlan.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Study Sessions
 *   description: Endpoints to manage study sessions
 */

// Apply the authentication middleware to all study session routes
router.use(authMiddleware);

/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Create a new study session
 *     tags: [Study Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - topic
 *               - date
 *               - time
 *               - duration
 *             properties:
 *               subject:
 *                 type: string
 *               topic:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *               duration:
 *                 type: number
 *     responses:
 *       201:
 *         description: Study session created successfully
 */
router.post('/sessions', StudySessionController.createSession);

/**
 * @swagger
 * /sessions:
 *   get:
 *     summary: Get all study sessions for the user
 *     tags: [Study Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Optional filter by session status
 *     responses:
 *       200:
 *         description: A list of study sessions
 */
router.get('/sessions', StudySessionController.getUserSessions);

/**
 * @swagger
 * /sessions/{id}:
 *   get:
 *     summary: Get a specific study session by ID
 *     tags: [Study Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The session ID
 *     responses:
 *       200:
 *         description: Study session retrieved successfully
 */
router.get('/sessions/:id', StudySessionController.getSessionById);

/**
 * @swagger
 * /sessions/{id}:
 *   put:
 *     summary: Update a specific study session by ID
 *     tags: [Study Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The session ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               topic:
 *                 type: string
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *               duration:
 *                 type: number
 *     responses:
 *       200:
 *         description: Study session updated successfully
 */
router.put('/sessions/:id', StudySessionController.updateSession);

/**
 * @swagger
 * /sessions/{id}:
 *   delete:
 *     summary: Delete a specific study session by ID
 *     tags: [Study Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The session ID
 *     responses:
 *       200:
 *         description: Study session deleted successfully
 */
router.delete('/sessions/:id', StudySessionController.deleteSession);

export default router;

