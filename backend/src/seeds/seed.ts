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

    // 4. Create 11 Teachers & Staff (Complete SSA Cadre)
    const teachersData = [
      { name: 'Nissar Ahmad Rather', username: 'teacher@gmsawanpora.edu.in', code: 'SSA-TCH-089', des: 'General Line Teacher (SSA)', qual: 'M.Sc (Math), B.Ed', sub: ['Mathematics', 'Science'], phone: '+91-9419022233' },
      { name: 'Shabir Ahmad Shah', username: 'science.teacher@gmsawanpora.edu.in', code: 'SSA-TCH-092', des: 'Science Master', qual: 'M.Sc (Physics), B.Ed', sub: ['Science', 'EVS'], phone: '+91-9419033344' },
      { name: 'Farooq Ahmad Dar', username: 'urdu.teacher@gmsawanpora.edu.in', code: 'SED-TCH-114', des: 'Language Teacher', qual: 'M.A (Urdu & Kashmiri), B.Ed', sub: ['Urdu', 'Kashmiri', 'English'], phone: '+91-9419044455' },
      { name: 'Altaf Hussain Wani', username: 'altaf.teacher@gmsawanpora.edu.in', code: 'SSA-TCH-095', des: 'Teacher (Social Science)', qual: 'M.A (History), B.Ed', sub: ['Social Science', 'Civics'], phone: '+91-9419055511' },
      { name: 'Rubeena Akhter', username: 'rubeena.teacher@gmsawanpora.edu.in', code: 'SSA-TCH-102', des: 'Primary Line Teacher', qual: 'B.Sc, B.Ed', sub: ['EVS', 'English', 'Art'], phone: '+91-9419055522' },
      { name: 'Showkat Ahmad Malik', username: 'showkat.teacher@gmsawanpora.edu.in', code: 'SED-TCH-120', des: 'Mathematics Master', qual: 'M.Sc (Math), M.Ed', sub: ['Mathematics'], phone: '+91-9419055533' },
      { name: 'Tanveer Ahmad Ganie', username: 'tanveer.teacher@gmsawanpora.edu.in', code: 'SSA-TCH-108', des: 'Junior Teacher', qual: 'B.A, D.El.Ed', sub: ['Urdu', 'English'], phone: '+91-9419055544' },
      { name: 'Gulshan Ara', username: 'gulshan.teacher@gmsawanpora.edu.in', code: 'SSA-TCH-111', des: 'Primary Line Teacher', qual: 'B.A, D.El.Ed', sub: ['General Subjects', 'EVS'], phone: '+91-9419055555' },
      { name: 'Reyaz Ahmad Lone', username: 'reyaz.sports@gmsawanpora.edu.in', code: 'SED-PET-045', des: 'Physical Education Teacher (PET)', qual: 'B.P.Ed, M.P.Ed', sub: ['Physical Education', 'Sports'], phone: '+91-9419055566' },
      { name: 'Bilal Ahmad Sofi', username: 'bilal.library@gmsawanpora.edu.in', code: 'SSA-LIB-018', des: 'Librarian & Resource In-charge', qual: 'B.Lib, M.A', sub: ['Library Studies'], phone: '+91-9419055577' },
      { name: 'Zahoor Ahmad Bhat', username: 'zahoor.craft@gmsawanpora.edu.in', code: 'SSA-VOC-009', des: 'Vocational / Craft Instructor', qual: 'Diploma in Vocational Crafts', sub: ['SUPW', 'Vocational Crafts'], phone: '+91-9419055588' },
    ];

    const teacherUsers: any[] = [];
    for (const t of teachersData) {
      const user = await User.create({
        organizationId: orgId,
        name: t.name,
        username: t.username,
        email: `${t.username.split('@')[0]}@gmsawanpora.edu.in`,
        phone: t.phone,
        passwordHash: teacherPasswordHash,
        role: 'teacher',
        avatarUrl: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150`,
        status: 'active',
      });
      teacherUsers.push(user);
    }

    // 5. Create Class Sections (Classes 1st to 8th)
    const classConfigs = [
      { name: 'Class 1', grade: 1, teacherIdx: 7, subjects: ['English', 'Mathematics', 'Urdu', 'EVS'] },
      { name: 'Class 2', grade: 2, teacherIdx: 6, subjects: ['English', 'Mathematics', 'Urdu', 'EVS'] },
      { name: 'Class 3', grade: 3, teacherIdx: 5, subjects: ['English', 'Mathematics', 'Urdu', 'EVS', 'Kashmiri'] },
      { name: 'Class 4', grade: 4, teacherIdx: 4, subjects: ['English', 'Mathematics', 'Urdu', 'Science', 'Social Studies'] },
      { name: 'Class 5', grade: 5, teacherIdx: 3, subjects: ['English', 'Mathematics', 'Urdu', 'Science', 'Social Studies'] },
      { name: 'Class 6', grade: 6, teacherIdx: 2, subjects: ['English', 'Mathematics', 'Urdu', 'Science', 'Social Science', 'Kashmiri'] },
      { name: 'Class 7', grade: 7, teacherIdx: 1, subjects: ['English', 'Mathematics', 'Urdu', 'Science', 'Social Science', 'Kashmiri'] },
      { name: 'Class 8', grade: 8, teacherIdx: 0, subjects: ['English', 'Mathematics', 'Urdu', 'Science', 'Social Science', 'Kashmiri'] },
    ];

    const classSections: any[] = [];
    for (const c of classConfigs) {
      const classSec = await ClassSection.create({
        organizationId: orgId,
        className: c.name,
        gradeLevel: c.grade,
        section: 'A',
        classTeacherId: teacherUsers[c.teacherIdx]._id,
        roomNumber: `Room ${c.grade}`,
        capacity: 35,
        academicYear: '2026-2027',
        subjects: c.subjects,
      });
      classSections.push(classSec);
    }

    // 6. Create Teacher Profiles
    for (let i = 0; i < teachersData.length; i++) {
      const t = teachersData[i];
      const assigned = i < classSections.length ? [classSections[i]._id] : [classSections[0]._id];
      await TeacherProfile.create({
        userId: teacherUsers[i]._id,
        organizationId: orgId,
        employeeCode: t.code,
        designation: t.des,
        qualification: t.qual,
        subjectsTaught: t.sub,
        assignedClassIds: assigned,
      });
    }

    // 7. Create Parent Users & Profiles
    const parent1User = await User.create({
      organizationId: orgId,
      name: 'Nissar Ahmad Mir',
      username: 'parent@gmsawanpora.edu.in',
      email: 'parent.nissar@gmail.com',
      phone: '+91-9419055566',
      passwordHash: parentPasswordHash,
      role: 'parent',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      status: 'active',
    });

    const parent2User = await User.create({
      organizationId: orgId,
      name: 'Shabir Ahmad Dar',
      username: 'shabir.parent@gmsawanpora.edu.in',
      email: 'shabir.dar@gmail.com',
      phone: '+91-9419066677',
      passwordHash: parentPasswordHash,
      role: 'parent',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      status: 'active',
    });

    // 8. Create Students Across Classes 1 to 8
    const studentsSeedList = [
      // Class 8
      { name: 'Aaqib Nissar Mir', username: 'student@gmsawanpora.edu.in', classIdx: 7, roll: 1, adm: 'GMS-AWN-2022-084', gender: 'male', cat: 'RBA', parent: parent1User._id, father: 'Nissar Ahmad Mir', mother: 'Rubeena Begum' },
      { name: 'Faizan Shabir Dar', username: 'faizan@gmsawanpora.edu.in', classIdx: 7, roll: 2, adm: 'GMS-AWN-2022-085', gender: 'male', cat: 'General', parent: parent2User._id, father: 'Shabir Ahmad Dar', mother: 'Shakeela Bano' },
      { name: 'Mehak Jan', username: 'mehak@gmsawanpora.edu.in', classIdx: 7, roll: 3, adm: 'GMS-AWN-2022-086', gender: 'female', cat: 'RBA', parent: parent1User._id, father: 'Nissar Ahmad Mir', mother: 'Rubeena Begum' },
      { name: 'Sahil Ahmad Wani', username: 'sahil8@gmsawanpora.edu.in', classIdx: 7, roll: 4, adm: 'GMS-AWN-2022-087', gender: 'male', cat: 'General', parent: parent2User._id, father: 'Mohammad Yaqoob Wani', mother: 'Shamima Akhtar' },
      { name: 'Insha Yousuf', username: 'insha8@gmsawanpora.edu.in', classIdx: 7, roll: 5, adm: 'GMS-AWN-2022-088', gender: 'female', cat: 'RBA', parent: parent1User._id, father: 'Mohammad Yousuf', mother: 'Farida Begum' },

      // Class 7
      { name: 'Zahid Farooq Dar', username: 'zahid7@gmsawanpora.edu.in', classIdx: 6, roll: 1, adm: 'GMS-AWN-2023-091', gender: 'male', cat: 'RBA', parent: parent2User._id, father: 'Farooq Ahmad Dar', mother: 'Naseema Begum' },
      { name: 'Iqra Bashir', username: 'iqra7@gmsawanpora.edu.in', classIdx: 6, roll: 2, adm: 'GMS-AWN-2023-092', gender: 'female', cat: 'General', parent: parent1User._id, father: 'Bashir Ahmad', mother: 'Hajira Bano' },
      { name: 'Danish Gulzar', username: 'danish7@gmsawanpora.edu.in', classIdx: 6, roll: 3, adm: 'GMS-AWN-2023-093', gender: 'male', cat: 'RBA', parent: parent2User._id, father: 'Gulzar Ahmad', mother: 'Shaheena Begum' },

      // Class 6
      { name: 'Arsalan Showkat', username: 'arsalan6@gmsawanpora.edu.in', classIdx: 5, roll: 1, adm: 'GMS-AWN-2024-101', gender: 'male', cat: 'RBA', parent: parent1User._id, father: 'Showkat Ahmad', mother: 'Bilkees Begum' },
      { name: 'Muskan Tariq', username: 'muskan6@gmsawanpora.edu.in', classIdx: 5, roll: 2, adm: 'GMS-AWN-2024-102', gender: 'female', cat: 'General', parent: parent2User._id, father: 'Tariq Ahmad', mother: 'Ruksana Bano' },

      // Class 5
      { name: 'Muntazir Mehraj', username: 'muntazir5@gmsawanpora.edu.in', classIdx: 4, roll: 1, adm: 'GMS-AWN-2025-111', gender: 'male', cat: 'RBA', parent: parent1User._id, father: 'Mehraj-ud-Din', mother: 'Tahira Begum' },
      { name: 'Snober Jan', username: 'snober5@gmsawanpora.edu.in', classIdx: 4, roll: 2, adm: 'GMS-AWN-2025-112', gender: 'female', cat: 'RBA', parent: parent2User._id, father: 'Ghulam Hassan', mother: 'Fatima Bano' },

      // Class 4
      { name: 'Basit Nissar Mir', username: 'basit4@gmsawanpora.edu.in', classIdx: 3, roll: 1, adm: 'GMS-AWN-2026-121', gender: 'male', cat: 'RBA', parent: parent1User._id, father: 'Nissar Ahmad Mir', mother: 'Rubeena Begum' },

      // Class 3
      { name: 'Afreen Altaf', username: 'afreen3@gmsawanpora.edu.in', classIdx: 2, roll: 1, adm: 'GMS-AWN-2026-131', gender: 'female', cat: 'General', parent: parent2User._id, father: 'Altaf Ahmad', mother: 'Parveena Begum' },

      // Class 2
      { name: 'Umar Farooq', username: 'umar2@gmsawanpora.edu.in', classIdx: 1, roll: 1, adm: 'GMS-AWN-2026-141', gender: 'male', cat: 'RBA', parent: parent1User._id, father: 'Farooq Ahmad', mother: 'Hameeda Begum' },

      // Class 1
      { name: 'Zunaira Shabir', username: 'zunaira1@gmsawanpora.edu.in', classIdx: 0, roll: 1, adm: 'GMS-AWN-2026-151', gender: 'female', cat: 'RBA', parent: parent2User._id, father: 'Shabir Ahmad', mother: 'Shakeela Bano' },
    ];

    const studentProfiles: any[] = [];
    for (const st of studentsSeedList) {
      const stUser = await User.create({
        organizationId: orgId,
        name: st.name,
        username: st.username,
        email: `${st.username.split('@')[0]}@gmsawanpora.edu.in`,
        phone: '+91-9419055566',
        passwordHash: studentPasswordHash,
        role: 'student',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
        status: 'active',
      });

      const profile = await StudentProfile.create({
        userId: stUser._id,
        organizationId: orgId,
        admissionNumber: st.adm,
        rollNumber: st.roll,
        classId: classSections[st.classIdx]._id,
        section: 'A',
        gender: st.gender,
        dob: new Date('2013-05-15'),
        parentUserIds: [st.parent],
        fatherName: st.father,
        motherName: st.mother,
        address: 'Awanpora, Mattan, Anantnag',
        bloodGroup: 'B+',
        midDayMealOpted: true,
        ssaCategory: st.cat,
      });

      studentProfiles.push(profile);
    }

    // Link Parents to Student Profiles
    await ParentProfile.create({
      userId: parent1User._id,
      organizationId: orgId,
      childrenStudentIds: [studentProfiles[0]._id, studentProfiles[2]._id, studentProfiles[12]._id],
      relation: 'father',
      occupation: 'Agriculture / Horticulture',
      alternatePhone: '+91-9419055599',
      address: 'Main Chowk, Awanpora, Mattan, Anantnag',
    });

    await ParentProfile.create({
      userId: parent2User._id,
      organizationId: orgId,
      childrenStudentIds: [studentProfiles[1]._id, studentProfiles[5]._id, studentProfiles[15]._id],
      relation: 'father',
      occupation: 'Retailer & Village Elder',
      alternatePhone: '+91-9419066688',
      address: 'Near Jamia Masjid, Awanpora, Mattan',
    });

    // 9. Create Attendance Records for Today
    const todayStr = new Date().toISOString().split('T')[0];
    const pastDates = [todayStr, '2026-08-26', '2026-08-25', '2026-08-24'];

    for (const d of pastDates) {
      for (const st of studentProfiles) {
        await AttendanceRecord.create({
          organizationId: orgId,
          studentId: st._id,
          classId: st.classId,
          date: d,
          status: 'present',
          markedBy: teacherUsers[0]._id,
          midDayMealConsumed: true,
        });
      }
    }

    // 10. Create Exam Results & AI Remarks for Class 8 Students
    await ExamResult.create({
      organizationId: orgId,
      studentId: studentProfiles[0]._id,
      classId: classSections[7]._id,
      academicYear: '2026-2027',
      examName: 'Term 1 Mid-Evaluation',
      term: 'Term 1',
      subjectMarks: [
        { subjectName: 'English', maxMarks: 100, obtainedMarks: 88, grade: 'A' },
        { subjectName: 'Mathematics', maxMarks: 100, obtainedMarks: 94, grade: 'A+' },
        { subjectName: 'Science', maxMarks: 100, obtainedMarks: 91, grade: 'A+' },
        { subjectName: 'Urdu', maxMarks: 100, obtainedMarks: 85, grade: 'A' },
        { subjectName: 'Social Science', maxMarks: 100, obtainedMarks: 89, grade: 'A' },
        { subjectName: 'Kashmiri', maxMarks: 50, obtainedMarks: 46, grade: 'A+' },
      ],
      totalMax: 550,
      totalObtained: 493,
      percentage: 89.6,
      overallGrade: 'A+',
      aiRemarks:
        'Aaqib demonstrates outstanding academic diligence and active classroom participation with an impressive 89.6% score. Consistently shows exemplary analytical thinking in Science and Mathematics. Keep it up!',
      teacherRemarks: 'Excellent analytical skills and discipline. Class representative.',
      evaluatedBy: teacherUsers[0]._id,
    });

    await ExamResult.create({
      organizationId: orgId,
      studentId: studentProfiles[1]._id,
      classId: classSections[7]._id,
      academicYear: '2026-2027',
      examName: 'Term 1 Mid-Evaluation',
      term: 'Term 1',
      subjectMarks: [
        { subjectName: 'English', maxMarks: 100, obtainedMarks: 76, grade: 'B+' },
        { subjectName: 'Mathematics', maxMarks: 100, obtainedMarks: 82, grade: 'A' },
        { subjectName: 'Science', maxMarks: 100, obtainedMarks: 80, grade: 'A' },
        { subjectName: 'Urdu', maxMarks: 100, obtainedMarks: 74, grade: 'B+' },
        { subjectName: 'Social Science', maxMarks: 100, obtainedMarks: 78, grade: 'B+' },
        { subjectName: 'Kashmiri', maxMarks: 50, obtainedMarks: 38, grade: 'B+' },
      ],
      totalMax: 550,
      totalObtained: 428,
      percentage: 77.8,
      overallGrade: 'A',
      aiRemarks:
        'Faizan has displayed commendable consistency and good engagement across all subjects, maintaining a steady 77.8% average. With focused revision in English writing, higher excellence is well within reach.',
      teacherRemarks: 'Active in science experiments and sports.',
      evaluatedBy: teacherUsers[0]._id,
    });

    // 11. Create Multilingual Notices
    await Notice.create([
      {
        organizationId: orgId,
        title: 'Distribution of Free SSA Uniforms & Textbooks (2026-27)',
        body: 'All students of Classes 1st to 8th are hereby notified that the free textbook sets and winter uniform vouchers provided under the Samagra Shiksha Abhiyan (SSA) scheme will be distributed by the Zonal Education Officer on Monday.',
        category: 'scheme_update',
        targetAudience: ['all'],
        isPinned: true,
        translations: {
          ur: {
            title: 'مفت درسی کتب اور یونیفارم کی تقسیم (2026-27)',
            body: 'تمام طلباء اور سرپرستوں کو مطلع کیا جاتا ہے کہ سماگرا شیکشا ابھیان کے تحت جماعت اول تا ہشتم کے طلباء کے لیے مفت درسی کتب اور یونیفارم پیر کے روز اسکول میں تقسیم کیے جائیں گے۔',
          },
          ks: {
            title: 'مفت کتابن تہ یونیفارمن ہنز تقسیم',
            body: 'سماگرا شیکشا ابھیان تحت یوان وٲلی کتابہ تہ یونیفارم یین سوموار دۄہ اسکولس منز تقسیم کرنہ۔',
          },
          hi: {
            title: 'निःशुल्क एसएसए वर्दी एवं पाठ्यपुस्तक वितरण (2026-27)',
            body: 'कक्षा 1 से 8 तक के सभी छात्रों को सूचित किया जाता है कि समग्र शिक्षा अभियान (SSA) के तहत मुफ्त पाठ्यपुस्तकें और वर्दी सोमवार को विद्यालय में वितरित की जाएंगी।',
          },
        },
        createdBy: adminUser._id,
      },
      {
        organizationId: orgId,
        title: 'Parent-Teacher Meeting (PTM) & Term-1 Progress Review',
        body: 'A Parent-Teacher Meeting is scheduled for Saturday at 11:00 AM in the school hall to discuss student attendance, learning outcomes, and upcoming SCERT assessments. All parents are requested to attend.',
        category: 'academic',
        targetAudience: ['parents', 'teachers'],
        isPinned: true,
        translations: {
          ur: {
            title: 'والدین اور اساتذہ کی میٹنگ (PTM)',
            body: 'ہفتہ کے روز صبح 11:00 بجے اسکول ہال میں طلباء کی کارکردگی اور حاضری کے جائزے کے لیے پی ٹی ایم منعقد ہوگی۔ تمام والدین شرکت فرمائیں۔',
          },
          ks: {
            title: 'مول ماجن تہ استادن ہنز میٹنگ',
            body: 'بٹوار دۄہ 11 بجے اسکولس منز میٹنگ، یتھ منز شرین ہنز تعلیمی ترقی بحثس تحت ینہ۔',
          },
        },
        createdBy: adminUser._id,
      },
      {
        organizationId: orgId,
        title: 'Weekly PM-POSHAN (Mid-Day Meal) Menu & Nutrition Inspection',
        body: 'Special inspection conducted by the Village Education Committee. Fresh nutritious meals including Rajma Rice and seasonal greens served to 230 students today.',
        category: 'event',
        targetAudience: ['all'],
        isPinned: false,
        createdBy: teacherUsers[0]._id,
      },
    ]);

    // 12. Create Grant & Fund Records
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
        status: 'utilized',
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
      {
        organizationId: orgId,
        type: 'maintenance_fund',
        title: 'Classroom Whitewash & Winter Window Repair',
        amount: 18500,
        financialYear: '2026-2027',
        category: 'debit',
        description: 'Payment for window glass replacement and classroom whitewash before winter evaluation.',
        status: 'utilized',
        recordedBy: adminUser._id,
      },
    ]);

    // 13. Create Mid-Day Meal Log
    await MidDayMeal.create({
      organizationId: orgId,
      date: todayStr,
      menuServed: 'Rajma Chawal with Mixed Vegetable Greens & Boiled Eggs',
      riceConsumedKg: 24,
      vegetablesExpense: 480,
      studentsServedCount: 232,
      totalEnrolledCount: 248,
      cookAttendance: ['Raja Begum (Head Cook)', 'Amina Bano (Assistant Cook)'],
      qualityCheckedBy: teacherUsers[0]._id,
      remarks: 'Nutritious, warm meal prepared adhering to hygiene guidelines. Inspected by Headmaster.',
    });

    // 14. Create Timetable for Class 8
    await Timetable.create({
      organizationId: orgId,
      classId: classSections[7]._id,
      dayOfWeek: 'Monday',
      periods: [
        { periodNumber: 1, startTime: '09:45 AM', endTime: '10:30 AM', subject: 'Mathematics', teacherName: 'Nissar Ahmad Rather', room: 'Room 8' },
        { periodNumber: 2, startTime: '10:30 AM', endTime: '11:15 AM', subject: 'Science', teacherName: 'Shabir Ahmad Shah', room: 'Science Lab' },
        { periodNumber: 3, startTime: '11:15 AM', endTime: '12:00 PM', subject: 'Urdu', teacherName: 'Farooq Ahmad Dar', room: 'Room 8' },
        { periodNumber: 4, startTime: '12:00 PM', endTime: '12:45 PM', subject: 'English', teacherName: 'Nissar Ahmad Rather', room: 'Room 8' },
        { periodNumber: 5, startTime: '01:30 PM', endTime: '02:15 PM', subject: 'Social Science', teacherName: 'Altaf Hussain Wani', room: 'Room 8' },
        { periodNumber: 6, startTime: '02:15 PM', endTime: '03:00 PM', subject: 'Physical Education & Sports', teacherName: 'Reyaz Ahmad Lone', room: 'Playground' },
      ],
    });

    // 15. Create Homework for Class 8
    await Homework.create([
      {
        organizationId: orgId,
        classId: classSections[7]._id,
        subject: 'Mathematics',
        title: 'Linear Equations & Exercise 2.3',
        description: 'Complete problems 1 to 8 from Chapter 2 (Linear Equations in One Variable) in fair notebook.',
        assignedDate: todayStr,
        dueDate: '2026-08-29',
        teacherId: teacherUsers[0]._id,
      },
      {
        organizationId: orgId,
        classId: classSections[7]._id,
        subject: 'Science',
        title: 'Cell Structure & Plant Cell Diagram',
        description: 'Draw and label the neat diagram of a Plant Cell and Animal Cell highlighting Mitochondria and Nucleus.',
        assignedDate: todayStr,
        dueDate: '2026-08-30',
        teacherId: teacherUsers[1]._id,
      },
    ]);

    console.log('✅ Govt Middle School Awanpora database successfully populated with all 8 classes & 11 staff!');
  } catch (error) {
    console.error('Database seeding failed:', error);
  }
};
