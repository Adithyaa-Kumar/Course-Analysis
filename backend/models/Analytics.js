import { query } from '../db/database.js';

export const getStudentPerformanceOverTime = async (studentId) => {
  const result = await query(
    `SELECT 
      a.attempt_date, c.name as course_name, a.percentage, a.is_passed,
      a.attempt_number, a.marks_obtained
     FROM attempts a
     JOIN exams e ON a.exam_id = e.id
     JOIN courses c ON e.course_id = c.id
     WHERE a.student_id = $1
     ORDER BY a.attempt_date ASC`,
    [studentId]
  );
  return result.rows;
};

export const getCourseFailureAnalysis = async () => {
  const result = await query(
    `SELECT 
      c.id, c.code, c.name, c.difficulty_level,
      COUNT(DISTINCT a.student_id) as total_students,
      COUNT(CASE WHEN a.is_passed = false THEN 1 END) as failed_count,
      ROUND(100.0 * COUNT(CASE WHEN a.is_passed = false THEN 1 END) / NULLIF(COUNT(DISTINCT a.student_id), 0), 2) as failure_rate
     FROM courses c
     LEFT JOIN exams e ON c.id = e.course_id
     LEFT JOIN attempts a ON e.id = a.exam_id
     GROUP BY c.id, c.code, c.name, c.difficulty_level
     HAVING COUNT(DISTINCT a.student_id) > 0
     ORDER BY failure_rate DESC`
  );
  return result.rows;
};

export const getStudentImprovement = async () => {
  const result = await query(
    `SELECT 
      s.id, s.name, s.email,
      first_attempt.avg_first AS first_attempt_avg,
      recent_attempt.avg_recent AS recent_attempt_avg,
      ROUND(recent_attempt.avg_recent - first_attempt.avg_first, 2) as improvement,
      COUNT(DISTINCT a.exam_id) as total_exams
     FROM students s
     LEFT JOIN (
       SELECT student_id, AVG(percentage) as avg_first
       FROM attempts
       WHERE attempt_number = 1
       GROUP BY student_id
     ) first_attempt ON s.id = first_attempt.student_id
     LEFT JOIN (
       SELECT student_id, AVG(percentage) as avg_recent
       FROM attempts
       WHERE attempt_number = (SELECT MAX(attempt_number) FROM attempts a2 WHERE a2.student_id = attempts.student_id)
       GROUP BY student_id
     ) recent_attempt ON s.id = recent_attempt.student_id
     LEFT JOIN attempts a ON s.id = a.student_id
     GROUP BY s.id, s.name, s.email, first_attempt.avg_first, recent_attempt.avg_recent
     ORDER BY improvement DESC`
  );
  return result.rows;
};

export const getInstructorRanking = async () => {
  const result = await query(
    `SELECT 
      c.instructor_name,
      COUNT(DISTINCT c.id) as course_count,
      COUNT(DISTINCT a.student_id) as total_students,
      ROUND(AVG(a.marks_obtained), 2) as avg_marks,
      ROUND(100.0 * COUNT(CASE WHEN a.is_passed = true THEN 1 END) / NULLIF(COUNT(a.id), 0), 2) as pass_rate
     FROM courses c
     LEFT JOIN exams e ON c.id = e.course_id
     LEFT JOIN attempts a ON e.id = a.exam_id
     WHERE c.instructor_name IS NOT NULL
     GROUP BY c.instructor_name
     ORDER BY avg_marks DESC`
  );
  return result.rows;
};

export const getConsistentPerformers = async () => {
  const result = await query(
    `SELECT 
      s.id, s.name, s.email,
      COUNT(DISTINCT a.exam_id) as exam_count,
      ROUND(AVG(a.percentage), 2) as avg_percentage,
      ROUND(STDDEV(a.percentage), 2) as std_deviation,
      COUNT(CASE WHEN a.is_passed = true THEN 1 END) as passed_count
     FROM students s
     JOIN attempts a ON s.id = a.student_id
     GROUP BY s.id, s.name, s.email
     HAVING COUNT(DISTINCT a.exam_id) >= 3
     AND STDDEV(a.percentage) < 10
     ORDER BY avg_percentage DESC`
  );
  return result.rows;
};

export const getDifficultyCourseAnalysis = async () => {
  const result = await query(
    `SELECT 
      c.id, c.code, c.name, c.difficulty_level,
      COUNT(DISTINCT e.id) as exam_count,
      COUNT(DISTINCT a.student_id) as student_count,
      ROUND(AVG(a.marks_obtained), 2) as avg_marks,
      ROUND(AVG(a.percentage), 2) as avg_percentage,
      ROUND(100.0 * COUNT(CASE WHEN a.is_passed = true THEN 1 END) / NULLIF(COUNT(a.id), 0), 2) as pass_rate
     FROM courses c
     LEFT JOIN exams e ON c.id = e.course_id
     LEFT JOIN attempts a ON e.id = a.exam_id
     GROUP BY c.id, c.code, c.name, c.difficulty_level
     ORDER BY difficulty_level DESC, avg_marks ASC`
  );
  return result.rows;
};

export const getPrerequisiteImpact = async () => {
  const result = await query(
    `SELECT 
      c1.id as dependent_course_id,
      c1.code as dependent_code,
      c1.name as dependent_name,
      c2.id as prerequisite_id,
      c2.code as prerequisite_code,
      c2.name as prerequisite_name,
      COUNT(DISTINCT e1.id) as dependent_exams,
      AVG(a1.percentage) as dependent_avg,
      COUNT(DISTINCT e2.id) as prereq_exams,
      AVG(a2.percentage) as prereq_avg
     FROM courses c1
     LEFT JOIN prerequisites pre ON c1.id = pre.course_id
     LEFT JOIN courses c2 ON pre.prerequisite_course_id = c2.id
     LEFT JOIN exams e1 ON c1.id = e1.course_id
     LEFT JOIN attempts a1 ON e1.id = a1.exam_id
     LEFT JOIN exams e2 ON c2.id = e2.course_id
     LEFT JOIN attempts a2 ON e2.id = a2.exam_id
     WHERE c2.id IS NOT NULL
     GROUP BY c1.id, c1.code, c1.name, c2.id, c2.code, c2.name
     ORDER BY c1.id, c2.id`
  );
  return result.rows;
};

export const getSystemDashboardStats = async () => {
  const result = await query(
    `SELECT 
      (SELECT COUNT(*) FROM students WHERE status = 'active') as active_students,
      (SELECT COUNT(*) FROM courses WHERE is_active = true) as active_courses,
      (SELECT COUNT(*) FROM attempts) as total_attempts,
      (SELECT COUNT(*) FROM enrollments WHERE status = 'completed') as completed_enrollments,
      (SELECT ROUND(AVG(percentage), 2) FROM attempts) as overall_avg_percentage,
      (SELECT ROUND(100.0 * COUNT(*) FILTER (WHERE is_passed = true) / NULLIF(COUNT(*), 0), 2) FROM attempts) as overall_pass_rate`
  );
  return result.rows[0];
};
