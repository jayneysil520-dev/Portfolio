import React, { useRef, useState } from 'react';

interface ScrambleHoverTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const CHARS = "-_~`!@#$%^&*()+=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const ScrambleHoverText: React.FC<ScrambleHoverTextProps> = ({ text, className = "", delay = 0 }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startScramble = () => {
    setIsHovering(true);
    let iteration = 0;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setDisplayText(prev => 
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }

      iteration += 1 / 3;
    }, 30);
  };

  const stopScramble = () => {
    setIsHovering(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setDisplayText(text);
  };

  return (
    <span 
      className={`inline-block cursor-default transition-colors duration-300 ${isHovering ? 'text-black' : 'text-gray-800'} ${className}`}
      onMouseEnter={startScramble}
      onMouseLeave={stopScramble}
    >
      {displayText}
    </span>
  );
};

export default ScrambleHoverText;