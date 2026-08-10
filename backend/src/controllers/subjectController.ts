import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { dataStore } from '../services/dataStore';

export const getSubjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
    const subjects = dataStore.getSubjects(userId);
    res.status(200).json(subjects);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createSubject = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
    const newSub = dataStore.createSubject(userId, req.body);
    res.status(201).json(newSub);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSubject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updated = dataStore.updateSubject(id, req.body);
    res.status(200).json(updated || { id, ...req.body });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteSubject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    dataStore.deleteSubject(id);
    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
