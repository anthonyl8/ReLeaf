import React, { useState, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import SimulationModal from './components/SimulationModal';
import { generateVision } from './api';
import html2canvas from 'html2canvas';

type View = 'dashboard' | 'simulation';

const App: React.FC = () => {
    const [view, setView] = useState<View>('dashboard');
    const [beforeImage, setBeforeImage] = useState<string | null>(null);
    const [afterImage, setAfterImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const showDashboard = useCallback(() => {
        setView('dashboard');
        setError(null);
    }, []);

    const startSimulation = useCallback(async () => {
        setError(null);
        setLoading(true);
        try {
            const el = document.getElementById('map-capture');
            if (!el) throw new Error('Map area not found');
            const canvas = await html2canvas(el, { useCORS: true, allowTaint: true, logging: false });
            const beforeBase64 = canvas.toDataURL('image/png');
            const afterDataUrl = await generateVision(beforeBase64);
            setBeforeImage(beforeBase64);
            setAfterImage(afterDataUrl);
            setView('simulation');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Simulation failed');
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <div className="bg-background-dark text-white font-display overflow-hidden h-screen w-screen flex flex-col relative">
            <div className={`transition-all duration-500 ${view === 'simulation' ? 'opacity-20 blur-sm filter grayscale' : 'opacity-100 blur-0'}`}>
                <Dashboard onSimulate={startSimulation} simulateLoading={loading} simulateError={error} />
            </div>
            {view === 'simulation' && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]">
                    <SimulationModal
                        onClose={showDashboard}
                        beforeImage={beforeImage}
                        afterImage={afterImage}
                        loading={loading}
                    />
                </div>
            )}
        </div>
    );
};

export default App;
