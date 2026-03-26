import React, { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [riskStudents, setRiskStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const [allRes, topRes, riskRes] = await Promise.all([
          studentAPI.getAll(50, 0),
          studentAPI.getTop(10),
          studentAPI.getAtRisk()
        ]);
        setStudents(allRes.data.data);
        setTopStudents(topRes.data.data);
        setRiskStudents(riskRes.data.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error loading students:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (loading) return <div className="card loading">Loading students...</div>;
  if (error) return <div className="card error">Error: {error}</div>;

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button 
          className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('all')}
        >
          All Students
        </button>
        <button 
          className={`btn ${activeTab === 'top' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('top')}
        >
          Top Performers
        </button>
        <button 
          className={`btn ${activeTab === 'risk' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('risk')}
        >
          At Risk
        </button>
      </div>

      {activeTab === 'all' && (
        <div className="card">
          <h2>All Students ({students.length})</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Enrollment Date</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td>#{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td style={{ color: student.status === 'active' ? '#10b981' : '#94a3b8' }}>
                      {student.status}
                    </td>
                    <td>{new Date(student.enrollment_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'top' && (
        <div className="card">
          <h2>Top Performers</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Avg Score</th>
                  <th>Passing Exams</th>
                  <th>Pass Rate</th>
                </tr>
              </thead>
              <tbody>
                {topStudents.map((student, idx) => (
                  <tr key={idx}>
                    <td>🌟 {student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.avg_marks?.toFixed(1)}%</td>
                    <td>{Math.round(student.median_marks || 0)}</td>
                    <td style={{ color: '#10b981' }}>{student.pass_rate || 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'risk' && (
        <div className="card">
          <h2>At-Risk Students</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Avg Score</th>
                  <th>Failed Exams</th>
                  <th>Failure Rate</th>
                </tr>
              </thead>
              <tbody>
                {riskStudents.map((student, idx) => (
                  <tr key={idx}>
                    <td>⚠️ {student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.avg_score?.toFixed(1)}%</td>
                    <td>{student.failed_exams}</td>
                    <td style={{ color: '#ef4444' }}>{student.failure_rate}%</td>
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
