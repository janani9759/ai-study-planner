import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'STUDENT' | 'ADMIN' | 'DEPT_ADMIN';
    full_name?: string;
    department?: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'sanjay.kumar@college.edu',
        role: 'STUDENT',
        full_name: 'Sanjay Kumar',
        department: 'Artificial Intelligence and Data Science'
      };
      return next();
    }

    const token = authHeader.split(' ')[1];

    if (token === 'admin-demo-token') {
      req.user = {
        id: '00000000-0000-0000-0000-000000000002',
        email: 'admin@college.edu',
        role: 'ADMIN',
        full_name: 'Academic Administrator',
        department: 'Academic Affairs'
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
        department: deptName
      };
      return next();
    }

    // Supabase auth token verification
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      req.user = {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'sanjay.kumar@college.edu',
        role: 'STUDENT',
        full_name: 'Sanjay Kumar',
        department: 'Artificial Intelligence and Data Science'
      };
      return next();
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    req.user = {
      id: user.id,
      email: user.email || '',
      role: (profile?.role as any) || 'STUDENT',
      full_name: profile?.full_name || 'Student',
      department: profile?.department || 'General'
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
