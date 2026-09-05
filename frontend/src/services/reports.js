import { apiClient } from './api';

/**
 * FastAPI Reports & AI Analysis Service
 * Manages incident reports and AI prediction insights using FastAPI endpoints.
 */

export const formatReportRecord = (reportData) => {
  return {
    id: reportData.id || `rep-${Math.random().toString(36).substring(2, 9)}`,
    userId: reportData.userId || reportData.user_id,
    title: reportData.title || 'Industrial Safety Observation',
    report: reportData.narrative || reportData.report || '',
    location: reportData.location || 'Plant Unit',
    reporterName: reportData.reporterName || reportData.reporter_name || 'Safety Observer',
    reporterId: reportData.reporterId || reportData.employee_id || 'EMP-1001',
    department: reportData.department || 'Operations',
    company: reportData.company || 'SIF Enterprise',
    prediction: reportData.prediction || reportData.sif_prediction || 'SIF',
    confidence: Number(reportData.confidence || 90.0),
    hazardCategory: reportData.hazardCategory || reportData.hazard_category || 'General Safety',
    recommendedActions: reportData.recommendedActions || reportData.recommended_actions || [],
    executionTimeMs: Number(reportData.executionTimeMs || reportData.execution_time_ms || 135),
    timestamp: reportData.timestamp || reportData.created_at || new Date().toISOString(),
    status: (reportData.prediction || reportData.sif_prediction) === 'SIF' ? 'High Risk' : 'Low Risk',
    reviewStatus: reportData.reviewStatus || reportData.status || 'Submitted',
    evidence: reportData.evidence || reportData.evidence_url || null,
  };
};

export const apiSaveReportWithAI = async (reportData, aiData, currentUser) => {
  const userId = currentUser?.id || null;

  const payload = {
    user_id: userId,
    reporter_name: currentUser?.name || reportData.reporterName || 'Safety Observer',
    employee_id: currentUser?.employeeId || currentUser?.officerId || reportData.reporterId || 'EMP-1001',
    department: currentUser?.department || reportData.department || 'Operations',
    company: currentUser?.company || reportData.company || 'SIF Enterprise',
    title: reportData.title || 'Safety Observation Incident',
    incident_date: reportData.incidentDate || new Date().toISOString(),
    location: reportData.location || 'Distillation Unit 4',
    narrative: reportData.narrative || reportData.report || '',
    evidence_url: reportData.evidence || null,
    status: reportData.reviewStatus || 'Submitted',
    
    // AI data included in payload for backend handling
    prediction: aiData.prediction || 'SIF',
    confidence: Number(aiData.confidence || 90.0),
    hazard_category: aiData.hazardCategory || 'Operational Safety',
    recommended_actions: aiData.recommendedActions || [],
    execution_time_ms: Number(aiData.executionTimeMs || 135),
  };

  try {
    const response = await apiClient.post('/api/reports', payload);
    return formatReportRecord(response.data || payload);
  } catch (err) {
    console.error('Error saving report to Database:', err);
    // For demo purposes if backend isn't there, we could mock return, but we'll throw as requested
    throw new Error(err.response?.data?.message || err.message || 'Report save failed.');
  }
};

export const apiFetchReports = async (userId, isSafetyOfficer = false) => {
  try {
    const params = {};
    if (!isSafetyOfficer && userId) {
      params.user_id = userId;
    }
    
    const response = await apiClient.get('/api/reports', { params });
    
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(r => formatReportRecord(r));
    }
  } catch (err) {
    console.error('Unable to query database reports:', err);
    // Return empty array instead of failing completely if backend is missing for now
    return [];
  }
  return [];
};

export const apiUpdateReportStatus = async (reportId, newStatus) => {
  try {
    const response = await apiClient.patch(`/api/reports/${reportId}/status`, { status: newStatus });
    return response.data;
  } catch (err) {
    console.error('Error updating report status:', err);
    throw new Error(err.response?.data?.message || err.message || 'Update status failed.');
  }
};

export const apiDeleteReport = async (reportId) => {
  try {
    await apiClient.delete(`/api/reports/${reportId}`);
  } catch (err) {
    console.error('Error deleting report:', err);
    throw new Error(err.response?.data?.message || err.message || 'Failed to delete report.');
  }
};
