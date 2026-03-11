"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import MagneticButton from "@/components/MagneticButton";
import { HardwareOracleProvider, useHardwareOracle, PerformanceTier } from "@/components/experiments/useHardwareOracle";
import AdaptiveWrapper, { AdaptiveMedia } from "@/components/experiments/AdaptiveWrapper";

// A dummy heavy particle component that only works in HIGH tier
function HeavyParticleSimulation() {
    const { tier } = useHardwareOracle();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (tier !== "HIGH") return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: { x: number, y: number, vx: number, vy: number, life: number }[] = [];
        let reqId: number;

        const resize = () => {
            canvas.width = canvas.parentElement?.clientWidth || 300;
            canvas.height = canvas.parentElement?.clientHeight || 300;
        };
        resize();
        window.addEventListener('resize', resize);

        const loop = () => {
            ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // Trails
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add new particles
            if (particles.length < 200) {
                particles.push({
                    x: canvas.width / 2,
                    y: canvas.height / 2,
                    vx: (Math.random() - 0.5) * 5,
                    vy: (Math.random() - 0.5) * 5,
                    life: 1.0
                });
            }

            // Update and draw
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.01;

                ctx.fillStyle = `rgba(180, 200, 255, ${p.life})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fill();

                if (p.life <= 0) {
                    particles.splice(i, 1);
                }
            }

            reqId = requestAnimationFrame(loop);
        };

        loop();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(reqId);
        };
    }, [tier]);

    if (tier === "ECO" || tier === "MEDIUM") {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-zinc-900 border border-border border-dashed rounded-lg text-center">
                <span className="text-2xl opacity-30 mb-2 font-mono">X</span>
                <span className="text-xs uppercase font-mono text-text-muted">
                    Heavy Compute<br />Suspended
                </span>
            </div>
        );
    }

    return (
        <canvas ref={canvasRef} className="w-full h-full mix-blend-screen opacity-50 absolute inset-0 pointer-events-none" />
    );
}

function AdaptiveDashboard() {
    const { tier, battery, network, isSimulating, simulateTier, simulateBattery, simulateNetwork } = useHardwareOracle();

    // Map tier to colors and styles
    const tierConfig = {
        HIGH: {
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            border: 'border-green-500/50',
            icon: '⚡',
            desc: 'Uncompromised Visuals'
        },
        MEDIUM: {
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/50',
            icon: '➖',
            desc: 'Balanced Experience'
        },
        ECO: {
            color: 'text-red-500',
            bg: 'bg-red-500/10',
            border: 'border-red-500/50',
            icon: '🔋',
            desc: 'Maximum Power Saving'
        }
    }[tier];

    return (
        <main className={`min-h-screen transition-colors duration-1000 overflow-hidden relative selection:bg-accent selection:text-white font-sans ${tier === 'ECO' ? 'bg-black text-gray-400' : 'bg-bg-primary text-text-primary'}`}>

            {/* Top right HUD */}
            <div className="fixed top-4 right-4 z-50 pointer-events-none">
                <motion.div
                    layout
                    className={`flex items-center gap-3 px-4 py-2 rounded border backdrop-blur-md shadow-2xl ${tierConfig.bg} ${tierConfig.border}`}
                >
                    <span className="text-xl">{tierConfig.icon}</span>
                    <div className="flex flex-col">
                        <span className={`text-[10px] uppercase font-bold tracking-widest ${tierConfig.color}`}>
                            {tier} PERFORMANCE
                        </span>
                        <span className="text-[9px] uppercase font-mono opacity-70">
                            {isSimulating ? 'SIMULATED DATA' : 'HARDWARE SENSORS'}
                        </span>
                    </div>
                </motion.div>
            </div>

            <div className="flex flex-col md:flex-row h-screen">

                {/* Left: Control Panel */}
                <div className={`w-full md:w-80 lg:w-96 border-r shrink-0 z-20 flex flex-col items-start h-[40vh] md:h-screen overflow-y-auto transition-colors duration-1000 ${tier === 'ECO' ? 'bg-zinc-950 border-zinc-900' : 'bg-bg-card border-border'}`}>
                    <div className="p-6 md:p-8 flex flex-col gap-8 w-full">
                        {/* Header */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <MagneticButton>
                                    <Link href="/lab" className="text-text-muted hover:text-accent transition-colors flex items-center justify-center w-8 h-8 rounded border border-border bg-bg-primary pointer-events-auto">
                                        ←
                                    </Link>
                                </MagneticButton>
                                <span className="text-[10px] uppercase font-mono tracking-widest text-text-muted">EXP_008</span>
                            </div>
                            <h1 className={`text-3xl font-heading uppercase tracking-tighter mb-2 leading-tight transition-colors ${tier === 'ECO' ? 'text-gray-300' : 'text-accent'}`}>Adaptive<br />Survivor</h1>
                            <p className="text-xs text-text-secondary leading-relaxed">
                                Form follows functionality. The UI aggressively morphs its demands based on battery and network constraints constraints.
                            </p>
                        </div>

                        <div className={`w-full h-px flex-shrink-0 transition-colors ${tier === 'ECO' ? 'bg-zinc-900' : 'bg-border'}`} />

                        {/* Hardware Telemetry */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Hardware Telemetry</h3>

                            <div className={`flex items-center justify-between p-3 rounded border transition-colors ${tier === 'ECO' ? 'border-zinc-800 bg-zinc-900/50' : 'border-border bg-bg-primary'}`}>
                                <span className="text-[10px] uppercase font-mono opacity-70">Power Source</span>
                                <span className="text-xs font-bold font-mono">
                                    {battery ? `${(battery.level * 100).toFixed(0)}% ${battery.charging ? '(Charge)' : '(Drain)'}` : 'UNAVAILABLE'}
                                </span>
                            </div>

                            <div className={`flex items-center justify-between p-3 rounded border transition-colors ${tier === 'ECO' ? 'border-zinc-800 bg-zinc-900/50' : 'border-border bg-bg-primary'}`}>
                                <span className="text-[10px] uppercase font-mono opacity-70">Network Config</span>
                                <span className="text-xs font-bold font-mono uppercase">
                                    {network ? `${network.effectiveType} ${network.saveData ? '[Save Data]' : ''}` : 'UNAVAILABLE'}
                                </span>
                            </div>
                        </div>

                        <div className={`w-full h-px flex-shrink-0 transition-colors ${tier === 'ECO' ? 'bg-zinc-900' : 'bg-border'}`} />

                        {/* Simulation Override */}
                        <div className="flex flex-col gap-6 w-full flex-grow">
                            <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-text-muted">
                                <label>Simulation Override</label>
                                {isSimulating && (
                                    <button
                                        onClick={() => {
                                            simulateTier(null);
                                            simulateBattery(null);
                                            simulateNetwork(null);
                                        }}
                                        className="text-red-500 hover:text-red-400 text-[9px] border border-red-500/30 px-2 py-0.5 rounded"
                                    >
                                        RESET
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => simulateTier('ECO')}
                                    className={`py-3 px-4 border rounded text-[10px] font-mono uppercase tracking-widest transition-all text-left flex justify-between ${isSimulating && tier === 'ECO'
                                            ? 'border-red-500/50 bg-red-500/10 text-red-500'
                                            : 'border-border text-text-muted hover:border-text-secondary'
                                        }`}
                                >
                                    <span>Force 5% Battery</span>
                                    <span>ECO</span>
                                </button>
                                <button
                                    onClick={() => simulateTier('MEDIUM')}
                                    className={`py-3 px-4 border rounded text-[10px] font-mono uppercase tracking-widest transition-all text-left flex justify-between ${isSimulating && tier === 'MEDIUM'
                                            ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-500'
                                            : 'border-border text-text-muted hover:border-text-secondary'
                                        }`}
                                >
                                    <span>Force 3G Network</span>
                                    <span>MED</span>
                                </button>
                                <button
                                    onClick={() => simulateTier('HIGH')}
                                    className={`py-3 px-4 border rounded text-[10px] font-mono uppercase tracking-widest transition-all text-left flex justify-between ${isSimulating && tier === 'HIGH'
                                            ? 'border-green-500/50 bg-green-500/10 text-green-500'
                                            : 'border-border text-text-muted hover:border-text-secondary'
                                        }`}
                                >
                                    <span>Force Wall Power</span>
                                    <span>HIGH</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Right: The Environment */}
                <div className="flex-1 h-[60vh] md:h-screen w-full relative overflow-y-auto">

                    {/* The Background */}
                    <AdaptiveWrapper
                        fallback={<div className="absolute inset-0 bg-black" />} // Pure black in ECO
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-primary to-bg-card opacity-50" />
                        <HeavyParticleSimulation />
                    </AdaptiveWrapper>

                    <div className="relative z-10 max-w-4xl mx-auto p-6 md:p-12 lg:p-24 flex flex-col gap-16">

                        <header>
                            <AdaptiveWrapper
                                fallback={
                                    <h2 className="text-4xl md:text-6xl font-heading text-gray-500 mb-4 transition-colors">
                                        Data Minimalist
                                    </h2>
                                }
                            >
                                <motion.h2
                                    className="text-4xl md:text-6xl font-heading text-text-primary mb-4"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1, type: "spring" }}
                                >
                                    Experience the Full Vision
                                </motion.h2>
                            </AdaptiveWrapper>
                            <p className="text-text-secondary font-mono text-sm uppercase tracking-widest opacity-70">
                                This environment adapts to serve your device.
                            </p>
                        </header>

                        {/* Heavy Image / Media Component */}
                        <div className={`p-1 rounded-2xl transition-colors duration-1000 ${tier === 'ECO' ? 'bg-zinc-900 border border-zinc-800' : 'bg-gradient-to-r from-accent/30 to-purple-500/30'}`}>
                            <div className={`rounded-xl overflow-hidden aspect-video relative transition-colors duration-1000 ${tier === 'ECO' ? 'bg-black' : 'bg-bg-card'}`}>
                                <AdaptiveMedia
                                    isVideo={true}
                                    highResSrc="https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
                                    lowResSrc="" // Dummy transparent gif or simple loading fallback handled internally by wrapper
                                    alt="High fidelity showcase video"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Interactive Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <AdaptiveWrapper
                                    key={i}
                                    disableMotionOnMedium={true}
                                    fallback={
                                        <div className="p-6 border border-zinc-900 bg-zinc-950 rounded font-mono text-xs opacity-50">
                                            [Static Component Block {i}]
                                        </div>
                                    }
                                >
                                    <motion.div
                                        className="p-6 border border-border bg-bg-card/50 backdrop-blur rounded hover:border-accent group transition-colors"
                                        whileHover={{ y: -10, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <h4 className="text-accent font-heading text-2xl mb-2 group-hover:block transition-all">Feature {i}</h4>
                                        <p className="text-sm text-text-secondary">Fully animated, hardware accelerated React component block utilizing Matrix transforms.</p>
                                    </motion.div>
                                </AdaptiveWrapper>
                            ))}
                        </div>

                    </div>
                </div>

            </div>

        </main>
    );
}

export default function AdaptiveSurvivorPage() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <HardwareOracleProvider>
            <AdaptiveDashboard />
        </HardwareOracleProvider>
    );
}
