"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import ScrambleText from "@/components/ScrambleText";
import { labItems } from "@/data/lab";

/**
 * MagneticGrid dimuat terpisah dan hanya saat panel mendekati viewport,
 * supaya bundle homepage tidak ikut terbebani eksperimen.
 */
const MagneticGrid = dynamic(() => import("@/components/experiments/MagneticGrid"), {
    ssr: false,
});

const playable = labItems.filter((item) => item.link);

function PreviewPanel() {
    const panelRef = useRef<HTMLDivElement>(null);
    // margin positif: mulai memuat sedikit sebelum panel terlihat.
    const shouldLoad = useInView(panelRef, { once: true, margin: "300px" });

    return (
        <div
            ref={panelRef}
            className="relative border-2 border-border bg-bg-card overflow-hidden group hover:border-accent transition-colors duration-300"
        >
            {/* Label status */}
            <div className="absolute top-0 left-0 z-20 flex items-center gap-2 px-3 py-2 border-r-2 border-b-2 border-border bg-bg-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">
                    Live — gerakkan kursor di sini
                </span>
            </div>

            <div className="relative h-[320px] md:h-[440px]">
                {shouldLoad ? (
                    <MagneticGrid
                        rows={12}
                        cols={20}
                        mode="repel"
                        visualMode="ascii"
                        power={260}
                        intensity={55}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted/50">
                            Memuat eksperimen…
                        </span>
                    </div>
                )}
            </div>

            {/* Kaki panel */}
            <div className="relative z-20 flex items-center justify-between gap-4 px-4 py-3 border-t-2 border-border bg-bg-primary">
                <div className="min-w-0">
                    <p className="font-heading uppercase tracking-wider text-sm md:text-base text-text-primary truncate">
                        Magnetic Grid
                    </p>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted truncate">
                        1 dari {playable.length} eksperimen
                    </p>
                </div>
                <Link
                    href="/lab/magnetic-grid"
                    className="shrink-0 text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest border-2 border-text-primary text-text-primary px-3 py-2 hover:bg-accent hover:border-accent hover:text-bg-primary transition-colors duration-200"
                >
                    Buka penuh →
                </Link>
            </div>
        </div>
    );
}

export default function LabSection() {
    return (
        <section id="lab" className="relative section-container">
            <div className="absolute inset-0 bg-bg-primary" />

            <div className="relative z-10 max-w-6xl mx-auto py-12 md:py-20">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <span className="text-bg-primary text-sm font-bold uppercase tracking-widest bg-text-primary px-4 py-1.5 border-2 border-text-primary cursor-default" lang="en">
                        <ScrambleText text="Laboratory" />
                    </span>
                    <h2 lang="en" className="text-h2 font-heading uppercase text-text-primary mt-6 mb-4 cursor-default">
                        <ScrambleText text="The " />
                        <span className="text-accent underline decoration-4 underline-offset-8">
                            <ScrambleText text="Lab" />
                        </span>
                    </h2>
                    <p className="text-text-secondary text-lead max-w-2xl mx-auto">
                        {playable.length} eksperimen antarmuka yang bisa langsung dicoba — hand
                        tracking, sinkronisasi antar-jendela, visualizer audio, sampai codebase 3D.
                    </p>
                </motion.div>

                {/* Preview interaktif */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6 }}
                >
                    <PreviewPanel />
                </motion.div>

                {/* Eksperimen lain */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                    {playable
                        .filter((item) => item.link !== "/lab/magnetic-grid")
                        .map((item, index) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                            >
                                <Link
                                    href={item.link!}
                                    className="group flex flex-col justify-between h-full border-2 border-border bg-bg-card p-4 hover:border-accent hover:shadow-[-4px_4px_0px_0px_var(--color-accent)] transition-all duration-300"
                                >
                                    <p className="font-heading uppercase tracking-wider text-sm text-text-primary group-hover:text-accent transition-colors duration-300 leading-tight">
                                        {item.title}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {item.tech.slice(0, 2).map((t) => (
                                            <span
                                                key={t}
                                                className="text-[9px] font-mono uppercase tracking-wider text-text-muted border border-border px-1.5 py-0.5"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex justify-center mt-10"
                >
                    <Link
                        href="/lab"
                        className="font-heading uppercase tracking-widest text-sm md:text-base border-2 border-text-primary text-text-primary px-8 py-4 hover:bg-accent hover:border-accent hover:text-bg-primary transition-colors duration-200"
                    >
                        Masuk ke Lab →
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
