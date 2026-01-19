import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

interface SpotlightButtonProps {
  name: string;
  fullName: string;
  onClick?: () => void;
}

const SpotlightButton: React.FC<SpotlightButtonProps> = ({ name, fullName, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const gradientBg = useMotionTemplate`radial-gradient(150px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.4), transparent 40%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    mouseX.set(currentX);
    mouseY.set(currentY);

    x.set(currentX / rect.width - 0.5);
    y.set(currentY / rect.height - 0.5);
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
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative w-24 h-24 rounded-2xl cursor-pointer group perspective-500 will-change-transform"
    >
        {/* Dynamic Shadow Glow */}
        <div className="absolute inset-2 rounded-2xl blur-xl bg-blue-500/0 group-hover:bg-blue-500/40 transition-colors duration-500 -z-10 transform translate-z-[-20px]" />

        {/* Card Body */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex flex-col items-center justify-center overflow-hidden shadow-lg transform-style-3d">
            
            {/* Spotlight Gradient */}
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-10"
                style={{ background: gradientBg }}
            />

            <span className="text-3xl font-albert-black text-black z-20 group-hover:scale-110 transition-transform">{name}</span>
            <span className="text-[10px] font-bold text-gray-500 mt-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">{fullName}</span>
        </div>
    </motion.div>
  );
};

export default SpotlightButton;