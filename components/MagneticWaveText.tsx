import React from 'react';
import { motion, Variants } from 'framer-motion';
import Magnetic from './Magnetic';

interface MagneticWaveTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const MagneticWaveText: React.FC<MagneticWaveTextProps> = ({ text, className = "", delay = 0 }) => {
  const words = text.split(" ");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.05, 
        delayChildren: delay 
      },
    },
  };

  const child: Variants = {
    hidden: { 
        y: '100%', 
        opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200, // Faster
      },
    },
  };

  return (
    <Magnetic strength={50} className="inline-block">
        <motion.div
            className={`inline-block overflow-hidden ${className}`}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
        >
        {words.map((word, index) => (
            <motion.span
            key={index}
            variants={child}
            className="inline-block mr-[0.25em] cursor-pointer"
            whileHover={{
                scale: 1.1,
                color: "#555",
                transition: { duration: 0.2 }
            }}
            >
            {word}
            </motion.span>
        ))}
        </motion.div>
    </Magnetic>
  );
};

export default MagneticWaveText;