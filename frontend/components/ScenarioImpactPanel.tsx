
import React from 'react';

const ScenarioImpactPanel: React.FC = () => {
    return (
        <div className="glass-panel rounded-xl border border-[#28392c] p-5 shadow-xl mt-auto">
            <h3 className="text-white font-semibold text-sm mb-3">Scenario Impact</h3>
            <ul className="space-y-3">
                <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Temp Reduction</span>
                    <span className="font-mono text-primary font-bold">-3.2°C</span>
                </li>
                <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Shade Coverage</span>
                    <span className="font-mono text-primary font-bold">+18%</span>
                </li>
                <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Air Quality Index</span>
                    <span className="font-mono text-blue-400 font-bold">Good</span>
                </li>
            </ul>
        </div>
    );
};

export default ScenarioImpactPanel;
