import React from 'react';
import SAMPLE_REPORTS from '../../services/sampleReports';

export const PresetSelector = ({ onSelect }) => {
  return (
    <div className="space-y-2 pt-2 text-left">
      <div className="flex items-center justify-between">
        <span className="font-label-caps text-label-caps uppercase text-slate-500 tracking-wider">
          Quick Load Scenarios
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {SAMPLE_REPORTS.map((sample) => {
          const isSIF = sample.riskLevel === 'SIF';
          return (
            <button
              key={sample.id}
              type="button"
              onClick={() => onSelect(sample.text)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border backdrop-blur-md transition-all scale-95 active:scale-90 ${
                isSIF
                  ? 'bg-red-500/10 text-red-800 border-red-300 hover:bg-red-500/20'
                  : 'bg-emerald-500/10 text-emerald-800 border-emerald-300 hover:bg-emerald-500/20'
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {isSIF ? 'warning' : 'check_circle'}
              </span>
              <span>{sample.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PresetSelector;
