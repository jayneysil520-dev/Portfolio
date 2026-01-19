import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useTransform, useMotionValue, useSpring, useScroll, useMotionTemplate } from 'framer-motion';
import { createPortal } from 'react-dom';
import ExperienceModal from '../components/ExperienceModal';
import Magnetic from '../components/Magnetic';

// --- DATA ---
const experienceData = [
  { 
      id: '1', 
      year: '2024 - 2025', 
      role: '平面视觉设计师', 
      company: '宁波得力集团', 
      color: '#FF7F27',
      // Added line breaks (\n) for proper formatting with whitespace-pre-line
      desc: '1.根据产品定位制定产品方向，并完成产品包装图稿设计；\n2.针对活动设计相关的营销视觉设计，提升用户参与活动的积极性；\n3.根据具体项目完成还包括海报、KV、PPT美化和动态设计；',
      tags: ['VISUAL DESIGN', 'BRANDING', 'GRAPHIC DESIGN']
  },
  { 
      id: '2', 
      year: '2021 - 2024', 
      role: '视觉传达设计硕士学位', 
      company: '南京师范大学', 
      color: '#005C4B', 
      desc: '获得学业奖学金，学习设计理论并积极参加各类国内外设计大赛',
      tags: ['MASTER DEGREE', 'THEORY', 'COMPETITION'] // Added tags
  },
  { 
      id: '3', 
      year: '2021 - 2022', 
      role: '插画师', 
      company: 'LiMi Ltd', 
      color: '#FFCC00',
      desc: '绘制各种主题的插画，包括不限于标志、海报、KV和插画的制作',
      tags: ['ILLUSTRATION', 'ART DIRECTION', 'KV DESIGN'] // Added tags
  },
  { 
      id: '4', 
      year: '2017 - 2021', 
      role: '平面视觉设计师', 
      company: '豌豆苗设计公司', 
      color: '#55FF55',
      desc: '1.在猿辅导的动画中，我担任的是前设设计部分工作，完成动画人物的前期设定和人物造型，最终动画顺利上线；\n2.为猿辅导的营销活动设计相关的视觉设计；',
      tags: ['VISUAL DESIGN', 'GRAPHIC DESIGN']
  },
];

// --- DEPTH CONFIG ---
const DEPTHS = {
    FLOOR: -300,
    PROPS: -290,
    MAIN: -50,
};

// --- COMPONENTS ---

// 1. REUSED FLOOR MARQUEE (Optimized)
const FloorMarquee: React.FC<{ direction: 'left' | 'right', text: string, className?: string, rotate?: number, style?: React.CSSProperties }> = React.memo(({ direction, text, className, rotate = 0, style }) => {
    return (
        <div 
            className="absolute left-[-20%] w-[140%] pointer-events-auto overflow-visible flex will-change-transform"
            style={{ 
                transform: `translateZ(${DEPTHS.PROPS - 10}px) rotate(${rotate}deg)`, 
                zIndex: 0,
                ...style,
            }}
        >
            <motion.div
                className={`flex whitespace-nowrap ${className}`}
                initial={{ x: direction === 'left' ? '0%' : '-50%' }}
                animate={{ x: direction === 'left' ? '-50%' : '0%' }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
                {[...Array(6)].map((_, i) => (
                    <span key={i} className="mx-4 transition-colors duration-300">
                        {text} <span className="mx-4 opacity-30">•</span>
                    </span>
                ))}
            </motion.div>
        </div>
    );
});

// 2. PROFILE CARD (Reverted to Frosted Glass, No Transparency Layers)
const ProfileTimelineCard: React.FC<{ 
    item: any, 
    onClick: () => void, 
    index: number, 
    style: React.CSSProperties 
}> = React.memo(({ item, onClick, index, style }) => {
    const ref = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ clientX, clientY }: React.MouseEvent) => {
        if (!ref.current) return;
        const { left, top } = ref.current.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    // 🟢 Floating Animation Parameters
    const randomDuration = useMemo(() => 4 + Math.random() * 2, []);
    const randomDelay = useMemo(() => Math.random() * 2, []);

    return (
        <motion.div
            ref={ref}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, x: 500 }}
            whileInView={{ opacity: 1, x: 0 }}
            // Keep Elastic Spring Animation
            transition={{ 
                delay: index * 0.1, 
                type: "spring", 
                stiffness: 70, 
                damping: 10, 
                mass: 1 
            }}
            whileHover={{ scale: 1.05, z: 20 }}
            className="absolute w-[550px] h-[180px] cursor-pointer group perspective-1000 transform-gpu will-change-transform"
            style={{ ...style, transformStyle: "preserve-3d" }}
        >
             {/* 🟢 FLOATING WRAPPER */}
             <motion.div
                className="w-full h-full"
                animate={{ 
                    y: [0, -8, 0],
                    x: [0, 3, 0],
                    rotateZ: [0, 0.5, 0],
                    z: [0, 10, 0]
                }}
                transition={{
                    duration: randomDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: randomDelay
                }}
                style={{ transformStyle: "preserve-3d" }}
             >
                {/* --- INTERACTIVE DOT (Left of Card) --- */}
                <div 
                    className="absolute -left-16 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center pointer-events-none"
                    style={{ transform: 'translateZ(10px)' }}
                >
                    {/* Connecting Line */}
                    <div className="absolute left-full top-1/2 w-8 h-[1px] bg-white/20 group-hover:w-12 transition-all duration-300" />
                    
                    {/* Core Dot */}
                    <div className="w-3 h-3 rounded-full bg-gray-300 group-hover:bg-white transition-colors duration-300 z-10" />
                    
                    {/* Hover Glow/Ring */}
                    <div 
                        className="absolute inset-0 rounded-full border border-gray-400 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" 
                        style={{ borderColor: item.color }}
                    />
                    <div 
                        className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-all duration-500" 
                        style={{ backgroundColor: item.color }}
                    />
                </div>

                {/* --- MAIN FROSTED GLASS FACE (Reverted Style) --- */}
                <div className="absolute inset-0 rounded-[2rem] shadow-sm" style={{ transformStyle: 'preserve-3d' }}>
                    
                    {/* Spotlight Border */}
                    <motion.div
                        className="absolute -inset-[1px] rounded-[2rem] z-0 opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none"
                        style={{
                            background: item.color,
                            maskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                            WebkitMaskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                        }}
                    />
                    
                    {/* Front Body - Reverted to bg-white/60 (Opaque Frosted) */}
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-md border border-white/60 rounded-[2rem] overflow-hidden z-10">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-60 pointer-events-none" />

                        {/* Content */}
                        <div className="relative p-8 flex flex-col justify-center h-full z-20">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="font-albert-black text-3xl text-[#1d1d1f]/90 group-hover:text-[#1d1d1f] transition-colors">
                                        {item.company}
                                    </span>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#1d1d1f]">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </div>

                                <span 
                                    className="px-4 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md"
                                    style={{ 
                                        backgroundColor: 'rgba(255,255,255,0.4)', 
                                        borderColor: 'rgba(255,255,255,0.6)',
                                        color: '#555' 
                                    }}
                                >
                                    {item.year}
                                </span>
                            </div>
                            
                            <div className="text-gray-600 font-albert-light text-lg flex items-center gap-2 mb-3">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                </svg>
                                {item.role}
                            </div>

                            <p className="text-sm text-gray-500 font-albert-light leading-snug line-clamp-2 whitespace-pre-line">
                                {item.desc}
                            </p>
                        </div>
                    </div>
                </div>
             </motion.div>
        </motion.div>
    );
});

// 3. NEW MODAL CARD WITH SPOTLIGHT (Encapsulated for separate mouse tracking)
const ExperienceModalCard: React.FC<{ selectedExp: any, onClose: () => void }> = ({ selectedExp, onClose }) => {
    const ref = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ clientX, clientY }: React.MouseEvent) => {
        if (!ref.current) return;
        const { left, top } = ref.current.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    return (
        <motion.div
            layoutId={`card-${selectedExp.id}`}
            ref={ref}
            onMouseMove={handleMouseMove}
            initial={{ rotateY: 90, opacity: 0, scale: 0.9 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: -90, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="relative w-full max-w-2xl transform-gpu overflow-hidden group"
            style={{ 
                transformStyle: "preserve-3d",
                borderRadius: '2.5rem',
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Dynamic Colored Shadow (Reduced to 15% opacity) */}
            <div 
                className="absolute inset-4 rounded-[2.5rem] transition-opacity duration-300 pointer-events-none"
                style={{ 
                    boxShadow: `0 0 100px -10px ${selectedExp.color}`,
                    opacity: 0.04, // Reduced from 0.25 to ~0.04 (15%)
                    zIndex: -1
                }}
            />

            {/* --- SPOTLIGHT BORDER (Mouse Following) --- */}
            <motion.div
                className="absolute inset-0 z-20 pointer-events-none rounded-[2.5rem]"
                style={{
                    border: '1.5px solid transparent',
                    background: selectedExp.color,
                    opacity: 0.15, // Reduced border opacity significantly to 15%
                    maskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                    WebkitMaskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                    maskComposite: 'exclude', 
                    WebkitMaskComposite: 'xor',
                    padding: '1.5px', 
                    backgroundClip: 'content-box',
                }}
            >
                 <div className="absolute inset-0 bg-transparent" /> 
            </motion.div>

            {/* Static Subtle White Border (iOS Style) */}
            <div className="absolute inset-0 rounded-[2.5rem] border border-white/50 pointer-events-none z-20 mix-blend-overlay" />

            {/* --- Color Displacement Layers (Reduced to 15%) --- */}
             <div 
                className="absolute inset-0 rounded-[2.5rem] blur-md mix-blend-multiply transition-all duration-500"
                style={{ 
                    backgroundColor: selectedExp.color, 
                    transform: 'translate(4px, 4px) scale(0.99)', 
                    opacity: 0.015, // Reduced from 0.1 to 0.015
                    zIndex: -1 
                }} 
            />
            <div 
                className="absolute inset-0 rounded-[2.5rem] blur-md mix-blend-screen transition-all duration-500"
                style={{ 
                    backgroundColor: '#ffffff', 
                    transform: 'translate(-4px, -4px) scale(0.99)', 
                    opacity: 0.01, // Reduced very low
                    zIndex: -2 
                }} 
            />

            {/* iOS Glass BG (Transparent & Blurry) */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[60px] saturate-150 rounded-[2.5rem] shadow-2xl" />
            
            {/* Inner Content */}
            <div className="relative z-20 p-10 md:p-14">
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors border border-black/5 backdrop-blur-sm text-[#1d1d1f]/60"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg border border-white/20" style={{ backgroundColor: selectedExp.color }}>
                        {selectedExp.company.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-3xl font-albert-black text-[#1d1d1f]">{selectedExp.company}</h2>
                        <span className="text-gray-500 font-mono">{selectedExp.year}</span>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-bold text-[#1d1d1f] mb-2">{selectedExp.role}</h3>
                    <p className="text-lg text-gray-800 leading-relaxed font-albert-regular whitespace-pre-line">
                        {selectedExp.desc}
                    </p>
                </div>

                {/* DYNAMIC TAGS */}
                <div className="flex gap-2 flex-wrap">
                    {selectedExp.tags && selectedExp.tags.map((tag: string, i: number) => (
                         <span key={i} className="px-3 py-1 bg-white/60 border border-white/60 rounded-lg text-xs text-gray-600 font-bold uppercase backdrop-blur-md shadow-sm">
                            {tag}
                         </span>
                    ))}
                </div>

                {/* Subtle Ambient Glow inside (Reduced to 15%) */}
                <div 
                    className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full blur-[80px] pointer-events-none"
                    style={{ backgroundColor: selectedExp.color, opacity: 0.02 }} // Reduced from 0.15 to ~0.02
                />
            </div>
        </motion.div>
    );
};

// 4. STABLE PHOTO COMPONENT
const StablePhoto: React.FC<{ hasEntered: boolean }> = ({ hasEntered }) => {
    const ref = useRef<HTMLDivElement>(null);
    // Use motion values for 3D tilt
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 100, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 100, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Calculate percentage -0.5 to 0.5
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            className="absolute w-[320px] h-[440px] md:w-[400px] md:h-[550px]"
            style={{
                top: '-10%', // 🟢 MOVED UP from 15%
                left: '15%',
                zIndex: 20,
                transformStyle: "preserve-3d",
                z: DEPTHS.MAIN,
            }}
            initial={{ x: -1000, rotate: -45, opacity: 0 }}
            animate={hasEntered ? { x: 0, rotate: -5, opacity: 1 } : {}}
            transition={{ duration: 1.2, type: "spring", stiffness: 50, damping: 12 }}
            // Events are handled on this static container
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
             {/* 🟢 FLOATING WRAPPER FOR PHOTO */}
             <motion.div
                className="w-full h-full"
                animate={{ 
                    y: [0, -10, 0],
                    x: [0, 5, 0],
                    rotateZ: [0, 0.5, 0],
                    z: [0, 15, 0]
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{ transformStyle: "preserve-3d" }}
             >
                {/* Inner Animated Layer */}
                <motion.div
                    className="w-full h-full rounded-[2rem] bg-white p-3 shadow-2xl group cursor-pointer"
                    style={{
                        rotateX,
                        rotateY,
                        transformStyle: "preserve-3d",
                    }}
                >
                    <div className="w-full h-full relative overflow-hidden rounded-[1.5rem] bg-gray-100 transform-style-3d">
                        <img 
                            // FIX: Updated to jsDelivr Mirror
                            src="https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/Group%20508.png" 
                            alt="Profile" 
                            // Grayscale to Color Transition
                            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out will-change-filter"
                            decoding="async"
                            loading="lazy"
                        />
                        
                        {/* Gloss / Shine Effect on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay" />
                        
                        {/* Inner Shadow for Depth */}
                        <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] rounded-[1.5rem] pointer-events-none" />
                    </div>
                </motion.div>
             </motion.div>
        </motion.div>
    );
};

// 5. NAME TILT COMPONENT (Internal for Magnetic Block)
const NameTilt: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 200, damping: 10 });
    const mouseYSpring = useSpring(y, { stiffness: 200, damping: 10 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ 
                rotateX, 
                rotateY, 
                transformStyle: "preserve-3d" 
            }}
            className="inline-block"
        >
            <h2 className="text-7xl font-albert-black text-[#1d1d1f] leading-none mb-4 mix-blend-multiply tracking-tighter transform -skew-x-6 hover:text-[#1d1d1f]/70 transition-colors duration-300 pointer-events-none">
                zhanG<br/>minGlei
            </h2>
        </motion.div>
    );
};


const Profile: React.FC = () => {
  const [selectedExp, setSelectedExp] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState<any>(false);

  const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ["start start", "end end"]
  });
  
  const floorY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  // Optimized Springs for smoother tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 30, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 30, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent) => {
      const { clientX, clientY } = e;
      const w = window.innerWidth;
      const h = window.innerHeight;
      x.set(clientX / w - 0.5);
      y.set(clientY / h - 0.5);
  };

  // 🟢 ADJUST PERSPECTIVE HERE
  // Preserved as requested: "rotateX adjustment made it too tilted... don't change it"
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["23deg", "14deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);
  const translateX = useTransform(mouseXSpring, [-0.5, 0.5], ["-1%", "1%"]);

  // 🟢 MOVED UP: Adjusted all card positions upwards
  const cardPositions = [
      { top: '-10%',  left: '52%', rotate: '-4deg' }, // was 5%
      { top: '13%', left: '60%', rotate: '2deg' },  // was 28%
      { top: '36%', left: '54%', rotate: '-2deg' }, // was 51%
      { top: '59%', left: '59%', rotate: '3deg' },  // was 74%
  ];

  return (
    <section 
        ref={containerRef}
        className="relative w-full bg-white overflow-hidden" 
        onMouseMove={handleMouseMove}
        style={{ height: '140vh' }}
    >
      <motion.div 
         className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center will-change-transform"
         onViewportEnter={() => setHasEntered(true)}
      >
        <div className="absolute inset-0 flex items-center justify-center perspective-1000">
            <motion.div
                className="relative w-full max-w-[1600px] will-change-transform transform-gpu"
                style={{
                    rotateX,
                    rotateY,
                    x: translateX,
                    y: floorY,
                    scale: 0.8, // 🟢 80% ZOOM EFFECT: Applied scale to main container
                    aspectRatio: '16/9',
                    transformStyle: "preserve-3d",
                }}
            >
                <div className="absolute inset-[-50%] bg-white transform-preserve-3d" style={{ transform: `translateZ(${DEPTHS.FLOOR}px)` }} />
                
                {/* Scrolling Text */}
                <FloorMarquee 
                    direction="right" 
                    text="About Me" 
                    rotate={-5} 
                    className="text-[160px] font-albert-black text-gray-100 leading-none" 
                    style={{ top: '5%', zIndex: 1 }} // 🟢 MOVED UP from 15%
                />

                {/* Floor Title */}
                <div 
                    className="absolute pointer-events-none text-center w-[400px]"
                    style={{
                         top: '-5%', // 🟢 MOVED UP from 5%
                         left: '15%',
                         transform: `translateZ(${DEPTHS.PROPS}px) rotateX(-5deg)`,
                         zIndex: 5
                    }}
                >
                    <h2 className="text-6xl font-albert-black text-gray-200 tracking-tighter">About Me</h2>
                </div>

                {/* REFACTORED PHOTO COMPONENT */}
                <StablePhoto hasEntered={hasEntered} />

                {/* Personal Info - UPDATED with Magnetic Scale Interaction */}
                <motion.div 
                    className="absolute text-left pointer-events-auto"
                    style={{ 
                        top: '55%', // 🟢 MOVED UP from 80%
                        left: '22%', 
                        transform: `translateZ(${DEPTHS.MAIN}px) rotateX(-10deg) rotateZ(-5deg)`,
                        width: '450px',
                        zIndex: 25
                    }}
                    initial={{ opacity: 0, y: 50, rotate: 10 }}
                    animate={hasEntered ? { opacity: 1, y: 0, rotate: -5 } : {}}
                    transition={{ delay: 0.5, duration: 1, type: "spring" }}
                >
                    <Magnetic strength={40}>
                        <motion.div
                            className="cursor-pointer"
                            whileHover={{ scale: 1.15 }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                            <NameTilt />
                            <div className="flex flex-wrap gap-4 text-sm font-mono text-gray-500 pl-4 border-l-2 border-gray-300 pointer-events-none">
                                <span>EST. 1995</span>
                                <span>·</span>
                                <span>SHANGHAI</span>
                                <span>·</span>
                                <span>VISUAL DESIGNER</span>
                            </div>
                        </motion.div>
                    </Magnetic>
                </motion.div>

                {/* Timeline Cards */}
                <div 
                    className="absolute w-full h-full pointer-events-auto"
                    style={{
                        zIndex: 30,
                        transformStyle: "preserve-3d",
                        transform: `translateZ(${DEPTHS.MAIN}px) rotateX(-5deg)`,
                    }}
                >
                    {experienceData.map((item, idx) => (
                        <ProfileTimelineCard 
                            key={item.id} 
                            item={item} 
                            index={idx}
                            style={cardPositions[idx] as React.CSSProperties}
                            onClick={() => setSelectedExp(item)}
                        />
                    ))}
                </div>

            </motion.div>
        </div>
      </motion.div>

      {/* FLIP MODAL OVERLAY */}
      {createPortal(
        <AnimatePresence>
            {selectedExp && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center perspective-2000 px-4">
                     <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="absolute inset-0 bg-white/40 backdrop-blur-md"
                        onClick={() => setSelectedExp(null)}
                     />
                     
                     <ExperienceModalCard 
                        selectedExp={selectedExp} 
                        onClose={() => setSelectedExp(null)} 
                     />
                </div>
            )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};

export default Profile;