import * as CourseModel from '../models/Course.js';

export const getAllCourses = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const courses = await CourseModel.getAllCourses(limit, offset);
    res.json({ success: true, data: courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await CourseModel.getCourseById(id);
    
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    
    const performance = await CourseModel.getCoursePerformance(id);
    const prerequisites = await CourseModel.getCoursePrerequisites(id);
    const dependents = await CourseModel.getCourseDependents(id);
    
    res.json({ 
      success: true, 
      data: { 
        ...course, 
        performance, 
        prerequisites, 
        dependents 
      } 
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { code, name, description, instructor_name, credits, difficulty_level } = req.body;
    
    if (!code || !name) {
      return res.status(400).json({ success: false, error: 'Code and name are required' });
    }
    
    const course = await CourseModel.createCourse(code, name, description, instructor_name, credits, difficulty_level);
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    console.error('Error creating course:', error);
    
    if (error.code === '23505') {
      return res.status(400).json({ success: false, error: 'Course code already exists' });
    }
    
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, description, instructor_name, credits, difficulty_level } = req.body;
    
    if (!code || !name) {
      return res.status(400).json({ success: false, error: 'Code and name are required' });
    }
    
    const course = await CourseModel.updateCourse(id, code, name, description, instructor_name, credits, difficulty_level);
    
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    
    res.json({ success: true, data: course });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await CourseModel.deleteCourse(id);
    
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    
    res.json({ success: true, message: 'Course deleted', data: course });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCoursesWithStats = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const courses = await CourseModel.getCoursesWithStats(limit, offset);
    res.json({ success: true, data: courses });
  } catch (error) {
    console.error('Error fetching course stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getDependencyAnalysis = async (req, res) => {
  try {
    const analysis = await CourseModel.getDependencyAnalysis();
    res.json({ success: true, data: analysis });
  } catch (error) {
    console.error('Error fetching dependency analysis:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
