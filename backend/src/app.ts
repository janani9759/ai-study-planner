import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import studentRoutes from './routes/studentRoutes';
import subjectRoutes from './routes/subjectRoutes';
import topicRoutes from './routes/topicRoutes';
import examRoutes from './routes/examRoutes';
import plannerRoutes from './routes/plannerRoutes';
import aiRoutes from './routes/aiRoutes';
import comfortRoutes from './routes/comfortRoutes';
import brainDumpRoutes from './routes/brainDumpRoutes';
import quizRoutes from './routes/quizRoutes';
import progressRoutes from './routes/progressRoutes';
import goalRoutes from './routes/goalRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', app: 'AI Study Planner Express API', timestamp: new Date().toISOString() });
});

// REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/comfort', comfortRoutes);
app.use('/api/brain-dump', brainDumpRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    path: req.originalUrl
  });
});

export default app;
