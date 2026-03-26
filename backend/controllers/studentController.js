import * as StudentModel from '../models/Student.js';

export const getAllStudents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const students = await StudentModel.getAllStudents(limit, offset);
    res.json({ success: true, data: students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await StudentModel.getStudentById(id);
    
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    
    const stats = await StudentModel.getStudentStats(id);
    res.json({ success: true, data: { ...student, stats } });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const { name, email, phone, status } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }
    
    const student = await StudentModel.createStudent(name, email, phone, status);
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    console.error('Error creating student:', error);
    
    if (error.code === '23505') {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }
    
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, status } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }
    
    const student = await StudentModel.updateStudent(id, name, email, phone, status);
    
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    
    res.json({ success: true, data: student });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await StudentModel.deleteStudent(id);
    
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    
    res.json({ success: true, message: 'Student deleted', data: student });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getHighRiskStudents = async (req, res) => {
  try {
    const students = await StudentModel.getHighRiskStudents();
    res.json({ success: true, data: students });
  } catch (error) {
    console.error('Error fetching high risk students:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getTopStudents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const students = await StudentModel.getTopStudents(limit);
    res.json({ success: true, data: students });
  } catch (error) {
    console.error('Error fetching top students:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
