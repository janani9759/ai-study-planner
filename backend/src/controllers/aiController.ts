import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { geminiService } from '../services/geminiService';

export const handleBrainDumpAI = async (req: AuthRequest, res: Response) => {
  try {
    const { rawText, studentContext } = req.body;
    if (!rawText) {
      return res.status(400).json({ error: 'Raw text is required' });
    }

    const result = await geminiService.analyzeBrainDump(rawText, studentContext || {});
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const handleQuizAI = async (req: AuthRequest, res: Response) => {
  try {
    const { subject, topic, questionCount, difficulty } = req.body;
    if (!subject || !topic) {
      return res.status(400).json({ error: 'Subject and topic are required' });
    }

    const quiz = await geminiService.generateQuiz(
      subject,
      topic,
      Number(questionCount) || 5,
      difficulty || 'Medium'
    );

    res.status(200).json(quiz);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const handleChatAI = async (req: AuthRequest, res: Response) => {
  try {
    const { message, history, studentContext } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await geminiService.chatWithAssistant(
      message,
      history || [],
      studentContext || { name: req.user?.full_name }
    );

    res.status(200).json(response);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const handleExplainTopicAI = async (req: AuthRequest, res: Response) => {
  try {
    const { subject, topic, confidence } = req.body;
    const explanation = await geminiService.explainTopic(subject, topic, confidence || 'Average');
    res.status(200).json(explanation);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const handleDailyRecommendation = async (req: AuthRequest, res: Response) => {
  try {
    const recommendation = {
      recommendation_type: 'Daily Focus',
      content: 'Your Mathematics exam is approaching in 12 days. Spend today\'s second study session revising Integration by Parts.'
    };
    res.status(200).json(recommendation);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
