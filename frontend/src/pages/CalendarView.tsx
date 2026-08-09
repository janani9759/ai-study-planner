import React, { useState } from 'react';
import { usePlanner } from '../contexts/PlannerContext';
import { StudyTask, Exam } from '../types';
import { Calendar as CalendarIcon, Clock, Check, ChevronLeft, ChevronRight, GraduationCap, Sparkles } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { tasks, exams, toggleTaskStatus } = usePlanner();
  const [viewMode, setViewMode] = useState<'Month' | 'Week' | 'Day'>('Month');
  const [selectedTask, setSelectedTask] = useState<StudyTask | null>(null);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Current calendar month matrix generator (Aug 2026)
  const currentMonthDays = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-08-${dayNum < 10 ? '0' + dayNum : dayNum}`;
    const dayTasks = tasks.filter(t => t.task_date === dateStr);
    const dayExams = exams.filter(e => e.exam_date === dateStr);
    return { dayNum, dateStr, tasks: dayTasks, exams: dayExams };
  });

  return (
    <div className="space-y-6 fade-in">
      {/* Header & Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Interactive Calendar</h1>
          <p className="text-xs text-slate-500">View upcoming study sessions, exam deadlines, and AI revision slots</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-slate-100 p-1 rounded-xl flex space-x-1 border border-slate-200">
            {(['Month', 'Week', 'Day'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  viewMode === m ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {m} View
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Month View Grid */}
      {viewMode === 'Month' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">August 2026</h2>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 mr-1.5"></span> Study Task</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5"></span> Exam</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-400">
            {daysOfWeek.map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {currentMonthDays.map((item) => (
              <div
                key={item.dayNum}
                className="min-h-[100px] p-2 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between hover:border-blue-200 transition"
              >
                <div className="text-xs font-bold text-slate-700">{item.dayNum}</div>
                <div className="space-y-1 overflow-y-auto max-h-[70px]">
                  {item.exams.map((ex) => (
                    <div
                      key={ex.id}
                      className="bg-amber-500 text-white text-[10px] font-bold p-1 rounded-lg truncate flex items-center"
                      title={ex.exam_name}
                    >
                      <GraduationCap size={10} className="mr-1 shrink-0" />
                      <span className="truncate">{ex.subject_name} Exam</span>
                    </div>
                  ))}

                  {item.tasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTask(t)}
                      className={`text-[10px] font-semibold p-1 rounded-lg truncate cursor-pointer transition ${
                        t.status === 'Completed'
                          ? 'bg-slate-200 text-slate-600 line-through'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {t.start_time} - {t.subject_name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Week / Day View List */}
      {(viewMode === 'Week' || viewMode === 'Day') && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Upcoming Schedule Tasks</h2>
          <div className="space-y-3">
            {tasks.slice(0, 8).map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTask(t)}
                className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 bg-white flex items-center justify-between cursor-pointer transition"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                    {t.start_time}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900">{t.subject_name}</span>
                    <h4 className="text-sm font-semibold text-slate-800">{t.topic_name}</h4>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-700">{t.task_date}</span>
                  <span className="block text-[10px] text-blue-600 font-semibold">{t.task_type} • {t.duration_minutes}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-200 fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                {selectedTask.subject_name}
              </span>
              <span className="text-xs font-bold text-slate-500">{selectedTask.task_date}</span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">{selectedTask.topic_name}</h2>
              <p className="text-xs text-slate-500 mt-1">{selectedTask.reason || 'AI Scheduled Task'}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Start Time:</span>
                <span className="font-bold text-slate-800">{selectedTask.start_time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Duration:</span>
                <span className="font-bold text-slate-800">{selectedTask.duration_minutes} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Task Type:</span>
                <span className="font-bold text-slate-800">{selectedTask.task_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Priority:</span>
                <span className="font-bold text-rose-600">{selectedTask.priority}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  toggleTaskStatus(selectedTask.id);
                  setSelectedTask(null);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center space-x-1"
              >
                <Check size={14} />
                <span>Mark {selectedTask.status === 'Completed' ? 'Pending' : 'Completed'}</span>
              </button>

              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
