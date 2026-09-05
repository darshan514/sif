import React from 'react';
import { motion } from 'framer-motion';

export const AmbientBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* Base gradient mesh */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-500" />

      {/* Floating Orb 1: Sapphire Blue (Top Left) */}
      <motion.div
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-blue-600/10 dark:bg-blue-600/20 blur-[120px]"
      />

      {/* Floating Orb 2: Teal / Cyan (Top Right) */}
      <motion.div
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 50, -30, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-40 -right-32 w-[600px] h-[600px] rounded-full bg-teal-500/10 dark:bg-teal-500/15 blur-[140px]"
      />

      {/* Floating Orb 3: Royal Indigo (Bottom Center) */}
      <motion.div
        animate={{
          x: [0, 40, -50, 0],
          y: [0, -30, 40, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-40 left-1/3 w-[650px] h-[650px] rounded-full bg-indigo-600/10 dark:bg-indigo-600/15 blur-[150px]"
      />

      {/* Subtle Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default AmbientBackground;
