import axios from 'axios';

// Support both Vite (import.meta.env.VITE_API_URL) and React (.env REACT_APP_API_URL)
// For Cloudflare: Set VITE_API_URL in environment variables
// For local dev: Defaults to http://localhost:5000/api
const API_BASE_URL = import.meta.env.VITE_API_URL || 
                     process.env.REACT_APP_API_URL || 
                     'http://localhost:5000/api';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Students API
export const studentAPI = {
  getAll: (limit = 50, offset = 0) => api.get('/students', { params: { limit, offset } }),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  getTop: (limit = 10) => api.get('/students/top', { params: { limit } }),
  getAtRisk: () => api.get('/students/risk')
};

// Courses API
export const courseAPI = {
  getAll: (limit = 50, offset = 0) => api.get('/courses', { params: { limit, offset } }),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  getWithStats: (limit = 50, offset = 0) => api.get('/courses/stats', { params: { limit, offset } }),
  getDependencyAnalysis: () => api.get('/courses/dependency/analysis')
};

// Attempts API
export const attemptAPI = {
  getAll: (limit = 50, offset = 0) => api.get('/attempts', { params: { limit, offset } }),
  getById: (id) => api.get(`/attempts/${id}`),
  create: (data) => api.post('/attempts', data),
  update: (id, data) => api.put(`/attempts/${id}`, data),
  delete: (id) => api.delete(`/attempts/${id}`),
  getByStudent: (studentId, limit = 50, offset = 0) => api.get(`/attempts/student/${studentId}`, { params: { limit, offset } }),
  getStudentDetails: (studentId, limit = 50, offset = 0) => api.get(`/attempts/student/${studentId}/details`, { params: { limit, offset } }),
  getByExam: (examId, limit = 50, offset = 0) => api.get(`/attempts/exam/${examId}`, { params: { limit, offset } }),
  getByCourse: (courseId) => api.get(`/attempts/course/${courseId}`),
  getDetails: (limit = 50, offset = 0) => api.get('/attempts/details', { params: { limit, offset } })
};

// Analytics API
export const analyticsAPI = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getStudentPerformance: (studentId) => api.get(`/analytics/student/${studentId}/performance`),
  getCourseFailureAnalysis: () => api.get('/analytics/courses/failure'),
  getStudentImprovement: () => api.get('/analytics/students/improvement'),
  getInstructorRanking: () => api.get('/analytics/instructors/ranking'),
  getConsistentPerformers: () => api.get('/analytics/students/consistent'),
  getDifficultyCourseAnalysis: () => api.get('/analytics/courses/difficulty'),
  getPrerequisiteImpact: () => api.get('/analytics/prerequisites/impact')
};

export default api;
