import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds to load
    const intervalTime = 20;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev + increment >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    const completeTimeout = setTimeout(() => {
      onComplete();
    }, duration + 500);

    return () => {
      clearInterval(timer);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  // Particle Generation
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 2 + 3,
  }));

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center overflow-hidden"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} 
    >
        {/* Background Particles */}
        <div className="absolute inset-0 pointer-events-none">
            {particles.map((p) => (
                <motion.div 
                    key={p.id}
                    className="absolute bg-gray-200 rounded-full opacity-50"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                    }}
                    animate={{
                        y: [0, -50, 0],
                        opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>

      <div className="flex flex-col items-center relative z-10">
        {/* Counter */}
        <div className="flex items-baseline mb-4">
          <span className="text-8xl font-albert-light text-black tabular-nums">
            {Math.round(count)}
          </span>
          <span className="text-4xl font-albert-semibold text-black ml-1">
            %
          </span>
        </div>

        {/* Dynamic Wave Progress Bar */}
        <div className="w-64 h-2 bg-gray-100 rounded-full overflow-hidden mb-4 relative shadow-inner">
          <motion.div 
            className="h-full bg-blue-500 relative"
            style={{ width: `${count}%` }}
          >
             {/* Wave Shine Effect */}
             <motion.div 
                className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-white/50 to-transparent"
                animate={{ x: [-20, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
             />
          </motion.div>
        </div>

        {/* Loading Text */}
        <span className="text-sm font-albert-light tracking-[0.5em] text-black animate-pulse">
            l o a d i n g
        </span>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;