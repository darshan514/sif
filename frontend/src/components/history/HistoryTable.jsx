import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Eye,
  X,
  FileText,
  CheckCircle2
} from 'lucide-react';
import RiskBadge from '../common/RiskBadge';
import { formatDate } from '../../utils/formatters';
import { generateBatchReportPDF } from '../../utils/pdfGenerator';
import { usePredictions } from '../../context/PredictionContext';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

export const HistoryTable = ({ history = [], onDelete, onClearAll }) => {
  const { updateReportStatus } = usePredictions();
  const { isSafetyOfficer } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);

  const itemsPerPage = 6;

  const filteredHistory = useMemo(() => {
    return history
      .filter((item) => {
        const matchesSearch =
          (item.report || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.reporterName || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRisk = filterRisk === 'ALL' || item.prediction === filterRisk;
        const matchesReview = filterStatus === 'ALL' || (item.reviewStatus || 'Submitted') === filterStatus;
        return matchesSearch && matchesRisk && matchesReview;
      })
      .sort((a, b) => {
        if (sortBy === 'NEWEST') return new Date(b.timestamp) - new Date(a.timestamp);
        if (sortBy === 'OLDEST') return new Date(a.timestamp) - new Date(b.timestamp);
        if (sortBy === 'HIGHEST_CONF') return b.confidence - a.confidence;
        if (sortBy === 'LOWEST_CONF') return a.confidence - b.confidence;
        return 0;
      });
  }, [history, searchTerm, filterRisk, filterStatus, sortBy]);

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredHistory.slice(start, start + itemsPerPage);
  }, [filteredHistory, currentPage]);

  const exportCSV = () => {
    if (history.length === 0) return;
    const headers = ['ID', 'Title', 'Timestamp', 'Reporter', 'Department', 'Narrative', 'Prediction', 'Confidence %', 'Review Status'];
    const rows = history.map(item => [
      item.id,
      `"${(item.title || '').replace(/"/g, '""')}"`,
      item.timestamp,
      `"${(item.reporterName || '').replace(/"/g, '""')}"`,
      `"${(item.department || '').replace(/"/g, '""')}"`,
      `"${(item.report || '').replace(/"/g, '""')}"`,
      item.prediction,
      item.confidence,
      item.reviewStatus || 'Submitted'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SIF_AI_Predictions_Export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    if (filteredHistory.length === 0) return;
    generateBatchReportPDF(filteredHistory);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Submitted': return 'bg-blue-500/10 text-blue-800 border-blue-300';
      case 'Under Review': return 'bg-amber-500/10 text-amber-800 border-amber-300';
      case 'Action In Progress': return 'bg-purple-500/10 text-purple-800 border-purple-300';
      case 'Resolved': return 'bg-emerald-500/10 text-emerald-800 border-emerald-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Controls Bar */}
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.02)] flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search title, reporter, or report narrative..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white/80 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5E3A]/40 font-medium"
          />
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
          
          {/* Risk Filter Pills */}
          <div className="flex items-center space-x-1 bg-white/80 p-1 rounded-xl border border-slate-200 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <button
              onClick={() => { setFilterRisk('ALL'); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${filterRisk === 'ALL' ? 'bg-[#FF5E3A] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All ({history.length})
            </button>
            <button
              onClick={() => { setFilterRisk('SIF'); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${filterRisk === 'SIF' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              SIF Risk
            </button>
            <button
              onClick={() => { setFilterRisk('Non-SIF'); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${filterRisk === 'Non-SIF' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Non-SIF
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 rounded-xl text-xs bg-white/80 border border-slate-200 text-slate-700 focus:outline-none font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Action In Progress">Action In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-white/80 border border-slate-200 text-slate-700 focus:outline-none font-medium"
          >
            <option value="NEWEST">Newest First</option>
            <option value="OLDEST">Oldest First</option>
            <option value="HIGHEST_CONF">Highest Confidence</option>
            <option value="LOWEST_CONF">Lowest Confidence</option>
          </select>

          {/* Export CSV Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportCSV}
            disabled={history.length === 0}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FF5E3A] hover:bg-[#ff4820] text-white flex items-center space-x-1.5 shadow-sm disabled:opacity-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </motion.button>

          {/* Export PDF Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportPDF}
            disabled={history.length === 0}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center space-x-1.5 shadow-sm disabled:opacity-50 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export PDF</span>
          </motion.button>
        </div>

      </div>

      {/* Main Table */}
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/80 text-slate-500 font-mono font-semibold uppercase tracking-wider border-b border-slate-200/80 text-[11px]">
              <tr>
                <th className="p-4">Report ID</th>
                <th className="p-4">Observation Title & Reporter</th>
                <th className="p-4">AI Prediction</th>
                <th className="p-4 text-right">Confidence</th>
                <th className="p-4 text-center">Review Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 font-medium text-slate-700">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item) => {
                  const isSIF = item.prediction === 'SIF';
                  return (
                    <tr key={item.id} className="hover:bg-white/80 transition-colors">
                      <td className="p-4 whitespace-nowrap text-slate-900 font-mono font-bold text-[11px]">
                        {item.id}
                        <p className="text-[10px] text-slate-400 font-normal">{formatDate(item.timestamp)}</p>
                      </td>
                      <td className="p-4 max-w-xs sm:max-w-md">
                        <p className="font-bold text-slate-900 line-clamp-1">{item.title || 'Safety Incident Observation'}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{item.report}</p>
                        <p className="text-[10px] text-[#FF5E3A] font-medium mt-0.5">By: {item.reporterName || 'Field Observer'} ({item.department || 'Operations'})</p>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <RiskBadge riskLevel={item.prediction} size="small" />
                      </td>
                      <td className="p-4 whitespace-nowrap text-right font-mono font-bold text-slate-900">
                        {(item.confidence || 0).toFixed(1)}%
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        {isSafetyOfficer ? (
                          <select
                            value={item.reviewStatus || 'Submitted'}
                            onChange={(e) => updateReportStatus(item.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border focus:outline-none cursor-pointer ${getStatusStyle(item.reviewStatus || 'Submitted')}`}
                          >
                            <option value="Submitted">Submitted</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Action In Progress">Action In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getStatusStyle(item.reviewStatus || 'Submitted')}`}>
                            {item.reviewStatus || 'Submitted'}
                          </span>
                        )}
                      </td>
                      <td className="p-4 whitespace-nowrap text-right space-x-1">
                        <button
                          onClick={() => setSelectedReport(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#FF5E3A] hover:bg-white transition-colors"
                          title="View Full Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No prediction history records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span className="font-mono">
            Showing {filteredHistory.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredHistory.length)} of {filteredHistory.length}
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-800 font-mono">
              Page {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail View Drawer */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white/90 backdrop-blur-2xl rounded-2xl max-w-lg w-full p-6 border border-white space-y-4 relative shadow-2xl text-left">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <RiskBadge riskLevel={selectedReport.prediction} size="medium" />
              <span className="text-xs text-slate-400 font-mono">{formatDate(selectedReport.timestamp)}</span>
            </div>

            <div className="space-y-1">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">Incident Narrative</h4>
              <div className="p-4 rounded-xl bg-white/80 border border-slate-200 text-sm leading-relaxed text-slate-800 font-medium">
                "{selectedReport.report}"
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/80 border border-slate-200">
                <span className="text-slate-400">Confidence Score</span>
                <p className="text-lg font-bold text-slate-900">{selectedReport.confidence.toFixed(2)}%</p>
              </div>
              <div className="p-3 rounded-xl bg-white/80 border border-slate-200">
                <span className="text-slate-400">Latency</span>
                <p className="text-lg font-bold text-slate-900">{selectedReport.executionTimeMs || 135} ms</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-5 py-2.5 bg-[#FF5E3A] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#ff4820] transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HistoryTable;
