import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { dataStore } from '../services/dataStore';

export const getGoals = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
    const goals = dataStore.getGoals(userId);
    res.status(200).json(goals);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
    const newGoal = dataStore.createGoal(userId, req.body);
    res.status(201).json(newGoal);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateGoal = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updated = dataStore.updateGoal(id, req.body);
    res.status(200).json(updated || { id, ...req.body });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteGoal = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    dataStore.deleteGoal(id);
    res.status(200).json({ message: 'Goal deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
