import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabase } from '../config/supabase';
import { dataStore } from '../services/dataStore';

export const loginUser = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, role } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email or College ID is required' });
    }

    // 1. Attempt Supabase Auth login
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (!authError && authData?.user) {
        const found = dataStore.findUserById(authData.user.id);
        const user = found || {
          id: authData.user.id,
          email: authData.user.email || email,
          role: (role as any) || 'STUDENT',
          full_name: email.split('@')[0].toUpperCase(),
          college_id: 'ID-SUPABASE',
          department: 'General Science',
          year: '1st Year',
          semester: 'Semester 1'
        };
        const token = authData.session?.access_token || `user-token-${user.id}`;
        const { student } = dataStore.getStudentMe(user.id);
        return res.status(200).json({ token, user, student });
      }
    } catch (e) {}

    // 2. DataStore credentials lookup (email, college_id, or default profiles)
    const user = dataStore.verifyLoginCredentials(email, password, role);

    if (user) {
      const token = user.role === 'ADMIN' ? 'admin-demo-token' : `user-token-${user.id}`;
      const { student } = dataStore.getStudentMe(user.id);
      return res.status(200).json({ token, user, student });
    }

    return res.status(401).json({ error: 'Invalid email or password. Please verify your credentials or ask your Admin to create your account.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login failed' });
  }
};

export const syncProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { email, full_name, college_id, department, year, semester, role } = req.body;
    const userId = req.user?.id || req.body.id;

    if (!userId || !email) {
      return res.status(400).json({ error: 'User ID and email are required' });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email,
        full_name: full_name || 'Student',
        college_id: college_id || 'ID-PENDING',
        department: department || 'General Science',
        year: year || 'Final Year',
        semester: semester || 'Semester 8',
        role: role || 'STUDENT',
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.warn('Database sync warning (using response payload):', error.message);
      return res.status(200).json({
        profile: {
          id: userId,
          email,
          full_name,
          college_id,
          department,
          year,
          semester,
          role: role || 'STUDENT'
        }
      });
    }

    return res.status(200).json({ profile });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Profile sync failed' });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }
    res.status(200).json({ user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
