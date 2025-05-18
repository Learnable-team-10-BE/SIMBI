import express from 'express';
import { getTokenBalance } from '../controllers/user.controller';
import authenticate from '../middlewares/auth.middleware';

const router = express.Router();
/**
 * @swagger
/user/balance:
  get:
    tags:
      - User
    security:
      - bearerAuth: []
    responses:
      200:
        description: Successfully retrieved balance
        content:
          application/json:
            schema:
              type: object
              properties:
                success:
                  type: boolean
                data:
                  type: object
                  properties:
                    balance:
                      type: string
                    wallet:
                      type: string
                    currency:
                      type: string
      401:
        description: Unauthorized
      404:
        description: User not found
           */
// Protected balance endpoint
router.get('/balance', authenticate, getTokenBalance);

export default router;