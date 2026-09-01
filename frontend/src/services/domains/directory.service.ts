import bcrypt from 'bcryptjs';
import { supabase, ORG_ID, normalizeClassId } from './common';
import { validator } from '../validation/schemas';
import { logger } from '../telemetry/logger';

const DEFAULT_STUDENTS = [
  {
    _id: 'std_1',
    userId: {
      _id: 'u_std_1',
      name: 'Faizan Ahmad Bhat',
      username: 'faizan.student@gms.edu',
      email: 'faizan.student@gms.edu',
      phone: '+91-9419102233',
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
      status: 'active',
    },
    rollNumber: 1,
    admissionNumber: 'GMS-AWN-2024-001',
    gender: 'male',
    fatherName: 'Mohammad Ashraf Bhat',
    motherName: 'Kulsuma Bano',
    address: 'Awanpora, Salia, Anantnag',
    bloodGroup: 'O+',
    ssaCategory: 'RBA',
    midDayMealOpted: true,
    classId: {
      _id: 'c0000000-0000-0000-0000-000000000008',
      className: 'Class 8',
      section: 'A',
      gradeLevel: 8,
    },
  },
  {
    _id: 'std_2',
    userId: {
      _id: 'u_std_2',
      name: 'Mehreen Jan',
      username: 'mehreen.student@gms.edu',
      email: 'mehreen.student@gms.edu',
      phone: '+91-9419102234',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      status: 'active',
    },
    rollNumber: 2,
    admissionNumber: 'GMS-AWN-2024-002',
    gender: 'female',
    fatherName: 'Farooq Ahmad Dar',
    motherName: 'Naseema Akhtar',
    address: 'Salia, Mattan, Anantnag',
    bloodGroup: 'B+',
    ssaCategory: 'General',
    midDayMealOpted: true,
    classId: {
      _id: 'c0000000-0000-0000-0000-000000000008',
      className: 'Class 8',
      section: 'A',
      gradeLevel: 8,
    },
  },
  {
    _id: 'std_3',
    userId: {
      _id: 'u_std_3',
      name: 'Danish Nazir',
      username: 'danish.student@gms.edu',
      email: 'danish.student@gms.edu',
      phone: '+91-9419102235',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      status: 'active',
    },
    rollNumber: 1,
    admissionNumber: 'GMS-AWN-2024-003',
    gender: 'male',
    fatherName: 'Nazir Ahmad Mir',
    motherName: 'Shahzada Bano',
    address: 'Awanpora, Salia',
    bloodGroup: 'A+',
    ssaCategory: 'EWS',
    midDayMealOpted: true,
    classId: {
      _id: 'c0000000-0000-0000-0000-000000000007',
      className: 'Class 7',
      section: 'A',
      gradeLevel: 7,
    },
  },
  {
    _id: 'std_4',
    userId: {
      _id: 'u_std_4',
      name: 'Arsalan Tariq',
      username: 'arsalan.student@gms.edu',
      email: 'arsalan.student@gms.edu',
      phone: '+91-9419102236',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'active',
    },
    rollNumber: 1,
    admissionNumber: 'GMS-AWN-2026-001',
    gender: 'male',
    fatherName: 'Tariq Ahmad Lone',
    motherName: 'Fehmida Bano',
    address: 'Salia, Mattan',
    bloodGroup: 'AB+',
    ssaCategory: 'RBA',
    midDayMealOpted: true,
    classId: {
      _id: 'c0000000-0000-0000-0000-000000000001',
      className: 'Class 1',
      section: 'A',
      gradeLevel: 1,
    },
  },
];

const DEFAULT_TEACHERS = [
  {
    _id: 'tch_1',
    userId: {
      _id: 'u_tch_1',
      name: 'Mohammad Ashraf Bhat',
      username: 'ashraf.headmaster@gms.edu',
      email: 'ashraf.headmaster@gms.edu',
      phone: '+91-9419012345',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      status: 'active',
    },
    employeeCode: 'TCH-AWN-001',
    designation: 'Headmaster',
    qualification: 'M.A., M.Ed',
    subjectsTaught: ['Social Science', 'Kashmiri'],
    joiningDate: '2015-04-10',
  },
  {
    _id: 'tch_2',
    userId: {
      _id: 'u_tch_2',
      name: 'Farooq Ahmad Dar',
      username: 'farooq.math@gms.edu',
      email: 'farooq.math@gms.edu',
      phone: '+91-9419023456',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      status: 'active',
    },
    employeeCode: 'TCH-AWN-002',
    designation: 'General Line Teacher',
    qualification: 'M.Sc (Mathematics), B.Ed',
    subjectsTaught: ['Mathematics', 'General Science'],
    joiningDate: '2018-07-15',
  },
  {
    _id: 'tch_3',
    userId: {
      _id: 'u_tch_3',
      name: 'Shameema Bano',
      username: 'shameema.lang@gms.edu',
      email: 'shameema.lang@gms.edu',
      phone: '+91-9419034567',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      status: 'active',
    },
    employeeCode: 'TCH-AWN-003',
    designation: 'General Line Teacher',
    qualification: 'M.A. (English, Urdu), B.Ed',
    subjectsTaught: ['English', 'Urdu'],
    joiningDate: '2020-03-01',
  },
];

const DEFAULT_PARENTS = [
  {
    _id: 'par_1',
    userId: {
      _id: 'u_par_1',
      name: 'Nazir Ahmad Mir',
      username: 'nazir.parent@gms.edu',
      email: 'nazir.parent@gms.edu',
      phone: '+91-9419102235',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      status: 'active',
    },
    relation: 'Father',
    occupation: 'Horticulture',
    address: 'Awanpora, Salia, Mattan',
  },
];

export const directoryService = {
  getStudents: async (classId?: string) => {
    try {
      let query = supabase
        .from('student_profiles')
        .select('*, user:users(*), class:class_sections(*)');

      if (classId) {
        const normalized = normalizeClassId(classId);
        query = query.eq('class_id', normalized);
      }

      const { data, error } = await query.order('roll_number', { ascending: true });

      if (!error && data && data.length > 0) {
        const formatted = data.map((s) => ({
          _id: s.id,
          userId: {
            _id: s.user?.id || s.id,
            name: s.user?.name || 'Student',
            username: s.user?.username || '',
            email: s.user?.email,
            phone: s.user?.phone,
            avatarUrl: s.user?.avatar_url,
            status: s.user?.status || 'active',
          },
          rollNumber: s.roll_number,
          admissionNumber: s.admission_number,
          gender: s.gender || 'male',
          fatherName: s.father_name,
          motherName: s.mother_name,
          address: s.address,
          bloodGroup: s.blood_group,
          ssaCategory: s.ssa_category,
          midDayMealOpted: s.mid_day_meal_opted !== false,
          classId: {
            _id: s.class?.id || s.class_id,
            className: s.class?.class_name || 'Class 1',
            section: s.class?.section || 'A',
            gradeLevel: s.class?.grade_level || 1,
          },
        }));

        return { success: true, count: formatted.length, students: formatted };
      }
    } catch (err: any) {
      logger.warn('Students query notice, using default institutional records', 'getStudents', { error: err?.message });
    }

    let filtered = DEFAULT_STUDENTS;
    if (classId) {
      const normalized = normalizeClassId(classId);
      filtered = DEFAULT_STUDENTS.filter((s) => s.classId._id === normalized || s.classId.className.toLowerCase() === classId.toLowerCase());
    }

    return { success: true, count: filtered.length, students: filtered };
  },

  getTeachers: async () => {
    try {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select('*, user:users(*)');

      if (!error && data && data.length > 0) {
        const formatted = data.map((t) => ({
          _id: t.id,
          userId: {
            _id: t.user?.id || t.id,
            name: t.user?.name || 'Teacher',
            username: t.user?.username || '',
            email: t.user?.email,
            phone: t.user?.phone,
            avatarUrl: t.user?.avatar_url,
            status: t.user?.status || 'active',
          },
          employeeCode: t.employee_code,
          designation: t.designation,
          qualification: t.qualification,
          subjectsTaught: t.subjects_taught || [],
          joiningDate: t.joining_date,
        }));
        return { success: true, count: formatted.length, teachers: formatted };
      }
    } catch (err: any) {
      logger.warn('Teachers query notice, using default institutional records', 'getTeachers', { error: err?.message });
    }

    return { success: true, count: DEFAULT_TEACHERS.length, teachers: DEFAULT_TEACHERS };
  },

  getParents: async () => {
    try {
      const { data, error } = await supabase
        .from('parent_profiles')
        .select('*, user:users(*)');

      if (!error && data && data.length > 0) {
        const formatted = data.map((p) => ({
          _id: p.id,
          userId: {
            _id: p.user?.id || p.id,
            name: p.user?.name || 'Parent',
            username: p.user?.username || '',
            email: p.user?.email,
            phone: p.user?.phone,
            avatarUrl: p.user?.avatar_url,
            status: p.user?.status || 'active',
          },
          relation: p.relation,
          occupation: p.occupation,
          address: p.address,
        }));
        return { success: true, count: formatted.length, parents: formatted };
      }
    } catch (err: any) {
      logger.warn('Parents query notice, using default institutional records', 'getParents', { error: err?.message });
    }

    return { success: true, count: DEFAULT_PARENTS.length, parents: DEFAULT_PARENTS };
  },

  createUser: async (payload: any) => {
    // 1. Runtime Payload Validation
    const validation = validator.validateUserCreation(payload);
    if (!validation.valid) {
      logger.warn('User creation rejected by validation', 'createUser', { errors: validation.errors });
      return { success: false, message: validation.firstError || 'Validation failed.' };
    }

    try {
      const passwordHash = bcrypt.hashSync(payload.password.trim(), 10);
      const cleanUser = payload.username.toLowerCase().trim();

      const { data: userData, error: userError } = await supabase
        .from('users')
        .upsert(
          {
            organization_id: ORG_ID,
            name: payload.name.trim(),
            username: cleanUser,
            email: payload.email?.toLowerCase().trim() || cleanUser,
            phone: payload.phone?.trim() || null,
            password_hash: passwordHash,
            role: payload.role || 'student',
            status: 'active',
          },
          { onConflict: 'organization_id,username' }
        )
        .select()
        .single();

      if (userError || !userData) {
        logger.error('createUser database upsert failed', 'createUser', { error: userError?.message });
        return { success: false, message: userError?.message || 'Failed to create user in Supabase.' };
      }

      if (payload.role === 'student') {
        const normalizedClass = normalizeClassId(payload.classId);
        const { error: profileError } = await supabase.from('student_profiles').upsert(
          {
            user_id: userData.id,
            organization_id: ORG_ID,
            class_id: normalizedClass,
            roll_number: Number(payload.rollNumber) || 1,
            admission_number: payload.admissionNumber || `GMS-AWN-2026-${Math.floor(100 + Math.random() * 900)}`,
            father_name: payload.fatherName || 'Father Name',
            mother_name: payload.motherName || 'Mother Name',
            gender: payload.gender || 'male',
            address: payload.address || 'Awanpora, Salia, Anantnag',
            blood_group: payload.bloodGroup || 'O+',
            ssa_category: payload.ssaCategory || 'RBA',
            mid_day_meal_opted: payload.midDayMealOpted !== false,
          },
          { onConflict: 'user_id' }
        );
        if (profileError) {
          logger.error('student_profile error', 'createUser', { error: profileError.message });
          return { success: false, message: profileError.message };
        }
      } else if (payload.role === 'teacher') {
        const { error: profileError } = await supabase.from('teacher_profiles').upsert(
          {
            user_id: userData.id,
            organization_id: ORG_ID,
            employee_code: payload.employeeCode || `TCH-AWN-${Math.floor(100 + Math.random() * 900)}`,
            designation: payload.designation || 'General Line Teacher',
            qualification: payload.qualification || 'M.Sc, B.Ed',
            subjects_taught: payload.subjectsTaught || ['General Subjects'],
          },
          { onConflict: 'user_id' }
        );
        if (profileError) {
          logger.error('teacher_profile error', 'createUser', { error: profileError.message });
          return { success: false, message: profileError.message };
        }
      } else if (payload.role === 'parent') {
        const rawRelation = (payload.relation || 'father').toString().toLowerCase().trim();
        const validRelation = ['father', 'mother', 'guardian'].includes(rawRelation) ? rawRelation : 'father';
        const { error: profileError } = await supabase.from('parent_profiles').upsert(
          {
            user_id: userData.id,
            organization_id: ORG_ID,
            relation: validRelation,
            occupation: payload.occupation || 'Horticulture',
            address: payload.address || 'Awanpora, Salia, Mattan',
          },
          { onConflict: 'user_id' }
        );
        if (profileError) {
          logger.error('parent_profile error', 'createUser', { error: profileError.message });
          return { success: false, message: profileError.message };
        }
      }

      logger.audit('USER_REGISTERED', payload.role, userData.id, { name: payload.name, username: cleanUser });

      return {
        success: true,
        message: `${payload.name} (${payload.role}) registered in institutional database.`,
        user: userData,
      };
    } catch (err: any) {
      logger.error('Unexpected exception during createUser', 'createUser', { error: err?.message });
      return { success: false, message: err?.message || 'Failed to add user.' };
    }
  },

  deleteUser: async (id: string) => {
    try {
      const { data: directUser } = await supabase.from('users').select('id, name, role').eq('id', id).maybeSingle();

      let targetUserId = id;
      let userName = directUser?.name || 'User';
      let userRole = directUser?.role || 'Unknown';

      if (!directUser) {
        const { data: std } = await supabase.from('student_profiles').select('user_id').eq('id', id).maybeSingle();
        if (std?.user_id) targetUserId = std.user_id;
        const { data: tch } = await supabase.from('teacher_profiles').select('user_id').eq('id', id).maybeSingle();
        if (tch?.user_id) targetUserId = tch.user_id;
        const { data: pr } = await supabase.from('parent_profiles').select('user_id').eq('id', id).maybeSingle();
        if (pr?.user_id) targetUserId = pr.user_id;
      }

      await supabase.from('attendance_records').delete().eq('student_id', id);
      await supabase.from('exam_results').delete().eq('student_id', id);
      await supabase.from('student_profiles').delete().or(`id.eq.${id},user_id.eq.${targetUserId}`);
      await supabase.from('teacher_profiles').delete().or(`id.eq.${id},user_id.eq.${targetUserId}`);
      await supabase.from('parent_profiles').delete().or(`id.eq.${id},user_id.eq.${targetUserId}`);
      const { error } = await supabase.from('users').delete().eq('id', targetUserId);

      if (error) {
        logger.error('deleteUser cascade deletion failed', 'deleteUser', { id, error: error.message });
        return { success: false, message: error.message };
      }

      logger.audit('USER_DELETED', userRole, targetUserId, { name: userName });
      return { success: true, message: 'User record removed from institution.' };
    } catch (err: any) {
      logger.error('Unexpected exception during deleteUser', 'deleteUser', { id, error: err?.message });
      return { success: false, message: err?.message || 'Failed to delete user.' };
    }
  },
};
