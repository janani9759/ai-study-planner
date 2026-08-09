import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PlannerProvider } from './contexts/PlannerContext';
import { DashboardLayout } from './layouts/DashboardLayout';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { OnboardingWizard } from './pages/OnboardingWizard';
import { Dashboard } from './pages/Dashboard';
import { Subjects } from './pages/Subjects';
import { Topics } from './pages/Topics';
import { Exams } from './pages/Exams';
import { StudyPlanner } from './pages/StudyPlanner';
import { CalendarView } from './pages/CalendarView';
import { SmartLearning } from './pages/SmartLearning';
import { ComfortCheck } from './pages/ComfortCheck';
import { BrainDump } from './pages/BrainDump';
import { SmartRevision } from './pages/SmartRevision';
import { Quizzes } from './pages/Quizzes';
import { ProgressTracker } from './pages/ProgressTracker';
import { Goals } from './pages/Goals';
import { AIAssistant } from './pages/AIAssistant';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminStudents } from './pages/AdminStudents';
import { Settings } from './pages/Settings';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAdmin?: boolean }> = ({ children, requireAdmin }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlannerProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/onboarding" element={<OnboardingWizard />} />

            {/* Protected Student Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
            <Route path="/topics" element={<ProtectedRoute><Topics /></ProtectedRoute>} />
            <Route path="/exams" element={<ProtectedRoute><Exams /></ProtectedRoute>} />
            <Route path="/planner" element={<ProtectedRoute><StudyPlanner /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
            <Route path="/smart-learning" element={<ProtectedRoute><SmartLearning /></ProtectedRoute>} />
            <Route path="/comfort" element={<ProtectedRoute><ComfortCheck /></ProtectedRoute>} />
            <Route path="/brain-dump" element={<ProtectedRoute><BrainDump /></ProtectedRoute>} />
            <Route path="/revision" element={<ProtectedRoute><SmartRevision /></ProtectedRoute>} />
            <Route path="/quizzes" element={<ProtectedRoute><Quizzes /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><ProgressTracker /></ProtectedRoute>} />
            <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
            <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/students" element={<ProtectedRoute requireAdmin><AdminStudents /></ProtectedRoute>} />

            {/* Default Catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </PlannerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
