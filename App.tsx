import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import Profile from './sections/Profile';
import Skills from './sections/Skills';
import VinylProjects from './sections/VinylProjects';
import Contact from './sections/Contact';
import LoadingScreen from './components/LoadingScreen';
import ScrollToTop from './components/ScrollToTop';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Global Smooth Scroll Handler
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.hash && anchor.hash.startsWith('#') && anchor.origin === window.location.origin) {
        e.preventDefault();
        const elementId = anchor.hash.substring(1);
        const element = document.getElementById(elementId);
        
        if (element) {
          const offset = 80; // Navbar height offset
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className="bg-white min-h-screen text-black selection:bg-black selection:text-white relative">
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <>
          <Navbar />
          <main className="relative w-full">
            {/* 
              Z-INDEX STRATEGY:
              Increasing z-index for each section ensures the next section
              always sits conceptually "on top" of the previous one as it enters the viewport,
              preventing click-blocking or visual clipping issues.
            */}
            
            <div id="hero" className="relative z-10">
              <Hero />
            </div>
            
            <div id="experience" className="relative z-20">
                <Profile />
            </div>
            
            <div id="capabilities" className="relative z-30">
                <Skills />
            </div>
            
            {/* Projects follows immediately, higher z-index to interact properly */}
            <div id="projects" className="relative z-40">
                <VinylProjects />
            </div>
            
            {/* New Contact Section */}
            <div id="contact" className="relative z-50">
                <Contact />
            </div>
          </main>
          
          <ScrollToTop />

          <motion.footer 
            id="contact-footer" 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative z-[60] py-12 text-center text-gray-400 text-sm font-albert-light bg-white border-t border-gray-100"
          >
            <div className="mb-4">
                <h3 className="text-xl font-bold text-black mb-2">CONTACT</h3>
                <p>glei.design@example.com</p>
            </div>
            <p>&copy; {new Date().getFullYear()} zhanG minGlei. All Rights Reserved.</p>
          </motion.footer>
        </>
      )}
    </div>
  );
};

export default App;