"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import MagneticButton from "@/components/MagneticButton";
import { SentientProvider, useSentient } from "@/components/experiments/useSentient";
import AdaptiveElement from "@/components/experiments/AdaptiveElement";

const DUMMY_LIBRARIES = [
    { id: "lib-react", name: "React", desc: "A JavaScript library for building user interfaces", category: "Frontend" },
    { id: "lib-next", name: "Next.js", desc: "The React Framework for the Web", category: "Framework" },
    { id: "lib-tailwind", name: "Tailwind CSS", desc: "Rapidly build modern websites without ever leaving your HTML", category: "Styling" },
    { id: "lib-framer", name: "Framer Motion", desc: "A production-ready motion library for React", category: "Animation" },
    { id: "lib-three", name: "Three.js", desc: "JavaScript 3D library", category: "WebGL" },
    { id: "lib-matter", name: "Matter.js", desc: "a 2D rigid body physics engine for the web", category: "Physics" },
    { id: "lib-prisma", name: "Prisma", desc: "Next-generation Node.js and TypeScript ORM", category: "Database" },
    { id: "lib-trpc", name: "tRPC", desc: "End-to-end typesafe APIs made easy", category: "API" },
    { id: "lib-zustand", name: "Zustand", desc: "Bear necessities for state management in React", category: "State" },
];

function SentientDashboard() {
    const {
        learningRate,
        setLearningRate,
        decayRate,
        setDecayRate,
        isHeatmapActive,
        toggleHeatmap,
        amnesia,
        scores
    } = useSentient();

    // Calculate total system IQ (sum of all scores)
    const totalIQ = Math.round(Object.values(scores).reduce((a, b) => a + b, 0));

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
                            <span className="text-[10px] uppercase font-mono tracking-widest text-text-muted">EXP_006</span>
                        </div>
                        <h1 className="text-3xl font-heading uppercase tracking-tighter text-accent mb-2">The Sentient UI</h1>
                        <p className="text-xs text-text-secondary leading-relaxed">
                            A living organism on the web. The UI learns your reading habits via scroll and hover intensity, fading out what you ignore and amplifying what you desire.
                        </p>
                    </div>

                    <div className="w-full h-px bg-border flex-shrink-0" />

                    {/* Brain Analytics */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-mono uppercase tracking-wider text-text-muted">Digital Brain Status</span>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                <span className="text-[10px] uppercase font-bold tracking-widest text-accent">
                                    LEARNING
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between bg-bg-primary border border-border p-3 rounded-lg">
                            <span className="text-[10px] font-mono uppercase text-text-secondary">System Memory IQ</span>
                            <span className="text-lg font-heading text-accent">{totalIQ} px</span>
                        </div>
                    </div>

                    <div className="w-full h-px bg-border flex-shrink-0" />

                    {/* Controls */}
                    <div className="flex flex-col gap-6 w-full flex-grow">

                        {/* Sliders */}
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-text-muted">
                                    <label>Learning Rate (Speed)</label>
                                    <span className="text-accent">{learningRate}x</span>
                                </div>
                                <input
                                    type="range" min="0.1" max="5" step="0.1"
                                    value={learningRate} onChange={e => setLearningRate(Number(e.target.value))}
                                    className="w-full h-1 bg-border rounded-lg appearance-none cursor-ew-resize accent-accent"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-text-muted">
                                    <label>Decay Rate (Forgetting)</label>
                                    <span className="text-accent">{decayRate.toFixed(1)}/s</span>
                                </div>
                                <input
                                    type="range" min="0" max="2" step="0.1"
                                    value={decayRate} onChange={e => setDecayRate(Number(e.target.value))}
                                    className="w-full h-1 bg-border rounded-lg appearance-none cursor-ew-resize accent-accent"
                                />
                            </div>
                        </div>

                        {/* Toggles & Actions */}
                        <div className="flex flex-col gap-3 mt-4">
                            <button
                                onClick={toggleHeatmap}
                                className={`py-3 px-4 flex items-center justify-between border rounded text-xs font-mono uppercase tracking-widest transition-all ${isHeatmapActive
                                        ? 'border-accent bg-accent/10 text-accent'
                                        : 'border-border text-text-muted hover:border-text-muted'
                                    }`}
                            >
                                <span>Memory Heatmap</span>
                                {isHeatmapActive && <span className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" />}
                            </button>

                            <button
                                onClick={amnesia}
                                className="py-3 px-4 flex items-center justify-center border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded text-xs font-mono uppercase tracking-widest transition-all mt-4"
                            >
                                <span>Amnesia (Delete Memory)</span>
                            </button>
                        </div>

                    </div>
                </div>
            </motion.div>

            {/* Right: The Sentient Environment */}
            <div className="flex-1 h-[60vh] md:h-screen w-full relative overflow-y-auto bg-bg-primary p-6 md:p-12 lg:p-24 hide-scrollbar">

                <div className="max-w-4xl mx-auto flex flex-col gap-12 pb-32">
                    <header className="mb-8">
                        <h2 className="text-4xl md:text-5xl font-heading text-text-primary mb-4 capitalize">Explore the Library</h2>
                        <p className="text-text-secondary">Linger your cursor over items you find interesting. Watch the system adapt to your reading logic.</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {DUMMY_LIBRARIES.map((lib) => (
                            <AdaptiveElement
                                key={lib.id}
                                id={lib.id}
                                className="bg-bg-card border border-border p-6 flex flex-col h-full shadow-lg"
                                hoverInterestWeight={2}
                                visibilityInterestWeight={0.1}
                            >
                                <span className="text-[10px] font-mono text-accent uppercase tracking-widest mb-4 inline-block px-2 py-1 bg-accent/10 rounded border border-accent/20">
                                    {lib.category}
                                </span>
                                <h3 className="text-2xl font-heading text-text-primary mb-2 line-clamp-1">{lib.name}</h3>
                                <p className="text-text-secondary text-sm leading-relaxed flex-grow">{lib.desc}</p>
                            </AdaptiveElement>
                        ))}
                    </div>

                    {/* Ghost Elements / Spacers to encourage scrolling */}
                    <div className="h-64 flex items-center justify-center border border-dashed border-border/50 rounded-xl mt-12 bg-bg-card/30">
                        <p className="text-text-muted font-mono text-sm uppercase tracking-widest opacity-50">Keep scrolling...</p>
                    </div>
                </div>

            </div>

        </main>
    );
}

export default function SentientUIPage() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <SentientProvider>
            <SentientDashboard />
        </SentientProvider>
    );
}
