import { Router } from 'express';
import { getExams, createExam, updateExam, deleteExam } from '../controllers/examController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getExams);
router.post('/', authenticate, createExam);
router.put('/:id', authenticate, updateExam);
router.delete('/:id', authenticate, deleteExam);

export default router;
