import { Router } from "express";
import {
  startSession,
  pauseSession,
  resumeSession,
  completeSession,
} from "../controllers/studySession.controller";
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Study Sessions
 *   description: Manage live study sessions
 */

router.use(authMiddleware);

/**
 * @swagger
 * /api/sessions/start/{sessionId}:
 *   post:
 *     summary: Start an existing study session
 *     tags: [Study Sessions]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the session to start
 *     responses:
 *       200:
 *         description: Session started successfully
 *       400:
 *         description: Session not found or already active
 */
router.post("/start/:sessionId", startSession);

/**
 * @swagger
 * /api/sessions/pause/{sessionId}:
 *   post:
 *     summary: Pause an active study session
 *     tags: [Study Sessions]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the session to pause
 *     responses:
 *       200:
 *         description: Session paused successfully
 *       400:
 *         description: Session not active or not found
 */
router.post("/pause/:sessionId", pauseSession);

/**
 * @swagger
 * /api/sessions/resume/{sessionId}:
 *   post:
 *     summary: Resume a paused study session
 *     tags: [Study Sessions]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the session to resume
 *     responses:
 *       200:
 *         description: Session resumed successfully
 *       400:
 *         description: Session not paused or not found
 */
router.post("/resume/:sessionId", resumeSession);

/**
 * @swagger
 * /api/sessions/complete/{sessionId}:
 *   post:
 *     summary: Complete a study session
 *     tags: [Study Sessions]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the session to complete
 *     responses:
 *       200:
 *         description: Session completed successfully
 *       400:
 *         description: Session not in progress or not found
 */
router.post("/complete/:sessionId", completeSession);

export default router;

