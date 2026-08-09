import { Router } from 'express';
import { saveBrainDump, getBrainDumps } from '../controllers/brainDumpController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, saveBrainDump);
router.get('/', authenticate, getBrainDumps);

export default router;
