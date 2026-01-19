import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

interface ParallaxInfoCardProps {
    title: string;
    percent: string;
    desc: string;
    color: string;
    delay?: number;
}

const ParallaxInfoCard: React.FC<ParallaxInfoCardProps> = ({ title, percent, desc, color, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

  const gradientBg = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, ${color}22, transparent 40%)`;

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
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
        }}
        className="relative mb-6 group cursor-pointer perspective-1000 will-change-transform"
    >
        {/* Dynamic Shadow */}
        <div 
            className="absolute inset-2 rounded-xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10"
            style={{ 
                backgroundColor: color, 
                transform: 'translateZ(-10px)' 
            }}
        />

        {/* Card Content */}
        <div className="relative bg-white border border-gray-100 rounded-xl p-4 overflow-hidden transform-style-3d">
             {/* Spotlight Gradient */}
             <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-10"
                style={{ background: gradientBg }}
            />
            
            <div className="flex justify-between items-end mb-2 relative z-20">
                <h3 className="text-2xl font-albert-black tracking-tight text-black group-hover:text-black/80 transition-colors">
                    {title}
                </h3>
                <span className="text-xl font-albert-black text-gray-400 group-hover:text-black transition-colors">
                    {percent}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-gray-100 mb-3 relative overflow-hidden z-20">
                <motion.div 
                    initial={{ width: 0 }} 
                    whileInView={{ width: percent }} 
                    transition={{ duration: 1.5, ease: "easeOut", delay }}
                    className="h-full rounded-full" 
                    style={{ backgroundColor: color }}
                />
            </div>

            <p className="text-xs text-gray-500 font-albert-regular leading-relaxed relative z-20">
                {desc}
            </p>
        </div>
    </motion.div>
  );
};

export default ParallaxInfoCard;