import { Router } from 'express';
import { getGoals, createGoal, updateGoal, deleteGoal } from '../controllers/goalController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getGoals);
router.post('/', authenticate, createGoal);
router.put('/:id', authenticate, updateGoal);
router.delete('/:id', authenticate, deleteGoal);

export default router;
