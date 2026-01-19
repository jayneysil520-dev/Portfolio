import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ExperienceItem } from '../types';

interface Experience3DCardProps {
  item: ExperienceItem;
  onClick: () => void;
}

const Experience3DCard: React.FC<Experience3DCardProps> = ({ item, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);

    setPosition({ x: mouseX, y: mouseY });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative w-full cursor-pointer group h-[220px] perspective-1000 my-6"
    >
      {/* Dynamic Brand Color Shadow */}
      <div 
        className="absolute inset-4 rounded-xl blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
        style={{ backgroundColor: item.color, transform: 'translateZ(-20px)' }}
      />

      <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden text-left flex flex-col justify-between p-6">
        
        {/* Spotlight Border Effect using Mask */}
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-30 rounded-xl"
          style={{
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,.4), transparent 40%)`,
          }}
        />

        <div className="z-10 transform-gpu translate-z-10 relative">
            <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold text-white mb-1">{item.role}</h3>
                <span className="text-xs font-mono opacity-50 border border-white/20 px-2 py-1 rounded">{item.year}</span>
            </div>
            <p className="text-lg text-white/70 font-light mt-1">{item.company}</p>
        </div>

        <div className="z-10 transform-gpu translate-z-10 relative">
           <p className="text-sm text-gray-400 line-clamp-2 mb-4">{item.description}</p>
           <div className="flex gap-2">
                {item.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-white/5 text-white/50">
                        {tag}
                    </span>
                ))}
           </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Experience3DCard;