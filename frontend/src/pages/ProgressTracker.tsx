import React from 'react';
import { usePlanner } from '../contexts/PlannerContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { BarChart3, TrendingUp, Clock, Trophy, Target, Flame } from 'lucide-react';

export const ProgressTracker: React.FC = () => {
  const { progress, subjects, goals } = usePlanner();

  const weeklyData = progress?.weeklyHours || [
    { day: 'Mon', hours: 3.5, target: 4.0 },
    { day: 'Tue', hours: 4.2, target: 4.0 },
    { day: 'Wed', hours: 4.0, target: 4.0 },
    { day: 'Thu', hours: 2.5, target: 4.0 },
    { day: 'Fri', hours: 4.5, target: 4.0 },
    { day: 'Sat', hours: 5.0, target: 4.0 },
    { day: 'Sun', hours: 3.8, target: 4.0 }
  ];

  const subjectData = progress?.subjectProgress || subjects.map(s => ({
    subject: s.name,
    progress: s.progress,
    target: s.target_score
  }));

  const quizData = progress?.quizPerformance || [
    { quiz: 'Math Quiz 1', score: 80 },
    { quiz: 'Physics Quiz 1', score: 60 },
    { quiz: 'AI Quiz 1', score: 90 },
    { quiz: 'DBMS Quiz 1', score: 75 },
    { quiz: 'Math Quiz 2', score: 85 }
  ];

  const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];

  return (
    <div className="space-y-6 fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <BarChart3 size={14} />
            <span>Academic Performance Dashboard</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Progress Tracker & Analytics</h1>
          <p className="text-xs text-slate-500">Comprehensive charts tracking study hours, syllabus mastery, and test trends.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Overall Progress</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{progress?.overallProgress || 67}%</div>
          <span className="text-[11px] text-emerald-600 font-semibold">+5% this week</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Study Streak</span>
          <div className="text-2xl font-extrabold text-orange-500 mt-1 flex items-center">
            <Flame size={22} className="mr-1" /> {progress?.currentStreakDays || 14} Days
          </div>
          <span className="text-[11px] text-slate-500">Consistent daily study</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Completed Hours Today</span>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">{progress?.completedHoursToday || 3.5}h</div>
          <span className="text-[11px] text-slate-500">Target: 4.0h</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Active Goals</span>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">{goals.length || 2}</div>
          <span className="text-[11px] text-indigo-600 font-semibold">On track to finish</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Study Hours Bar Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center">
            <Clock size={16} className="mr-2 text-blue-600" /> Weekly Study Hours Logged
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="hours" fill="#2563eb" radius={[6, 6, 0, 0]} name="Logged Hours" />
                <Bar dataKey="target" fill="#cbd5e1" radius={[6, 6, 0, 0]} name="Target Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Progress Bar Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center">
            <TrendingUp size={16} className="mr-2 text-indigo-600" /> Subject Completion vs Target Score
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis dataKey="subject" type="category" width={100} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="progress" fill="#3b82f6" radius={[0, 6, 6, 0]} name="Completion %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quiz Performance Line Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center">
            <Trophy size={16} className="mr-2 text-amber-500" /> Practice Quiz Performance Trend
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={quizData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="quiz" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} dot={{ r: 5 }} name="Quiz Score %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
