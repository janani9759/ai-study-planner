import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabase } from '../config/supabase';
import { geminiService } from '../services/geminiService';

export const saveBrainDump = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { rawText, studentContext } = req.body;

    const aiResult = await geminiService.analyzeBrainDump(rawText, studentContext || {});

    try {
      await supabase.from('brain_dumps').insert({
        user_id: userId,
        raw_text: rawText,
        ai_summary: aiResult.aiSummary,
        detected_priorities: aiResult.detectedPriorities,
        recommended_plan: aiResult.suggestedActions
      });
    } catch (dbErr) {
      console.warn('Brain dump DB save warning:', dbErr);
    }

    res.status(200).json(aiResult);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getBrainDumps = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { data: dumps, error } = await supabase
      .from('brain_dumps')
      .select('*')
      .eq('user_id', userId)
      .order('logged_at', { ascending: false });

    if (error || !dumps) {
      return res.status(200).json([]);
    }

    res.status(200).json(dumps);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
