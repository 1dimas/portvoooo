"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import DomXRay, { type HoveredLayer } from "@/components/experiments/DomXRay";
import MagneticButton from "@/components/MagneticButton";
import { useMounted } from "@/lib/useMounted";

/** Kartu contoh: sengaja bersarang beberapa tingkat agar lapisannya terbaca. */
function SpecimenCard() {
    return (
        <article className="w-[300px] md:w-[380px] bg-bg-card border-2 border-border p-5">
            <header className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent" />
                    <span className="text-label font-mono uppercase text-text-muted">
                        specimen.tsx
                    </span>
                </div>
                <span className="text-[10px] font-mono text-text-muted">v1</span>
            </header>

            <div>
                <h2 className="font-heading uppercase text-xl text-text-primary leading-tight">
                    Kartu Contoh
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed mt-2">
                    Setiap elemen di kartu ini adalah DOM asli — bukan tiruan 3D. Arahkan kursor
                    ke salah satu lapisan untuk membaca datanya.
                </p>
            </div>

            <ul className="mt-4 flex flex-col gap-1.5">
                <li className="flex items-center gap-2 text-xs font-mono text-text-muted">
                    <span className="text-accent">▪</span>
                    <span>header · kedalaman 1</span>
                </li>
                <li className="flex items-center gap-2 text-xs font-mono text-text-muted">
                    <span className="text-accent">▪</span>
                    <span>ul &gt; li &gt; span · kedalaman 3</span>
                </li>
            </ul>

            <footer className="mt-5 pt-4 border-t border-border flex gap-2">
                <button className="text-label flex-1 font-mono font-bold uppercase border-2 border-text-primary text-text-primary py-2">
                    Aksi
                </button>
                <button className="text-label flex-1 font-mono font-bold uppercase border-2 border-border text-text-muted py-2">
                    Batal
                </button>
            </footer>
        </article>
    );
}

export default function DomXRayPage() {
    const isMounted = useMounted();
    const [spacing, setSpacing] = useState(40);
    const [exploded, setExploded] = useState(1);
    const [showOutlines, setShowOutlines] = useState(true);
    const [hovered, setHovered] = useState<HoveredLayer | null>(null);

    if (!isMounted) return null;

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

                        <h1 className="font-heading uppercase text-3xl md:text-4xl leading-none">
                            DOM X-Ray
                        </h1>
                        <p className="text-text-secondary text-sm leading-relaxed mt-4">
                            Membedah pohon DOM yang sebenarnya menjadi lapisan 3D. Tiap tingkat
                            kedalaman terangkat satu langkah — dan elemennya tetap hidup.
                        </p>
                    </div>

                    {/* Pembacaan lapisan */}
                    <div className="border-2 border-border bg-bg-primary p-4 font-mono min-h-[128px]">
                        <p className="text-label uppercase text-text-muted mb-3">
                            Inspeksi Lapisan
                        </p>
                        {hovered ? (
                            <div className="flex flex-col gap-1.5 text-xs">
                                <p className="text-accent font-bold">&lt;{hovered.tag}&gt;</p>
                                <p className="text-text-secondary break-all leading-snug">
                                    {hovered.classes}
                                </p>
                                <p className="text-text-muted">
                                    kedalaman {hovered.depth} · {hovered.size}px
                                </p>
                            </div>
                        ) : (
                            <p className="text-xs text-text-muted/60">
                                arahkan kursor ke sebuah lapisan…
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-text-muted">
                                <label htmlFor="spacing">Jarak Lapisan</label>
                                <span className="text-accent">{spacing}px</span>
                            </div>
                            <input
                                id="spacing"
                                type="range"
                                min="0"
                                max="120"
                                step="5"
                                value={spacing}
                                onChange={(e) => setSpacing(Number(e.target.value))}
                                className="w-full h-1 bg-border rounded-lg appearance-none cursor-ew-resize accent-accent"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-text-muted">
                                <label htmlFor="explode">Pembongkaran</label>
                                <span className="text-accent">{Math.round(exploded * 100)}%</span>
                            </div>
                            <input
                                id="explode"
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={exploded}
                                onChange={(e) => setExploded(Number(e.target.value))}
                                className="w-full h-1 bg-border rounded-lg appearance-none cursor-ew-resize accent-accent"
                            />
                        </div>

                        <label className="flex items-center justify-between gap-3 text-xs font-mono uppercase tracking-wider text-text-muted cursor-pointer">
                            <span>Garis Batas</span>
                            <input
                                type="checkbox"
                                checked={showOutlines}
                                onChange={(e) => setShowOutlines(e.target.checked)}
                                className="w-4 h-4 accent-accent cursor-pointer"
                            />
                        </label>
                    </div>

                    <div className="mt-auto pt-8">
                        <div className="p-4 border border-border bg-bg-primary text-[10px] text-text-muted font-mono leading-relaxed">
                            <span className="text-accent">{"//"} Cara kerja:</span> transform anak
                            menumpuk di atas induknya. Jadi cukup beri tiap elemen satu{" "}
                            <code>translateZ</code>, dan kedalaman visualnya otomatis mengikuti
                            kedalaman DOM. Nol WebGL.
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Panggung */}
            <div className="flex-1 h-screen relative">
                <DomXRay
                    spacing={spacing}
                    exploded={exploded}
                    showOutlines={showOutlines}
                    onHover={setHovered}
                >
                    <SpecimenCard />
                </DomXRay>
            </div>
        </main>
    );
}
