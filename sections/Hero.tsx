import React, { useRef, useState, useMemo } from 'react';
import { motion, useTransform, useMotionValue, useSpring, useScroll } from 'framer-motion';
import Spotlight3D from '../components/Spotlight3D';
import PatternPlaceholder from '../components/PatternPlaceholder';
import Magnetic from '../components/Magnetic';

// --- DATA ---
// 🟢 FIX: Using China-accessible CDN mirror (jsd.cdn.zzko.cn)
const heroCards = [
  { 
      id: 1, 
      color: '#FF7F27', 
      rotate: -12, 
      img: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/1.png',
      // 🟢 这里控制每张卡片的独立缩放比例 (相对于基础尺寸)
      scale: 1.25
  }, 
  { 
      id: 2, 
      color: '#00A2E8', 
      rotate: -8, 
      img: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/2.png',
      scale: 1.15
  }, 
  { 
      id: 3, 
      color: '#55FFFF', 
      rotate: -15, 
      scale: 1.1,
      // Placeholder for 3rd card content - Replace with your image
      img: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/%E7%8C%BF%E8%BE%85%E5%AF%BC%E5%B0%81%E9%9D%A2.png'
  }, 
  { 
      id: 4, 
      color: '#EA2F2F', 
      rotate: 10, 
      scale: 1.18,
      // 🟢 修复：将 GitHub Raw 链接替换为国内镜像链接
      img: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/%E5%8D%AB%E5%B2%97%E5%B0%81%E9%9D%A2hero.jpg'
  }, 
  { id: 5, color: '#FFCCAA', rotate: 5, scale: 1.1 }, 
];

// --- DEPTH CONFIGURATION ---
const DEPTHS = {
    FLOOR: -300,
    PROPS: -290,
    CARDS: -50,
    TEXT: 10, 
};

// --- LAYOUT CONFIG ---
// 🟢 STRICTLY PRESERVED: Layout config matches your original file
const layoutConfig = [
    { left: '-2%', top: '30%', zIndex: 10 },  // was 35%
    { left: '62%', top: '35%', zIndex: 12 }, // was 40%
    { left: '15%', top: '45%', zIndex: 14 }, // was 50%
    { left: '83%', top: '30%', zIndex: 8 },  // was 35%
    { left: '46%', top: '42%', zIndex: 15 }, // was 45%
];

// --- COMPONENT: Internal Floating Wrapper ---
// Wraps the CONTENT of the card, not the positioned container
const FloatingContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Generate random float parameters
    const randomDuration = useMemo(() => 4 + Math.random() * 3, []);
    const randomDelay = useMemo(() => Math.random() * 2, []);

    return (
        <motion.div
            className="w-full h-full"
            animate={{ 
                y: [0, -10, 0],
                x: [0, 4, 0],
                rotateZ: [0, 0.5, 0],
                // 🟢 关键修复：移除 Z 轴动画，防止卡片在 3D 空间中穿插导致层级错乱
                z: 0 
            }}
            transition={{
                duration: randomDuration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: randomDelay
            }}
            style={{ transformStyle: "preserve-3d" }}
        >
            {children}
        </motion.div>
    );
};

const Hero: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hasEntered, setHasEntered] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const floorY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
    
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 40, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 40, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const w = window.innerWidth;
        const h = window.innerHeight;
        x.set(clientX / w - 0.5);
        y.set(clientY / h - 0.5);
    };

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["35deg", "25deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);
    const translateX = useTransform(mouseXSpring, [-0.5, 0.5], ["-2%", "2%"]);

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
                        // OPTIMIZATION: Added transform-gpu to force hardware acceleration
                        className="relative w-full max-w-[1400px] will-change-transform transform-gpu"
                        style={{
                            rotateX,
                            rotateY,
                            x: translateX,
                            y: floorY,
                            // 🟢 关键调整：整体缩放从 0.8 调整为 0.65，使视觉更精致 (约为原来的 80%)
                            scale: 0.65, 
                            aspectRatio: '16/9',
                            transformStyle: "preserve-3d",
                        }}
                    >
                        {/* Floor */}
                        <div className="absolute inset-[-50%] bg-white transform-preserve-3d" style={{ transform: `translateZ(${DEPTHS.FLOOR}px)` }} />
                        
                        {/* 1. Main Title - Animation Updated: Slide up from y: 150 */}
                        <div className="absolute top-[5%] left-0 w-full text-center pointer-events-none" style={{ transform: `translateZ(${DEPTHS.TEXT}px) rotateX(-10deg)` }}>
                             <motion.div 
                                className="font-albert-black text-[6vw] md:text-[8vw] leading-none tracking-tighter mix-blend-multiply opacity-90 whitespace-nowrap flex flex-col justify-center items-center"
                                // MODIFIED: Changed y from 60 to 150 for a deeper slide-up effect
                                initial={{ opacity: 0, y: 150 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                // MODIFIED: Adjusted ease for a smoother "reveal" feel
                                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                                viewport={{ once: true }}
                             >
                                <span className="text-[#1d1d1f] transform -skew-x-6">zhanG minGlei</span>
                            </motion.div>

                            <motion.div 
                                className="mt-4 flex flex-col items-center gap-2"
                                initial={{ opacity: 0, y: 80 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                                viewport={{ once: true }}
                            >
                                <div className="font-albert-light text-2xl md:text-3xl text-gray-500 tracking-widest uppercase">Visual Designer</div>
                                <div className="w-12 h-[1px] bg-gray-300 my-1" />
                                <div className="font-albert-light text-xl md:text-2xl text-gray-400 tracking-widest uppercase">Illustrator & Animator</div>
                            </motion.div>
                        </div>

                        {/* 2. Scattered Cards */}
                        {heroCards.map((card, idx) => {
                            const layout = layoutConfig[idx];
                            
                            // 🟢 基础尺寸控制：修改这里的 w-[240px] (移动端) 和 md:w-[300px] (桌面端) 可以改变所有卡片的基准大小
                            const sizeClass = "w-[280px] md:w-[340px]";
                            
                            const initialX = idx % 2 === 0 ? -1500 : 1500;

                            return (
                                <motion.div
                                    key={card.id}
                                    className={`absolute cursor-pointer ${sizeClass} will-change-transform`}
                                    style={{
                                        top: layout.top,
                                        left: layout.left,
                                        aspectRatio: '1/1',
                                        zIndex: layout.zIndex,
                                        transformStyle: "preserve-3d",
                                        z: DEPTHS.CARDS,
                                    }}
                                    initial={{ opacity: 0, x: initialX, rotate: card.rotate * 2 }}
                                    // 🟢 关键修改：加入 scale: card.scale，让数据里的 scale 属性生效
                                    animate={hasEntered ? { opacity: 1, x: 0, rotate: card.rotate, scale: card.scale } : {}}
                                    transition={{ duration: 0.6, delay: idx * 0.08, type: "spring", stiffness: 60, damping: 12 }}
                                    whileHover={{ 
                                        y: -40, 
                                        // 悬停时在原有 scale 基础上放大 1.05 倍
                                        scale: card.scale * 1.05, 
                                        rotate: 0,
                                        transition: { duration: 0.3, ease: "easeOut" }
                                    }}
                                >
                                    {/* 🟢 FLOATING WRAPPER APPLIED HERE (Does not affect positioning) */}
                                    <FloatingContent>
                                        <Magnetic strength={30}>
                                            <Spotlight3D 
                                                className="w-full h-full rounded-[2.5rem] bg-white/10 backdrop-blur-md border border-white/30 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]" 
                                                color={card.color}
                                                enableElasticScale={false} 
                                                spotlightColor="rgba(255,255,255,0.5)"
                                            >
                                                <div className="w-full h-full relative p-3">
                                                    <div className="w-full h-full rounded-[2rem] overflow-hidden relative shadow-inner">
                                                        {card.img ? (
                                                            <div className="w-full h-full relative group">
                                                                <img 
                                                                    src={card.img} 
                                                                    alt={`Card ${card.id}`} 
                                                                    className="w-full h-full object-cover"
                                                                    decoding="async"
                                                                />
                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                                            </div>
                                                        ) : (
                                                            <PatternPlaceholder color={card.color} number={card.id} />
                                                        )}
                                                    </div>
                                                </div>
                                            </Spotlight3D>
                                        </Magnetic>
                                    </FloatingContent>
                                </motion.div>
                            );
                        })}

                    </motion.div>
                </div>
             </motion.div>
        </section>
    );
};

export default Hero;