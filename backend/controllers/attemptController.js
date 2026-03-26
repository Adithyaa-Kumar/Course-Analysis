import * as AttemptModel from '../models/Attempt.js';

export const getAllAttempts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const attempts = await AttemptModel.getAllAttempts(limit, offset);
    res.json({ success: true, data: attempts });
  } catch (error) {
    console.error('Error fetching attempts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAttemptById = async (req, res) => {
  try {
    const { id } = req.params;
    const attempt = await AttemptModel.getAttemptById(id);
    
    if (!attempt) {
      return res.status(404).json({ success: false, error: 'Attempt not found' });
    }
    
    res.json({ success: true, data: attempt });
  } catch (error) {
    console.error('Error fetching attempt:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getStudentAttempts = async (req, res) => {
  try {
    const { studentId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const attempts = await AttemptModel.getStudentAttempts(studentId, limit, offset);
    res.json({ success: true, data: attempts });
  } catch (error) {
    console.error('Error fetching student attempts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getStudentAttemptDetails = async (req, res) => {
  try {
    const { studentId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const attempts = await AttemptModel.getStudentAttemptDetails(studentId, limit, offset);
    res.json({ success: true, data: attempts });
  } catch (error) {
    console.error('Error fetching attempt details:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getExamAttempts = async (req, res) => {
  try {
    const { examId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const attempts = await AttemptModel.getExamAttempts(examId, limit, offset);
    res.json({ success: true, data: attempts });
  } catch (error) {
    console.error('Error fetching exam attempts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createAttempt = async (req, res) => {
  try {
    const { studentId, examId, marksObtained, percentage, timeMinutes } = req.body;
    
    if (!studentId || !examId || marksObtained === undefined || percentage === undefined) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    const attempt = await AttemptModel.createAttempt(studentId, examId, marksObtained, percentage, timeMinutes);
    res.status(201).json({ success: true, data: attempt });
  } catch (error) {
    console.error('Error creating attempt:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateAttempt = async (req, res) => {
  try {
    const { id } = req.params;
    const { marksObtained, percentage, status, feedback } = req.body;
    
    if (marksObtained === undefined || percentage === undefined) {
      return res.status(400).json({ success: false, error: 'Marks and percentage are required' });
    }
    
    const attempt = await AttemptModel.updateAttempt(id, marksObtained, percentage, status, feedback);
    
    if (!attempt) {
      return res.status(404).json({ success: false, error: 'Attempt not found' });
    }
    
    res.json({ success: true, data: attempt });
  } catch (error) {
    console.error('Error updating attempt:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteAttempt = async (req, res) => {
  try {
    const { id } = req.params;
    const attempt = await AttemptModel.deleteAttempt(id);
    
    if (!attempt) {
      return res.status(404).json({ success: false, error: 'Attempt not found' });
    }
    
    res.json({ success: true, message: 'Attempt deleted', data: attempt });
  } catch (error) {
    console.error('Error deleting attempt:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAttemptDetails = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const attempts = await AttemptModel.getAttemptDetails(limit, offset);
    res.json({ success: true, data: attempts });
  } catch (error) {
    console.error('Error fetching attempt details:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCourseAttempts = async (req, res) => {
  try {
    const { courseId } = req.params;
    const attempts = await AttemptModel.getCourseAttempts(courseId);
    res.json({ success: true, data: attempts });
  } catch (error) {
    console.error('Error fetching course attempts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
