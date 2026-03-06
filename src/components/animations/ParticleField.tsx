"use client";

import { useEffect, useRef } from "react";

interface Star {
    x: number;
    y: number;
    z: number;
    size: number;
    color: string;
}

export default function ParticleField() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        let stars: Star[] = [];

        // Accessibility and Performance checks
        const isMobile = window.innerWidth < 768;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // 3D parameters (Dynamically reduced for mobile/accessibility)
        const baseNumStars = isMobile ? 150 : 400;
        const numStars = prefersReducedMotion ? Math.min(baseNumStars, 100) : baseNumStars;
        const fov = 300;
        const speed = prefersReducedMotion ? 0.1 : 0.5;
        const rotationSpeed = prefersReducedMotion ? 0.0001 : 0.0005;
        let angle = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Re-center translation for 0,0 to be middle of screen
            ctx.translate(canvas.width / 2, canvas.height / 2);
        };

        const createStars = () => {
            stars = [];
            for (let i = 0; i < numStars; i++) {
                // Random 3D positions in a sphere/box
                stars.push({
                    x: (Math.random() - 0.5) * 2000,
                    y: (Math.random() - 0.5) * 2000,
                    z: Math.random() * 2000,
                    size: Math.random() * 1.5 + 0.5,
                    // Mostly white/grey, occasional salmon pink accent
                    color: Math.random() > 0.95 ? "#ff98a2" : `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`
                });
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            // Calculate normalized mouse position from center (-1 to 1)
            mouseRef.current.targetX = (e.clientX - window.innerWidth / 2) * 0.5;
            mouseRef.current.targetY = (e.clientY - window.innerHeight / 2) * 0.5;
        };

        const animate = () => {
            if (!ctx || !canvas) return;

            // Clear screen
            ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

            // Smoothly interpolate current mouse position towards target
            mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
            mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

            angle += rotationSpeed;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);

            for (let i = 0; i < numStars; i++) {
                const star = stars[i];

                // Move stars closer to camera
                star.z -= speed;

                // Reset star if it passes the camera or goes too far
                if (star.z < 1) {
                    star.z = 2000;
                    star.x = (Math.random() - 0.5) * 2000;
                    star.y = (Math.random() - 0.5) * 2000;
                }

                // Apply slight parallax offset based on mouse
                const parallaxX = (mouseRef.current.x * star.z) / 2000;
                const parallaxY = (mouseRef.current.y * star.z) / 2000;

                // 3D Rotation around Y axis
                const rotX = (star.x - parallaxX) * cos - star.z * sin;
                const rotZ = star.z * cos + (star.x - parallaxX) * sin;

                // 3D Projection
                const scale = fov / (fov + rotZ);

                // Skip drawing if behind the camera
                if (scale <= 0) continue;

                const x2d = rotX * scale;
                const y2d = (star.y - parallaxY) * scale;

                // Draw star
                ctx.beginPath();
                ctx.arc(x2d, y2d, Math.max(0, star.size * scale), 0, Math.PI * 2);
                ctx.fillStyle = star.color;
                ctx.fill();
            }

            animationId = requestAnimationFrame(animate);
        };

        resize();
        createStars();
        animate();

        window.addEventListener("resize", () => {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            resize();
        });

        if (!isMobile && !prefersReducedMotion) {
            window.addEventListener("mousemove", handleMouseMove);
        }

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: 0.8 }}
        />
    );
}
