import express from 'express';
import { getTokenBalance } from '../controllers/user.controller';
import authenticate from '../middlewares/auth.middleware';

const router = express.Router();

// Protected balance endpoint
router.get('/balance', authenticate, getTokenBalance);

export default router;