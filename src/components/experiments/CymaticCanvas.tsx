"use client";

import React, { useEffect, useRef, useState } from "react";
import { AudioEngine } from "./AudioEngine";
import { FrequencyMapper, PatternType } from "./FrequencyMapper";

interface CymaticCanvasProps {
    audioEngine: AudioEngine | null;
    patternType: PatternType;
    sensitivity: number;
    colorTheme: 'core' | 'fire' | 'neon';
    particleCount?: number;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    targetX: number;
    targetY: number;
    life: number;
    maxLife: number;
    colorIntensity: number;
}

export function CymaticCanvas({
    audioEngine,
    patternType,
    sensitivity,
    colorTheme,
    particleCount = 10000
}: CymaticCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>(-1);

    // Core references
    const particlesRef = useRef<Particle[]>([]);
    const mapperRef = useRef<FrequencyMapper | null>(null);
    const timeRef = useRef<number>(0);

    // Snapshot state
    const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);

    // Initialize particles and mapper
    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return;

        const { clientWidth, clientHeight } = containerRef.current;
        canvasRef.current.width = clientWidth;
        canvasRef.current.height = clientHeight;

        mapperRef.current = new FrequencyMapper(clientWidth, clientHeight);

        // Initialize particles with random positions
        const initialParticles: Particle[] = [];
        for (let i = 0; i < particleCount; i++) {
            initialParticles.push({
                x: Math.random() * clientWidth,
                y: Math.random() * clientHeight,
                vx: 0,
                vy: 0,
                targetX: clientWidth / 2,
                targetY: clientHeight / 2,
                life: Math.random(),
                maxLife: 0.5 + Math.random() * 0.5,
                colorIntensity: 0
            });
        }
        particlesRef.current = initialParticles;

        const handleResize = () => {
            if (!containerRef.current || !canvasRef.current || !mapperRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            canvasRef.current.width = w;
            canvasRef.current.height = h;
            mapperRef.current.updateDimensions(w, h);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [particleCount]);

    // Main Render Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d', { alpha: false }); // alpha: false optimizes performance for solid backgrounds
        const mapper = mapperRef.current;
        const particles = particlesRef.current;

        if (!canvas || !ctx || !mapper) return;

        const getThemeColor = (theme: string, intensity: number) => {
            const opacity = Math.min(1, 0.3 + intensity * 2);
            switch (theme) {
                case 'fire':
                    const hueFire = 10 + (intensity * 50);
                    return `hsla(${hueFire}, 100%, 60%, ${opacity})`;
                case 'neon':
                    const hueNeon = 280 - (intensity * 100);
                    return `hsla(${hueNeon}, 100%, 60%, ${opacity})`;
                case 'core':
                default:
                    const lightness = 50 + (intensity * 50);
                    return `hsla(190, 80%, ${lightness}%, ${opacity})`;
            }
        };

        const renderLoop = () => {
            timeRef.current += 0.01;
            const w = canvas.width;
            const h = canvas.height;

            // Semi-transparent black for trailing effect
            ctx.fillStyle = 'rgba(5, 5, 5, 0.15)';
            ctx.fillRect(0, 0, w, h);

            let targets: import("./FrequencyMapper").ParticleTarget[] = [];

            // Get frequency data if engine is active
            if (audioEngine && audioEngine.isInitialized()) {
                const freqData = audioEngine.getFrequencyData();
                targets = mapper.getTargets(freqData, patternType, sensitivity, timeRef.current);
            }

            // If no audio or silent, slowly pull everything to center
            const hasTargets = targets.length > 0;
            const centerX = w / 2;
            const centerY = h / 2;

            // Batch rendering optimization
            ctx.beginPath();

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Assign a target based on particle index mapping to frequency bins
                if (hasTargets) {
                    const targetIndex = i % targets.length;
                    const t = targets[targetIndex];

                    // Add some noise so they don't all stack exactly on the same pixel
                    const noise = (Math.random() - 0.5) * 10;
                    p.targetX = t.x + noise;
                    p.targetY = t.y + noise;
                    p.colorIntensity = t.colorIntensity;
                } else {
                    // Idle state: slow swarm around center
                    p.targetX = centerX + Math.cos(timeRef.current + i) * 100;
                    p.targetY = centerY + Math.sin(timeRef.current + i) * 100;
                    p.colorIntensity *= 0.95; // Fade out
                }

                // Spring physics towards target
                const dx = p.targetX - p.x;
                const dy = p.targetY - p.y;

                // Acceleration
                p.vx += dx * 0.02;
                p.vy += dy * 0.02;

                // Friction/Damping
                p.vx *= 0.85;
                p.vy *= 0.85;

                p.x += p.vx;
                p.y += p.vy;

                // Screen wrapping/bouncing safety
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;

                // Render point
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x + 1.5, p.y + 1.5); // 1.5px size

                // Update life (optional visual flair)
                p.life -= 0.01;
                if (p.life <= 0) p.life = p.maxLife;
            }

            // Determine color based on theme and average intensity
            // For 10k particles, strokeStyle per particle is too slow. 
            // We use global composite and a single stroke color dictated by the audio volume.
            let avgIntensity = 0;
            if (audioEngine && audioEngine.isInitialized()) {
                avgIntensity = audioEngine.getAverageVolume();
            }

            ctx.strokeStyle = getThemeColor(colorTheme, avgIntensity);
            ctx.stroke();

            requestRef.current = requestAnimationFrame(renderLoop);
        };

        requestRef.current = requestAnimationFrame(renderLoop);

        return () => {
            if (requestRef.current !== -1) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [audioEngine, patternType, sensitivity, colorTheme]);

    const takeSnapshot = () => {
        if (canvasRef.current) {
            const url = canvasRef.current.toDataURL("image/png");
            setSnapshotUrl(url);
        }
    };

    const downloadSnapshot = () => {
        if (snapshotUrl) {
            const link = document.createElement('a');
            link.download = `cymatic-snapshot-${Date.now()}.png`;
            link.href = snapshotUrl;
            link.click();
            setSnapshotUrl(null);
        }
    };

    return (
        <div className="relative w-full h-full bg-black overflow-hidden" ref={containerRef}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.2))" }}
            />

            {/* Snapshot UI */}
            <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 items-end">
                <button
                    onClick={takeSnapshot}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-md text-xs font-mono text-white transition-all shadow-lg"
                >
                    [CAPTURE_SNAPSHOT]
                </button>

                {snapshotUrl && (
                    <div className="mt-2 p-2 bg-black/80 border border-border rounded-lg shadow-2xl animate-in fade-in slide-in-from-top-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={snapshotUrl} alt="Snapshot" className="w-48 h-auto rounded border border-white/10 mb-2" />
                        <div className="flex gap-2">
                            <button
                                onClick={downloadSnapshot}
                                className="flex-1 px-2 py-1 bg-accent/20 hover:bg-accent/40 text-accent rounded text-xs transition-colors"
                            >
                                SAVE PNG
                            </button>
                            <button
                                onClick={() => setSnapshotUrl(null)}
                                className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs transition-colors"
                            >
                                DISCARD
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
