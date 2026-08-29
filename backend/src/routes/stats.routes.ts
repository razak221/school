import { Router, Request, Response } from 'express';
import { verifyToken } from '../middleware/auth';
import { StudentProfile } from '../models/StudentProfile';
import { TeacherProfile } from '../models/TeacherProfile';
import { ClassSection } from '../models/ClassSection';
import { AttendanceRecord } from '../models/AttendanceRecord';
import { GrantAndFee } from '../models/GrantAndFee';
import { MidDayMeal } from '../models/MidDayMeal';
import { Notice } from '../models/Notice';
import mongoose from 'mongoose';

const router = Router();

// GET /api/v1/stats/overview
router.get('/overview', verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const orgId = new mongoose.Types.ObjectId(req.user?.organizationId);
    const today = new Date().toISOString().split('T')[0];

    const [
      totalStudents,
      totalTeachers,
      totalClasses,
      noticesCount,
      todayAttendance,
      todayMdm,
      grants,
    ] = await Promise.all([
      StudentProfile.countDocuments({ organizationId: orgId }),
      TeacherProfile.countDocuments({ organizationId: orgId }),
      ClassSection.countDocuments({ organizationId: orgId }),
      Notice.countDocuments({ organizationId: orgId }),
      AttendanceRecord.find({ organizationId: orgId, date: today }),
      MidDayMeal.findOne({ organizationId: orgId, date: today }),
      GrantAndFee.find({ organizationId: orgId }),
    ]);

    const presentStudents = todayAttendance.filter((r) => r.status === 'present' || r.status === 'late').length;
    const attendancePct = totalStudents > 0 ? ((presentStudents / totalStudents) * 100).toFixed(1) : '0.0';

    const totalGrantAllocated = grants
      .filter((g) => g.category === 'credit')
      .reduce((acc, g) => acc + (g.amount || 0), 0);

    const totalGrantUtilized = grants
      .filter((g) => g.category === 'debit')
      .reduce((acc, g) => acc + (g.amount || 0), 0);

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalTeachers,
        totalClasses,
        noticesCount,
        todayAttendancePercentage: attendancePct,
        presentToday: presentStudents,
        absentToday: Math.max(0, totalStudents - presentStudents),
        midDayMealServedCount: todayMdm?.studentsServedCount || 0,
        grants: {
          allocated: totalGrantAllocated,
          utilized: totalGrantUtilized,
          balance: totalGrantAllocated - totalGrantUtilized,
        },
      },
    });
  } catch (error) {
    console.error('Stats overview error:', error);
    res.status(500).json({ success: false, message: 'Failed to calculate stats overview.' });
  }
});

export default router;
