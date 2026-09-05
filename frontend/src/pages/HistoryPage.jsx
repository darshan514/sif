import React from 'react';
import { usePredictions } from '../context/PredictionContext';
import HistoryTable from '../components/history/HistoryTable';
import { motion } from 'framer-motion';

export const HistoryPage = () => {
  const { history, deletePrediction, clearHistory } = usePredictions();

  const sifCount = history.filter(h => h.prediction === 'SIF').length;
  const nonSifCount = history.filter(h => h.prediction === 'Non-SIF').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 py-24 max-w-6xl mx-auto px-6 text-left"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-xl border border-white/80 rounded-full px-4 py-1.5 shadow-sm">
            <span className="material-symbols-outlined text-[#FF5E3A] text-sm">history</span>
            <span className="font-body-md text-xs font-semibold text-slate-800">
              Audit & Compliance Log
            </span>
          </div>
          
          <h1 className="font-display-xl text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Prediction History & Audit Log
          </h1>
          
          <p className="text-base text-slate-600 max-w-2xl">
            Complete searchable ledger of safety observations analyzed by DistilBERT NLP.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all prediction history?')) {
                clearHistory();
              }
            }}
            className="bg-white/60 text-red-600 border border-white/80 px-5 py-2.5 rounded-full text-xs font-bold hover:bg-red-500/10 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
            <span>Clear History</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
        <div className="px-4 py-2 rounded-full bg-white/60 border border-white/80 shadow-sm">
          <span>Total Logged: </span>
          <span className="font-extrabold text-slate-900">{history.length}</span>
        </div>

        <div className="px-4 py-2 rounded-full bg-red-500/10 border border-red-300 text-red-800 shadow-sm flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm">warning</span>
          <span>SIF Precursors: {sifCount}</span>
        </div>

        <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-300 text-emerald-800 shadow-sm flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>Low Risk: {nonSifCount}</span>
        </div>
      </div>

      <HistoryTable
        history={history}
        onDelete={deletePrediction}
        onClearAll={clearHistory}
      />
    </motion.div>
  );
};

export default HistoryPage;
