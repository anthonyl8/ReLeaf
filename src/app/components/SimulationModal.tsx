import React, { useState } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SimulationModal({ isOpen, onClose }: SimulationModalProps) {
  const [comparisonValue, setComparisonValue] = useState(50);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#2a2a2a] rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden border border-[#3a3a3a]">
        {/* Header */}
        <div className="bg-[#1f1f1f] px-6 py-4 border-b border-[#3a3a3a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <h2 className="text-white text-xl">AI-Generated Cooling Scenario</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-[#3a3a3a] rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Current City */}
            <div className="space-y-3">
              <h3 className="text-white text-center">Current City</h3>
              <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-red-500/50">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1759863468440-85130c0dff28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5zZSUyMHVyYmFuJTIwY2l0eSUyMGJ1aWxkaW5ncyUyMGhlYXQlMjBjb25jcmV0ZXxlbnwxfHx8fDE3NzA1MDM5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Current city"
                  className="w-full h-full object-cover"
                />
                {/* Heat overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/40 via-orange-500/30 to-yellow-500/20"></div>
                
                {/* Stats overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="grid grid-cols-2 gap-2 text-white text-sm">
                    <div>
                      <div className="text-xs text-gray-300">Avg Temp</div>
                      <div className="text-lg text-red-400">42.3°C</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-300">Tree Coverage</div>
                      <div className="text-lg">8%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI-Simulated Green City */}
            <div className="space-y-3">
              <h3 className="text-white text-center">AI-Simulated Green City</h3>
              <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-green-500/50">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1769721110409-27ec9fcdf646?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHVyYmFuJTIwcGFyayUyMHRyZWVzJTIwc2hhZGUlMjBjYW5vcHl8ZW58MXx8fHwxNzcwNTAzOTg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Green city simulation"
                  className="w-full h-full object-cover"
                />
                {/* Cool overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-green-500/20 to-cyan-500/20"></div>
                
                {/* Stats overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="grid grid-cols-2 gap-2 text-white text-sm">
                    <div>
                      <div className="text-xs text-gray-300">Avg Temp</div>
                      <div className="text-lg text-blue-400">39.1°C</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-300">Tree Coverage</div>
                      <div className="text-lg text-green-400">26%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Slider */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm mb-3 text-center">
              Compare Before / After
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={comparisonValue}
              onChange={(e) => setComparisonValue(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #ef4444 0%, #eab308 50%, #22c55e 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Before</span>
              <span className="text-white">{comparisonValue}%</span>
              <span>After</span>
            </div>
          </div>

          {/* Impact Summary */}
          <div className="bg-[#1f1f1f] rounded-xl p-5 border border-[#3a3a3a] mb-4">
            <h4 className="text-white mb-3 text-sm">Projected Impact</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl text-blue-400 mb-1">–3.2°C</div>
                <div className="text-xs text-gray-400">Temperature Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-green-400 mb-1">+18%</div>
                <div className="text-xs text-gray-400">Shaded Area</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-cyan-400 mb-1">2,400</div>
                <div className="text-xs text-gray-400">Trees Added</div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-200">
              AI-generated visualization for planning inspiration only. Actual results may vary based on tree species, placement, maintenance, and local climate conditions.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white px-6 py-3 rounded-lg transition-colors"
            >
              Close
            </button>
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
              Export Scenario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
