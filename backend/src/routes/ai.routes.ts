import { Router, Request, Response } from 'express';
import { verifyToken } from '../middleware/auth';
import { AIService } from '../services/aiService';

const router = Router();

// POST /api/v1/ai/generate-remarks
router.post('/generate-remarks', verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentName, gradeLevel, marks, attendancePercentage } = req.body;

    if (!studentName || !marks) {
      res.status(400).json({ success: false, message: 'studentName and marks are required.' });
      return;
    }

    const remarks = await AIService.generateStudentRemarks({
      studentName,
      gradeLevel: gradeLevel || 'Class 8',
      marks,
      attendancePercentage: attendancePercentage || 92.0,
    });

    res.json({ success: true, remarks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'AI remarks generation failed.' });
  }
});

// POST /api/v1/ai/translate-notice
router.post('/translate-notice', verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, body, language = 'ur' } = req.body;

    if (!title || !body) {
      res.status(400).json({ success: false, message: 'title and body are required.' });
      return;
    }

    const result = await AIService.translateNotice(title, body, language);
    res.json({ success: true, translation: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Translation failed.' });
  }
});

// POST /api/v1/ai/chat
router.post('/chat', verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, context } = req.body;

    if (!message) {
      res.status(400).json({ success: false, message: 'message is required.' });
      return;
    }

    const reply = await AIService.answerSchoolQuery(message, req.user?.role || 'parent', context);
    res.json({ success: true, reply });
  } catch (error) {
    res.status(500).json({ success: false, message: 'AI chat query failed.' });
  }
});

export default router;
