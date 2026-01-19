import React, { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent, useMotionValue, useMotionTemplate } from 'framer-motion';
import Magnetic from './Magnetic';
import VinylLogo from './VinylLogo';

// Optimized Spotlight Link
const SpotlightLink: React.FC<{ text: string; href: string; onClick?: (e: React.MouseEvent) => void }> = ({ text, href, onClick }) => {
    const ref = useRef<HTMLAnchorElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    // Create gradient string directly
    const gradientBg = useMotionTemplate`radial-gradient(100px circle at ${mouseX}px ${mouseY}px, rgba(0,0,0,0.05), transparent 40%)`;

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    return (
        <Magnetic>
            <motion.a
                ref={ref}
                href={href}
                onClick={onClick}
                onMouseMove={handleMouseMove}
                className="relative px-4 py-2 text-xs font-bold tracking-widest cursor-pointer block group overflow-hidden rounded-lg text-black"
                whileHover={{ opacity: 1 }}
            >
                {/* Spotlight Gradient Background - Zero React Renders */}
                <motion.div 
                    className="pointer-events-none absolute -inset-px transition duration-300 opacity-0 group-hover:opacity-100"
                    style={{ background: gradientBg }}
                />
                {/* 
                   FIX: Removed HyperText component here.
                   HyperText relies on viewport detection which can fail for fixed elements, causing text to stay invisible (opacity: 0).
                   Using standard span ensures text is always visible.
                */}
                <span className="relative z-10 block">{text}</span>
            </motion.a>
        </Magnetic>
    );
};

const Navbar: React.FC = () => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  // Debounced scroll update or simple threshold check is fine
  useMotionValueEvent(scrollY, "change", (latest) => {
    const shouldBeScrolled = latest > 100;
    if (isScrolled !== shouldBeScrolled) {
        setIsScrolled(shouldBeScrolled);
    }
  });

  const navLinks = [
      { name: "ABOUT ME", id: "#experience" },
      { name: "CAPABILITIES", id: "#capabilities" },
      { name: "PROJECTS", id: "#projects-deck" }
  ];

  const handleScroll = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center transition-all duration-500 pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ 
        backgroundColor: isScrolled ? "rgba(255,255,255,0.01)" : "transparent",
      }}
    >
      <div 
        className="absolute inset-0 z-[-1] transition-all duration-500 pointer-events-none"
        style={{
            opacity: isScrolled ? 0.2 : 1,
            backdropFilter: isScrolled ? "blur(8px)" : "blur(0px)",
        }}
      />

      <div 
        className="w-full flex justify-between items-center transition-all duration-500 pointer-events-auto"
        style={{ opacity: isScrolled ? 0.2 : 1 }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
        onMouseLeave={(e) => { if(isScrolled) e.currentTarget.style.opacity = "0.2"; }}
      >
          <div className="flex items-center">
             <Magnetic strength={20}>
                <VinylLogo />
             </Magnetic>
          </div>

          <div className="flex items-center space-x-4">
            {navLinks.map((link) => (
                <SpotlightLink 
                    key={link.name} 
                    text={link.name} 
                    href={link.id}
                    onClick={(e) => handleScroll(e, link.id)}
                />
            ))}

            <Magnetic>
                <motion.a
                    href="#contact"
                    onClick={(e) => handleScroll(e, "#contact")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="ml-4 px-6 py-2 text-xs font-bold tracking-widest text-black border border-black/10 rounded-full backdrop-blur-md bg-white/30 shadow-sm hover:bg-white/50 transition-all block"
                >
                    <span>CONTACT</span>
                </motion.a>
            </Magnetic>
          </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;