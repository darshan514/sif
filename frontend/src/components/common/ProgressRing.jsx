import React from 'react';
import { motion } from 'framer-motion';

export const ProgressRing = ({ 
  percentage = 75, 
  size = 130, 
  strokeWidth = 9,
  color = 'blue',
  showLabel = true,
  labelSubtext = 'Confidence'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const strokeColors = {
    blue: 'stroke-blue-600 dark:stroke-blue-400',
    red: 'stroke-red-600 dark:stroke-red-400',
    green: 'stroke-emerald-600 dark:stroke-emerald-400',
    teal: 'stroke-teal-600 dark:stroke-teal-400',
  };

  const selectedStroke = strokeColors[color] || strokeColors.blue;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-slate-200/80 dark:stroke-slate-800/80 fill-none"
        />

        {/* Animated gradient ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          strokeLinecap="round"
          className={`fill-none ${selectedStroke}`}
        />
      </svg>

      {showLabel && (
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
            {Number(percentage).toFixed(1)}%
          </span>
          {labelSubtext && (
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
              {labelSubtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressRing;
