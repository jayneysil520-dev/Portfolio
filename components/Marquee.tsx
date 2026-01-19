import React from 'react';
import { motion } from 'framer-motion';
import Magnetic from './Magnetic';

interface MarqueeProps {
  text: string;
  direction?: 'left' | 'right';
  className?: string;
  speed?: number;
}

const Marquee: React.FC<MarqueeProps> = ({ text, direction = 'left', className = "", speed = 20 }) => {
  return (
    <div className={`w-full overflow-hidden flex relative z-10 ${className}`}>
      <motion.div 
        className="flex whitespace-nowrap"
        animate={{ x: direction === 'left' ? "-50%" : "0%" }}
        initial={{ x: direction === 'left' ? "0%" : "-50%" }}
        transition={{ 
            duration: speed, 
            repeat: Infinity, 
            ease: "linear" 
        }}
      >
        {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center mx-8">
                <Magnetic strength={20}>
                    <span className="text-8xl md:text-[10rem] font-albert-black text-black tracking-tighter opacity-10 hover:opacity-100 transition-opacity duration-300 cursor-default">
                        {text} <span className="mx-4">•</span>
                    </span>
                </Magnetic>
            </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;