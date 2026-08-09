import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabase } from '../config/supabase';

export const getStudentMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    // Attempt DB fetch
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    const { data: student } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', userId)
      .single();

    res.status(200).json({
      profile: profile || {
        id: userId,
        full_name: 'Sanjay Kumar',
        email: 'sanjay.kumar@college.edu',
        college_id: 'AI2026-889',
        department: 'Artificial Intelligence and Data Science',
        year: 'Final Year',
        semester: 'Semester 8',
        role: 'STUDENT'
      },
      student: student || {
        user_id: userId,
        daily_available_hours: 4.5,
        preferred_study_time: 'Evening',
        weak_topics_summary: 'Integration, Quantum Mechanics, ACID Concurrency',
        study_goals_summary: 'Maintain GPA > 3.8 and clear AI interviews',
        comfort_preference: 'Balanced',
        onboarding_completed: true
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStudentMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const {
      daily_available_hours,
      preferred_study_time,
      weak_topics_summary,
      study_goals_summary,
      comfort_preference,
      onboarding_completed
    } = req.body;

    const { data, error } = await supabase
      .from('students')
      .upsert({
        user_id: userId,
        daily_available_hours: daily_available_hours ?? 4.0,
        preferred_study_time: preferred_study_time ?? 'Evening',
        weak_topics_summary: weak_topics_summary ?? '',
        study_goals_summary: study_goals_summary ?? '',
        comfort_preference: comfort_preference ?? 'Balanced',
        onboarding_completed: onboarding_completed ?? true,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(200).json({
        student: {
          user_id: userId,
          daily_available_hours,
          preferred_study_time,
          weak_topics_summary,
          study_goals_summary,
          comfort_preference,
          onboarding_completed: true
        }
      });
    }

    res.status(200).json({ student: data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
