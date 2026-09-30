"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import EntropyEngine from "@/components/experiments/EntropyEngine";
import MagneticButton from "@/components/MagneticButton";
import { useMounted } from "@/lib/useMounted";

const TICK_MS = 90;

export default function EntropyPage() {
    const isMounted = useMounted();
    const prefersReducedMotion = useReducedMotion();

    const [integrity, setIntegrity] = useState(100);
    const [tick, setTick] = useState(0);
    const [decayRate, setDecayRate] = useState(1.2);
    const [repairOnMove, setRepairOnMove] = useState(true);
    const [paused, setPaused] = useState(false);

    // Gerakan kursor = perhatian. Disimpan di ref supaya tidak memicu render per-pixel.
    const attentionRef = useRef(0);

    useEffect(() => {
        if (!repairOnMove) return;
        const onMove = () => {
            attentionRef.current = Math.min(attentionRef.current + 1, 40);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("touchmove", onMove);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("touchmove", onMove);
        };
    }, [repairOnMove]);

    useEffect(() => {
        if (paused) return;

        const id = window.setInterval(() => {
            setTick((t) => t + 1);
            setIntegrity((prev) => {
                // Perhatian memperbaiki, diam membusukkan.
                const repair = repairOnMove ? attentionRef.current * 0.12 : 0;
                attentionRef.current = Math.max(0, attentionRef.current - 4);
                const next = prev - decayRate * (TICK_MS / 1000) * 10 + repair;
                return Math.min(100, Math.max(0, next));
            });
        }, TICK_MS);

        return () => window.clearInterval(id);
    }, [paused, decayRate, repairOnMove]);

    if (!isMounted) return null;

    const stage =
        integrity > 85
            ? "STABIL"
            : integrity > 60
              ? "DEGRADASI RINGAN"
              : integrity > 35
                ? "KORUPSI DATA"
                : integrity > 10
                  ? "KEGAGALAN STRUKTUR"
                  : "KRITIS";

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col md:flex-row overflow-hidden relative selection:bg-accent selection:text-white">
            {/* Panel kontrol */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="w-full md:w-80 lg:w-96 bg-bg-card border-r border-border shrink-0 z-20 flex flex-col h-screen overflow-y-auto"
            >
                <div className="p-6 md:p-8 flex flex-col gap-8 h-full">
                    <div>
                        <MagneticButton>
                            <Link
                                href="/lab"
                                className="inline-flex items-center gap-3 text-text-secondary hover:text-accent font-mono uppercase tracking-widest text-xs transition-colors mb-6"
                            >
                                <span>←</span>
                                <span>Kembali ke Lab</span>
                            </Link>
                        </MagneticButton>

                        <h1 className="font-heading font-black uppercase tracking-wider text-3xl md:text-4xl leading-none">
                            Entropy
                        </h1>
                        <p className="text-text-secondary text-sm leading-relaxed mt-4">
                            Halaman yang membusuk saat diabaikan. Diamkan kursor dan struktur
                            dokumen mulai runtuh; gerakkan lagi dan ia pulih.
                        </p>
                    </div>

                    {/* Pembacaan integritas */}
                    <div className="border-2 border-border bg-bg-primary p-4">
                        <div className="flex justify-between items-baseline font-mono">
                            <span className="text-[10px] uppercase tracking-widest text-text-muted">
                                System Integrity
                            </span>
                            <span className="text-accent font-black text-2xl tabular-nums">
                                {Math.round(integrity)}%
                            </span>
                        </div>
                        <div className="w-full h-1 bg-border mt-3 overflow-hidden">
                            <div
                                className="h-full bg-accent transition-[width] duration-100"
                                style={{ width: `${integrity}%` }}
                            />
                        </div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mt-3">
                            status: <span className="text-accent">{stage}</span>
                        </p>
                    </div>

                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-text-muted">
                                <label htmlFor="decay">Laju Pembusukan</label>
                                <span className="text-accent">{decayRate.toFixed(1)}x</span>
                            </div>
                            <input
                                id="decay"
                                type="range"
                                min="0.2"
                                max="5"
                                step="0.1"
                                value={decayRate}
                                onChange={(e) => setDecayRate(Number(e.target.value))}
                                className="w-full h-1 bg-border rounded-lg appearance-none cursor-ew-resize accent-accent"
                            />
                        </div>

                        <label className="flex items-center justify-between gap-3 text-xs font-mono uppercase tracking-wider text-text-muted cursor-pointer">
                            <span>Perhatian Memulihkan</span>
                            <input
                                type="checkbox"
                                checked={repairOnMove}
                                onChange={(e) => setRepairOnMove(e.target.checked)}
                                className="w-4 h-4 accent-accent cursor-pointer"
                            />
                        </label>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setPaused((p) => !p)}
                                className="font-mono text-[10px] font-bold uppercase tracking-widest border-2 border-border text-text-secondary px-3 py-3 hover:border-accent hover:text-accent transition-colors"
                            >
                                {paused ? "Lanjutkan" : "Bekukan"}
                            </button>
                            <button
                                onClick={() => setIntegrity(100)}
                                className="font-mono text-[10px] font-bold uppercase tracking-widest border-2 border-text-primary bg-text-primary text-bg-primary px-3 py-3 hover:bg-accent hover:border-accent transition-colors"
                            >
                                $ repair
                            </button>
                        </div>
                    </div>

                    <div className="mt-auto pt-8">
                        <div className="p-4 border border-border bg-bg-primary text-[10px] text-text-muted font-mono leading-relaxed">
                            <span className="text-accent">{"//"} Coba:</span> naikkan laju
                            pembusukan ke 5x, lalu lepas mouse sepenuhnya. Perhatikan urutan
                            runtuhnya — karakter dulu, lalu tata letak, baru kanal warna.
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Panggung */}
            <div className="flex-1 h-screen relative">
                <EntropyEngine
                    integrity={integrity}
                    tick={tick}
                    still={prefersReducedMotion ?? false}
                />
            </div>
        </main>
    );
}
