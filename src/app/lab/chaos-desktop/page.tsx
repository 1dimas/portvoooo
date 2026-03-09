"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import MagneticButton from "@/components/MagneticButton";
import ChaosEngine from "@/components/experiments/ChaosEngine";

export default function ChaosDesktopPage() {
    const [isMounted, setIsMounted] = useState(false);

    // Controls State
    const [gravity, setGravity] = useState(1);
    const [bounciness, setBounciness] = useState(0.8);
    const [frictionAir, setFrictionAir] = useState(0.02);
    const [triggerBang, setTriggerBang] = useState(0);

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
                className="w-full md:w-80 lg:w-96 bg-bg-card border-r border-border shrink-0 z-20 flex flex-col items-start h-[40vh] md:h-screen overflow-y-auto"
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
                            <span className="text-[10px] uppercase font-mono tracking-widest text-text-muted">EXP_004</span>
                        </div>
                        <h1 className="text-3xl font-heading uppercase text-accent mb-2">Chaos Desktop</h1>
                        <p className="text-xs text-text-secondary leading-relaxed">
                            A physics-driven Tiling Window Manager tribute powered by Matter.js.
                        </p>
                    </div>

                    <div className="w-full h-px bg-border flex-shrink-0" />

                    {/* Controls */}
                    <div className="flex flex-col gap-6 w-full flex-grow">

                        {/* Sliders */}
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-text-muted">
                                    <label>Y-Axis Gravity</label>
                                    <span className="text-accent">{gravity.toFixed(1)}</span>
                                </div>
                                <input
                                    type="range" min="-2" max="5" step="0.1"
                                    value={gravity} onChange={e => setGravity(Number(e.target.value))}
                                    className="w-full h-1 bg-border rounded-lg appearance-none cursor-ew-resize accent-accent"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-text-muted">
                                    <label>Bounciness (Restitution)</label>
                                    <span className="text-accent">{bounciness.toFixed(2)}</span>
                                </div>
                                <input
                                    type="range" min="0" max="1.5" step="0.1"
                                    value={bounciness} onChange={e => setBounciness(Number(e.target.value))}
                                    className="w-full h-1 bg-border rounded-lg appearance-none cursor-ew-resize accent-accent"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-text-muted">
                                    <label>Air Friction</label>
                                    <span className="text-accent">{frictionAir.toFixed(3)}</span>
                                </div>
                                <input
                                    type="range" min="0" max="0.1" step="0.005"
                                    value={frictionAir} onChange={e => setFrictionAir(Number(e.target.value))}
                                    className="w-full h-1 bg-border rounded-lg appearance-none cursor-ew-resize accent-accent"
                                />
                            </div>
                        </div>

                        <div className="w-full h-px bg-border flex-shrink-0" />

                        {/* The Big Bang Button */}
                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(var(--accent-rgb), 0.2)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setTriggerBang(prev => prev + 1)}
                            className="w-full py-4 border border-accent/50 text-accent font-mono text-sm uppercase tracking-widest hover:border-accent transition-colors mt-auto relative overflow-hidden group"
                        >
                            <span className="relative z-10">THE BIG BANG</span>
                            <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-20" />
                        </motion.button>
                    </div>

                    <div className="mt-4 flex-shrink-0">
                        <div className="p-4 border border-border bg-bg-primary text-[10px] text-text-muted font-mono leading-relaxed">
                            <span className="text-accent">{'//'} Instructions:</span> Grab and throw the tech stack cards against the walls. Watch them collide.
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Right: The Grid Execution Environment */}
            <div className="flex-1 h-[60vh] md:h-screen w-full relative overflow-hidden">
                <ChaosEngine
                    gravity={gravity}
                    bounciness={bounciness}
                    frictionAir={frictionAir}
                    triggerBang={triggerBang}
                />
            </div>

        </main>
    );
}
