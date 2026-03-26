import { Hono } from 'hono';

const router = new Hono();

// GET all students - paginated
router.get('/', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '10');
    const offset = parseInt(c.req.query('offset') || '0');
    
    const db = c.env.DB;
    const { results } = await db.prepare(
      'SELECT * FROM students ORDER BY id LIMIT ? OFFSET ?'
    ).bind(limit, offset).all();
    
    return c.json(results);
  } catch (err) {
    console.error('Error fetching students:', err);
    return c.json({ error: err.message }, 500);
  }
});

// GET single student
router.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    
    const { results } = await db.prepare(
      'SELECT * FROM students WHERE id = ?'
    ).bind(id).all();
    
    if (!results.length) {
      return c.json({ error: 'Student not found' }, 404);
    }
    
    return c.json(results[0]);
  } catch (err) {
    console.error('Error fetching student:', err);
    return c.json({ error: err.message }, 500);
  }
});

// GET top performers
router.get('/top', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '10');
    const db = c.env.DB;
    
    const { results } = await db.prepare(`
      SELECT 
        s.id, s.name, s.email,
        ROUND(AVG(CAST(a.percentage AS FLOAT)), 2) as avg_marks,
        COUNT(CASE WHEN a.is_passed = 1 THEN 1 END) as passed_exams,
        COUNT(a.id) as total_attempts,
        ROUND(100.0 * COUNT(CASE WHEN a.is_passed = 1 THEN 1 END) / COUNT(a.id), 2) as pass_rate
      FROM students s
      LEFT JOIN attempts a ON s.id = a.student_id
      GROUP BY s.id, s.name, s.email
      ORDER BY avg_marks DESC
      LIMIT ?
    `).bind(limit).all();
    
    return c.json(results);
  } catch (err) {
    console.error('Error fetching top students:', err);
    return c.json({ error: err.message }, 500);
  }
});

// GET at-risk students
router.get('/risk', async (c) => {
  try {
    const db = c.env.DB;
    
    const { results } = await db.prepare(`
      SELECT 
        s.id, s.name, s.email,
        COUNT(a.id) as total_attempts,
        COUNT(CASE WHEN a.is_passed = 0 THEN 1 END) as failed_attempts,
        ROUND(100.0 * COUNT(CASE WHEN a.is_passed = 0 THEN 1 END) / COUNT(a.id), 2) as failure_rate,
        ROUND(AVG(CAST(a.percentage AS FLOAT)), 2) as avg_score
      FROM students s
      LEFT JOIN attempts a ON s.id = a.student_id
      WHERE a.id IS NOT NULL
      GROUP BY s.id, s.name, s.email
      HAVING failure_rate > 30
      ORDER BY failure_rate DESC
    `).all();
    
    return c.json(results);
  } catch (err) {
    console.error('Error fetching at-risk students:', err);
    return c.json({error: err.message }, 500);
  }
});

// POST create student
router.post('/', async (c) => {
  try {
    const { name, email, phone, status } = await c.req.json();
    
    if (!name || !email) {
      return c.json({ error: 'Name and email are required' }, 400);
    }
    
    const db = c.env.DB;
    const { success } = await db.prepare(
      'INSERT INTO students (name, email, phone, status) VALUES (?, ?, ?, ?)'
    ).bind(name, email, phone || null, status || 'active').run();
    
    if (!success) {
      return c.json({ error: 'Failed to create student' }, 500);
    }
    
    return c.json({ message: 'Student created successfully' }, 201);
  } catch (err) {
    console.error('Error creating student:', err);
    return c.json({ error: err.message }, 500);
  }
});

// PUT update student
router.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const { name, email, phone, status } = await c.req.json();
    
    const db = c.env.DB;
    const { success } = await db.prepare(
      'UPDATE students SET name = ?, email = ?, phone = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(name, email, phone, status, id).run();
    
    if (!success) {
      return c.json({ error: 'Failed to update student' }, 500);
    }
    
    return c.json({ message: 'Student updated successfully' });
  } catch (err) {
    console.error('Error updating student:', err);
    return c.json({ error: err.message }, 500);
  }
});

// DELETE student
router.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    
    const { success } = await db.prepare(
      'DELETE FROM students WHERE id = ?'
    ).bind(id).run();
    
    if (!success) {
      return c.json({ error: 'Failed to delete student' }, 500);
    }
    
    return c.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Error deleting student:', err);
    return c.json({ error: err.message }, 500);
  }
});

export default router;
