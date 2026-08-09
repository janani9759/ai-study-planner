import { Router } from 'express';
import {
  getAdminAnalytics,
  getAdminStudents,
  createStudentByAdmin,
  createDeptAdminByAdmin,
  getDeptAdmins,
  allocateDepartmentSchedule
} from '../controllers/adminController';
import { authenticate, requireAdmin, requireAdminOrDeptAdmin } from '../middleware/auth';

const router = Router();

router.get('/analytics', authenticate, requireAdminOrDeptAdmin, getAdminAnalytics);
router.get('/students', authenticate, requireAdminOrDeptAdmin, getAdminStudents);
router.post('/students', authenticate, requireAdminOrDeptAdmin, createStudentByAdmin);
router.post('/dept-admins', authenticate, requireAdmin, createDeptAdminByAdmin);
router.get('/dept-admins', authenticate, requireAdmin, getDeptAdmins);
router.post('/allocate-schedule', authenticate, requireAdminOrDeptAdmin, allocateDepartmentSchedule);

export default router;
