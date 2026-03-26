import express from 'express';
import * as studentController from '../controllers/studentController.js';

const router = express.Router();

router.get('/', studentController.getAllStudents);
router.post('/', studentController.createStudent);
router.get('/top', studentController.getTopStudents);
router.get('/risk', studentController.getHighRiskStudents);
router.get('/:id', studentController.getStudentById);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

export default router;
