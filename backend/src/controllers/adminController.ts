import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { dataStore } from '../services/dataStore';

export const getAdminAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const analytics = dataStore.getAdminAnalytics(user);
    res.status(200).json(analytics);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAdminStudents = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const { search, department } = req.query;

    const students = dataStore.getAdminStudents(
      search ? String(search) : undefined,
      department ? String(department) : undefined,
      user
    );

    res.status(200).json(students);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createStudentByAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    let { full_name, college_id, email, password, department, year, semester } = req.body;

    if (!full_name || !college_id || !email || !password) {
      return res.status(400).json({ error: 'Full name, college ID, email, and password are required' });
    }

    const newStudent = dataStore.createStudentByAdmin(req.body, user);

    res.status(201).json({
      message: `Student account created for ${newStudent.department}`,
      student: newStudent
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create student' });
  }
};

export const createDeptAdminByAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { full_name, college_id, email, password, department } = req.body;

    if (!full_name || !email || !password || !department) {
      return res.status(400).json({ error: 'Full name, email, password, and department are required' });
    }

    const newDeptAdmin = dataStore.createDeptAdminByAdmin(req.body);

    res.status(201).json({
      message: `Department Admin created for ${department}`,
      deptAdmin: newDeptAdmin
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create Department Admin' });
  }
};

export const getDeptAdmins = async (req: AuthRequest, res: Response) => {
  try {
    const deptAdmins = dataStore.getDeptAdmins();
    res.status(200).json(deptAdmins);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const allocateDepartmentSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const result = dataStore.allocateDepartmentSchedule(req.body, user);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to allocate department schedule' });
  }
};
