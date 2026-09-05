import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  apiFetchReports,
  apiSaveReportWithAI,
  apiUpdateReportStatus,
  apiDeleteReport,
} from '../services/reports';

const PredictionContext = createContext();

export const PredictionProvider = ({ children }) => {
  const { user, isSafetyOfficer } = useAuth();
  const [history, setHistory] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);

  // Load live reports from Database whenever user or role changes
  const refreshReports = useCallback(async () => {
    if (!user) {
      setHistory([]);
      return;
    }
    setIsLoadingReports(true);
    try {
      const records = await apiFetchReports(user.id, isSafetyOfficer);
      setHistory(records || []);
    } catch (err) {
      console.warn('Error loading reports from database:', err);
    } finally {
      setIsLoadingReports(false);
    }
  }, [user, isSafetyOfficer]);

  useEffect(() => {
    refreshReports();
  }, [refreshReports]);

  // Add new prediction report & persist to Database
  const addPrediction = async (newPred) => {
    const aiData = {
      prediction: newPred.prediction,
      confidence: newPred.confidence,
      hazardCategory: newPred.hazardCategory || 'General Safety',
      recommendedActions: newPred.recommendedActions || [],
      executionTimeMs: newPred.executionTimeMs || 135,
    };

    const savedRecord = await apiSaveReportWithAI(newPred, aiData, user);
    setHistory(prev => [savedRecord, ...prev]);
    return savedRecord;
  };

  // Update report status in Database
  const updateReportStatus = async (id, newStatus) => {
    setHistory(prev =>
      prev.map(item => (item.id === id ? { ...item, reviewStatus: newStatus } : item))
    );
    await apiUpdateReportStatus(id, newStatus);
  };

  // Delete prediction report from Database
  const deletePrediction = async (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    await apiDeleteReport(id);
  };

  // Clear history
  const clearHistory = async () => {
    history.forEach(item => {
      apiDeleteReport(item.id);
    });
    setHistory([]);
  };

  // Compute live dashboard metrics from database records
  const totalPredictions = history.length;
  const highRiskCount = history.filter(h => h.prediction === 'SIF').length;
  const lowRiskCount = history.filter(h => h.prediction === 'Non-SIF').length;
  const avgConfidence = totalPredictions > 0
    ? (history.reduce((acc, curr) => acc + (Number(curr.confidence) || 0), 0) / totalPredictions).toFixed(2)
    : 0;

  const stats = {
    reportsAnalyzed: totalPredictions,
    highRiskReports: highRiskCount,
    lowRiskReports: lowRiskCount,
    averageConfidence: avgConfidence,
    totalPredictions: totalPredictions,
  };

  return (
    <PredictionContext.Provider value={{
      history,
      isLoadingReports,
      refreshReports,
      addPrediction,
      updateReportStatus,
      deletePrediction,
      clearHistory,
      stats,
    }}>
      {children}
    </PredictionContext.Provider>
  );
};

export const usePredictions = () => useContext(PredictionContext);
export default PredictionContext;
