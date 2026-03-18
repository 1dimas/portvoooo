"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";

import { projects } from "@/data/projects";

export default function ProjectsSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollComponentRef = useRef<HTMLDivElement>(null);
    const [scrollRange, setScrollRange] = useState(0);

    // Calculate exact scroll distance needed based on actual rendered width
    useEffect(() => {
        const updateRange = () => {
            if (scrollComponentRef.current) {
                // Total width of content - viewport width = the exact amount we need to translate
                const range = scrollComponentRef.current.scrollWidth - window.innerWidth;
                setScrollRange(range > 0 ? range : 0);
            }
        };
        updateRange();
        window.addEventListener("resize", updateRange);
        return () => window.removeEventListener("resize", updateRange);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const x = useTransform(
        scrollYProgress,
        [0, 1],
        [0, -scrollRange]
    );

    // Dynamic height: mobile needs much more scroll distance because the cards are wider (80vw)
    // vs desktop (40vw). We add a resize listener for this too.
    const [containerHeight, setContainerHeight] = useState("400vh");

    useEffect(() => {
        const updateHeight = () => {
            const isMobile = window.innerWidth < 768;
            // On mobile, give it 150vh per project to ensure slow, smooth scrolling
            // On desktop, 100vh per project is enough
            const multiplier = isMobile ? 150 : 100;
            setContainerHeight(`${(projects.length + 1) * multiplier}vh`);
        };
        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    return (
        <section id="projects" ref={containerRef} className="relative" style={{ height: containerHeight }}>
            {/* Background */}
            <div className="absolute inset-0 bg-bg-primary" />

            <div className="sticky top-0 h-screen overflow-hidden">
                <div className="relative z-10 h-full flex flex-col justify-center">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-8 px-6"
                    >
                        <span className="text-bg-primary text-sm font-bold uppercase tracking-widest bg-text-primary px-4 py-1.5 border-2 border-text-primary">
                            Portfolio
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading mt-6 mb-3 uppercase tracking-wider text-text-primary">
                            Featured <span className="text-accent underline decoration-4 underline-offset-8">Projects</span>
                        </h2>
                        <p className="text-text-secondary text-sm md:text-base mt-2">
                            Real-world projects I&apos;ve designed and built.
                        </p>
                    </motion.div>

                    {/* Horizontal Scroll Container */}
                    <motion.div
                        ref={scrollComponentRef}
                        style={{ x }}
                        className="flex gap-12 pl-[10vw] pr-[10vw] w-max"
                    >
                        {projects.map((project, index) => (
                            <ProjectCard key={project.title} project={project} index={index} />
                        ))}
                    </motion.div>

                    {/* Scroll Progress Indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
                        <div className="w-32 h-1 rounded-full bg-bg-card overflow-hidden">
                            <motion.div
                                style={{ scaleX: scrollYProgress }}
                                className="h-full bg-gradient-to-r from-accent to-cyan origin-left rounded-full"
                            />
                        </div>
                        <span className="text-text-muted text-xs font-mono">
                            Scroll ↓
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
