import React from 'react';

interface PatternPlaceholderProps {
  color: string;
  number?: string | number;
  className?: string;
}

const PatternPlaceholder: React.FC<PatternPlaceholderProps> = ({ color, number, className = "" }) => {
  return (
    <div 
        className={`w-full h-full overflow-hidden relative ${className}`} 
        style={{
            backgroundColor: color,
            backgroundImage: `
                linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)
            `,
            backgroundSize: '40px 40px'
        }}
    >
        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
        
        {/* Inner Grain/Noise (Simulated with radial gradient overlay) */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
        />

        {number && (
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-albert-black text-white/20 text-6xl md:text-8xl select-none">
                    {number.toString().padStart(2, '0')}
                </span>
            </div>
        )}
        
        {/* Border inset */}
        <div className="absolute inset-4 border border-white/10 rounded-[inherit] pointer-events-none" />
    </div>
  );
};

export default PatternPlaceholder;