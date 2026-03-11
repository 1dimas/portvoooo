"use client";

import { motion, useSpring } from "framer-motion";
import { useEffect } from "react";
import { useGesture } from "./GestureProvider";

export default function VirtualCursor() {
    const { isPinching, cursorPos, isReady } = useGesture();

    // Springs for ultra-smooth buttery lag-free following
    const springX = useSpring(-100, { stiffness: 400, damping: 25, mass: 0.5 });
    const springY = useSpring(-100, { stiffness: 400, damping: 25, mass: 0.5 });

    // Slightly lagging trailing aura springs
    const trailingX = useSpring(-100, { stiffness: 100, damping: 15, mass: 1 });
    const trailingY = useSpring(-100, { stiffness: 100, damping: 15, mass: 1 });

    useEffect(() => {
        if (isReady && cursorPos.x !== -100) {
            springX.set(cursorPos.x);
            springY.set(cursorPos.y);
            trailingX.set(cursorPos.x);
            trailingY.set(cursorPos.y);
        }
    }, [cursorPos, isReady, springX, springY, trailingX, trailingY]);

    // Don't render until we have a lock on a hand at least once
    if (!isReady || cursorPos.x === -100) return null;

    return (
        <>
            {/* The Main Cursor */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[100] flex items-center justify-center Mix-blend-difference"
                style={{
                    x: springX,
                    y: springY,
                    translateX: "-50%",
                    translateY: "-50%"
                }}
                animate={{
                    scale: isPinching ? 0.6 : 1,
                    backgroundColor: isPinching ? "rgba(var(--accent-rgb), 0.9)" : "rgba(255, 255, 255, 0.4)",
                    border: isPinching ? "2px solid rgba(255,255,255,1)" : "2px solid rgba(var(--accent-rgb), 1)",
                    boxShadow: isPinching
                        ? `0 0 30px 10px rgba(var(--accent-rgb), 0.6)`
                        : "0 0 15px 2px rgba(255, 255, 255, 0.2)",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
                {/* Center dot */}
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </motion.div>

            {/* A slightly lagging trailing aura for sci-fi feel */}
            <motion.div
                className="fixed top-0 left-0 w-16 h-16 rounded-full pointer-events-none z-[99] border border-accent border-dashed opacity-30"
                style={{
                    x: trailingX,
                    y: trailingY,
                    translateX: "-50%",
                    translateY: "-50%"
                }}
                animate={{
                    scale: isPinching ? [1, 1.5, 0] : 1,
                    rotate: isPinching ? 180 : 0,
                    opacity: isPinching ? 0 : 0.3
                }}
                transition={{ duration: 0.3 }}
            />
        </>
    );
}
