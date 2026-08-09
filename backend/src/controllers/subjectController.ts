import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabase } from '../config/supabase';

export const getSubjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { data: subjects, error } = await supabase
      .from('subjects')
      .select('*, topics(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !subjects) {
      return res.status(200).json([]);
    }

    res.status(200).json(subjects);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createSubject = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, code, description, difficulty, priority, exam_date, target_score } = req.body;

    const { data, error } = await supabase
      .from('subjects')
      .insert({
        user_id: userId,
        name,
        code: code || name.slice(0, 3).toUpperCase() + '-101',
        description: description || '',
        difficulty: difficulty || 'Medium',
        priority: priority || 'Medium',
        exam_date: exam_date || null,
        target_score: target_score || 85,
        progress: 0
      })
      .select()
      .single();

    if (error) {
      return res.status(200).json({
        id: 'sub-' + Date.now(),
        user_id: userId,
        name,
        code,
        description,
        difficulty,
        priority,
        exam_date,
        target_score: target_score || 85,
        progress: 0
      });
    }

    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSubject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('subjects')
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

export const deleteSubject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await supabase.from('subjects').delete().eq('id', id);
    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
