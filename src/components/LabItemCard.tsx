import { motion } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";

interface LabItemCardProps {
    title: string;
    description: string;
    tech: string[];
    link?: string;
    status: "WIP" | "Done" | "Concept";
    delay?: number;
}

export default function LabItemCard({ title, description, tech, link, status, delay = 0 }: LabItemCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay, ease: [0.19, 1, 0.22, 1] }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="group relative border border-border bg-bg-card hover:bg-bg-card-hover transition-colors duration-500 overflow-hidden cursor-none flex flex-col h-full"
        >
            {/* Background animated noise/grid effect on hover */}
            <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-700`}
                style={{
                    backgroundImage: 'radial-gradient(circle at center, rgba(var(--accent-rgb, 139, 92, 246), 0.8) 0, transparent 1px)',
                    backgroundSize: '20px 20px',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 10s linear'
                }}
            />

            {/* Content Container */}
            <div className="p-6 md:p-8 flex flex-col flex-grow relative z-10 transition-transform duration-500 group-hover:-translate-y-2">

                {/* Status Badge */}
                <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-text-muted">
                        // EXP_{String(title).substring(0, 3).toUpperCase()}_{String(title).length.toString().padStart(2, '0')}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-widest border ${status === 'Done' ? 'border-green-500/50 text-green-400' :
                        status === 'WIP' ? 'border-yellow-500/50 text-yellow-400' :
                            'border-blue-500/50 text-blue-400'
                        }`}>
                        {status}
                    </span>
                </div>

                {/* Title & Desc */}
                <h3 className="text-2xl md:text-3xl font-heading uppercase text-text-primary mb-3 group-hover:text-accent transition-colors duration-300">
                    {title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-8 flex-grow">
                    {description}
                </p>

                {/* Tech & Link Footer */}
                <div className="mt-auto">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tech.map((t, i) => (
                            <span key={i} className="text-[10px] uppercase font-mono tracking-wider text-text-muted bg-black/20 px-2 py-1 border border-border/50">
                                {t}
                            </span>
                        ))}
                    </div>

                    {link ? (
                        <>
                            <Link href={link} className="hidden md:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-primary group-hover:text-accent transition-colors">
                                <span>Initialize Routine</span>
                                <motion.span
                                    animate={{ x: isHovered ? 5 : 0 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                >
                                    →
                                </motion.span>
                            </Link>
                            <span className="inline-flex md:hidden items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted">
                                <span className="opacity-50">Available on Desktop</span>
                            </span>
                        </>
                    ) : (
                        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted">
                            <span className="opacity-50 line-through">Module Locked</span>
                        </span>
                    )}
                </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
    );
}
