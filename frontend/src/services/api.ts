import {
  UserProfile,
  StudentPreferences,
  Subject,
  Topic,
  Exam,
  StudyTask,
  ComfortCheckPayload,
  BrainDumpAnalysis,
  QuizResult,
  Goal,
  ProgressSummary
} from '../types';

const API_BASE_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('auth_token') || 'demo-bearer-token';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorData.error || 'API Request Failed');
  }
  return res.json();
}

export const api = {
  // Auth
  async login(email: string, password?: string, role: string = 'STUDENT'): Promise<{ token: string; user: UserProfile; student?: StudentPreferences }> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    return handleResponse(res);
  },

  async syncProfile(profileData: Partial<UserProfile>): Promise<{ profile: UserProfile }> {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(profileData)
    });
    return handleResponse(res);
  },

  // Student Profile
  async getStudentMe(): Promise<{ profile: UserProfile; student: StudentPreferences }> {
    const res = await fetch(`${API_BASE_URL}/students/me`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async updateStudentMe(data: Partial<StudentPreferences>): Promise<{ student: StudentPreferences }> {
    const res = await fetch(`${API_BASE_URL}/students/me`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Subjects
  async getSubjects(): Promise<Subject[]> {
    const res = await fetch(`${API_BASE_URL}/subjects`, { headers: getHeaders() });
    return handleResponse(res);
  },

  async createSubject(subject: Partial<Subject>): Promise<Subject> {
    const res = await fetch(`${API_BASE_URL}/subjects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(subject)
    });
    return handleResponse(res);
  },

  async updateSubject(id: string, updates: Partial<Subject>): Promise<Subject> {
    const res = await fetch(`${API_BASE_URL}/subjects/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    return handleResponse(res);
  },

  async deleteSubject(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/subjects/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    await handleResponse(res);
  },

  // Topics
  async getTopics(subjectId?: string): Promise<Topic[]> {
    const url = subjectId ? `${API_BASE_URL}/topics?subjectId=${subjectId}` : `${API_BASE_URL}/topics`;
    const res = await fetch(url, { headers: getHeaders() });
    return handleResponse(res);
  },

  async createTopic(topic: Partial<Topic>): Promise<Topic> {
    const res = await fetch(`${API_BASE_URL}/topics`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(topic)
    });
    return handleResponse(res);
  },

  async updateTopic(id: string, updates: Partial<Topic>): Promise<Topic> {
    const res = await fetch(`${API_BASE_URL}/topics/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    return handleResponse(res);
  },

  async deleteTopic(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/topics/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    await handleResponse(res);
  },

  // Exams
  async getExams(): Promise<Exam[]> {
    const res = await fetch(`${API_BASE_URL}/exams`, { headers: getHeaders() });
    return handleResponse(res);
  },

  async createExam(exam: Partial<Exam>): Promise<Exam> {
    const res = await fetch(`${API_BASE_URL}/exams`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(exam)
    });
    return handleResponse(res);
  },

  async updateExam(id: string, updates: Partial<Exam>): Promise<Exam> {
    const res = await fetch(`${API_BASE_URL}/exams/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    return handleResponse(res);
  },

  async deleteExam(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/exams/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    await handleResponse(res);
  },

  // Study Planner & AI Endpoints
  async generateAIStudyPlan(payload: any): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/planner/generate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async getTasks(): Promise<StudyTask[]> {
    const res = await fetch(`${API_BASE_URL}/planner/tasks`, { headers: getHeaders() });
    return handleResponse(res);
  },

  async updateTaskStatus(taskId: string, status: 'Pending' | 'Completed' | 'Missed'): Promise<StudyTask> {
    const res = await fetch(`${API_BASE_URL}/planner/tasks/${taskId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  async rescheduleMissedTasks(payload: any): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/planner/reschedule`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  // AI Modules
  async analyzeBrainDump(rawText: string, studentContext?: any): Promise<BrainDumpAnalysis> {
    const res = await fetch(`${API_BASE_URL}/ai/brain-dump`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ rawText, studentContext })
    });
    return handleResponse(res);
  },

  async generateQuiz(subject: string, topic: string, questionCount: number, difficulty: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/ai/quiz`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ subject, topic, questionCount, difficulty })
    });
    return handleResponse(res);
  },

  async sendAIChatMessage(message: string, history?: any[], studentContext?: any): Promise<{ response: string }> {
    const res = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ message, history, studentContext })
    });
    return handleResponse(res);
  },

  async explainTopicAI(subject: string, topic: string, confidence?: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/ai/explain`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ subject, topic, confidence })
    });
    return handleResponse(res);
  },

  // Comfort Feedback
  async submitComfortCheck(data: Partial<ComfortCheckPayload>): Promise<ComfortCheckPayload> {
    const res = await fetch(`${API_BASE_URL}/comfort`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async getComfortHistory(): Promise<ComfortCheckPayload[]> {
    const res = await fetch(`${API_BASE_URL}/comfort`, { headers: getHeaders() });
    return handleResponse(res);
  },

  // Quizzes
  async saveQuizResult(result: Partial<QuizResult>): Promise<QuizResult> {
    const res = await fetch(`${API_BASE_URL}/quizzes/results`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(result)
    });
    return handleResponse(res);
  },

  async getQuizResults(): Promise<QuizResult[]> {
    const res = await fetch(`${API_BASE_URL}/quizzes/results`, { headers: getHeaders() });
    return handleResponse(res);
  },

  // Progress
  async getProgressSummary(): Promise<ProgressSummary> {
    const res = await fetch(`${API_BASE_URL}/progress`, { headers: getHeaders() });
    return handleResponse(res);
  },

  // Goals
  async getGoals(): Promise<Goal[]> {
    const res = await fetch(`${API_BASE_URL}/goals`, { headers: getHeaders() });
    return handleResponse(res);
  },

  async createGoal(goal: Partial<Goal>): Promise<Goal> {
    const res = await fetch(`${API_BASE_URL}/goals`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(goal)
    });
    return handleResponse(res);
  },

  async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal> {
    const res = await fetch(`${API_BASE_URL}/goals/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    return handleResponse(res);
  },

  async deleteGoal(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/goals/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    await handleResponse(res);
  },

  // Admin
  async getAdminAnalytics(): Promise<any> {
    const token = localStorage.getItem('auth_token') || 'admin-demo-token';
    const res = await fetch(`${API_BASE_URL}/admin/analytics`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(res);
  },

  async getAdminStudents(search?: string): Promise<any[]> {
    const token = localStorage.getItem('auth_token') || 'admin-demo-token';
    const url = search ? `${API_BASE_URL}/admin/students?search=${encodeURIComponent(search)}` : `${API_BASE_URL}/admin/students`;
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(res);
  },

  async createAdminStudent(studentData: any): Promise<any> {
    const token = localStorage.getItem('auth_token') || 'admin-demo-token';
    const res = await fetch(`${API_BASE_URL}/admin/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(studentData)
    });
    return handleResponse(res);
  },

  async createDeptAdmin(deptAdminData: any): Promise<any> {
    const token = localStorage.getItem('auth_token') || 'admin-demo-token';
    const res = await fetch(`${API_BASE_URL}/admin/dept-admins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(deptAdminData)
    });
    return handleResponse(res);
  },

  async getDeptAdmins(): Promise<any[]> {
    const token = localStorage.getItem('auth_token') || 'admin-demo-token';
    const res = await fetch(`${API_BASE_URL}/admin/dept-admins`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(res);
  },

  async allocateDepartmentSchedule(scheduleData: any): Promise<any> {
    const token = localStorage.getItem('auth_token') || 'admin-demo-token';
    const res = await fetch(`${API_BASE_URL}/admin/allocate-schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(scheduleData)
    });
    return handleResponse(res);
  }
};
