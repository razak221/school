import { Router, Request, Response } from 'express';
import { verifyToken, requireRole } from '../middleware/auth';
import { User } from '../models/User';
import { StudentProfile } from '../models/StudentProfile';
import { TeacherProfile } from '../models/TeacherProfile';
import { ParentProfile } from '../models/ParentProfile';
import { ClassSection } from '../models/ClassSection';
import { syncUserToSupabase, deleteUserFromSupabase } from '../config/supabase';

const router = Router();

// GET /api/v1/users?role=...
router.get('/', verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { role } = req.query;
    const filter: any = { organizationId: req.user?.organizationId };
    if (role) filter.role = role;

    const users = await User.find(filter).select('-passwordHash').sort({ name: 1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
});

// GET /api/v1/users/students
router.get('/students', verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId } = req.query;
    const filter: any = { organizationId: req.user?.organizationId };
    if (classId) filter.classId = classId;

    const students = await StudentProfile.find(filter)
      .populate('userId', 'name username email phone avatarUrl status')
      .populate('classId', 'className section gradeLevel')
      .sort({ rollNumber: 1 });

    res.json({ success: true, count: students.length, students });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch student profiles.' });
  }
});

// GET /api/v1/users/teachers
router.get('/teachers', verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const teachers = await TeacherProfile.find({ organizationId: req.user?.organizationId })
      .populate('userId', 'name username email phone avatarUrl status')
      .populate('assignedClassIds', 'className section');

    res.json({ success: true, count: teachers.length, teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch teacher profiles.' });
  }
});

// GET /api/v1/users/parents
router.get('/parents', verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const parents = await ParentProfile.find({ organizationId: req.user?.organizationId })
      .populate('userId', 'name username email phone avatarUrl status')
      .populate({
        path: 'childrenStudentIds',
        populate: { path: 'userId', select: 'name' },
      });

    res.json({ success: true, count: parents.length, parents });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch parent profiles.' });
  }
});

// POST /api/v1/users/create (Admin only)
router.post('/create', verifyToken, requireRole(['admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      role,
      name,
      username,
      password,
      phone,
      email,
      // Student-specific fields
      classId,
      rollNumber,
      admissionNumber,
      fatherName,
      motherName,
      gender,
      dob,
      address,
      ssaCategory,
      midDayMealOpted,
      // Teacher-specific fields
      employeeCode,
      designation,
      qualification,
      subjectsTaught,
      // Parent-specific fields
      childrenStudentIds,
      relation,
      occupation,
    } = req.body;

    if (!role || !name || !username || !password) {
      res.status(400).json({ success: false, message: 'Role, name, username, and password are required.' });
      return;
    }

    const orgId = req.user?.organizationId;

    // Check if username already exists in this organization
    const existing = await User.findOne({ organizationId: orgId, username: username.toLowerCase().trim() });
    if (existing) {
      res.status(400).json({ success: false, message: `Username "${username}" already exists in this school.` });
      return;
    }

    // Hash password
    const bcrypt = await import('bcryptjs');
    const passwordHash = await bcrypt.hash(password, 10);

    // Create User record
    const user = await User.create({
      organizationId: orgId,
      name: name.trim(),
      username: username.toLowerCase().trim(),
      email: email ? email.toLowerCase().trim() : undefined,
      phone: phone?.trim(),
      passwordHash,
      role,
      status: 'active',
    });

    let profile: any = null;

    if (role === 'student') {
      const parsedRoll = rollNumber ? parseInt(rollNumber, 10) : 1;
      profile = await StudentProfile.create({
        userId: user._id,
        organizationId: orgId,
        admissionNumber: admissionNumber || `GMS-AWN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        rollNumber: parsedRoll,
        classId: classId,
        section: 'A',
        gender: gender || 'male',
        dob: dob ? new Date(dob) : new Date('2012-05-15'),
        fatherName: fatherName || 'Father Name',
        motherName: motherName || 'Mother Name',
        address: address || 'Awanpora, Mattan, Anantnag',
        midDayMealOpted: midDayMealOpted !== false,
        ssaCategory: ssaCategory || 'RBA',
      });
    } else if (role === 'teacher') {
      profile = await TeacherProfile.create({
        userId: user._id,
        organizationId: orgId,
        employeeCode: employeeCode || `TCH-${Math.floor(1000 + Math.random() * 9000)}`,
        designation: designation || 'General Line Teacher (SSA)',
        qualification: qualification || 'M.Sc, B.Ed',
        subjectsTaught: Array.isArray(subjectsTaught) ? subjectsTaught : (subjectsTaught ? [subjectsTaught] : ['General']),
        assignedClassIds: classId ? [classId] : [],
      });
    } else if (role === 'parent') {
      profile = await ParentProfile.create({
        userId: user._id,
        organizationId: orgId,
        childrenStudentIds: Array.isArray(childrenStudentIds) ? childrenStudentIds : (childrenStudentIds ? [childrenStudentIds] : []),
        relation: relation || 'father',
        occupation: occupation || 'Agriculture / Business',
        address: address || 'Awanpora, Mattan, Anantnag',
      });
    }

    // Sync real-time to Supabase
    try {
      let classNameStr = 'Class 1';
      if (classId) {
        const clsDoc = await ClassSection.findById(classId);
        if (clsDoc) classNameStr = clsDoc.className;
      }

      await syncUserToSupabase({
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        passwordHash: user.passwordHash,
        role: user.role as any,
        profileData: profile ? profile.toObject() : req.body,
        className: classNameStr,
      });
    } catch (syncErr) {
      console.warn('⚠️ Supabase background sync notice:', syncErr);
    }

    res.status(201).json({
      success: true,
      message: `New ${role} profile created and saved to database successfully.`,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        phone: user.phone,
      },
      profile,
    });
  } catch (error: any) {
    console.error('Create user error:', error);
    res.status(500).json({ success: false, message: error?.message || 'Failed to create user.' });
  }
});

// DELETE /api/v1/users/:id (Admin only)
router.delete('/:id', verifyToken, requireRole(['admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const orgId = req.user?.organizationId;

    const user = await User.findOne({ _id: id, organizationId: orgId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    if (user.role === 'student') {
      await StudentProfile.deleteOne({ userId: id, organizationId: orgId });
    } else if (user.role === 'teacher') {
      await TeacherProfile.deleteOne({ userId: id, organizationId: orgId });
    } else if (user.role === 'parent') {
      await ParentProfile.deleteOne({ userId: id, organizationId: orgId });
    }

    await User.deleteOne({ _id: id, organizationId: orgId });

    // Sync deletion to Supabase
    try {
      await deleteUserFromSupabase(user.username);
    } catch (syncErr) {
      console.warn('⚠️ Supabase background delete notice:', syncErr);
    }

    res.json({ success: true, message: `User ${user.name} removed successfully.` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete user.' });
  }
});

export default router;
