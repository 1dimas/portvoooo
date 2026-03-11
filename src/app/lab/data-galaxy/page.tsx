"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Rocket } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";
import dynamic from "next/dynamic";
import cosmosTreeData from "@/data/cosmosTree.json";
import { PlanetNode, SatelliteNode } from "@/components/experiments/CosmosCanvas";
import { CosmosController } from "@/components/experiments/CosmosController";

// We dynamically import CosmosCanvas with SSR disabled because Three.js depends 
// heavily on browser APIs (window, WebGL) which are not available on the server.
const DynamicCosmosCanvas = dynamic(
    () => import('@/components/experiments/CosmosCanvas'),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white font-mono text-sm animate-pulse">
                <span>INITIALIZING_ORBITAL_MECHANICS...</span>
            </div>
        )
    }
);

export default function CosmosPage() {
    const [bloomEnabled, setBloomEnabled] = useState(true);
    const [viewMode, setViewMode] = useState<'solar-system' | 'planet'>('solar-system');
    const [timeScale, setTimeScale] = useState(1);
    const [selectedObject, setSelectedObject] = useState<PlanetNode | SatelliteNode | null>(null);

    const handleNodeSelect = (node: PlanetNode | SatelliteNode | null) => {
        setSelectedObject(node);
        if (node) {
            setViewMode('planet');
        }
    };

    return (
        <div className="w-screen h-screen bg-[#020205] overflow-hidden relative font-sans">
            {/* Holographic Header */}
            <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-center z-50 pointer-events-none">
                <MagneticButton className="p-2 border border-white/20 rounded-full bg-black/50 backdrop-blur-md pointer-events-auto hover:bg-white/10 transition-colors">
                    <Link href="/lab" className="text-white flex items-center gap-2 px-2 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-mono hidden md:inline">EXIT_COSMOS</span>
                    </Link>
                </MagneticButton>

                <div className="flex items-center gap-4 pointer-events-auto">
                    <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                        <Rocket className="w-4 h-4 text-purple-400 animate-pulse" />
                        <span className="font-mono text-xs text-white/80">THE_CODE_COSMOS</span>
                    </div>
                </div>
            </div>

            {/* Information Panel (Top Left) */}
            {selectedObject && (
                <div className="absolute top-24 left-6 bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-xl z-50 text-white min-w-[250px] pointer-events-none">
                    <h3 className="font-mono font-bold text-lg">{selectedObject.name}</h3>
                    <p className="text-xs text-white/50 mb-3">{selectedObject.path}</p>

                    <div className="flex justify-between items-center text-sm border-t border-white/10 pt-2 mt-2">
                        <span className="text-white/60">Type:</span>
                        <span className="uppercase text-cyan-400 font-mono">{selectedObject.type}</span>
                    </div>

                    {selectedObject.type === 'folder' ? (
                        <div className="flex justify-between items-center text-sm mt-1">
                            <span className="text-white/60">Total Size:</span>
                            <span className="font-mono">{(selectedObject as PlanetNode).totalSizeKb} KB</span>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center text-sm mt-1">
                            <span className="text-white/60">Size:</span>
                            <span className="font-mono">{(selectedObject as SatelliteNode).sizeKb} KB</span>
                        </div>
                    )}
                </div>
            )}

            {/* Orbit HUD Controller */}
            <div className="z-50 pointer-events-none absolute inset-0">
                <CosmosController
                    viewMode={viewMode}
                    onViewModeChange={(mode) => {
                        setViewMode(mode);
                        if (mode === 'solar-system') setSelectedObject(null);
                    }}
                    timeScale={timeScale}
                    onTimeScaleChange={setTimeScale}
                    bloomEnabled={bloomEnabled}
                    onToggleBloom={() => setBloomEnabled(!bloomEnabled)}
                />
            </div>

            {/* The 3D Canvas */}
            <div className="absolute inset-0 w-full h-full pointer-events-auto">
                <DynamicCosmosCanvas
                    data={cosmosTreeData as PlanetNode}
                    bloomEnabled={bloomEnabled}
                    viewMode={viewMode}
                    timeScale={timeScale}
                    onNodeSelect={handleNodeSelect}
                />
            </div>
        </div>
    );
}
