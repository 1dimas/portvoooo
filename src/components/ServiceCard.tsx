"use client";

import { motion } from "framer-motion";

interface ServiceCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay?: number;
}

export default function ServiceCard({
    icon,
    title,
    description,
    delay = 0,
}: ServiceCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay }}
            className="group relative p-6 md:p-10 bg-bg-card border-2 border-border overflow-hidden transition-all duration-300 md:hover:-translate-y-2 md:hover:translate-x-2 md:hover:shadow-[-8px_8px_0px_0px_var(--color-accent)]"
        >
            {/* Content */}
            <div className="relative z-10">
                <div className="w-16 h-16 border-2 border-border flex items-center justify-center mb-8 bg-bg-primary group-hover:bg-accent group-hover:text-bg-primary group-hover:border-accent transition-colors duration-300">
                    <div className="text-accent group-hover:text-bg-primary transition-colors duration-300">
                        {icon}
                    </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 font-heading uppercase tracking-wider text-text-primary group-hover:text-accent transition-colors duration-300">
                    {title}
                </h3>
                <p className="text-text-secondary leading-relaxed text-base">
                    {description}
                </p>
            </div>
        </motion.div>
    );
}
