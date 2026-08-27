import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import attendanceRoutes from './routes/attendance.routes';
import academicsRoutes from './routes/academics.routes';
import noticesRoutes from './routes/notices.routes';
import grantsRoutes from './routes/grants.routes';
import aiRoutes from './routes/ai.routes';
import statsRoutes from './routes/stats.routes';
import usersRoutes from './routes/users.routes';
import financeRoutes from './routes/finance.routes';
import { seedDatabase } from './seeds/seed';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Routes
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    institution: 'Govt Middle School Awanpora',
    zone: 'Zone Mattan',
    district: 'Anantnag',
    scheme: 'Samagra Shiksha / J&K SED',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/academics', academicsRoutes);
app.use('/api/v1/notices', noticesRoutes);
app.use('/api/v1/grants', grantsRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/finance', financeRoutes);

// Global 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.url}` });
});

// Start Server
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 GMS Awanpora ERP Backend running on port ${PORT}`);
      console.log(`📍 Endpoint: http://localhost:${PORT}/api/v1/health`);
      console.log(`🏫 Institution: Govt Middle School Awanpora (Zone Mattan)`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();

export default app;
