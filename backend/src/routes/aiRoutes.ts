import { Router } from 'express';
import {
  handleBrainDumpAI,
  handleQuizAI,
  handleChatAI,
  handleExplainTopicAI,
  handleDailyRecommendation
} from '../controllers/aiController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/brain-dump', authenticate, handleBrainDumpAI);
router.post('/quiz', authenticate, handleQuizAI);
router.post('/chat', authenticate, handleChatAI);
router.post('/explain', authenticate, handleExplainTopicAI);
router.get('/recommendation', authenticate, handleDailyRecommendation);

export default router;
