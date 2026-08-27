import { Router, Request, Response } from 'express';
import { verifyToken, requireRole } from '../middleware/auth';
import { GrantAndFee } from '../models/GrantAndFee';
import { MidDayMeal } from '../models/MidDayMeal';

const router = Router();

// GET /api/v1/grants
router.get('/', verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const grants = await GrantAndFee.find({ organizationId: req.user?.organizationId })
      .populate('recordedBy', 'name')
      .sort({ allocatedDate: -1 });

    const totalCredits = grants
      .filter((g) => g.category === 'credit')
      .reduce((acc, g) => acc + g.amount, 0);

    const totalDebits = grants
      .filter((g) => g.category === 'debit')
      .reduce((acc, g) => acc + g.amount, 0);

    res.json({
      success: true,
      summary: {
        totalAllocated: totalCredits,
        totalUtilized: totalDebits,
        balanceAvailable: totalCredits - totalDebits,
      },
      grants,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch grant records.' });
  }
});

// POST /api/v1/grants
router.post('/', verifyToken, requireRole(['admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, title, amount, category, sanctionNumber, description, status } = req.body;

    if (!type || !title || !amount || !category) {
      res.status(400).json({ success: false, message: 'type, title, amount, and category are required.' });
      return;
    }

    const record = await GrantAndFee.create({
      organizationId: req.user?.organizationId,
      type,
      title,
      amount,
      category,
      sanctionNumber,
      description,
      status: status || 'allocated',
      recordedBy: req.user?.userId,
    });

    res.json({ success: true, message: 'Grant/Fund transaction saved.', record });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save grant transaction.' });
  }
});

// GET /api/v1/grants/mdm-log
router.get('/mdm-log', verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const logs = await MidDayMeal.find({ organizationId: req.user?.organizationId })
      .populate('qualityCheckedBy', 'name')
      .sort({ date: -1 })
      .limit(30);

    res.json({ success: true, count: logs.length, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch Mid-Day Meal logs.' });
  }
});

// POST /api/v1/grants/mdm-log
router.post('/mdm-log', verifyToken, requireRole(['admin', 'teacher']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, menuServed, riceConsumedKg, vegetablesExpense, studentsServedCount, totalEnrolledCount, remarks } =
      req.body;

    const log = await MidDayMeal.findOneAndUpdate(
      {
        organizationId: req.user?.organizationId,
        date: date || new Date().toISOString().split('T')[0],
      },
      {
        menuServed: menuServed || 'Rice with Mixed Vegetables & Dal',
        riceConsumedKg: riceConsumedKg || 25,
        vegetablesExpense: vegetablesExpense || 450,
        studentsServedCount: studentsServedCount || 230,
        totalEnrolledCount: totalEnrolledCount || 248,
        qualityCheckedBy: req.user?.userId,
        remarks,
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: 'Mid-Day Meal log recorded successfully.', log });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to record MDM log.' });
  }
});

export default router;
