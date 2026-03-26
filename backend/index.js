import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Route imports
import studentRoutes from './routes/students.js';
import courseRoutes from './routes/courses.js';
import attemptRoutes from './routes/attempts.js';
import analyticsRoutes from './routes/analytics.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    message: 'Course Analytics API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/analytics', analyticsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Course Attempt & Performance Analytics System',
    version: '1.0.0',
    description: 'A comprehensive system for analyzing student course attempts, performance metrics, and dependency analysis',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: 'GET /health',
      students: {
        all: 'GET /api/students',
        create: 'POST /api/students',
        detail: 'GET /api/students/:id',
        update: 'PUT /api/students/:id',
        delete: 'DELETE /api/students/:id',
        top: 'GET /api/students/top',
        risk: 'GET /api/students/risk'
      },
      courses: {
        all: 'GET /api/courses',
        create: 'POST /api/courses',
        detail: 'GET /api/courses/:id',
        update: 'PUT /api/courses/:id',
        delete: 'DELETE /api/courses/:id',
        stats: 'GET /api/courses/stats',
        dependency: 'GET /api/courses/dependency/analysis'
      },
      attempts: {
        all: 'GET /api/attempts',
        create: 'POST /api/attempts',
        detail: 'GET /api/attempts/:id',
        update: 'PUT /api/attempts/:id',
        delete: 'DELETE /api/attempts/:id',
        byStudent: 'GET /api/attempts/student/:studentId',
        byExam: 'GET /api/attempts/exam/:examId',
        byCourse: 'GET /api/attempts/course/:courseId',
        details: 'GET /api/attempts/details'
      },
      analytics: {
        dashboard: 'GET /api/analytics/dashboard',
        studentPerformance: 'GET /api/analytics/student/:studentId/performance',
        courseFailure: 'GET /api/analytics/courses/failure',
        studentImprovement: 'GET /api/analytics/students/improvement',
        instructorRanking: 'GET /api/analytics/instructors/ranking',
        consistentPerformers: 'GET /api/analytics/students/consistent',
        difficultyAnalysis: 'GET /api/analytics/courses/difficulty',
        prerequisiteImpact: 'GET /api/analytics/prerequisites/impact'
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Course Analytics API server is running on http://localhost:${PORT}`);
  console.log(`📚 Documentation: http://localhost:${PORT}/`);
  console.log(`💉 Health check: http://localhost:${PORT}/health`);
});
