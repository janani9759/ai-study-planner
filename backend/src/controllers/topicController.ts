import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { dataStore } from '../services/dataStore';

export const getTopics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
    const { subjectId } = req.query;
    const topics = dataStore.getTopics(userId, subjectId ? String(subjectId) : undefined);
    res.status(200).json(topics);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createTopic = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
    const newTopic = dataStore.createTopic(userId, req.body);
    res.status(201).json(newTopic);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTopic = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updated = dataStore.updateTopic(id, req.body);
    res.status(200).json(updated || { id, ...req.body });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTopic = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    dataStore.deleteTopic(id);
    res.status(200).json({ message: 'Topic deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
