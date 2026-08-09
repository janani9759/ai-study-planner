import React from 'react';
import { usePlanner } from '../contexts/PlannerContext';
import { Link } from 'react-router-dom';
import { Repeat, Sparkles, Clock, AlertCircle, CheckCircle, ArrowRight, Play } from 'lucide-react';

export const SmartRevision: React.FC = () => {
  const { topics, exams } = usePlanner();

  const dueTopics = topics.filter(t => t.confidence === 'Weak' || t.status === 'In Progress');

  return (
    <div className="space-y-6 fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Repeat size={14} />
            <span>Spaced Repetition Algorithm</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Smart Revision Center</h1>
          <p className="text-xs text-slate-500">AI recommends topics due for revision based on spacing effect, confidence, and exam proximity.</p>
        </div>
      </div>

      <div className="space-y-4">
        {dueTopics.map((t) => (
          <div key={t.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md">
                  {t.subject_name || 'Mathematics'}
                </span>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                  Due Today
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-1">{t.name}</h3>
              <p className="text-xs text-slate-600 font-medium">
                Recommendation: Revision recommended today because your confidence is low and exam is approaching soon.
              </p>
            </div>

            <Link
              to="/smart-learning"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center space-x-2 shrink-0 transition"
            >
              <Play size={14} />
              <span>Start 20m Revision</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
