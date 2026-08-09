import React, { useState } from 'react';
import { usePlanner } from '../contexts/PlannerContext';
import { Topic } from '../types';
import { ListTodo, Plus, Edit2, Trash2, AlertTriangle, CheckCircle, Clock, ShieldAlert } from 'lucide-react';

export const Topics: React.FC = () => {
  const { topics, subjects, addTopic, updateTopic, deleteTopic } = usePlanner();

  const [filterConfidence, setFilterConfidence] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  const [form, setForm] = useState({
    subject_id: subjects[0]?.id || '',
    name: '',
    description: '',
    difficulty: 'Medium' as 'Low' | 'Medium' | 'High',
    status: 'In Progress' as 'Not Started' | 'In Progress' | 'Completed',
    confidence: 'Average' as 'Weak' | 'Average' | 'Strong'
  });

  const filteredTopics = topics.filter(t => {
    if (filterConfidence !== 'ALL' && t.confidence !== filterConfidence) return false;
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
    return true;
  });

  const handleOpenAdd = () => {
    setEditingTopic(null);
    setForm({
      subject_id: subjects[0]?.id || '',
      name: '',
      description: '',
      difficulty: 'Medium',
      status: 'In Progress',
      confidence: 'Average'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (t: Topic) => {
    setEditingTopic(t);
    setForm({
      subject_id: t.subject_id,
      name: t.name,
      description: t.description || '',
      difficulty: t.difficulty,
      status: t.status,
      confidence: t.confidence
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;

    if (editingTopic) {
      await updateTopic(editingTopic.id, form);
    } else {
      await addTopic(form);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Topic Management & Weak Area Tracking</h1>
          <p className="text-xs text-slate-500">Track subject topics, set confidence ratings, and prioritize weak areas</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center space-x-2 transition"
        >
          <Plus size={16} />
          <span>Add New Topic</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-700">Confidence Filter:</span>
          {['ALL', 'Weak', 'Average', 'Strong'].map((conf) => (
            <button
              key={conf}
              onClick={() => setFilterConfidence(conf)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                filterConfidence === conf
                  ? conf === 'Weak' ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {conf}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-700">Status:</span>
          {['ALL', 'Not Started', 'In Progress', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                filterStatus === st ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Table / Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredTopics.map((t) => (
            <div key={t.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-slate-900">{t.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    t.confidence === 'Weak'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : t.confidence === 'Strong'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    {t.confidence} Confidence
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
                    {t.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{t.description || 'No description provided.'}</p>
                <div className="flex items-center space-x-4 text-[11px] text-slate-400 pt-1">
                  <span>Subject: <strong className="text-slate-700">{t.subject_name || 'Mathematics'}</strong></span>
                  <span>Difficulty: <strong>{t.difficulty}</strong></span>
                  {t.last_studied_at && (
                    <span>Last studied: {new Date(t.last_studied_at).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 self-end sm:self-center">
                <button
                  onClick={() => handleOpenEdit(t)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-white text-xs font-semibold text-slate-700 flex items-center space-x-1"
                >
                  <Edit2 size={14} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => deleteTopic(t.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-200 fade-in">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {editingTopic ? 'Edit Topic' : 'Add New Topic'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <select
                  value={form.subject_id}
                  onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Topic Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Integration by Parts"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Key concepts or details..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                ></textarea>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value as any })}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Confidence</label>
                  <select
                    value={form.confidence}
                    onChange={(e) => setForm({ ...form, confidence: e.target.value as any })}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  >
                    <option value="Weak">Weak</option>
                    <option value="Average">Average</option>
                    <option value="Strong">Strong</option>
                  </select>
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
                  Save Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
