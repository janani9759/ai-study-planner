import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  ListTodo,
  GraduationCap,
  Calendar,
  Sparkles,
  SmilePlus,
  Brain,
  Repeat,
  HelpCircle,
  BarChart3,
  Target,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  User,
  ShieldAlert
} from 'lucide-react';

import { AISettingsModal } from '../components/AISettingsModal';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [aiSettingsOpen, setAiSettingsOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Subjects', path: '/subjects', icon: BookOpen },
    { label: 'Topics', path: '/topics', icon: ListTodo },
    { label: 'Exams', path: '/exams', icon: GraduationCap },
    { label: 'Study Planner', path: '/planner', icon: Calendar },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'Smart Learning', path: '/smart-learning', icon: Sparkles },
    { label: 'Brain Dump', path: '/brain-dump', icon: Brain },
    { label: 'Comfort Check', path: '/comfort', icon: SmilePlus },
    { label: 'Smart Revision', path: '/revision', icon: Repeat },
    { label: 'Quizzes', path: '/quizzes', icon: HelpCircle },
    { label: 'Progress', path: '/progress', icon: BarChart3 },
    { label: 'Goals', path: '/goals', icon: Target },
    { label: 'AI Assistant', path: '/ai-assistant', icon: MessageSquare },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  if (user?.role === 'ADMIN') {
    navItems.unshift({ label: 'Admin Portal', path: '/admin', icon: ShieldAlert });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-slate-300 hover:text-white p-1"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/dashboard" className="flex items-center space-x-2.5">
              <img src="/college_logo.png" alt="Logo" className="w-8 h-8 object-contain" />
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight leading-none text-white">AI STUDY PLANNER</span>
                <span className="text-[10px] text-blue-400 font-medium tracking-widest uppercase">Academic Excellence</span>
              </div>
            </Link>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 w-64 focus-within:w-80 transition-all">
            <Search size={16} className="text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search subjects, topics, exams..."
              className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-full"
            />
          </div>

          {/* Profile & Notifications */}
          <div className="flex items-center space-x-3">
            <button className="relative text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>

            {/* AI Key Settings Trigger */}
            <button
              onClick={() => setAiSettingsOpen(true)}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition"
              title="Configure Google Gemini API Key"
            >
              <Sparkles size={14} />
              <span className="hidden sm:inline">⚙️ AI Key</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 focus:outline-none bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                  {user?.full_name?.charAt(0) || 'S'}
                </div>
                <span className="hidden sm:inline text-xs font-medium text-slate-200">{user?.full_name || 'Student'}</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-semibold uppercase">
                  {user?.role || 'STUDENT'}
                </span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 text-slate-800 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user?.full_name}</p>
                    <p className="text-[11px] text-slate-500">{user?.email}</p>
                  </div>
                  <Link
                    to="/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center px-4 py-2 text-xs hover:bg-slate-50 text-slate-700"
                  >
                    <User size={14} className="mr-2 text-slate-400" /> Account Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium"
                  >
                    <LogOut size={14} className="mr-2" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">STUDENT MODULES</p>
          <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'hover:bg-slate-800 hover:text-white text-slate-300'
                  }`}
                >
                  <Icon size={17} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-slate-800">
            <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/60">
              <div className="flex items-center space-x-2 text-blue-400 text-xs font-semibold mb-1">
                <Sparkles size={14} />
                <span>AI Assistant Ready</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">Ask questions & generate custom plans 24/7.</p>
            </div>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)}></div>
            <div className="relative w-72 bg-slate-900 text-slate-300 p-4 flex flex-col h-full z-10">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center space-x-2">
                  <img src="/college_logo.png" alt="Logo" className="w-7 h-7" />
                  <span className="font-bold text-white text-sm">AI STUDY PLANNER</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <Icon size={17} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content View */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>

      <AISettingsModal isOpen={aiSettingsOpen} onClose={() => setAiSettingsOpen(false)} />
    </div>
  );
};
