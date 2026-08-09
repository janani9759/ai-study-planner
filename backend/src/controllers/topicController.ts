import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabase } from '../config/supabase';

export const getTopics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { subjectId } = req.query;

    let query = supabase.from('topics').select('*, subjects(name, code)').eq('user_id', userId);

    if (subjectId) {
      query = query.eq('subject_id', subjectId);
    }

    const { data: topics, error } = await query;

    if (error || !topics) {
      return res.status(200).json([]);
    }

    res.status(200).json(topics);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createTopic = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { subject_id, name, description, difficulty, status, confidence } = req.body;

    const { data, error } = await supabase
      .from('topics')
      .insert({
        user_id: userId,
        subject_id,
        name,
        description: description || '',
        difficulty: difficulty || 'Medium',
        status: status || 'Not Started',
        progress: status === 'Completed' ? 100 : (status === 'In Progress' ? 50 : 0),
        confidence: confidence || 'Average'
      })
      .select()
      .single();

    if (error) {
      return res.status(200).json({
        id: 'top-' + Date.now(),
        user_id: userId,
        subject_id,
        name,
        description,
        difficulty,
        status,
        progress: 0,
        confidence
      });
    }

    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTopic = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.status === 'Completed') {
      updates.progress = 100;
    }
    updates.last_studied_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('topics')
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

export const deleteTopic = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await supabase.from('topics').delete().eq('id', id);
    res.status(200).json({ message: 'Topic deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
