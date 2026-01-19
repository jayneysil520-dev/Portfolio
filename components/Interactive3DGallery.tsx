import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, ScrollControls, Scroll, useScroll, Html, ContactShadows, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

// --- CRITICAL FIX: MANUALLY DECLARE R3F TYPES TO PREVENT ERRORS ---
// We keep this just in case, though installing the packages usually solves it.
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      torusKnotGeometry: any;
      meshStandardMaterial: any;
      sphereGeometry: any;
      boxGeometry: any;
      ambientLight: any;
      spotLight: any;
      pointLight: any;
      primitive: any; // Important for useGLTF
      // Catch-all to prevent other missing element errors
      [elemName: string]: any;
    }
  }
}

// --- ROTATING MODEL COMPONENT ---
// This component rotates and moves based on scroll
const ScrollBasedModel: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const scroll = useScroll(); // Hook into ScrollControls
  
  // 🟢 FIX: Added explicit types to state and delta to prevent TS7006 error
  useFrame((state: any, delta: number) => {
    if (!meshRef.current) return;
    
    // Access the scroll offset (0 to 1)
    const r = scroll.offset;

    // 1. ROTATION: Spin the object as you scroll down
    // Rotate Y fully 360 degrees (2*PI) * 2 times
    meshRef.current.rotation.y = THREE.MathUtils.damp(meshRef.current.rotation.y, r * Math.PI * 4, 4, delta);
    // Slight X tilt
    meshRef.current.rotation.x = THREE.MathUtils.damp(meshRef.current.rotation.x, r * Math.PI, 4, delta);

    // 2. POSITION: Move slightly based on scroll to feel dynamic
    // Moves from x=0 to x=-2 over the scroll
    // meshRef.current.position.x = -r * 2;
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={meshRef} position={[0, 0, 0]} scale={1.2}>
            {/* Using a TorusKnot as a placeholder for a complex 3D object */}
            <torusKnotGeometry args={[1, 0.35, 128, 32]} />
            {/* Shiny, colorful material */}
            <meshStandardMaterial 
                color="#4ECDC4" 
                roughness={0.1} 
                metalness={0.6}
                emissive="#000000"
            />
        </mesh>
    </Float>
  );
};

// --- SCENE COMPOSITION ---
const Scene: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#ff0000" />
      
      <Environment preset="city" />

      {/* The Interactive Model */}
      <ScrollBasedModel />

      {/* Shadow */}
      <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.25} far={10} color="#000000" />
    </>
  );
};

const Interactive3DGallery: React.FC = () => {
  return (
    // 🟢 ISOLATION: Relative position ensures Canvas is contained here.
    // 'isolate' creates a new stacking context.
    <div className="w-full h-full bg-gray-50 relative isolate overflow-hidden">
      
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 40 }}>
        {/* 
            ScrollControls creates a virtual scroll container inside the Canvas.
            pages={4} means the scrollable height is 400% of the view height.
            damping={0.2} adds smooth momentum.
        */}
        <ScrollControls pages={4} damping={0.2}>
            
            <Suspense fallback={null}>
                <Scene />
            </Suspense>

            {/* --- HTML OVERLAY LAYER --- */}
            {/* Elements inside <Scroll html> will scroll with the 3D content */}
            <Scroll html style={{ width: '100%', height: '100%' }}>
                
                {/* PAGE 1: INTRO */}
                <div className="w-full h-full flex items-center justify-start px-10 md:px-32 pointer-events-none">
                    <div className="max-w-xl">
                        <h1 className="text-6xl md:text-8xl font-black text-black/90 mb-4 tracking-tighter leading-none">
                            IMMERSE<br/>YOURSELF
                        </h1>
                        <p className="text-lg text-gray-500 font-bold bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-lg">
                            Scroll to explore the form.
                        </p>
                    </div>
                </div>
                
                {/* PAGE 2: DETAILS (Appears at 100vh down) */}
                <div className="w-full h-full flex items-center justify-end px-10 md:px-32 pointer-events-none">
                     <div className="max-w-md text-right">
                        <h2 className="text-5xl md:text-7xl font-black text-black/80 mb-4 tracking-tighter">
                            FLUID<br/>MOTION
                        </h2>
                        <p className="text-lg text-gray-500 font-bold bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-lg">
                            Real-time WebGL rendering powered by React Three Fiber.
                        </p>
                    </div>
                </div>

                {/* PAGE 3: TECH SPECS (Appears at 200vh down) */}
                <div className="w-full h-full flex items-end justify-start px-10 md:px-32 pb-32 pointer-events-none">
                     <div className="max-w-lg bg-black/90 backdrop-blur-xl p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl text-white">
                        <h2 className="text-4xl font-bold mb-4 text-[#4ECDC4]">
                            GEOMETRY
                        </h2>
                        <p className="text-gray-400 leading-relaxed">
                            High-fidelity geometry with physically based materials. The object responds to your scroll input, creating a seamless narrative experience.
                        </p>
                    </div>
                </div>

                {/* PAGE 4: OUTRO (Appears at 300vh down) */}
                <div className="w-full h-full flex items-center justify-center px-20 pointer-events-none">
                     <div className="text-center">
                        <h2 className="text-9xl font-black text-black/5 mix-blend-multiply tracking-tighter">
                            FIN
                        </h2>
                    </div>
                </div>

            </Scroll>
        </ScrollControls>
      </Canvas>

      {/* Static UI Overlay (Fixed on top of canvas) */}
      <div className="absolute bottom-8 left-8 pointer-events-none z-10 flex gap-4">
         <div className="px-4 py-2 bg-black/5 backdrop-blur rounded-full text-xs font-mono font-bold text-black/60 border border-black/10">
             SCROLL TO INTERACT
         </div>
      </div>
    </div>
  );
};

export default Interactive3DGallery;