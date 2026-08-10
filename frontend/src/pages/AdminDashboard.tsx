import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ShieldAlert, Users, Calendar, BarChart3, Cpu, Plus, CheckCircle2, Clock, BookOpen, UserCheck } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [deptAdmins, setDeptAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals State
  const [createDeptAdminModal, setCreateDeptAdminModal] = useState(false);
  const [allocateScheduleModal, setAllocateScheduleModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Department Admin Form
  const [deptAdminForm, setDeptAdminForm] = useState({
    full_name: '',
    email: '',
    password: '',
    department: 'Artificial Intelligence and Data Science'
  });

  // Schedule Allocation Form
  const [scheduleForm, setScheduleForm] = useState({
    department: 'Artificial Intelligence and Data Science',
    subject_name: 'Mathematics',
    topic_name: 'Integration by Parts Assignment',
    task_date: '2026-08-15',
    start_time: '17:00',
    duration_minutes: 60,
    priority: 'High',
    task_type: 'Study'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [analytics, admins] = await Promise.all([
        api.getAdminAnalytics(),
        api.getDeptAdmins().catch(() => [])
      ]);
      setData(analytics);
      setDeptAdmins(admins);
    } catch (err) {
      console.error('Admin analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateDeptAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    setIsError(false);
    try {
      const res = await api.createDeptAdmin(deptAdminForm);
      setMessage(res.message || `Department Admin created for ${deptAdminForm.department}!`);
      setDeptAdminForm({
        full_name: '',
        email: '',
        password: '',
        department: 'Artificial Intelligence and Data Science'
      });
      await loadData();
      setTimeout(() => {
        setCreateDeptAdminModal(false);
        setMessage('');
      }, 1500);
    } catch (err: any) {
      setIsError(true);
      setMessage(err.message || 'Failed to create Department Admin');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAllocateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    setIsError(false);
    try {
      const res = await api.allocateDepartmentSchedule(scheduleForm);
      setMessage(res.message || 'Schedule successfully allocated to department students!');
      setTimeout(() => {
        setAllocateScheduleModal(false);
        setMessage('');
      }, 1800);
    } catch (err: any) {
      setIsError(true);
      setMessage(err.message || 'Failed to allocate schedule');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs font-bold text-slate-500">Loading Administrative Overview...</div>;
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-2">
            <ShieldAlert size={16} />
            <span>INSTITUTIONAL & DEPARTMENTAL ADMINISTRATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Admin & Department Portal</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Department-wise student creation, schedule allocation, and faculty admin management.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCreateDeptAdminModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center space-x-1.5 transition"
          >
            <UserCheck size={16} />
            <span>Create Dept Admin</span>
          </button>

          <button
            onClick={() => setAllocateScheduleModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center space-x-1.5 transition"
          >
            <Calendar size={16} />
            <span>Allocate Dept Schedule</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Students</span>
            <Users size={20} className="text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{data?.totalStudents || 0}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">{data?.activeStudentsToday || 0} Active</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Department Admins</span>
            <UserCheck size={20} className="text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-600">{data?.totalDeptAdmins || deptAdmins.length}</div>
          <span className="text-[11px] text-slate-500">Faculty Heads active</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Average Progress</span>
            <BarChart3 size={20} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{data?.averageProgressPercentage || 75}%</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Institutional Average</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">System Operations</span>
            <Cpu size={20} className="text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{data?.totalStudyPlansGenerated || 0}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">{data?.systemHealth || '100% Operational'}</span>
        </div>
      </div>

      {/* Department-Wise Admins List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Department-Wise Faculty Admins</h3>
        {deptAdmins.length === 0 ? (
          <p className="text-xs text-slate-400">No Department Admins created yet. Click "Create Dept Admin" above.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {deptAdmins.map((da) => (
              <div key={da.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900">{da.full_name}</span>
                  <p className="text-[11px] text-slate-500">{da.email} • {da.department}</p>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded">
                  {da.department} Head
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Create Department-Wise Admin */}
      {createDeptAdminModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-200 fade-in">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Create Department Admin</h2>
            <p className="text-xs text-slate-500 mb-4">Provision a faculty head for a specific department.</p>

            {message && (
              <div className={`mb-4 p-3 ${isError ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-blue-50 border-blue-200 text-blue-800'} border text-xs rounded-xl flex items-center`}>
                <CheckCircle2 size={16} className={`mr-2 ${isError ? 'text-rose-600' : 'text-blue-600'}`} />
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleCreateDeptAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={deptAdminForm.full_name}
                  onChange={(e) => setDeptAdminForm({ ...deptAdminForm, full_name: e.target.value })}
                  placeholder="e.g. Dr. K. Arunkumar"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={deptAdminForm.email}
                  onChange={(e) => setDeptAdminForm({ ...deptAdminForm, email: e.target.value })}
                  placeholder="arunkumar@college.edu"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={deptAdminForm.password}
                  onChange={(e) => setDeptAdminForm({ ...deptAdminForm, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Department</label>
                <select
                  value={deptAdminForm.department}
                  onChange={(e) => setDeptAdminForm({ ...deptAdminForm, department: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                >
                  <option value="Artificial Intelligence and Data Science">Artificial Intelligence & Data Science</option>
                  <option value="Computer Science and Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setCreateDeptAdminModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                >
                  {submitting ? 'Creating...' : 'Provision Dept Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Allocate Schedule for Department */}
      {allocateScheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-slate-200 fade-in">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Allocate Department Study Schedule</h2>
            <p className="text-xs text-slate-500 mb-4">Assign mandatory tasks to all students in a department.</p>

            {message && (
              <div className={`mb-4 p-3 ${isError ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-blue-50 border-blue-200 text-blue-800'} border text-xs rounded-xl flex items-center`}>
                <CheckCircle2 size={16} className={`mr-2 ${isError ? 'text-rose-600' : 'text-blue-600'}`} />
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleAllocateSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Department</label>
                <select
                  value={scheduleForm.department}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, department: e.target.value })}
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Name</label>
                  <input
                    type="text"
                    value={scheduleForm.subject_name}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, subject_name: e.target.value })}
                    placeholder="e.g. Mathematics"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Topic Name</label>
                  <input
                    type="text"
                    value={scheduleForm.topic_name}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, topic_name: e.target.value })}
                    placeholder="e.g. Integration by Parts"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={scheduleForm.task_date}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, task_date: e.target.value })}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={scheduleForm.start_time}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, start_time: e.target.value })}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (m)</label>
                  <input
                    type="number"
                    value={scheduleForm.duration_minutes}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, duration_minutes: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setAllocateScheduleModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                >
                  {submitting ? 'Allocating...' : 'Allocate Schedule to All Students'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
