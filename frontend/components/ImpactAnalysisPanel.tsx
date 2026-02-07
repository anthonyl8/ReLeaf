
import React from 'react';

const ImpactAnalysisPanel: React.FC = () => {
    return (
        <div className="p-6 border-b border-[#28392c]">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Impact Analysis</h3>
            {/* Metric Card 1 */}
            <div className="mb-6">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-gray-300 text-sm">Avg Surface Temp</span>
                    <span className="text-primary font-bold text-sm flex items-center">
                        <span className="material-symbols-outlined text-base mr-0.5">arrow_downward</span>
                        4.2°C
                    </span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">28.4°C</span>
                    <span className="text-sm text-gray-500 line-through">32.6°C</span>
                </div>
                <div className="w-full bg-[#111813] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-primary h-full rounded-full w-[65%]"></div>
                </div>
            </div>
            {/* Metric Card 2 */}
            <div className="mb-6">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-gray-300 text-sm">Canopy Coverage</span>
                    <span className="text-primary font-bold text-sm flex items-center">
                        <span className="material-symbols-outlined text-base mr-0.5">arrow_upward</span>
                        15%
                    </span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">27%</span>
                    <span className="text-sm text-gray-500">Target: 30%</span>
                </div>
                <div className="w-full bg-[#111813] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full w-[85%]"></div>
                </div>
            </div>
            {/* Metric Card 3 */}
            <div>
                <div className="flex justify-between items-end mb-1">
                    <span className="text-gray-300 text-sm">Heat Risk Index</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                    <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20">High (Previous)</span>
                    <span className="material-symbols-outlined text-gray-500 text-sm">arrow_forward</span>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded border border-primary/20 font-bold">Moderate</span>
                </div>
            </div>
        </div>
    );
};

export default ImpactAnalysisPanel;
