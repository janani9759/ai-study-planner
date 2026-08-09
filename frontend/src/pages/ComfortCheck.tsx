import React, { useState, useEffect } from 'react';
import { usePlanner } from '../contexts/PlannerContext';
import { api } from '../services/api';
import { SmilePlus, Frown, Meh, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export const ComfortCheck: React.FC = () => {
  const { submitComfort } = usePlanner();

  const [feeling, setFeeling] = useState<'Very Comfortable' | 'Comfortable' | 'Normal' | 'Stressed' | 'Tired' | 'Overwhelmed'>('Normal');
  const [workloadDifficulty, setWorkloadDifficulty] = useState<'Very Easy' | 'Easy' | 'Moderate' | 'Difficult' | 'Very Difficult'>('Moderate');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    api.getComfortHistory().then(setHistory).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitComfort({ feeling, workload_difficulty: workloadDifficulty, notes });
    setSubmitted(true);
    const updated = await api.getComfortHistory();
    setHistory(updated);
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <SmilePlus size={14} />
            <span>Comfort & Well-Being Adapter</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daily Comfort Check-In</h1>
          <p className="text-xs text-slate-500">Provide feedback on how you feel today. AI uses this to balance task intensity and prevent burnout.</p>
        </div>
      </div>

      {/* Comfort Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
        {submitted && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle size={18} className="text-emerald-600" />
              <span>Feedback logged! AI study planner will adapt upcoming study sessions accordingly.</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Feeling Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              1. How are you feeling about today's study?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(['Very Comfortable', 'Comfortable', 'Normal', 'Stressed', 'Tired', 'Overwhelmed'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFeeling(f)}
                  className={`p-3.5 rounded-xl text-xs font-bold border transition text-center ${
                    feeling === f
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Workload Difficulty */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              2. How difficult does today's study workload feel?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(['Very Easy', 'Easy', 'Moderate', 'Difficult', 'Very Difficult'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setWorkloadDifficulty(d)}
                  className={`p-3.5 rounded-xl text-xs font-bold border transition text-center ${
                    workloadDifficulty === d
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Optional Notes / Context</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Spent 3 hours on lab report, feeling a bit exhausted..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/25 transition"
          >
            Submit Feedback & Adapt AI Schedule
          </button>
        </form>

        {/* Disclaimer */}
        <p className="text-[11px] text-slate-400 text-center italic border-t border-slate-100 pt-4">
          Note: Comfort check-in adapts study block lengths and break frequency. It does not provide medical or psychological diagnostics.
        </p>
      </div>

      {/* History Log */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Recent Comfort Logs</h3>
        <div className="space-y-2">
          {history.map((h, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900">{h.feeling}</span> • <span className="text-slate-600">{h.workload_difficulty} Workload</span>
                {h.notes && <p className="text-[11px] text-slate-500 mt-0.5">{h.notes}</p>}
              </div>
              <span className="text-[10px] text-slate-400">{new Date(h.logged_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
