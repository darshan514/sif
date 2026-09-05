import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePredictions } from '../context/PredictionContext';
import HistoryTable from '../components/history/HistoryTable';
import StatCard from '../components/common/StatCard';
import { motion } from 'framer-motion';

export const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { history, deletePrediction } = usePredictions();

  const myHistory = history;

  const totalMyReports = myHistory.length;
  const mySifReports = myHistory.filter(h => h.prediction === 'SIF').length;
  const myNonSifReports = myHistory.filter(h => h.prediction === 'Non-SIF').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 py-24 max-w-6xl mx-auto px-6 text-left"
    >
      {/* Welcome Banner */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#FF5E3A]/10 border border-[#FF5E3A]/30 rounded-full px-4 py-1.5 text-xs font-bold text-[#FF5E3A]">
            <span className="material-symbols-outlined text-sm">engineering</span>
            <span>Worker Safety Hub</span>
          </div>

          <h1 className="font-display-xl text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name || 'Safety Representative'}
          </h1>

          <p className="text-sm text-slate-600 font-medium max-w-xl">
            Department: <span className="font-bold text-slate-900">{user?.department || 'Field Maintenance'}</span> | Employee ID: <span className="font-mono font-bold text-slate-900">{user?.employeeId || 'EMP-9042'}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate('/predict')}
            className="px-6 py-3.5 rounded-full bg-[#FF5E3A] hover:bg-[#ff4820] text-white font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 shrink-0"
          >
            <span className="material-symbols-outlined text-base">add_alert</span>
            <span>File & Predict Incident</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/my-reports')}
            className="px-5 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
          >
            <span className="material-symbols-outlined text-base">assignment</span>
            <span>My Reports</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="My Total Observations"
          value={totalMyReports}
          subtitle="Reports logged by you"
          color="blue"
        />

        <StatCard
          title="SIF Risk Precursors"
          value={mySifReports}
          subtitle="High priority hazard logs"
          color="red"
        />

        <StatCard
          title="Routine Observations"
          value={myNonSifReports}
          subtitle="Low risk housekeeping"
          color="green"
        />
      </div>

      {/* Employee History Table */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center">
          <h2 className="font-display-xl text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#FF5E3A]">history</span>
            <span>My Observation History</span>
          </h2>

          <Link to="/predict" className="text-xs font-bold text-[#FF5E3A] hover:underline">
            + File New Report
          </Link>

        </div>

        <HistoryTable
          history={myHistory}
          onDelete={deletePrediction}
        />
      </div>

    </motion.div>
  );
};

export default EmployeeDashboard;
