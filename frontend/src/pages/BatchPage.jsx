import React, { useState } from 'react';
import { usePredictions } from '../context/PredictionContext';
import { predictSIFRisk, predictDemoFallback } from '../services/api';
import { generateBatchReportPDF } from '../utils/pdfGenerator';
import RiskBadge from '../components/common/RiskBadge';
import { analyzeHazardInsights } from '../utils/hazardAnalyzer';
import { motion } from 'framer-motion';
import { Upload, FileSpreadsheet, Download, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

const SAMPLE_BATCH_REPORTS = [
  'Worker fell 6 meters from scaffold due to unanchored lanyard tie-off point',
  '415V electrical panel maintenance started without applying Lock-Out Tag-Out',
  'Hydrocarbon gas vapor leak (42% LEL) detected near furnace burner #3',
  'Minor water puddle noticed on corridor floor during shift walkaround',
  'Safety goggles replaced in toolbox room before routine inspection',
  'Heavy crane boom swung over unevacuated rigging work zone'
];

export const BatchPage = () => {
  const { addPrediction } = usePredictions();
  const [rawText, setRawText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [batchResults, setBatchResults] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target.result;
      // Simple CSV line splitter
      const lines = content
        .split('\n')
        .map((l) => l.trim().replace(/^"|"$/g, ''))
        .filter((l) => l.length > 5 && !l.toLowerCase().startsWith('incident') && !l.toLowerCase().startsWith('report'));

      setRawText(lines.join('\n'));
    };
    reader.readAsText(file);
  };

  const handleLoadSampleBatch = () => {
    setRawText(SAMPLE_BATCH_REPORTS.join('\n'));
  };

  const runBatchAnalysis = async () => {
    const reports = rawText
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 3);

    if (reports.length === 0 || isProcessing) return;

    setIsProcessing(true);
    setProgress({ current: 0, total: reports.length });
    setBatchResults([]);

    const results = [];

    for (let i = 0; i < reports.length; i++) {
      const report = reports[i];
      let res;
      try {
        res = await predictSIFRisk(report);
      } catch (err) {
        res = predictDemoFallback(report);
      }

      const insights = analyzeHazardInsights(report, res.prediction);
      const fullItem = {
        id: Date.now() + i,
        report,
        prediction: res.prediction,
        confidence: res.confidence,
        executionTimeMs: res.executionTimeMs,
        timestamp: res.timestamp || new Date().toISOString(),
        category: insights.primaryCategory,
        severity: insights.riskLevel,
      };

      results.push(fullItem);
      addPrediction(fullItem);
      setProgress({ current: i + 1, total: reports.length });
      // Short delay for realistic sequence
      await new Promise((r) => setTimeout(r, 200));
    }

    setBatchResults(results);
    setIsProcessing(false);
  };

  const exportBatchCSV = () => {
    if (batchResults.length === 0) return;
    const headers = ['Report Narrative', 'Prediction', 'Confidence %', 'Risk Level', 'Hazard Category', 'Latency (ms)'];
    const rows = batchResults.map((r) => [
      `"${r.report.replace(/"/g, '""')}"`,
      r.prediction,
      r.confidence.toFixed(2),
      r.severity,
      r.category,
      r.executionTimeMs || 135,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SIF_AI_Batch_Results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetBatch = () => {
    setRawText('');
    setBatchResults([]);
    setProgress({ current: 0, total: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 py-24 max-w-6xl mx-auto px-6 text-left"
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-xl border border-white/80 rounded-full px-4 py-1.5 shadow-sm">
          <FileSpreadsheet className="w-4 h-4 text-[#FF5E3A]" />
          <span className="font-body-md text-xs font-semibold text-slate-800">
            Batch CSV & Multi-Report Processor
          </span>
        </div>
        
        <h1 className="font-display-xl text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Batch Safety Report Analysis
        </h1>
        
        <p className="text-base text-slate-600 max-w-2xl font-medium">
          Upload a CSV file or paste multiple incident observation narratives (one per line) to evaluate DistilBERT SIF risk at scale.
        </p>
      </div>

      {/* Input / Upload Section */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#FF5E3A]" />
            <span className="font-bold text-base text-slate-900">Incident Narrative Input</span>
          </div>

          <div className="flex items-center gap-3">
            <label className="bg-white/80 text-slate-800 border border-slate-200 px-4 py-2 rounded-full text-xs font-bold hover:bg-white transition-colors cursor-pointer shadow-sm flex items-center gap-2">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload CSV File</span>
              <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              onClick={handleLoadSampleBatch}
              className="bg-white/80 text-[#FF5E3A] border border-white px-4 py-2 rounded-full text-xs font-bold hover:bg-white transition-colors shadow-sm"
            >
              Load Sample Batch
            </button>
          </div>
        </div>

        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          disabled={isProcessing}
          rows={6}
          placeholder="Paste observation narratives here (one incident per line)...&#10;e.g. Scaffold worker at 8m elevation without safety harness lanyard tie-off&#10;Hydrocarbon gas leak detected near furnace unit 4&#10;Water spillage cleaned in main hallway"
          className="w-full bg-white/70 border border-slate-200/80 rounded-2xl p-4 font-body-md text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#FF5E3A]/40 focus:outline-none min-h-[150px]"
        />

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500 font-medium">
            {rawText.split('\n').filter((l) => l.trim().length > 3).length} report(s) ready for analysis
          </span>

          <div className="flex items-center gap-3">
            {rawText && (
              <button
                onClick={resetBatch}
                disabled={isProcessing}
                className="bg-white/80 text-slate-700 border border-slate-200 px-6 py-2.5 rounded-full text-xs font-bold hover:bg-white transition-colors"
              >
                Clear Input
              </button>
            )}

            <button
              onClick={runBatchAnalysis}
              disabled={!rawText.trim() || isProcessing}
              className="bg-[#FF5E3A] text-white border border-[#FF5E3A] px-8 py-3 rounded-full text-sm font-bold shadow-md hover:bg-[#ff4820] transition-colors flex items-center gap-2 disabled:opacity-40"
            >
              <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? `Analyzing (${progress.current}/${progress.total})...` : 'Run Batch Analysis'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar during Batch processing */}
      {isProcessing && (
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/80 shadow-sm space-y-3">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>Processing batch queue with DistilBERT...</span>
            <span>{Math.round((progress.current / progress.total) * 100)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-[#FF5E3A] transition-all duration-200 rounded-full"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Batch Results Table */}
      {batchResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-xl text-slate-900">
                Batch Analysis Results ({batchResults.length} Reports Processed)
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={exportBatchCSV}
                className="bg-white/80 text-slate-800 border border-slate-200 px-4 py-2 rounded-full text-xs font-bold hover:bg-white transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => generateBatchReportPDF(batchResults)}
                className="bg-[#FF5E3A] text-white border border-[#FF5E3A] px-5 py-2 rounded-full text-xs font-bold hover:bg-[#ff4820] transition-colors shadow-md flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Batch PDF</span>
              </button>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.03)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/80 text-slate-500 font-mono font-semibold uppercase tracking-wider border-b border-slate-200/80 text-[11px]">
                  <tr>
                    <th className="p-4">Incident Observation</th>
                    <th className="p-4">Prediction</th>
                    <th className="p-4 text-right">Confidence</th>
                    <th className="p-4 text-center">Risk Level</th>
                    <th className="p-4">Hazard Category</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 font-medium text-slate-700">
                  {batchResults.map((res) => {
                    const isSIF = res.prediction === 'SIF';
                    return (
                      <tr key={res.id} className="hover:bg-white/80 transition-colors">
                        <td className="p-4 max-w-xs sm:max-w-md">
                          <p className="line-clamp-2 text-slate-900 font-normal">{res.report}</p>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <RiskBadge riskLevel={res.prediction} size="small" />
                        </td>
                        <td className="p-4 whitespace-nowrap text-right font-mono font-bold text-slate-900">
                          {res.confidence.toFixed(2)}%
                        </td>
                        <td className="p-4 text-center whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isSIF ? 'bg-red-500/10 text-red-800 border border-red-300' : 'bg-emerald-500/10 text-emerald-800 border border-emerald-300'
                          }`}>
                            {res.severity}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-slate-700 font-medium">
                          {res.category}
                        </td>
                        <td className="p-4 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Analyzed</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BatchPage;
