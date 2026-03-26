import express from 'express';
import * as courseController from '../controllers/courseController.js';

const router = express.Router();

router.get('/', courseController.getAllCourses);
router.post('/', courseController.createCourse);
router.get('/stats', courseController.getCoursesWithStats);
router.get('/dependency/analysis', courseController.getDependencyAnalysis);
router.get('/:id', courseController.getCourseById);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

export default router;
