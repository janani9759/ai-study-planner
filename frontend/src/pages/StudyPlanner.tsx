import React, { useState } from 'react';
import { usePlanner } from '../contexts/PlannerContext';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, Calendar, Clock, Check, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';

export const StudyPlanner: React.FC = () => {
  const { student } = useAuth();
  const { tasks, generateAIPlan, rescheduleMissedTasks, toggleTaskStatus, activeAIPlan, loading } = usePlanner();
  const [rescheduling, setRescheduling] = useState(false);
  const [rescheduleResult, setRescheduleResult] = useState<any | null>(null);

  const missedTasks = tasks.filter(t => t.status === 'Missed');

  const handleGeneratePlan = async () => {
    await generateAIPlan();
  };

  const handleReschedule = async () => {
    setRescheduling(true);
    try {
      const res = await rescheduleMissedTasks();
      setRescheduleResult(res);
    } finally {
      setRescheduling(false);
    }
  };

  // Group tasks by Date
  const groupedTasks: Record<string, typeof tasks> = {};
  tasks.forEach(t => {
    const d = t.task_date || 'Today';
    if (!groupedTasks[d]) groupedTasks[d] = [];
    groupedTasks[d].push(t);
  });

  return (
    <div className="space-y-6 fade-in">
      {/* Header & Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Sparkles size={14} />
            <span>AI Smart Scheduler</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Generated Study Planner</h1>
          <p className="text-xs text-slate-500 max-w-xl">
            Optimized using Google Gemini AI. Respects daily limit of {student?.daily_available_hours || 4.0} hours/day and prioritizes closest exams and weak topics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {missedTasks.length > 0 && (
            <button
              onClick={handleReschedule}
              disabled={rescheduling}
              className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center space-x-1.5 transition"
            >
              <RefreshCw size={14} className={rescheduling ? 'animate-spin' : ''} />
              <span>Reschedule ({missedTasks.length}) Missed</span>
            </button>
          )}

          <button
            onClick={handleGeneratePlan}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg shadow-blue-600/25 flex items-center space-x-2 transition transform active:scale-95"
          >
            <Sparkles size={16} />
            <span>{loading ? 'Generating Plan...' : 'Generate AI Study Plan'}</span>
          </button>
        </div>
      </div>

      {/* AI Reschedule Banner */}
      {rescheduleResult && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 fade-in">
          <h3 className="text-sm font-bold text-amber-900 flex items-center mb-1">
            <Sparkles size={16} className="mr-2 text-amber-600" /> AI Reschedule Recommendation
          </h3>
          <p className="text-xs text-amber-800 font-medium mb-3">{rescheduleResult.advice}</p>
          <div className="space-y-2">
            {rescheduleResult.rescheduledTasks?.map((rt: any, idx: number) => (
              <div key={idx} className="bg-white p-3 rounded-xl border border-amber-200 text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900">{rt.subject}</span> - {rt.topic}
                  <p className="text-[11px] text-slate-500">{rt.reason}</p>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-amber-700">{rt.newDate} @ {rt.newStartTime}</span>
                  <span className="block text-[10px] text-slate-400">{rt.durationMinutes} mins</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Tasks Grouped List */}
      <div className="space-y-6">
        {Object.keys(groupedTasks).length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <Calendar size={36} className="mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-700">No study plan generated yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click "Generate AI Study Plan" above to create an optimized daily study schedule.
            </p>
            <button
              onClick={handleGeneratePlan}
              disabled={loading}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md"
            >
              <Sparkles size={16} />
              <span>Generate Plan Now</span>
            </button>
          </div>
        ) : (
          Object.entries(groupedTasks).map(([dateStr, dayTasks]) => (
            <div key={dateStr} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Study Schedule for {dateStr}</h3>
                    <p className="text-xs text-slate-500">{dayTasks.length} study block(s) assigned</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  Total: {dayTasks.reduce((acc, t) => acc + t.duration_minutes, 0) / 60}h / {student?.daily_available_hours || 4}h Limit
                </span>
              </div>

              <div className="space-y-3">
                {dayTasks.map((t) => (
                  <div
                    key={t.id}
                    className={`p-4 rounded-2xl border flex items-center justify-between transition ${
                      t.status === 'Completed'
                        ? 'bg-slate-50 border-slate-200 opacity-70'
                        : t.status === 'Missed'
                        ? 'bg-amber-50/60 border-amber-200'
                        : 'bg-white border-slate-200 hover:border-blue-300'
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
                          <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                            {t.task_type}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-800 mt-0.5">{t.topic_name}</h4>
                        {t.reason && <p className="text-[11px] text-slate-400 mt-0.5">{t.reason}</p>}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-700 flex items-center justify-end">
                        <Clock size={13} className="mr-1 text-slate-400" />
                        {t.start_time} ({t.duration_minutes}m)
                      </div>
                      <span className={`text-[10px] font-bold block mt-1 ${
                        t.status === 'Completed' ? 'text-emerald-600' : t.status === 'Missed' ? 'text-amber-600' : 'text-blue-600'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
