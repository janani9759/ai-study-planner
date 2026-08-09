import { Router } from 'express';
import { getSubjects, createSubject, updateSubject, deleteSubject } from '../controllers/subjectController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getSubjects);
router.post('/', authenticate, createSubject);
router.put('/:id', authenticate, updateSubject);
router.delete('/:id', authenticate, deleteSubject);

export default router;
