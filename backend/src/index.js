import { Hono } from 'hono';
import { cors } from 'hono/cors';
import studentRoutes from './routes/students';
import courseRoutes from './routes/courses';
import attemptRoutes from './routes/attempts';
import analyticsRoutes from './routes/analytics';

const app = new Hono();

// CORS middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}));

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    message: 'Course Analytics API is running',
    timestamp: new Date().toISOString(),
    platform: 'Cloudflare Workers + D1'
  });
});

// Root endpoint with API documentation
app.get('/', (c) => {
  return c.json({
    name: 'Course Attempt & Performance Analytics System',
    version: '1.0.0',
    description: 'A comprehensive system for analyzing student course attempts, performance metrics, and dependency analysis',
    platform: 'Cloudflare Workers with D1 Database',
    endpoints: {
      health: 'GET /health',
      students: {
        getAll: 'GET /api/students',
        getById: 'GET /api/students/:id',
        getTop: 'GET /api/students/top',
        getAtRisk: 'GET /api/students/risk',
        create: 'POST /api/students',
        update: 'PUT /api/students/:id',
        delete: 'DELETE /api/students/:id'
      },
      courses: {
        getAll: 'GET /api/courses',
        getById: 'GET /api/courses/:id',
        getStats: 'GET /api/courses/stats',
        getDependencyAnalysis: 'GET /api/courses/dependency/analysis',
        create: 'POST /api/courses',
        update: 'PUT /api/courses/:id',
        delete: 'DELETE /api/courses/:id'
      },
      attempts: {
        getAll: 'GET /api/attempts',
        getById: 'GET /api/attempts/:id',
        getDetails: 'GET /api/attempts/details',
        getByStudent: 'GET /api/attempts/student/:studentId',
        getStudentDetails: 'GET /api/attempts/student/:studentId/details',
        getByExam: 'GET /api/attempts/exam/:examId',
        getByCourse: 'GET /api/attempts/course/:courseId',
        create: 'POST /api/attempts',
        update: 'PUT /api/attempts/:id',
        delete: 'DELETE /api/attempts/:id'
      },
      analytics: {
        getDashboard: 'GET /api/analytics/dashboard',
        getStudentPerformance: 'GET /api/analytics/student/:studentId/performance',
        getCourseFailureAnalysis: 'GET /api/analytics/courses/failure',
        getStudentImprovement: 'GET /api/analytics/students/improvement',
        getInstructorRanking: 'GET /api/analytics/instructors/ranking',
        getConsistentPerformers: 'GET /api/analytics/students/consistent',
        getDifficultyCourseAnalysis: 'GET /api/analytics/courses/difficulty',
        getPrerequisiteImpact: 'GET /api/analytics/prerequisites/impact'
      }
    }
  });
});

// API Routes
app.route('/api/students', studentRoutes);
app.route('/api/courses', courseRoutes);
app.route('/api/attempts', attemptRoutes);
app.route('/api/analytics', analyticsRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({
    error: 'Not Found',
    message: `Endpoint ${c.req.method} ${c.req.path} does not exist`,
    status: 404
  }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({
    error: 'Internal Server Error',
    message: err.message || 'An error occurred',
    status: 500
  }, 500);
});

export default app;
