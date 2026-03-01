"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github, ImageIcon, ExternalLink } from "lucide-react";
import MagneticButton from "./MagneticButton";
import Image from "next/image";
import Link from "next/link";
import { Project } from "@/data/projects";

interface ProjectCardProps {
    project: Project;
    index: number;
}

export default function ProjectCard({
    project,
    index,
}: ProjectCardProps) {
    return (
        <div className="flex-shrink-0 w-[80vw] md:w-[60vw] lg:w-[45vw] h-[75vh] md:h-[70vh]">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative h-full flex flex-col overflow-hidden bg-bg-card border-2 border-border group"
            >
                {/* Project Image/Preview Area */}
                <div className="relative h-[40%] md:h-[45%] w-full flex-shrink-0 overflow-hidden border-b-2 border-border p-0 bg-bg-card">
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
                <div className="p-8 md:p-10 flex-1 flex flex-col justify-between bg-bg-card relative min-h-0">

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
                            {project.liveUrl && project.liveUrl !== "#" && (
                                <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-3 bg-text-primary text-bg-primary text-sm font-bold uppercase tracking-widest border-2 border-text-primary hover:bg-accent hover:border-accent hover:text-black transition-colors duration-300"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Live Demo
                                </a>
                            )}
                            {project.githubUrl && project.githubUrl !== "#" && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-3 bg-transparent text-text-primary text-sm font-bold uppercase tracking-widest border-2 border-border hover:border-text-primary transition-colors duration-300"
                                >
                                    <Github className="w-4 h-4" />
                                    GitHub
                                </a>
                            )}
                            <Link
                                href={`/projects/${project.slug}`}
                                className="flex items-center gap-2 px-6 py-3 ml-auto bg-transparent text-accent text-sm font-bold uppercase tracking-widest border-2 border-accent hover:bg-accent hover:text-black transition-colors duration-300"
                            >
                                Case Study
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
