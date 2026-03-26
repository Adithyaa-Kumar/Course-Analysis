import React, { useState, useEffect } from 'react';
import { courseAPI } from '../services/api';

export default function Courses() {
  const [courses, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const coursesRes = await courseAPI.getWithStats(50, 0);
        setCoursesData(coursesRes.data.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error loading courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, []);

  if (loading) return <div className="card loading">Loading courses...</div>;
  if (error) return <div className="card error">Error: {error}</div>;

  return (
    <div>
      <div className="card">
        <h2>Courses Performance ({courses.length})</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Course Name</th>
                <th>Instructor</th>
                <th>Students</th>
                <th>Avg Score</th>
                <th>Pass Rate</th>
                <th>Exams</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id}>
                  <td><strong>{course.code}</strong></td>
                  <td>{course.name}</td>
                  <td>{course.instructor_name || 'N/A'}</td>
                  <td>{course.total_students || 0}</td>
                  <td>{course.avg_course_score?.toFixed(1) || '-'}%</td>
                  <td style={{ color: course.pass_rate >= 70 ? '#10b981' : course.pass_rate >= 50 ? '#f59e0b' : '#ef4444' }}>
                    {course.pass_rate?.toFixed(1) || 0}%
                  </td>
                  <td>{course.exam_count || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="stats-grid">
        {courses.slice(0, 6).map(course => (
          <div key={course.id} className="stat-card">
            <h4>{course.code}</h4>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '8px' }}>
              {course.name.substring(0, 20)}...
            </div>
            <div className="number" style={{ fontSize: '1.5rem' }}>
              {course.pass_rate?.toFixed(0) || 0}%
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {course.passed_count || 0}/{course.total_students || 0} passed
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
