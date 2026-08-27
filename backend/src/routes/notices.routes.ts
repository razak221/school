import { Router, Request, Response } from 'express';
import { verifyToken, requireRole } from '../middleware/auth';
import { Notice } from '../models/Notice';
import { AIService } from '../services/aiService';

const router = Router();

// GET /api/v1/notices
router.get('/', verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const userRole = req.user?.role || 'student';
    const notices = await Notice.find({
      organizationId: req.user?.organizationId,
      $or: [{ targetAudience: 'all' }, { targetAudience: `${userRole}s` }, { targetAudience: userRole }],
    })
      .populate('createdBy', 'name role')
      .sort({ isPinned: -1, createdAt: -1 });

    res.json({ success: true, count: notices.length, notices });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notices.' });
  }
});

// POST /api/v1/notices
router.post('/', verifyToken, requireRole(['admin', 'teacher']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, body, category, targetAudience, isPinned, autoTranslate } = req.body;

    if (!title || !body) {
      res.status(400).json({ success: false, message: 'Title and body are required.' });
      return;
    }

    let translations: any = {};
    if (autoTranslate) {
      const [ur, ks, hi] = await Promise.all([
        AIService.translateNotice(title, body, 'ur'),
        AIService.translateNotice(title, body, 'ks'),
        AIService.translateNotice(title, body, 'hi'),
      ]);
      translations = { ur, ks, hi };
    }

    const notice = await Notice.create({
      organizationId: req.user?.organizationId,
      title,
      body,
      category: category || 'academic',
      targetAudience: targetAudience || ['all'],
      isPinned: !!isPinned,
      translations,
      createdBy: req.user?.userId,
    });

    res.json({ success: true, message: 'Notice published successfully.', notice });
  } catch (error) {
    console.error('Notice creation error:', error);
    res.status(500).json({ success: false, message: 'Failed to publish notice.' });
  }
});

// POST /api/v1/notices/:id/translate
router.post('/:id/translate', verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { language = 'ur' } = req.body;
    const notice = await Notice.findOne({
      _id: req.params.id,
      organizationId: req.user?.organizationId,
    });

    if (!notice) {
      res.status(404).json({ success: false, message: 'Notice not found.' });
      return;
    }

    const translation = await AIService.translateNotice(notice.title, notice.body, language as any);

    if (!notice.translations) notice.translations = {};
    (notice.translations as any)[language] = translation;
    await notice.save();

    res.json({ success: true, language, translation, notice });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Translation failed.' });
  }
});

export default router;
