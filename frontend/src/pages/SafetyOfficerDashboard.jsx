import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePredictions } from '../context/PredictionContext';
import HistoryTable from '../components/history/HistoryTable';
import StatCard from '../components/common/StatCard';
import { generateBatchReportPDF } from '../utils/pdfGenerator';
import { motion } from 'framer-motion';

export const SafetyOfficerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { history, deletePrediction, clearHistory, stats } = usePredictions();

  const sifReports = history.filter(h => h.prediction === 'SIF');
  const sifRate = stats.reportsAnalyzed > 0
    ? ((sifReports.length / stats.reportsAnalyzed) * 100).toFixed(1)
    : '0.0';

  const handleExportPDF = () => {
    generateBatchReportPDF(history);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 py-24 max-w-6xl mx-auto px-6 text-left"
    >
      {/* Executive Header */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-slate-900 text-white rounded-full px-4 py-1.5 text-xs font-extrabold">
            <span className="material-symbols-outlined text-sm text-[#FF5E3A]">shield_person</span>
            <span>Chief Safety Officer Command Hub</span>
          </div>

          <h1 className="font-display-xl text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Executive Safety Overview
          </h1>

          <p className="text-sm text-slate-600 font-medium max-w-2xl">
            Logged as: <span className="font-bold text-slate-900">{user?.name || 'Dr. Priya Sharma'}</span> | Officer ID: <span className="font-mono font-bold text-slate-900">{user?.officerId || 'SO-108'}</span> | Biometrics: <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-800 font-bold text-xs border border-emerald-300">Verified</span>
          </p>
        </div>

        {/* Quick Executive Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate('/analytics')}
            className="px-5 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base text-[#FF5E3A]">monitoring</span>
            <span>Analytics</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/batch')}
            className="px-5 py-3 rounded-full bg-[#FF5E3A] hover:bg-[#ff4820] text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">upload_file</span>
            <span>Batch Analysis</span>
          </button>

          <button
            type="button"
            onClick={handleExportPDF}
            className="px-5 py-3 rounded-full bg-white border border-slate-300 text-slate-900 hover:bg-slate-50 font-extrabold text-xs shadow-sm transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">picture_as_pdf</span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* High Priority SIF Precursor Alert Drawer */}
      {sifReports.length > 0 && (
        <div className="p-6 rounded-3xl bg-red-500/10 border border-red-300 text-red-950 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600 text-2xl animate-pulse">warning</span>
              <h3 className="font-extrabold text-base text-slate-900">
                Critical SIF Precursors Requiring Immediate Supervisor Intervention ({sifReports.length})
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-red-600 text-white font-extrabold text-xs">
              Action Required
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {sifReports.slice(0, 2).map((item) => (
              <div key={item.id} className="p-3.5 rounded-2xl bg-white/90 border border-red-200 shadow-sm space-y-1">
                <span className="text-[10px] font-mono text-slate-500">{new Date(item.timestamp).toLocaleString()}</span>
                <p className="text-xs text-slate-900 font-bold line-clamp-2">"{item.report}"</p>
                <div className="flex justify-between items-center text-[11px] pt-1">
                  <span className="font-bold text-red-700">Confidence: {item.confidence.toFixed(1)}%</span>
                  <Link to="/history" className="text-[#FF5E3A] font-bold hover:underline">Review Audit →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Plant Reports"
          value={stats.reportsAnalyzed}
          subtitle="Processed through DistilBERT"
          color="blue"
        />

        <StatCard
          title="High Risk SIF Rate"
          value={sifRate}
          subtitle="Precursor probability ratio"
          color="red"
          suffix="%"
        />

        <StatCard
          title="Routine Observations"
          value={stats.lowRiskReports}
          subtitle="Low risk observations"
          color="green"
        />

        <StatCard
          title="Avg Confidence Score"
          value={stats.averageConfidence}
          subtitle="DistilBERT AI Precision"
          color="teal"
          suffix="%"
        />
      </div>

      {/* All Employee Observations Ledger */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center">
          <h2 className="font-display-xl text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#FF5E3A]">manage_accounts</span>
            <span>Enterprise Employee Observations Audit Log</span>
          </h2>
        </div>

        <HistoryTable
          history={history}
          onDelete={deletePrediction}
          onClearAll={clearHistory}
        />
      </div>

    </motion.div>
  );
};

export default SafetyOfficerDashboard;
