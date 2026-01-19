import React, { useState, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, AnimatePresence } from 'framer-motion';

// --- CONFIGURATION ---
// 🟢 👇 PASTE YOUR WECHAT QR CODE IMAGE LINK HERE
// 您可以在这里替换您的微信二维码图片链接
// 🟢 FIX: 使用国内镜像链接
const WECHAT_QR_CODE_URL = "https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/%E6%88%91%E7%9A%84%E4%BA%8C%E7%BB%B4%E7%A0%81.jpg";

// --- ICONS ---
const ICONS = {
    Phone: (
        <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
    ),
    Email: (
        <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
        </svg>
    ),
    WeChat: (
        <svg width="45" height="45" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.69 16.89C8.69 16.89 12.98 16.9 15.68 15.34C18.37 13.79 18.29 11.23 18.29 11.23C18.29 11.23 18.29 11.23 18.29 11.23C18.39 8.65 16.14 6.75 13.06 6.75C9.97 6.75 7.42 8.94 7.42 11.91C7.42 13.62 8.32 15.11 9.68 16.03C9.68 16.03 9.97 16.2 9.77 16.88C9.56 17.55 9.17 18.26 9.17 18.26C9.17 18.26 12.39 18.06 14.15 16.63L8.69 16.89Z" opacity="0.6"/>
            <path d="M16.48 15.82C16.48 15.82 21.03 15.16 22.5 12.63C23.97 10.1 22.39 7.5 22.39 7.5C22.39 7.5 22.39 7.5 22.39 7.5C21.84 4.5 18.57 3 15.5 3C12.43 3 9.8 5.25 9.8 8C9.8 8.44 9.86 8.87 9.97 9.27C10.79 9.06 11.75 8.94 12.8 8.94C17.09 8.94 20.66 11.66 20.66 15.24C20.66 16.1 20.47 16.91 20.13 17.65C20.13 17.65 19.78 17.47 19.34 16.99L16.48 15.82Z"/>
        </svg>
    ),
    Xiaohongshu: (
        <svg width="45" height="45" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 12a8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8-8 8 8 0 0 1-8-8z" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M7 11.5c0-2 .5-3.5 1.5-4.5s2.5-1.5 3.5-1.5 2.5.5 3.5 1.5 1.5 2.5 1.5 4.5-1 4-2.5 5.5S12 18 12 18s-2.5-.5-4-1.5S7 13.5 7 11.5z" />
            <path d="M9 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    )
};

// --- DATA ---
// More staggered positions (错开多一些)
const CONTACT_CARDS = [
    {
        id: 'phone',
        title: 'PHONE',
        value: '+86 186 2517 5759',
        color: '#3B82F6', // Blue
        icon: ICONS.Phone,
        position: { x: '-150%', y: '48%' }, 
        rotation: 12,
        // 🟢 👇 修改这里：调整 Hover 时的旋转角度 (0 为不旋转，正数顺时针，负数逆时针)
        hoverRotation: 15
    },
    {
        id: 'email',
        title: 'EMAIL',
        value: '1368069338@qq.com',
        color: '#F97316', // Orange
        icon: ICONS.Email,
        position: { x: '-80%', y: '50%' }, 
        rotation: 5,
        // 🟢 👇 修改这里：调整 Hover 时的旋转角度
        hoverRotation: 7
    },
    {
        id: 'wechat',
        title: 'WECHAT',
        value: 'JayNeySil',
        color: '#07C160', // WeChat Green
        icon: ICONS.WeChat,
        position: { x: '5%', y: '46%' }, 
        rotation: -11,
        // 🟢 👇 修改这里：调整 Hover 时的旋转角度
        hoverRotation: -14,
        qrCode: WECHAT_QR_CODE_URL // Added QR Code Link
    },
    {
        id: 'xhs',
        title: 'RED NOTE',
        value: 'Glei_Art',
        color: '#FF2442', // Xiaohongshu Red
        icon: ICONS.Xiaohongshu,
        position: { x: '100%', y: '51%' }, 
        rotation: -16,
        // 🟢 👇 修改这里：目前设置了 12 度，使其向右旋转 (您可以改成其他数值)
        hoverRotation: -18 
    }
];

// --- FLOOR MARQUEE COMPONENT ---
const FloorMarquee: React.FC<{ direction: 'left' | 'right', text: string, className?: string, rotate?: number, style?: React.CSSProperties }> = React.memo(({ direction, text, className, rotate = 0, style }) => {
    return (
        <div 
            className="absolute left-[-20%] w-[140%] pointer-events-auto overflow-visible flex will-change-transform"
            style={{ 
                transform: `translateZ(-100px) rotate(${rotate}deg)`, 
                zIndex: 0,
                ...style,
            }}
        >
            <motion.div
                className={`flex whitespace-nowrap ${className}`}
                initial={{ x: direction === 'left' ? '0%' : '-50%' }}
                animate={{ x: direction === 'left' ? '-50%' : '0%' }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
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

// --- 3D CARD COMPONENT ---
const Card3D: React.FC<{ item: typeof CONTACT_CARDS[number]; index: number }> = ({ item, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(item.value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // 🟢 Floating Animation Parameters
    const randomDuration = useMemo(() => 4 + Math.random() * 2, []);
    const randomDelay = useMemo(() => Math.random() * 2, []);

    return (
        <motion.div
            className="absolute perspective-1000"
            style={{
                left: '50%',
                top: '25%', // 🟢 Changed from 35% to 25% (Moved UP)
                x: item.position.x, 
                y: item.position.y,
                zIndex: isHovered ? 100 : 10,
            }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: index * 0.1, type: "spring" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleCopy}
        >
             {/* 🟢 FLOATING WRAPPER */}
             <motion.div
                className="w-full h-full"
                animate={isHovered ? {} : { 
                    y: [0, -10, 0],
                    x: [0, 4, 0],
                    rotateZ: [0, 1, 0],
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
                <motion.div
                    className="relative cursor-pointer"
                    animate={{
                        // Idle: 1.5x original size (200 * 1.5 = 300)
                        // Hover: Slightly larger than idle
                        width: isHovered ? 400 : 300,
                        height: isHovered ? 520 : 300,
                        rotateX: isHovered ? 0 : 0, 
                        rotateY: isHovered ? 0 : 0,
                        
                        // 🟢 核心动画逻辑：这里读取上面数据中定义的 hoverRotation
                        rotateZ: isHovered ? item.hoverRotation : item.rotation,
                        
                        y: isHovered ? -100 : 0, // Lift up
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 15
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* --- SHADOW GLOW (Only on Hover) --- */}
                    <motion.div
                        className="absolute inset-0 rounded-[2rem] blur-[60px] opacity-0 transition-opacity duration-500"
                        animate={{ opacity: isHovered ? 0.6 : 0 }}
                        style={{ backgroundColor: item.color, transform: 'translateZ(-50px)' }}
                    />

                    {/* --- MAIN CARD --- */}
                    <div 
                        className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col items-center justify-center text-center transition-colors duration-300"
                        style={{ 
                            backgroundColor: isHovered ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.05)',
                            borderColor: isHovered ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)'
                        }}
                    >
                        {/* ICON (Animated Position) */}
                        <motion.div
                            animate={{ 
                                y: isHovered ? (item.qrCode ? -80 : -40) : 0,  // Move icon higher if QR code present
                                scale: isHovered ? 1 : 1, // Keep icon normal size on hover
                                color: isHovered ? item.color : '#000000',
                                opacity: isHovered ? (item.qrCode ? 0 : 1) : 1 // Optionally fade icon if QR exists, but keeping it visible is fine too. Let's keep it visible but small.
                            }}
                            className="text-[#1d1d1f]/80"
                        >
                            {item.icon}
                        </motion.div>

                        {/* CONTENT (Revealed on Hover) */}
                        <motion.div
                            className="absolute bottom-10 left-0 w-full px-6 flex flex-col items-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                        >
                             {/* 🟢 QR CODE CONTAINER - ONLY RENDERS IF 'qrCode' IS PRESENT */}
                             {item.qrCode && (
                                 <div className="w-32 h-32 mb-6 bg-white p-2 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300">
                                     <img 
                                        src={item.qrCode} 
                                        alt="QR Code" 
                                        className="w-full h-full object-cover rounded-lg" 
                                        draggable={false}
                                    />
                                 </div>
                             )}

                             <h3 className="text-sm font-bold tracking-widest text-gray-400 mb-2 uppercase">{item.title}</h3>
                             <p className="text-xl font-albert-black text-[#1d1d1f] break-words leading-tight select-all">{item.value}</p>
                             
                             {/* Changed text-xs to text-sm for "CLICK TO COPY" */}
                             <div className="mt-6 flex items-center justify-center gap-2 text-sm font-mono text-gray-400">
                                 {copied ? (
                                     <span className="text-green-500 font-bold flex items-center gap-1">
                                         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                         COPIED!
                                     </span>
                                 ) : (
                                     <span>CLICK TO COPY</span>
                                 )}
                             </div>
                        </motion.div>
                    </div>

                    {/* --- 3D THICKNESS SIDES --- */}
                    <div 
                        className="absolute inset-0 border border-white/10 rounded-[2rem] pointer-events-none"
                        style={{ transform: 'translateZ(-20px)' }}
                    />

                </motion.div>
             </motion.div>
        </motion.div>
    );
};

// --- MAIN COMPONENT ---
const Contact: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

    return (
        <section 
            ref={containerRef}
            className="relative w-full bg-white overflow-hidden"
            style={{ height: '100vh' }}
        >
            <div className="w-full h-full flex items-center justify-center perspective-2000">
                {/* Floor Container */}
                <motion.div
                    className="relative w-full max-w-[1400px] h-full transform-gpu"
                    style={{
                        rotateX: "40deg", // Permanent tilt for the floor
                        y,
                        scale: 0.8, // 🟢 80% ZOOM EFFECT
                        transformStyle: "preserve-3d",
                    }}
                >
                    {/* Replaced 'HELLO' with Floor Marquee */}
                     <FloorMarquee 
                        direction="right" 
                        text="CONTACT ME" 
                        rotate={-10} 
                        className="text-[120px] md:text-[180px] font-albert-black text-gray-100 leading-none" 
                        style={{ top: '40%' }} // 🟢 Changed from 50% to 40% (Moved UP)
                    />

                    {/* Cards Container */}
                    <div className="absolute inset-0 pointer-events-auto" style={{ transformStyle: "preserve-3d" }}>
                         {CONTACT_CARDS.map((card, idx) => (
                             <Card3D key={card.id} item={card} index={idx} />
                         ))}
                    </div>

                </motion.div>
            </div>
        </section>
    );
};

export default Contact;