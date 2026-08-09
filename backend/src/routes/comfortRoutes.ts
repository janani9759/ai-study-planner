import { Router } from 'express';
import { submitComfortCheck, getComfortHistory } from '../controllers/comfortController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, submitComfortCheck);
router.get('/', authenticate, getComfortHistory);

export default router;
