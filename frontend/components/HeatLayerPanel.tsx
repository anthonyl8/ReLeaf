
import React, { useState } from 'react';

const HeatLayerPanel: React.FC = () => {
    const [showHeatMap, setShowHeatMap] = useState(true);
    const [intensity, setIntensity] = useState(75);

    return (
        <div className="glass-panel rounded-xl border border-[#28392c] p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-white font-semibold text-sm uppercase tracking-wide flex items-center gap-2">
                    <span className="material-symbols-outlined text-orange-400 text-[20px]">thermostat</span>
                    Heat Layer
                </h2>
                <button className="text-text-secondary hover:text-white">
                    <span className="material-symbols-outlined text-[20px]">info</span>
                </button>
            </div>
            <div className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-300">Show Heat Map</span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={showHeatMap} onChange={() => setShowHeatMap(!showHeatMap)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-[#28392c] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-xs text-text-secondary">
                    <span>Intensity</span>
                    <span>{intensity}%</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={intensity} 
                    onChange={(e) => setIntensity(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-[#28392c] rounded-lg appearance-none cursor-pointer accent-orange-500" />
            </div>
            <div className="space-y-1 pt-1">
                <div className="h-3 w-full rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 to-red-600"></div>
                <div className="flex justify-between text-[10px] text-text-secondary font-mono uppercase">
                    <span>Cool</span>
                    <span>Moderate</span>
                    <span>Critical</span>
                </div>
            </div>
        </div>
    );
};

export default HeatLayerPanel;
