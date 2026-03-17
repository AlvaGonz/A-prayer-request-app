import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const Sparkle = ({ size, color, delay, x, y }) => (
  <m.div
    initial={{ scale: 0, opacity: 0, x, y }}
    animate={{ 
      scale: [0, 1.2, 0.8, 1],
      opacity: [0, 1, 0.8, 0],
      rotate: [0, 45, 90],
      y: y - 100 
    }}
    transition={{ 
      duration: 2,
      delay,
      ease: "easeOut"
    }}
    style={{ position: 'absolute', color }}
  >
    <Sparkles size={size} fill="currentColor" />
  </m.div>
);

const Celebration = ({ isVisible }) => {
  const sparkles = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    size: Math.random() * 20 + 10,
    color: i % 2 === 0 ? '#CA8A04' : '#7C3AED', // Gold and Purple
    delay: Math.random() * 0.5,
    x: (Math.random() - 0.5) * 200,
    y: (Math.random() - 0.5) * 50
  }));

  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', pointerEvents: 'none', zIndex: 50 }}>
      <AnimatePresence>
        {isVisible && sparkles.map(s => (
          <Sparkle key={s.id} {...s} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Celebration;
