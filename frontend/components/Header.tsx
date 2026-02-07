
import React from 'react';

interface HeaderProps {
    onSimulate: () => void;
    simulateLoading?: boolean;
    simulateError?: string | null;
}

const Header: React.FC<HeaderProps> = ({ onSimulate, simulateLoading, simulateError }) => {
    return (
        <header className="relative z-20 flex items-center justify-between px-6 py-4 glass-panel border-b border-[#28392c] shadow-lg">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="size-8 text-primary flex items-center justify-center bg-[#28392c] rounded-lg">
                        <span className="material-symbols-outlined text-primary text-[24px]">local_florist</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight leading-none text-white">ReLeaf</h1>
                        <p className="text-text-secondary text-xs font-medium uppercase tracking-wider">Urban Heat Resilience</p>
                    </div>
                </div>
                <div className="h-8 w-px bg-[#28392c]"></div>
                <div className="flex items-center gap-6 hidden md:flex">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                        </span>
                        <span className="text-sm font-medium text-gray-300">Heat Data: Loaded</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                        </span>
                        <span className="text-sm font-medium text-gray-300">AI Vision: Ready</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button className="hidden sm:flex items-center justify-center h-10 px-4 rounded-lg border border-[#28392c] bg-[#1c271e] hover:bg-[#28392c] text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px] mr-2">settings</span>
                    <span className="text-sm font-medium">Settings</span>
                </button>
                {simulateError && (
                    <span className="text-red-400 text-sm mr-2">{simulateError}</span>
                )}
                <button 
                    onClick={onSimulate}
                    disabled={simulateLoading}
                    className="flex items-center justify-center h-10 px-6 rounded-lg bg-primary hover:bg-[#0fd641] text-[#111813] shadow-[0_0_15px_rgba(19,236,73,0.3)] transition-all transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed">
                    <span className="material-symbols-outlined text-[20px] mr-2 font-bold">{simulateLoading ? 'hourglass_empty' : 'play_arrow'}</span>
                    <span className="text-sm font-bold">{simulateLoading ? 'Generating…' : 'Simulate Future'}</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
