"use client";

import { motion } from "framer-motion";

interface TextRevealProps {
    text: string;
    className?: string;
    delay?: number;
    as?: "h1" | "h2" | "h3" | "p" | "span";
}

export default function TextReveal({
    text,
    className = "",
    delay = 0,
    as: Tag = "h1",
}: TextRevealProps) {
    const words = text.split(" ");

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: delay,
            },
        }),
    };

    const child = {
        hidden: {
            opacity: 0,
            y: 40,
            filter: "blur(8px)",
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                type: "spring" as const,
                damping: 20,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className={`flex flex-wrap ${className}`}
        >
            {words.map((word, index) => (
                <motion.span key={index} variants={child} className="mr-[0.3em]">
                    <Tag className={className}>{word}</Tag>
                </motion.span>
            ))}
        </motion.div>
    );
}
