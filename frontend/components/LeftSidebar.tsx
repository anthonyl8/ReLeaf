
import React from 'react';
import HeatLayerPanel from './HeatLayerPanel';
import InterventionPanel from './InterventionPanel';
import ScenarioImpactPanel from './ScenarioImpactPanel';

const LeftSidebar: React.FC = () => {
    return (
        <aside className="w-80 flex flex-col gap-4 pointer-events-auto animate-fade-in-left">
            <HeatLayerPanel />
            <InterventionPanel />
            <ScenarioImpactPanel />
        </aside>
    );
};

export default LeftSidebar;
