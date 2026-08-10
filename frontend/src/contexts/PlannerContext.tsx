import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Subject,
  Topic,
  Exam,
  StudyTask,
  Goal,
  ProgressSummary,
  ComfortCheckPayload
} from '../types';
import { api } from '../services/api';

interface PlannerContextType {
  subjects: Subject[];
  topics: Topic[];
  exams: Exam[];
  tasks: StudyTask[];
  goals: Goal[];
  progress: ProgressSummary | null;
  loading: boolean;
  activeAIPlan: any | null;
  refreshData: () => Promise<void>;
  addSubject: (sub: Partial<Subject>) => Promise<void>;
  updateSubject: (id: string, updates: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  addTopic: (top: Partial<Topic>) => Promise<void>;
  updateTopic: (id: string, updates: Partial<Topic>) => Promise<void>;
  deleteTopic: (id: string) => Promise<void>;
  addExam: (ex: Partial<Exam>) => Promise<void>;
  updateExam: (id: string, updates: Partial<Exam>) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;
  toggleTaskStatus: (taskId: string) => Promise<void>;
  generateAIPlan: (payload?: any) => Promise<any>;
  rescheduleMissedTasks: () => Promise<any>;
  addGoal: (goal: Partial<Goal>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  submitComfort: (payload: Partial<ComfortCheckPayload>) => Promise<void>;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export const PlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeAIPlan, setActiveAIPlan] = useState<any | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subs, tops, exms, tsks, gls, prg] = await Promise.allSettled([
        api.getSubjects(),
        api.getTopics(),
        api.getExams(),
        api.getTasks(),
        api.getGoals(),
        api.getProgressSummary()
      ]);

      if (subs.status === 'fulfilled') setSubjects(subs.value);
      if (tops.status === 'fulfilled') setTopics(tops.value);
      if (exms.status === 'fulfilled') setExams(exms.value);
      if (tsks.status === 'fulfilled') setTasks(tsks.value);
      if (gls.status === 'fulfilled') setGoals(gls.value);
      if (prg.status === 'fulfilled') setProgress(prg.value);
    } catch (err) {
      console.error('Failed to load planner data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addSubject = async (sub: Partial<Subject>) => {
    const newSub: Subject = {
      id: 'subj-' + Date.now(),
      name: sub.name || 'New Subject',
      code: sub.code || 'CS' + Math.floor(100 + Math.random() * 900),
      description: sub.description || '',
      difficulty: sub.difficulty || 'Medium',
      priority: sub.priority || 'High',
      target_score: sub.target_score || 85,
      progress: sub.progress || 0
    };
    setSubjects(prev => [newSub, ...prev]);
    try {
      await api.createSubject(sub);
    } catch (e) {}
  };

  const updateSubject = async (id: string, updates: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    try {
      await api.updateSubject(id, updates);
    } catch (e) {}
  };

  const deleteSubject = async (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    try {
      await api.deleteSubject(id);
    } catch (e) {}
  };

  const addTopic = async (top: Partial<Topic>) => {
    const newTop: Topic = {
      id: 'top-' + Date.now(),
      subject_id: top.subject_id || 'subj-1',
      subject_name: top.subject_name || 'Data Structures',
      name: top.name || 'New Topic Concept',
      description: top.description || '',
      difficulty: top.difficulty || 'Medium',
      status: top.status || 'Not Started',
      progress: top.progress || 0,
      confidence: top.confidence || 'Average'
    };
    setTopics(prev => [newTop, ...prev]);
    try {
      await api.createTopic(top);
    } catch (e) {}
  };

  const updateTopic = async (id: string, updates: Partial<Topic>) => {
    setTopics(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    try {
      await api.updateTopic(id, updates);
    } catch (e) {}
  };

  const deleteTopic = async (id: string) => {
    setTopics(prev => prev.filter(t => t.id !== id));
    try {
      await api.deleteTopic(id);
    } catch (e) {}
  };

  const addExam = async (ex: Partial<Exam>) => {
    const newEx: Exam = {
      id: 'ex-' + Date.now(),
      exam_name: ex.exam_name || 'Upcoming Assessment',
      subject_name: ex.subject_name || 'Core Engineering',
      subject_id: ex.subject_id || 'subj-1',
      exam_date: ex.exam_date || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      exam_time: ex.exam_time || '09:30 AM',
      location: ex.location || 'Hall B',
      target_score: ex.target_score || 85,
      preparation_percentage: ex.preparation_percentage || 50,
      notes: ex.notes || ''
    };
    setExams(prev => [newEx, ...prev]);
    try {
      await api.createExam(ex);
    } catch (e) {}
  };

  const updateExam = async (id: string, updates: Partial<Exam>) => {
    setExams(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    try {
      await api.updateExam(id, updates);
    } catch (e) {}
  };

  const deleteExam = async (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
    try {
      await api.deleteExam(id);
    } catch (e) {}
  };

  const toggleTaskStatus = async (taskId: string) => {
    const target = tasks.find(t => t.id === taskId);
    if (!target) return;
    const nextStatus = target.status === 'Completed' ? 'Pending' : 'Completed';
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: nextStatus } : t));
    try {
      await api.updateTaskStatus(taskId, nextStatus);
    } catch (e) {}
  };

  const generateAIPlan = async (overridePayload?: any) => {
    setLoading(true);
    try {
      const payload = overridePayload || {
        dailyAvailableHours: 4.0,
        preferredStudyTime: 'Evening',
        subjects: subjects.map(s => s.name),
        weakTopics: topics.filter(t => t.confidence === 'Weak').map(t => t.name),
        exams: exams.map(e => ({ subject: e.subject_name, date: e.exam_date })),
        goals: goals.map(g => g.title)
      };

      const result = await api.generateAIStudyPlan(payload);
      setActiveAIPlan(result);
      const tsks = await api.getTasks();
      setTasks(tsks);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const rescheduleMissedTasks = async () => {
    setLoading(true);
    try {
      const result = await api.rescheduleMissedTasks();
      const tsks = await api.getTasks();
      setTasks(tsks);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (goal: Partial<Goal>) => {
    const newGoal: Goal = {
      id: 'g-' + Date.now(),
      title: goal.title || 'New Study Goal',
      target_date: goal.target_date || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      target_value: goal.target_value || 100,
      current_value: goal.current_value || 0,
      status: 'Active'
    };
    setGoals(prev => [newGoal, ...prev]);
    try {
      await api.createGoal(goal);
    } catch (e) {}
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    try {
      await api.updateGoal(id, updates);
    } catch (e) {}
  };

  const deleteGoal = async (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    try {
      await api.deleteGoal(id);
    } catch (e) {}
  };

  const submitComfort = async (payload: Partial<ComfortCheckPayload>) => {
    try {
      await api.submitComfortCheck(payload);
    } catch (e) {}
  };

  return (
    <PlannerContext.Provider
      value={{
        subjects,
        topics,
        exams,
        tasks,
        goals,
        progress,
        loading,
        activeAIPlan,
        refreshData: fetchData,
        addSubject,
        updateSubject,
        deleteSubject,
        addTopic,
        updateTopic,
        deleteTopic,
        addExam,
        updateExam,
        deleteExam,
        toggleTaskStatus,
        generateAIPlan,
        rescheduleMissedTasks,
        addGoal,
        updateGoal,
        deleteGoal,
        submitComfort
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
};

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
};
