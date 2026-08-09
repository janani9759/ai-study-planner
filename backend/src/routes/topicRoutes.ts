import { Router } from 'express';
import { getTopics, createTopic, updateTopic, deleteTopic } from '../controllers/topicController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getTopics);
router.post('/', authenticate, createTopic);
router.put('/:id', authenticate, updateTopic);
router.delete('/:id', authenticate, deleteTopic);

export default router;
