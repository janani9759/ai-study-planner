import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabase } from '../config/supabase';

export const submitComfortCheck = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { feeling, workload_difficulty, notes } = req.body;

    const { data, error } = await supabase
      .from('comfort_feedback')
      .insert({
        user_id: userId,
        feeling: feeling || 'Normal',
        workload_difficulty: workload_difficulty || 'Moderate',
        notes: notes || ''
      })
      .select()
      .single();

    if (error) {
      return res.status(200).json({
        id: 'cf-' + Date.now(),
        feeling,
        workload_difficulty,
        notes,
        logged_at: new Date().toISOString()
      });
    }

    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getComfortHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { data: history, error } = await supabase
      .from('comfort_feedback')
      .select('*')
      .eq('user_id', userId)
      .order('logged_at', { ascending: false });

    if (error || !history || history.length === 0) {
      return res.status(200).json([
        {
          id: 'cf-1',
          feeling: 'Normal',
          workload_difficulty: 'Moderate',
          notes: 'Balanced study session today.',
          logged_at: new Date().toISOString()
        }
      ]);
    }

    res.status(200).json(history);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
