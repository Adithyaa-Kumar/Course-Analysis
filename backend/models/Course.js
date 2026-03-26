import { query } from '../db/database.js';

export const getAllCourses = async (limit = 50, offset = 0) => {
  const result = await query(
    'SELECT * FROM courses WHERE is_active = true LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return result.rows;
};

export const getCourseById = async (id) => {
  const result = await query('SELECT * FROM courses WHERE id = $1', [id]);
  return result.rows[0];
};

export const getCourseByCode = async (code) => {
  const result = await query('SELECT * FROM courses WHERE code = $1', [code]);
  return result.rows[0];
};

export const createCourse = async (code, name, description, instructor_name, credits, difficulty_level) => {
  const result = await query(
    `INSERT INTO courses (code, name, description, instructor_name, credits, difficulty_level) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [code, name, description, instructor_name, credits, difficulty_level]
  );
  return result.rows[0];
};

export const updateCourse = async (id, code, name, description, instructor_name, credits, difficulty_level) => {
  const result = await query(
    `UPDATE courses SET code = $1, name = $2, description = $3, instructor_name = $4, 
     credits = $5, difficulty_level = $6, updated_at = NOW() WHERE id = $7 RETURNING *`,
    [code, name, description, instructor_name, credits, difficulty_level, id]
  );
  return result.rows[0];
};

export const deleteCourse = async (id) => {
  const result = await query('DELETE FROM courses WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

export const getCoursePerformance = async (courseId) => {
  const result = await query(
    `SELECT * FROM course_performance_summary WHERE id = $1`,
    [courseId]
  );
  return result.rows[0];
};

export const getCoursesWithStats = async (limit = 50, offset = 0) => {
  const result = await query(
    `SELECT * FROM course_performance_summary
     ORDER BY id LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
};

export const getCoursePrerequisites = async (courseId) => {
  const result = await query(
    `SELECT c2.id, c2.code, c2.name, pre.is_required
     FROM prerequisites pre
     JOIN courses c2 ON pre.prerequisite_course_id = c2.id
     WHERE pre.course_id = $1`,
    [courseId]
  );
  return result.rows;
};

export const getCourseDependents = async (courseId) => {
  const result = await query(
    `SELECT c1.id, c1.code, c1.name, pre.is_required
     FROM prerequisites pre
     JOIN courses c1 ON pre.course_id = c1.id
     WHERE pre.prerequisite_course_id = $1`,
    [courseId]
  );
  return result.rows;
};

export const getDependencyAnalysis = async () => {
  const result = await query(
    `SELECT * FROM dependency_analysis
     ORDER BY course_id, prerequisite_id`
  );
  return result.rows;
};
