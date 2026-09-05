import React, { useEffect } from 'react';

export const MouseTracker = () => {
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.querySelectorAll('.cursor-reactive-container').forEach((container) => {
        const el = container.querySelector('.cursor-reactive');
        if (el) {
          const rect = container.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          
          if (e.clientY >= rect.top - window.innerHeight && e.clientY <= rect.bottom + window.innerHeight) {
            el.style.setProperty('--mouse-x', `${x}%`);
            el.style.setProperty('--mouse-y', `${y}%`);
          }
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return null;
};

export default MouseTracker;
