import React, { useEffect, useState } from 'react';
import { Cpu, Sparkles, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

const STEPS = [
  'Reading incident narrative...',
  'Tokenizing sequence (max_length=128)...',
  'Computing multi-head self-attention vectors...',
  'Evaluating DistilBERT classification head...',
  'Finalizing SIF confidence score...'
];

export const LoadingSpinner = ({ label = 'Running Safety Intelligence Classifier...' }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
      
      {/* Central Pulsing Shimmer */}
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-[#FF5E3A]/10 border border-[#FF5E3A]/30 flex items-center justify-center shadow-lg shadow-[#FF5E3A]/10">
          <Cpu className="w-8 h-8 text-[#FF5E3A] animate-pulse" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#d6ed7a] animate-ping opacity-75" />
      </div>

      {/* Main Status Text */}
      <div className="space-y-1">
        <h4 className="text-base font-bold font-heading text-slate-900 flex items-center justify-center space-x-2">
          <span>{label}</span>
          <Sparkles className="w-4 h-4 text-[#FF5E3A] animate-bounce" />
        </h4>
        
        {/* Terminal Line Step */}
        <div className="flex items-center justify-center space-x-2 text-xs font-mono text-slate-600 font-medium">
          <Terminal className="w-3.5 h-3.5 text-slate-500" />
          <span>{STEPS[currentStepIndex]}</span>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="w-48 h-1.5 rounded-full bg-slate-200 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#FF5E3A] to-[#C084FC] rounded-full"
          initial={{ width: '10%' }}
          animate={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

    </div>
  );
};

export default LoadingSpinner;
