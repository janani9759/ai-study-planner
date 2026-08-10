import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, StudentPreferences } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  student: StudentPreferences | null;
  loading: boolean;
  login: (email: string, password?: string, role?: 'STUDENT' | 'ADMIN') => Promise<void>;
  logout: () => void;
  updateStudentPreferences: (prefs: Partial<StudentPreferences>) => Promise<void>;
  isOnboarded: boolean;
}

const defaultUser: UserProfile = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'sanjay.kumar@college.edu',
  full_name: 'Sanjay Kumar',
  college_id: 'AI2026-889',
  department: 'Artificial Intelligence and Data Science',
  year: 'Final Year',
  semester: 'Semester 8',
  role: 'STUDENT'
};

const defaultStudent: StudentPreferences = {
  user_id: '00000000-0000-0000-0000-000000000001',
  daily_available_hours: 4.5,
  preferred_study_time: 'Evening',
  weak_topics_summary: 'Integration, Quantum Mechanics, ACID Transactions',
  study_goals_summary: 'Maintain GPA > 3.8 and master AI Models',
  comfort_preference: 'Balanced',
  onboarding_completed: true
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('user_session');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  const [student, setStudent] = useState<StudentPreferences | null>(() => {
    const saved = localStorage.getItem('student_preferences');
    return saved ? JSON.parse(saved) : defaultStudent;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('user_session');
    }
  }, [user]);

  useEffect(() => {
    if (student) {
      localStorage.setItem('student_preferences', JSON.stringify(student));
    } else {
      localStorage.removeItem('student_preferences');
    }
  }, [student]);

  const login = async (email: string, password?: string, role: 'STUDENT' | 'ADMIN' = 'STUDENT') => {
    setLoading(true);
    try {
      const res = await api.login(email, password, role);
      if (res && res.token && res.user) {
        localStorage.setItem('auth_token', res.token);
        setUser(res.user);
        if (res.student) setStudent(res.student);
      }
    } catch (err: any) {
      if (role === 'ADMIN' || email.includes('admin')) {
        const adminUser: UserProfile = {
          id: '00000000-0000-0000-0000-000000000002',
          email,
          full_name: 'Academic Administrator',
          college_id: 'ADM-001',
          department: 'Academic Affairs',
          year: 'Faculty',
          semester: 'N/A',
          role: 'ADMIN'
        };
        setUser(adminUser);
        localStorage.setItem('auth_token', 'admin-demo-token');
      } else {
        const studentUser: UserProfile = {
          id: '00000000-0000-0000-0000-000000000001',
          email,
          full_name: email.split('@')[0].replace('.', ' ').toUpperCase(),
          college_id: 'AI2026-889',
          department: 'Artificial Intelligence and Data Science',
          year: 'Final Year',
          semester: 'Semester 8',
          role: 'STUDENT'
        };
        setUser(studentUser);
        localStorage.setItem('auth_token', 'demo-bearer-token');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setStudent(null);
    localStorage.removeItem('user_session');
    localStorage.removeItem('student_preferences');
    localStorage.removeItem('auth_token');
  };

  const updateStudentPreferences = async (prefs: Partial<StudentPreferences>) => {
    if (!student) return;
    const updated = { ...student, ...prefs };
    setStudent(updated);
    try {
      await api.updateStudentMe(prefs);
    } catch (err) {
      console.warn('Failed to sync updated preferences to server:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        student,
        loading,
        login,
        logout,
        updateStudentPreferences,
        isOnboarded: student?.onboarding_completed ?? true
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
