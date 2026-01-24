import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useTransform, useMotionValue, useSpring, useScroll, useMotionTemplate, Variants } from 'framer-motion';
import { createPortal } from 'react-dom'; 
import Spotlight3D from '../components/Spotlight3D';
import Interactive3DGallery from '../components/Interactive3DGallery';

// --- CONFIGURATION / 配置区域 ---

const CARDS_GLOBAL_SCALE = 1.1;
const VIDEO_1_SCROLL_HEIGHT_VH = 110; 
const VIDEO_2_SCROLL_HEIGHT_VH = 110;

/**
 * 🟢 PREVIEW_LAYOUT_CONFIG
 * 控制右侧悬浮预览卡片（大图）和软件图标（小卡片）的布局与样式。
 * 修改这里的数值可直接改变大小、位置和文字排版。
 */
const PREVIEW_LAYOUT_CONFIG = {
    // 1. 右侧大卡片设置 (Photo Card)
    card: {
        width: '1000px',        // 宽度 (建议 600px - 900px)
        height: '360px',       // 高度 (建议 300px - 450px)
        top: '15%',            // 垂直位置 (距离顶部百分比)
        right: '-13%',          // 水平位置 (距离右侧百分比)
        padding: 'p-16',       // 内部边距
        borderRadius: 'rounded-[4rem]', // 圆角大小
    },

    // 2. 漂浮软件图标设置 (Floating Icons)
    icons: {
        sizeClass: 'w-32 h-32', // 图标尺寸 (w-14: 56px, w-16: 64px, w-20: 80px)
        startX: 350,           // 起始 X 坐标 (相对于大卡片左上角)
        startY: 320,           // 起始 Y 坐标 (相对于大卡片左上角)
        gapX: 150,              // 图标水平间距
        gapY: 5,              // 图标垂直间距
        randomness: 50,        // 随机偏移范围 (0 为整齐排列)
    },

    // 3. 文字排版设置 (Typography)
    text: {
        titleSize: 'text-6xl',      // 标题字号 (text-4xl, text-5xl, text-6xl)
        titleGap: 'mb-3',           // 标题底部间距 (mb-2, mb-3, mb-4)
        labelSize: 'text-xl',       // 类型标签字号
        descSize: 'text-lg',        // 描述文字字号 (text-base, text-lg, text-xl)
        descLineClamp: 'line-clamp-3', // 描述最大行数 (line-clamp-2, line-clamp-3)
        dateStyle: 'text-lg font-mono', // 日期/年份字体样式
    }
};

// --- ASSETS ---
const P1_IMG_1 = 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E6%89%80%E6%9C%89IP%E7%9A%84%E4%BD%8D%E7%BD%AE1-11.png';
const P1_IMG_2 = 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E7%AC%AC%E4%B8%80%E4%B8%AA%E5%8D%A1%E7%89%87%E7%AC%AC%E4%BA%8C%E9%95%BF%E5%9B%BE%E6%9C%80%E5%90%8E%E4%B8%80%E7%89%88.png';
const P1_IMG_3 = 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E7%AC%AC%E4%B8%80%E4%B8%AA%E5%8D%A1%E7%89%87%E7%AC%AC%E5%9B%9B%E9%95%BF%E5%9B%BE.png';
const P1_VID_1 = "https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%93%85%E7%AC%94%E7%9A%84%E8%A7%86%E9%A2%91.mp4";
const P1_VID_2 = "https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E6%89%8B%E8%87%82%E8%A7%86%E9%A2%91.mp4";

const PROJECT_2_LONG_IMAGE = 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/%E5%BE%97%E5%8A%9B%E8%9B%8B%E4%BB%94%E9%95%BF%E5%9B%BE1-11.png';

const TOOL_ICONS: Record<string, string> = {
    'Figma': 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/figma/figma-original.svg',
    'PS': 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg',
    'AI': 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg',
    'AE': 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/aftereffects/aftereffects-original.svg',
    'Blender': 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/blender/blender-original.svg',
    'C4D': 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/1197px-C4D_Logo.png',
    'React': 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/react/react-original.svg',
    'ThreeJS': 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/threejs/threejs-original.svg', 
    'Jimeng': 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/%E5%8D%B3%E6%A2%A6icon.png',
    'Pinterest': 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/pinterest/pinterest-original.svg',
    'LibLib': 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/LibLib.png'
};

// --- DATA / 项目数据 ---
// 🟢 请在此处管理您的项目内容
const projects = [
  { 
      id: 1, 
      title: '得力欧美市场IP形象设计', 
      label: 'IP IMAGE DESIGN', 
      year: '2025.01 - 2025.03', 
      client: 'DELI', 
      color: '#FF7F27', 
      img: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/1-1.png', 
      desc: 'Creating a magical land named "Heart Language Forest" for Deli\'s European and American markets.',
      tools: ['Jimeng', 'PS', 'Figma', 'Blender', 'LibLib'],
      layout: 'gallery', 
      
      scrollVideoUrl: P1_VID_1,
      scrollVideoUrl2: P1_VID_2,

      sequenceConfig1: {
          baseUrl: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/arm/ezgif-frame-', 
          suffix: '.png',
          digits: 3,       
          frameCount: 56,
          startIndex: 1
      },
      
      detailImages: [
          P1_IMG_1,   // [0]
          P1_IMG_2,   // [1]
          P1_IMG_3,   // [2]
      ],
      detailText: {
          main: 'Fehn',
          sub: '创意工程师 CREATIVE ENGINEER',
          signature: 'Fehn'
      }
  },
  { 
      id: 2, 
      title: '蛋仔派对·得力创作大赛视觉设计', 
      label: 'VISUAL DESIGN', 
      year: '2025.02', 
      color: '#FFA500', 
      img: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/2-1.png', 
      desc: '得力在手，蛋仔脑洞全开',
      tools: ['Figma', 'Jimeng', 'PS', 'Blender', 'LibLib'],
      layout: 'gallery',
      detailImages: [PROJECT_2_LONG_IMAGE],
  },
  { 
      id: 3, title: '猿辅导运营设计', label: 'VISUAL DESIGN', year: '2022', color: '#4DA6FF', 
      shadowColor: '#4DA6FF',
      img: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/%E7%8C%BF%E8%BE%85%E5%AF%BC%E5%B0%81%E9%9D%A2.png', 
      desc: 'Cyberpunk aesthetic visual identity system for a futuristic fashion label.',
      tools: ['PS', 'AI', 'C4D'],
      layout: 'gallery',
      detailImages: [],
      detailText: { main: 'Yuan', sub: '运营设计 OPERATION DESIGN', signature: 'Tutor' }
  },
  { 
      id: 4, 
      title: '卫岗形象设计之LoRA炼制', 
      label: 'LOGO / IP DESIGN', 
      year: '2022', 
      color: '#EA2F2F', 
      img: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E5%8D%AB%E5%B2%97/%E5%B0%81%E9%9D%A2%E5%9B%BE.png', 
      desc: 'Rhythm of city life captured in a rhythmic event discovery application.',
      tools: ['Figma', 'LibLib', 'PS', 'AI']
  },
  { 
      id: 5, 
      title: '哪吒书立及腰封设计', 
      label: 'IOT INTERFACE', 
      year: '2025', 
      color: '#66DD88', 
      img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&auto=format&fit=crop', 
      desc: 'Smart home interface connecting organic patterns with digital control.',
      tools: ['AI', 'Figma']
  },
  { 
      id: 6, 
      title: '个人视频部分', 
      label: 'MOTION ART', 
      year: '2021-2025', 
      color: '#AA88EE', 
      img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop', 
      desc: 'Experimental motion graphics exploring the concept of digital minimalism.',
      tools: ['C4D', 'AE', 'Blender']
  },

  { 
      id: 7, title: 'aboUt mysElf', label: 'Deep Gallery', year: '2021-2025', color: '#4ECDC4', 
      img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop', 
      desc: 'Interactive 3D scroll experience featuring real-time WebGL rendering.',
      tools: ['ThreeJS', 'React Three Fiber', 'Blender'],
      layout: '3d-scene'
  },
  { 
      id: 8, title: '自媒体设计能力沉淀', label: 'Personal Growth', year: '2021-2026', color: '#FF0055', 
      img: 'https://images.unsplash.com/photo-1515405295579-ba7f45403022?q=80&w=1000&auto=format&fit=crop', 
      desc: 'Visualizing sound waves in real-time using WebAudio API and Canvas.',
      tools: ['Figma', 'PS']
  }
];

const DEPTHS = { FLOOR: -300, PROPS: -290, PROJECTS: -50 };

// --- COMPONENTS ---

interface InteractivePhotoCardProps {
    x: number;
    y: number;
    width: number;
    height: number;
    rotate: number;
    imgUrl?: string;
    delay?: number;
    mediaOffsetVh: number;
    designWidth?: number;
    modalWidthVw?: number;
}

const InteractivePhotoCard: React.FC<InteractivePhotoCardProps> = ({ 
    x, y, width, height, rotate, imgUrl, delay = 0, mediaOffsetVh, 
    designWidth = 1920, modalWidthVw = 57
}) => {
    const getPos = (px: number) => (px / designWidth) * 100; // %
    const getSize = (px: number) => (px / designWidth) * modalWidthVw; // vw

    const ref = useRef<HTMLDivElement>(null);
    const motionX = useMotionValue(0);
    const motionY = useMotionValue(0);
    const springX = useSpring(motionX, { stiffness: 100, damping: 20 });
    const springY = useSpring(motionY, { stiffness: 100, damping: 20 });
    
    const rotateX = useTransform(springY, [-0.5, 0.5], ["12deg", "-12deg"]);
    const rotateY = useTransform(springX, [-0.5, 0.5], ["-12deg", "12deg"]);

    const handleMove = (e: React.MouseEvent) => {
        if(!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        motionX.set((e.clientX - rect.left) / rect.width - 0.5);
        motionY.set((e.clientY - rect.top) / rect.height - 0.5);
    }
    const handleLeave = () => {
        motionX.set(0);
        motionY.set(0);
    }

    return (
        <motion.div
            ref={ref}
            style={{
                position: 'absolute',
                left: `${getPos(x)}%`,
                top: `calc(${getSize(y)}vw + ${mediaOffsetVh}vh)`,
                width: `${getSize(width)}vw`,
                height: `${getSize(height)}vw`,
                zIndex: 40,
                perspective: 1000,
                pointerEvents: 'auto'
            }}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay, duration: 0.8, type: "spring" }}
            viewport={{ once: true, margin: "-100px" }}
        >
             <motion.div
                className="w-full h-full cursor-pointer group"
                style={{ rotateX, rotateY, rotateZ: rotate, transformStyle: "preserve-3d" }}
                whileHover={{ scale: 1.05, z: 20 }}
             >
                <div className="w-full h-full rounded-2xl overflow-hidden bg-gray-200 shadow-xl relative transform-style-3d border border-white/20">
                     {imgUrl ? (
                        <img 
                            src={imgUrl} 
                            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                            alt="Card"
                        />
                     ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 font-mono text-xs">IMG</div>
                     )}
                     <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay" />
                     <div className="absolute inset-0 border border-black/5 rounded-2xl pointer-events-none" />
                </div>
             </motion.div>
        </motion.div>
    );
}

// 🟢 NEW CONFIG INTERFACE FOR FREE ARRANGEMENT
interface WaveItemConfig {
    url: string;
    x: number;      // Horizontal offset (relative to group origin)
    y: number;      // Vertical offset (relative to group origin)
    width: number;  // Width in design px
    rotate?: number;
    zIndex?: number;
    delay?: number;
}

// 🟢 REFACTORED WAVE IMAGE GROUP (Supports Free Layout)
const WaveImageGroup: React.FC<{
    groupX: number;
    groupY: number;
    items: WaveItemConfig[];
    mediaOffsetVh: number;
    designWidth?: number;
    modalWidthVw?: number;
}> = ({ groupX, groupY, items, mediaOffsetVh, designWidth = 1920, modalWidthVw = 57 }) => {
    const getSize = (px: number) => (px / designWidth) * modalWidthVw; 
    const getLeft = (px: number) => (px / designWidth) * 100; 

    return (
        <>
            {items.map((item, idx) => {
                const absoluteX = groupX + item.x;
                const absoluteY = groupY + item.y;
                return (
                    <motion.div
                        key={idx}
                        style={{ 
                            position: 'absolute', 
                            left: `${getLeft(absoluteX)}%`, 
                            top: `calc(${getSize(absoluteY)}vw + ${mediaOffsetVh}vh)`,
                            width: `${getSize(item.width)}vw`,
                            zIndex: 35 + (item.zIndex || 0),
                            pointerEvents: 'none'
                        }}
                        initial={{ y: 150, opacity: 0, rotate: (item.rotate || 0) + 15 }}
                        whileInView={{ y: 0, opacity: 1, rotate: item.rotate || 0 }}
                        transition={{ 
                            delay: item.delay || (idx * 0.15), 
                            duration: 1.2, 
                            type: "spring", 
                            bounce: 0.3 
                        }}
                        viewport={{ once: true, margin: "0px" }}
                    >
                        <img 
                            src={item.url} 
                            alt={`Wave ${idx}`} 
                            style={{ 
                                width: '100%', 
                                height: 'auto', 
                                display: 'block',
                                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))' // Add depth
                            }} 
                        />
                    </motion.div>
                );
            })}
        </>
    );
}

interface SequenceConfig {
    baseUrl: string;
    suffix: string;
    digits: number;
    frameCount: number;
    startIndex?: number;
}

const ImageSequencePlayer: React.FC<{ 
    config: SequenceConfig, 
    heightVh: number, 
    onScrollRef: (el: HTMLDivElement | null) => void,
    id: number 
}> = ({ config, heightVh, onScrollRef, id }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    
    useEffect(() => {
        let loadedCount = 0;
        const total = config.frameCount;
        const startIndex = config.startIndex ?? 1;
        const imgs: HTMLImageElement[] = [];

        setIsLoaded(false);

        for (let i = 0; i < total; i++) {
            const img = new Image();
            const currentFileNumber = startIndex + i;
            const numStr = config.digits > 0 
                ? currentFileNumber.toString().padStart(config.digits, '0') 
                : currentFileNumber.toString();
            const fileName = `${config.baseUrl}${numStr}${config.suffix}`;
            img.src = fileName;

            img.onload = () => {
                loadedCount++;
                if (loadedCount === total) setIsLoaded(true);
            };
            img.onerror = () => { loadedCount++; if (loadedCount === total) setIsLoaded(true); }
            imgs.push(img);
        }
        imagesRef.current = imgs;
    }, [config]);

    useEffect(() => {
        onScrollRef(containerRef.current);
    }, [onScrollRef]);

    useEffect(() => {
        if (containerRef.current) {
            (containerRef.current as any).updateFrame = (progress: number) => {
                if (!canvasRef.current || imagesRef.current.length === 0) return;
                const ctx = canvasRef.current.getContext('2d');
                if (!ctx) return;
                const frameIndex = Math.min(config.frameCount - 1, Math.floor(progress * (config.frameCount - 1)));
                const img = imagesRef.current[frameIndex];
                const cw = canvasRef.current.width;
                const ch = canvasRef.current.height;
                ctx.clearRect(0,0,cw,ch);

                if (img && img.complete && img.naturalWidth > 0) {
                    const iw = img.naturalWidth;
                    const ih = img.naturalHeight;
                    const scale = Math.max(cw / iw, ch / ih);
                    const x = (cw - iw * scale) / 2;
                    const y = (ch - ih * scale) / 2;
                    ctx.drawImage(img, x, y, iw * scale, ih * scale);
                }
            };
        }
    }, [config, isLoaded]);

    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div ref={containerRef} className="relative z-30 video-scroll-section" style={{ height: `${heightVh}vh` }} data-sequence-id={id}>
            <div className="sticky top-0 w-full h-[100vh] overflow-hidden flex items-center justify-center bg-black">
                <canvas ref={canvasRef} className="w-full h-full block" />
            </div>
        </div>
    );
};

const FloorMarquee: React.FC<{ direction: 'left' | 'right', text: string, className?: string, rotate?: number, style?: React.CSSProperties }> = React.memo(({ direction, text, className, rotate = 0, style }) => {
    return (
        <div 
            className="absolute left-[-20%] w-[140%] pointer-events-auto overflow-visible flex group"
            style={{ transform: `translateZ(${DEPTHS.PROJECTS - 40}px) rotate(${rotate}deg)`, zIndex: 0, ...style }}
        >
            <motion.div
                className={`flex whitespace-nowrap ${className}`}
                initial={{ x: direction === 'left' ? '0%' : '-50%' }}
                animate={{ x: direction === 'left' ? '-50%' : '0%' }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
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

const ProjectImageSquare: React.FC<{ 
    project: any, style: any, onClick: () => void, onHoverStart: () => void, onHoverEnd: () => void, isHovered: boolean, isAnyHovered: boolean, isSelected: boolean 
}> = React.memo(({ project, style, onClick, onHoverStart, onHoverEnd, isHovered, isAnyHovered, isSelected }) => {
    const individualScale = (style as any).scale ?? 1;
    const baseScale = isHovered ? 1.21 : (isAnyHovered ? 0.9 : 1);
    const targetScale = baseScale * individualScale * CARDS_GLOBAL_SCALE;
    
    return (
        <motion.div
            initial={{ opacity: 0, x: -300, rotate: Math.random() * 20 - 10 }}
            whileInView={{ opacity: 1, x: 0, rotate: style.rotate as number || 0 }}
            animate={{ scale: targetScale, opacity: isHovered ? 1 : (isAnyHovered ? 0.7 : 1), rotate: isHovered ? 0 : (style.rotate as number || 0), y: isHovered ? -40 : 0 }}
            // 🟢 OPTIMIZED: Increased stiffness for snappier feel
            transition={{ type: "spring", stiffness: 120, damping: 18, mass: 1 }}
            onMouseEnter={onHoverStart} onMouseLeave={onHoverEnd} onClick={onClick}
            // 🟢 OPTIMIZED: Added transform-gpu and will-change-transform
            className="absolute cursor-pointer w-[380px] h-[380px] perspective-1000 group will-change-transform transform-gpu"
            style={{ ...style, transformStyle: "preserve-3d" }}
        >
             <motion.div className="w-full h-full" animate={{ y: [0, -10, 0], rotateZ: [0, 1, 0], z: [0, 15, 0] }} transition={{ duration: 4 + Math.random(), repeat: Infinity, ease: "easeInOut" }} style={{ transformStyle: "preserve-3d" }}>
                 <div className="absolute inset-0 rounded-[2.5rem] bg-white/20 border border-white/20 pointer-events-none" style={{ transform: 'translateZ(-10px)', boxShadow: '30px 30px 60px rgba(0,0,0,0.15)' }} />
                <Spotlight3D className="w-full h-full rounded-[2.5rem] bg-white/20 backdrop-blur-md border border-white/40 shadow-sm" color={project.shadowColor || project.color} spotlightColor="transparent">
                    <div className="w-full h-full p-4 relative">
                        <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-gray-100 relative shadow-inner group">
                            {project.layout === '3d-scene' ? (
                                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white font-bold text-center p-4">
                                    <span className="relative z-10 text-xl tracking-widest border border-white/30 px-4 py-2 rounded-lg backdrop-blur">ENTER<br/>3D GALLERY</span>
                                </div>
                            ) : (
                                <motion.img src={project.img} alt={project.title} className="w-full h-full object-cover transform transition-all duration-500 ease-out group-hover:scale-105 filter grayscale contrast-75 opacity-80 group-hover:grayscale-0 group-hover:contrast-100 group-hover:opacity-100" decoding="async" loading="lazy" />
                            )}
                        </div>
                    </div>
                </Spotlight3D>
             </motion.div>
        </motion.div>
    );
});

// 🟢 [UPDATED] Floating Tool Card Component with Config
const FloatingToolIcon: React.FC<{ tool: string, index: number }> = ({ tool, index }) => {
    const config = PREVIEW_LAYOUT_CONFIG.icons;
    const randomRotate = useMemo(() => Math.random() * 40 - 20, []);
    const randomY = useMemo(() => Math.random() * config.randomness - (config.randomness / 2), []);
    const randomXOffset = useMemo(() => Math.random() * config.randomness, []);
    
    // Position Calculation using Config
    const topPos = config.startY + (index * config.gapY) + randomY;
    const leftPos = config.startX + (index * config.gapX) + randomXOffset;
    
    // 🟢 Calculate Exit Rotation (Throwing effect)
    const enterRotate = useMemo(() => Math.random() * 90 - 45, []); // Random Start Rotate
    const exitRotate = useMemo(() => Math.random() * 120 - 60, []); // Random Exit Rotate

    return (
        <motion.div
            // 🟢 UPDATED CLASSNAME: Extremely transparent (bg-white/5), High Blur (backdrop-blur-2xl), White Border
            className={`absolute ${config.sizeClass} bg-white/5 backdrop-blur-2xl border border-white/30 shadow-[0_4px_24px_0_rgba(0,0,0,0.05)] rounded-2xl flex items-center justify-center will-change-transform z-50 transform-gpu`}
            initial={{ x: 500, opacity: 0, rotate: enterRotate + 90, scale: 0.5 }}
            animate={{ x: 0, opacity: 1, rotate: randomRotate, scale: 1 }}
            // 🟢 UPDATED EXIT: Throwing out with rotation and scale down
            exit={{ 
                x: 600, 
                y: Math.random() * 200 - 100, // Scatter vertically
                opacity: 0, 
                rotate: exitRotate, // Spin out
                scale: 0.5 
            }}
            // 🟢 OPTIMIZED: Faster, snappier transition (Stiffness 150)
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.8, delay: 0.05 + (index * 0.03) }}
            style={{ top: topPos, left: leftPos, transformStyle: "preserve-3d" }}
        >
             <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full flex items-center justify-center p-3 relative"
             >
                {/* Subtle Inner Highlight */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                
                {TOOL_ICONS[tool] ? (
                    <img src={TOOL_ICONS[tool]} alt={tool} className="w-full h-full object-contain drop-shadow-sm opacity-90 relative z-10" />
                ) : (
                    <span className="text-[10px] font-bold text-[#1d1d1f] relative z-10">{tool.substring(0, 2)}</span>
                )}
             </motion.div>
        </motion.div>
    );
});

// 🟢 [UPDATED] Full Featured Right Preview Card with Layout Config
const RightPreviewCard: React.FC<{ project: any, handleProjectEnter: () => void, handleProjectLeave: () => void, setSelectedProject: (p: any) => void }> = React.memo(({ project, handleProjectEnter, handleProjectLeave, setSelectedProject }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const config = PREVIEW_LAYOUT_CONFIG;
    
    // 🟢 Randomized Entry and Exit Rotations for dynamic effect
    const enterRotate = useMemo(() => Math.random() * 20 - 10, []); 
    const exitRotate = useMemo(() => Math.random() * 30 - 15, []);

    const handleMouseMove = ({ clientX, clientY }: React.MouseEvent) => {
        if (!cardRef.current) return;
        const { left, top } = cardRef.current.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    return (
        <motion.div
            className="absolute will-change-transform perspective-1000 transform-gpu"
            style={{
                top: config.card.top, 
                right: config.card.right, 
                width: config.card.width, 
                height: config.card.height,
                zIndex: 50,
                transformStyle: "preserve-3d", 
            }}
        >
            {project.tools && project.tools.map((tool: string, idx: number) => (
                <FloatingToolIcon key={`${tool}-${idx}`} tool={tool} index={idx} />
            ))}

            <motion.div 
                ref={cardRef} 
                onMouseMove={handleMouseMove} 
                onMouseEnter={handleProjectEnter} 
                onMouseLeave={handleProjectLeave} 
                onClick={() => setSelectedProject(project)} 
                className="relative w-full h-full cursor-pointer will-change-transform transform-gpu"
                style={{ transformStyle: "preserve-3d", transform: `translateZ(${DEPTHS.PROJECTS + 150}px)` }} 
                // 🟢 Random Entrance
                initial={{ opacity: 0, x: 400, rotate: enterRotate, scale: 0.9 }} 
                animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }} 
                // 🟢 Random Exit
                exit={{ 
                    opacity: 0, 
                    x: 600, 
                    rotate: exitRotate, // Spin out with random angle
                    scale: 0.85 
                }}
                // 🟢 OPTIMIZED: Snappier transition
                transition={{ type: "spring", stiffness: 120, damping: 16 }}
            >
                <motion.div 
                    className="w-full h-full" 
                    animate={{ y: [0, -8, 0], x: [0, 4, 0], rotateZ: [0, 0.5, 0] }} 
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} 
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* 🟢 iOS Glass Effect Container */}
                    <div className={`w-full h-full ${config.card.borderRadius} relative overflow-hidden group shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] transition-shadow duration-300 hover:shadow-2xl border border-white/30`}>
                        {/* 1. Ultra-transparent background */}
                        <div className={`absolute inset-0 bg-white/5 backdrop-blur-2xl ${config.card.borderRadius}`} />
                        
                        {/* 2. Subtle Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-40 pointer-events-none" />
                        
                        {/* 3. Mouse Follow Glow (Simplified mask for performance) */}
                        <motion.div 
                            className={`absolute -inset-[1px] ${config.card.borderRadius} z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl`} 
                            style={{ 
                                background: project.color, 
                                opacity: 0.1,
                                maskImage: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, black, transparent)`, 
                                WebkitMaskImage: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, black, transparent)` 
                            }} 
                        />

                        {/* Card Content Layout using Config */}
                        <div className={`relative z-10 flex flex-col h-full justify-between ${config.card.padding}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className={`${config.text.titleSize} font-albert-black text-[#1d1d1f] tracking-tight drop-shadow-sm leading-none ${config.text.titleGap}`}>
                                        {project.title}
                                    </h2>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
                                        <span className={`text-xs font-bold text-gray-400 uppercase tracking-widest ${config.text.labelSize}`}>
                                            {project.label}
                                        </span>
                                    </div>
                                </div>

                                <div 
                                    className={`px-4 py-2 rounded-xl ${config.text.dateStyle} tracking-widest border border-white/30 shadow-sm backdrop-blur-md flex flex-col items-end`}
                                    style={{ 
                                        backgroundColor: 'rgba(255,255,255,0.2)', 
                                        color: '#333' 
                                    }}
                                >
                                    <span className="text-[10px] text-gray-500 mb-0.5">TIMELINE</span>
                                    <span>{project.year}</span>
                                </div>
                            </div>
                            
                            <p className={`${config.text.descSize} text-gray-600 font-albert-regular leading-relaxed max-w-xl ${config.text.descLineClamp}`}>
                                {project.desc}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
});

const VideoSection: React.FC<{ url: string, heightVh: number, onScrollRef: (el: HTMLDivElement | null) => void, videoId: number, registerVideo: (id: number, el: HTMLVideoElement) => void }> = ({ url, heightVh, onScrollRef, videoId, registerVideo }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        onScrollRef(containerRef.current);
        if (videoRef.current) {
            registerVideo(videoId, videoRef.current);
        }
    }, [onScrollRef, registerVideo, videoId]);

    return (
        <div 
            ref={containerRef}
            className="relative z-30 video-scroll-section"
            style={{ height: `${heightVh}vh` }} 
            data-video-height={heightVh}
        >
            <div className="sticky top-0 w-full h-[100vh] overflow-hidden flex items-center justify-center bg-black">
                <video ref={videoRef} src={url} className="w-full h-full object-cover" muted playsInline preload="auto" />
            </div>
        </div>
    );
};

const ImageBlock: React.FC<{ url: string, index: number }> = ({ url, index }) => {
    if (!url) return null;
    return (
        <div className="w-full bg-black relative z-40">
            <img src={url} className="w-full h-auto block" loading="lazy" decoding="async" alt={`Project Detail ${index}`} />
        </div>
    );
};

// --- NEW COMPONENT: Gallery Modal View ---
const GalleryModalView: React.FC<{ images: string[], project: any }> = ({ images, project }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const sectionRefs = useRef<Map<number, HTMLDivElement>>(new Map());
    const videoElements = useRef<Map<number, HTMLVideoElement>>(new Map());
    const videoStates = useRef<Map<number, { targetTime: number, currentTime: number }>>(new Map());
    const [scrollVal, setScrollVal] = useState(0);
    const [mouseVal, setMouseVal] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const [thumbState, setThumbState] = useState({ height: 0, top: 0 });
    const scrollTimeout = useRef<any>(null);

    const hasSeq1 = !!project.sequenceConfig1;
    const hasVideo1 = !!project.scrollVideoUrl;

    const registerVideo = (id: number, el: HTMLVideoElement) => {
        videoElements.current.set(id, el);
    };

    useEffect(() => {
        let animationFrameId: number;

        const updateFrames = () => {
            sectionRefs.current.forEach((section, id) => {
                if (!section) return;
                const rect = section.getBoundingClientRect();
                const containerRect = scrollContainerRef.current?.getBoundingClientRect();
                if(!containerRect) return;

                const viewportHeight = containerRect.height;
                const sectionHeight = section.clientHeight;
                const scrollDistance = sectionHeight - viewportHeight;
                const distanceTop = containerRect.top - rect.top;
                let progress = 0;
                if (scrollDistance > 0) {
                    progress = distanceTop / scrollDistance;
                    progress = Math.max(0, Math.min(1, progress));
                }

                if ((section as any).updateFrame) {
                    (section as any).updateFrame(progress);
                } else {
                    const video = videoElements.current.get(id);
                    if (video && video.duration) {
                        if (!videoStates.current.has(id)) {
                            videoStates.current.set(id, { targetTime: 0, currentTime: 0 });
                        }
                        const state = videoStates.current.get(id)!;
                        state.targetTime = video.duration * progress;
                        
                        const diff = state.targetTime - state.currentTime;
                        if (Math.abs(diff) > 0.001) {
                            state.currentTime += diff * 0.15;
                            video.currentTime = state.currentTime;
                        }
                    }
                }
            });
            animationFrameId = requestAnimationFrame(updateFrames);
        };
        animationFrameId = requestAnimationFrame(updateFrames);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const el = scrollContainerRef.current;
            const scrollTop = el.scrollTop;
            setScrollVal(Math.round(scrollTop));
            const { scrollHeight, clientHeight } = el;
            const heightPerc = (clientHeight / scrollHeight) * 100;
            const topPerc = (scrollTop / scrollHeight) * 100;

            setThumbState({ height: Math.max(heightPerc, 5), top: topPerc });
            setIsScrolling(true);
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
            scrollTimeout.current = setTimeout(() => { setIsScrolling(false); }, 600);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => { setMouseVal(Math.round(e.clientX)); };

    const DESIGN_WIDTH = 1920;
    const SCALE_FACTOR = 0.6; 
    const MODAL_WIDTH_VW = 95 * SCALE_FACTOR; 
    const getPos = (x: number, y: number) => ({
        left: `${(x / DESIGN_WIDTH) * 100}%`, 
        top: `${(y / DESIGN_WIDTH) * MODAL_WIDTH_VW}vw` 
    });
    const getSize = (size: number) => `${(size / DESIGN_WIDTH) * MODAL_WIDTH_VW}vw`;
    const textConfig = project.detailText;
    const mediaHeight1 = hasSeq1 ? VIDEO_1_SCROLL_HEIGHT_VH : (hasVideo1 ? VIDEO_1_SCROLL_HEIGHT_VH : 0);
    const mediaHeight2 = 0; 

    // 🟢 自由布局配置区域 (Free Layout Configuration)
    // 修改这里的 x, y, rotate, width 即可自由控制这三张图片的位置
    const waveImagesConfig: WaveItemConfig[] = [
        { 
            url: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%95%BF%E5%9B%BE/down.png',
            x: -260,    // 相对 x=465 的偏移
            y: 8000,    // 相对 y=8322 的偏移
            width: 1500,
            rotate: 0,
            zIndex: 3,
            delay: 0.1
        },
        { 
            url: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%95%BF%E5%9B%BE/midle.png',
            x: -260,  
            y: 7800,   // 向上错位
            width: 1500,
            rotate: 0,
            zIndex: 2,
            delay: 0.2
        },
        { 
            url: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%95%BF%E5%9B%BE/up.png',
            x: -260,  
            y: 7600,    // 向下错位
            width: 1500,
            rotate: 0,
            zIndex: 1,
            delay: 0.3
        }
    ];

    const group1Cards = [
        { id: 1, xOffset: -250,   yOffset: 7600, width: 360, height: 208, rotate: 0, img: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%95%BF%E5%9B%BE/1.png' },
        { id: 2, xOffset: 125, yOffset: 7600, width: 360, height: 125, rotate: 0, img: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%95%BF%E5%9B%BE/2.png' },
        { id: 3, xOffset: 500, yOffset: 7600, width: 360, height: 172, rotate: 0, img: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%95%BF%E5%9B%BE/3.png' },
        { id: 4, xOffset: 875, yOffset: 7600, width: 360, height: 208, rotate: 0, img: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%95%BF%E5%9B%BE/4.png' }
    ];
    const group3Cards = [
        { id: 1, xOffset: 0,   yOffset: 9000, width: 368, height: 512, rotate: 5, img: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%95%BF%E5%9B%BE/d1.png' },
        { id: 2, xOffset: 320, yOffset: 9050, width: 368, height: 512, rotate: -4, img: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%95%BF%E5%9B%BE/d2.png' },
        { id: 3, xOffset: 640, yOffset: 9020, width: 368, height: 512, rotate: 3, img: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%95%BF%E5%9B%BE/d3.png' },
        { id: 4, xOffset: 960, yOffset: 9060, width: 368, height: 512, rotate: -6, img: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%95%BF%E5%9B%BE/d4.png' }
    ];

    return (
        <div className="relative w-full h-full bg-black overflow-hidden">
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                onMouseMove={handleMouseMove}
                className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar relative z-10 p-0"
            >
                <div className="fixed top-24 right-10 z-[70] font-mono text-[10px] text-green-400 bg-black/80 backdrop-blur-md px-3 py-2 rounded border border-green-500/30 pointer-events-none tracking-widest flex flex-col gap-1 shadow-lg">
                    <span className="flex justify-between gap-4"><span>SCROLL Y:</span> <span>{scrollVal}</span></span>
                    <span className="flex justify-between gap-4"><span>MOUSE X:</span> <span>{mouseVal}</span></span>
                    <span className="text-orange-400 font-bold">MODE: {hasSeq1 ? 'CANVAS-SEQ' : 'VIDEO-SMOOTH'}</span>
                </div>

                <div className="relative w-full mx-auto">
                    <ImageBlock url={images[0]} index={0} />
                    <ImageBlock url={images[1]} index={1} />

                    {hasSeq1 ? (
                        <ImageSequencePlayer config={project.sequenceConfig1} heightVh={VIDEO_1_SCROLL_HEIGHT_VH} onScrollRef={(el) => { if(el) sectionRefs.current.set(1, el); }} id={1} />
                    ) : hasVideo1 && (
                        <VideoSection url={project.scrollVideoUrl} heightVh={VIDEO_1_SCROLL_HEIGHT_VH} onScrollRef={(el) => { if(el) sectionRefs.current.set(1, el); }} videoId={1} registerVideo={registerVideo} />
                    )}

                    <ImageBlock url={images[2]} index={2} />

                    <div className="absolute inset-0 w-full h-full pointer-events-none z-50">
                        {textConfig && (
                            <>
                                <motion.div style={{ position: 'absolute', ...getPos(215, 3015) }} initial={{ x: -100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                                    <span style={{ fontFamily: "'Franklin Gothic Medium Cond', sans-serif", fontSize: getSize(240), lineHeight: '1', color: 'white' }} className="block drop-shadow-2xl">{textConfig.main}</span>
                                </motion.div>
                                <motion.div style={{ position: 'absolute', ...getPos(228, 3235) }} initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}>
                                     <span style={{ fontFamily: "'OPPOSans H', sans-serif", fontSize: getSize(14), color: 'white', fontWeight: '900', letterSpacing: '1px' }} className="block drop-shadow-lg">{textConfig.sub}</span>
                                </motion.div>
                                 <motion.div style={{ position: 'absolute', ...getPos(1535, 3170) }} initial={{ x: 100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                                     <span style={{ fontFamily: "'Arizonia', cursive", fontSize: getSize(80), color: 'white' }} className="block drop-shadow-lg">{textConfig.signature}</span>
                                </motion.div>
                                <motion.div style={{ position: 'absolute', left: getPos(215, 5005).left, top: `calc(${getPos(215, 3605).top} + ${mediaHeight1}vh)` }} initial={{ x: -100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                                    <span style={{ fontFamily: "'Franklin Gothic Medium Cond', sans-serif", fontSize: getSize(240), lineHeight: '1', color: 'white' }} className="block drop-shadow-2xl">Rabbi</span>
                                </motion.div>
                                <motion.div style={{ position: 'absolute', left: getPos(228, 5225).left, top: `calc(${getPos(228, 3825).top} + ${mediaHeight1}vh)` }} initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}>
                                     <span style={{ fontFamily: "'OPPOSans H', sans-serif", fontSize: getSize(14), color: 'white', fontWeight: '900', letterSpacing: '1px' }} className="block drop-shadow-lg">好奇心先锋 CURIOSITY PIONEER</span>
                                </motion.div>
                                 <motion.div style={{ position: 'absolute', left: getPos(1315, 5155).left, top: `calc(${getPos(1315, 3755).top} + ${mediaHeight1}vh)` }} initial={{ x: 100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                                     <span style={{ fontFamily: "'Arizonia', cursive", fontSize: getSize(80), color: 'white' }} className="block drop-shadow-lg">Rabbi</span>
                                </motion.div>
                                {[
                                    { name: 'Carro', sub: '环保监督员 ENVIRONMENTAL SUPERVISOR', yName: 5876, ySub: 6091, ySig: 6026 },
                                    { name: 'Ollie', sub: '情感纽带 EMOTIONAL BOND', yName: 8145, ySub: 8363, ySig: 8285 },
                                    { name: 'Oliver', sub: '智慧守护者 THE WISDOM GUIDE', yName: 10420, ySub: 10642, ySig: 10565 }
                                ].map((item, idx) => (
                                    <React.Fragment key={item.name}>
                                        <motion.div style={{ position: 'absolute', left: getPos(215, item.yName).left, top: `calc(${getPos(215, item.yName).top} + ${mediaHeight1 + mediaHeight2}vh)` }} initial={{ x: -100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                                            <span style={{ fontFamily: "'Franklin Gothic Medium Cond', sans-serif", fontSize: getSize(240), lineHeight: '1', color: 'white' }} className="block drop-shadow-2xl">{item.name}</span>
                                        </motion.div>
                                        <motion.div style={{ position: 'absolute', left: getPos(230, item.ySub).left, top: `calc(${getPos(230, item.ySub).top} + ${mediaHeight1 + mediaHeight2}vh)` }} initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}>
                                            <span style={{ fontFamily: "'OPPOSans H', sans-serif", fontSize: getSize(14), color: 'white', fontWeight: '900', letterSpacing: '1px' }} className="block drop-shadow-lg">{item.sub}</span>
                                        </motion.div>
                                        <motion.div style={{ position: 'absolute', left: getPos(1515, item.ySig).left, top: `calc(${getPos(1515, item.ySig).top} + ${mediaHeight1 + mediaHeight2}vh)` }} initial={{ x: 100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                                            <span style={{ fontFamily: "'Arizonia', cursive", fontSize: getSize(80), color: 'white' }} className="block drop-shadow-lg">{item.name}</span>
                                        </motion.div>
                                    </React.Fragment>
                                ))}
                                {group1Cards.map((card, idx) => (
                                    <InteractivePhotoCard key={`g1-${card.id}`} x={465 + card.xOffset} y={7745 + card.yOffset} width={card.width} height={card.height} rotate={card.rotate} imgUrl={card.img} delay={idx * 0.1} mediaOffsetVh={mediaHeight1 + mediaHeight2} modalWidthVw={MODAL_WIDTH_VW} />
                                ))}
                                
                                {/* 🟢 Replaced old component with new configurable one */}
                                <WaveImageGroup groupX={465} groupY={8322} items={waveImagesConfig} mediaOffsetVh={mediaHeight1 + mediaHeight2} modalWidthVw={MODAL_WIDTH_VW} />
                                
                                {group3Cards.map((card, idx) => (
                                    <InteractivePhotoCard key={`g3-${card.id}`} x={465 + card.xOffset} y={9355 + card.yOffset} width={card.width} height={card.height} rotate={card.rotate} imgUrl={card.img} delay={idx * 0.1} mediaOffsetVh={mediaHeight1 + mediaHeight2} modalWidthVw={MODAL_WIDTH_VW} />
                                ))}
                            </>
                        )}
                    </div>
                    <div className="w-full py-32 text-center bg-black">
                        <p className="text-white/30 text-sm">End of Project Gallery</p>
                    </div>
                </div>
            </div>
            <div className={`absolute right-1.5 top-0 bottom-0 w-1.5 pointer-events-none transition-opacity duration-500 ease-out z-50 mix-blend-difference ${isScrolling ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute w-full bg-white/60 rounded-full backdrop-blur-md" style={{ height: `${thumbState.height}%`, top: `${thumbState.top}%`, transition: 'top 0.05s linear' }} />
            </div>
        </div>
    );
};

const VinylProjects: React.FC = () => {
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredProject, setHoveredProject] = useState<any>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
    const floorY = useTransform(scrollYProgress, [0, 1], ["0%", "-200%"]); 
    
    // 🟢 OPTIMIZATION: Debounce Hover Logic
    // This prevents the RightPreviewCard from rapidly mounting/unmounting when the mouse moves quickly across multiple cards.
    // It only triggers if the user hovers for at least 80ms.
    const hoverTimeout = useRef<any>(null);

    const handleProjectHoverStart = useCallback((project: any) => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        hoverTimeout.current = setTimeout(() => {
            setHoveredProject(project);
        }, 80); // 80ms delay
    }, []);

    const handleProjectHoverEnd = useCallback(() => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        // Add a slight delay before hiding to prevent flickering during diagonal movement
        hoverTimeout.current = setTimeout(() => {
            setHoveredProject(null);
        }, 80);
    }, []);

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
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["45deg", "35deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);
    const translateX = useTransform(mouseXSpring, [-0.5, 0.5], ["-2%", "2%"]);

    const cardPositions = useMemo(() => [
        { top: '-26%', left: '10%',  rotate: -15, zIndex: 1, scale: 1.0 }, 
        { top: '20%',  left: '30%', rotate: 12,  zIndex: 2, scale: 1.0 }, 
        { top: '37%',  left: '8%',  rotate: 5,   zIndex: 3, scale: 1.0 }, 
        { top: '62%',  left: '25%', rotate: -9,  zIndex: 4, scale: 1.0 }, 
        { top: '92%',  left: '2%',  rotate: 20,  zIndex: 5, scale: 1.0 }, 
        { top: '117%', left: '32%', rotate: -26, zIndex: 6, scale: 1.0 }, 
        { top: '155%', left: '28%', rotate: -6,   zIndex: 7, scale: 1.03 }, 
        { top: '190%', left: '8%', rotate: 8,  zIndex: 8, scale: 1.06 }, 
    ], []);

    return (
        <section ref={containerRef} className="w-full relative bg-white" onMouseMove={handleMouseMove} style={{ height: '300vh' }}>
             <div id="projects-deck" className="absolute top-0" />
             <motion.div className="sticky top-0 w-full h-screen flex items-center justify-center bg-white will-change-transform overflow-hidden" style={{ zIndex: 10 }}>
                 <div className="absolute inset-0 flex items-center justify-center perspective-2000">
                    <motion.div className="relative w-full max-w-[1600px] will-change-transform transform-gpu" style={{ rotateX, rotateY, x: translateX, scale: 0.65, aspectRatio: '16/9', transformStyle: "preserve-3d" }}>
                        <AnimatePresence mode="wait">
                            {hoveredProject && (
                                <RightPreviewCard 
                                    key={hoveredProject.id} 
                                    project={hoveredProject} 
                                    // Keep the immediate clear for safety on direct interaction
                                    handleProjectEnter={() => {}} 
                                    handleProjectLeave={() => setHoveredProject(null)} 
                                    setSelectedProject={setSelectedProject} 
                                />
                            )}
                        </AnimatePresence>
                        <motion.div className="absolute inset-0 w-full h-full will-change-transform" style={{ y: floorY, transformStyle: "preserve-3d" }}>
                            <div className="absolute inset-[-50%] bg-white transform-preserve-3d" style={{ transform: `translateZ(${DEPTHS.FLOOR}px)` }} />
                            <FloorMarquee direction="left" text="PROJECTS" rotate={-10} className="text-[160px] font-albert-black text-gray-100 leading-none" style={{ top: '-10%', right: '-16%', left: 'auto' }} />
                            <div className="absolute w-full h-full pointer-events-none" style={{ zIndex: 10, transformStyle: "preserve-3d", transform: `translateZ(${DEPTHS.PROJECTS}px)` }}>
                                {projects.map((proj, idx) => (
                                    <div key={proj.id} className="pointer-events-auto">
                                        <ProjectImageSquare 
                                            project={proj} 
                                            style={cardPositions[idx] as any} 
                                            onClick={() => setSelectedProject(proj)} 
                                            onHoverStart={() => handleProjectHoverStart(proj)} 
                                            onHoverEnd={handleProjectHoverEnd} 
                                            isHovered={hoveredProject?.id === proj.id} 
                                            isAnyHovered={!!hoveredProject} 
                                            isSelected={selectedProject?.id === proj.id} 
                                        />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                 </div>
             </motion.div>
             {createPortal(
                <AnimatePresence>
                    {selectedProject && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center perspective-2000">
                            <motion.div initial={{ opacity: 0, backgroundColor: 'rgba(255,255,255,0)' }} animate={{ opacity: 1, backgroundColor: 'rgba(100,100,100,0.95)' }} exit={{ opacity: 0, backgroundColor: 'rgba(255,255,255,0)' }} transition={{ duration: 0.8, ease: "easeInOut" }} className="absolute inset-0 backdrop-blur-md" onClick={() => setSelectedProject(null)} />
                            <motion.div 
                                initial={{ y: "110%", opacity: 0.5, scale: 0.95 }} 
                                animate={{ y: 0, opacity: 1, scale: 1 }} 
                                exit={{ y: "110%", opacity: 0, scale: 0.95 }} 
                                transition={{ type: "spring", damping: 24, stiffness: 180, mass: 0.8 }} 
                                className={`relative ${[1, 2, 3].includes(selectedProject.id) ? 'w-[60vw]' : 'w-[95vw]'} h-[95vh] rounded-[3rem] pointer-events-auto shadow-2xl overflow-hidden`} 
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button onClick={() => setSelectedProject(null)} className={`absolute top-8 right-8 z-[60] w-12 h-12 flex items-center justify-center rounded-full transition-colors border shadow-lg group ${selectedProject.layout === 'gallery' ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white' : 'bg-white/90 hover:bg-white border-gray-200 text-[#1d1d1f]'}`}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:rotate-90 transition-transform duration-300"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                                <div className="w-full h-full bg-black">
                                    {selectedProject.layout === '3d-scene' ? <Interactive3DGallery /> : selectedProject.layout === 'gallery' ? <GalleryModalView images={selectedProject.detailImages || []} project={selectedProject} /> : null}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>, document.body
             )}
        </section>
    );
};

export default VinylProjects;