import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Shield, Clock, BookOpen, Save, CheckCircle2 } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, student, updateStudentPreferences } = useAuth();

  const [hours, setHours] = useState(student?.daily_available_hours || 4.5);
  const [preferredTime, setPreferredTime] = useState(student?.preferred_study_time || 'Evening');
  const [weakSummary, setWeakSummary] = useState(student?.weak_topics_summary || '');
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateStudentPreferences({
      daily_available_hours: Number(hours),
      preferred_study_time: preferredTime as any,
      weak_topics_summary: weakSummary
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account & Planner Settings</h1>
          <p className="text-xs text-slate-500">Manage student profile information, study time allocations, and preference defaults</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-xl flex items-center space-x-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="border-b border-slate-100 pb-4 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Student Profile Information</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={user?.full_name || ''}
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">College ID</label>
                <input
                  type="text"
                  value={user?.college_id || ''}
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Department</label>
                <input
                  type="text"
                  value={user?.department || ''}
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Year & Semester</label>
                <input
                  type="text"
                  value={`${user?.year} - ${user?.semester}`}
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">AI Planner Defaults</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Available Study Hours</label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="12"
                value={hours}
                onChange={(e) => setHours(parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Study Time Window</label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Weak Topics Rationale</label>
              <textarea
                rows={3}
                value={weakSummary}
                onChange={(e) => setWeakSummary(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center space-x-2 transition"
          >
            <Save size={16} />
            <span>Save Preference Changes</span>
          </button>
        </form>
      </div>
    </div>
  );
};
