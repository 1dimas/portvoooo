"use client";

import { motion, useMotionValue, useSpring, useTransform, useVelocity, useAnimationFrame } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface KineticTextProps {
    baseText: string;
    revealText: string;
    maskSize?: number;
    stiffness?: number;
    damping?: number;
    blendMode?: "normal" | "difference" | "overlay" | "screen" | "exclusion" | "color-dodge";
    fontWeight?: 100 | 300 | 400 | 600 | 800 | 900;
    chromaticAberration?: boolean;
    invert?: boolean; // If true, mouse hides the reveal text instead of showing it
}

export default function KineticText({
    baseText,
    revealText,
    maskSize = 150,
    stiffness = 150,
    damping = 15,
    blendMode = "normal",
    fontWeight = 900,
    chromaticAberration = true,
    invert = false
}: KineticTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Core motion values for mouse position
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Track original smooth mouse movement for the mask center
    const smoothX = useSpring(mouseX, { stiffness, damping, mass: 0.5 });
    const smoothY = useSpring(mouseY, { stiffness, damping, mass: 0.5 });

    // Velocity tracking to stretch/wobble the mask ring
    const velocityX = useVelocity(smoothX);
    const velocityY = useVelocity(smoothY);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    // Calculate dynamic mask size based on velocity (Wobbly Mask)
    // When moving fast, the mask stretches slightly
    const absVelocityX = useTransform(velocityX, (v) => Math.abs(v));
    const absVelocityY = useTransform(velocityY, (v) => Math.abs(v));
    const combinedVelocity = useTransform(
        [absVelocityX, absVelocityY],
        ([vx, vy]: number[]) => Math.sqrt(vx * vx + vy * vy)
    );

    // Dynamic mask size: stretches up to 1.5x when moving fast
    const dynamicMaskSize = useTransform(
        combinedVelocity,
        [0, 2000],
        [maskSize, maskSize * 1.5]
    );

    const smoothMaskSize = useSpring(dynamicMaskSize, { stiffness: 300, damping: 20 });

    // Generate the CSS clip-path value
    // E.g. circle(150px at 50% 50%)
    const clipPathVal = useTransform(
        [smoothX, smoothY, smoothMaskSize],
        ([x, y, s]: number[]) => {
            const size = isHovered ? s : 0;
            return `circle(${size}px at ${x}px ${y}px)`;
        }
    );

    // Invert mode logic: swap the base and reveal rendering logic
    const BackgroundText = invert ? revealText : baseText;
    const ForegroundText = invert ? baseText : revealText;

    const backgroundClass = invert ? "text-accent" : "text-text-muted/20";
    const foregroundClass = invert ? "text-text-muted/20" : "text-accent";

    // CSS variables for blend mode and typography
    const customStyles = {
        "--blend-mode": blendMode,
        "--font-weight": fontWeight,
    } as React.CSSProperties;

    // Chromatic Aberration Transforms (Rules of Hooks)
    const redX = useTransform(velocityX, [-1000, 1000], [5, -5]);
    const redY = useTransform(velocityY, [-1000, 1000], [5, -5]);
    const blueX = useTransform(velocityX, [-1000, 1000], [-5, 5]);
    const blueY = useTransform(velocityY, [-1000, 1000], [-5, 5]);

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative w-full h-full flex items-center justify-center overflow-hidden bg-transparent cursor-none select-none"
            style={customStyles}
        >
            {/* Layer 0: Static Background Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <h2 className={`font-heading text-[clamp(4rem,15vw,12rem)] leading-none text-center uppercase tracking-tighter ${backgroundClass} transition-colors duration-500`}>
                    {BackgroundText}
                </h2>
            </div>

            {/* Layer 1: The Revealed Foreground Text */}
            <motion.div
                className={`absolute inset-0 flex items-center justify-center pointer-events-none z-10`}
                style={{
                    clipPath: clipPathVal,
                    // Use WebKit prefix for deeper compatibility
                    WebkitClipPath: clipPathVal,
                    mixBlendMode: "var(--blend-mode)" as any,
                }}
            >
                {/* Chromatic Aberration Layers */}
                {chromaticAberration ? (
                    <div className="relative flex items-center justify-center w-full h-full">
                        {/* Red Channel */}
                        <motion.h2
                            className={`font-heading text-[clamp(4rem,15vw,12rem)] leading-none text-center uppercase tracking-tighter absolute text-red-500 opacity-80 mix-blend-screen`}
                            style={{
                                fontWeight: "var(--font-weight)" as any,
                                x: redX,
                                y: redY,
                            }}
                        >
                            {ForegroundText}
                        </motion.h2>

                        {/* Blue Channel */}
                        <motion.h2
                            className={`font-heading text-[clamp(4rem,15vw,12rem)] leading-none text-center uppercase tracking-tighter absolute text-blue-500 opacity-80 mix-blend-screen`}
                            style={{
                                fontWeight: "var(--font-weight)" as any,
                                x: blueX,
                                y: blueY,
                            }}
                        >
                            {ForegroundText}
                        </motion.h2>

                        {/* Main Body */}
                        <motion.h2
                            className={`font-heading text-[clamp(4rem,15vw,12rem)] leading-none text-center uppercase tracking-tighter absolute ${foregroundClass}`}
                            style={{ fontWeight: "var(--font-weight)" as any }}
                        >
                            {ForegroundText}
                        </motion.h2>
                    </div>
                ) : (
                    <motion.h2
                        className={`font-heading text-[clamp(4rem,15vw,12rem)] leading-none text-center uppercase tracking-tighter ${foregroundClass}`}
                        style={{ fontWeight: "var(--font-weight)" as any }}
                    >
                        {ForegroundText}
                    </motion.h2>
                )}

                {/* Visual "Lens" Edge Glow (The Senter effect) */}
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(255,255,255,0.1)] rounded-full mix-blend-overlay opacity-50" />
            </motion.div>

            {/* Custom Follower Cursor so the user knows where the center is */}
            <motion.div
                className="w-4 h-4 rounded-full border border-white/50 mix-blend-difference pointer-events-none fixed z-50 flex items-center justify-center"
                style={{
                    x: smoothX,
                    y: smoothY,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isHovered ? 1 : 0
                }}
            >
                <div className="w-1 h-1 bg-white rounded-full" />
            </motion.div>
        </div>
    );
}
