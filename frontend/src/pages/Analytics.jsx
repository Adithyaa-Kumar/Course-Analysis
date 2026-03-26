import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState({
    courseFailure: [],
    studentImprovement: [],
    instructorRanking: [],
    consistentPerformers: []
  });
  const [activeTab, setActiveTab] = useState('failure');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const [failureRes, improvementRes, instructorRes, consistentRes] = await Promise.all([
          analyticsAPI.getCourseFailureAnalysis(),
          analyticsAPI.getStudentImprovement(),
          analyticsAPI.getInstructorRanking(),
          analyticsAPI.getConsistentPerformers()
        ]);
        
        setAnalyticsData({
          courseFailure: failureRes.data.data,
          studentImprovement: improvementRes.data.data,
          instructorRanking: instructorRes.data.data,
          consistentPerformers: consistentRes.data.data
        });
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error loading analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) return <div className="card loading">Loading analytics...</div>;
  if (error) return <div className="card error">Error: {error}</div>;

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          className={`btn ${activeTab === 'failure' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('failure')}
        >
          Course Failures
        </button>
        <button 
          className={`btn ${activeTab === 'improvement' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('improvement')}
        >
          Student Improvement
        </button>
        <button 
          className={`btn ${activeTab === 'instructor' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('instructor')}
        >
          Instructor Ranking
        </button>
        <button 
          className={`btn ${activeTab === 'consistent' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('consistent')}
        >
          Consistent Performers
        </button>
      </div>

      {activeTab === 'failure' && (
        <div className="card">
          <h2>Course Failure Analysis</h2>
          <p>Courses ordered by failure rate (higher = more failures)</p>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Difficulty</th>
                  <th>Students</th>
                  <th>Failed</th>
                  <th>Failure Rate</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.courseFailure.map((course, idx) => (
                  <tr key={idx}>
                    <td>{course.code}</td>
                    <td>{course.name}</td>
                    <td>{course.difficulty_level}</td>
                    <td>{course.total_students}</td>
                    <td>{course.failed_count}</td>
                    <td style={{ color: course.failure_rate > 30 ? '#ef4444' : '#10b981' }}>
                      {course.failure_rate?.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'improvement' && (
        <div className="card">
          <h2>Student Improvement Analysis</h2>
          <p>Students showing improvement from first to most recent attempt</p>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Initial Avg</th>
                  <th>Recent Avg</th>
                  <th>Improvement</th>
                  <th>Exams</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.studentImprovement.slice(0, 20).map((student, idx) => {
                  const improvement = (student.recent_attempt_avg - student.first_attempt_avg) || 0;
                  return (
                    <tr key={idx}>
                      <td>{student.name}</td>
                      <td>{student.first_attempt_avg?.toFixed(1) || '-'}%</td>
                      <td>{student.recent_attempt_avg?.toFixed(1) || '-'}%</td>
                      <td style={{ color: improvement > 0 ? '#10b981' : '#ef4444' }}>
                        {improvement > 0 ? '+' : ''}{improvement?.toFixed(1) || 0}%
                      </td>
                      <td>{student.total_exams}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'instructor' && (
        <div className="card">
          <h2>Instructor Performance Ranking</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Instructor</th>
                  <th>Courses</th>
                  <th>Students</th>
                  <th>Avg Marks</th>
                  <th>Pass Rate</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.instructorRanking.map((instructor, idx) => (
                  <tr key={idx}>
                    <td>👨‍🏫 {instructor.instructor_name}</td>
                    <td>{instructor.course_count}</td>
                    <td>{instructor.total_students}</td>
                    <td>{instructor.avg_marks?.toFixed(1) || '-'}%</td>
                    <td style={{ color: instructor.pass_rate >= 70 ? '#10b981' : '#f59e0b' }}>
                      {instructor.pass_rate?.toFixed(1) || 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'consistent' && (
        <div className="card">
          <h2>Consistent Performers</h2>
          <p>Students with stable, consistent performance (low variation)</p>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Exams</th>
                  <th>Avg %</th>
                  <th>Std Dev</th>
                  <th>Passed</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.consistentPerformers.map((student, idx) => (
                  <tr key={idx}>
                    <td>🏆 {student.name}</td>
                    <td>{student.exam_count}</td>
                    <td>{student.avg_percentage?.toFixed(1)}%</td>
                    <td>{student.std_deviation?.toFixed(1)}</td>
                    <td>{student.passed_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
