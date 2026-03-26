import { query } from '../db/database.js';

export const getAllStudents = async (limit = 50, offset = 0) => {
  const result = await query(
    'SELECT * FROM students LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return result.rows;
};

export const getStudentById = async (id) => {
  const result = await query('SELECT * FROM students WHERE id = $1', [id]);
  return result.rows[0];
};

export const getStudentByEmail = async (email) => {
  const result = await query('SELECT * FROM students WHERE email = $1', [email]);
  return result.rows[0];
};

export const createStudent = async (name, email, phone, status = 'active') => {
  const result = await query(
    'INSERT INTO students (name, email, phone, status) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, email, phone, status]
  );
  return result.rows[0];
};

export const updateStudent = async (id, name, email, phone, status) => {
  const result = await query(
    'UPDATE students SET name = $1, email = $2, phone = $3, status = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
    [name, email, phone, status, id]
  );
  return result.rows[0];
};

export const deleteStudent = async (id) => {
  const result = await query('DELETE FROM students WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

export const getStudentStats = async (studentId) => {
  const result = await query(
    `SELECT 
      s.id, s.name, s.email,
      COUNT(DISTINCT a.exam_id) as total_exams,
      COUNT(CASE WHEN a.is_passed = true THEN 1 END) as passed_exams,
      ROUND(AVG(a.percentage), 2) as avg_percentage,
      ROUND(100.0 * COUNT(CASE WHEN a.is_passed = true THEN 1 END) / NULLIF(COUNT(a.id), 0), 2) as pass_rate
     FROM students s
     LEFT JOIN attempts a ON s.id = a.student_id
     WHERE s.id = $1
     GROUP BY s.id, s.name, s.email`,
    [studentId]
  );
  return result.rows[0];
};

export const getHighRiskStudents = async () => {
  const result = await query(`
    SELECT * FROM high_risk_students
    ORDER BY failure_rate DESC
  `);
  return result.rows;
};

export const getTopStudents = async (limit = 10) => {
  const result = await query(`
    SELECT * FROM student_average_scores
    ORDER BY avg_marks DESC
    LIMIT $1
  `, [limit]);
  return result.rows;
};
