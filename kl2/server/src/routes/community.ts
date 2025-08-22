import express from 'express';
import { getQuestions, createQuestion, getQuestion, answerQuestion, deleteQuestion } from '../controllers/communityController';
import { validateQuestion } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/questions', getQuestions);
router.post('/questions', authenticateToken, validateQuestion, createQuestion);
router.get('/questions/:id', getQuestion);
router.post('/questions/:id/answers', authenticateToken, answerQuestion);
router.delete('/questions/:id', authenticateToken, deleteQuestion);

export default router;
