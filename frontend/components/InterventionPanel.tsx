
import React, { useState } from 'react';

const InterventionPanel: React.FC = () => {
    const [treesPlaced, setTreesPlaced] = useState(12);

    return (
        <div className="glass-panel rounded-xl border border-[#28392c] p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-white font-semibold text-sm uppercase tracking-wide flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">park</span>
                    Intervention Tools
                </h2>
            </div>
            <div className="bg-[#28392c]/50 rounded-lg p-3 border border-[#3b5441] flex flex-col gap-3">
                <button 
                    onClick={() => setTreesPlaced(p => p + 1)}
                    className="group w-full flex items-center justify-center gap-2 py-2.5 bg-[#28392c] hover:bg-primary hover:text-black border border-primary/30 hover:border-primary rounded-lg transition-all duration-200">
                    <span className="material-symbols-outlined text-[20px] group-hover:animate-bounce">add_location_alt</span>
                    <span className="text-sm font-bold">Plant Trees</span>
                </button>
                <div className="flex justify-between items-center px-1">
                    <span className="text-xs text-text-secondary italic">Click map to add trees</span>
                    <span className="text-xs font-mono bg-[#111813] text-primary px-2 py-0.5 rounded border border-primary/20">Placed: {treesPlaced}</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1">
                <button className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#28392c] hover:bg-[#334638] transition-colors border border-transparent hover:border-[#3b5441]">
                    <span className="material-symbols-outlined text-blue-400 text-[24px] mb-1">water_drop</span>
                    <span className="text-[10px] uppercase font-medium text-gray-400">Cool Roof</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#28392c] hover:bg-[#334638] transition-colors border border-transparent hover:border-[#3b5441]">
                    <span className="material-symbols-outlined text-gray-400 text-[24px] mb-1">deck</span>
                    <span className="text-[10px] uppercase font-medium text-gray-400">Pavement</span>
                </button>
            </div>
        </div>
    );
};

export default InterventionPanel;
