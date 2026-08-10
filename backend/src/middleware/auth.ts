import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { dataStore, UserProfileData } from '../services/dataStore';

export interface AuthRequest extends Request {
  user?: UserProfileData;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const defaultUser = dataStore.findUserById('00000000-0000-0000-0000-000000000001');
      req.user = defaultUser || {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'sanjay.kumar@college.edu',
        role: 'STUDENT',
        full_name: 'Sanjay Kumar',
        college_id: 'AI2026-889',
        department: 'Artificial Intelligence and Data Science',
        year: 'Final Year',
        semester: 'Semester 8'
      };
      return next();
    }

    const token = authHeader.split(' ')[1];

    if (token === 'admin-demo-token') {
      const adminUser = dataStore.findUserById('00000000-0000-0000-0000-000000000002');
      req.user = adminUser || {
        id: '00000000-0000-0000-0000-000000000002',
        email: 'admin@college.edu',
        role: 'ADMIN',
        full_name: 'Academic Administrator',
        college_id: 'ADM-001',
        department: 'Academic Affairs',
        year: 'Faculty',
        semester: 'N/A'
      };
      return next();
    }

    if (token.startsWith('dept-admin-token-')) {
      const deptName = decodeURIComponent(token.replace('dept-admin-token-', ''));
      req.user = {
        id: 'dept-admin-' + Date.now(),
        email: `deptadmin.${deptName.toLowerCase().replace(/\s+/g, '')}@college.edu`,
        role: 'DEPT_ADMIN',
        full_name: `${deptName} Head`,
        college_id: `DEPT-${deptName.slice(0, 3).toUpperCase()}-01`,
        department: deptName,
        year: 'Faculty Head',
        semester: 'N/A'
      };
      return next();
    }

    if (token.startsWith('user-token-')) {
      const userId = token.replace('user-token-', '');
      const found = dataStore.findUserById(userId);
      if (found) {
        req.user = found;
        return next();
      }
    }

    // Attempt Supabase lookup if token is a valid Supabase JWT or email
    const { data: { user } } = await supabase.auth.getUser(token).catch(() => ({ data: { user: null }, error: true }));

    if (user) {
      const foundInStore = dataStore.findUserById(user.id);
      req.user = foundInStore || {
        id: user.id,
        email: user.email || '',
        role: 'STUDENT',
        full_name: 'Student',
        college_id: 'ID-GENERIC',
        department: 'General Science',
        year: '1st Year',
        semester: 'Semester 1'
      };
      return next();
    }

    // Default fallback to Sanjay Kumar
    const defaultUser = dataStore.findUserById('00000000-0000-0000-0000-000000000001');
    req.user = defaultUser || {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'sanjay.kumar@college.edu',
      role: 'STUDENT',
      full_name: 'Sanjay Kumar',
      college_id: 'AI2026-889',
      department: 'Artificial Intelligence and Data Science',
      year: 'Final Year',
      semester: 'Semester 8'
    };
    next();
  } catch (err) {
    console.error('Authentication Middleware Error:', err);
    res.status(401).json({ error: 'Unauthorized authentication request' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied. Global Administrative privilege required.' });
  }
  next();
};

export const requireAdminOrDeptAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'DEPT_ADMIN')) {
    return res.status(403).json({ error: 'Access denied. Administrative privilege required.' });
  }
  next();
};
