import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { geminiService } from '../services/geminiService';
import { supabase } from '../config/supabase';

export const generatePlan = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
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

    // Save study plan in Supabase database
    try {
      const { data: studyPlan } = await supabase
        .from('study_plans')
        .insert({
          user_id: userId,
          title: aiResult.planTitle || 'AI Custom Study Plan',
          raw_ai_response: aiResult
        })
        .select()
        .single();

      // Insert tasks into study_tasks table if plan generated
      if (studyPlan && aiResult.plan) {
        for (const day of aiResult.plan) {
          for (const task of day.tasks || []) {
            await supabase.from('study_tasks').insert({
              plan_id: studyPlan.id,
              user_id: userId,
              task_date: day.date || new Date().toISOString().split('T')[0],
              start_time: task.startTime || '18:00',
              duration_minutes: task.durationMinutes || 60,
              subject_name: task.subject || 'General Study',
              topic_name: task.topic || 'Review',
              task_type: task.type || 'Study',
              priority: task.priority || 'Medium',
              reason: task.reason || 'AI Schedule',
              status: 'Pending'
            });
          }
        }
      }
    } catch (dbErr) {
      console.warn('DB Save plan warning (returning AI payload directly):', dbErr);
    }

    res.status(200).json(aiResult);
  } catch (err: any) {
    console.error('Planner Error:', err);
    res.status(500).json({ error: 'Failed to generate study plan: ' + err.message });
  }
};

export const getPlanTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { data: tasks, error } = await supabase
      .from('study_tasks')
      .select('*')
      .eq('user_id', userId)
      .order('task_date', { ascending: true });

    if (error || !tasks) {
      return res.status(200).json([]);
    }

    res.status(200).json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from('study_tasks')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(200).json({ id, status });
    }

    res.status(200).json(data);
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
