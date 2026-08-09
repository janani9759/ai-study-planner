import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePlanner } from '../contexts/PlannerContext';
import {
  Clock,
  CheckCircle,
  TrendingUp,
  GraduationCap,
  Flame,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Check,
  Calendar as CalendarIcon,
  Play
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { subjects, topics, exams, tasks, progress, toggleTaskStatus, generateAIPlan, loading } = usePlanner();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.task_date === todayStr || t.status === 'Pending');
  const pendingTasks = todayTasks.filter(t => t.status === 'Pending');
  const completedTasks = todayTasks.filter(t => t.status === 'Completed');

  const weakTopicsList = topics.filter(t => t.confidence === 'Weak');

  // Closest Exam
  const upcomingExam = exams.length > 0 ? exams[0] : null;

  const calculateDaysLeft = (dateStr: string) => {
    const examTime = new Date(dateStr).getTime();
    const nowTime = new Date().getTime();
    const diff = Math.ceil((examTime - nowTime) / (1000 * 3600 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Dashboard Greeting Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold text-blue-300 mb-3">
              <Sparkles size={14} />
              <span>AI Study Planner Operating System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good morning, {user?.full_name || 'Sanjay Kumar'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Let's make today's study session productive. You have {pendingTasks.length} pending task(s) scheduled for today.
            </p>
          </div>

          <button
            onClick={() => generateAIPlan()}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-lg shadow-blue-600/30 flex items-center space-x-2 transition transform active:scale-95 whitespace-nowrap"
          >
            <Sparkles size={16} />
            <span>{loading ? 'AI Optimizing...' : 'Re-optimize AI Schedule'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* 1. Today's Study Hours */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Study Hours</span>
            <Clock size={18} className="text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{progress?.completedHoursToday || 3.5}h</div>
            <span className="text-[10px] text-slate-500 font-medium">Target: 4.0h daily</span>
          </div>
        </div>

        {/* 2. Today's Completed Tasks */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle size={18} className="text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{completedTasks.length}</div>
            <span className="text-[10px] text-emerald-600 font-medium">Tasks done today</span>
          </div>
        </div>

        {/* 3. Overall Progress */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Overall Syllabus</span>
            <TrendingUp size={18} className="text-indigo-600" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{progress?.overallProgress || 67}%</div>
            <span className="text-[10px] text-indigo-600 font-medium">Across all subjects</span>
          </div>
        </div>

        {/* 4. Upcoming Exam */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Closest Exam</span>
            <GraduationCap size={18} className="text-amber-600" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-amber-600">
              {upcomingExam ? calculateDaysLeft(upcomingExam.exam_date) : 12} DAYS
            </div>
            <span className="text-[10px] text-slate-500 font-medium truncate block">
              {upcomingExam ? upcomingExam.subject_name : 'Mathematics'}
            </span>
          </div>
        </div>

        {/* 5. Study Streak */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Streak</span>
            <Flame size={18} className="text-orange-500" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{progress?.currentStreakDays || 14} Days</div>
            <span className="text-[10px] text-orange-500 font-medium">Active study streak</span>
          </div>
        </div>

        {/* 6. Pending Tasks */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending</span>
            <AlertCircle size={18} className="text-rose-500" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-rose-600">{pendingTasks.length} Tasks</div>
            <span className="text-[10px] text-slate-500 font-medium">Need completion</span>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Today's Plan & Upcoming Exams */}
        <div className="lg:col-span-2 space-y-6">
          {/* TODAY'S PLAN CARD */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Today's Study Plan</h2>
                <p className="text-xs text-slate-500">Intelligently scheduled by Gemini AI based on exam priorities</p>
              </div>
              <Link to="/planner" className="text-xs text-blue-600 hover:underline font-bold flex items-center">
                <span>Full Schedule</span> <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>

            <div className="space-y-3">
              {todayTasks.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No tasks generated for today. Click "Re-optimize AI Schedule" above!
                </div>
              ) : (
                todayTasks.map((t) => (
                  <div
                    key={t.id}
                    className={`p-4 rounded-2xl border flex items-center justify-between transition ${
                      t.status === 'Completed'
                        ? 'bg-slate-50 border-slate-200 opacity-70'
                        : 'bg-white border-slate-200 hover:border-blue-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start space-x-3.5">
                      <button
                        onClick={() => toggleTaskStatus(t.id)}
                        className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition ${
                          t.status === 'Completed'
                            ? 'bg-emerald-600 text-white'
                            : 'border-2 border-slate-300 hover:border-blue-600 text-transparent'
                        }`}
                      >
                        <Check size={14} />
                      </button>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-900">{t.subject_name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            t.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                            {t.priority} Priority
                          </span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                            {t.task_type}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-800 mt-0.5">{t.topic_name}</h4>
                        {t.reason && <p className="text-[11px] text-slate-400 mt-0.5">{t.reason}</p>}
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <div className="text-xs font-bold text-slate-700 flex items-center">
                        <Clock size={12} className="mr-1 text-slate-400" />
                        {t.start_time} ({t.duration_minutes}m)
                      </div>
                      <span className={`text-[10px] mt-1 font-bold ${
                        t.status === 'Completed' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* UPCOMING EXAMS CARD */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Upcoming Exams & Countdown</h2>
                <p className="text-xs text-slate-500">Dynamic countdowns and subject readiness percentages</p>
              </div>
              <Link to="/exams" className="text-xs text-blue-600 hover:underline font-bold flex items-center">
                <span>Manage Exams</span> <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {exams.map((ex) => {
                const days = calculateDaysLeft(ex.exam_date);
                return (
                  <div key={ex.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{ex.subject_name}</span>
                      <span className="text-xs font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                        {days} DAYS LEFT
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-800">{ex.exam_name}</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                        <span>Preparation Readiness</span>
                        <span>{ex.preparation_percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${ex.preparation_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): AI Recommendation & Weak Topics */}
        <div className="space-y-6">
          {/* AI RECOMMENDATION CARD */}
          <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-3xl p-6 shadow-lg relative overflow-hidden border border-blue-800">
            <div className="flex items-center space-x-2 text-blue-300 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles size={16} />
              <span>Personalized AI Recommendation</span>
            </div>
            <p className="text-sm text-slate-100 font-medium leading-relaxed mb-4">
              "Your Mathematics exam is in 12 days. Dedicate today's second study session to revising Integration by Parts and solving 3 practice derivations."
            </p>
            <Link
              to="/smart-learning"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md"
            >
              <Play size={14} />
              <span>Start AI Smart Lesson</span>
            </Link>
          </div>

          {/* WEAK TOPICS CARD */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Weak Topics Focus</h3>
                <p className="text-[11px] text-slate-500">Topics flagged for immediate revision</p>
              </div>
              <Link to="/topics" className="text-xs text-blue-600 font-bold hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {weakTopicsList.length === 0 ? (
                <p className="text-xs text-slate-400">No weak topics identified yet.</p>
              ) : (
                weakTopicsList.map((wt) => (
                  <div key={wt.id} className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{wt.name}</span>
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-md">
                        Weak Confidence
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>{wt.subject_name || 'Subject'}</span>
                      <span>Progress: {wt.progress}%</span>
                    </div>
                    <Link
                      to="/smart-learning"
                      className="block text-center bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 text-[11px] font-bold py-1.5 rounded-xl transition"
                    >
                      Revise with AI Tutor
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
