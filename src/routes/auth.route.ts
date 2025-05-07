import { Router } from 'express';
import { register, verify, login } from '../controllers/auth.controller';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *           properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200: 
 *         description: Registration successful
 *       400:
 *         description: Invalid input or email already registered
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/verify:
 *   post:
 *     summary: Verify user email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - verificationToken
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               verificationToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid token or email not found
 */
router.post('/verify', verify);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user and update streak
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *           properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               currentStreak: 
 *                 type: number 
 *                 default: 0 
 *               longestStreak: 
 *                 type: number
 *                 default: 0  
 *     responses:
 *       200:
 *         description: Login successfully. Streak potentially updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials or email not verified
 */
router.post('/login', login);

export default router;