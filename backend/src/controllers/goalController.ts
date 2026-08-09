import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabase } from '../config/supabase';

export const getGoals = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { data: goals, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('target_date', { ascending: true });

    if (error || !goals) {
      return res.status(200).json([]);
    }

    res.status(200).json(goals);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { title, description, target_date, target_value } = req.body;

    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: userId,
        title,
        description: description || '',
        target_date,
        target_value: target_value || 100,
        current_value: 0,
        status: 'Active'
      })
      .select()
      .single();

    if (error) {
      return res.status(200).json({
        id: 'g-' + Date.now(),
        title,
        description,
        target_date,
        target_value: target_value || 100,
        current_value: 0,
        status: 'Active'
      });
    }

    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateGoal = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.current_value >= updates.target_value) {
      updates.status = 'Completed';
    }

    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(200).json({ id, ...updates });
    }

    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteGoal = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await supabase.from('goals').delete().eq('id', id);
    res.status(200).json({ message: 'Goal deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
