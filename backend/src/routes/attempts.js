import { Hono } from 'hono';

const router = new Hono();

// GET all attempts
router.get('/', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = parseInt(c.req.query('offset') || '0');
    
    const db = c.env.DB;
    const { results } = await db.prepare(
      'SELECT * FROM attempts ORDER BY attempt_date DESC LIMIT ? OFFSET ?'
    ).bind(limit, offset).all();
    
    return c.json(results);
  } catch (err) {
    console.error('Error fetching attempts:', err);
    return c.json({ error: err.message }, 500);
  }
});

// GET single attempt
router.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    
    const { results } = await db.prepare(
      'SELECT * FROM attempts WHERE id = ?'
    ).bind(id).all();
    
    if (!results.length) {
      return c.json({ error: 'Attempt not found' }, 404);
    }
    
    return c.json(results[0]);
  } catch (err) {
    console.error('Error fetching attempt:', err);
    return c.json({ error: err.message }, 500);
  }
});

// GET detailed attempts (with student, exam, course info)
router.get('/details', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = parseInt(c.req.query('offset') || '0');
    
    const db = c.env.DB;
    const { results } = await db.prepare(`
      SELECT 
        a.id, a.attempt_number, a.marks_obtained, a.percentage, a.status, a.attempt_date,
        s.id as student_id, s.name as student_name, s.email as student_email,
        e.id as exam_id, e.exam_name,
        c.id as course_id, c.code, c.name as course_name
      FROM attempts a
      JOIN students s ON a.student_id = s.id
      JOIN exams e ON a.exam_id = e.id
      JOIN courses c ON e.course_id = c.id
      ORDER BY a.attempt_date DESC
      LIMIT ? OFFSET ?
    `).bind(limit, offset).all();
    
    return c.json(results);
  } catch (err) {
    console.error('Error fetching attempt details:', err);
    return c.json({ error: err.message }, 500);
  }
});

// GET attempts by student
router.get('/student/:studentId', async (c) => {
  try {
    const studentId = c.req.param('studentId');
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');
    
    const db = c.env.DB;
    const { results } = await db.prepare(
      'SELECT * FROM attempts WHERE student_id = ? ORDER BY attempt_date DESC LIMIT ? OFFSET ?'
    ).bind(studentId, limit, offset).all();
    
    return c.json(results);
  } catch (err) {
    console.error('Error fetching student attempts:', err);
    return c.json({ error: err.message }, 500);
  }
});

// GET student attempt details with joined data
router.get('/student/:studentId/details', async (c) => {
  try {
    const studentId = c.req.param('studentId');
    
    const db = c.env.DB;
    const { results } = await db.prepare(`
      SELECT 
        a.id, a.attempt_number, a.marks_obtained, a.percentage, a.status, a.attempt_date,
        s.name as student_name, s.email,
        e.exam_name, e.total_marks, e.passing_marks,
        c.code, c.name as course_name, c.difficulty_level
      FROM attempts a
      JOIN students s ON a.student_id = s.id
      JOIN exams e ON a.exam_id = e.id
      JOIN courses c ON e.course_id = c.id
      WHERE a.student_id = ?
      ORDER BY a.attempt_date DESC
    `).bind(studentId).all();
    
    return c.json(results);
  } catch (err) {
    console.error('Error fetching student attempt details:', err);
    return c.json({ error: err.message }, 500);
  }
});

// GET attempts by exam
router.get('/exam/:examId', async (c) => {
  try {
    const examId = c.req.param('examId');
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');
    
    const db = c.env.DB;
    const { results } = await db.prepare(
      'SELECT * FROM attempts WHERE exam_id = ? ORDER BY attempt_date DESC LIMIT ? OFFSET ?'
    ).bind(examId, limit, offset).all();
    
    return c.json(results);
  } catch (err) {
    console.error('Error fetching exam attempts:', err);
    return c.json({ error: err.message }, 500);
  }
});

// GET attempts by course
router.get('/course/:courseId', async (c) => {
  try {
    const courseId = c.req.param('courseId');
    
    const db = c.env.DB;
    const { results } = await db.prepare(`
      SELECT 
        a.id, a.marks_obtained, a.percentage, a.status, a.attempt_date,
        s.id as student_id, s.name as student_name,
        e.id as exam_id, e.exam_name, e.exam_type
      FROM attempts a
      JOIN students s ON a.student_id = s.id
      JOIN exams e ON a.exam_id = e.id
      WHERE e.course_id = ?
      ORDER BY a.attempt_date DESC
    `).bind(courseId).all();
    
    return c.json(results);
  } catch (err) {
    console.error('Error fetching course attempts:', err);
    return c.json({ error: err.message }, 500);
  }
});

// POST create attempt
router.post('/', async (c) => {
  try {
    const { student_id, exam_id, marks_obtained, percentage, status } = await c.req.json();
    
    if (!student_id || !exam_id) {
      return c.json({ error: 'Student ID and Exam ID are required' }, 400);
    }
    
    const is_passed = percentage >= 40 ? 1 : 0;
    
    const db = c.env.DB;
    const { success } = await db.prepare(
      'INSERT INTO attempts (student_id, exam_id, marks_obtained, percentage, status, is_passed) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(student_id, exam_id, marks_obtained || null, percentage || null, status || 'completed', is_passed).run();
    
    if (!success) {
      return c.json({ error: 'Failed to create attempt' }, 500);
    }
    
    return c.json({ message: 'Attempt created successfully' }, 201);
  } catch (err) {
    console.error('Error creating attempt:', err);
    return c.json({ error: err.message }, 500);
  }
});

// PUT update attempt
router.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const { marks_obtained, percentage, status, feedback } = await c.req.json();
    
    const is_passed = percentage >= 40 ? 1 : 0;
    
    const db = c.env.DB;
    const { success } = await db.prepare(
      'UPDATE attempts SET marks_obtained = ?, percentage = ?, status = ?, feedback = ?, is_passed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(marks_obtained, percentage, status, feedback, is_passed, id).run();
    
    if (!success) {
      return c.json({ error: 'Failed to update attempt' }, 500);
    }
    
    return c.json({ message: 'Attempt updated successfully' });
  } catch (err) {
    console.error('Error updating attempt:', err);
    return c.json({ error: err.message }, 500);
  }
});

// DELETE attempt
router.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    
    const { success } = await db.prepare(
      'DELETE FROM attempts WHERE id = ?'
    ).bind(id).run();
    
    if (!success) {
      return c.json({ error: 'Failed to delete attempt' }, 500);
    }
    
    return c.json({ message: 'Attempt deleted successfully' });
  } catch (err) {
    console.error('Error deleting attempt:', err);
    return c.json({ error: err.message }, 500);
  }
});

export default router;
