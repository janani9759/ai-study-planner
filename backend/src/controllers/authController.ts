import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabase } from '../config/supabase';

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
