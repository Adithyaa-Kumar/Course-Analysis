import { Hono } from 'hono';

const router = new Hono();

// GET dashboard stats
router.get('/dashboard', async (c) => {
  try {
    const db = c.env.DB;
    
    const { results } = await db.prepare(`
      SELECT
        (SELECT COUNT(DISTINCT id) FROM students) as active_students,
        (SELECT COUNT(DISTINCT id) FROM courses WHERE is_active = 1) as active_courses,
        (SELECT COUNT(id) FROM attempts) as total_attempts,
        (SELECT ROUND(100.0 * COUNT(CASE WHEN is_passed = 1 THEN 1 END) / COUNT(id), 2) FROM attempts) as overall_pass_rate,
        (SELECT ROUND(AVG(CAST(percentage AS FLOAT)), 2) FROM attempts) as avg_grade,
        (SELECT COUNT(DISTINCT student_id) FROM enrollments WHERE status = 'completed') as completions
    `).all();
    
    return c.json(results[0] || {});
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    return c.json({ error: err.message }, 500);
  }
});

// GET course failure analysis
router.get('/courses/failure', async (c) => {
  try {
    const db = c.env.DB;
    
    const { results } = await db.prepare(`
      SELECT 
        c.id, c.code, c.name, c.difficulty_level,
        COUNT(DISTINCT e.id) as exam_count,
        COUNT(DISTINCT a.id) as total_attempts,
        COUNT(CASE WHEN a.is_passed = 0 THEN 1 END) as failed_count,
        ROUND(100.0 * COUNT(CASE WHEN a.is_passed = 0 THEN 1 END) / COUNT(a.id), 2) as failure_rate
      FROM courses c
      LEFT JOIN exams e ON c.id = e.course_id
      LEFT JOIN attempts a ON e.id = a.exam_id
      WHERE c.is_active = 1
      GROUP BY c.id, c.code, c.name, c.difficulty_level
      ORDER BY failure_rate DESC
    `).all();
    
    return c.json(results);
  } catch (err) {
    console.error('Error fetching course failure analysis:', err);
    return c.json({ error: err.message }, 500);
  }
});

// GET student improvement
router.get('/students/improvement', async (c) => {
  try {
    const db = c.env.DB;
    
    const { results } = await db.prepare(`
      SELECT 
        s.id, s.name, s.email,
        ROUND(AVG(CASE WHEN a.attempt_date < datetime('now', '-30 days') THEN a.percentage END), 2) as initial_avg,
        ROUND(AVG(CASE WHEN a.attempt_date >= datetime('now', '-30 days') THEN a.percentage END), 2) as recent_avg,
        COUNT(DISTINCT a.id) as total_exams
      FROM students s
      LEFT JOIN attempts a ON s.id = a.student_id
      GROUP BY s.id, s.name, s.email
      HAVING initial_avg IS NOT NULL AND recent_avg IS NOT NULL
      ORDER BY (recent_avg - initial_avg) DESC
    `).all();
    
    return c.json(results || []);
  } catch (err) {
    console.error('Error fetching student improvement:', err);
    return c.json({ error: err.message }, 500);
  }
});

// GET instructor ranking
router.get('/instructors/ranking', async (c) => {
  try {
    const db = c.env.DB;
    
    const { results } = await db.prepare(`
      SELECT 
        c.instructor_name,
        COUNT(DISTINCT c.id) as course_count,
        COUNT(DISTINCT e.id) as exam_count,
        COUNT(DISTINCT a.id) as total_attempts,
        COUNT(CASE WHEN a.is_passed = 1 THEN 1 END) as passed_attempts,
        ROUND(AVG(CAST(a.percentage AS FLOAT)), 2) as avg_marks,
        ROUND(100.0 * COUNT(CASE WHEN a.is_passed = 1 THEN 1 END) / COUNT(a.id), 2) as pass_rate
      FROM courses c
      LEFT JOIN exams e ON c.id = e.course_id
      LEFT JOIN attempts a ON e.id = a.exam_id
      WHERE c.is_active = 1 AND c.instructor_name IS NOT NULL
      GROUP BY c.instructor_name
      ORDER BY pass_rate DESC
    `).all();
    
    return c.json(results);
  } catch (err) {
    console.error('Error fetching instructor ranking:', err);
    return c.json({ error: err.message }, 500);
  }
});

// GET consistent performers
router.get('/students/consistent', async (c) => {
  try {
    const db = c.env.DB;
    
    const { results } = await db.prepare(`
      SELECT 
        s.id, s.name, s.email,
        COUNT(a.id) as exam_count,
        ROUND(AVG(CAST(a.percentage AS FLOAT)), 2) as avg_percentage,
        COUNT(CASE WHEN a.is_passed = 1 THEN 1 END) as passed_count
      FROM students s
      LEFT JOIN attempts a ON s.id = a.student_id
      GROUP BY s.id, s.name, s.email
      HAVING COUNT(a.id) >= 3
      ORDER BY avg_percentage DESC
    `).all();
    
    return c.json(results);
  } catch (err) {
    console.error('Error fetching consistent performers:', err);
    return c.json({ error: err.message }, 500);
  }
});

// GET difficulty course analysis
router.get('/courses/difficulty', async (c) => {
  try {
    const db = c.env.DB;
    
    const { results } = await db.prepare(`
      SELECT 
        c.difficulty_level,
        COUNT(DISTINCT c.id) as course_count,
        COUNT(DISTINCT e.id) as exam_count,
        COUNT(DISTINCT a.id) as total_attempts,
        COUNT(CASE WHEN a.is_passed = 1 THEN 1 END) as passed_attempts,
        ROUND(AVG(CAST(a.percentage AS FLOAT)), 2) as avg_score,
        ROUND(100.0 * COUNT(CASE WHEN a.is_passed = 1 THEN 1 END) / COUNT(a.id), 2) as pass_rate
      FROM courses c
      LEFT JOIN exams e ON c.id = e.course_id
      LEFT JOIN attempts a ON e.id = a.exam_id
      WHERE c.is_active = 1
      GROUP BY c.difficulty_level
      ORDER BY c.difficulty_level
    `).all();
    
    return c.json(results);
  } catch (err) {
    console.error('Error fetching difficulty course analysis:', err);
    return c.json({ error: err.message }, 500);
  }
});

// GET prerequisite impact
router.get('/prerequisites/impact', async (c) => {
  try {
    const db = c.env.DB;
    
    const { results } = await db.prepare(`
      SELECT 
        c.code, c.name, c.id,
        GROUP_CONCAT(p.code, ', ') as prerequisites,
        COUNT(DISTINCT e.id) as exam_count,
        ROUND(AVG(CAST(a.percentage AS FLOAT)), 2) as avg_score
      FROM courses c
      LEFT JOIN prerequisites pr ON c.id = pr.course_id
      LEFT JOIN courses p ON pr.prerequisite_course_id = p.id
      LEFT JOIN exams e ON c.id = e.course_id
      LEFT JOIN attempts a ON e.id = a.exam_id
      WHERE c.is_active = 1
      GROUP BY c.id, c.code, c.name
      ORDER BY c.code
    `).all();
    
    return c.json(results);
  } catch (err) {
    console.error('Error fetching prerequisite impact:', err);
    return c.json({ error: err.message }, 500);
  }
});

// GET student performance over time
router.get('/student/:studentId/performance', async (c) => {
  try {
    const studentId = c.req.param('studentId');
    const db = c.env.DB;
    
    const { results } = await db.prepare(`
      SELECT 
        a.id, a.attempt_date, a.percentage, a.is_passed,
        e.exam_name, c.code, c.name
      FROM attempts a
      JOIN exams e ON a.exam_id = e.id
      JOIN courses c ON e.course_id = c.id
      WHERE a.student_id = ?
      ORDER BY a.attempt_date
    `).bind(studentId).all();
    
    return c.json(results);
  } catch (err) {
    console.error('Error fetching student performance:', err);
    return c.json({ error: err.message }, 500);
  }
});

export default router;
