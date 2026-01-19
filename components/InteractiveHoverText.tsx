import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface InteractiveHoverTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const InteractiveHoverText: React.FC<InteractiveHoverTextProps> = ({ text, className = "", delay = 0 }) => {
  // Split text into words to handle spacing correctly, then chars
  const words = text.split(" ");

  return (
    <motion.div
      className={`inline-block cursor-default ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: delay } }
      }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block whitespace-nowrap mr-[0.25em]">
          {word.split("").map((char, j) => (
            <RGBChar key={j} char={char} />
          ))}
        </span>
      ))}
    </motion.div>
  );
};

const RGBChar: React.FC<{ char: string }> = ({ char }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.span
      className="inline-block relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variants={{
        hidden: { y: 50, opacity: 0, rotateX: -90 },
        visible: { y: 0, opacity: 1, rotateX: 0, transition: { type: "spring", damping: 12, stiffness: 200 } }
      }}
      whileHover={{ 
        scale: 1.3, 
        y: -5,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
    >
      {/* Main Character */}
      <span className="relative z-10">{char}</span>
      
      {/* RGB Split Layers - Only visible on hover */}
      <motion.span
        className="absolute inset-0 text-red-500 opacity-0 mix-blend-screen pointer-events-none"
        animate={isHovered ? { x: -3, opacity: 0.8 } : { x: 0, opacity: 0 }}
      >
        {char}
      </motion.span>
      <motion.span
        className="absolute inset-0 text-blue-500 opacity-0 mix-blend-screen pointer-events-none"
        animate={isHovered ? { x: 3, opacity: 0.8 } : { x: 0, opacity: 0 }}
      >
        {char}
      </motion.span>
    </motion.span>
  );
};

export default InteractiveHoverText;