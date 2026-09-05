import React, { useState } from 'react';
import { analyzeHazardInsights } from '../../utils/hazardAnalyzer';
import { generateIncidentReportPDF } from '../../utils/pdfGenerator';
import { motion } from 'framer-motion';

const PPE_ICONS = {
  'Safety Helmet': 'hardware',
  'Helmet': 'hardware',
  'Full Body Harness': 'shield',
  'Harness': 'shield',
  'Safety Shoes': 'hiking',
  'Double Lanyard': 'link',
  'Gas Detector': 'sensors',
  'Respirator': 'masks',
  'Arc Flash Suit': 'dry_cleaning',
  'Electrical Gloves': 'back_hand',
  'Gloves': 'back_hand',
  'High Visibility Vest': 'vest',
  'Flame Resistant Clothing': 'dry_cleaning'
};

export const AIInsightsCard = ({ result, reportText, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  if (!result) return null;

  const insights = analyzeHazardInsights(reportText, result.prediction);
  const isSIF = result.prediction === 'SIF';
  const confidence = result.confidence || 0;

  const handleDownloadPDF = () => {
    setPdfGenerating(true);
    setTimeout(() => {
      generateIncidentReportPDF(reportText, result);
      setPdfGenerating(false);
    }, 400);
  };

  const handleCopy = () => {
    const textToCopy = `[SIF AI Incident Assessment]\nPrediction: ${result.prediction}\nConfidence: ${confidence.toFixed(2)}%\nRisk Level: ${insights.riskLevel}\nHazard Category: ${insights.primaryCategory}\nLife Saving Rule: ${insights.lifeSavingRule}\nAI Explanation: ${insights.explanation}\nKeywords: ${insights.uniqueKeywords.join(', ')}\nRecommended PPE: ${insights.recommendedPPE.join(', ')}\nImmediate Actions: ${insights.recommendedActions.join('; ')}\nNarrative: "${reportText}"`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white/70 rounded-3xl border border-white/90 shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-8 backdrop-blur-xl space-y-8 text-left"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FF5E3A]/10 text-[#FF5E3A] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">auto_awesome</span>
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">
              AI Incident Risk Assessment
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Enterprise DistilBERT Intelligence Output
            </p>
          </div>
        </div>

        <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold border uppercase tracking-wider ${
          isSIF ? 'bg-red-500/10 text-red-700 border-red-300' : 'bg-emerald-500/10 text-emerald-700 border-emerald-300'
        }`}>
          {isSIF ? 'High SIF Risk' : 'Low SIF Risk'}
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/60 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Risk Level</span>
          <p className={`font-extrabold text-base ${isSIF ? 'text-red-600' : 'text-emerald-600'}`}>
            {insights.riskLevel} Risk
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/60 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Hazard Category</span>
          <p className="font-extrabold text-base text-slate-900 truncate">
            {insights.primaryCategory}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/60 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Life Saving Rule</span>
          <p className="font-extrabold text-base text-slate-900 truncate">
            {insights.lifeSavingRule}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/60 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Confidence</span>
          <p className="font-extrabold text-base text-slate-900">
            {confidence.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* AI Explanation */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          AI Contextual Explanation
        </span>
        <p className="p-5 rounded-2xl bg-slate-900 text-white text-sm leading-relaxed font-medium shadow-md border border-slate-800">
          {insights.explanation}
        </p>
      </div>

      {/* Hazard Keywords */}
      {insights.uniqueKeywords.length > 0 && (
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Detected Precursor Keywords
          </span>
          <div className="flex flex-wrap gap-2">
            {insights.uniqueKeywords.map((word, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold border bg-amber-500/10 text-amber-900 border-amber-300 flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-sm text-amber-600">label</span>
                <span>{word}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommended PPE */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Required Personal Protective Equipment (PPE)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {insights.recommendedPPE.map((item, idx) => {
            const iconName = PPE_ICONS[item] || 'verified_user';
            return (
              <div key={idx} className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 flex items-center gap-3 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">{iconName}</span>
                </div>
                <span className="text-xs font-bold text-slate-800">{item}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Immediate Actions Checklist */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Immediate Required Safety Actions
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {insights.recommendedActions.map((action, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-200 flex items-center gap-3 text-emerald-950 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                ✓
              </div>
              <span className="text-xs font-bold">{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Possible Consequences */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Potential Risk Consequences
        </span>
        <div className="flex flex-wrap gap-2">
          {insights.possibleConsequences.map((item, idx) => (
            <span
              key={idx}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                isSIF ? 'bg-red-500/10 text-red-800 border-red-300' : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{isSIF ? 'warning' : 'info'}</span>
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-200/60 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={pdfGenerating}
            className="px-6 py-3 rounded-full text-xs font-extrabold text-white bg-[#FF5E3A] hover:bg-[#e04f2e] transition-all shadow-md flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">picture_as_pdf</span>
            <span>{pdfGenerating ? 'Generating PDF...' : 'Download PDF Report'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="px-5 py-3 rounded-full text-xs font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">{copied ? 'check' : 'content_copy'}</span>
            <span>{copied ? 'Report Copied!' : 'Copy Summary'}</span>
          </button>
        </div>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="px-5 py-3 rounded-full text-xs font-bold text-slate-600 bg-transparent hover:bg-slate-200/60 transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">restart_alt</span>
            <span>Analyze Another Report</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default AIInsightsCard;

