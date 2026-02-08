import React from 'react';
import { ChevronLeft, ChevronRight, TreeDeciduous, Thermometer, Wind } from 'lucide-react';

interface ControlPanelProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  showHeatMap: boolean;
  onToggleHeatMap: (value: boolean) => void;
  showAirQuality?: boolean;
  onToggleAirQuality?: (value: boolean) => void;
  heatIntensity: number;
  onHeatIntensityChange: (value: number) => void;
  treesPlaced: number;
}

export function ControlPanel({
  isCollapsed,
  onToggleCollapse,
  showHeatMap,
  onToggleHeatMap,
  showAirQuality = false,
  onToggleAirQuality,
  heatIntensity,
  onHeatIntensityChange,
  treesPlaced,
}: ControlPanelProps) {
  if (isCollapsed) {
    return (
      <div className="relative">
        <button
          onClick={onToggleCollapse}
          className="absolute top-4 left-0 z-10 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white p-2 rounded-r-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-96 bg-[#2a2a2a] border-r border-[#3a3a3a] flex flex-col overflow-y-auto relative">
      <button
        onClick={onToggleCollapse}
        className="absolute top-4 right-4 z-10 bg-[#1a1a1a] hover:bg-[#333] text-white p-2 rounded-lg transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="p-6 space-y-6">
        {/* Heat Layer Controls */}
        <div className="bg-[#1f1f1f] rounded-xl p-5 border border-[#3a3a3a]">
          <h3 className="text-white mb-4">Heat Layer Controls</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-300 text-sm">Show Heat Map</label>
              <button
                onClick={() => {
                  onToggleHeatMap(!showHeatMap);
                  if (showAirQuality && onToggleAirQuality) {
                    onToggleAirQuality(false);
                  }
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  showHeatMap ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showHeatMap ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {onToggleAirQuality && (
              <div className="flex items-center justify-between">
                <label className="text-gray-300 text-sm flex items-center gap-2">
                  <Wind className="w-4 h-4" />
                  Show Air Quality
                </label>
                <button
                  onClick={() => {
                    onToggleAirQuality(!showAirQuality);
                    if (showHeatMap) {
                      onToggleHeatMap(false);
                    }
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    showAirQuality ? 'bg-green-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showAirQuality ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            )}

            <div>
              <label className="text-gray-300 text-sm block mb-2">
                Heat Intensity
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={heatIntensity}
                onChange={(e) => onHeatIntensityChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <div className="bg-[#2a2a2a] rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-2">Legend</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-500"></div>
                  <span className="text-xs text-gray-300">Cool</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-500"></div>
                  <span className="text-xs text-gray-300">Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500"></div>
                  <span className="text-xs text-gray-300">Extreme Heat</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Intervention Tools */}
        <div className="bg-[#1f1f1f] rounded-xl p-5 border border-[#3a3a3a]">
          <h3 className="text-white mb-4">Intervention Tools</h3>
          
          <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <TreeDeciduous className="w-5 h-5" />
            Plant Trees
          </button>
          
          <p className="text-sm text-gray-400 mt-3 text-center">
            Click on the map to add trees
          </p>
          
          <div className="mt-4 bg-[#2a2a2a] rounded-lg p-3 text-center">
            <span className="text-sm text-gray-300">Trees placed: </span>
            <span className="text-lg text-green-400">{treesPlaced}</span>
          </div>
        </div>

        {/* Local Temperature Readout */}
        <div className="bg-[#1f1f1f] rounded-xl p-5 border border-[#3a3a3a]">
          <div className="flex items-center gap-2 mb-3">
            <Thermometer className="w-5 h-5 text-red-400" />
            <h3 className="text-white">Surface Temperature</h3>
          </div>
          
          <div className="text-center py-4">
            <div className="text-4xl text-red-400 mb-1">42.3°C</div>
            <p className="text-xs text-gray-400">Satellite-derived (Sentinel-2)</p>
          </div>
        </div>

        {/* Scenario Summary */}
        <div className="bg-[#1f1f1f] rounded-xl p-5 border border-[#3a3a3a]">
          <h3 className="text-white mb-4">Scenario Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-[#3a3a3a]">
              <span className="text-sm text-gray-300">Estimated Cooling Impact:</span>
              <span className="text-sm text-blue-400">–3.2°C</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[#3a3a3a]">
              <span className="text-sm text-gray-300">Shaded Area Increase:</span>
              <span className="text-sm text-green-400">+18%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Intervention Type:</span>
              <span className="text-sm text-gray-100">Tree Canopy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
