import { supabase, ORG_ID, normalizeClassId, DEFAULT_CLASSES } from './common';
import { validator } from '../validation/schemas';
import { logger } from '../telemetry/logger';

export const academicService = {
  getClasses: async () => {
    try {
      const { data: supaClasses, error } = await supabase
        .from('class_sections')
        .select('*')
        .order('grade_level', { ascending: true });

      if (!error && supaClasses && supaClasses.length > 0) {
        const formatted = supaClasses.map((c) => ({
          _id: c.id,
          className: c.class_name,
          gradeLevel: c.grade_level,
          section: c.section || 'A',
          roomNumber: c.room_number || `Room ${c.grade_level}`,
          capacity: 35,
          subjects: ['English', 'Mathematics', 'Science', 'Urdu', 'Social Science', 'Kashmiri'],
        }));
        return { success: true, classes: formatted };
      }
    } catch (err: any) {
      logger.warn('Classes load fallback notice', 'getClasses', { error: err?.message });
    }

    return { success: true, classes: DEFAULT_CLASSES };
  },

  getExamResults: async (classId?: string, studentId?: string) => {
    try {
      let query = supabase
        .from('exam_results')
        .select('*, student:student_profiles(*, user:users(*)), class:class_sections(*)');

      if (classId) {
        const normalized = normalizeClassId(classId);
        query = query.eq('class_id', normalized);
      }

      if (studentId) {
        // Resolve student profile ID if a user ID was provided
        const { data: stdProfile } = await supabase
          .from('student_profiles')
          .select('id')
          .or(`id.eq.${studentId},user_id.eq.${studentId}`)
          .maybeSingle();

        const validStudentId = stdProfile?.id || studentId;
        query = query.eq('student_id', validStudentId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;

      const results = (data || []).map((r) => {
        const subjectMarks = (r.subject_marks || []).map((s: any) => {
          const max = Number(s.maxMarks) || 100;
          const obt = Number(s.obtainedMarks) || 0;
          const pct = max > 0 ? (obt / max) * 100 : 0;
          const grade = s.grade || (pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B+' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : pct >= 33 ? 'D' : 'E');
          return {
            subjectName: s.subjectName || 'Subject',
            maxMarks: max,
            obtainedMarks: obt,
            grade,
          };
        });

        const totalMax = subjectMarks.reduce((acc: number, s: any) => acc + s.maxMarks, 0) || Number(r.total_max) || 500;
        const totalObtained = subjectMarks.reduce((acc: number, s: any) => acc + s.obtainedMarks, 0) || Number(r.total_obtained) || 0;
        const percentage = totalMax > 0 ? parseFloat(((totalObtained / totalMax) * 100).toFixed(2)) : (Number(r.percentage) || 0);
        const overallGrade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B+' : percentage >= 60 ? 'B' : percentage >= 50 ? 'C' : percentage >= 33 ? 'D' : 'E';

        return {
          _id: r.id,
          examName: r.exam_name || 'Term 1 Mid-Evaluation',
          term: r.term || 'Term 1',
          percentage,
          overallGrade,
          aiRemarks: r.ai_remarks || 'Consistent academic performance.',
          teacherRemarks: r.teacher_remarks || 'Diligent classroom participation.',
          studentId: {
            _id: r.student?.id || r.student_id,
            rollNumber: r.student?.roll_number || 1,
            userId: {
              name: r.student?.user?.name || 'Student',
              avatarUrl: r.student?.user?.avatar_url,
            },
          },
          classId: {
            className: r.class?.class_name || 'Class 1',
            section: r.class?.section || 'A',
          },
          subjectMarks,
          totalMax,
          totalObtained,
        };
      });

      return { success: true, results };
    } catch (err: any) {
      logger.error('getExamResults error', 'getExamResults', { error: err?.message });
      return { success: true, results: [] };
    }
  },

  saveExamResult: async (payload: any) => {
    // 1. Runtime Payload Validation
    const validation = validator.validateExamResult(payload);
    if (!validation.valid) {
      logger.warn('saveExamResult rejected by validation', 'saveExamResult', { errors: validation.errors });
      return { success: false, message: validation.firstError || 'Validation failed.' };
    }

    try {
      const normalizedClass = normalizeClassId(payload.classId);

      let targetStudentId = payload.studentId;
      if (payload.studentId) {
        const { data: stdProfile } = await supabase
          .from('student_profiles')
          .select('id')
          .or(`id.eq.${payload.studentId},user_id.eq.${payload.studentId}`)
          .maybeSingle();
        if (stdProfile?.id) {
          targetStudentId = stdProfile.id;
        }
      }

      const totalMax = payload.subjectMarks?.reduce((acc: number, s: any) => acc + (Number(s.maxMarks) || 100), 0) || 500;
      const totalObtained = payload.subjectMarks?.reduce((acc: number, s: any) => acc + (Number(s.obtainedMarks) || 0), 0) || 0;
      const percentage = totalMax > 0 ? parseFloat(((totalObtained / totalMax) * 100).toFixed(2)) : 0;
      const overallGrade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B+' : percentage >= 60 ? 'B' : percentage >= 50 ? 'C' : 'D';

      const { data: inserted, error } = await supabase.from('exam_results').insert({
        organization_id: ORG_ID,
        student_id: targetStudentId,
        class_id: normalizedClass,
        exam_name: payload.examName || 'Term 1 Mid-Evaluation',
        term: payload.term || 'Term 1',
        subject_marks: payload.subjectMarks || [],
        total_max: totalMax,
        total_obtained: totalObtained,
        percentage: percentage,
        overall_grade: overallGrade,
        teacher_remarks: payload.teacherRemarks || 'Satisfactory academic performance in continuous assessment.',
        ai_remarks: `${payload.studentName || 'The student'} demonstrates commendable academic aptitude with ${percentage}% marks and Grade ${overallGrade} in SCERT CCE evaluation.`,
      }).select().single();

      if (error) {
        logger.error('saveExamResult supabase error', 'saveExamResult', { error: error.message });
        return { success: false, message: error.message || 'Failed to save exam result.' };
      }

      logger.audit('EXAM_RESULT_SUBMITTED', 'ExamResult', inserted?.id || targetStudentId, {
        studentId: targetStudentId,
        percentage,
        overallGrade,
      });

      return { success: true, message: 'Marksheet saved and updated in Supabase.' };
    } catch (err: any) {
      logger.error('Unexpected exception during saveExamResult', 'saveExamResult', { error: err?.message });
      return { success: false, message: err?.message || 'Failed to save exam result.' };
    }
  },

  getTimetable: async (classId?: string) => {
    try {
      const normalizedClass = normalizeClassId(classId);
      const { data, error } = await supabase
        .from('timetables')
        .select('*')
        .eq('class_id', normalizedClass);

      if (!error && data && data.length > 0) {
        const timetable = data.map((t) => ({
          _id: t.id,
          dayOfWeek: t.day_of_week,
          periods: t.periods || [],
        }));
        return { success: true, timetable };
      }
    } catch {}

    const defaultPeriods = [
      { periodNumber: 1, startTime: '09:45 AM', endTime: '10:30 AM', subject: 'English', teacherName: 'Shameema Bano', room: 'Room 101' },
      { periodNumber: 2, startTime: '10:30 AM', endTime: '11:15 AM', subject: 'Mathematics', teacherName: 'Farooq Ahmad Dar', room: 'Room 101' },
      { periodNumber: 3, startTime: '11:15 AM', endTime: '12:00 PM', subject: 'Science', teacherName: 'Farooq Ahmad Dar', room: 'Science Lab' },
      { periodNumber: 4, startTime: '12:00 PM', endTime: '12:45 PM', subject: 'Urdu', teacherName: 'Shameema Bano', room: 'Room 101' },
      { periodNumber: 5, startTime: '01:30 PM', endTime: '02:15 PM', subject: 'Social Science', teacherName: 'Mohammad Ashraf Bhat', room: 'Room 101' },
      { periodNumber: 6, startTime: '02:15 PM', endTime: '03:00 PM', subject: 'Kashmiri & PET', teacherName: 'Duty Teacher', room: 'Playground' },
    ];

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return {
      success: true,
      timetable: days.map((day, idx) => ({
        _id: `tt_${idx}`,
        dayOfWeek: day,
        periods: defaultPeriods,
      })),
    };
  },

  saveTimetable: async (classIdOrPayload: any, dayOfWeekParam?: string, periodsParam?: any[]) => {
    try {
      let classId: string;
      let dayOfWeek: string;
      let periods: any[];

      if (typeof classIdOrPayload === 'object' && classIdOrPayload !== null) {
        classId = classIdOrPayload.classId;
        dayOfWeek = classIdOrPayload.dayOfWeek;
        periods = classIdOrPayload.periods;
      } else {
        classId = classIdOrPayload;
        dayOfWeek = dayOfWeekParam || 'Monday';
        periods = periodsParam || [];
      }

      const normalizedClass = normalizeClassId(classId);
      const { error } = await supabase.from('timetables').upsert(
        {
          organization_id: ORG_ID,
          class_id: normalizedClass,
          day_of_week: dayOfWeek,
          periods: periods,
        },
        { onConflict: 'organization_id,class_id,day_of_week' }
      );

      if (error) {
        logger.error('saveTimetable supabase error', 'saveTimetable', { error: error.message });
        return { success: false, message: error.message || 'Failed to save timetable.' };
      }

      logger.audit('TIMETABLE_UPDATED', 'Timetable', normalizedClass, { dayOfWeek, periodsCount: periods.length });
      return { success: true, message: `Schedule updated for ${dayOfWeek} in Supabase.` };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to update schedule.' };
    }
  },

  getHomework: async (classId?: string) => {
    try {
      let query = supabase.from('homework').select('*');
      if (classId) {
        const normalized = normalizeClassId(classId);
        query = query.eq('class_id', normalized);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;

      const homework = (data || []).map((h) => ({
        _id: h.id,
        subject: h.subject,
        title: h.title,
        description: h.description,
        assignedDate: h.assigned_date,
        dueDate: h.due_date,
      }));
      return { success: true, homework };
    } catch {
      return {
        success: true,
        homework: [],
      };
    }
  },

  addHomework: async (payload: any) => {
    try {
      const normalizedClass = normalizeClassId(payload.classId);
      const { error } = await supabase.from('homework').insert({
        organization_id: ORG_ID,
        class_id: normalizedClass,
        subject: payload.subject,
        title: payload.title,
        description: payload.description,
        assigned_date: payload.assignedDate || new Date().toISOString().split('T')[0],
        due_date: payload.dueDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      });

      if (error) {
        logger.error('addHomework supabase error', 'addHomework', { error: error.message });
        return { success: false, message: error.message || 'Failed to post homework assignment.' };
      }

      logger.audit('HOMEWORK_POSTED', 'Homework', normalizedClass, { subject: payload.subject, title: payload.title });
      return { success: true, message: 'Homework assignment posted to Class in Supabase.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to post homework.' };
    }
  },
};
