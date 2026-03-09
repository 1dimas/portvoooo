"use client";

import { motion, useMotionValue, useSpring, PanInfo } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePortalManager } from "./PortalManager";

export default function SyncEntity() {
    const {
        entityState,
        windowId,
        isConnected,
        updateEntityAbsolutePosition,
        claimEntity,
        releaseEntity,
        otherWindows
    } = usePortalManager();

    const [isVisible, setIsVisible] = useState(false);
    const renderLoopRef = useRef<number>(-1);

    // Framer Motion state for local rendering
    const localX = useMotionValue(-1000);
    const localY = useMotionValue(-1000);
    const springX = useSpring(localX, { stiffness: 400, damping: 25 });
    const springY = useSpring(localY, { stiffness: 400, damping: 25 });

    // 1. Render Loop: Convert Absolute Monitor Coordinates -> Local Window Coordinates
    useEffect(() => {
        if (!isConnected || !entityState) return;

        const updateVisuals = () => {
            // Get current absolute bounds of THIS window
            const screenX = window.screenLeft || window.screenX;
            const screenY = window.screenTop || window.screenY;

            // Calculate relative position within this specific window
            const relX = entityState.absoluteX - screenX;
            const relY = entityState.absoluteY - screenY;

            // Is the entity visible inside this window's viewport?
            // Add a 100px buffer so it doesn't pop in/out immediately
            const margin = 100;
            const visible = (
                relX > -margin && relX < window.innerWidth + margin &&
                relY > -margin && relY < window.innerHeight + margin
            );

            setIsVisible(visible);

            // If we are NOT the owner (someone else is dragging), we just follow the broadcast
            if (entityState.ownerWindowId !== windowId) {
                localX.set(relX);
                localY.set(relY);
            }
            // If NO ONE is dragging (floating physically), simulate physics
            // Or if we own it, Framer Motion's drag handles coordinates, we broadcast

            renderLoopRef.current = requestAnimationFrame(updateVisuals);
        };

        renderLoopRef.current = requestAnimationFrame(updateVisuals);

        return () => {
            if (renderLoopRef.current) cancelAnimationFrame(renderLoopRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, entityState, windowId]);

    // 2. Local Physics Engine Simulation when no one owns the entity
    useEffect(() => {
        if (!isConnected || !entityState) return;

        // If someone is grabbing it, no need to simulate physics float
        if (entityState.ownerWindowId !== null) return;

        let lastTime = performance.now();
        let currentVx = entityState.velocityX;
        let currentVy = entityState.velocityY;
        let currentAbsX = entityState.absoluteX;
        let currentAbsY = entityState.absoluteY;

        // Friction and bounds
        const friction = 0.98;

        const physicsLoop = (time: number) => {
            lastTime = time;

            // We only need ONE window to calculate physics to avoid race conditions.
            // Let's make the window that is currently "observing" it the calculator?
            // For simplicity, let's just let every window calculate it identically.

            // Wait, if every window calculates, they might drift. 
            // Better logic: The window whose center is closest to the entity is the "server" for physics.
            let closestWindowId = windowId;
            let minDistance = Infinity;

            const myScreenX = window.screenLeft || window.screenX;
            const myScreenY = window.screenTop || window.screenY;
            const myCenterX = myScreenX + window.innerWidth / 2;
            const myCenterY = myScreenY + window.innerHeight / 2;

            const dx = myCenterX - currentAbsX;
            const dy = myCenterY - currentAbsY;
            minDistance = Math.sqrt(dx * dx + dy * dy);

            for (const winId in otherWindows) {
                const win = otherWindows[winId];
                const dxx = win.centerX - currentAbsX;
                const dyy = win.centerY - currentAbsY;
                const dist = Math.sqrt(dxx * dxx + dyy * dyy);
                if (dist < minDistance) {
                    minDistance = dist;
                    closestWindowId = win.id;
                }
            }

            // Only update absolute position state if WE are the closest (authoritative physics node)
            if (closestWindowId === windowId && (Math.abs(currentVx) > 0.1 || Math.abs(currentVy) > 0.1)) {
                // Apply velocity
                currentAbsX += currentVx;
                currentAbsY += currentVy;

                // Apply friction
                currentVx *= friction;
                currentVy *= friction;

                // Stop completely if very slow
                if (Math.abs(currentVx) < 0.1) currentVx = 0;
                if (Math.abs(currentVy) < 0.1) currentVy = 0;

                // Broadcast new state
                updateEntityAbsolutePosition(currentAbsX, currentAbsY, currentVx, currentVy, false);
            }

            renderLoopRef.current = requestAnimationFrame(physicsLoop);
        };

        if (Math.abs(currentVx) > 0 || Math.abs(currentVy) > 0) {
            renderLoopRef.current = requestAnimationFrame(physicsLoop);
        }

        return () => {
            if (renderLoopRef.current) cancelAnimationFrame(renderLoopRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, entityState?.ownerWindowId]);


    // Framer Motion Drag Handlers
    const handleDragStart = () => {
        claimEntity();
    };

    const handleDrag = (_: unknown, info: PanInfo) => {
        const screenX = window.screenLeft || window.screenX;
        const screenY = window.screenTop || window.screenY;

        // Calculate new absolute position based on local pointer
        const startX = info.point.x;
        const startY = info.point.y;

        // Track velocity on drag
        updateEntityAbsolutePosition(
            screenX + startX,
            screenY + startY,
            info.velocity.x * 0.05, // Scale down framer's velocity pixel value
            info.velocity.y * 0.05,
            true
        );

        // Update local visuals instantly
        localX.set(startX);
        localY.set(startY);
    };

    const handleDragEnd = (_: unknown, info: PanInfo) => {
        releaseEntity();

        // Throw momentum
        const screenX = window.screenLeft || window.screenX;
        const screenY = window.screenTop || window.screenY;

        updateEntityAbsolutePosition(
            screenX + info.point.x,
            screenY + info.point.y,
            info.velocity.x * 0.03, // Initial flick velocity
            info.velocity.y * 0.03,
            false // Not dragging anymore, floating free
        );
    };

    if (!isConnected || !entityState) return null;

    // Render Entity Visuals
    let visualElement = null;
    if (entityState.type === "energy-ball") {
        visualElement = (
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                    filter: ["brightness(1) hue-rotate(0deg)", "brightness(1.5) hue-rotate(90deg)", "brightness(1) hue-rotate(0deg)"]
                }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent shadow-[0_0_30px_rgba(var(--accent-rgb),0.8)] flex items-center justify-center backdrop-blur-sm"
            >
                <div className="w-8 h-8 bg-accent rounded-full animate-ping opacity-50" />
            </motion.div>
        );
    } else if (entityState.type === "drone") {
        visualElement = (
            <motion.div
                className="w-20 h-20 bg-bg-card border-2 border-border text-[40px] flex items-center justify-center rounded-xl shadow-2xl relative"
            >
                🛸
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]" />
            </motion.div>
        )
    } else {
        visualElement = (
            <div className="w-24 h-24 bg-white rounded flex items-center justify-center font-bold text-black border-4 border-black shadow-[8px_8px_0_var(--accent)]">
                (⌐■_■)
            </div>
        )
    }

    // Ghost Connections Calculation
    const connections = Object.values(otherWindows).map(win => {
        // Calculate SVG line from our local center to the other window's center relative to our viewport
        const myScreenX = window.screenLeft || window.screenX;
        const myScreenY = window.screenTop || window.screenY;

        const relStartX = window.innerWidth / 2;
        const relStartY = window.innerHeight / 2;

        const relEndX = win.centerX - myScreenX;
        const relEndY = win.centerY - myScreenY;

        return (
            <line
                key={win.id}
                x1={relStartX}
                y1={relStartY}
                x2={relEndX}
                y2={relEndY}
                stroke="var(--accent)"
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.3"
            >
                <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />
            </line>
        )
    });

    return (
        <>
            <svg className="fixed inset-0 w-full h-full pointer-events-none z-0">
                {connections}
            </svg>

            {/* Entity */}
            <motion.div
                drag
                dragMomentum={false} // We handle our own cross-window momentum physics
                onDragStart={handleDragStart}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                style={{
                    x: springX,
                    y: springY,
                    // Center the element grab physics
                    translateX: "-50%",
                    translateY: "-50%",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: 50,
                    opacity: isVisible ? 1 : 0,
                    // Only catch pointers if it's visible inside our window
                    pointerEvents: isVisible ? "auto" : "none",
                    cursor: "grab"
                }}
                whileDrag={{ scale: 1.1, cursor: "grabbing" }}
            >
                {visualElement}
            </motion.div>
        </>
    );
}
