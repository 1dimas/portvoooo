"use client";

import { motion } from "framer-motion";
import ParticleField from "@/components/animations/ParticleField";
import ScrambleText from "@/components/ScrambleText";
import LabItemCard from "@/components/LabItemCard";
import Link from "next/link";
import MagneticButton from "@/components/MagneticButton";
import { labItems } from "@/data/lab";


export default function LabPage() {
    const activeItems = labItems.filter(item => item.status === "Done");
    const comingSoonItems = labItems.filter(item => item.status !== "Done");

    return (
        <main className="min-h-screen bg-bg-primary relative overflow-hidden selection:bg-accent selection:text-white">
            <ParticleField />

            <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-32">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-20"
                >
                    <MagneticButton>
                        <Link href="/" className="inline-flex items-center gap-4 text-text-secondary hover:text-accent font-mono uppercase tracking-widest text-sm transition-colors cursor-none">
                            <span className="text-xl">←</span>
                            <span>Return to Base</span>
                        </Link>
                    </MagneticButton>
                </motion.div>

                {/* Lab Header */}
                <div className="mb-24 md:mb-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                        className="inline-block border border-accent/30 bg-accent/5 px-4 py-1 mb-8"
                    >
                        <span className="text-accent font-mono text-xs uppercase tracking-[0.3em] font-bold">Warning: Experimental Zone</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
                        className="text-[clamp(3rem,8vw,6rem)] font-heading leading-[0.9] tracking-wide uppercase text-text-primary mb-6"
                    >
                        The <span className="text-accent">Lab</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-text-secondary max-w-2xl text-lg md:text-xl font-mono leading-relaxed"
                    >
                        <ScrambleText text="Kumpulan eksperimen UI/UX, micro-interactions, dan eksplorasi visual yang terlalu liar untuk production." delay={0.5} />
                    </motion.p>
                </div>

                {/* Active Experiments Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {activeItems.map((item, index) => (
                        <LabItemCard
                            key={index}
                            {...item}
                            delay={0.6 + (index * 0.1)}
                        />
                    ))}
                </div>

                {/* Coming Soon Divider */}
                {comingSoonItems.length > 0 && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="mt-32 mb-16 flex items-center gap-8"
                        >
                            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-border to-transparent" />
                            <h2 className="text-text-muted font-mono text-xs uppercase tracking-[0.5em] whitespace-nowrap px-4 border border-border py-2 bg-bg-card">
                                Next_Phases // Incoming_Signals
                            </h2>
                            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-border to-transparent" />
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                            {comingSoonItems.map((item, index) => (
                                <LabItemCard
                                    key={`coming-${index}`}
                                    {...item}
                                    delay={0.2 + (index * 0.1)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
