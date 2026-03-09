"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import MagneticButton from "@/components/MagneticButton";
import KineticText from "@/components/experiments/KineticText";

export default function KineticTypographyPage() {
    const [isMounted, setIsMounted] = useState(false);

    // Controls State
    const [maskSize, setMaskSize] = useState(250);
    const [stiffness, setStiffness] = useState(150);
    const [damping, setDamping] = useState(15);
    const [blendMode, setBlendMode] = useState<"normal" | "difference" | "overlay" | "screen" | "exclusion">("exclusion");
    const [fontWeight, setFontWeight] = useState<100 | 300 | 400 | 600 | 800 | 900>(900);
    const [invert, setInvert] = useState(false);
    const [chromaticAberration, setChromaticAberration] = useState(true);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col md:flex-row overflow-hidden relative selection:bg-accent selection:text-white font-sans">

            {/* Left: Control Panel */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="w-full md:w-80 lg:w-96 bg-bg-card border-r border-border shrink-0 z-20 flex flex-col items-start h-screen overflow-y-auto"
            >
                <div className="p-6 md:p-8 flex flex-col gap-8 w-full">
                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <MagneticButton>
                                <Link href="/lab" className="text-text-muted hover:text-accent transition-colors flex items-center justify-center w-8 h-8 rounded border border-border bg-bg-primary cursor-none">
                                    ←
                                </Link>
                            </MagneticButton>
                            <span className="text-[10px] uppercase font-mono tracking-widest text-text-muted">EXP_002</span>
                        </div>
                        <h1 className="text-3xl font-heading uppercase text-accent mb-2">Kinetic Typo</h1>
                        <p className="text-xs text-text-secondary leading-relaxed">
                            Optical illusion and "Semantic Shift" using SVG Masks & <code>clip-path</code> physics.
                        </p>
                    </div>

                    <div className="w-full h-px bg-border" />

                    {/* Controls */}
                    <div className="flex flex-col gap-6 w-full">

                        {/* Blend Mode Toggle */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-mono uppercase tracking-widest text-text-muted">Blend Mode</label>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                {(["normal", "difference", "overlay", "screen", "exclusion"] as const).map(v => (
                                    <button
                                        key={v}
                                        onClick={() => setBlendMode(v)}
                                        className={`py-2 px-1 text-[10px] font-bold uppercase tracking-wider border rounded transition-colors ${blendMode === v ? "border-accent text-accent bg-accent/10" : "border-border text-text-muted hover:border-text-secondary"}`}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Features Toggles */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-mono uppercase tracking-widest text-text-muted">Features</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setInvert(!invert)}
                                    className={`flex-1 py-2 px-2 text-[10px] font-bold uppercase tracking-wider border transition-colors ${invert ? "border-yellow-500 text-yellow-500 bg-yellow-500/10" : "border-border text-text-muted"}`}
                                >
                                    Eraser Mode (Invert)
                                </button>
                                <button
                                    onClick={() => setChromaticAberration(!chromaticAberration)}
                                    className={`flex-1 py-2 px-2 text-[10px] font-bold uppercase tracking-wider border transition-colors ${chromaticAberration ? "border-red-500 text-red-500 bg-red-500/10" : "border-border text-text-muted"}`}
                                >
                                    Aberration (Velocity)
                                </button>
                            </div>
                        </div>

                        <div className="w-full h-px bg-border my-2" />

                        {/* Sliders */}
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-text-muted">
                                    <label>Mask Radius</label>
                                    <span className="text-accent">{maskSize}px</span>
                                </div>
                                <input
                                    type="range" min="50" max="600" step="10"
                                    value={maskSize} onChange={e => setMaskSize(Number(e.target.value))}
                                    className="w-full h-1 bg-border rounded-lg appearance-none cursor-ew-resize accent-accent"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-text-muted">
                                    <label>Font Weight</label>
                                    <span className="text-accent">{fontWeight}</span>
                                </div>
                                <input
                                    type="range" min="100" max="900" step="100"
                                    value={fontWeight} onChange={e => setFontWeight(Number(e.target.value) as any)}
                                    className="w-full h-1 bg-border rounded-lg appearance-none cursor-ew-resize accent-accent"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-text-muted">
                                    <label>Physics Damping</label>
                                    <span className="text-accent">{damping}</span>
                                </div>
                                <input
                                    type="range" min="5" max="50" step="1"
                                    value={damping} onChange={e => setDamping(Number(e.target.value))}
                                    className="w-full h-1 bg-border rounded-lg appearance-none cursor-ew-resize accent-accent"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-8">
                        <div className="p-4 border border-border bg-bg-primary text-[10px] text-text-muted font-mono leading-relaxed">
                            <span className="text-accent">{'//'} Semantic Shift:</span> Hover over "STUDENT" to reveal "DEVELOPER". Move mouse fast to trigger Chromatic Aberration and Lens stretch.
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Right: The Grid Execution Environment */}
            <div className="flex-1 h-[50vh] md:h-screen w-full relative overflow-hidden bg-bg-primary flex items-center justify-center">
                <KineticText
                    baseText="STUDENT"
                    revealText="DEVELOPER"
                    maskSize={maskSize}
                    stiffness={stiffness}
                    damping={damping}
                    blendMode={blendMode}
                    fontWeight={fontWeight}
                    chromaticAberration={chromaticAberration}
                    invert={invert}
                />
            </div>

        </main>
    );
}
