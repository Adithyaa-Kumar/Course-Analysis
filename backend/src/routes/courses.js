import { Hono } from 'hono';

const router = new Hono();

// GET all courses
router.get('/', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = parseInt(c.req.query('offset') || '0');
    
    const db = c.env.DB;
    const { results } = await db.prepare(
      'SELECT * FROM courses WHERE is_active = 1 ORDER BY code LIMIT ? OFFSET ?'
    ).bind(limit, offset).all();
    
    return c.json(results);
  } catch (err) {
    console.error('Error fetching courses:', err);
    return c.json({ error: err.message }, 500);
  }
});

// GET single course
router.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    
    const { results } = await db.prepare(
      'SELECT * FROM courses WHERE id = ?'
    ).bind(id).all();
    
    if (!results.length) {
      return c.json({ error: 'Course not found' }, 404);
    }
    
    return c.json(results[0]);
  } catch (err) {
    console.error('Error fetching course:', err);
    return c.json({ error: err.message }, 500);
  }
});

// GET course statistics with performance data
router.get('/stats', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = parseInt(c.req.query('offset') || '0');
    const db = c.env.DB;
    
    const { results } = await db.prepare(`
      SELECT 
        c.id, c.code, c.name, c.instructor_name,
        COUNT(DISTINCT e.id) as exam_count,
        COUNT(DISTINCT a.id) as total_attempts,
        COUNT(CASE WHEN a.is_passed = 1 THEN 1 END) as passed_attempts,
        ROUND(100.0 * COUNT(CASE WHEN a.is_passed = 1 THEN 1 END) / COUNT(a.id), 2) as pass_rate,
        ROUND(AVG(CAST(a.percentage AS FLOAT)), 2) as avg_score
      FROM courses c
      LEFT JOIN exams e ON c.id = e.course_id
      LEFT JOIN attempts a ON e.id = a.exam_id
      WHERE c.is_active = 1
      GROUP BY c.id, c.code, c.name, c.instructor_name
      ORDER BY c.code
      LIMIT ? OFFSET ?
    `).bind(limit, offset).all();
    
    return c.json(results);
  } catch (err) {
    console.error('Error fetching course stats:', err);
    return c.json({ error: err.message }, 500);
  }
});

// GET dependency analysis
router.get('/dependency/analysis', async (c) => {
  try {
    const db = c.env.DB;
    
    const { results } = await db.prepare(`
      SELECT 
        c.id, c.code, c.name,
        GROUP_CONCAT(p.code, ', ') as prerequisites,
        COUNT(DISTINCT (CASE WHEN a.id IS NOT NULL THEN e.id END)) as exam_count,
        COUNT(DISTINCT a.id) as total_attempts,
        ROUND(AVG(CAST(a.percentage AS FLOAT)), 2) as avg_score
      FROM courses c
      LEFT JOIN prerequisites pr ON c.id = pr.course_id
      LEFT JOIN courses p ON pr.prerequisite_course_id = p.id
      LEFT JOIN exams e ON c.id = e.course_id
      LEFT JOIN attempts a ON e.id = a.exam_id
      GROUP BY c.id, c.code, c.name
      ORDER BY c.code
    `).all();
    
    return c.json(results);
  } catch (err) {
    console.error('Error fetching dependency analysis:', err);
    return c.json({ error: err.message }, 500);
  }
});

// POST create course
router.post('/', async (c) => {
  try {
    const { code, name, instructor_name, credits, difficulty_level } = await c.req.json();
    
    if (!code || !name) {
      return c.json({ error: 'Code and name are required' }, 400);
    }
    
    const db = c.env.DB;
    const { success } = await db.prepare(
      'INSERT INTO courses (code, name, instructor_name, credits, difficulty_level) VALUES (?, ?, ?, ?, ?)'
    ).bind(code, name, instructor_name || null, credits || 3, difficulty_level || 'intermediate').run();
    
    if (!success) {
      return c.json({ error: 'Failed to create course' }, 500);
    }
    
    return c.json({ message: 'Course created successfully' }, 201);
  } catch (err) {
    console.error('Error creating course:', err);
    return c.json({ error: err.message }, 500);
  }
});

// PUT update course
router.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const { code, name, instructor_name, credits, difficulty_level, is_active } = await c.req.json();
    
    const db = c.env.DB;
    const { success } = await db.prepare(
      'UPDATE courses SET code = ?, name = ?, instructor_name = ?, credits = ?, difficulty_level = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(code, name, instructor_name, credits, difficulty_level, is_active ? 1 : 0, id).run();
    
    if (!success) {
      return c.json({ error: 'Failed to update course' }, 500);
    }
    
    return c.json({ message: 'Course updated successfully' });
  } catch (err) {
    console.error('Error updating course:', err);
    return c.json({ error: err.message }, 500);
  }
});

// DELETE course
router.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    
    const { success } = await db.prepare(
      'DELETE FROM courses WHERE id = ?'
    ).bind(id).run();
    
    if (!success) {
      return c.json({ error: 'Failed to delete course' }, 500);
    }
    
    return c.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error('Error deleting course:', err);
    return c.json({ error: err.message }, 500);
  }
});

export default router;
