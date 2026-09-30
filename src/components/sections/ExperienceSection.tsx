"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useSpring } from "framer-motion";
import ScrambleText from "@/components/ScrambleText";
import CountUp from "@/components/reactbits/CountUp";
import { experiences, type Experience } from "@/data/experience";

/**
 * Badge style per experience type.
 * Dibedakan lewat fill vs outline, bukan hue — palette-nya monokrom + satu aksen pink,
 * dan token `cyan` di globals.css memang di-map ke warna accent yang sama.
 */
function getTypeClasses(type: Experience["type"]) {
    switch (type) {
        case "Full-time":
            return "bg-accent text-bg-primary border-accent";
        case "Freelance":
            return "text-accent border-accent";
        case "Internship":
            return "text-text-primary border-text-primary";
        default:
            return "text-text-muted border-text-muted";
    }
}

/** Angka kunci — hook visual supaya pembaca berhenti dulu sebelum membaca isinya */
function StatRow({ stats }: { stats: NonNullable<Experience["stats"]> }) {
    return (
        <div className="grid grid-cols-3 border-2 border-border divide-x-2 divide-border mt-5">
            {stats.map((stat) => (
                <div key={stat.label} className="py-4 px-2 text-center">
                    {/* CountUp mengisi angka secara imperatif — sediakan teks utuh untuk screen reader */}
                    <span className="sr-only">
                        {stat.value}
                        {stat.suffix} {stat.label}
                    </span>
                    <span
                        aria-hidden
                        className="block font-heading font-black text-3xl md:text-5xl text-accent leading-none tabular-nums"
                    >
                        <CountUp to={stat.value} duration={1.6} />
                        {stat.suffix}
                    </span>
                    <span
                        aria-hidden
                        className="block text-[10px] font-mono uppercase tracking-widest text-text-muted mt-2"
                    >
                        {stat.label}
                    </span>
                </div>
            ))}
        </div>
    );
}

function ExperienceItem({ exp, index }: { exp: Experience; index: number }) {
    const itemRef = useRef<HTMLLIElement>(null);
    // Node menyala begitu entry-nya masuk area baca, lalu tetap menyala.
    const isReached = useInView(itemRef, { once: true, margin: "0px 0px -35% 0px" });

    return (
        <motion.li
            ref={itemRef}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="relative pl-8 md:pl-12 pb-10 last:pb-0"
        >
            {/* Node timeline */}
            <span
                aria-hidden
                className={`absolute left-0 top-2.5 w-3.5 h-3.5 border-2 rotate-45 transition-colors duration-500 ${
                    isReached ? "bg-accent border-accent" : "bg-bg-primary border-border"
                }`}
            />

            <article className="group bg-bg-card border-2 border-border p-5 md:p-6 transition-all duration-300 hover:border-accent hover:shadow-[-4px_4px_0px_0px_var(--color-accent)]">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span
                        className={`text-[10px] font-mono font-bold uppercase tracking-widest border px-2 py-0.5 ${getTypeClasses(
                            exp.type
                        )}`}
                    >
                        {exp.type}
                    </span>
                    <span className="text-xs font-mono text-text-muted tracking-wider">
                        {exp.period}
                    </span>
                    {exp.confidential && (
                        <span
                            className="text-[10px] font-mono font-bold uppercase tracking-widest border border-text-muted/50 text-text-muted px-2 py-0.5"
                            title="Sistem internal perusahaan — tidak ada demo publik atau repositori terbuka"
                        >
                            🔒 Internal
                        </span>
                    )}
                </div>

                <h3 className="font-black font-heading uppercase tracking-wider text-lg md:text-2xl text-text-primary group-hover:text-accent transition-colors duration-300 leading-tight">
                    {exp.role}
                </h3>
                <p className="text-sm md:text-base text-text-secondary font-mono mt-1">
                    <span className="text-accent">▸</span> {exp.company}
                    {exp.location && ` — ${exp.location}`}
                </p>

                <p className="text-sm md:text-base text-text-secondary leading-relaxed mt-4">
                    {exp.description}
                </p>

                {exp.stats && exp.stats.length > 0 && <StatRow stats={exp.stats} />}

                {exp.highlights.length > 0 && (
                    <ul className="mt-5 space-y-2">
                        {exp.highlights.map((point) => (
                            <li
                                key={point}
                                className="flex gap-2.5 text-sm text-text-secondary leading-relaxed"
                            >
                                <span aria-hidden className="text-accent shrink-0 mt-0.5">
                                    ◈
                                </span>
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                )}

                {exp.modules && exp.modules.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-border">
                        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted mb-3">
                            Cakupan sistem — {exp.modules.length} modul
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {exp.modules.map((mod) => (
                                <span
                                    key={mod}
                                    className="text-[11px] font-mono text-text-secondary bg-bg-primary border border-border px-2 py-1.5 leading-snug"
                                >
                                    <span aria-hidden className="text-accent mr-1">
                                        ▪
                                    </span>
                                    {mod}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {exp.confidential && (
                    <p className="text-xs font-mono text-text-muted/80 leading-relaxed mt-4 border-l-2 border-text-muted/30 pl-3">
                        ERP internal perusahaan tidak memiliki demo publik maupun repositori
                        terbuka. Detail arsitekturnya dapat didiskusikan saat wawancara.
                    </p>
                )}

                {exp.tech.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-border">
                        {exp.tech.map((item) => (
                            <span
                                key={item}
                                className="text-[10px] font-mono uppercase tracking-wider text-text-muted border border-border px-2 py-1"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                )}
            </article>
        </motion.li>
    );
}

export default function ExperienceSection() {
    const listRef = useRef<HTMLOListElement>(null);

    // Rail terisi mengikuti posisi scroll — memberi rasa maju tanpa menyentuh teks.
    const { scrollYProgress } = useScroll({
        target: listRef,
        offset: ["start 70%", "end 70%"],
    });
    const railProgress = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <section id="experience" className="relative section-container">
            <div className="absolute inset-0 bg-bg-primary" />

            <div className="relative z-10 max-w-4xl mx-auto py-12 md:py-20">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-bg-primary text-sm font-bold uppercase tracking-widest bg-text-primary px-4 py-1.5 border-2 border-text-primary cursor-default">
                        <ScrambleText text="Journey" />
                    </span>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-heading mt-6 mb-4 tracking-wider uppercase text-text-primary cursor-default">
                        <ScrambleText text="Experi" />
                        <span className="text-accent underline decoration-4 underline-offset-8">
                            <ScrambleText text="ence" />
                        </span>
                    </h2>
                    <p className="text-text-secondary font-medium text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        Rekam jejak profesional — dari proyek freelance, magang industri, sampai
                        kontribusi organisasi.
                    </p>
                </motion.div>

                {/* Timeline */}
                <ol ref={listRef} className="relative">
                    {/* Track statis */}
                    <span
                        aria-hidden
                        className="absolute left-[7px] top-4 bottom-4 w-0.5 bg-border"
                    />
                    {/* Isian yang mengikuti scroll */}
                    <motion.span
                        aria-hidden
                        style={{ scaleY: railProgress }}
                        className="absolute left-[7px] top-4 bottom-4 w-0.5 bg-accent origin-top"
                    />
                    {experiences.map((exp, index) => (
                        <ExperienceItem key={exp.id} exp={exp} index={index} />
                    ))}
                </ol>
            </div>
        </section>
    );
}
