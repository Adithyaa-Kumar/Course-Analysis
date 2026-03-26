-- ============================================================================
-- Course Attempt Analysis System - PostgreSQL Schema
-- ============================================================================

-- Users/Students Table
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_name VARCHAR(255),
    credits INT DEFAULT 3,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    prerequisites TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Course Prerequisites Table
CREATE TABLE IF NOT EXISTS prerequisites (
    id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    prerequisite_course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, prerequisite_course_id)
);

-- Exams Table
CREATE TABLE IF NOT EXISTS exams (
    id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    exam_name VARCHAR(255) NOT NULL,
    exam_date TIMESTAMP NOT NULL,
    total_marks INT DEFAULT 100,
    passing_marks INT DEFAULT 40,
    duration_minutes INT DEFAULT 60,
    exam_type VARCHAR(50) CHECK (exam_type IN ('midterm', 'final', 'practice', 'assignment')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Exam Attempts Table
CREATE TABLE IF NOT EXISTS attempts (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    exam_id INT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    attempt_number INT DEFAULT 1,
    marks_obtained INT,
    percentage DECIMAL(5, 2),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    attempt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submission_time TIMESTAMP,
    time_taken_minutes INT,
    is_passed BOOLEAN,
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scores Table (for tracking different score types)
CREATE TABLE IF NOT EXISTS scores (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    score_type VARCHAR(50) CHECK (score_type IN ('midterm', 'final', 'project', 'participation', 'average')),
    score DECIMAL(5, 2) NOT NULL,
    max_score INT DEFAULT 100,
    weight INT DEFAULT 1,
    recorded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Course Enrollment History
CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completion_date TIMESTAMP,
    grade VARCHAR(2),
    grade_points DECIMAL(3, 2),
    status VARCHAR(50) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'dropped', 'transferred')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id)
);

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================

CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_courses_code ON courses(code);
CREATE INDEX idx_courses_instructor ON courses(instructor_name);
CREATE INDEX idx_exams_course ON exams(course_id);
CREATE INDEX idx_exams_date ON exams(exam_date);
CREATE INDEX idx_attempts_student ON attempts(student_id);
CREATE INDEX idx_attempts_exam ON attempts(exam_id);
CREATE INDEX idx_attempts_date ON attempts(attempt_date);
CREATE INDEX idx_attempts_status ON attempts(status);
CREATE INDEX idx_scores_student ON scores(student_id);
CREATE INDEX idx_scores_course ON scores(course_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_prerequisites_course ON prerequisites(course_id);
CREATE INDEX idx_prerequisites_prereq ON prerequisites(prerequisite_course_id);

-- ============================================================================
-- VIEWS for Analysis
-- ============================================================================

-- Student Average Scores View
CREATE OR REPLACE VIEW student_average_scores AS
SELECT 
    s.id,
    s.name,
    s.email,
    AVG(a.marks_obtained) as avg_marks,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY a.marks_obtained) as median_marks,
    COUNT(a.id) as total_attempts,
    COUNT(CASE WHEN a.is_passed = true THEN 1 END) as passed_attempts,
    ROUND(100.0 * COUNT(CASE WHEN a.is_passed = true THEN 1 END) / NULLIF(COUNT(a.id), 0), 2) as pass_rate
FROM students s
LEFT JOIN attempts a ON s.id = a.student_id
GROUP BY s.id, s.name, s.email;

-- Course Performance Summary View
CREATE OR REPLACE VIEW course_performance_summary AS
SELECT 
    c.id,
    c.code,
    c.name,
    c.instructor_name,
    COUNT(DISTINCT a.student_id) as total_students,
    AVG(a.marks_obtained) as avg_course_score,
    MIN(a.marks_obtained) as min_score,
    MAX(a.marks_obtained) as max_score,
    COUNT(CASE WHEN a.is_passed = true THEN 1 END) as passed_count,
    ROUND(100.0 * COUNT(CASE WHEN a.is_passed = true THEN 1 END) / NULLIF(COUNT(DISTINCT a.student_id), 0), 2) as pass_rate
FROM courses c
LEFT JOIN exams e ON c.id = e.course_id
LEFT JOIN attempts a ON e.id = a.exam_id
GROUP BY c.id, c.code, c.name, c.instructor_name;

-- Attempt Details View
CREATE OR REPLACE VIEW attempt_details_view AS
SELECT 
    a.id as attempt_id,
    s.id as student_id,
    s.name as student_name,
    s.email as student_email,
    c.id as course_id,
    c.code as course_code,
    c.name as course_name,
    e.id as exam_id,
    e.exam_name,
    e.exam_type,
    a.attempt_number,
    a.marks_obtained,
    a.percentage,
    a.status,
    a.is_passed,
    a.attempt_date,
    a.time_taken_minutes,
    c.instructor_name,
    c.difficulty_level
FROM attempts a
JOIN students s ON a.student_id = s.id
JOIN exams e ON a.exam_id = e.id
JOIN courses c ON e.course_id = c.id
ORDER BY a.attempt_date DESC;

-- High Risk Students View
CREATE OR REPLACE VIEW high_risk_students AS
SELECT 
    s.id,
    s.name,
    s.email,
    COUNT(DISTINCT a.exam_id) as total_exams,
    COUNT(CASE WHEN a.is_passed = false THEN 1 END) as failed_exams,
    ROUND(100.0 * COUNT(CASE WHEN a.is_passed = false THEN 1 END) / NULLIF(COUNT(a.id), 0), 2) as failure_rate,
    AVG(a.marks_obtained) as avg_score,
    MIN(a.attempt_date) as first_attempt_date,
    MAX(a.attempt_date) as last_attempt_date
FROM students s
LEFT JOIN attempts a ON s.id = a.student_id
GROUP BY s.id, s.name, s.email
HAVING COUNT(CASE WHEN a.is_passed = false THEN 1 END) > 0
AND ROUND(100.0 * COUNT(CASE WHEN a.is_passed = false THEN 1 END) / NULLIF(COUNT(a.id), 0), 2) > 30;

-- Dependency Analysis View
CREATE OR REPLACE VIEW dependency_analysis AS
SELECT 
    c1.id as course_id,
    c1.code as course_code,
    c1.name as course_name,
    c2.id as prerequisite_id,
    c2.code as prerequisite_code,
    c2.name as prerequisite_name,
    pre.is_required,
    COUNT(DISTINCT e1.id) as exam_count_dependent,
    COUNT(DISTINCT e2.id) as exam_count_prerequisite
FROM courses c1
LEFT JOIN prerequisites pre ON c1.id = pre.course_id
LEFT JOIN courses c2 ON pre.prerequisite_course_id = c2.id
LEFT JOIN exams e1 ON c1.id = e1.course_id
LEFT JOIN exams e2 ON c2.id = e2.course_id
GROUP BY c1.id, c1.code, c1.name, c2.id, c2.code, c2.name, pre.is_required;

-- ============================================================================
-- End of Schema
-- ============================================================================
