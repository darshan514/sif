import React, { useRef, useEffect } from 'react';
import PresetSelector from './PresetSelector';

export const PredictionForm = ({
  title,
  setTitle,
  location,
  setLocation,
  reportText,
  setReportText,
  onPredict,
  isLoading,
  onClear,
}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (reportText.trim() && !isLoading) {
        onPredict();
      }
    }
  };

  return (
    <div className="w-full bg-white/60 rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.03)] p-6 mb-8 backdrop-blur-xl space-y-5 text-left">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#FF5E3A]">edit_note</span>
          <span className="font-extrabold text-base text-slate-900">
            Safety Incident Observation & Risk Prediction
          </span>
        </div>
        {(title || location || reportText) && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold text-slate-500 hover:text-red-500 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
            <span>Clear Form</span>
          </button>
        )}
      </div>

      {/* Title & Location Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
        <div className="space-y-1">
          <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
            Incident Title / Subject
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            placeholder="e.g. Unanchored Harness at Elevation Scaffold"
            className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5E3A]/40 font-medium"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
            Plant Location / Unit
          </label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={isLoading}
            placeholder="e.g. Distillation Unit 4 - Pipe Rack B"
            className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5E3A]/40 font-medium"
          />
        </div>
      </div>

      {/* Observation Narrative */}
      <div className="space-y-1 text-xs font-medium">
        <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
          Observation Description Narrative
        </label>
        <textarea
          ref={textareaRef}
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={4}
          placeholder="Describe the unsafe condition, observed hazards, machinery involved, and missing controls... (e.g. Worker climbed scaffold at 8 meters elevation without securing safety harness lanyard)"
          className="w-full p-4 rounded-xl bg-white/80 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5E3A]/40 text-sm leading-relaxed"
        />
      </div>

      <PresetSelector onSelect={(sampleText) => setReportText(sampleText)} />

      {/* Footer Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200/60">
        <span className="text-xs font-medium text-slate-500">
          Press <kbd className="px-2 py-1 bg-white border rounded font-mono shadow-sm">Ctrl + Enter</kbd> to analyze and submit report
        </span>

        <div className="flex items-center gap-3">
          {(title || location || reportText) && (
            <button
              type="button"
              onClick={onClear}
              disabled={isLoading}
              className="bg-white/60 text-slate-800 border border-white/80 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-white transition-colors"
            >
              Clear
            </button>
          )}

          <button
            type="button"
            onClick={onPredict}
            disabled={!reportText.trim() || isLoading}
            className="bg-[#FF5E3A] text-white border border-[#FF5E3A] shadow-md px-8 py-3 rounded-full text-sm font-bold hover:bg-[#ff4820] transition-colors scale-95 active:scale-90 flex items-center gap-2 disabled:opacity-50"
          >
            <span>{isLoading ? 'Analyzing & Submitting...' : 'Analyze & Submit Report'}</span>
            <span className="material-symbols-outlined text-sm">
              {isLoading ? 'hourglass_top' : 'send'}
            </span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default PredictionForm;
