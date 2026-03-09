"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import MagneticButton from "@/components/MagneticButton";
import { PortalProvider, usePortalManager } from "@/components/experiments/PortalManager";
import SyncEntity from "@/components/experiments/SyncEntity";

function PortalDashboard() {
    const {
        isConnected,
        toggleConnection,
        entityState,
        setEntityType,
        otherWindows
    } = usePortalManager();

    const connectedCount = Object.keys(otherWindows).length;

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col md:flex-row overflow-hidden relative selection:bg-accent selection:text-white font-sans">

            {/* Left: Control Panel */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="w-full md:w-80 lg:w-96 bg-bg-card border-r border-border shrink-0 z-20 flex flex-col items-start h-[40vh] md:h-screen overflow-y-auto relative shadow-2xl"
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
                            <span className="text-[10px] uppercase font-mono tracking-widest text-text-muted">EXP_005</span>
                        </div>
                        <h1 className="text-3xl font-heading uppercase tracking-tighter text-accent mb-2">Cross-Window Portal</h1>
                        <p className="text-xs text-text-secondary leading-relaxed">
                            A local BroadcastChannel experiment. Objects break free from the browser sandbox and sync across physical monitor coordinates.
                        </p>
                    </div>

                    <div className="w-full h-px bg-border flex-shrink-0" />

                    {/* Network Status */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-mono uppercase tracking-wider text-text-muted">Network Status</span>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                <span className={`text-[10px] uppercase font-bold tracking-widest ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                                    {isConnected ? 'ONLINE' : 'OFFLINE'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between bg-bg-primary border border-border p-3 rounded-lg">
                            <span className="text-[10px] font-mono uppercase text-text-secondary">Connected Nodes</span>
                            <span className="text-lg font-heading text-accent">{connectedCount + 1}</span>
                        </div>

                        <button
                            onClick={toggleConnection}
                            className={`py-3 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors border ${isConnected
                                    ? 'border-red-500/30 text-red-500 hover:bg-red-500/10'
                                    : 'border-green-500/30 text-green-500 hover:bg-green-500/10'
                                }`}
                        >
                            {isConnected ? 'Sever Connection' : 'Establish Link'}
                        </button>
                    </div>

                    <div className="w-full h-px bg-border flex-shrink-0" />

                    {/* Controls */}
                    <div className="flex flex-col gap-6 w-full flex-grow">
                        <div className="flex flex-col gap-3">
                            <span className="text-xs font-mono uppercase tracking-wider text-text-muted">Entity Type</span>

                            <div className="grid grid-cols-1 gap-2">
                                {(["energy-ball", "drone", "anime"] as const).map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setEntityType(type)}
                                        className={`py-3 px-4 flex items-center justify-between border rounded text-xs font-mono uppercase tracking-widest transition-all ${entityState?.type === type
                                                ? 'border-accent bg-accent/10 text-accent'
                                                : 'border-border text-text-muted hover:border-text-muted'
                                            }`}
                                    >
                                        <span>{type.replace("-", " ")}</span>
                                        {entityState?.type === type && <span className="w-1.5 h-1.5 bg-accent rounded-full" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex-shrink-0">
                        <div className="p-4 border border-accent/30 bg-accent/5 text-[10px] text-accent font-mono leading-relaxed rounded flex flex-col gap-2">
                            <span>{'//'} <strong>HOW TO USE:</strong></span>
                            <ol className="list-decimal pl-4 space-y-1 opacity-80">
                                <li>Tear off a new Chrome Window (not a tab) and put it side-by-side with this one.</li>
                                <li>Navigate both to this route.</li>
                                <li>Grab the entity and throw it across the bezel into the other window!</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Right: The Grid Execution Environment */}
            <div className="flex-1 h-[60vh] md:h-screen w-full relative overflow-hidden bg-bg-primary radial-grid">
                {/* Visual grid background for depth */}
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(var(--accent) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* The synchronized entity logic */}
                <SyncEntity />
            </div>

        </main>
    );
}

export default function CrossWindowPage() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <PortalProvider>
            <PortalDashboard />
        </PortalProvider>
    );
}
