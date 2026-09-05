import React from 'react';
import { usePredictions } from '../context/PredictionContext';
import { computeAnalyticsMetrics } from '../utils/hazardAnalyzer';
import RiskDistributionChart from '../components/analytics/RiskDistributionChart';
import IncidentTrendChart from '../components/analytics/IncidentTrendChart';
import HazardCategoryChart from '../components/analytics/HazardCategoryChart';
import AnalyticsWidgets from '../components/analytics/AnalyticsWidgets';
import StatCard from '../components/common/StatCard';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AnalyticsPage = () => {
  const { history, stats } = usePredictions();
  const metrics = computeAnalyticsMetrics(history);

  const highRiskRate =
    metrics.total > 0
      ? ((metrics.sifCount / metrics.total) * 100).toFixed(1)
      : '0.0';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 py-24 max-w-6xl mx-auto px-6 text-left"
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-xl border border-white/80 rounded-full px-4 py-1.5 shadow-sm">
          <span className="material-symbols-outlined text-[#FF5E3A] text-sm">
            monitoring
          </span>
          <span className="font-body-md text-xs font-semibold text-slate-800">
            Safety Telemetry Dashboard
          </span>
        </div>

        <h1 className="font-display-xl text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Executive Safety Analytics & Risk Trends
        </h1>

        <p className="text-base text-slate-600 max-w-2xl">
          Aggregated safety observations, SIF precursor metrics, and hazard domain breakdowns computed strictly from prediction history logs.
        </p>
      </div>

      {/* Main Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Reports"
          value={metrics.total}
          subtitle="Processed through DistilBERT"
          color="blue"
        />

        <StatCard
          title="High Risk SIF Reports"
          value={metrics.sifCount}
          subtitle={`${highRiskRate}% Precursor Ratio`}
          color="red"
        />

        <StatCard
          title="Low Risk Reports"
          value={metrics.nonSifCount}
          subtitle="Routine Observations"
          color="green"
        />

        <StatCard
          title="Avg Confidence Score"
          value={metrics.avgConfidence}
          subtitle="DistilBERT NLP Model"
          color="teal"
          suffix="%"
        />
      </div>

      {/* Live History Highlights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white/70 border border-white/90 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span className="material-symbols-outlined text-[#FF5E3A] text-base">category</span>
            <span>Most Common Hazard</span>
          </div>
          <p className="font-extrabold text-lg text-slate-900 truncate">
            {metrics.mostCommonHazard}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/70 border border-white/90 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span className="material-symbols-outlined text-emerald-600 text-base">verified</span>
            <span>Highest Confidence</span>
          </div>
          <p className="font-extrabold text-lg text-slate-900 truncate">
            {metrics.highestConfidencePred ? `${metrics.highestConfidencePred.confidence.toFixed(1)}% (${metrics.highestConfidencePred.prediction})` : 'N/A'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/70 border border-white/90 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span className="material-symbols-outlined text-blue-600 text-base">schedule</span>
            <span>Latest Prediction</span>
          </div>
          <p className="font-extrabold text-lg text-slate-900 truncate">
            {metrics.latestPred ? `${metrics.latestPred.prediction} (${metrics.latestPred.confidence.toFixed(1)}%)` : 'N/A'}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskDistributionChart
          sifCount={metrics.sifCount}
          nonSifCount={metrics.nonSifCount}
        />

        <IncidentTrendChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HazardCategoryChart data={metrics.categoryData} />

        {/* Confidence Distribution Chart */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.03)] space-y-4 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-600 border border-teal-200">
                <span className="material-symbols-outlined text-base">equalizer</span>
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-slate-900">
                  Confidence Distribution
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Model probability spread across predictions
                </p>
              </div>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.confidenceBuckets} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} stroke="#64748b" />
                <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    borderRadius: '0.75rem',
                    color: '#0f172a',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar dataKey="count" name="Prediction Count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Trend Cards Section */}
      <div className="space-y-4 pt-4">
        <h2 className="font-display-xl text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#FF5E3A]">
            query_stats
          </span>
          <span>Trend Summary Cards</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-white/70 border border-white/90 shadow-sm space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Predictions</span>
            <p className="font-extrabold text-2xl text-slate-900">{metrics.todayPredictions}</p>
            <p className="text-[11px] text-slate-500 font-medium">Logged during present shift</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/70 border border-white/90 shadow-sm space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">High Risk %</span>
            <p className="font-extrabold text-2xl text-red-600">{highRiskRate}%</p>
            <p className="text-[11px] text-slate-500 font-medium">SIF precursor percentage</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/70 border border-white/90 shadow-sm space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Average Confidence</span>
            <p className="font-extrabold text-2xl text-emerald-600">{metrics.avgConfidence}%</p>
            <p className="text-[11px] text-slate-500 font-medium">Model precision baseline</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/70 border border-white/90 shadow-sm space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Analyses</span>
            <p className="font-extrabold text-2xl text-slate-900">{metrics.total}</p>
            <p className="text-[11px] text-slate-500 font-medium">All historical observations</p>
          </div>
        </div>
      </div>

      {/* Operational Risk Breakdown */}
      <div className="space-y-4 pt-4">
        <h2 className="font-display-xl text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#FF5E3A]">
            warning
          </span>
          <span>Operational Risk Intelligence Breakdown</span>
        </h2>

        <AnalyticsWidgets />
      </div>
    </motion.div>
  );
};

export default AnalyticsPage;