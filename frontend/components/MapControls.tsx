
import React from 'react';

const MapControls: React.FC = () => {
    return (
        <div className="pointer-events-auto flex flex-col gap-2 mb-auto mt-4">
            <button className="size-10 flex items-center justify-center glass-panel rounded-lg hover:bg-[#28392c] text-white shadow-lg border border-[#28392c]">
                <span className="material-symbols-outlined">add</span>
            </button>
            <button className="size-10 flex items-center justify-center glass-panel rounded-lg hover:bg-[#28392c] text-white shadow-lg border border-[#28392c]">
                <span className="material-symbols-outlined">remove</span>
            </button>
            <button className="size-10 flex items-center justify-center glass-panel rounded-lg hover:bg-[#28392c] text-white shadow-lg border border-[#28392c] mt-2">
                <span className="material-symbols-outlined">layers</span>
            </button>
        </div>
    );
};

export default MapControls;
