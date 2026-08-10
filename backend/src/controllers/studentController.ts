import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { dataStore } from '../services/dataStore';

export const getStudentMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
    const data = dataStore.getStudentMe(userId);
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStudentMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
    const updated = dataStore.updateStudentMe(userId, req.body);
    res.status(200).json({ student: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
