
import React from 'react';

const ProposedInterventionsPanel: React.FC = () => {
    return (
        <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Proposed Interventions</h3>
            <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">forest</span>
                    <span>Plant 450 native shade trees along main avenues.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-blue-400 text-lg mt-0.5">opacity</span>
                    <span>Install 3 permeable pavement zones in plazas.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-yellow-400 text-lg mt-0.5">solar_power</span>
                    <span>Green roof retrofitting on 12 municipal buildings.</span>
                </li>
            </ul>
        </div>
    );
};

export default ProposedInterventionsPanel;
