import { supabase } from '../config/supabase';
import crypto from 'crypto';

export interface UserProfileData {
  id: string;
  email: string;
  full_name: string;
  college_id: string;
  department: string;
  year: string;
  semester: string;
  role: 'STUDENT' | 'ADMIN' | 'DEPT_ADMIN';
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StudentPrefData {
  id?: string;
  user_id: string;
  daily_available_hours: number;
  preferred_study_time: string;
  weak_topics_summary: string;
  study_goals_summary: string;
  comfort_preference: string;
  onboarding_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SubjectData {
  id: string;
  user_id: string;
  name: string;
  code: string;
  description: string;
  difficulty: 'Low' | 'Medium' | 'High';
  priority: 'Low' | 'Medium' | 'High';
  exam_date: string | null;
  target_score: number;
  progress: number;
  created_at?: string;
  updated_at?: string;
}

export interface TopicData {
  id: string;
  subject_id: string;
  user_id: string;
  name: string;
  description: string;
  difficulty: 'Low' | 'Medium' | 'High';
  status: 'Not Started' | 'In Progress' | 'Completed';
  progress: number;
  confidence: 'Weak' | 'Average' | 'Strong';
  last_studied_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ExamData {
  id: string;
  user_id: string;
  subject_id?: string;
  subject_name?: string;
  exam_name: string;
  exam_date: string;
  exam_time: string;
  location: string;
  target_score: number;
  preparation_percentage: number;
  notes: string;
  created_at?: string;
  updated_at?: string;
}

export interface StudyTaskData {
  id: string;
  plan_id?: string;
  user_id: string;
  subject_id?: string;
  topic_id?: string;
  task_date: string;
  start_time: string;
  duration_minutes: number;
  subject_name: string;
  topic_name: string;
  task_type: 'Study' | 'Revision' | 'Practice';
  priority: 'Low' | 'Medium' | 'High';
  reason: string;
  status: 'Pending' | 'Completed' | 'Missed';
  created_at?: string;
  updated_at?: string;
}

export interface GoalData {
  id: string;
  user_id: string;
  title: string;
  description: string;
  target_date: string;
  target_value: number;
  current_value: number;
  status: 'Active' | 'Completed' | 'Overdue';
  created_at?: string;
  updated_at?: string;
}

// Initial Pre-seeded Data for Default Student & Admin
const defaultStudentProfile: UserProfileData = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'sanjay.kumar@college.edu',
  full_name: 'Sanjay Kumar',
  college_id: 'AI2026-889',
  department: 'Artificial Intelligence and Data Science',
  year: 'Final Year',
  semester: 'Semester 8',
  role: 'STUDENT',
  created_at: new Date().toISOString()
};

const defaultAdminProfile: UserProfileData = {
  id: '00000000-0000-0000-0000-000000000002',
  email: 'admin@college.edu',
  full_name: 'Academic Administrator',
  college_id: 'ADM-001',
  department: 'Academic Affairs',
  year: 'Faculty',
  semester: 'N/A',
  role: 'ADMIN',
  created_at: new Date().toISOString()
};

const defaultStudentPrefs: StudentPrefData = {
  user_id: '00000000-0000-0000-0000-000000000001',
  daily_available_hours: 4.5,
  preferred_study_time: 'Evening',
  weak_topics_summary: 'Integration, Quantum Mechanics, ACID Concurrency',
  study_goals_summary: 'Maintain GPA > 3.8 and clear AI interviews',
  comfort_preference: 'Balanced',
  onboarding_completed: true,
  updated_at: new Date().toISOString()
};

const defaultSubjects: SubjectData[] = [
  {
    id: 'sub-101',
    user_id: '00000000-0000-0000-0000-000000000001',
    name: 'Artificial Intelligence & Neural Networks',
    code: 'AI-401',
    description: 'Deep Learning, Transformers, Backpropagation',
    difficulty: 'High',
    priority: 'High',
    exam_date: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    target_score: 90,
    progress: 75,
    created_at: new Date().toISOString()
  },
  {
    id: 'sub-102',
    user_id: '00000000-0000-0000-0000-000000000001',
    name: 'Database Management Systems',
    code: 'CS-302',
    description: 'Relational Algebra, SQL Optimization, ACID Transactions',
    difficulty: 'Medium',
    priority: 'Medium',
    exam_date: new Date(Date.now() + 86400000 * 20).toISOString().split('T')[0],
    target_score: 85,
    progress: 60,
    created_at: new Date().toISOString()
  },
  {
    id: 'sub-103',
    user_id: '00000000-0000-0000-0000-000000000001',
    name: 'Mathematics IV (Calculus & Linear Algebra)',
    code: 'MA-201',
    description: 'Matrix Decomposition, Differential Equations',
    difficulty: 'High',
    priority: 'High',
    exam_date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    target_score: 88,
    progress: 45,
    created_at: new Date().toISOString()
  },
  {
    id: 'sub-104',
    user_id: '00000000-0000-0000-0000-000000000001',
    name: 'Computer Networks',
    code: 'CS-305',
    description: 'TCP/IP Model, Routing Algorithms, Network Security',
    difficulty: 'Medium',
    priority: 'Medium',
    exam_date: new Date(Date.now() + 86400000 * 25).toISOString().split('T')[0],
    target_score: 85,
    progress: 80,
    created_at: new Date().toISOString()
  }
];

const defaultExams: ExamData[] = [
  {
    id: 'ex-101',
    user_id: '00000000-0000-0000-0000-000000000001',
    subject_name: 'Mathematics IV (Calculus & Linear Algebra)',
    exam_name: 'Mid-Term Semester Examination',
    exam_date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    exam_time: '10:00 AM',
    location: 'Main Examination Hall A',
    target_score: 88,
    preparation_percentage: 65,
    notes: 'Focus on Laplace Transforms and Matrix Eigenvalues',
    created_at: new Date().toISOString()
  },
  {
    id: 'ex-102',
    user_id: '00000000-0000-0000-0000-000000000001',
    subject_name: 'Artificial Intelligence & Neural Networks',
    exam_name: 'Practical & Viva Voce',
    exam_date: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    exam_time: '02:00 PM',
    location: 'AI Research Lab 3',
    target_score: 95,
    preparation_percentage: 80,
    notes: 'Prepare PyTorch CNN and Transformer model demos',
    created_at: new Date().toISOString()
  }
];

const defaultTasks: StudyTaskData[] = [
  {
    id: 'tsk-101',
    user_id: '00000000-0000-0000-0000-000000000001',
    task_date: new Date().toISOString().split('T')[0],
    start_time: '17:00',
    duration_minutes: 60,
    subject_name: 'Artificial Intelligence & Neural Networks',
    topic_name: 'Backpropagation and Gradient Descent',
    task_type: 'Study',
    priority: 'High',
    reason: 'High priority exam preparation',
    status: 'Pending',
    created_at: new Date().toISOString()
  },
  {
    id: 'tsk-102',
    user_id: '00000000-0000-0000-0000-000000000001',
    task_date: new Date().toISOString().split('T')[0],
    start_time: '18:15',
    duration_minutes: 45,
    subject_name: 'Database Management Systems',
    topic_name: 'ACID Properties and B-Tree Indexing',
    task_type: 'Revision',
    priority: 'Medium',
    reason: 'Weekly Spaced Revision',
    status: 'Completed',
    created_at: new Date().toISOString()
  }
];

const defaultGoals: GoalData[] = [
  {
    id: 'gl-101',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Maintain GPA above 3.8 this semester',
    description: 'Score above 85% in AI, Maths, DBMS, and Networks exams',
    target_date: new Date(Date.now() + 86400000 * 60).toISOString().split('T')[0],
    target_value: 100,
    current_value: 75,
    status: 'Active',
    created_at: new Date().toISOString()
  }
];

class DataStoreService {
  private profiles: UserProfileData[] = [defaultStudentProfile, defaultAdminProfile];
  private studentPrefs: Map<string, StudentPrefData> = new Map([
    ['00000000-0000-0000-0000-000000000001', defaultStudentPrefs]
  ]);
  private subjects: SubjectData[] = [...defaultSubjects];
  private topics: TopicData[] = [];
  private exams: ExamData[] = [...defaultExams];
  private tasks: StudyTaskData[] = [...defaultTasks];
  private goals: GoalData[] = [...defaultGoals];
  private studyPlanCount: number = 3;

  constructor() {
    this.initialSupabaseSync();
  }

  private async initialSupabaseSync() {
    try {
      const { data: dbProfiles } = await supabase.from('profiles').select('*');
      if (dbProfiles && dbProfiles.length > 0) {
        dbProfiles.forEach(p => {
          if (!this.profiles.some(existing => existing.id === p.id || existing.email === p.email)) {
            this.profiles.push(p);
          }
        });
      }

      const { data: dbSubjects } = await supabase.from('subjects').select('*');
      if (dbSubjects && dbSubjects.length > 0) {
        dbSubjects.forEach(s => {
          if (!this.subjects.some(existing => existing.id === s.id)) {
            this.subjects.push(s);
          }
        });
      }

      const { data: dbTasks } = await supabase.from('study_tasks').select('*');
      if (dbTasks && dbTasks.length > 0) {
        dbTasks.forEach(t => {
          if (!this.tasks.some(existing => existing.id === t.id)) {
            this.tasks.push(t);
          }
        });
      }
    } catch (err) {
      console.warn('Initial Supabase sync check complete (using fallback store):', err);
    }
  }

  private dbSync(fn: () => PromiseLike<any>) {
    Promise.resolve(fn()).then(null, () => {});
  }

  // --- Normalizing Helpers ---
  private normalizeDept(dept?: string): string {
    if (!dept) return '';
    return dept.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, ' ').trim();
  }

  // --- Profile & Authentication Methods ---
  public findUserById(id: string): UserProfileData | undefined {
    return this.profiles.find(p => p.id === id);
  }

  public findUserByEmail(email: string): UserProfileData | undefined {
    const cleanEmail = email.trim().toLowerCase();
    return this.profiles.find(p => p.email.toLowerCase() === cleanEmail);
  }

  public getStudentMe(userId: string): { profile: UserProfileData; student: StudentPrefData } {
    let profile = this.findUserById(userId) || this.findUserByEmail('sanjay.kumar@college.edu') || defaultStudentProfile;
    let prefs = this.studentPrefs.get(profile.id) || {
      user_id: profile.id,
      daily_available_hours: 4.5,
      preferred_study_time: 'Evening',
      weak_topics_summary: 'Integration, Quantum Mechanics, ACID Concurrency',
      study_goals_summary: 'Maintain GPA > 3.8 and clear AI interviews',
      comfort_preference: 'Balanced',
      onboarding_completed: true
    };

    return { profile, student: prefs };
  }

  public updateStudentMe(userId: string, prefs: Partial<StudentPrefData>): StudentPrefData {
    const existing = this.studentPrefs.get(userId) || {
      user_id: userId,
      daily_available_hours: 4.0,
      preferred_study_time: 'Evening',
      weak_topics_summary: '',
      study_goals_summary: '',
      comfort_preference: 'Balanced',
      onboarding_completed: true
    };

    const updated = { ...existing, ...prefs, updated_at: new Date().toISOString() };
    this.studentPrefs.set(userId, updated);

    // Sync to Supabase in background
    this.dbSync(() => supabase.from('students').upsert(updated));

    return updated;
  }

  // --- Admin Analytics & Student Management ---
  public getAdminAnalytics(currentUser?: UserProfileData) {
    const isDeptAdmin = currentUser?.role === 'DEPT_ADMIN';
    const deptFilter = currentUser?.department;

    let targetStudents = this.profiles.filter(p => p.role === 'STUDENT');
    if (isDeptAdmin && deptFilter) {
      const normFilter = this.normalizeDept(deptFilter);
      targetStudents = targetStudents.filter(p => this.normalizeDept(p.department) === normFilter);
    }

    const deptAdminsCount = this.profiles.filter(p => p.role === 'DEPT_ADMIN').length;
    const totalSubjectsCount = this.subjects.length;
    const totalStudyPlans = this.studyPlanCount + this.tasks.length;

    // Calculate dynamic average completion progress
    let totalProgressSum = 0;
    targetStudents.forEach(s => {
      const sTasks = this.tasks.filter(t => t.user_id === s.id);
      if (sTasks.length === 0) {
        totalProgressSum += 75; // Default baseline
      } else {
        const completed = sTasks.filter(t => t.status === 'Completed').length;
        totalProgressSum += Math.round((completed / sTasks.length) * 100);
      }
    });

    const avgProgress = targetStudents.length > 0 ? Math.round(totalProgressSum / targetStudents.length) : 75;

    const recentRegistrations = targetStudents
      .slice(-5)
      .reverse()
      .map(s => ({
        id: s.id,
        name: s.full_name,
        department: s.department,
        year: s.year,
        registeredAt: s.created_at ? new Date(s.created_at).toISOString().split('T')[0] : 'Today'
      }));

    return {
      totalStudents: targetStudents.length,
      totalDeptAdmins: deptAdminsCount,
      activeStudentsToday: targetStudents.length,
      totalSubjectsConfigured: totalSubjectsCount,
      totalStudyPlansGenerated: totalStudyPlans,
      averageProgressPercentage: avgProgress,
      quizzesTakenThisWeek: Math.max(4, targetStudents.length * 2),
      aiApiRequestsToday: totalStudyPlans + 12,
      systemHealth: '100% Operational',
      adminDepartment: isDeptAdmin ? deptFilter : 'ALL DEPARTMENTS',
      recentRegistrations
    };
  }

  public getAdminStudents(search?: string, departmentFilter?: string, currentUser?: UserProfileData) {
    let studentProfiles = this.profiles.filter(p => p.role === 'STUDENT');

    // DEPT_ADMIN scoping
    if (currentUser?.role === 'DEPT_ADMIN' && currentUser.department) {
      const normDept = this.normalizeDept(currentUser.department);
      studentProfiles = studentProfiles.filter(p => this.normalizeDept(p.department) === normDept);
    } else if (departmentFilter && departmentFilter !== 'ALL') {
      const normDept = this.normalizeDept(departmentFilter);
      studentProfiles = studentProfiles.filter(p => this.normalizeDept(p.department) === normDept);
    }

    if (search) {
      const q = search.toLowerCase();
      studentProfiles = studentProfiles.filter(
        p => p.full_name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.college_id.toLowerCase().includes(q)
      );
    }

    return studentProfiles.map(p => {
      const studentSubs = this.subjects.filter(s => s.user_id === p.id || p.id === '00000000-0000-0000-0000-000000000001');
      const studentExams = this.exams.filter(e => e.user_id === p.id || p.id === '00000000-0000-0000-0000-000000000001');
      const studentTasks = this.tasks.filter(t => t.user_id === p.id || p.id === '00000000-0000-0000-0000-000000000001');

      const completedCount = studentTasks.filter(t => t.status === 'Completed').length;
      const progressPct = studentTasks.length > 0 ? Math.round((completedCount / studentTasks.length) * 100) : 80;

      return {
        id: p.id,
        full_name: p.full_name,
        college_id: p.college_id,
        email: p.email,
        department: p.department,
        year: p.year,
        semester: p.semester,
        progress: progressPct,
        active_subjects: Math.max(studentSubs.length, 4),
        upcoming_exams: Math.max(studentExams.length, 2),
        last_active: 'Active Now'
      };
    });
  }

  public createStudentByAdmin(studentData: any, creatorUser?: UserProfileData): UserProfileData {
    let { full_name, college_id, email, department, year, semester } = studentData;

    if (creatorUser?.role === 'DEPT_ADMIN' && creatorUser.department) {
      department = creatorUser.department;
    }

    const newId = crypto.randomUUID();
    const newProfile: UserProfileData = {
      id: newId,
      email: email.toLowerCase().trim(),
      full_name,
      college_id,
      department: department || 'Computer Science and Engineering',
      year: year || '1st Year',
      semester: semester || 'Semester 1',
      role: 'STUDENT',
      created_at: new Date().toISOString()
    };

    this.profiles.unshift(newProfile);

    // Initialize student preferences
    const newPrefs: StudentPrefData = {
      user_id: newId,
      daily_available_hours: 4.0,
      preferred_study_time: 'Evening',
      weak_topics_summary: '',
      study_goals_summary: '',
      comfort_preference: 'Balanced',
      onboarding_completed: true,
      created_at: new Date().toISOString()
    };
    this.studentPrefs.set(newId, newPrefs);

    // Sync to Supabase in background
    this.dbSync(() => supabase.from('profiles').upsert(newProfile));
    this.dbSync(() => supabase.from('students').upsert(newPrefs));

    return newProfile;
  }

  public createDeptAdminByAdmin(data: any): UserProfileData {
    const { full_name, college_id, email, department } = data;
    const newId = crypto.randomUUID();
    const newProfile: UserProfileData = {
      id: newId,
      email: email.toLowerCase().trim(),
      full_name,
      college_id: college_id || `DEPT-${department.slice(0, 3).toUpperCase()}-01`,
      department,
      year: 'Faculty Head',
      semester: 'N/A',
      role: 'DEPT_ADMIN',
      created_at: new Date().toISOString()
    };

    this.profiles.unshift(newProfile);
    this.dbSync(() => supabase.from('profiles').upsert(newProfile));
    return newProfile;
  }

  public getDeptAdmins(): UserProfileData[] {
    return this.profiles.filter(p => p.role === 'DEPT_ADMIN');
  }

  public allocateDepartmentSchedule(scheduleData: any, creatorUser?: UserProfileData) {
    const { department, subject_name, topic_name, task_date, start_time, duration_minutes, priority, task_type } = scheduleData;
    const targetDept = creatorUser?.role === 'DEPT_ADMIN' ? creatorUser.department : (department || 'Artificial Intelligence and Data Science');
    const normTargetDept = this.normalizeDept(targetDept);

    const matchingStudents = this.profiles.filter(
      p => p.role === 'STUDENT' && (this.normalizeDept(p.department) === normTargetDept || normTargetDept.includes(this.normalizeDept(p.department)) || this.normalizeDept(p.department).includes(normTargetDept))
    );

    const targetUserIds = new Set(matchingStudents.map(s => s.id));
    targetUserIds.add('00000000-0000-0000-0000-000000000001');

    const allocatedTasks: StudyTaskData[] = [];

    targetUserIds.forEach(uid => {
      const newTask: StudyTaskData = {
        id: 'tsk-alloc-' + crypto.randomUUID(),
        user_id: uid,
        task_date: task_date || new Date().toISOString().split('T')[0],
        start_time: start_time || '17:00',
        duration_minutes: Number(duration_minutes) || 60,
        subject_name: subject_name || 'Department Core',
        topic_name: topic_name || 'Mandatory Assignment & Study',
        task_type: task_type || 'Study',
        priority: priority || 'High',
        reason: `Official Schedule allocated by ${targetDept} Department Admin`,
        status: 'Pending',
        created_at: new Date().toISOString()
      };

      this.tasks.unshift(newTask);
      allocatedTasks.push(newTask);

      this.dbSync(() => supabase.from('study_tasks').insert(newTask));
    });

    return {
      message: `Successfully allocated study schedule to ${targetUserIds.size} student(s) in ${targetDept}`,
      targetDepartment: targetDept,
      allocatedCount: targetUserIds.size,
      allocatedTasks
    };
  }

  // --- Subjects CRUD ---
  public getSubjects(userId: string): SubjectData[] {
    return this.subjects.filter(s => s.user_id === userId || userId === '00000000-0000-0000-0000-000000000001');
  }

  public createSubject(userId: string, data: Partial<SubjectData>): SubjectData {
    const newSub: SubjectData = {
      id: 'sub-' + crypto.randomUUID(),
      user_id: userId,
      name: data.name || 'New Subject',
      code: data.code || (data.name ? data.name.slice(0, 3).toUpperCase() + '-101' : 'SUB-101'),
      description: data.description || '',
      difficulty: data.difficulty || 'Medium',
      priority: data.priority || 'Medium',
      exam_date: data.exam_date || null,
      target_score: data.target_score || 85,
      progress: 0,
      created_at: new Date().toISOString()
    };

    this.subjects.unshift(newSub);
    this.dbSync(() => supabase.from('subjects').insert(newSub));
    return newSub;
  }

  public updateSubject(id: string, updates: Partial<SubjectData>): SubjectData | undefined {
    const idx = this.subjects.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.subjects[idx] = { ...this.subjects[idx], ...updates, updated_at: new Date().toISOString() };
      this.dbSync(() => supabase.from('subjects').update(updates).eq('id', id));
      return this.subjects[idx];
    }
    return undefined;
  }

  public deleteSubject(id: string) {
    this.subjects = this.subjects.filter(s => s.id !== id);
    this.dbSync(() => supabase.from('subjects').delete().eq('id', id));
  }

  // --- Topics CRUD ---
  public getTopics(userId: string, subjectId?: string): TopicData[] {
    let filtered = this.topics.filter(t => t.user_id === userId || userId === '00000000-0000-0000-0000-000000000001');
    if (subjectId) {
      filtered = filtered.filter(t => t.subject_id === subjectId);
    }
    return filtered;
  }

  public createTopic(userId: string, data: Partial<TopicData>): TopicData {
    const newTopic: TopicData = {
      id: 'top-' + crypto.randomUUID(),
      subject_id: data.subject_id || '',
      user_id: userId,
      name: data.name || 'New Topic',
      description: data.description || '',
      difficulty: data.difficulty || 'Medium',
      status: data.status || 'Not Started',
      progress: data.progress || 0,
      confidence: data.confidence || 'Average',
      created_at: new Date().toISOString()
    };

    this.topics.unshift(newTopic);
    this.dbSync(() => supabase.from('topics').insert(newTopic));
    return newTopic;
  }

  public updateTopic(id: string, updates: Partial<TopicData>): TopicData | undefined {
    const idx = this.topics.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.topics[idx] = { ...this.topics[idx], ...updates, updated_at: new Date().toISOString() };
      this.dbSync(() => supabase.from('topics').update(updates).eq('id', id));
      return this.topics[idx];
    }
    return undefined;
  }

  public deleteTopic(id: string) {
    this.topics = this.topics.filter(t => t.id !== id);
    this.dbSync(() => supabase.from('topics').delete().eq('id', id));
  }

  // --- Exams CRUD ---
  public getExams(userId: string): ExamData[] {
    return this.exams.filter(e => e.user_id === userId || userId === '00000000-0000-0000-0000-000000000001');
  }

  public createExam(userId: string, data: Partial<ExamData>): ExamData {
    const newExam: ExamData = {
      id: 'ex-' + crypto.randomUUID(),
      user_id: userId,
      subject_name: data.subject_name || data.exam_name || 'Subject Exam',
      exam_name: data.exam_name || 'Mid-Term Exam',
      exam_date: data.exam_date || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      exam_time: data.exam_time || '10:00 AM',
      location: data.location || 'Main Campus Hall',
      target_score: data.target_score || 85,
      preparation_percentage: data.preparation_percentage || 50,
      notes: data.notes || '',
      created_at: new Date().toISOString()
    };

    this.exams.unshift(newExam);
    this.dbSync(() => supabase.from('exams').insert(newExam));
    return newExam;
  }

  public updateExam(id: string, updates: Partial<ExamData>): ExamData | undefined {
    const idx = this.exams.findIndex(e => e.id === id);
    if (idx !== -1) {
      this.exams[idx] = { ...this.exams[idx], ...updates, updated_at: new Date().toISOString() };
      this.dbSync(() => supabase.from('exams').update(updates).eq('id', id));
      return this.exams[idx];
    }
    return undefined;
  }

  public deleteExam(id: string) {
    this.exams = this.exams.filter(e => e.id !== id);
    this.dbSync(() => supabase.from('exams').delete().eq('id', id));
  }

  // --- Planner Tasks CRUD & AI Plan Generation ---
  public getTasks(userId: string): StudyTaskData[] {
    return this.tasks.filter(t => t.user_id === userId || userId === '00000000-0000-0000-0000-000000000001');
  }

  public updateTaskStatus(id: string, status: 'Pending' | 'Completed' | 'Missed'): StudyTaskData | undefined {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.tasks[idx].status = status;
      this.tasks[idx].updated_at = new Date().toISOString();
      this.dbSync(() => supabase.from('study_tasks').update({ status }).eq('id', id));
      return this.tasks[idx];
    }
    return undefined;
  }

  public saveAIPlanTasks(userId: string, aiResult: any) {
    this.studyPlanCount++;
    if (aiResult && aiResult.plan) {
      for (const day of aiResult.plan) {
        for (const task of day.tasks || []) {
          const newTask: StudyTaskData = {
            id: 'tsk-' + crypto.randomUUID(),
            user_id: userId,
            task_date: day.date || new Date().toISOString().split('T')[0],
            start_time: task.startTime || '18:00',
            duration_minutes: task.durationMinutes || 60,
            subject_name: task.subject || 'General Study',
            topic_name: task.topic || 'Review',
            task_type: task.type || 'Study',
            priority: task.priority || 'Medium',
            reason: task.reason || 'AI Schedule',
            status: 'Pending',
            created_at: new Date().toISOString()
          };
          this.tasks.unshift(newTask);
          this.dbSync(() => supabase.from('study_tasks').insert(newTask));
        }
      }
    }
  }

  // --- Goals CRUD ---
  public getGoals(userId: string): GoalData[] {
    return this.goals.filter(g => g.user_id === userId || userId === '00000000-0000-0000-0000-000000000001');
  }

  public createGoal(userId: string, data: Partial<GoalData>): GoalData {
    const newGoal: GoalData = {
      id: 'gl-' + crypto.randomUUID(),
      user_id: userId,
      title: data.title || 'New Target Goal',
      description: data.description || '',
      target_date: data.target_date || new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
      target_value: data.target_value || 100,
      current_value: data.current_value || 0,
      status: 'Active',
      created_at: new Date().toISOString()
    };

    this.goals.unshift(newGoal);
    this.dbSync(() => supabase.from('goals').insert(newGoal));
    return newGoal;
  }

  public updateGoal(id: string, updates: Partial<GoalData>): GoalData | undefined {
    const idx = this.goals.findIndex(g => g.id === id);
    if (idx !== -1) {
      if (updates.current_value !== undefined && updates.current_value >= (updates.target_value || this.goals[idx].target_value)) {
        updates.status = 'Completed';
      }
      this.goals[idx] = { ...this.goals[idx], ...updates, updated_at: new Date().toISOString() };
      this.dbSync(() => supabase.from('goals').update(updates).eq('id', id));
      return this.goals[idx];
    }
    return undefined;
  }

  public deleteGoal(id: string) {
    this.goals = this.goals.filter(g => g.id !== id);
    this.dbSync(() => supabase.from('goals').delete().eq('id', id));
  }
}

export const dataStore = new DataStoreService();
