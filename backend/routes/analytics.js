import express from 'express';
import * as analyticsController from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/dashboard', analyticsController.getSystemDashboardStats);
router.get('/student/:studentId/performance', analyticsController.getStudentPerformanceOverTime);
router.get('/courses/failure', analyticsController.getCourseFailureAnalysis);
router.get('/students/improvement', analyticsController.getStudentImprovement);
router.get('/instructors/ranking', analyticsController.getInstructorRanking);
router.get('/students/consistent', analyticsController.getConsistentPerformers);
router.get('/courses/difficulty', analyticsController.getDifficultyCourseAnalysis);
router.get('/prerequisites/impact', analyticsController.getPrerequisiteImpact);

export default router;
