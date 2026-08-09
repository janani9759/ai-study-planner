export type UserRole = 'STUDENT' | 'ADMIN';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  college_id: string;
  department: string;
  year: string;
  semester: string;
  role: UserRole;
  avatar_url?: string;
}

export interface StudentPreferences {
  user_id: string;
  daily_available_hours: number;
  preferred_study_time: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  weak_topics_summary: string;
  study_goals_summary: string;
  comfort_preference: string;
  onboarding_completed: boolean;
}

export interface Subject {
  id: string;
  user_id?: string;
  name: string;
  code: string;
  description?: string;
  difficulty: 'Low' | 'Medium' | 'High';
  priority: 'Low' | 'Medium' | 'High';
  exam_date?: string;
  target_score: number;
  progress: number;
  topics?: Topic[];
}

export interface Topic {
  id: string;
  subject_id: string;
  subject_name?: string;
  user_id?: string;
  name: string;
  description?: string;
  difficulty: 'Low' | 'Medium' | 'High';
  status: 'Not Started' | 'In Progress' | 'Completed';
  progress: number;
  confidence: 'Weak' | 'Average' | 'Strong';
  last_studied_at?: string;
}

export interface Exam {
  id: string;
  user_id?: string;
  subject_id?: string;
  subject_name?: string;
  exam_name: string;
  exam_date: string;
  exam_time?: string;
  location?: string;
  target_score: number;
  preparation_percentage: number;
  notes?: string;
}

export interface StudyTask {
  id: string;
  plan_id?: string;
  user_id?: string;
  task_date: string;
  start_time: string;
  duration_minutes: number;
  subject_name: string;
  topic_name: string;
  task_type: 'Study' | 'Revision' | 'Practice';
  priority: 'Low' | 'Medium' | 'High';
  reason?: string;
  status: 'Pending' | 'Completed' | 'Missed';
}

export interface ComfortCheckPayload {
  id?: string;
  feeling: 'Very Comfortable' | 'Comfortable' | 'Normal' | 'Stressed' | 'Tired' | 'Overwhelmed';
  workload_difficulty: 'Very Easy' | 'Easy' | 'Moderate' | 'Difficult' | 'Very Difficult';
  notes?: string;
  logged_at?: string;
}

export interface BrainDumpAnalysis {
  aiSummary: string;
  detectedPriorities: { subject: string; priority: string; reason: string }[];
  suggestedActions: { action: string; duration: string; recommendedTime: string }[];
  encouragement: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizResult {
  id: string;
  subject_name: string;
  topic_name: string;
  difficulty: string;
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  answers_json?: any;
  ai_recommendation?: string;
  taken_at?: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  target_date: string;
  target_value: number;
  current_value: number;
  status: 'Active' | 'Completed' | 'Overdue';
}

export interface ProgressSummary {
  overallProgress: number;
  completedHoursToday: number;
  completedTasksToday: number;
  pendingTasksToday: number;
  currentStreakDays: number;
  weeklyHours: { day: string; hours: number; target: number }[];
  subjectProgress: { subject: string; progress: number; target: number }[];
  quizPerformance: { quiz: string; score: number }[];
}
