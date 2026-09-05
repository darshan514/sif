import React, { useState } from 'react';
import { usePredictions } from '../../context/PredictionContext';
import { predictSIFRisk, predictDemoFallback } from '../../services/api';
import { motion } from 'framer-motion';

export const QuickPredictWidget = () => {
  const { addPrediction } = usePredictions();
  const [report, setReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const presets = [
    'Scaffold work at 8 meters without safety harness',
    'Hydrocarbon vapor leak detected near furnace',
    'Minor water spillage on corridor walkway',
    '415V electrical panel maintenance without LOTO'
  ];

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    if (!report.trim() || isLoading) return;

    setIsLoading(true);
    setResult(null);

    const minWait = new Promise((resolve) => setTimeout(resolve, 650));

    try {
      let apiResult;
      try {
        apiResult = await predictSIFRisk(report);
      } catch (err) {
        apiResult = predictDemoFallback(report);
      }

      await minWait;

      setResult(apiResult);
      addPrediction({
        report,
        prediction: apiResult.prediction,
        confidence: apiResult.confidence,
        executionTimeMs: apiResult.executionTimeMs,
        timestamp: apiResult.timestamp,
        isDemoFallback: apiResult.isDemoFallback,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[870px] bg-white/70 rounded-3xl border border-white/90 shadow-[0_8px_32px_rgba(0,0,0,0.03)] p-6 mb-8 backdrop-blur-xl text-left">
      <form onSubmit={handlePredict} className="flex flex-col gap-4">
        <textarea
          value={report}
          onChange={(e) => setReport(e.target.value)}
          disabled={isLoading}
          rows={3}
          placeholder="Describe the incident, unsafe act, or near-miss observation..."
          className="w-full bg-transparent border-none resize-none font-body-lg text-lg text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:outline-none min-h-[80px]"
        />

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200/60">
          
          {/* Action pills */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setReport('')}
              className="p-2 rounded-full hover:bg-white/80 transition-colors text-slate-600"
              title="Clear Text"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>

            <div className="flex items-center gap-2 bg-white/80 border border-white rounded-full px-4 py-1.5 shadow-sm">
              <span className="text-xs font-semibold text-slate-700">DistilBERT Mode</span>
              <span className="material-symbols-outlined text-[18px] text-[#FF5E3A]">tune</span>
            </div>
          </div>

          {/* Submit Arrow Button */}
          <button
            type="submit"
            disabled={!report.trim() || isLoading}
            className="bg-white/80 border border-white text-[#FF5E3A] rounded-full w-12 h-12 flex items-center justify-center shadow-sm hover:bg-white transition-colors scale-95 active:scale-90 disabled:opacity-40"
          >
            <span className="material-symbols-outlined">
              {isLoading ? 'hourglass_top' : 'arrow_upward'}
            </span>
          </button>
        </div>
      </form>

      {/* Preset Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
        {presets.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setReport(preset)}
            className="bg-white/60 text-slate-800 border border-white/80 shadow-sm rounded-full px-4 py-1.5 text-xs font-medium hover:bg-white transition-colors backdrop-blur-md"
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Result Card */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-2xl border flex items-center justify-between ${
            result.prediction === 'SIF'
              ? 'bg-red-500/10 border-red-300 text-red-900'
              : 'bg-emerald-500/10 border-emerald-300 text-emerald-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl">
              {result.prediction === 'SIF' ? 'warning' : 'check_circle'}
            </span>
            <div>
              <span className="font-extrabold text-sm">
                {result.prediction === 'SIF' ? 'SIF — High Risk Precursor' : 'Non-SIF — Low Risk'}
              </span>
              <p className="text-xs opacity-80">DistilBERT Latency: {result.executionTimeMs}ms</p>
            </div>
          </div>

          <span className="font-extrabold text-lg">{result.confidence.toFixed(2)}%</span>
        </motion.div>
      )}
    </div>
  );
};

export default QuickPredictWidget;
