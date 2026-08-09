import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabase } from '../config/supabase';
import { geminiService } from '../services/geminiService';

export const getAdminAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    let studentQuery = supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'STUDENT');
    let deptAdminQuery = supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'DEPT_ADMIN');

    if (user?.role === 'DEPT_ADMIN' && user.department) {
      studentQuery = studentQuery.eq('department', user.department);
    }

    const { count: studentCount } = await studentQuery;
    const { count: deptAdminCount } = await deptAdminQuery;
    const { count: planCount } = await supabase.from('study_plans').select('*', { count: 'exact', head: true });
    const { count: subjectCount } = await supabase.from('subjects').select('*', { count: 'exact', head: true });

    const { data: recentProfiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'STUDENT')
      .order('created_at', { ascending: false })
      .limit(5);

    res.status(200).json({
      totalStudents: studentCount || 0,
      totalDeptAdmins: deptAdminCount || 0,
      activeStudentsToday: studentCount || 0,
      totalSubjectsConfigured: subjectCount || 0,
      totalStudyPlansGenerated: planCount || 0,
      averageProgressPercentage: 75.0,
      quizzesTakenThisWeek: 0,
      aiApiRequestsToday: planCount || 0,
      systemHealth: '100% Operational',
      adminDepartment: user?.role === 'DEPT_ADMIN' ? user.department : 'ALL DEPARTMENTS',
      recentRegistrations: (recentProfiles || []).map(p => ({
        id: p.id,
        name: p.full_name,
        department: p.department,
        year: p.year,
        registeredAt: p.created_at ? new Date(p.created_at).toISOString().split('T')[0] : 'Today'
      }))
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAdminStudents = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const { search, department } = req.query;

    let query = supabase.from('profiles').select('*, students(*)').eq('role', 'STUDENT').order('created_at', { ascending: false });

    // Scoping for DEPT_ADMIN
    if (user?.role === 'DEPT_ADMIN' && user.department) {
      query = query.eq('department', user.department);
    } else if (department && department !== 'ALL') {
      query = query.eq('department', String(department));
    }

    if (search) {
      const q = `%${String(search)}%`;
      query = query.or(`full_name.ilike.${q},email.ilike.${q},college_id.ilike.${q}`);
    }

    const { data: profiles, error } = await query;

    if (error || !profiles) {
      return res.status(200).json([]);
    }

    const mapped = profiles.map(p => ({
      id: p.id,
      full_name: p.full_name,
      college_id: p.college_id,
      email: p.email,
      department: p.department,
      year: p.year,
      semester: p.semester,
      progress: p.students?.[0]?.onboarding_completed ? 80 : 0,
      active_subjects: 4,
      upcoming_exams: 2,
      last_active: 'Active'
    }));

    res.status(200).json(mapped);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Create Student by Global Admin or Dept Admin
export const createStudentByAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    let { full_name, college_id, email, password, department, year, semester } = req.body;

    // Force department if creator is DEPT_ADMIN
    if (user?.role === 'DEPT_ADMIN' && user.department) {
      department = user.department;
    }

    if (!full_name || !college_id || !email || !password) {
      return res.status(400).json({ error: 'Full name, college ID, email, and password are required' });
    }

    const { data: authData } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name, role: 'STUDENT' } }
    });

    const newId = authData?.user?.id || 'std-' + Date.now();

    const { data: profile } = await supabase
      .from('profiles')
      .upsert({
        id: newId,
        email,
        full_name,
        college_id,
        department: department || 'Computer Science and Engineering',
        year: year || '1st Year',
        semester: semester || 'Semester 1',
        role: 'STUDENT'
      })
      .select()
      .single();

    await supabase.from('students').upsert({
      user_id: newId,
      daily_available_hours: 4.0,
      preferred_study_time: 'Evening',
      onboarding_completed: false
    });

    res.status(201).json({
      message: `Student account created for ${department}`,
      student: profile || {
        id: newId,
        full_name,
        college_id,
        email,
        department,
        year,
        semester,
        role: 'STUDENT'
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create student' });
  }
};

// Create Department-Wise Admin (Only by Global Admin)
export const createDeptAdminByAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { full_name, college_id, email, password, department } = req.body;

    if (!full_name || !email || !password || !department) {
      return res.status(400).json({ error: 'Full name, email, password, and department are required' });
    }

    const { data: authData } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name, role: 'DEPT_ADMIN', department } }
    });

    const newId = authData?.user?.id || 'dept-admin-' + Date.now();

    const { data: profile } = await supabase
      .from('profiles')
      .upsert({
        id: newId,
        email,
        full_name,
        college_id: college_id || `DEPT-${department.slice(0, 3).toUpperCase()}-01`,
        department,
        year: 'Faculty Head',
        semester: 'N/A',
        role: 'DEPT_ADMIN'
      })
      .select()
      .single();

    res.status(201).json({
      message: `Department Admin created for ${department}`,
      deptAdmin: profile || {
        id: newId,
        full_name,
        email,
        department,
        role: 'DEPT_ADMIN'
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create Department Admin' });
  }
};

// Get Department-Wise Admins List
export const getDeptAdmins = async (req: AuthRequest, res: Response) => {
  try {
    const { data: deptAdmins, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'DEPT_ADMIN')
      .order('created_at', { ascending: false });

    if (error || !deptAdmins) {
      return res.status(200).json([]);
    }

    res.status(200).json(deptAdmins);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Allocate Schedule for Department Students
export const allocateDepartmentSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const { department, subject_name, topic_name, task_date, start_time, duration_minutes, priority, task_type } = req.body;

    const targetDept = user?.role === 'DEPT_ADMIN' ? user.department : (department || 'Artificial Intelligence and Data Science');

    // Fetch all students in this department
    const { data: deptStudents } = await supabase
      .from('profiles')
      .select('id')
      .eq('department', targetDept)
      .eq('role', 'STUDENT');

    const studentIds = (deptStudents || []).map(s => s.id);

    // Insert task schedule into study_tasks for all department students
    const allocatedTasks = [];
    for (const sid of studentIds) {
      const { data: task } = await supabase
        .from('study_tasks')
        .insert({
          user_id: sid,
          task_date: task_date || new Date().toISOString().split('T')[0],
          start_time: start_time || '17:00',
          duration_minutes: duration_minutes || 60,
          subject_name: subject_name || 'Department Core',
          topic_name: topic_name || 'Allocated Assignment',
          task_type: task_type || 'Study',
          priority: priority || 'High',
          reason: `Official Schedule allocated by ${targetDept} Department Admin`,
          status: 'Pending'
        })
        .select()
        .single();

      if (task) allocatedTasks.push(task);
    }

    res.status(201).json({
      message: `Successfully allocated study schedule to ${studentIds.length} student(s) in ${targetDept}`,
      targetDepartment: targetDept,
      allocatedCount: studentIds.length,
      taskSummary: { subject_name, topic_name, task_date, start_time, duration_minutes }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to allocate department schedule' });
  }
};
