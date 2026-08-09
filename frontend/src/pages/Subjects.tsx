import React, { useState } from 'react';
import { usePlanner } from '../contexts/PlannerContext';
import { Subject } from '../types';
import { BookOpen, Plus, Edit2, Trash2, Calendar, Target, AlertCircle, CheckCircle } from 'lucide-react';

export const Subjects: React.FC = () => {
  const { subjects, addSubject, updateSubject, deleteSubject } = usePlanner();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    difficulty: 'Medium' as 'Low' | 'Medium' | 'High',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    exam_date: '2026-08-20',
    target_score: 85
  });

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setForm({
      name: '',
      code: '',
      description: '',
      difficulty: 'Medium',
      priority: 'Medium',
      exam_date: '2026-08-20',
      target_score: 85
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (s: Subject) => {
    setEditingSubject(s);
    setForm({
      name: s.name,
      code: s.code,
      description: s.description || '',
      difficulty: s.difficulty,
      priority: s.priority,
      exam_date: s.exam_date || '2026-08-20',
      target_score: s.target_score || 85
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;

    if (editingSubject) {
      await updateSubject(editingSubject.id, form);
    } else {
      await addSubject(form);
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Subject Management</h1>
          <p className="text-xs text-slate-500">Manage academic courses, set target scores, priority, and track progress</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center space-x-2 transition"
        >
          <Plus size={16} />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map((sub) => (
          <div key={sub.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    {sub.code}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">{sub.name}</h3>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenEdit(sub)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-50"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteSubject(sub.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {sub.description && (
                <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">{sub.description}</p>
              )}
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center">
                  <Calendar size={14} className="mr-1 text-slate-400" /> Exam Date
                </span>
                <span className="font-bold text-slate-800">{sub.exam_date || 'N/A'}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center">
                  <Target size={14} className="mr-1 text-slate-400" /> Target Score
                </span>
                <span className="font-bold text-blue-600">{sub.target_score}%</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Difficulty / Priority</span>
                <div className="flex space-x-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    sub.difficulty === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {sub.difficulty} Diff
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    sub.priority === 'High' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {sub.priority} Prio
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-slate-600">Syllabus Completion</span>
                  <span className="text-slate-900 font-bold">{sub.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${sub.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-200 fade-in">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {editingSubject ? 'Edit Subject' : 'Add New Subject'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Artificial Intelligence"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course Code</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="e.g. CSE-501"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short syllabus description..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Date</label>
                  <input
                    type="date"
                    value={form.exam_date}
                    onChange={(e) => setForm({ ...form, exam_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Score (%)</label>
                  <input
                    type="number"
                    value={form.target_score}
                    onChange={(e) => setForm({ ...form, target_score: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  />
                </div>
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
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
