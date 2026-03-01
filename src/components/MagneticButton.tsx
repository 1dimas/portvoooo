"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { playHover, playClick } from "@/utils/audio";


export default function MagneticButton({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
        // Disable on touch devices to avoid sticky click jumping
        if (typeof window !== "undefined" && window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

        const { clientX, clientY } = e;
        const boundingRect = ref.current?.getBoundingClientRect();

        if (boundingRect) {
            const { width, height, left, top } = boundingRect;
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);

            // Limit the magnetic pull radius
            setPosition({ x: x * 0.2, y: y * 0.2 });
        }
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            onMouseEnter={() => {
                if (typeof window !== "undefined" && !window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
                    playHover();
                }
            }}
            onClick={() => playClick()}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={`md:cursor-none inline-block ${className}`}
        >
            {children}
        </motion.div>
    );
}
