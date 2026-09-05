import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const MouseGlow = () => {
  const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-96 h-96 rounded-full bg-blue-500/5 dark:bg-blue-400/10 blur-[100px] pointer-events-none z-10 transition-transform duration-75 ease-out"
      style={{
        transform: `translate3d(${mousePosition.x - 192}px, ${mousePosition.y - 192}px, 0)`,
      }}
    />
  );
};

export default MouseGlow;
