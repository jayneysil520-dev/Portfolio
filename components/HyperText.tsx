import React from 'react';
import { motion, Variants } from 'framer-motion';

interface HyperTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const HyperText: React.FC<HyperTextProps> = ({ 
    text, 
    className = "",
    delay = 0
}) => {
  // Split text into characters/words. For smoother non-chaotic feel, we animate words or characters gently.
  const characters = Array.from(text);

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.02, 
        delayChildren: delay 
      },
    },
  };

  const child: Variants = {
    hidden: { 
        filter: "blur(10px)", 
        opacity: 0, 
        y: 10 
    },
    visible: {
      filter: "blur(0px)",
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.2, 0.65, 0.3, 0.9], 
      },
    },
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
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
    </motion.span>
  );
};

export default HyperText;