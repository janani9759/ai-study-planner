import { Router } from 'express';
import { generatePlan, getPlanTasks, updateTaskStatus, rescheduleMissed } from '../controllers/plannerController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/generate', authenticate, generatePlan);
router.get('/tasks', authenticate, getPlanTasks);
router.put('/tasks/:id', authenticate, updateTaskStatus);
router.post('/reschedule', authenticate, rescheduleMissed);

export default router;
