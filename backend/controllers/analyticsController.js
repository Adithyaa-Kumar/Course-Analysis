import * as AnalyticsModel from '../models/Analytics.js';

export const getStudentPerformanceOverTime = async (req, res) => {
  try {
    const { studentId } = req.params;
    const data = await AnalyticsModel.getStudentPerformanceOverTime(studentId);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching student performance:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCourseFailureAnalysis = async (req, res) => {
  try {
    const data = await AnalyticsModel.getCourseFailureAnalysis();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching course failure analysis:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getStudentImprovement = async (req, res) => {
  try {
    const data = await AnalyticsModel.getStudentImprovement();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching student improvement:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getInstructorRanking = async (req, res) => {
  try {
    const data = await AnalyticsModel.getInstructorRanking();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching instructor ranking:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getConsistentPerformers = async (req, res) => {
  try {
    const data = await AnalyticsModel.getConsistentPerformers();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching consistent performers:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getDifficultyCourseAnalysis = async (req, res) => {
  try {
    const data = await AnalyticsModel.getDifficultyCourseAnalysis();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching difficulty analysis:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPrerequisiteImpact = async (req, res) => {
  try {
    const data = await AnalyticsModel.getPrerequisiteImpact();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching prerequisite impact:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getSystemDashboardStats = async (req, res) => {
  try {
    const data = await AnalyticsModel.getSystemDashboardStats();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
