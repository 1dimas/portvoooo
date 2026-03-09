"use client";

import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useSentient } from "./useSentient";

interface AdaptiveElementProps {
    id: string; // Must be unique across the app for the memory to target it
    children: React.ReactNode;
    className?: string;
    // How much score to add per second of hover
    hoverInterestWeight?: number;
    // How much score to add per second of being visible in viewport
    visibilityInterestWeight?: number;
    // Base scale before adaptation
    baseScale?: number;
}

export default function AdaptiveElement({
    id,
    children,
    className = "",
    hoverInterestWeight = 5,
    visibilityInterestWeight = 1,
    baseScale = 1
}: AdaptiveElementProps) {
    const { scores, registerInteraction, isHeatmapActive } = useSentient();
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // The current "Importance" score from the Sentient Brain (0 to 100)
    const currentScore = scores[id] || 0;
    const normalizedScore = currentScore / 100; // 0 to 1

    const containerRef = useRef<HTMLDivElement>(null);

    // Track Viewport Visibility
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.5 } // Trigger when 50% visible
        );

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // The Sentient Accumulation Loop
    useEffect(() => {
        let accumulationInterval: NodeJS.Timeout;

        // If hovered OR visible, start accumulating interest points
        if (isHovered || isVisible) {
            accumulationInterval = setInterval(() => {
                let amount = 0;
                if (isHovered) amount += hoverInterestWeight;
                if (isVisible && !isHovered) amount += visibilityInterestWeight; // Passive interest

                if (amount > 0) {
                    registerInteraction(id, amount);
                }
            }, 1000); // Check interest every second
        }

        return () => {
            if (accumulationInterval) clearInterval(accumulationInterval);
        };
    }, [isHovered, isVisible, id, hoverInterestWeight, visibilityInterestWeight, registerInteraction]);


    // --- ADAPTIVE MUTATIONS ---

    // 1. Scale Prediction (Things you like get slightly bigger, up to 10% larger)
    const activeScale = baseScale + (normalizedScore * 0.1);

    // 2. Opacity Blur (Things you ignore fade into the background)
    // If you've never interacted (score 0), it's 100% visible (base state).
    // The trick: We need to know if the system remembers ANYTHING.
    // If the system has total score > 0 but YOUR score is 0, you fade relative to others.

    // Let's calculate total memory in the system
    const totalMemory = Object.values(scores).reduce((a, b) => a + b, 0);
    const hasMemories = totalMemory > 10; // Threshold before fading uninteresting things

    // If there are memories, but this element has 0 score, it becomes slightly transparent
    const inactiveOpacity = hasMemories ? 0.6 : 1;
    const activeOpacity = hasMemories ? Math.max(0.6, 0.4 + (normalizedScore * 0.6)) : 1;

    // 3. Blur (Things you completely ignore blur out slightly when others are in focus)
    const inactiveBlur = hasMemories ? 2 : 0;
    const activeBlur = hasMemories ? Math.max(0, 2 - (normalizedScore * 4)) : 0; // Negative handles overshoot to 0

    // Heatmap Visualization String
    // Cold (0) = transparent -> Warm (50) = yellow -> Hot (100) = red
    const heatmapColor = `rgba(${255}, ${Math.max(0, 255 - (normalizedScore * 255))}, 0, ${normalizedScore * 0.4})`;

    return (
        <motion.div
            ref={containerRef}
            className={`relative rounded-xl transition-shadow ${className}`}
            onMouseEnter={() => {
                setIsHovered(true);
                // Instant bump for clicking/hovering
                registerInteraction(id, 2);
            }}
            onMouseLeave={() => setIsHovered(false)}
            animate={{
                scale: activeScale,
                opacity: currentScore > 0 ? activeOpacity : inactiveOpacity,
                filter: `blur(${currentScore > 0 ? activeBlur : inactiveBlur}px) grayscale(${hasMemories && currentScore === 0 ? 0.8 : 1 - normalizedScore})`,
            }}
            transition={{
                // Smooth, organic transitions like breathing/evolving
                duration: 1.5,
                ease: [0.25, 1, 0.5, 1]
            }}
        >
            {/* The actual content */}
            {children}

            {/* Visual Heatmap Debugging Overlay */}
            {isHeatmapActive && (
                <div
                    className="absolute inset-0 pointer-events-none rounded-xl z-50 border-2"
                    style={{
                        borderColor: `rgba(${255}, ${255 - (normalizedScore * 255)}, 0, 1)`,
                        backgroundColor: heatmapColor,
                        transition: 'all 0.5s ease-out'
                    }}
                >
                    <div className="absolute -top-3 -right-3 bg-black text-white text-[10px] font-mono px-2 py-1 rounded-full border border-white/20">
                        {Math.round(currentScore)}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
