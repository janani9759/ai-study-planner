import { Router } from 'express';
import { getProgress } from '../controllers/progressController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getProgress);

export default router;
