import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: (e: React.MouseEvent) => void;
}

const Magnetic: React.FC<MagneticProps> = ({ children, className = "", strength = 30, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);

  // PERFORMANCE FIX: Direct motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth physics
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Directly update motion value
    x.set((e.clientX - centerX) / strength);
    y.set((e.clientY - centerY) / strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x: springX, y: springY }} // Bind spring directly to style
      className={`cursor-pointer will-change-transform ${className}`} 
    >
      {children}
    </motion.div>
  );
};

export default Magnetic;