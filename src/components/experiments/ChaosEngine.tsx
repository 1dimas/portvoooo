"use client";

import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { motion } from "framer-motion";

export interface ChaosEngineProps {
    gravity: number;
    bounciness: number;
    frictionAir: number;
    triggerBang: number; // Increment to trigger explosion
}

const TECH_STACK = [
    { id: "1", name: "Next.js", bg: "bg-zinc-800", color: "text-white", border: "border-zinc-700", w: 160, h: 60 },
    { id: "2", name: "React", bg: "bg-blue-900/40", color: "text-blue-400", border: "border-blue-500/50", w: 140, h: 60 },
    { id: "3", name: "Tailwind CSS", bg: "bg-cyan-900/40", color: "text-cyan-400", border: "border-cyan-500/50", w: 180, h: 60 },
    { id: "4", name: "Framer Motion", bg: "bg-fuchsia-900/40", color: "text-fuchsia-400", border: "border-fuchsia-500/50", w: 180, h: 60 },
    { id: "5", name: "TypeScript", bg: "bg-blue-900/40", color: "text-blue-400", border: "border-blue-600/50", w: 160, h: 60 },
    { id: "6", name: "Prisma", bg: "bg-emerald-900/40", color: "text-emerald-400", border: "border-emerald-500/50", w: 140, h: 60 },
    { id: "7", name: "Hyprland", bg: "bg-red-900/40", color: "text-red-400", border: "border-red-500/50", w: 150, h: 60 },
    { id: "8", name: "Node.js", bg: "bg-green-900/40", color: "text-green-400", border: "border-green-500/50", w: 150, h: 60 },
    { id: "9", name: "Arch Linux", bg: "bg-sky-900/40", color: "text-sky-400", border: "border-sky-500/50", w: 160, h: 60 },
    { id: "10", name: "Matter.js", bg: "bg-yellow-900/40", color: "text-yellow-400", border: "border-yellow-500/50", w: 150, h: 60 },
];

export default function ChaosEngine({ gravity, bounciness, frictionAir, triggerBang }: ChaosEngineProps) {
    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const runnerRef = useRef<Matter.Runner | null>(null);
    const bodiesRef = useRef<Record<string, Matter.Body>>({});

    // Keep track of the elements for Framer Motion / React sync
    const [cardStyles, setCardStyles] = useState<Record<string, { x: number, y: number, angle: number }>>({});

    useEffect(() => {
        if (!sceneRef.current) return;

        // 1. Setup Engine
        const engine = Matter.Engine.create();
        engineRef.current = engine;
        const world = engine.world;

        // Setup initial gravity
        engine.gravity.y = gravity;

        // 2. Dimensions
        const width = sceneRef.current.clientWidth;
        const height = sceneRef.current.clientHeight;

        // 3. Walls (Static Bodies)
        const wallOptions = { isStatic: true, render: { visible: false }, restitution: bounciness };
        const ground = Matter.Bodies.rectangle(width / 2, height + 30, width + 100, 60, wallOptions);
        const ceiling = Matter.Bodies.rectangle(width / 2, -30, width + 100, 60, wallOptions);
        const leftWall = Matter.Bodies.rectangle(-30, height / 2, 60, height + 100, wallOptions);
        const rightWall = Matter.Bodies.rectangle(width + 30, height / 2, 60, height + 100, wallOptions);

        Matter.World.add(world, [ground, ceiling, leftWall, rightWall]);

        // 4. Create Tech Cards (Dynamic Bodies)
        const items: Record<string, Matter.Body> = {};
        const initialStyles: Record<string, { x: number, y: number, angle: number }> = {};

        TECH_STACK.forEach((tech) => {
            // Distribute randomly near top-center
            const startX = width / 2 + (Math.random() - 0.5) * 300;
            const startY = 100 + (Math.random() * 200);

            const body = Matter.Bodies.rectangle(startX, startY, tech.w, tech.h, {
                restitution: bounciness, // Bounciness
                frictionAir: frictionAir,
                friction: 0.1,
                density: 0.05,
                chamfer: { radius: 8 }, // Rounded corners physics approximation
                label: tech.id,
            });

            items[tech.id] = body;
            initialStyles[tech.id] = { x: startX, y: startY, angle: body.angle };
            Matter.World.add(world, body);
        });

        bodiesRef.current = items;
        setCardStyles(initialStyles);

        // 5. Mouse Interaction
        const mouse = Matter.Mouse.create(sceneRef.current);
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });
        Matter.World.add(world, mouseConstraint);

        // Keep the mouse in sync with rendering (essential for container scrolling/resizing issues)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mouseElement = mouseConstraint.mouse.element as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mouseElement.removeEventListener("mousewheel", (mouseConstraint.mouse as any).mousewheel);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mouseElement.removeEventListener("DOMMouseScroll", (mouseConstraint.mouse as any).mousewheel);

        // 6. Physics Loop Sync (Updating React State or Refs)
        let animationFrameId: number;
        const updateLoop = () => {
            const newStyles: Record<string, { x: number, y: number, angle: number }> = {};

            for (const [id, body] of Object.entries(bodiesRef.current)) {
                newStyles[id] = {
                    x: body.position.x,
                    y: body.position.y,
                    angle: body.angle
                };
            }

            setCardStyles(newStyles);
            animationFrameId = requestAnimationFrame(updateLoop);
        };

        updateLoop();

        // Start engine runner
        const runner = Matter.Runner.create();
        runnerRef.current = runner;
        Matter.Runner.run(runner, engine);

        // Resize handler
        const handleResize = () => {
            const newW = sceneRef.current?.clientWidth || window.innerWidth;
            const newH = sceneRef.current?.clientHeight || window.innerHeight;
            // Update wall positions immediately
            Matter.Body.setPosition(ground, { x: newW / 2, y: newH + 30 });
            Matter.Body.setPosition(ceiling, { x: newW / 2, y: -30 });
            Matter.Body.setPosition(rightWall, { x: newW + 30, y: newH / 2 });
            // We don't need to change dimensions of walls if we just make them very long initially
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            Matter.Runner.stop(runner);
            Matter.World.clear(world, false);
            Matter.Engine.clear(engine);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount

    // Handle incoming prop changes (Gravity, Bounciness, Friction)
    useEffect(() => {
        if (!engineRef.current) return;
        engineRef.current.gravity.y = gravity;

        // Update properties of all bodies
        for (const body of Object.values(bodiesRef.current)) {
            body.restitution = bounciness;
            body.frictionAir = frictionAir;
        }

        // Update walls bounciness (walls are the first 4 bodies usually, but let's query them properly)
        const walls = Matter.Composite.allBodies(engineRef.current.world).filter(b => b.isStatic);
        for (const wall of walls) {
            wall.restitution = bounciness;
        }
    }, [gravity, bounciness, frictionAir]);

    // Handle "Big Bang" explosion
    useEffect(() => {
        if (!engineRef.current || triggerBang === 0) return;

        const centerX = (sceneRef.current?.clientWidth || 0) / 2;
        const centerY = (sceneRef.current?.clientHeight || 0) / 2;

        for (const body of Object.values(bodiesRef.current)) {
            // Calculate vector from center
            const dx = body.position.x - centerX;
            const dy = body.position.y - centerY;

            // Normalize and apply explosive force
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            const forceMagnitude = 0.15; // Explosive power

            Matter.Body.applyForce(body, body.position, {
                x: (dx / distance) * forceMagnitude,
                y: (dy / distance) * forceMagnitude
            });
        }
    }, [triggerBang]);

    return (
        <div ref={sceneRef} className="w-full h-full relative overflow-hidden bg-bg-primary">
            {/* Render the React components based on physics state */}
            {TECH_STACK.map((tech) => {
                const style = cardStyles[tech.id];
                if (!style) return null; // Wait for physics engine to initialize

                return (
                    <motion.div
                        key={tech.id}
                        className={`absolute top-0 left-0 flex items-center justify-center border font-mono text-sm tracking-widest uppercase cursor-grab active:cursor-grabbing select-none
                            ${tech.bg} ${tech.color} ${tech.border}
                        `}
                        style={{
                            width: tech.w,
                            height: tech.h,
                            // Transform from the center (Matter.js body origin is center)
                            x: style.x - tech.w / 2,
                            y: style.y - tech.h / 2,
                            rotate: `${style.angle}rad`,
                            borderRadius: '8px',
                            willChange: 'transform',
                            // Enhance the glassmorphism aesthetic for Hyprland vibe
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                        }}
                    >
                        {tech.name}
                    </motion.div>
                );
            })}

            {/* Hint message */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10">
                <h1 className="font-heading text-6xl md:text-8xl text-text-muted uppercase tracking-tighter text-center">
                    Chaos<br />Engine
                </h1>
            </div>
        </div>
    );
}
