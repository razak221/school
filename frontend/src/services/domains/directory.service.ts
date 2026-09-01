import bcrypt from 'bcryptjs';
import { supabase, ORG_ID, normalizeClassId } from './common';
import { validator } from '../validation/schemas';
import { logger } from '../telemetry/logger';

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

      if (error) throw error;

      const formatted = (data || []).map((s) => ({
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
    } catch (err: any) {
      logger.error('Failed to load students directory', 'getStudents', { error: err?.message });
      return { success: true, count: 0, students: [] };
    }
  },

  getTeachers: async () => {
    try {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select('*, user:users(*)');

      if (error) throw error;

      const formatted = (data || []).map((t) => ({
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
    } catch (err: any) {
      logger.error('Failed to load teachers directory', 'getTeachers', { error: err?.message });
      return { success: true, count: 0, teachers: [] };
    }
  },

  getParents: async () => {
    try {
      const { data, error } = await supabase
        .from('parent_profiles')
        .select('*, user:users(*)');

      if (error) throw error;

      const formatted = (data || []).map((p) => ({
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
    } catch (err: any) {
      logger.error('Failed to load parents directory', 'getParents', { error: err?.message });
      return { success: true, count: 0, parents: [] };
    }
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
