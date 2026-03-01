"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ParticleField from "@/components/animations/ParticleField";
import MagneticButton from "@/components/MagneticButton";
import ScrambleText from "@/components/ScrambleText";

export default function HeroSection() {
    const containerRef = useRef<HTMLElement>(null);

    // Track scroll progress of the hero section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"] // from top of viewport to bottom of hero
    });

    // Shrinking and fading parallax effect as you scroll down
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
    const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.3, 0]);
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    const scrollToProjects = () => {
        const el = document.getElementById("projects");
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section
            id="hero"
            ref={containerRef}
            className="relative h-[200vh] bg-bg-primary"
        >
            {/* 3D Starfield Background */}
            <ParticleField />

            {/* Sticky Content Container */}
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
                <motion.div
                    style={{ scale, opacity, y }}
                    className="relative z-10 w-full flex flex-col items-center justify-center px-4 md:px-6 origin-center"
                >

                    {/* Massive Brutalist Typography */}
                    <div className="flex flex-col items-center justify-center w-full max-w-[1600px] mb-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                            className="text-[clamp(3rem,8vw,8rem)] font-heading leading-[0.9] tracking-wide uppercase text-text-primary text-center m-0 p-0"
                        >
                            DIMAS
                        </motion.h1>
                        <motion.h1
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
                            className="text-[clamp(3rem,8vw,8rem)] font-heading leading-[0.9] tracking-wide uppercase text-accent text-center m-0 p-0"
                        >
                            FULL STACK
                        </motion.h1>
                        <motion.h1
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
                            className="text-[clamp(3rem,8vw,8rem)] font-heading leading-[0.9] tracking-wide uppercase text-text-primary text-center m-0 p-0"
                        >
                            DEVELOPER
                        </motion.h1>
                    </div>

                    {/* Sub-headline */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="mt-3 text-sm md:text-base text-text-secondary max-w-xl text-center uppercase tracking-widest font-medium"
                    >
                        <ScrambleText text="Rekayasa Perangkat Lunak Berfokus Pada Performa, Konversi, dan Skalabilitas Bisnis." delay={1} />
                    </motion.div>

                    {/* Brutalist CTAs in Magnetic Wrappers */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 cursor-none"
                    >
                        <MagneticButton>
                            <button
                                onClick={scrollToProjects}
                                className="px-10 py-4 bg-text-primary text-bg-primary font-bold uppercase tracking-wider text-sm hover:bg-accent transition-colors duration-300 rounded-none cursor-none"
                            >
                                Lihat Portfolio
                            </button>
                        </MagneticButton>

                        <MagneticButton>
                            <a
                                href="#contact"
                                className="px-10 py-4 bg-transparent text-text-primary font-bold uppercase tracking-wider text-sm border-2 border-border hover:border-accent hover:text-accent transition-colors duration-300 rounded-none cursor-none block text-center"
                            >
                                Hubungi Saya
                            </a>
                        </MagneticButton>
                    </motion.div>

                    {/* Interactive Terminal Trigger */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 1 }}
                        className="mt-6 cursor-none"
                    >
                        <button
                            onClick={() => window.dispatchEvent(new Event('open-terminal'))}
                            className="bg-bg-primary/50 backdrop-blur-sm border border-border px-6 py-2 flex items-center gap-3 hover:border-accent group transition-colors duration-300"
                        >
                            <span className="text-accent text-xs font-mono group-hover:animate-pulse">_</span>
                            <span className="text-text-secondary text-xs font-mono uppercase tracking-widest group-hover:text-text-primary transition-colors">Invoke Terminal</span>
                            <span className="text-text-muted text-[10px] bg-bg-card px-2 py-0.5 rounded border border-border">Ctrl+J</span>
                        </button>
                    </motion.div>

                </motion.div>

                {/* Scroll indicator (Brutalist style) - outside the zoom motion div so it stays small */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
                >
                    <span className="text-[10px] uppercase tracking-widest text-text-muted">Scroll</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-text-muted to-transparent" />
                </motion.div>
            </div>
        </section>
    );
}
