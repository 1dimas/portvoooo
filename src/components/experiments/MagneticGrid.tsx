"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// The types of visuals we can render in the grid
export type VisualMode = "ascii" | "dots" | "compass";

interface MagneticGridProps {
    rows?: number;
    cols?: number;
    mode?: "attract" | "repel";
    visualMode?: VisualMode;
    power?: number;       // How far the mouse effect reaches (radius)
    intensity?: number;   // How strong the push/pull is
    damping?: number;     // Spring damping
    stiffness?: number;   // Spring stiffness
}

const ASCII_CHARS = ['0', '1', '!', '@', '#', '$', '%', '&', '*', '+', '=', '?', '>', '<', '~'];

function GridItem({
    x, y,
    mouseX, mouseY,
    mode, visualMode,
    power, intensity,
    damping, stiffness
}: {
    x: number, y: number,
    mouseX: any, mouseY: any,
    mode: "attract" | "repel",
    visualMode: VisualMode,
    power: number, intensity: number,
    damping: number, stiffness: number
}) {
    const itemRef = useRef<HTMLDivElement>(null);
    const [itemCenter, setItemCenter] = useState({ x: 0, y: 0 });
    const [asciiChar, setAsciiChar] = useState(ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)]);

    // Update center position on mount and resize
    useEffect(() => {
        const updateCenter = () => {
            if (itemRef.current) {
                const rect = itemRef.current.getBoundingClientRect();
                setItemCenter({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                });
            }
        };
        updateCenter();
        window.addEventListener('resize', updateCenter);
        return () => window.removeEventListener('resize', updateCenter);
    }, []);

    // Physics calculations
    // Distance from mouse to this item's center
    const distanceX = useTransform(mouseX, (val: number) => itemCenter.x - val);
    const distanceY = useTransform(mouseY, (val: number) => itemCenter.y - val);

    // Pythagorean distance
    const distance = useTransform(
        [distanceX, distanceY],
        ([dx, dy]: number[]) => Math.sqrt(dx * dx + dy * dy)
    );

    // Calculate force based on distance, power (radius), and intensity
    const force = useTransform(distance, (d: number) => {
        if (d > power) return 0;
        // Effect gets stronger as distance gets closer to 0
        const normalized = 1 - (d / power);
        // Exponential falloff for smoother feeling
        return Math.pow(normalized, 2) * intensity;
    });

    // Apply mode (attract/repel)
    const directionMultiplier = mode === "repel" ? 1 : -1;

    // Target displacements based on the angle to the mouse
    const targetDx = useTransform(
        [distanceX, distance, force],
        ([dx, d, f]: number[]) => d > 0 ? (dx / d) * f * directionMultiplier : 0
    );
    const targetDy = useTransform(
        [distanceY, distance, force],
        ([dy, d, f]: number[]) => d > 0 ? (dy / d) * f * directionMultiplier : 0
    );

    // Smooth physics using springs
    const springConfig = { damping, stiffness, mass: 0.5 };
    const springX = useSpring(targetDx, springConfig);
    const springY = useSpring(targetDy, springConfig);

    // For the ASCII mode, occasionally change character when heavily affected
    useEffect(() => {
        if (visualMode !== "ascii") return;
        const unsubscribe = force.on("change", (latest) => {
            if (latest > intensity * 0.3 && Math.random() > 0.8) {
                setAsciiChar(ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)]);
            }
        });
        return () => unsubscribe();
    }, [force, intensity, visualMode]);


    // Visual-specific transforms
    // 1. Compass rotation
    const rotation = useTransform(
        [distanceX, distanceY],
        ([dx, dy]: number[]) => {
            if (visualMode !== 'compass') return 0;
            // Calculate angle pointing towards/away from mouse
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            return mode === 'attract' ? angle : angle + 180;
        }
    );

    // 2. Scale up/down based on force
    const scale = useTransform(force, [0, intensity], [1, mode === 'attract' ? 1.5 : 0.5]);

    // 3. Opacity highlights
    const opacity = useTransform(force, [0, intensity], [0.3, 1]);

    // 4. Color tinting (CSS custom property passed via style)
    const highlightColorIntensity = useTransform(force, [0, intensity], [0, 1]);

    // 5. Mode specific transforms (moved to top level to satisfy Rules of Hooks)
    const filterDots = useTransform(highlightColorIntensity, (i) => `brightness(${1 + i * 2}) drop-shadow(0 0 ${i * 10}px var(--accent))`);
    const filterCompass = useTransform(highlightColorIntensity, (i) => `brightness(${1 + i}) drop-shadow(0 0 ${i * 5}px var(--accent))`);
    const colorAscii = useTransform(highlightColorIntensity, [0, 1], ["var(--text-muted)", "var(--accent)"]);
    const fontWeightAscii = useTransform(highlightColorIntensity, (i) => i > 0.5 ? 800 : 400);
    const textShadowAscii = useTransform(highlightColorIntensity, (i) => `0 0 ${i * 10}px var(--accent)`);

    return (
        <div ref={itemRef} className="relative flex items-center justify-center w-full h-full p-2">
            <motion.div
                style={{
                    x: visualMode === 'compass' ? 0 : springX, // Compass mostly rotates, others translate
                    y: visualMode === 'compass' ? 0 : springY,
                    rotate: rotation,
                    scale: visualMode === 'ascii' ? scale : 1, // Only scale ASCII heavily
                    opacity: opacity,
                    willChange: "transform, opacity",
                }}
                className="w-full h-full flex items-center justify-center"
            >
                {visualMode === "dots" && (
                    <motion.div
                        className="w-2 h-2 rounded-full"
                        style={{
                            backgroundColor: "var(--accent)", // Standard theme accent
                            filter: filterDots
                        }}
                    />
                )}

                {visualMode === "compass" && (
                    <motion.div
                        className="w-full h-0.5 bg-gradient-to-r from-transparent via-text-secondary to-accent relative"
                        style={{
                            filter: filterCompass
                        }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent" />
                    </motion.div>
                )}

                {visualMode === "ascii" && (
                    <motion.span
                        className="font-mono text-sm md:text-base selection:bg-transparent"
                        style={{
                            color: colorAscii,
                            fontWeight: fontWeightAscii,
                            textShadow: textShadowAscii
                        }}
                    >
                        {asciiChar}
                    </motion.span>
                )}
            </motion.div>
        </div>
    );
}

export default function MagneticGrid({
    rows = 15,
    cols = 20,
    mode = "repel",
    visualMode = "dots",
    power = 300,
    intensity = 60,
    damping = 15,
    stiffness = 150
}: MagneticGridProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(-1000); // Start far offscreen
    const mouseY = useMotionValue(-1000);

    const handleMouseMove = (e: React.MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
    };

    const handleMouseLeave = () => {
        // Gently move mouse away to reset grid
        mouseX.set(-1000);
        mouseY.set(-1000);
    };

    // Generate grid items
    const items = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            items.push(
                <GridItem
                    key={`${r}-${c}`}
                    x={c}
                    y={r}
                    mouseX={mouseX}
                    mouseY={mouseY}
                    mode={mode}
                    visualMode={visualMode}
                    power={power}
                    intensity={intensity}
                    damping={damping}
                    stiffness={stiffness}
                />
            );
        }
    }

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full h-full flex items-center justify-center overflow-hidden bg-bg-primary/50 relative cursor-crosshair"
            style={{
                perspective: "1000px" // Add subtle 3D space
            }}
        >
            <div
                className="grid"
                style={{
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                    width: "100%",
                    height: "100%",
                    maxWidth: "1400px",
                    maxHeight: "900px",
                    padding: "2rem"
                }}
            >
                {items}
            </div>

            {/* Subtle global gradient reacting to mouse (optional enhancement) */}
            <motion.div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    background: useTransform(
                        [mouseX, mouseY],
                        ([x, y]: number[]) => `radial-gradient(circle 600px at ${x}px ${y}px, var(--accent), transparent)`
                    )
                }}
            />
        </div>
    );
}
