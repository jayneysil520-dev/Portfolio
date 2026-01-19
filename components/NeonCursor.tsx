import React, { useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const NeonCursor: React.FC = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 20, stiffness: 150 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16); 
      cursorY.set(e.clientY - 16);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference"
    >
      {/* Black sphere with glow, adjusted for light/dark mode compatibility via mix-blend-difference */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="w-full h-full rounded-full border-2 border-white bg-white/20 backdrop-invert backdrop-blur-sm relative"
      >
      </motion.div>
    </motion.div>
  );
};

export default NeonCursor;