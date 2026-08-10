import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowRight, UserCheck, ShieldAlert } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [roleTab, setRoleTab] = useState<'STUDENT' | 'ADMIN'>('STUDENT');
  const [email, setEmail] = useState('sanjay.kumar@college.edu');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your College ID / Email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password, roleTab);
      if (roleTab === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-0 lg:p-6 font-sans">
      <div className="w-full max-w-6xl bg-white lg:rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-screen lg:min-h-[640px]">
        {/* Left Side - Campus Hero Image & Branding */}
        <div className="relative lg:w-1/2 bg-slate-900 text-white flex flex-col justify-between p-8 sm:p-12 overflow-hidden min-h-[320px] lg:min-h-full">
          {/* Background Visual */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 transform hover:scale-105 transition-transform duration-1000"
            style={{ backgroundImage: `url('/campus_hero.png')` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/40"></div>

          {/* Top Logo Badge */}
          <div className="relative z-10 flex items-center space-x-3">
            <img src="/college_logo.png" alt="College Logo" className="w-12 h-12 object-contain" />
            <div>
              <h2 className="font-bold text-xl tracking-tight text-white">AI STUDY PLANNER</h2>
              <p className="text-xs text-blue-400 font-medium tracking-wide">CMS COLLEGE OF ENGINEERING</p>
            </div>
          </div>

          {/* Slogan & Value Prop */}
          <div className="relative z-10 my-auto py-8">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold text-blue-300 mb-4">
              <UserCheck size={14} />
              <span>Smart Student Management Platform</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
              Unlock Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">
                Learning Journey
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base font-normal max-w-md leading-relaxed">
              Plan smarter. Learn better. Achieve more with personalized AI study schedules, spaced repetition, and real-time performance analytics.
            </p>
          </div>

          {/* Left Footer */}
          <div className="relative z-10 flex items-center text-xs text-slate-400 space-x-2 border-t border-slate-800/80 pt-4">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>Official Academic Student & Faculty Portal</span>
          </div>
        </div>

        {/* Right Side - Login Card */}
        <div className="lg:w-1/2 bg-white p-8 sm:p-12 flex flex-col justify-between">
          <div className="max-w-md mx-auto w-full">
            {/* Header & Role Switcher */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Portal Login</span>
                {/* Student / Admin Switcher */}
                <div className="bg-slate-100 p-1 rounded-xl flex space-x-1 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setRoleTab('STUDENT');
                      setEmail('sanjay.kumar@college.edu');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                      roleTab === 'STUDENT' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <UserCheck size={14} />
                    <span>Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRoleTab('ADMIN');
                      setEmail('admin@college.edu');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                      roleTab === 'ADMIN' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <ShieldAlert size={14} />
                    <span>Admin</span>
                  </button>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {roleTab === 'STUDENT' ? 'Student Login' : 'Admin Login'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">Welcome back! Please enter your credentials to access your portal.</p>
            </div>

            {error && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center">
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {roleTab === 'STUDENT' ? 'College ID / Email' : 'Admin Username / Email'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={roleTab === 'STUDENT' ? 'e.g. sanjay.kumar@college.edu' : 'admin@college.edu'}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <a href="#forgot" className="text-xs text-blue-600 hover:underline font-medium">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center cursor-pointer space-x-2 text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember me on this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center space-x-2 transition transform active:scale-95 disabled:opacity-50"
              >
                <span>{loading ? 'Authenticating...' : roleTab === 'STUDENT' ? 'Student Login' : 'Admin Login'}</span>
                <ArrowRight size={18} />
              </button>
            </form>

            {/* Separator & Register link */}
            {roleTab === 'STUDENT' && (
              <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500 font-medium">
                  Don't have a student account yet?{' '}
                  <Link to="/register" className="text-blue-600 hover:underline font-bold ml-1">
                    Register Here
                  </Link>
                </p>
              </div>
            )}
          </div>

          {/* Card Footer */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400 flex items-center justify-center space-x-2">
            <ShieldCheck size={14} className="text-slate-400" />
            <span>Secure Access • Your data is protected by Supabase SSL RLS Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};
