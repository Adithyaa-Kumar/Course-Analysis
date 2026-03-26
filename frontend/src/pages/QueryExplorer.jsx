import React, { useState, useEffect } from 'react';
import { analyticsAPI, courseAPI } from '../services/api';

export default function QueryExplorer() {
  const [queryResults, setQueryResults] = useState({});
  const [activeQuery, setActiveQuery] = useState('difficulty');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAllQueries = async () => {
      try {
        setLoading(true);
        const [difficultyRes, prerequisiteRes] = await Promise.all([
          analyticsAPI.getDifficultyCourseAnalysis(),
          analyticsAPI.getPrerequisiteImpact()
        ]);
        
        setQueryResults({
          difficulty: difficultyRes.data.data,
          prerequisite: prerequisiteRes.data.data
        });
      } catch (error) {
        console.error('Error loading query results:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllQueries();
  }, []);

  const queries = {
    simple: {
      name: 'Simple Query',
      description: 'Retrieve all courses with basic information',
      sql: 'SELECT id, code, name, instructor_name, difficulty_level FROM courses WHERE is_active = true',
      type: 'SELECT'
    },
    join: {
      name: 'Multi-Table JOIN',
      description: 'Join students, attempts, and exams to get detailed attempt history',
      sql: `SELECT s.name, c.code, e.exam_name, a.percentage, a.is_passed
FROM attempts a
JOIN students s ON a.student_id = s.id
JOIN exams e ON a.exam_id = e.id
JOIN courses c ON e.course_id = c.id
ORDER BY a.attempt_date DESC`,
      type: 'JOIN'
    },
    aggregate: {
      name: 'Aggregation with GROUP BY',
      description: 'Calculate course performance statistics',
      sql: `SELECT c.code, c.name,
COUNT(DISTINCT a.student_id) as total_students,
AVG(a.marks_obtained) as avg_marks,
COUNT(CASE WHEN a.is_passed = true THEN 1 END) as passed_count
FROM courses c
LEFT JOIN exams e ON c.id = e.course_id
LEFT JOIN attempts a ON e.id = a.exam_id
GROUP BY c.id, c.code, c.name`,
      type: 'AGGREGATE'
    },
    view: {
      name: 'Database VIEWs',
      description: 'Pre-calculated views for performance analysis',
      sql: `-- student_average_scores view
-- Provides avg marks, median, pass rate by student

-- course_performance_summary view
-- Provides course-level statistics and performance metrics

-- high_risk_students view
-- Identifies students with high failure rates`,
      type: 'VIEW'
    },
    subquery: {
      name: 'Subqueries & CTEs',
      description: 'Complex nested queries for advanced analysis',
      sql: `SELECT * FROM (
  SELECT s.id, s.name,
    (SELECT AVG(percentage) FROM attempts WHERE student_id = s.id) as avg_score,
    (SELECT COUNT(*) FROM attempts WHERE student_id = s.id AND is_passed = true) as passed
  FROM students s
) student_analysis
WHERE avg_score > 70`,
      type: 'SUBQUERY'
    },
    dependency: {
      name: 'Dependency Analysis',
      description: 'Track prerequisite relationships and impact',
      type: 'COMPLEX',
      data: queryResults.difficulty
    }
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '20px' }}>
        <h2>SQL Concepts & Query Explorer</h2>
        <p>Learn about different SQL query types used in course analytics</p>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {Object.entries(queries).map(([key, query]) => (
          <button
            key={key}
            className={`btn ${activeQuery === key ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveQuery(key)}
          >
            {query.type}
          </button>
        ))}
      </div>

      <div className="card">
        <h3>{queries[activeQuery].name}</h3>
        <p style={{ marginBottom: '15px', color: '#94a3b8' }}>
          {queries[activeQuery].description}
        </p>

        {queries[activeQuery].sql && (
          <div style={{
            background: '#0f172a',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            overflow: 'auto',
            border: '1px solid #334155'
          }}>
            <pre style={{ color: '#10b981', margin: 0, fontSize: '0.9rem' }}>
              {queries[activeQuery].sql}
            </pre>
          </div>
        )}

        {queries[activeQuery].data && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Course Name</th>
                  <th>Difficulty</th>
                  <th>Students</th>
                  <th>Avg Marks</th>
                  <th>Pass Rate</th>
                </tr>
              </thead>
              <tbody>
                {queries[activeQuery].data.slice(0, 10).map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.course_code}</td>
                    <td>{row.course_name}</td>
                    <td>{row.difficulty_level}</td>
                    <td>{row.student_count}</td>
                    <td>{row.avg_marks?.toFixed(1)}%</td>
                    <td style={{ color: row.pass_rate > 60 ? '#10b981' : '#ef4444' }}>
                      {row.pass_rate?.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#1a2642', borderRadius: '8px' }}>
          <h4 style={{ color: '#3b82f6', marginBottom: '10px' }}>SQL Concepts Demonstrated:</h4>
          <ul style={{ color: '#cbd5e1', paddingLeft: '20px' }}>
            {activeQuery === 'simple' && (
              <>
                <li>SELECT - Basic column selection</li>
                <li>WHERE - Filtering with conditions</li>
                <li>Boolean operators (true/false)</li>
              </>
            )}
            {activeQuery === 'join' && (
              <>
                <li>INNER JOIN - Multiple table relationships</li>
                <li>JOIN chains - 4+ tables linked</li>
                <li>ORDER BY - Result sorting</li>
              </>
            )}
            {activeQuery === 'aggregate' && (
              <>
                <li>COUNT, AVG functions</li>
                <li>GROUP BY - Aggregation</li>
                <li>LEFT JOIN with aggregates</li>
                <li>Conditional aggregation (CASE WHEN)</li>
              </>
            )}
            {activeQuery === 'view' && (
              <>
                <li>CREATE VIEW - Pre-calculated datasets</li>
                <li>View-based reporting</li>
                <li>Performance optimization</li>
                <li>Aggregation in views</li>
              </>
            )}
            {activeQuery === 'subquery' && (
              <>
                <li>Subqueries in SELECT</li>
                <li>Correlated subqueries</li>
                <li>Derived tables (FROM subqueries)</li>
                <li>Filtering on aggregates</li>
              </>
            )}
            {activeQuery === 'dependency' && (
              <>
                <li>Self-referencing JOINs</li>
                <li>Prerequisite chain analysis</li>
                <li>Complex multi-level joins</li>
                <li>Analysis queries</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
