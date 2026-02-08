import React from 'react';
import { Zap, Database } from 'lucide-react';

interface TopBarProps {
  onSimulate: () => void;
}

export function TopBar({ onSimulate }: TopBarProps) {
  return (
    <div className="h-16 bg-[#2a2a2a] border-b border-[#3a3a3a] flex items-center justify-between px-6 text-white">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-xl tracking-tight">ReLeaf</h1>
          <p className="text-xs text-gray-400">Urban Heat Resilience Simulator</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">Heat Data: <span className="text-green-400">Loaded</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-gray-300">AI Vision: <span className="text-blue-400">Ready</span></span>
          </div>
        </div>

        <button
          onClick={onSimulate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Simulate Future
        </button>
      </div>
    </div>
  );
}
