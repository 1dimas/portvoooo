"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github, ImageIcon, ExternalLink } from "lucide-react";
import MagneticButton from "./MagneticButton";
import Image from "next/image"; // Added for Next.js Image component

interface ProjectCardProps {
    project: {
        title: string;
        category: string;
        description: string;
        tech: string[];
        liveUrl?: string;
        githubUrl?: string;
        image?: string; // Optional image path
    };
    index: number;
}

export default function ProjectCard({
    project,
    index,
}: ProjectCardProps) {
    return (
        <div className="flex-shrink-0 w-[85vw] md:w-[70vw] lg:w-[55vw] h-[70vh] md:h-[75vh]">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative h-full overflow-hidden bg-bg-card border-2 border-border group"
            >
                {/* Project Image/Preview Area */}
                <div className="relative aspect-video w-full overflow-hidden border-b-2 border-border p-0">
                    {/* Architectural Grid Background (only visible if no image or image breaks) */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]" />

                    <motion.div
                        className="absolute inset-0 w-full h-full flex items-center justify-center p-8 md:p-12 z-10"
                        whileHover={{ scale: project.image ? 1.05 : 1.02 }} // Scale slightly differently based on content type
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        {project.image ? (
                            <div className="relative w-full h-full border-2 border-text-primary overflow-hidden bg-bg-primary shadow-[-8px_8px_0px_0px_var(--color-accent)]">
                                <Image
                                    src={project.image}
                                    alt={`Screenshot of ${project.title}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    priority={index === 0}
                                />
                            </div>
                        ) : (
                            <div className="w-full h-full bg-accent border-2 border-border flex items-center justify-center relative overflow-hidden group-hover:border-text-primary transition-colors duration-300">
                                {/* Inner mechanical frame */}
                                <div className="absolute w-[80%] h-[80%] border border-black/20 flex flex-col items-center justify-center gap-4 bg-bg-card shadow-[-8px_8px_0px_0px_var(--color-primary)]">
                                    <ImageIcon className="w-12 h-12 text-text-muted group-hover:text-text-primary transition-colors duration-300" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-text-muted px-4 py-1 border border-border">
                                        {project.title}
                                    </span>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Content Block */}
                <div className="p-8 md:p-10 flex flex-col justify-between h-[50%] bg-bg-card relative">

                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-accent text-xs font-bold tracking-[0.2em] uppercase bg-accent/10 px-3 py-1 border border-accent/30">
                                {project.category}
                            </span>
                        </div>
                        <h3 className="text-3xl md:text-5xl font-black font-heading mb-4 text-text-primary uppercase tracking-tighter">
                            {project.title}
                        </h3>
                        <p className="text-text-secondary text-base md:text-lg leading-relaxed line-clamp-2 md:line-clamp-3">
                            {project.description}
                        </p>
                    </div>

                    <div>
                        {/* Tech stack tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {project.tech.map((tech) => (
                                <span
                                    key={tech}
                                    className="px-3 py-1 text-xs font-bold uppercase tracking-widest bg-bg-tertiary text-text-primary border border-border"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>

                        {/* Brutalist Action buttons */}
                        <div className="flex gap-4">
                            {project.liveUrl && (
                                <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-3 bg-text-primary text-bg-primary text-sm font-bold uppercase tracking-widest border-2 border-text-primary hover:bg-accent hover:border-accent hover:text-black transition-colors duration-300"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    Live Demo
                                </a>
                            )}
                            {project.githubUrl && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-3 bg-transparent text-text-primary text-sm font-bold uppercase tracking-widest border-2 border-border hover:border-text-primary transition-colors duration-300"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                    GitHub
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
