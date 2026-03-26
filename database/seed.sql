-- ============================================================================
-- Course Attempt Analysis System - Seed Data
-- ============================================================================

-- Insert Students
INSERT INTO students (name, email, phone, status) VALUES
('Alice Johnson', 'alice.johnson@university.edu', '+1-555-0101', 'active'),
('Bob Smith', 'bob.smith@university.edu', '+1-555-0102', 'active'),
('Carol Williams', 'carol.williams@university.edu', '+1-555-0103', 'active'),
('David Brown', 'david.brown@university.edu', '+1-555-0104', 'active'),
('Emma Davis', 'emma.davis@university.edu', '+1-555-0105', 'active'),
('Frank Miller', 'frank.miller@university.edu', '+1-555-0106', 'active'),
('Grace Lee', 'grace.lee@university.edu', '+1-555-0107', 'active'),
('Henry Wilson', 'henry.wilson@university.edu', '+1-555-0108', 'active'),
('Iris Martinez', 'iris.martinez@university.edu', '+1-555-0109', 'active'),
('Jack Anderson', 'jack.anderson@university.edu', '+1-555-0110', 'active'),
('Karen Thomas', 'karen.thomas@university.edu', '+1-555-0111', 'active'),
('Leo Jackson', 'leo.jackson@university.edu', '+1-555-0112', 'active');

-- Insert Courses
INSERT INTO courses (code, name, description, instructor_name, credits, difficulty_level) VALUES
('CS101', 'Introduction to Programming', 'Fundamentals of programming using Python', 'Dr. Sarah Chen', 3, 'beginner'),
('CS102', 'Data Structures', 'Arrays, linked lists, trees, and graphs', 'Prof. Michael Roberts', 3, 'intermediate'),
('CS201', 'Database Design', 'Relational databases and SQL', 'Dr. James Wilson', 4, 'intermediate'),
('CS202', 'Web Development', 'Full-stack web development with JavaScript', 'Prof. Emily Rodriguez', 3, 'intermediate'),
('CS301', 'Advanced Algorithms', 'Algorithm design and complexity analysis', 'Dr. Robert Taylor', 4, 'advanced'),
('CS302', 'Machine Learning Basics', 'Introduction to ML and Python-based implementation', 'Prof. Lisa Kumar', 3, 'advanced');

-- Insert Prerequisites
INSERT INTO prerequisites (course_id, prerequisite_course_id, is_required) VALUES
(2, 1, true),   -- CS102 requires CS101
(3, 1, true),   -- CS201 requires CS101
(4, 1, false),  -- CS202 recommends CS101
(5, 2, true),   -- CS301 requires CS102
(5, 3, false),  -- CS301 recommends CS201
(6, 1, true);   -- CS302 requires CS101

-- Insert Exams
INSERT INTO exams (course_id, exam_name, exam_date, total_marks, passing_marks, duration_minutes, exam_type) VALUES
-- CS101 Exams
(1, 'CS101 Midterm', NOW() - INTERVAL '30 days', 50, 25, 90, 'midterm'),
(1, 'CS101 Final Exam', NOW() - INTERVAL '10 days', 100, 50, 120, 'final'),
(1, 'CS101 Programming Assignment 1', NOW() - INTERVAL '25 days', 50, 25, 180, 'assignment'),

-- CS102 Exams
(2, 'CS102 Midterm', NOW() - INTERVAL '28 days', 50, 25, 90, 'midterm'),
(2, 'CS102 Final Exam', NOW() - INTERVAL '8 days', 100, 50, 120, 'final'),
(2, 'CS102 Project', NOW() - INTERVAL '5 days', 50, 25, 240, 'assignment'),

-- CS201 Exams
(3, 'CS201 Midterm', NOW() - INTERVAL '26 days', 50, 25, 90, 'midterm'),
(3, 'CS201 Final Exam', NOW() - INTERVAL '6 days', 100, 50, 120, 'final'),

-- CS202 Exams
(4, 'CS202 Midterm', NOW() - INTERVAL '24 days', 50, 25, 90, 'midterm'),
(4, 'CS202 Final Exam', NOW() - INTERVAL '4 days', 100, 50, 120, 'final'),
(4, 'CS202 Website Project', NOW() - INTERVAL '2 days', 100, 50, 300, 'assignment'),

-- CS301 Exams
(5, 'CS301 Midterm', NOW() - INTERVAL '22 days', 50, 25, 90, 'midterm'),
(5, 'CS301 Final Exam', NOW() - INTERVAL '2 days', 100, 50, 120, 'final'),

-- CS302 Exams
(6, 'CS302 Midterm', NOW() - INTERVAL '20 days', 50, 25, 90, 'midterm'),
(6, 'CS302 Final Exam', NOW() - INTERVAL '1 day', 100, 50, 120, 'final');

-- Insert Enrollments
INSERT INTO enrollments (student_id, course_id, status, grade) VALUES
(1, 1, 'completed', 'A'),
(1, 2, 'completed', 'B'),
(1, 3, 'enrolled', NULL),
(2, 1, 'completed', 'B'),
(2, 2, 'enrolled', NULL),
(3, 1, 'completed', 'A'),
(3, 4, 'enrolled', NULL),
(4, 1, 'completed', 'C'),
(4, 2, 'completed', 'C'),
(5, 1, 'completed', 'A'),
(5, 3, 'enrolled', NULL),
(6, 2, 'enrolled', NULL),
(7, 1, 'completed', 'B'),
(7, 4, 'enrolled', NULL),
(8, 2, 'completed', 'A'),
(8, 5, 'enrolled', NULL),
(9, 1, 'completed', 'B'),
(9, 3, 'enrolled', NULL),
(10, 4, 'enrolled', NULL),
(11, 1, 'completed', 'D'),
(11, 6, 'enrolled', NULL),
(12, 2, 'completed', 'C'),
(12, 5, 'enrolled', NULL);

-- Insert Exam Attempts
INSERT INTO attempts (student_id, exam_id, attempt_number, marks_obtained, percentage, status, is_passed, submission_time, time_taken_minutes) VALUES
-- Alice's attempts (CS101)
(1, 1, 1, 45, 90.0, 'completed', true, NOW() - INTERVAL '29 days', 85),
(1, 2, 1, 92, 92.0, 'completed', true, NOW() - INTERVAL '9 days', 110),
(1, 3, 1, 48, 96.0, 'completed', true, NOW() - INTERVAL '24 days', 170),

-- Alice's attempts (CS102)
(1, 4, 1, 42, 84.0, 'completed', true, NOW() - INTERVAL '27 days', 88),
(1, 5, 1, 85, 85.0, 'completed', true, NOW() - INTERVAL '7 days', 115),

-- Bob's attempts (CS101)
(2, 1, 1, 38, 76.0, 'completed', true, NOW() - INTERVAL '29 days', 87),
(2, 2, 1, 72, 72.0, 'completed', true, NOW() - INTERVAL '9 days', 118),
(2, 3, 1, 35, 70.0, 'completed', true, NOW() - INTERVAL '24 days', 165),

-- Bob's attempts (CS102)
(2, 4, 1, 30, 60.0, 'completed', true, NOW() - INTERVAL '27 days', 90),
(2, 5, 1, 65, 65.0, 'completed', true, NOW() - INTERVAL '7 days', 120),

-- Carol's attempts (CS101)
(3, 1, 1, 48, 96.0, 'completed', true, NOW() - INTERVAL '29 days', 80),
(3, 2, 1, 96, 96.0, 'completed', true, NOW() - INTERVAL '9 days', 105),
(3, 3, 1, 50, 100.0, 'completed', true, NOW() - INTERVAL '24 days', 160),

-- David's attempts (CS101)
(4, 1, 1, 25, 50.0, 'completed', true, NOW() - INTERVAL '29 days', 89),
(4, 1, 2, 33, 66.0, 'completed', true, NOW() - INTERVAL '20 days', 85),
(4, 2, 1, 52, 52.0, 'completed', true, NOW() - INTERVAL '9 days', 119),

-- David's attempts (CS102)
(4, 4, 1, 28, 56.0, 'completed', true, NOW() - INTERVAL '27 days', 92),

-- Emma's attempts (CS101)
(5, 1, 1, 44, 88.0, 'completed', true, NOW() - INTERVAL '29 days', 82),
(5, 2, 1, 88, 88.0, 'completed', true, NOW() - INTERVAL '9 days', 108),
(5, 3, 1, 46, 92.0, 'completed', true, NOW() - INTERVAL '24 days', 168),

-- Frank's attempts (CS102)
(6, 4, 1, 20, 40.0, 'completed', true, NOW() - INTERVAL '27 days', 95),
(6, 5, 1, 55, 55.0, 'completed', true, NOW() - INTERVAL '7 days', 122),

-- Grace's attempts (CS101)
(7, 1, 1, 40, 80.0, 'completed', true, NOW() - INTERVAL '29 days', 86),
(7, 2, 1, 78, 78.0, 'completed', true, NOW() - INTERVAL '9 days', 112),
(7, 3, 1, 40, 80.0, 'completed', true, NOW() - INTERVAL '24 days', 172),

-- Henry's attempts (CS102)
(8, 4, 1, 45, 90.0, 'completed', true, NOW() - INTERVAL '27 days', 87),
(8, 5, 1, 92, 92.0, 'completed', true, NOW() - INTERVAL '7 days', 110),
(8, 6, 1, 45, 90.0, 'completed', true, NOW() - INTERVAL '4 days', 235),

-- Iris's attempts (CS101)
(9, 1, 1, 42, 84.0, 'completed', true, NOW() - INTERVAL '29 days', 84),
(9, 2, 1, 82, 82.0, 'completed', true, NOW() - INTERVAL '9 days', 114),
(9, 3, 1, 42, 84.0, 'completed', true, NOW() - INTERVAL '24 days', 170),

-- Jack's attempts (CS202)
(10, 9, 1, 35, 70.0, 'completed', true, NOW() - INTERVAL '23 days', 88),

-- Karen's attempts (CS101)
(11, 1, 1, 15, 30.0, 'completed', false, NOW() - INTERVAL '29 days', 89),
(11, 1, 2, 22, 44.0, 'completed', true, NOW() - INTERVAL '20 days', 87),
(11, 2, 1, 38, 38.0, 'completed', false, NOW() - INTERVAL '9 days', 120),

-- Leo's attempts (CS102)
(12, 4, 1, 32, 64.0, 'completed', true, NOW() - INTERVAL '27 days', 89),
(12, 5, 1, 62, 62.0, 'completed', true, NOW() - INTERVAL '7 days', 119);

-- Insert Scores
INSERT INTO scores (student_id, course_id, score_type, score, max_score, weight) VALUES
(1, 1, 'midterm', 45, 50, 1),
(1, 1, 'final', 92, 100, 2),
(1, 1, 'project', 48, 50, 1),
(2, 1, 'midterm', 38, 50, 1),
(2, 1, 'final', 72, 100, 2),
(3, 1, 'midterm', 48, 50, 1),
(3, 1, 'final', 96, 100, 2),
(4, 1, 'midterm', 33, 50, 1),
(4, 1, 'final', 52, 100, 2),
(5, 1, 'midterm', 44, 50, 1),
(5, 1, 'final', 88, 100, 2),
(6, 2, 'midterm', 20, 50, 1),
(6, 2, 'final', 55, 100, 2),
(7, 1, 'midterm', 40, 50, 1),
(7, 1, 'final', 78, 100, 2),
(8, 2, 'midterm', 45, 50, 1),
(8, 2, 'final', 92, 100, 2),
(9, 1, 'midterm', 42, 50, 1),
(9, 1, 'final', 82, 100, 2),
(11, 1, 'midterm', 22, 50, 1),
(11, 1, 'final', 38, 100, 2),
(12, 2, 'midterm', 32, 50, 1),
(12, 2, 'final', 62, 100, 2);

-- ============================================================================
-- End of Seed Data
-- ============================================================================
