import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { geminiService } from '../services/geminiService';
import { dataStore } from '../services/dataStore';

export const generatePlan = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
    const { subjects, weakTopics, exams, dailyAvailableHours, preferredStudyTime, comfortFeeling, comfortDifficulty, goals } = req.body;

    const payload = {
      dailyAvailableHours: dailyAvailableHours || 4.0,
      preferredStudyTime: preferredStudyTime || 'Evening',
      comfortFeeling: comfortFeeling || 'Normal',
      comfortDifficulty: comfortDifficulty || 'Moderate',
      subjects: subjects || [],
      weakTopics: weakTopics || [],
      exams: exams || [],
      goals: goals || []
    };

    // Call Gemini API server-side
    const aiResult = await geminiService.generateStudyPlan(payload);

    // Save study plan in DataStore & DB
    dataStore.saveAIPlanTasks(userId, aiResult);

    res.status(200).json(aiResult);
  } catch (err: any) {
    console.error('Planner Error:', err);
    res.status(500).json({ error: 'Failed to generate study plan: ' + err.message });
  }
};

export const getPlanTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
    const tasks = dataStore.getTasks(userId);
    res.status(200).json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = dataStore.updateTaskStatus(id, status);
    res.status(200).json(updated || { id, status });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const rescheduleMissed = async (req: AuthRequest, res: Response) => {
  try {
    const { missedTasks, existingTasks, exams, dailyAvailableHours } = req.body;

    const rescheduleResult = await geminiService.rescheduleTasks({
      missedTasks,
      existingTasks,
      exams,
      dailyAvailableHours
    });

    res.status(200).json(rescheduleResult);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
