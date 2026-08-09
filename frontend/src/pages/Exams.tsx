import React, { useState } from 'react';
import { usePlanner } from '../contexts/PlannerContext';
import { Exam } from '../types';
import { GraduationCap, Plus, Calendar, MapPin, Target, Edit2, Trash2, Clock } from 'lucide-react';

export const Exams: React.FC = () => {
  const { exams, subjects, addExam, updateExam, deleteExam } = usePlanner();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  const [form, setForm] = useState({
    subject_id: subjects[0]?.id || '',
    subject_name: subjects[0]?.name || 'Mathematics',
    exam_name: '',
    exam_date: '2026-08-20',
    exam_time: '09:30:00',
    location: 'Main Campus Hall',
    target_score: 90,
    notes: ''
  });

  const calculateDaysLeft = (dateStr: string) => {
    const examTime = new Date(dateStr).getTime();
    const nowTime = new Date().getTime();
    const diff = Math.ceil((examTime - nowTime) / (1000 * 3600 * 24));
    return diff > 0 ? diff : 0;
  };

  const handleOpenAdd = () => {
    setEditingExam(null);
    setForm({
      subject_id: subjects[0]?.id || '',
      subject_name: subjects[0]?.name || 'Mathematics',
      exam_name: '',
      exam_date: '2026-08-20',
      exam_time: '09:30:00',
      location: 'Main Campus Hall',
      target_score: 90,
      notes: ''
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (ex: Exam) => {
    setEditingExam(ex);
    setForm({
      subject_id: ex.subject_id || '',
      subject_name: ex.subject_name || 'Mathematics',
      exam_name: ex.exam_name,
      exam_date: ex.exam_date,
      exam_time: ex.exam_time || '09:30:00',
      location: ex.location || 'Main Campus Hall',
      target_score: ex.target_score || 90,
      notes: ex.notes || ''
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.exam_name) return;

    if (editingExam) {
      await updateExam(editingExam.id, form);
    } else {
      await addExam(form);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Exam Schedule & Countdowns</h1>
          <p className="text-xs text-slate-500">Track exam dates, target scores, venues, and live preparation countdowns</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center space-x-2 transition"
        >
          <Plus size={16} />
          <span>Add New Exam</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {exams.map((ex) => {
          const daysLeft = calculateDaysLeft(ex.exam_date);
          return (
            <div key={ex.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md">
                    {ex.subject_name || 'Subject'}
                  </span>
                  <span className="text-xs font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider">
                    {daysLeft} DAYS LEFT
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{ex.exam_name}</h3>
                {ex.notes && <p className="text-xs text-slate-500 mt-1">{ex.notes}</p>}
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center">
                    <Calendar size={14} className="mr-1.5 text-slate-400" /> Exam Date
                  </span>
                  <span className="font-bold text-slate-900">{ex.exam_date}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center">
                    <Clock size={14} className="mr-1.5 text-slate-400" /> Time & Venue
                  </span>
                  <span className="font-semibold text-slate-800 truncate max-w-[160px]">
                    {ex.exam_time} • {ex.location}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center">
                    <Target size={14} className="mr-1.5 text-slate-400" /> Target Score
                  </span>
                  <span className="font-bold text-blue-600">{ex.target_score}%</span>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                    <span>Preparation Level</span>
                    <span>{ex.preparation_percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${ex.preparation_percentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-50">
                  <button
                    onClick={() => handleOpenEdit(ex)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteExam(ex.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-200 fade-in">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {editingExam ? 'Edit Exam' : 'Schedule New Exam'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <select
                  value={form.subject_id}
                  onChange={(e) => {
                    const sel = subjects.find(s => s.id === e.target.value);
                    setForm({
                      ...form,
                      subject_id: e.target.value,
                      subject_name: sel?.name || 'Mathematics'
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Title</label>
                <input
                  type="text"
                  value={form.exam_name}
                  onChange={(e) => setForm({ ...form, exam_name: e.target.value })}
                  placeholder="e.g. Mathematics End-Sem Assessment"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Date</label>
                  <input
                    type="date"
                    value={form.exam_date}
                    onChange={(e) => setForm({ ...form, exam_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Time</label>
                  <input
                    type="time"
                    value={form.exam_time}
                    onChange={(e) => setForm({ ...form, exam_time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hall / Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Science Block Hall A"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preparation Notes</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Formulas to review, allowed items..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                >
                  Save Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
