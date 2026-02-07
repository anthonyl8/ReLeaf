
import React, { useState, useRef, useCallback, MouseEvent } from 'react';

interface ComparisonSliderProps {
    beforeImage: string;
    afterImage: string;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ beforeImage, afterImage }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        let percentage = (x / rect.width) * 100;
        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;
        setSliderPosition(percentage);
    }, [isDragging]);

    const handleMouseDown = useCallback(() => {
        setIsDragging(true);
    }, []);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    return (
        <div 
            ref={containerRef}
            className="flex-1 relative bg-black group overflow-hidden min-h-[400px] lg:min-h-0 select-none cursor-ew-resize"
            onMouseMove={handleMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
        >
            {/* After Image (Background) */}
            <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${afterImage}')` }}>
                <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay"></div>
            </div>
            
            {/* Before Image (Clipped) */}
            <div className="absolute inset-0 h-full bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url('${beforeImage}')`, width: `${sliderPosition}%` }}>
                <div className="absolute inset-0 bg-red-900/30 mix-blend-overlay"></div>
            </div>

            {/* Labels */}
            <div className="absolute top-6 left-6 bg-black/70 backdrop-blur-md border border-red-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Current Baseline</span>
            </div>
            <div className="absolute top-6 right-6 bg-black/70 backdrop-blur-md border border-primary/30 px-3 py-1.5 rounded-lg flex items-center gap-2 z-10 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(19,236,73,0.8)]"></span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">AI Projected</span>
            </div>
            
            {/* Slider Handle */}
            <div className="absolute top-0 h-full w-0.5 bg-primary" style={{ left: `${sliderPosition}%`, boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}></div>
            <div className="absolute top-1/2 -translate-y-1/2 z-20 flex flex-col items-center group-hover:scale-110 transition-transform pointer-events-none" style={{ left: `${sliderPosition}%`, transform: `translate(-50%, -50%)` }}>
                <div className="bg-surface-dark border-2 border-primary text-white w-10 h-10 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(19,236,73,0.4)]">
                    <span className="material-symbols-outlined text-lg">unfold_more</span>
                </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-4 border border-white/10 pointer-events-none">
                <div className="flex items-center gap-2">
                    <span className="block w-20 h-2 rounded-sm bg-gradient-to-r from-red-600 via-orange-400 to-yellow-300"></span>
                    <span className="text-[10px] text-gray-300 uppercase font-medium">Heat Intensity</span>
                </div>
                <div className="w-px h-4 bg-white/20"></div>
                <div className="flex items-center gap-2">
                    <span className="block w-20 h-2 rounded-sm bg-gradient-to-r from-blue-400 via-teal-400 to-primary"></span>
                    <span className="text-[10px] text-gray-300 uppercase font-medium">Cooling Effect</span>
                </div>
            </div>
        </div>
    );
};

export default ComparisonSlider;
