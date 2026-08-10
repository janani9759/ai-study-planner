import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { dataStore } from '../services/dataStore';

export const getExams = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
    const exams = dataStore.getExams(userId);
    res.status(200).json(exams);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createExam = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
    const newExam = dataStore.createExam(userId, req.body);
    res.status(201).json(newExam);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateExam = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updated = dataStore.updateExam(id, req.body);
    res.status(200).json(updated || { id, ...req.body });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteExam = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    dataStore.deleteExam(id);
    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
