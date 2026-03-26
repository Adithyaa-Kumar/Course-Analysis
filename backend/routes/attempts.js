import express from 'express';
import * as attemptController from '../controllers/attemptController.js';

const router = express.Router();

router.get('/', attemptController.getAllAttempts);
router.post('/', attemptController.createAttempt);
router.get('/details', attemptController.getAttemptDetails);
router.get('/student/:studentId', attemptController.getStudentAttempts);
router.get('/student/:studentId/details', attemptController.getStudentAttemptDetails);
router.get('/exam/:examId', attemptController.getExamAttempts);
router.get('/course/:courseId', attemptController.getCourseAttempts);
router.get('/:id', attemptController.getAttemptById);
router.put('/:id', attemptController.updateAttempt);
router.delete('/:id', attemptController.deleteAttempt);

export default router;
