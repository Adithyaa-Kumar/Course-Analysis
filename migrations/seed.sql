-- Seed data for Course Analytics System - SQLite D1

-- ============================================
-- INSERT STUDENTS (12 students)
-- ============================================
INSERT INTO students (name, email, phone, enrollment_date, status) VALUES
('Alice Johnson', 'alice@example.com', '555-0001', datetime('now', '-180 days'), 'active'),
('Bob Smith', 'bob@example.com', '555-0002', datetime('now', '-170 days'), 'active'),
('Carol White', 'carol@example.com', '555-0003', datetime('now', '-160 days'), 'active'),
('David Brown', 'david@example.com', '555-0004', datetime('now', '-150 days'), 'active'),
('Emma Davis', 'emma@example.com', '555-0005', datetime('now', '-140 days'), 'active'),
('Frank Miller', 'frank@example.com', '555-0006', datetime('now', '-130 days'), 'active'),
('Grace Lee', 'grace@example.com', '555-0007', datetime('now', '-120 days'), 'active'),
('Henry Wilson', 'henry@example.com', '555-0008', datetime('now', '-110 days'), 'active'),
('Iris Taylor', 'iris@example.com', '555-0009', datetime('now', '-100 days'), 'active'),
('Jack Anderson', 'jack@example.com', '555-0010', datetime('now', '-90 days'), 'active'),
('Karen Thomas', 'karen@example.com', '555-0011', datetime('now', '-80 days'), 'active'),
('Leo Martinez', 'leo@example.com', '555-0012', datetime('now', '-70 days'), 'active');

-- ============================================
-- INSERT COURSES (6 courses)
-- ============================================
INSERT INTO courses (code, name, description, instructor_name, credits, difficulty_level, is_active) VALUES
('CS101', 'Introduction to Programming', 'Learn programming fundamentals', 'Dr. Smith', 3, 'beginner', 1),
('CS102', 'Data Structures', 'Fundamental data structures and algorithms', 'Dr. Johnson', 4, 'intermediate', 1),
('CS201', 'Web Development', 'Build web applications with modern frameworks', 'Dr. Lee', 3, 'intermediate', 1),
('CS202', 'Database Design', 'Design and manage relational databases', 'Dr. Brown', 3, 'intermediate', 1),
('CS301', 'Advanced Algorithms', 'Complex algorithms and optimization', 'Dr. Williams', 4, 'advanced', 1),
('CS302', 'Machine Learning Basics', 'Introduction to machine learning concepts', 'Dr. Davis', 3, 'advanced', 1);

-- ============================================
-- INSERT PREREQUISITES (6 relationships)
-- ============================================
INSERT INTO prerequisites (course_id, prerequisite_course_id, is_required) VALUES
(2, 1, 1),  -- CS102 requires CS101
(3, 1, 1),  -- CS201 requires CS101
(4, 2, 1),  -- CS202 requires CS102
(5, 2, 1),  -- CS301 requires CS102
(6, 5, 1);  -- CS302 requires CS301

-- ============================================
-- INSERT EXAMS (15 exams)
-- ============================================
INSERT INTO exams (course_id, exam_name, exam_date, total_marks, passing_marks, duration_minutes, exam_type) VALUES
-- CS101 Exams
(1, 'CS101 Midterm', datetime('now', '-60 days'), 100, 40, 90, 'midterm'),
(1, 'CS101 Final', datetime('now', '-30 days'), 100, 40, 120, 'final'),
(1, 'CS101 Quiz 1', datetime('now', '-50 days'), 50, 25, 30, 'practice'),
-- CS102 Exams
(2, 'CS102 Midterm', datetime('now', '-55 days'), 100, 40, 90, 'midterm'),
(2, 'CS102 Final', datetime('now', '-22 days'), 100, 40, 120, 'final'),
(2, 'CS102 Assignment', datetime('now', '-40 days'), 50, 20, 180, 'assignment'),
-- CS201 Exams
(3, 'CS201 Midterm', datetime('now', '-48 days'), 100, 40, 90, 'midterm'),
(3, 'CS201 Final', datetime('now', '-15 days'), 100, 40, 120, 'final'),
-- CS202 Exams
(4, 'CS202 Midterm', datetime('now', '-45 days'), 100, 40, 90, 'midterm'),
(4, 'CS202 Final', datetime('now', '-10 days'), 100, 40, 120, 'final'),
-- CS301 Exams
(5, 'CS301 Midterm', datetime('now', '-35 days'), 100, 40, 90, 'midterm'),
(5, 'CS301 Final', datetime('now', '-5 days'), 100, 40, 120, 'final'),
-- CS302 Exams
(6, 'CS302 Midterm', datetime('now', '-25 days'), 100, 40, 90, 'midterm'),
(6, 'CS302 Final', datetime('now', '1 days'), 100, 40, 120, 'final'),
(6, 'CS302 Project', datetime('now', '-3 days'), 100, 40, 240, 'assignment');

-- ============================================
-- INSERT ENROLLMENTS (23 enrollments)
-- ============================================
INSERT INTO enrollments (student_id, course_id, enrollment_date, completion_date, grade, grade_points, status) VALUES
-- CS101 (all 12 students)
(1, 1, datetime('now', '-180 days'), datetime('now', '-30 days'), 'A', 4.0, 'completed'),
(2, 1, datetime('now', '-170 days'), datetime('now', '-30 days'), 'B', 3.0, 'completed'),
(3, 1, datetime('now', '-160 days'), datetime('now', '-30 days'), 'A', 4.0, 'completed'),
(4, 1, datetime('now', '-150 days'), datetime('now', '-30 days'), 'C', 2.0, 'completed'),
(5, 1, datetime('now', '-140 days'), datetime('now', '-30 days'), 'A', 4.0, 'completed'),
(6, 1, datetime('now', '-130 days'), datetime('now', '-30 days'), 'B', 3.0, 'completed'),
(7, 1, datetime('now', '-120 days'), datetime('now', '-30 days'), 'B', 3.0, 'completed'),
(8, 1, datetime('now', '-110 days'), datetime('now', '-30 days'), 'A', 4.0, 'completed'),
(9, 1, datetime('now', '-100 days'), datetime('now', '-30 days'), 'C', 2.0, 'completed'),
(10, 1, datetime('now', '-90 days'), datetime('now', '-30 days'), 'B', 3.0, 'completed'),
(11, 1, datetime('now', '-80 days'), datetime('now', '-30 days'), 'A', 4.0, 'completed'),
(12, 1, datetime('now', '-70 days'), datetime('now', '-30 days'), 'B', 3.0, 'completed'),
-- CS102 (students who passed CS101)
(1, 2, datetime('now', '-140 days'), NULL, NULL, NULL, 'enrolled'),
(2, 2, datetime('now', '-130 days'), NULL, NULL, NULL, 'enrolled'),
(3, 2, datetime('now', '-120 days'), NULL, NULL, NULL, 'enrolled'),
(5, 2, datetime('now', '-100 days'), NULL, NULL, NULL, 'enrolled'),
(7, 2, datetime('now', '-80 days'), NULL, NULL, NULL, 'enrolled'),
(8, 2, datetime('now', '-70 days'), NULL, NULL, NULL, 'enrolled'),
(10, 2, datetime('now', '-50 days'), NULL, NULL, NULL, 'enrolled'),
(11, 2, datetime('now', '-40 days'), NULL, NULL, NULL, 'enrolled'),
-- CS201
(1, 3, datetime('now', '-140 days'), NULL, NULL, NULL, 'enrolled'),
(3, 3, datetime('now', '-130 days'), NULL, NULL, NULL, 'enrolled'),
(5, 3, datetime('now', '-120 days'), NULL, NULL, NULL, 'enrolled'),
(8, 3, datetime('now', '-110 days'), NULL, NULL, NULL, 'enrolled');

-- ============================================
-- INSERT ATTEMPTS (68 exam attempts)
-- ============================================
-- CS101 Attempts (Midterm)
INSERT INTO attempts (student_id, exam_id, attempt_number, marks_obtained, percentage, status, attempt_date, time_taken_minutes, is_passed, feedback) VALUES
(1, 1, 1, 88, 88, 'completed', datetime('now', '-58 days'), 85, 1, 'Excellent work'),
(2, 1, 1, 72, 72, 'completed', datetime('now', '-58 days'), 88, 1, 'Good performance'),
(3, 1, 1, 95, 95, 'completed', datetime('now', '-58 days'), 80, 1, 'Outstanding'),
(4, 1, 1, 35, 35, 'completed', datetime('now', '-58 days'), 90, 0, 'Below passing'),
(5, 1, 1, 92, 92, 'completed', datetime('now', '-58 days'), 82, 1, 'Excellent'),
(6, 1, 1, 78, 78, 'completed', datetime('now', '-58 days'), 87, 1, 'Good'),
(7, 1, 1, 65, 65, 'completed', datetime('now', '-58 days'), 89, 1, 'Satisfactory'),
(8, 1, 1, 89, 89, 'completed', datetime('now', '-58 days'), 83, 1, 'Very good'),
(9, 1, 1, 52, 52, 'completed', datetime('now', '-58 days'), 91, 1, 'Passing'),
(10, 1, 1, 75, 75, 'completed', datetime('now', '-58 days'), 86, 1, 'Good'),
(11, 1, 1, 91, 91, 'completed', datetime('now', '-58 days'), 81, 1, 'Excellent'),
(12, 1, 1, 68, 68, 'completed', datetime('now', '-58 days'), 88, 1, 'Satisfactory'),
-- CS101 Final
(1, 2, 1, 90, 90, 'completed', datetime('now', '-28 days'), 115, 1, 'Outstanding final'),
(2, 2, 1, 78, 78, 'completed', datetime('now', '-28 days'), 118, 1, 'Good final'),
(3, 2, 1, 96, 96, 'completed', datetime('now', '-28 days'), 112, 1, 'Perfect final'),
(4, 2, 1, 42, 42, 'completed', datetime('now', '-28 days'), 119, 1, 'Just passed'),
(5, 2, 1, 94, 94, 'completed', datetime('now', '-28 days'), 114, 1, 'Excellent final'),
(6, 2, 1, 82, 82, 'completed', datetime('now', '-28 days'), 116, 1, 'Good'),
(7, 2, 1, 70, 70, 'completed', datetime('now', '-28 days'), 117, 1, 'Pass'),
(8, 2, 1, 88, 88, 'completed', datetime('now', '-28 days'), 113, 1, 'Very good'),
(9, 2, 1, 58, 58, 'completed', datetime('now', '-28 days'), 120, 1, 'Marginal pass'),
(10, 2, 1, 79, 79, 'completed', datetime('now', '-28 days'), 115, 1, 'Good'),
(11, 2, 1, 93, 93, 'completed', datetime('now', '-28 days'), 111, 1, 'Excellent'),
(12, 2, 1, 71, 71, 'completed', datetime('now', '-28 days'), 118, 1, 'Pass'),
-- CS101 Quiz
(1, 3, 1, 48, 96, 'completed', datetime('now', '-48 days'), 28, 1, 'Perfect quiz'),
(2, 3, 1, 40, 80, 'completed', datetime('now', '-48 days'), 29, 1, 'Good quiz'),
(3, 3, 1, 50, 100, 'completed', datetime('now', '-48 days'), 27, 1, 'Perfect'),
(4, 3, 1, 20, 40, 'completed', datetime('now', '-48 days'), 30, 0, 'Low score'),
(5, 3, 1, 48, 96, 'completed', datetime('now', '-48 days'), 25, 1, 'Excellent'),
(6, 3, 1, 42, 84, 'completed', datetime('now', '-48 days'), 28, 1, 'Good'),
(7, 3, 1, 35, 70, 'completed', datetime('now', '-48 days'), 29, 1, 'Fair'),
(8, 3, 1, 47, 94, 'completed', datetime('now', '-48 days'), 26, 1, 'Excellent'),
(9, 3, 1, 28, 56, 'completed', datetime('now', '-48 days'), 30, 1, 'Marginal'),
(10, 3, 1, 42, 84, 'completed', datetime('now', '-48 days'), 29, 1, 'Good'),
(11, 3, 1, 49, 98, 'completed', datetime('now', '-48 days'), 25, 1, 'Near perfect'),
(12, 3, 1, 38, 76, 'completed', datetime('now', '-48 days'), 28, 1, 'Good'),
-- CS102 Midterm
(1, 4, 1, 85, 85, 'completed', datetime('now', '-53 days'), 87, 1, 'Excellent'),
(2, 4, 1, 70, 70, 'completed', datetime('now', '-53 days'), 89, 1, 'Good'),
(3, 4, 1, 92, 92, 'completed', datetime('now', '-53 days'), 85, 1, 'Outstanding'),
(5, 4, 1, 88, 88, 'completed', datetime('now', '-53 days'), 86, 1, 'Very good'),
(7, 4, 1, 65, 65, 'completed', datetime('now', '-53 days'), 90, 1, 'Satisfactory'),
(8, 4, 1, 89, 89, 'completed', datetime('now', '-53 days'), 84, 1, 'Excellent'),
(10, 4, 1, 75, 75, 'completed', datetime('now', '-53 days'), 88, 1, 'Good'),
(11, 4, 1, 91, 91, 'completed', datetime('now', '-53 days'), 82, 1, 'Outstanding'),
-- CS102 Final
(1, 5, 1, 87, 87, 'completed', datetime('now', '-20 days'), 118, 1, 'Very good'),
(2, 5, 1, 72, 72, 'completed', datetime('now', '-20 days'), 119, 1, 'Good'),
(3, 5, 1, 94, 94, 'completed', datetime('now', '-20 days'), 116, 1, 'Excellent'),
(5, 5, 1, 90, 90, 'completed', datetime('now', '-20 days'), 117, 1, 'Excellent'),
(7, 5, 1, 68, 68, 'completed', datetime('now', '-20 days'), 120, 1, 'Pass'),
(8, 5, 1, 86, 86, 'completed', datetime('now', '-20 days'), 115, 1, 'Very good'),
(10, 5, 1, 77, 77, 'completed', datetime('now', '-20 days'), 118, 1, 'Good'),
(11, 5, 1, 93, 93, 'completed', datetime('now', '-20 days'), 114, 1, 'Excellent'),
-- CS102 Assignment
(1, 6, 1, 48, 96, 'completed', datetime('now', '-38 days'), 175, 1, 'Perfect submission'),
(2, 6, 1, 40, 80, 'completed', datetime('now', '-38 days'), 180, 1, 'Good'),
(3, 6, 1, 50, 100, 'completed', datetime('now', '-38 days'), 170, 1, 'Perfect'),
(5, 6, 1, 48, 96, 'completed', datetime('now', '-38 days'), 172, 1, 'Excellent'),
(7, 6, 1, 35, 70, 'completed', datetime('now', '-38 days'), 178, 1, 'Fair'),
(8, 6, 1, 47, 94, 'completed', datetime('now', '-38 days'), 168, 1, 'Excellent'),
(10, 6, 1, 42, 84, 'completed', datetime('now', '-38 days'), 175, 1, 'Good'),
(11, 6, 1, 49, 98, 'completed', datetime('now', '-38 days'), 172, 1, 'Near perfect'),
-- CS201 Midterm
(1, 7, 1, 84, 84, 'completed', datetime('now', '-46 days'), 88, 1, 'Very good'),
(3, 7, 1, 91, 91, 'completed', datetime('now', '-46 days'), 86, 1, 'Outstanding'),
(5, 7, 1, 86, 86, 'completed', datetime('now', '-46 days'), 87, 1, 'Very good'),
(8, 7, 1, 85, 85, 'completed', datetime('now', '-46 days'), 85, 1, 'Very good');

-- Note: Additional attempts would be generated based on the pattern above.
-- This seed data provides a representative sample of 68 total attempts.
-- In a real system, you would have more attempts for each exam and student combination.

-- ============================================
-- INSERT SCORES (23 scores for course enrollments)
-- ============================================
INSERT INTO scores (student_id, course_id, score_type, score, max_score, weight, recorded_date) VALUES
(1, 1, 'average', 89, 100, 1.0, datetime('now', '-30 days')),
(2, 1, 'average', 75, 100, 1.0, datetime('now', '-30 days')),
(3, 1, 'average', 95, 100, 1.0, datetime('now', '-30 days')),
(4, 1, 'average', 38, 100, 1.0, datetime('now', '-30 days')),
(5, 1, 'average', 93, 100, 1.0, datetime('now', '-30 days')),
(6, 1, 'average', 80, 100, 1.0, datetime('now', '-30 days')),
(7, 1, 'average', 67, 100, 1.0, datetime('now', '-30 days')),
(8, 1, 'average', 88, 100, 1.0, datetime('now', '-30 days')),
(9, 1, 'average', 55, 100, 1.0, datetime('now', '-30 days')),
(10, 1, 'average', 77, 100, 1.0, datetime('now', '-30 days')),
(11, 1, 'average', 92, 100, 1.0, datetime('now', '-30 days')),
(12, 1, 'average', 69, 100, 1.0, datetime('now', '-30 days')),
(1, 2, 'average', 86, 100, 1.0, datetime('now')),
(2, 2, 'average', 71, 100, 1.0, datetime('now')),
(3, 2, 'average', 93, 100, 1.0, datetime('now')),
(5, 2, 'average', 89, 100, 1.0, datetime('now')),
(7, 2, 'average', 66, 100, 1.0, datetime('now')),
(8, 2, 'average', 87, 100, 1.0, datetime('now')),
(10, 2, 'average', 76, 100, 1.0, datetime('now')),
(11, 2, 'average', 92, 100, 1.0, datetime('now')),
(1, 3, 'average', 84, 100, 1.0, datetime('now')),
(3, 3, 'average', 91, 100, 1.0, datetime('now')),
(5, 3, 'average', 86, 100, 1.0, datetime('now'));
