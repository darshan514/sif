import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePredictions } from '../context/PredictionContext';
import { predictSIFRisk, predictDemoFallback } from '../services/api';
import { analyzeHazardInsights } from '../utils/hazardAnalyzer';
import PredictionForm from '../components/predict/PredictionForm';
import PredictionResult from '../components/predict/PredictionResult';
import AIInsightsCard from '../components/predict/AIInsightsCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Toast from '../components/common/Toast';
import { motion } from 'framer-motion';

export const PredictPage = () => {
  const { user } = useAuth();
  const { addPrediction } = usePredictions();

  // Form State
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [reportText, setReportText] = useState('');

  // AI & Submission State
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const handlePredict = async (useDemoOverride = false) => {
    if (!reportText.trim()) return;

    setIsLoading(true);
    setErrorInfo(null);

    const minWait = new Promise((resolve) => setTimeout(resolve, 750));

    try {
      let apiResult;
      if (isDemoMode || useDemoOverride) {
        apiResult = predictDemoFallback(reportText);
      } else {
        try {
          apiResult = await predictSIFRisk(reportText);
        } catch (err) {
          console.warn('Backend API connection failed, offering demo mode fallback:', err);
          setErrorInfo({
            message: err.message || 'Unable to connect to AI server.',
            canFallback: true,
          });
          setIsLoading(false);
          return;
        }
      }

      await minWait;

      setResult(apiResult);

      const hazardInfo = analyzeHazardInsights(reportText, apiResult.prediction);

      // Save Incident Report and AI Analysis to database
      await addPrediction({
        title: title || 'Industrial Safety Observation',
        location: location || 'Plant Facility Unit',
        report: reportText,
        narrative: reportText,
        reporterName: user?.name || 'Field Representative',
        reporterId: user?.employeeId || user?.officerId || 'EMP-1001',
        department: user?.department || 'Plant Safety Operations',
        company: user?.company || 'SIF Enterprise',
        prediction: apiResult.prediction,
        confidence: apiResult.confidence,
        hazardCategory: hazardInfo?.primaryCategory || 'General Hazard',
        recommendedActions: hazardInfo?.recommendedPPE || [],
        executionTimeMs: apiResult.executionTimeMs || 135,
        timestamp: new Date().toISOString(),
        reviewStatus: 'Submitted',
      });

      setToastMessage({
        text: `Report saved to Database & classified as ${apiResult.prediction} (${apiResult.confidence.toFixed(1)}%)`,
        type: 'success',
      });
    } catch (err) {
      setErrorInfo({
        message: err.message || 'Failed to complete SIF prediction & report submission.',
        canFallback: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setTitle('');
    setLocation('');
    setReportText('');
    setResult(null);
    setErrorInfo(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 py-24 max-w-5xl mx-auto px-6 text-left"
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 bg-[#FF5E3A]/10 border border-[#FF5E3A]/30 rounded-full px-4 py-1.5 shadow-sm text-xs font-bold text-[#FF5E3A]">
          <span className="material-symbols-outlined text-sm font-bold">bolt</span>
          <span>Unified Safety Incident Portal</span>
        </div>
        
        <h1 className="font-display-xl text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          SIF Incident Risk & Submission Workbench
        </h1>
        
        <p className="text-base text-slate-600 max-w-2xl font-medium">
          Enter observation details below. DistilBERT NLP classifies SIF risk in real-time and automatically registers your report into the database ledger.
        </p>
      </div>

      {/* Main Prediction & Reporting Form */}
      <PredictionForm
        title={title}
        setTitle={setTitle}
        location={location}
        setLocation={setLocation}
        reportText={reportText}
        setReportText={setReportText}
        onPredict={() => handlePredict(false)}
        isLoading={isLoading}
        onClear={handleClear}
      />

      {/* Connection Error Notification */}
      {errorInfo && (
        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-300 text-amber-900 space-y-4 backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-amber-600 text-2xl">warning</span>
            <div>
              <h4 className="font-bold text-base text-slate-900">{errorInfo.message}</h4>
              <p className="text-xs text-amber-900 mt-1 font-medium">
                FastAPI backend on <code className="px-1.5 py-0.5 rounded bg-amber-200 font-mono text-xs text-slate-900">http://127.0.0.1:8000/predict</code> was not reached. Ensure your Python backend is running (<code className="px-1.5 py-0.5 rounded bg-amber-200 font-mono text-xs text-slate-900">uvicorn backend.app:app</code>).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pl-9">
            <button
              onClick={() => handlePredict(false)}
              className="px-5 py-2.5 rounded-full text-xs font-bold bg-amber-600 text-white hover:bg-amber-500 transition-colors shadow-sm"
            >
              Retry Server Connection
            </button>

            {errorInfo.canFallback && (
              <button
                onClick={() => {
                  setIsDemoMode(true);
                  handlePredict(true);
                }}
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors border border-slate-700 shadow-sm"
              >
                Use Client-Side Demo AI Model
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading State Spinner */}
      {isLoading && (
        <div className="w-full bg-white/60 rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.03)] p-8 backdrop-blur-xl">
          <LoadingSpinner label="Running DistilBERT Classifier & Saving to Database..." />
        </div>
      )}

      {/* Prediction Output Results */}
      {!isLoading && result && (
        <div className="space-y-6">
          <PredictionResult
            result={result}
            reportText={reportText}
            onCopySuccess={() => setToastMessage({ text: 'Prediction result copied to clipboard!', type: 'success' })}
          />

          <AIInsightsCard
            result={result}
            reportText={reportText}
            onReset={handleClear}
          />
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage.text}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}

    </motion.div>
  );
};

export default PredictPage;
