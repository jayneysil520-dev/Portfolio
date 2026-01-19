import React from 'react';
import { motion, Variants } from 'framer-motion';

interface WaveTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const WaveText: React.FC<WaveTextProps> = ({ text, className = "", delay = 0 }) => {
  // Split by spaces to animate word by word, or chars if needed. 
  // Here we treat it as a block of text split by characters for the wave effect if desired, 
  // but splitting by words is often cleaner for large titles. 
  // Let's go with characters for a true "Wave".
  const characters = Array.from(text);

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.03, 
        delayChildren: delay 
      },
    },
  };

  const child: Variants = {
    hidden: { 
        y: "100%", 
        opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        damping: 12,
        stiffness: 200
      },
    },
  };

  return (
    <motion.div
      className={`overflow-hidden flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
    >
      {characters.map((char, index) => (
        <motion.span
            key={index}
            variants={child}
            className="inline-block"
        >
            {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default WaveText;