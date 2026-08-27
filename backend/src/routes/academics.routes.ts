import { Router, Request, Response } from 'express';
import { verifyToken, requireRole } from '../middleware/auth';
import { ExamResult } from '../models/ExamResult';
import { Timetable } from '../models/Timetable';
import { Homework } from '../models/Homework';
import { StudentProfile } from '../models/StudentProfile';
import { AIService } from '../services/aiService';
import mongoose from 'mongoose';

const router = Router();

// GET /api/v1/academics/results
router.get('/results', verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId, studentId, examName } = req.query;
    const filter: any = { organizationId: req.user?.organizationId };

    if (classId) filter.classId = classId;
    if (studentId) filter.studentId = studentId;
    if (examName) filter.examName = examName;

    const results = await ExamResult.find(filter)
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name username avatarUrl' },
      })
      .populate('classId', 'className section');

    res.json({ success: true, count: results.length, results });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch exam results.' });
  }
});

// POST /api/v1/academics/results
router.post('/results', verifyToken, requireRole(['admin', 'teacher']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, classId, examName, term, subjectMarks, teacherRemarks } = req.body;

    if (!studentId || !classId || !examName || !Array.isArray(subjectMarks)) {
      res.status(400).json({ success: false, message: 'studentId, classId, examName, and subjectMarks required.' });
      return;
    }

    const totalMax = subjectMarks.reduce((acc: number, item: any) => acc + (item.maxMarks || 100), 0);
    const totalObtained = subjectMarks.reduce((acc: number, item: any) => acc + item.obtainedMarks, 0);
    const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;

    let overallGrade = 'A';
    if (percentage >= 90) overallGrade = 'A+';
    else if (percentage >= 80) overallGrade = 'A';
    else if (percentage >= 70) overallGrade = 'B+';
    else if (percentage >= 60) overallGrade = 'B';
    else if (percentage >= 50) overallGrade = 'C';
    else overallGrade = 'D';

    // Fetch student and class info for AI remarks
    const student = await StudentProfile.findById(studentId).populate('userId', 'name').populate('classId', 'className');
    const studentName = (student?.userId as any)?.name || 'Student';
    const gradeLevel = (student?.classId as any)?.className || 'Class 8';

    const aiRemarks = await AIService.generateStudentRemarks({
      studentName,
      gradeLevel,
      marks: subjectMarks,
      attendancePercentage: 92.5,
    });

    const result = await ExamResult.findOneAndUpdate(
      {
        organizationId: req.user?.organizationId,
        studentId,
        examName,
      },
      {
        classId,
        term: term || 'Term 1',
        subjectMarks,
        totalMax,
        totalObtained,
        percentage,
        overallGrade,
        aiRemarks,
        teacherRemarks,
        evaluatedBy: req.user?.userId,
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: 'Exam result saved with AI remarks generated.', result });
  } catch (error) {
    console.error('Save exam result error:', error);
    res.status(500).json({ success: false, message: 'Failed to save exam result.' });
  }
});

// GET /api/v1/academics/timetable
router.get('/timetable', verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId } = req.query;
    const filter: any = { organizationId: req.user?.organizationId };
    if (classId) filter.classId = classId;

    const timetable = await Timetable.find(filter).populate('classId', 'className section');
    res.json({ success: true, timetable });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch timetable.' });
  }
});

// POST /api/v1/academics/timetable (Admin & Teacher)
router.post('/timetable', verifyToken, requireRole(['admin', 'teacher']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId, dayOfWeek, periods } = req.body;

    if (!classId || !dayOfWeek || !Array.isArray(periods)) {
      res.status(400).json({ success: false, message: 'classId, dayOfWeek, and periods array are required.' });
      return;
    }

    const updated = await Timetable.findOneAndUpdate(
      {
        organizationId: req.user?.organizationId,
        classId,
        dayOfWeek,
      },
      {
        periods,
      },
      { upsert: true, new: true }
    ).populate('classId', 'className section');

    res.json({ success: true, message: `Timetable for ${dayOfWeek} saved successfully.`, timetable: updated });
  } catch (error) {
    console.error('Save timetable error:', error);
    res.status(500).json({ success: false, message: 'Failed to save timetable.' });
  }
});

// GET /api/v1/academics/homework
router.get('/homework', verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId } = req.query;
    const filter: any = { organizationId: req.user?.organizationId };
    if (classId) filter.classId = classId;

    const homework = await Homework.find(filter)
      .populate('teacherId', 'name')
      .populate('classId', 'className section')
      .sort({ assignedDate: -1 });

    res.json({ success: true, count: homework.length, homework });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch homework.' });
  }
});

// POST /api/v1/academics/homework
router.post('/homework', verifyToken, requireRole(['admin', 'teacher']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId, subject, title, description, dueDate } = req.body;

    if (!classId || !subject || !title || !dueDate) {
      res.status(400).json({ success: false, message: 'classId, subject, title, and dueDate are required.' });
      return;
    }

    const homework = await Homework.create({
      organizationId: req.user?.organizationId,
      classId,
      subject,
      title,
      description,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate,
      teacherId: req.user?.userId,
    });

    res.json({ success: true, message: 'Homework assignment published.', homework });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create homework assignment.' });
  }
});

export default router;
