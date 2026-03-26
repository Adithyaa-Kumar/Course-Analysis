import { query } from '../db/database.js';

export const getAllAttempts = async (limit = 50, offset = 0) => {
  const result = await query(
    'SELECT * FROM attempts LIMIT $1 OFFSET $2 ORDER BY attempt_date DESC',
    [limit, offset]
  );
  return result.rows;
};

export const getAttemptById = async (id) => {
  const result = await query('SELECT * FROM attempts WHERE id = $1', [id]);
  return result.rows[0];
};

export const getStudentAttempts = async (studentId, limit = 50, offset = 0) => {
  const result = await query(
    'SELECT * FROM attempts WHERE student_id = $1 LIMIT $2 OFFSET $3 ORDER BY attempt_date DESC',
    [studentId, limit, offset]
  );
  return result.rows;
};

export const getExamAttempts = async (examId, limit = 50, offset = 0) => {
  const result = await query(
    'SELECT * FROM attempts WHERE exam_id = $1 LIMIT $2 OFFSET $3 ORDER BY attempt_date DESC',
    [examId, limit, offset]
  );
  return result.rows;
};

export const createAttempt = async (studentId, examId, marksObtained, percentage, timeMinutes) => {
  const isPassed = percentage >= 40;
  const result = await query(
    `INSERT INTO attempts (student_id, exam_id, marks_obtained, percentage, is_passed, 
     status, time_taken_minutes) 
     VALUES ($1, $2, $3, $4, $5, 'completed', $6) RETURNING *`,
    [studentId, examId, marksObtained, percentage, isPassed, timeMinutes]
  );
  return result.rows[0];
};

export const updateAttempt = async (id, marksObtained, percentage, status, feedback) => {
  const isPassed = percentage >= 40;
  const result = await query(
    `UPDATE attempts SET marks_obtained = $1, percentage = $2, status = $3, is_passed = $4, feedback = $5, updated_at = NOW() 
     WHERE id = $6 RETURNING *`,
    [marksObtained, percentage, status, isPassed, feedback, id]
  );
  return result.rows[0];
};

export const deleteAttempt = async (id) => {
  const result = await query('DELETE FROM attempts WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

export const getAttemptDetails = async (limitNum = 50, offset = 0) => {
  const result = await query(
    'SELECT * FROM attempt_details_view LIMIT $1 OFFSET $2',
    [limitNum, offset]
  );
  return result.rows;
};

export const getStudentAttemptDetails = async (studentId, limitNum = 50, offset = 0) => {
  const result = await query(
    'SELECT * FROM attempt_details_view WHERE student_id = $1 LIMIT $2 OFFSET $3',
    [studentId, limitNum, offset]
  );
  return result.rows;
};

export const getCourseAttempts = async (courseId) => {
  const result = await query(
    `SELECT a.*, s.name as student_name, s.email as student_email, 
            c.code as course_code, c.name as course_name, e.exam_name
     FROM attempts a
     JOIN exams e ON a.exam_id = e.id
     JOIN courses c ON e.course_id = c.id
     JOIN students s ON a.student_id = s.id
     WHERE c.id = $1
     ORDER BY a.attempt_date DESC`,
    [courseId]
  );
  return result.rows;
};
