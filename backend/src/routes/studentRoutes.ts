import { Router } from 'express';
import { getStudentMe, updateStudentMe } from '../controllers/studentController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/me', authenticate, getStudentMe);
router.put('/me', authenticate, updateStudentMe);

export default router;
