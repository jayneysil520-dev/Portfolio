import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

interface Spotlight3DProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
  onClick?: () => void;
  disableTilt?: boolean;
  spotlightColor?: string;
  enableElasticScale?: boolean;
}

const Spotlight3D: React.FC<Spotlight3DProps> = ({ 
  children, 
  color = '#000000', 
  className = "", 
  onClick,
  disableTilt = false,
  spotlightColor = "rgba(255,255,255,0.6)",
  enableElasticScale = false
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // PERFORMANCE FIX: Use MotionValues instead of State
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for tilt
  const springConfig = { stiffness: 150, damping: 20 };
  const mouseXSpring = useSpring(0, springConfig);
  const mouseYSpring = useSpring(0, springConfig);

  // Map springs to rotation
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  // Create dynamic gradient string without re-rendering component
  const maskImage = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, black, transparent)`;
  const gradientBg = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 40%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    // Directly set values (No React Re-render)
    mouseX.set(currentX);
    mouseY.set(currentY);
    
    // Calculate tilt percentage
    const xPct = currentX / rect.width - 0.5;
    const yPct = currentY / rect.height - 0.5;
    
    mouseXSpring.set(xPct);
    mouseYSpring.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseXSpring.set(0);
    mouseYSpring.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={enableElasticScale ? { scale: 1.05 } : undefined} // Reduced scale for smoother feel
      style={{
        rotateX: disableTilt ? 0 : rotateX,
        rotateY: disableTilt ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative group perspective-1000 transform-gpu will-change-transform ${className}`}
    >
        {/* Optimized Shadow: Use opacity transition instead of render */}
        <div 
            className="absolute inset-4 rounded-[inherit] blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 -z-20 pointer-events-none"
            style={{ 
                backgroundColor: color, 
                transform: 'translateZ(-30px)' 
            }}
        />

        {/* Content */}
        <div className="relative w-full h-full rounded-[inherit] overflow-hidden bg-inherit transform-style-3d z-10">
             {/* Optimized Spotlight using MotionTemplate */}
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-30 mix-blend-overlay"
                style={{ background: gradientBg }}
            />
            {children}
        </div>
    </motion.div>
  );
};

export default Spotlight3D;