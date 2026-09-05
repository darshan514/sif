import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue', suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    let start = 0;
    const duration = 1000;
    const steps = 30;
    const increment = numValue / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= numValue) {
        setDisplayValue(numValue);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  const colorStyles = {
    blue: {
      accent: 'text-[#326578]',
      chipBg: 'bg-[#bbe9ff] text-[#074457]',
    },
    red: {
      accent: 'text-[#ba1a1a]',
      chipBg: 'bg-[#ffdad6] text-[#93000a]',
    },
    green: {
      accent: 'text-[#556500]',
      chipBg: 'bg-[#d6ed7a] text-[#5a6c00]',
    },
    teal: {
      accent: 'text-[#FF5E3A]',
      chipBg: 'bg-[#ffdbd0] text-[#7f2a0d]',
    },
  };

  const style = colorStyles[color] || colorStyles.blue;
  const isFloat = typeof value === 'number' && !Number.isInteger(value);

  return (
    <motion.div
      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
      className="bg-white/60 backdrop-blur-2xl rounded-3xl p-6 border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.03)] text-left relative overflow-hidden group"
    >
      <div className="flex items-center justify-between">
        <span className="font-label-caps text-xs uppercase tracking-wider text-[#555555] font-bold">
          {title}
        </span>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${style.chipBg}`}>
          Metrics
        </span>
      </div>

      <div className="mt-4 flex items-baseline space-x-1">
        <span className="font-display-xl text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {isFloat ? displayValue.toFixed(2) : Math.round(displayValue).toLocaleString('en-IN')}
        </span>
        {suffix && (
          <span className={`text-lg font-bold ${style.accent}`}>{suffix}</span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-[#555555] font-medium">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default StatCard;
