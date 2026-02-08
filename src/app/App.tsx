import React, { useState } from 'react';
import { TopBar } from './components/TopBar';
import { ControlPanel } from './components/ControlPanel';
import { MapView } from './components/MapView';
import { SimulationModal } from './components/SimulationModal';

export default function App() {
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHeatMap, setShowHeatMap] = useState(true);
  const [showAirQuality, setShowAirQuality] = useState(false);
  const [heatIntensity, setHeatIntensity] = useState(70);
  const [treesPlaced, setTreesPlaced] = useState(12);
  const [trees, setTrees] = useState<{ x: number; y: number; id: number }[]>([]);

  const handlePlaceTree = (x: number, y: number) => {
    const newTree = { x, y, id: Date.now() };
    setTrees([...trees, newTree]);
    setTreesPlaced(prev => prev + 1);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#1a1a1a]">
      <TopBar onSimulate={() => setIsModalOpen(true)} />
      
      <div className="flex-1 flex overflow-hidden relative">
        <ControlPanel
          isCollapsed={isPanelCollapsed}
          onToggleCollapse={() => setIsPanelCollapsed(!isPanelCollapsed)}
          showHeatMap={showHeatMap}
          onToggleHeatMap={setShowHeatMap}
          showAirQuality={showAirQuality}
          onToggleAirQuality={setShowAirQuality}
          heatIntensity={heatIntensity}
          onHeatIntensityChange={setHeatIntensity}
          treesPlaced={treesPlaced}
        />
        
        <MapView
          showHeatMap={showHeatMap}
          showAirQuality={showAirQuality}
          heatIntensity={heatIntensity}
          trees={trees}
          onPlaceTree={handlePlaceTree}
        />
      </div>

      <SimulationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
