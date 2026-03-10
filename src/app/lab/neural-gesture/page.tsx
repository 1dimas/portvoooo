"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import MagneticButton from "@/components/MagneticButton";
import { GestureProvider, useGesture } from "@/components/experiments/GestureProvider";
import VirtualCursor from "@/components/experiments/VirtualCursor";

const HolographicMenu = () => {
    const { isPinching, cursorPos, isReady } = useGesture();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const menuItems = ["Initialize", "Calibrate", "Access Mainframe", "Self Destruct"];

    // A simple hit-test simulation since we aren't using real cursor events
    // Wait, the "VirtualCursor" is just a visual overlay. To make standard DOM elements
    // react to the Hand Gesture, we can either:
    // 1. Synthesize Mouse Events (complex, security restrictions)
    // 2. Do Box Collision in requestAnimationFrame
    // For simplicity, let's use standard pointer-events? NO! The actual mouse is stationary.
    // So we MUST use collision detection against component bounds.

    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

    useEffect(() => {
        if (!isReady) return;

        let hit = null;
        for (let i = 0; i < menuItems.length; i++) {
            const el = itemRefs.current[i];
            if (el) {
                const rect = el.getBoundingClientRect();
                // Simple AABB collision with the cursor point
                if (
                    cursorPos.x >= rect.left &&
                    cursorPos.x <= rect.right &&
                    cursorPos.y >= rect.top &&
                    cursorPos.y <= rect.bottom
                ) {
                    hit = menuItems[i];
                    break;
                }
            }
        }

        setHoveredItem(hit);

        // Simulate click
        if (hit && isPinching) {
            console.log(`Clicked on ${hit}!`);
            // Add a visual flash or toast here if needed
        }
    }, [cursorPos, isPinching, isReady]);

    return (
        <motion.div
            ref={containerRef}
            className="flex flex-col gap-4 p-8 border border-accent/30 bg-accent/5 backdrop-blur-md rounded-2xl shadow-[0_0_50px_rgba(var(--accent-rgb),0.2)]"
            // Tilt the menu slightly for 3D holographic effect
            style={{ perspective: 1000 }}
            animate={{
                rotateX: (cursorPos.y - window.innerHeight / 2) * -0.05,
                rotateY: (cursorPos.x - window.innerWidth / 2) * 0.05,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 30 }}
        >
            <h3 className="text-accent font-mono uppercase tracking-[0.2em] text-sm mb-4 border-b border-accent/20 pb-2">
                Neural Uplink Menu
            </h3>

            {menuItems.map((item, idx) => {
                const isActive = hoveredItem === item;
                const isClicked = isActive && isPinching;

                return (
                    <motion.div
                        key={item}
                        ref={(el) => { itemRefs.current[idx] = el; }} // No return value
                        className={`relative px-6 py-4 border rounded cursor-none transition-colors ${isActive
                                ? 'bg-accent/20 border-accent text-accent'
                                : 'bg-transparent border-border text-text-muted'
                            }`}
                        animate={{
                            scale: isClicked ? 0.95 : isActive ? 1.05 : 1,
                            x: isActive ? 10 : 0
                        }}
                    >
                        {isActive && (
                            <motion.span
                                layoutId="active-indicator"
                                className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-l"
                            />
                        )}
                        <span className="font-heading uppercase tracking-wider">{item}</span>
                        {isClicked && (
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono animate-pulse">
                                EXECUTING...
                            </span>
                        )}
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

const NeuralCanvas = () => {
    const { isPinching, cursorPos, isReady } = useGesture();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const lastPosRef = useRef<{ x: number, y: number } | null>(null);

    // Setup canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Make canvas fill its container
        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            }
        };
        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    // Drawing Logic
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !isReady) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Get bounding rect to calculate relative cursor pos
        const rect = canvas.getBoundingClientRect();
        const relX = cursorPos.x - rect.left;
        const relY = cursorPos.y - rect.top;

        if (isPinching) {
            ctx.strokeStyle = "rgba(var(--accent-rgb), 0.8)";
            ctx.lineWidth = 4;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            // Add a neon glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = "rgba(var(--accent-rgb), 1)";

            if (lastPosRef.current) {
                ctx.beginPath();
                ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
                ctx.lineTo(relX, relY);
                ctx.stroke();
            }
            lastPosRef.current = { x: relX, y: relY };
        } else {
            lastPosRef.current = null;
        }

    }, [cursorPos, isPinching, isReady]);

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    return (
        <div className="relative w-full h-full border border-dashed border-border/50 rounded-xl bg-bg-card/30 overflow-hidden">
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <span className="text-[10px] uppercase font-mono text-text-muted bg-bg-primary/50 px-2 py-1 rounded backdrop-blur">
                    Pinch & Drag to Paint
                </span>
            </div>
            <button
                onClick={clearCanvas}
                className="absolute top-4 right-4 z-[60] text-[10px] uppercase font-mono text-text-muted hover:text-red-400 bg-bg-primary/50 px-2 py-1 rounded backdrop-blur border border-border hover:border-red-400 transition-colors pointer-events-auto"
            >
                Clear
            </button>
            <canvas
                ref={canvasRef}
                className="w-full h-full pointer-events-none"
            />
        </div>
    );
};

function NeuralDashboard() {
    const {
        isReady,
        isInitializing,
        error,
        enableWebcam,
        sensitivity,
        setSensitivity,
        landmarks
    } = useGesture();

    const [debugMode, setDebugMode] = useState(false);

    // Render debug skeleton on a mini canvas 
    const debugCanvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!debugMode || !landmarks) return;
        const canvas = debugCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw points
        ctx.fillStyle = "red";
        landmarks.forEach(lm => {
            // Un-flip X just for the debug view (so it matches the camera feed naturally)
            const x = lm.x * canvas.width;
            const y = lm.y * canvas.height;
            ctx.fillRect(x - 2, y - 2, 4, 4);
        });

        // Draw basic lines (wrist to thumb, etc - omitted for simplicity, just points is enough)

    }, [landmarks, debugMode]);

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col md:flex-row overflow-hidden relative selection:bg-accent selection:text-white font-sans cursor-crosshair">

            <VirtualCursor />

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
                                <Link href="/lab" className="text-text-muted hover:text-accent transition-colors flex items-center justify-center w-8 h-8 rounded border border-border bg-bg-primary pointer-events-auto">
                                    ←
                                </Link>
                            </MagneticButton>
                            <span className="text-[10px] uppercase font-mono tracking-widest text-text-muted">EXP_007</span>
                        </div>
                        <h1 className="text-3xl font-heading uppercase tracking-tighter text-accent mb-2 leading-tight">Neural<br />Gesture</h1>
                        <p className="text-xs text-text-secondary leading-relaxed">
                            Control the DOM without touching your device. Powered by AI hand tracking.
                        </p>
                    </div>

                    <div className="w-full h-px bg-border flex-shrink-0" />

                    {/* Uplink Status */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-mono uppercase tracking-wider text-text-muted">Vision Uplink</span>

                            {!isReady && !isInitializing && (
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-red-500">OFFLINE</span>
                                </div>
                            )}

                            {isInitializing && (
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-yellow-500">BOOTING AI</span>
                                </div>
                            )}

                            {isReady && (
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-green-500">ONLINE</span>
                                </div>
                            )}
                        </div>

                        {!isReady ? (
                            <button
                                onClick={enableWebcam}
                                disabled={isInitializing}
                                className="w-full py-4 border border-accent/50 bg-accent/10 hover:bg-accent/20 text-accent font-mono uppercase tracking-widest text-xs rounded transition-colors disabled:opacity-50 pointer-events-auto relative overflow-hidden group"
                            >
                                <span className="relative z-10">{isInitializing ? "Loading Weights..." : "Initialize Camera"}</span>
                            </button>
                        ) : (
                            <div className="text-xs text-green-400 font-mono p-3 bg-green-900/10 border border-green-500/20 rounded">
                                HandLandmarker active. Move your hand in front of the camera.
                            </div>
                        )}

                        {error && (
                            <div className="text-xs text-red-400 p-3 bg-red-900/10 border border-red-500/20 rounded mt-2">
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="w-full h-px bg-border flex-shrink-0" />

                    {/* Sensor Controls */}
                    <div className="flex flex-col gap-6 w-full flex-grow">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-text-muted">
                                <label>Pinch Trigger Range</label>
                                <span className="text-accent">{(sensitivity * 100).toFixed(0)}%</span>
                            </div>
                            <input
                                type="range" min="0.02" max="0.15" step="0.01"
                                value={sensitivity} onChange={e => setSensitivity(Number(e.target.value))}
                                className="w-full h-1 bg-border rounded-lg appearance-none cursor-ew-resize accent-accent pointer-events-auto"
                            />
                            <p className="text-[10px] text-text-muted mt-1">Increase if pinching feels too hard.</p>
                        </div>

                        <div className="flex flex-col gap-3 mt-4">
                            <button
                                onClick={() => setDebugMode(p => !p)}
                                className={`py-3 px-4 flex items-center justify-between border rounded text-xs font-mono uppercase tracking-widest transition-all pointer-events-auto ${debugMode
                                        ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-500'
                                        : 'border-border text-text-muted hover:border-text-muted'
                                    }`}
                            >
                                <span>Sensor View (Debug)</span>
                                {debugMode && <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-ping" />}
                            </button>
                        </div>

                        {/* Debug Canvas Window */}
                        {debugMode && (
                            <div className="w-full aspect-video bg-black rounded overflow-hidden border border-border relative">
                                <canvas ref={debugCanvasRef} width={320} height={240} className="w-full h-full object-cover" />
                                <span className="absolute bottom-2 left-2 text-[8px] font-mono text-yellow-500 uppercase">RAW SENSORS</span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Right: The Environment */}
            <div className="flex-1 h-[60vh] md:h-screen w-full relative overflow-hidden bg-bg-primary p-6 md:p-12 lg:p-24 flex items-center justify-center">

                {/* Background Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />

                {!isReady ? (
                    <div className="text-center opacity-30 font-mono uppercase tracking-widest text-text-muted flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border border-current rounded flex items-center justify-center opacity-50 mb-2">
                            [ /// ]
                        </div>
                        Awaiting Neural Uplink
                    </div>
                ) : (
                    <div className="w-full h-full max-w-6xl mx-auto flex flex-col xl:flex-row gap-12 items-center justify-center z-10 relative">

                        {/* 3D Holographic Menu */}
                        <div className="w-full xl:w-1/3 shrink-0 flex items-center justify-center h-[400px]">
                            <HolographicMenu />
                        </div>

                        {/* Interactive Painting Canvas */}
                        <div className="w-full xl:flex-1 h-[400px] xl:h-full max-h-[600px] relative">
                            <NeuralCanvas />
                        </div>

                    </div>
                )}

            </div>

        </main>
    );
}

export default function NeuralGesturePage() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <GestureProvider>
            <NeuralDashboard />
        </GestureProvider>
    );
}
