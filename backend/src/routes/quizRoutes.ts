import { Router } from 'express';
import { saveQuizResult, getQuizResults } from '../controllers/quizController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/results', authenticate, saveQuizResult);
router.get('/results', authenticate, getQuizResults);

export default router;
