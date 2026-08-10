import { Router } from 'express';
import { syncProfile, getCurrentUser, loginUser } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/login', loginUser);
router.post('/profile', authenticate, syncProfile);
router.get('/me', authenticate, getCurrentUser);

export default router;
