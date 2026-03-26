import React, { useState, useEffect } from 'react';
import { analyticsAPI, attemptAPI } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, attemptsRes] = await Promise.all([
          analyticsAPI.getDashboardStats(),
          attemptAPI.getDetails(10, 0)
        ]);
        setStats(statsRes.data.data);
        setRecentAttempts(attemptsRes.data.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="card loading">Loading dashboard...</div>;
  if (error) return <div className="card error">Error: {error}</div>;

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Active Students</h4>
          <div className="number">{stats?.active_students || 0}</div>
        </div>
        <div className="stat-card">
          <h4>Active Courses</h4>
          <div className="number">{stats?.active_courses || 0}</div>
        </div>
        <div className="stat-card">
          <h4>Total Attempts</h4>
          <div className="number">{stats?.total_attempts || 0}</div>
        </div>
        <div className="stat-card">
          <h4>Overall Pass Rate</h4>
          <div className="number">{stats?.overall_pass_rate || 0}%</div>
        </div>
        <div className="stat-card">
          <h4>Avg Grade</h4>
          <div className="number">{stats?.overall_avg_percentage?.toFixed(1) || 0}%</div>
        </div>
        <div className="stat-card">
          <h4>Completions</h4>
          <div className="number">{stats?.completed_enrollments || 0}</div>
        </div>
      </div>

      <div className="card">
        <h2>Recent Exam Attempts</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Exam</th>
                <th>Score</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentAttempts.map(attempt => (
                <tr key={attempt.attempt_id}>
                  <td>{attempt.student_name}</td>
                  <td>{attempt.course_code}</td>
                  <td>{attempt.exam_name}</td>
                  <td>{attempt.percentage?.toFixed(1)}%</td>
                  <td style={{ color: attempt.is_passed ? '#10b981' : '#ef4444' }}>
                    {attempt.is_passed ? '✓ Passed' : '✗ Failed'}
                  </td>
                  <td>{new Date(attempt.attempt_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
