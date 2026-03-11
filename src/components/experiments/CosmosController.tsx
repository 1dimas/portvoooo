import React from 'react';
import { motion } from 'framer-motion';

interface CosmosControllerProps {
    viewMode: 'solar-system' | 'planet';
    onViewModeChange: (mode: 'solar-system' | 'planet') => void;
    timeScale: number;
    onTimeScaleChange: (scale: number) => void;
    bloomEnabled: boolean;
    onToggleBloom: () => void;
}

export function CosmosController({
    viewMode, onViewModeChange,
    timeScale, onTimeScaleChange,
    bloomEnabled, onToggleBloom
}: CosmosControllerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md border border-white/10 px-6 py-4 rounded-xl flex items-center gap-6 pointer-events-auto shadow-2xl"
        >
            {/* View Mode Switcher */}
            <div className="flex flex-col gap-1">
                <span className="text-xs text-white/50 uppercase font-bold tracking-wider">Perspective</span>
                <div className="flex bg-white/10 p-1 rounded-lg">
                    <button
                        onClick={() => onViewModeChange('solar-system')}
                        className={`text-sm px-4 py-1.5 rounded-md transition-colors ${viewMode === 'solar-system' ? 'bg-white text-black font-semibold' : 'text-white hover:bg-white/10'}`}
                    >
                        Solar System
                    </button>
                    <button
                        onClick={() => onViewModeChange('planet')}
                        className={`text-sm px-4 py-1.5 rounded-md transition-colors ${viewMode === 'planet' ? 'bg-white text-black font-semibold' : 'text-white hover:bg-white/10'}`}
                    >
                        Focus Planet
                    </button>
                </div>
            </div>

            {/* Separator */}
            <div className="w-px h-10 bg-white/20" />

            {/* Time Warp Slider */}
            <div className="flex flex-col gap-2 min-w-[150px]">
                <div className="flex justify-between items-center">
                    <span className="text-xs text-white/50 uppercase font-bold tracking-wider">Time Warp</span>
                    <span className="text-xs font-mono text-white/80">{timeScale.toFixed(1)}x</span>
                </div>
                <input
                    type="range"
                    min="0" max="5" step="0.1"
                    value={timeScale}
                    onChange={(e) => onTimeScaleChange(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                />
            </div>

            {/* Separator */}
            <div className="w-px h-10 bg-white/20" />

            {/* Bloom Toggle */}
            <div className="flex flex-col gap-1">
                <span className="text-xs text-white/50 uppercase font-bold tracking-wider">Atmosphere</span>
                <button
                    onClick={onToggleBloom}
                    className={`text-sm px-4 py-1.5 rounded-md border transition-colors ${bloomEnabled ? 'bg-white/20 text-white border-white/30' : 'text-white/50 border-white/10 hover:bg-white/10'}`}
                >
                    Bloom: {bloomEnabled ? 'ON' : 'OFF'}
                </button>
            </div>
        </motion.div>
    );
}
