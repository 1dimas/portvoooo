"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import MagneticGrid, { VisualMode } from "@/components/experiments/MagneticGrid";
import MagneticButton from "@/components/MagneticButton";

export default function MagneticGridPage() {
    const [isMounted, setIsMounted] = useState(false);

    // Grid Controls State
    const [density, setDensity] = useState(15);
    const [power, setPower] = useState(300);
    const [intensity, setIntensity] = useState(60);
    const [mode, setMode] = useState<"repel" | "attract">("repel");
    const [visualMode, setVisualMode] = useState<VisualMode>("dots");

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null; // Prevent hydration mismatch

    const handleDensityChange = (e: React.ChangeEvent<HTMLInputElement>) => setDensity(Number(e.target.value));
    const handlePowerChange = (e: React.ChangeEvent<HTMLInputElement>) => setPower(Number(e.target.value));
    const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => setIntensity(Number(e.target.value));

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col md:flex-row overflow-hidden relative selection:bg-accent selection:text-white font-sans">

            {/* Left: Control Panel */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="w-full md:w-80 lg:w-96 bg-bg-card border-r border-border shrink-0 z-20 flex flex-col h-screen overflow-y-auto"
            >
                <div className="p-6 md:p-8 flex flex-col gap-8">
                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <MagneticButton>
                                <Link href="/lab" className="text-text-muted hover:text-accent transition-colors flex items-center justify-center w-8 h-8 rounded border border-border bg-bg-primary cursor-none">
                                    ←
                                </Link>
                            </MagneticButton>
                            <span className="text-[10px] uppercase font-mono tracking-widest text-text-muted">EXP_001</span>
                        </div>
                        <h1 className="text-3xl font-heading uppercase text-accent mb-2">Magnetic Grid</h1>
                        <p className="text-xs text-text-secondary leading-relaxed">
                            Interaksi fisika spring menggunakan <code>framer-motion</code> dengan performa tinggi berbasis GPU (`useMotionValue`).
                        </p>
                    </div>

                    <div className="w-full h-px bg-border" />

                    {/* Controls */}
                    <div className="flex flex-col gap-6">

                        {/* Status Toggle */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-mono uppercase tracking-widest text-text-muted">Force Mode</label>
                            <div className="grid grid-cols-2 gap-2 p-1 bg-bg-primary border border-border rounded">
                                <button
                                    onClick={() => setMode("repel")}
                                    className={`py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors ${mode === "repel" ? "bg-accent text-white" : "text-text-secondary hover:text-text-primary"}`}
                                >
                                    Repel
                                </button>
                                <button
                                    onClick={() => setMode("attract")}
                                    className={`py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors ${mode === "attract" ? "bg-accent text-white" : "text-text-secondary hover:text-text-primary"}`}
                                >
                                    Attract
                                </button>
                            </div>
                        </div>

                        {/* Visual Flavor */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-mono uppercase tracking-widest text-text-muted">Visual Flavor</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(["dots", "compass", "ascii"] as VisualMode[]).map(v => (
                                    <button
                                        key={v}
                                        onClick={() => setVisualMode(v)}
                                        className={`py-2 px-1 text-[10px] font-bold uppercase tracking-wider border transition-colors ${visualMode === v ? "border-accent text-accent bg-accent/10" : "border-border text-text-muted hover:border-text-secondary"}`}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="w-full h-px bg-border my-2" />

                        {/* Sliders */}
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-text-muted">
                                    <label>Grid Density</label>
                                    <span className="text-accent">{density}x{Math.floor(density * 1.5)}</span>
                                </div>
                                <input
                                    type="range" min="5" max="30" step="1"
                                    value={density} onChange={handleDensityChange}
                                    className="w-full h-1 bg-border rounded-lg appearance-none cursor-ew-resize accent-accent"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-text-muted">
                                    <label>Magnetic Radius</label>
                                    <span className="text-accent">{power}px</span>
                                </div>
                                <input
                                    type="range" min="100" max="800" step="10"
                                    value={power} onChange={handlePowerChange}
                                    className="w-full h-1 bg-border rounded-lg appearance-none cursor-ew-resize accent-accent"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-text-muted">
                                    <label>Force Intensity</label>
                                    <span className="text-accent">{intensity}</span>
                                </div>
                                <input
                                    type="range" min="10" max="150" step="5"
                                    value={intensity} onChange={handleIntensityChange}
                                    className="w-full h-1 bg-border rounded-lg appearance-none cursor-ew-resize accent-accent"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-8">
                        <div className="p-4 border border-border bg-bg-primary text-[10px] text-text-muted font-mono leading-relaxed">
                            <span className="text-accent">{'//'} Pro Tip:</span> Try 'Attract' mode with the 'Compass' flavor for a mesmerizing follow-effect.
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Right: The Grid Execution Environment */}
            <div className="flex-1 h-screen relative bg-[#050505] overflow-hidden">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute inset-0 z-10"
                >
                    <MagneticGrid
                        rows={density}
                        cols={Math.floor(density * 1.5)} // Keep aspect ratio roughly wide
                        mode={mode}
                        visualMode={visualMode}
                        power={power}
                        intensity={intensity}
                        damping={15}
                        stiffness={150}
                    />
                </motion.div>

                {/* Grid Overlay Frame purely for aesthetics */}
                <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

                {/* Crosshairs at corners to look technical */}
                <div className="absolute top-8 left-8 w-4 h-4 border-t border-l border-white/20 z-20 pointer-events-none" />
                <div className="absolute top-8 right-8 w-4 h-4 border-t border-r border-white/20 z-20 pointer-events-none" />
                <div className="absolute bottom-8 left-8 w-4 h-4 border-b border-l border-white/20 z-20 pointer-events-none" />
                <div className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-white/20 z-20 pointer-events-none" />
            </div>

        </main>
    );
}
