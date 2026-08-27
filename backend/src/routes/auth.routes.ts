import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Organization } from '../models/Organization';
import { verifyToken } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'gms_awanpora_super_secret_jwt_key_2026';

// POST /api/v1/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ success: false, message: 'Username and password are required.' });
      return;
    }

    const user = await User.findOne({ username: username.toLowerCase().trim() });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid password.' });
      return;
    }

    const org = await Organization.findById(user.organizationId);

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        organizationId: user.organizationId.toString(),
        role: user.role,
        name: user.name,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatarUrl: user.avatarUrl,
        organization: org
          ? {
              id: org._id,
              name: org.name,
              affiliation: org.affiliation,
              zone: org.zone,
              district: org.district,
              state: org.state,
              code: org.code,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
});

// GET /api/v1/auth/me
router.get('/me', verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({
      _id: req.user?.userId,
      organizationId: req.user?.organizationId,
    }).select('-passwordHash');

    if (!user) {
      res.status(404).json({ success: false, message: 'User profile not found.' });
      return;
    }

    const org = await Organization.findById(req.user?.organizationId);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatarUrl: user.avatarUrl,
        organization: org,
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching profile.' });
  }
});

export default router;
