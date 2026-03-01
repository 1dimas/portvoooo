"use client";

import { motion } from "framer-motion";
import InfiniteMarquee from "@/components/InfiniteMarquee";
import ScrambleText from "@/components/ScrambleText";

import {
    siNextdotjs,
    siReact,
    siTypescript,
    siNodedotjs,
    siPhp,
    siPostgresql,
    siPrisma,
    siTailwindcss,
    siGithub,
    siLinux,
} from "simple-icons";

// Custom SVG path for Next.js without the circle background
const customNextJsPath = "M14.438 13.064l-4.945-8.083H7.018v14.038h2.38V7.3l5.337 8.783L22.25 7.153v11.95h2.378V5.064h-3.414l-6.776 7.999zM2.38 5.064v14.038h2.38V5.064H2.38z";

interface TechItem {
    name: string;
    icon: string; // SVG path
}

const techRow1: TechItem[] = [
    { name: "Next.js", icon: customNextJsPath },
    { name: "React", icon: siReact.path },
    { name: "TypeScript", icon: siTypescript.path },
    { name: "Node.js", icon: siNodedotjs.path },
    { name: "PHP", icon: siPhp.path },
];

const techRow2: TechItem[] = [
    { name: "PostgreSQL", icon: siPostgresql.path },
    { name: "Prisma", icon: siPrisma.path },
    { name: "Tailwind CSS", icon: siTailwindcss.path },
    { name: "GitHub", icon: siGithub.path },
    { name: "Linux", icon: siLinux.path },
];

function TechIcon({ item }: { item: TechItem }) {
    return (
        <div className="flex flex-col items-center gap-4 px-8 md:px-12 group cursor-default pointer-events-auto">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-none flex items-center justify-center text-text-secondary border-2 border-border group-hover:text-accent group-hover:border-accent group-hover:-translate-y-2 transition-all duration-500 relative overflow-hidden pointer-events-none">
                {/* Icon wrapper to ensure uniform sizing */}
                <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14">
                    <svg role="img" viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
                        <path d={item.icon} />
                    </svg>
                </div>
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-text-secondary group-hover:text-text-primary transition-colors duration-300 pointer-events-none">
                {item.name}
            </span>
        </div>
    );
}

export default function TechStackSection() {
    return (
        <section className="relative py-32 overflow-hidden bg-bg-primary">
            <div className="relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 px-6"
                >
                    <span className="text-accent text-sm font-bold uppercase tracking-widest border-2 border-accent px-4 py-1.5 rounded-none cursor-default">
                        <ScrambleText text="Tech Stack" />
                    </span>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mt-8 mb-4 tracking-tighter uppercase font-heading cursor-default">
                        <span className="text-text-primary">
                            <ScrambleText text="Teknologi yang" />
                        </span>{" "}
                        <span className="text-accent">
                            <ScrambleText text="Saya Kuasai" />
                        </span>
                    </h2>
                    <p className="text-text-secondary font-medium text-lg max-w-2xl mx-auto leading-relaxed uppercase tracking-widest">
                        Tools dan framework modern untuk membangun produk digital berkualitas tinggi.
                    </p>
                </motion.div>

                {/* Marquee Rows */}
                <div className="flex flex-col gap-8">
                    <InfiniteMarquee speed={120}>
                        {techRow1.map((tech) => (
                            <TechIcon key={tech.name} item={tech} />
                        ))}
                    </InfiniteMarquee>

                    <InfiniteMarquee reverse speed={140}>
                        {techRow2.map((tech) => (
                            <TechIcon key={tech.name} item={tech} />
                        ))}
                    </InfiniteMarquee>
                </div>
            </div>
        </section>
    );
}
