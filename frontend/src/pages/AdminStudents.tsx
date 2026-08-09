import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Users, Search, Plus, User, Mail, Lock, GraduationCap, Building, Calendar, CheckCircle2 } from 'lucide-react';

export const AdminStudents: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    full_name: '',
    college_id: '',
    email: '',
    password: '',
    department: 'Computer Science and Engineering',
    year: '1st Year',
    semester: 'Semester 1'
  });

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminStudents(search);
      setStudents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [search]);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      const res = await api.createAdminStudent(form);
      setMessage('Student account created successfully!');
      setForm({
        full_name: '',
        college_id: '',
        email: '',
        password: '',
        department: 'Computer Science and Engineering',
        year: '1st Year',
        semester: 'Semester 1'
      });
      await loadStudents();
      setTimeout(() => {
        setModalOpen(false);
        setMessage('');
      }, 1500);
    } catch (err: any) {
      setMessage(err.message || 'Failed to create student');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Management Directory</h1>
          <p className="text-xs text-slate-500">Inspect student profiles, active courses, test preparation, and create student accounts</p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center space-x-2 transition shrink-0"
          >
            <Plus size={16} />
            <span>Create New Student</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {students.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No student records found. Click "Create New Student" to add student users.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {students.map((s) => (
              <div key={s.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {s.college_id}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{s.full_name}</h3>
                  </div>
                  <p className="text-xs text-slate-500">{s.email} • {s.department} • {s.year}</p>
                  <div className="flex items-center space-x-4 text-[11px] text-slate-400 pt-1">
                    <span>Semester: <strong className="text-slate-700">{s.semester}</strong></span>
                    <span>Status: <strong className="text-emerald-600">{s.last_active}</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900">{s.progress}% Onboarding</span>
                    <div className="w-24 bg-slate-100 h-2 rounded-full mt-1 overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${s.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Student Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-slate-200 fade-in">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Create New Student Account</h2>
            <p className="text-xs text-slate-500 mb-4">Administratively provision student access credentials.</p>

            {message && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-xl flex items-center">
                <CheckCircle2 size={16} className="mr-2 text-blue-600" />
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">College ID</label>
                  <input
                    type="text"
                    value={form.college_id}
                    onChange={(e) => setForm({ ...form, college_id: e.target.value })}
                    placeholder="e.g. CMS2026-102"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="student@college.edu"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Temporary Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                <select
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                >
                  <option value="Artificial Intelligence and Data Science">Artificial Intelligence & Data Science</option>
                  <option value="Computer Science and Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Year</label>
                  <select
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="Final Year">Final Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
                  <select
                    value={form.semester}
                    onChange={(e) => setForm({ ...form, semester: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  >
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 4">Semester 4</option>
                    <option value="Semester 5">Semester 5</option>
                    <option value="Semester 6">Semester 6</option>
                    <option value="Semester 7">Semester 7</option>
                    <option value="Semester 8">Semester 8</option>
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
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                >
                  {submitting ? 'Creating...' : 'Provision Student User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
