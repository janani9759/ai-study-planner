import React, { createContext, useContext, useState, useEffect } from 'react';
import { Subject, Topic, Exam, StudyTask, Goal, ComfortCheckPayload, ProgressSummary } from '../types';
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
  fetchData: () => Promise<void>;
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
  generateAIPlan: (overridePayload?: any) => Promise<any>;
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
  const [activeAIPlan, setActiveAIPlan] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subs, tops, exs, tsks, gls, prg] = await Promise.allSettled([
        api.getSubjects(),
        api.getTopics(),
        api.getExams(),
        api.getTasks(),
        api.getGoals(),
        api.getProgressSummary()
      ]);

      if (subs.status === 'fulfilled') setSubjects(subs.value);
      if (tops.status === 'fulfilled') setTopics(tops.value);
      if (exs.status === 'fulfilled') setExams(exs.value);
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
    const created = await api.createSubject(sub);
    setSubjects(prev => [created, ...prev]);
  };

  const updateSubject = async (id: string, updates: Partial<Subject>) => {
    const updated = await api.updateSubject(id, updates);
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const deleteSubject = async (id: string) => {
    await api.deleteSubject(id);
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const addTopic = async (top: Partial<Topic>) => {
    const created = await api.createTopic(top);
    setTopics(prev => [created, ...prev]);
  };

  const updateTopic = async (id: string, updates: Partial<Topic>) => {
    const updated = await api.updateTopic(id, updates);
    setTopics(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
  };

  const deleteTopic = async (id: string) => {
    await api.deleteTopic(id);
    setTopics(prev => prev.filter(t => t.id !== id));
  };

  const addExam = async (ex: Partial<Exam>) => {
    const created = await api.createExam(ex);
    setExams(prev => [created, ...prev]);
  };

  const updateExam = async (id: string, updates: Partial<Exam>) => {
    const updated = await api.updateExam(id, updates);
    setExams(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
  };

  const deleteExam = async (id: string) => {
    await api.deleteExam(id);
    setExams(prev => prev.filter(e => e.id !== id));
  };

  const toggleTaskStatus = async (taskId: string) => {
    const target = tasks.find(t => t.id === taskId);
    if (!target) return;
    const nextStatus = target.status === 'Completed' ? 'Pending' : 'Completed';
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: nextStatus } : t));
    await api.updateTaskStatus(taskId, nextStatus);
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
      await fetchData(); // refresh tasks
      return result;
    } finally {
      setLoading(false);
    }
  };

  const rescheduleMissedTasks = async () => {
    setLoading(true);
    try {
      const missed = tasks.filter(t => t.status === 'Missed');
      const result = await api.rescheduleMissedTasks({
        missedTasks: missed,
        existingTasks: tasks,
        exams
      });
      await fetchData();
      return result;
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (goal: Partial<Goal>) => {
    const created = await api.createGoal(goal);
    setGoals(prev => [created, ...prev]);
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    const updated = await api.updateGoal(id, updates);
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updated } : g));
  };

  const deleteGoal = async (id: string) => {
    await api.deleteGoal(id);
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const submitComfort = async (payload: Partial<ComfortCheckPayload>) => {
    await api.submitComfortCheck(payload);
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
        fetchData,
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
