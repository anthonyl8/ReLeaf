
import React from 'react';
import ComparisonSlider from './ComparisonSlider';
import ImpactAnalysisPanel from './ImpactAnalysisPanel';
import ProposedInterventionsPanel from './ProposedInterventionsPanel';

const PLACEHOLDER_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqVw12KAP4wUJ8frwTArW_Dja93L3oMgrnkx4Rm1V6qrj3r2rDso2dUWu6qAWep8HfKWV0xlXWz4xKxQjLYJI23LdeYW6ElL1pG9E9SBjjh5OuabdewnKZiMqeI6e2tRRJVC87-9Bn14t9ruK4Ew_ydR4CjmOvMaAkvVWNI4PH0fh6suyVzHP5zHkWUbVDPN_5XyURs-ju4lbYnn5ntW6PblsyUuuptneRGj-mH65gseLUg-zQF5QbWzZTiyjaw4LPEWedZhkDcOjj';

interface SimulationModalProps {
    onClose: () => void;
    beforeImage?: string | null;
    afterImage?: string | null;
    loading?: boolean;
}

const SimulationModal: React.FC<SimulationModalProps> = ({ onClose, beforeImage, afterImage, loading }) => {
    const showSlider = beforeImage && afterImage && !loading;
    const showLoading = loading || (!beforeImage && !afterImage);

    return (
        <div className="w-full max-w-6xl flex flex-col bg-surface-dark border border-[#28392c] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#28392c] bg-surface-dark">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <span className="material-symbols-outlined text-2xl">science</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">AI-Generated Cooling Scenario</h1>
                        <p className="text-sm text-gray-400">ReLeaf • Heat Mitigation Strategy</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {showSlider && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Simulation Complete
                        </span>
                    )}
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-[#28392c]">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row h-full">
                {showLoading && (
                    <div className="flex-1 flex items-center justify-center min-h-[400px] text-gray-400">
                        <div className="flex flex-col items-center gap-4">
                            <span className="material-symbols-outlined text-5xl animate-pulse">hourglass_empty</span>
                            <p>Generating future scenario…</p>
                        </div>
                    </div>
                )}
                {showSlider && (
                    <ComparisonSlider
                        beforeImage={beforeImage}
                        afterImage={afterImage}
                    />
                )}
                {!showSlider && !showLoading && (
                    <ComparisonSlider
                        beforeImage={PLACEHOLDER_IMAGE}
                        afterImage={PLACEHOLDER_IMAGE}
                    />
                )}

                <div className="w-full lg:w-80 bg-surface-lighter border-l border-[#28392c] flex flex-col">
                    <ImpactAnalysisPanel />
                    <ProposedInterventionsPanel />
                    <div className="p-4 bg-[#151c17] mt-auto border-t border-[#28392c]">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded bg-cover bg-center border border-white/10" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCGwU3GRi7Wnsh0lIP2SPGBu5PH420NvVhrpLb5s8cCxQ-Xgr4csytZ_A9KLUdcOG4_lwnVZ92NX14iKF__r3Jo1jHj_3kclV0RQCcp2TU87dHZmwAKojMptp_kZTd3Hwk3gtnSNC9_qx_y7sKgjic7RmN0KWxhBCcVWAY1QCIZQhaT7ou43FZD8_LlBFUDId5CeY5GCbM8EA6vRQqAVFwLLprXTacrmLJcsWaSqNHtUVCPfMJyZWbC8Bf3w7RMUTCRV2hnzeITODWB')" }}></div>
                            <div>
                                <p className="text-white text-xs font-bold">Sector 7G - Downtown</p>
                                <p className="text-gray-500 text-[10px]">Lat: 40.7128, Long: -74.0060</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <div className="bg-surface-dark border-t border-[#28392c] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <span className="material-symbols-outlined text-base">info</span>
                    <p>AI-generated visualization for planning inspiration only. Validated engineering models required.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-4 py-2.5 rounded-lg border border-[#3b5441] text-white text-sm font-medium hover:bg-[#28392c] transition-colors flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-lg">ios_share</span>
                        Export Report
                    </button>
                    <button className="flex-1 md:flex-none px-6 py-2.5 rounded-lg bg-primary text-background-dark text-sm font-bold hover:bg-green-400 transition-colors shadow-[0_0_15px_rgba(19,236,73,0.3)] flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        Apply to Project
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SimulationModal;
