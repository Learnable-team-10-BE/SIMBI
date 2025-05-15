import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import * as resourceController from '../controllers/studyResource.controller';
import authMiddleware from '../middlewares/auth.middleware';

const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.png', '.jpg', '.jpeg', '.mp3', '.mp4'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error('Invalid file type') as any, false);
    }
    cb(null, true);
  },
});


const router = Router();

/**
 * @swagger
 * tags:
 *   name: Study Resources
 *   description: Endpoints for uploading and retrieving study session resources
 */

/**
 * @swagger
 * /resources:
 *   post:
 *     summary: Upload a study resource for a session
 *     tags: [Study Resources]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *               - title
 *               - format
 *               - file
 *             properties:
 *               sessionId:
 *                 type: string
 *               title:
 *                 type: string
 *               format:
 *                 type: string
 *                 enum: [pdf, png, jpg, mp3, mp4]
 *               url:
 *                 type: string
 *                 description: Optional external URL for the resource
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Resource uploaded successfully
 *       400:
 *         description: Invalid file type or size
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, upload.single('file'), resourceController.uploadResource);

/**
 * @swagger
 * /resources/{sessionId}:
 *   get:
 *     summary: Get all uploaded resources for a study session
 *     tags: [Study Resources]
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
 *         description: List of resources
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Resource'
 *       401:
 *         description: Unauthorized
 */
router.get('/:sessionId', authMiddleware, resourceController.getSessionResources);

export default router;

