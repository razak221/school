import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { Organization } from '../models/Organization';
import { User } from '../models/User';
import { ClassSection } from '../models/ClassSection';
import { StudentProfile } from '../models/StudentProfile';
import { TeacherProfile } from '../models/TeacherProfile';
import { ParentProfile } from '../models/ParentProfile';
import { AttendanceRecord } from '../models/AttendanceRecord';
import { ExamResult } from '../models/ExamResult';
import { Notice } from '../models/Notice';
import { GrantAndFee } from '../models/GrantAndFee';
import { MidDayMeal } from '../models/MidDayMeal';
import { Timetable } from '../models/Timetable';
import { Homework } from '../models/Homework';

export const seedDatabase = async (): Promise<void> => {
  try {
    const existingOrg = await Organization.findOne({ code: '01061102301' });
    if (existingOrg) {
      console.log('✨ Govt Middle School Awanpora institutional data already initialized.');
      return;
    }

    console.log('🌱 Seeding database with Govt Middle School Awanpora data...');

    // 1. Create Organization
    const org = await Organization.create({
      name: 'Govt Middle School Awanpora',
      type: 'school',
      affiliation: 'J&K School Education Department',
      zone: 'Zone Mattan',
      district: 'Anantnag',
      state: 'Jammu & Kashmir',
      code: 'UDISE-01061102301',
      address: 'Awanpora, Mattan, Anantnag, J&K - 192129',
      phone: '+91-1932-234567',
      email: 'gms.awanpora@jk.gov.in',
      terminology: {
        classLabel: 'Class',
        sectionLabel: 'Section',
      },
      settings: {
        academicYear: '2026-2027',
        currentTerm: 'Term 1',
        enableMidDayMeal: true,
        enableSsaGrants: true,
      },
    });

    const orgId = org._id;

    // 2. Hash default passwords
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const teacherPasswordHash = await bcrypt.hash('teacher123', 10);
    const parentPasswordHash = await bcrypt.hash('parent123', 10);
    const studentPasswordHash = await bcrypt.hash('student123', 10);

    // 3. Create Admin / Headmaster User
    const adminUser = await User.create({
      organizationId: orgId,
      name: 'Mohammad Ashraf Bhat (Headmaster)',
      username: 'admin@me',
      email: 'admin@me',
      phone: '+91-9419011122',
      passwordHash: adminPasswordHash,
      role: 'admin',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      status: 'active',
    });

    // 4. Create Class Sections (Classes 1st to 8th ready for real students and teachers)
    const classConfigs = [
      { name: 'Class 1', grade: 1, subjects: ['English', 'Mathematics', 'Urdu', 'EVS'] },
      { name: 'Class 2', grade: 2, subjects: ['English', 'Mathematics', 'Urdu', 'EVS'] },
      { name: 'Class 3', grade: 3, subjects: ['English', 'Mathematics', 'Urdu', 'EVS', 'Kashmiri'] },
      { name: 'Class 4', grade: 4, subjects: ['English', 'Mathematics', 'Urdu', 'Science', 'Social Studies'] },
      { name: 'Class 5', grade: 5, subjects: ['English', 'Mathematics', 'Urdu', 'Science', 'Social Studies'] },
      { name: 'Class 6', grade: 6, subjects: ['English', 'Mathematics', 'Urdu', 'Science', 'Social Science', 'Kashmiri'] },
      { name: 'Class 7', grade: 7, subjects: ['English', 'Mathematics', 'Urdu', 'Science', 'Social Science', 'Kashmiri'] },
      { name: 'Class 8', grade: 8, subjects: ['English', 'Mathematics', 'Urdu', 'Science', 'Social Science', 'Kashmiri'] },
    ];

    for (const c of classConfigs) {
      await ClassSection.create({
        organizationId: orgId,
        className: c.name,
        gradeLevel: c.grade,
        section: 'A',
        roomNumber: `Room ${c.grade}`,
        capacity: 35,
        academicYear: '2026-2027',
        subjects: c.subjects,
      });
    }

    // 5. Create Official School Notices
    await Notice.create([
      {
        organizationId: orgId,
        title: 'Academic Session 2026-27 Portal Initialized',
        body: 'Welcome to the official ERP portal of Govt Middle School Awanpora. Teaching faculty, student enrolments, and parent accounts will be registered directly by school administration.',
        category: 'academic',
        targetAudience: ['all'],
        isPinned: true,
        translations: {
          ur: {
            title: 'تعلیمی سیشن 2026-27 پورٹل فعال کر دیا گیا ہے',
            body: 'گورنمنٹ مڈل اسکول اونپورہ کے ای آر پی پورٹل میں خوش آمدید۔ تمام اساتذہ اور طلباء کے اکاؤنٹس اسکول ایڈمن کے ذریعے رجسٹر کیے جائیں گے۔',
          },
          ks: {
            title: 'تعلیمی سیشن پورٹل چالو',
            body: 'گورنمنٹ مڈل اسکول اونپورہ ای آر پی پورٹلس منز خوش آمدید۔',
          },
          hi: {
            title: 'शैक्षणिक सत्र 2026-27 पोर्टल प्रारंभ',
            body: 'राजकीय मध्य विद्यालय अवनपोरा के आधिकारिक ईआरपी पोर्टल में आपका स्वागत है।',
          },
        },
        createdBy: adminUser._id,
      },
    ]);

    // 6. Create SSA Grant Records
    await GrantAndFee.create([
      {
        organizationId: orgId,
        type: 'ssa_grant',
        title: 'SSA Annual Composite School Grant 2026-27',
        amount: 50000,
        financialYear: '2026-2027',
        category: 'credit',
        sanctionNumber: 'SED/SSA/ANT/2026/0491',
        description: 'Annual infrastructure, sanitation, and learning aids grant released by Directorate of Samagra Shiksha.',
        status: 'allocated',
        recordedBy: adminUser._id,
      },
      {
        organizationId: orgId,
        type: 'library_grant',
        title: 'SSA Library & Reading Corner Grant',
        amount: 13000,
        financialYear: '2026-2027',
        category: 'credit',
        sanctionNumber: 'SED/SSA/LIB/2026/012',
        description: 'Grant for purchasing children literature, science encyclopedias, and regional storybooks.',
        status: 'allocated',
        recordedBy: adminUser._id,
      },
      {
        organizationId: orgId,
        type: 'sports_grant',
        title: 'Sports & Physical Education Equipment Fund',
        amount: 10000,
        financialYear: '2026-2027',
        category: 'credit',
        sanctionNumber: 'SED/SSA/SPT/2026/884',
        description: 'Procurement of cricket kits, footballs, volleyball sets, and carrom boards.',
        status: 'allocated',
        recordedBy: adminUser._id,
      },
    ]);

    console.log('✅ Clean database ready: Only real admin account (admin@me) initialized. Directory is ready for admin to create real users.');
  } catch (error) {
    console.error('Database seeding failed:', error);
  }
};
