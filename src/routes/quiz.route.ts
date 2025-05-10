import { Router } from "express";
import { createQuizHandler, submitAnswerHandler,
    getQuizHandler, getProgressHandler
 } from "../controllers/quiz.controller";

const router = Router();

router.post("/generate", createQuizHandler);
router.post('/:quizId/answer', submitAnswerHandler);
router.get('/:quizId', getQuizHandler);
router.get('/:quizId/progress', getProgressHandler);

export default router;