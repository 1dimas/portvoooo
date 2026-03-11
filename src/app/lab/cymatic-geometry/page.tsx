"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Mic, MicOff, Settings, Waves } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";
import { AudioEngine } from "@/components/experiments/AudioEngine";
import { CymaticCanvas } from "@/components/experiments/CymaticCanvas";
import { PatternType } from "@/components/experiments/FrequencyMapper";
import dynamic from "next/dynamic";

// Ensure this only runs on the client to prevent AudioContext SSR errors
const ClientOnlyCymatic = dynamic(
    () => Promise.resolve(CymaticCanvas),
    { ssr: false }
);

export default function CymaticGeometryPage() {
    const [audioEngine, setAudioEngine] = useState<AudioEngine | null>(null);
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Control Panel State
    const [pattern, setPattern] = useState<PatternType>("chladni");
    const [sensitivity, setSensitivity] = useState(1.5);
    const [theme, setTheme] = useState<'core' | 'fire' | 'neon'>("core");
    const [particles, setParticles] = useState(10000);

    const toggleAudio = async () => {
        if (isListening && audioEngine) {
            audioEngine.stop();
            setIsListening(false);
            return;
        }

        try {
            const engine = new AudioEngine();
            await engine.initialize();
            setAudioEngine(engine);
            setIsListening(true);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to access microphone.");
            setIsListening(false);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioEngine) {
                audioEngine.stop();
            }
        };
    }, [audioEngine]);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row overflow-hidden font-sans">
            {/* Main Hologram Area */}
            <div className="flex-1 relative flex flex-col h-[60vh] md:h-screen border-b md:border-b-0 md:border-r border-white/10">
                {/* Header Overlay */}
                <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-center z-50 pointer-events-none">
                    <MagneticButton className="p-2 border border-white/20 rounded-full bg-black/50 backdrop-blur-md pointer-events-auto hover:bg-white/10 transition-colors">
                        <Link href="/lab" className="text-white flex items-center gap-2 px-2 group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-mono hidden md:inline">EXIT_LAB</span>
                        </Link>
                    </MagneticButton>

                    <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg pointer-events-auto">
                        <Waves className="w-4 h-4 text-cyan-400 animate-pulse" />
                        <span className="font-mono text-xs text-white/80">CYMATIC_GEOMETRY</span>
                    </div>
                </div>

                {/* The Sandbox Canvas */}
                <div className="flex-1 w-full h-full relative cursor-crosshair">
                    <ClientOnlyCymatic
                        audioEngine={audioEngine}
                        patternType={pattern}
                        sensitivity={sensitivity}
                        colorTheme={theme}
                        particleCount={particles}
                    />

                    {/* Startup Prompt */}
                    {!isListening && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                            <div className="bg-black/60 backdrop-blur-sm border border-white/10 p-6 rounded-xl flex flex-col items-center max-w-sm text-center">
                                <MicOff className="w-8 h-8 text-white/50 mb-4" />
                                <h3 className="text-lg font-bold text-white mb-2">Sacred Geometry Awaits</h3>
                                <p className="text-sm text-white/60 mb-6">
                                    Enable microphone access to shape the digital sand using the frequencies of your voice or music.
                                </p>
                                <button
                                    onClick={toggleAudio}
                                    className="pointer-events-auto px-6 py-2 bg-white text-black font-semibold rounded hover:bg-cyan-400 transition-colors flex items-center gap-2"
                                >
                                    <Mic className="w-4 h-4" />
                                    Enable Microphone
                                </button>
                                {error && (
                                    <p className="mt-4 text-xs text-red-400 bg-red-400/10 p-2 rounded">{error}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side Control Panel */}
            <div className="w-full md:w-[320px] lg:w-[400px] h-[40vh] md:h-screen bg-black overflow-y-auto flex flex-col border-l border-white/10 shrink-0">
                <div className="p-6 border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-md z-10 flex items-center gap-3">
                    <Settings className="w-5 h-5 text-cyan-400" />
                    <div>
                        <h2 className="font-bold text-white text-lg leading-tight tracking-tight">Cymatics Engine</h2>
                        <p className="text-xs text-white/50 font-mono mt-0.5">ACOUSTIC_PARTICLE_SIMULATION</p>
                    </div>
                </div>

                <div className="p-6 space-y-8 flex-1">
                    {/* Status Toggle */}
                    <div className="space-y-3">
                        <label className="text-xs font-mono text-white/40 uppercase tracking-wider block">Engine Status</label>
                        <button
                            onClick={toggleAudio}
                            className={`w-full group relative flex items-center justify-between p-4 border rounded-lg transition-all ${isListening
                                ? 'bg-cyan-500/10 border-cyan-500/30'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }`}
                        >
                            <span className={`font-mono text-sm transition-colors ${isListening ? 'text-cyan-400' : 'text-white'}`}>
                                {isListening ? 'MICROPHONE ACTIVE' : 'ENGINE OFFLINE'}
                            </span>
                            {isListening ? (
                                <Mic className="w-4 h-4 text-cyan-400 animate-pulse" />
                            ) : (
                                <MicOff className="w-4 h-4 text-white/50" />
                            )}
                        </button>
                    </div>

                    {/* Algorithms / Patterns */}
                    <div className="space-y-3">
                        <label className="text-xs font-mono text-white/40 uppercase tracking-wider block">Geometry Algorithm</label>
                        <div className="grid grid-cols-1 gap-2">
                            {(['chladni', 'lissajous', 'spiral'] as PatternType[]).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPattern(p)}
                                    className={`p-3 text-left border rounded transition-all flex items-center gap-3 ${pattern === p
                                        ? 'bg-white/10 border-white/30 text-white'
                                        : 'border-transparent text-white/50 hover:bg-white/5 hover:text-white/80'
                                        }`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${pattern === p ? 'bg-cyan-400' : 'bg-transparent border border-white/30'}`} />
                                    <span className="capitalize font-medium text-sm">{p}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sensitivity */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-mono text-white/40 uppercase tracking-wider block">Amplitude Sensitivity</label>
                            <span className="text-xs font-mono text-cyan-400">{sensitivity.toFixed(1)}x</span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="5.0"
                            step="0.1"
                            value={sensitivity}
                            onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                            className="w-full accent-cyan-400"
                        />
                        <p className="text-xs text-white/40 leading-relaxed">
                            A higher value causes the particles to scatter wider across the canvas in response to audio.
                        </p>
                    </div>

                    {/* Theme */}
                    <div className="space-y-3">
                        <label className="text-xs font-mono text-white/40 uppercase tracking-wider block">Color Spectrum</label>
                        <div className="flex gap-2">
                            {(['core', 'fire', 'neon'] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTheme(t)}
                                    className={`flex-1 py-2 text-xs font-mono border rounded uppercase transition-all ${theme === t
                                        ? 'bg-white text-black border-white'
                                        : 'bg-transparent text-white/50 border-white/20 hover:bg-white/10'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
