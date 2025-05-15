import { Router } from 'express';
import * as noteController from '../controllers/studyNote.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Study Notes
 *   description: Endpoints for managing study session notes
 */

/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Create a note for a study session
 *     tags: [Study Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *               - content
 *             properties:
 *               sessionId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Note created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, noteController.createNote);

/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     summary: Update a note by ID
 *     tags: [Study Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Note ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', authMiddleware, noteController.updateNote);

/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     summary: Delete a note by ID
 *     tags: [Study Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Note ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Note deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authMiddleware, noteController.deleteNote);

/**
 * @swagger
 * /notes/{sessionId}:
 *   get:
 *     summary: Get all notes for a specific study session
 *     tags: [Study Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         description: Study session ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       401:
 *         description: Unauthorized
 */
router.get('/:sessionId', authMiddleware, noteController.getSessionNotes);

export default router;

