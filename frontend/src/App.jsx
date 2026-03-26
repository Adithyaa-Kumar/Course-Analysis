import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './styles.css';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Analytics from './pages/Analytics';
import QueryExplorer from './pages/QueryExplorer';

function App() {
  const [activeNav, setActiveNav] = React.useState('dashboard');

  return (
    <Router>
      <div className="app-container">
        <nav className="sidebar">
          <div className="logo">
            <h2>📊 Analytics</h2>
          </div>
          <ul className="nav-menu">
            <li>
              <Link 
                to="/" 
                onClick={() => setActiveNav('dashboard')}
                className={activeNav === 'dashboard' ? 'active' : ''}
              >
                📈 Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/students" 
                onClick={() => setActiveNav('students')}
                className={activeNav === 'students' ? 'active' : ''}
              >
                👥 Students
              </Link>
            </li>
            <li>
              <Link 
                to="/courses" 
                onClick={() => setActiveNav('courses')}
                className={activeNav === 'courses' ? 'active' : ''}
              >
                📚 Courses
              </Link>
            </li>
            <li>
              <Link 
                to="/analytics" 
                onClick={() => setActiveNav('analytics')}
                className={activeNav === 'analytics' ? 'active' : ''}
              >
                📉 Analytics
              </Link>
            </li>
            <li>
              <Link 
                to="/query-explorer" 
                onClick={() => setActiveNav('query')}
                className={activeNav === 'query' ? 'active' : ''}
              >
                🔍 Query Explorer
              </Link>
            </li>
          </ul>
        </nav>

        <div className="main-content">
          <header className="top-header">
            <h1>Course Attempt & Performance Analytics System</h1>
            <p>Track, analyze, and optimize student performance</p>
          </header>

          <div className="content-area">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/query-explorer" element={<QueryExplorer />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
