import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ryhtbvczmtuyfacjqfnm.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_0jXMf-UljXH-10w0n_pFIw_U3DKDj_r';

export const supabase = createClient(supabaseUrl, supabaseKey);

const ORG_ID = 'a0000000-0000-0000-0000-000000000001';

// Class Section UUID mapping (Class 1 -> Class 8)
const CLASS_UUID_MAP: Record<string, string> = {
  'Class 1': 'c0000000-0000-0000-0000-000000000001',
  'Class 2': 'c0000000-0000-0000-0000-000000000002',
  'Class 3': 'c0000000-0000-0000-0000-000000000003',
  'Class 4': 'c0000000-0000-0000-0000-000000000004',
  'Class 5': 'c0000000-0000-0000-0000-000000000005',
  'Class 6': 'c0000000-0000-0000-0000-000000000006',
  'Class 7': 'c0000000-0000-0000-0000-000000000007',
  'Class 8': 'c0000000-0000-0000-0000-000000000008',
};

export const syncUserToSupabase = async (userData: {
  name: string;
  username: string;
  email?: string;
  phone?: string;
  passwordHash: string;
  role: 'admin' | 'teacher' | 'parent' | 'student';
  profileData?: any;
  className?: string;
}) => {
  try {
    const userId = crypto.randomUUID();

    // 1. Insert User into Supabase
    const { error: userError } = await supabase.from('users').upsert({
      id: userId,
      organization_id: ORG_ID,
      name: userData.name,
      username: userData.username.toLowerCase().trim(),
      email: userData.email || userData.username.toLowerCase().trim(),
      phone: userData.phone || '+91-9419000000',
      password_hash: userData.passwordHash,
      role: userData.role,
      status: 'active',
    }, { onConflict: 'organization_id,username' });

    if (userError) {
      console.error('⚠️ Supabase user sync error:', userError.message);
    } else {
      console.log(`✅ Synced user "${userData.username}" to Supabase.`);
    }

    // 2. Insert Profile Data into Supabase
    if (userData.role === 'student' && userData.profileData) {
      const p = userData.profileData;
      const classSectionId = (userData.className && CLASS_UUID_MAP[userData.className]) || 'c0000000-0000-0000-0000-000000000001';
      
      const { error: profError } = await supabase.from('student_profiles').upsert({
        id: crypto.randomUUID(),
        user_id: userId,
        organization_id: ORG_ID,
        admission_number: p.admissionNumber || `GMS-AWN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        roll_number: p.rollNumber || 1,
        class_id: classSectionId,
        section: p.section || 'A',
        gender: p.gender || 'male',
        dob: p.dob || '2013-05-15',
        father_name: p.fatherName || 'Parent / Guardian',
        mother_name: p.motherName || 'Mother',
        address: p.address || 'Awanpora, Mattan, Anantnag',
        mid_day_meal_opted: p.midDayMealOpted !== false,
        ssa_category: p.ssaCategory || 'RBA',
      });
      if (profError) console.error('⚠️ Supabase student profile sync error:', profError.message);
    } else if (userData.role === 'teacher' && userData.profileData) {
      const p = userData.profileData;
      const { error: profError } = await supabase.from('teacher_profiles').upsert({
        id: crypto.randomUUID(),
        user_id: userId,
        organization_id: ORG_ID,
        employee_code: p.employeeCode || `TCH-${Math.floor(1000 + Math.random() * 9000)}`,
        designation: p.designation || 'General Line Teacher (SSA)',
        qualification: p.qualification || 'M.Sc, B.Ed',
        subjects_taught: Array.isArray(p.subjectsTaught) ? p.subjectsTaught : ['General'],
      });
      if (profError) console.error('⚠️ Supabase teacher profile sync error:', profError.message);
    } else if (userData.role === 'parent' && userData.profileData) {
      const p = userData.profileData;
      const { error: profError } = await supabase.from('parent_profiles').upsert({
        id: crypto.randomUUID(),
        user_id: userId,
        organization_id: ORG_ID,
        relation: p.relation || 'father',
        occupation: p.occupation || 'Agriculture / Horticulture',
        address: p.address || 'Awanpora, Mattan, Anantnag',
      });
      if (profError) console.error('⚠️ Supabase parent profile sync error:', profError.message);
    }

    return true;
  } catch (err: any) {
    console.error('Supabase sync failure:', err?.message);
    return false;
  }
};

export const deleteUserFromSupabase = async (username: string) => {
  try {
    const { data } = await supabase.from('users').select('id').eq('username', username.toLowerCase().trim()).maybeSingle();
    if (data?.id) {
      await supabase.from('student_profiles').delete().eq('user_id', data.id);
      await supabase.from('teacher_profiles').delete().eq('user_id', data.id);
      await supabase.from('parent_profiles').delete().eq('user_id', data.id);
      await supabase.from('users').delete().eq('id', data.id);
      console.log(`✅ Removed user "${username}" from Supabase.`);
    }
  } catch (err: any) {
    console.error('Supabase delete error:', err?.message);
  }
};
