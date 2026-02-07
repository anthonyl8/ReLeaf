
import React from 'react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import MapArea from './MapArea';
import LocalTempCard from './LocalTempCard';

interface DashboardProps {
    onSimulate: () => void;
    simulateLoading?: boolean;
    simulateError?: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ onSimulate, simulateLoading, simulateError }) => {
    return (
        <>
            <Header onSimulate={onSimulate} simulateLoading={simulateLoading} simulateError={simulateError} />
            <main className="relative z-10 flex-1 flex p-6 gap-6 pointer-events-none">
                <LeftSidebar />
                <div className="flex-1 flex flex-col items-end pointer-events-none">
                    <LocalTempCard />
                </div>
            </main>
            <MapArea />
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                <div className="glass-panel px-4 py-2 rounded-full border border-[#28392c] flex items-center gap-2">
                    <span className="material-symbols-outlined text-text-secondary text-[16px]">mouse</span>
                    <span className="text-xs text-gray-300">Right-click and drag to rotate view</span>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
