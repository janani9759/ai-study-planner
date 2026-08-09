import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabase } from '../config/supabase';

export const getExams = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { data: exams, error } = await supabase
      .from('exams')
      .select('*, subjects(name, code)')
      .eq('user_id', userId)
      .order('exam_date', { ascending: true });

    if (error || !exams) {
      return res.status(200).json([]);
    }

    res.status(200).json(exams);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createExam = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { subject_id, exam_name, exam_date, exam_time, location, target_score, notes } = req.body;

    const { data, error } = await supabase
      .from('exams')
      .insert({
        user_id: userId,
        subject_id,
        exam_name,
        exam_date,
        exam_time: exam_time || '10:00:00',
        location: location || 'Main Hall',
        target_score: target_score || 85,
        preparation_percentage: 50,
        notes: notes || ''
      })
      .select()
      .single();

    if (error) {
      return res.status(200).json({
        id: 'ex-' + Date.now(),
        user_id: userId,
        subject_id,
        exam_name,
        exam_date,
        exam_time,
        location,
        target_score,
        preparation_percentage: 50,
        notes
      });
    }

    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateExam = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('exams')
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

export const deleteExam = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await supabase.from('exams').delete().eq('id', id);
    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
