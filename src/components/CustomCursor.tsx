"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    // High performance mouse tracking using Framer Motion values
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Smooth spring physics for the cursor
    const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        // Detect mobile & touch devices
        if (typeof window !== "undefined" && window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
            setIsTouchDevice(true);
            return;
        }

        // Hide default cursor globally
        document.body.style.cursor = "none";

        const updateMousePosition = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if hovering over clickable elements
            if (
                target.tagName.toLowerCase() === "a" ||
                target.tagName.toLowerCase() === "button" ||
                target.closest("a") ||
                target.closest("button")
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        const handleMouseLeaveGlobal = () => {
            setIsVisible(false);
        };

        window.addEventListener("mousemove", updateMousePosition);
        window.addEventListener("mouseover", handleMouseOver);
        document.body.addEventListener("mouseleave", handleMouseLeaveGlobal);

        // Add CSS to force links to hide their cursor too
        const style = document.createElement('style');
        style.innerHTML = `
            * { cursor: none !important; }
        `;
        document.head.appendChild(style);

        return () => {
            if (isTouchDevice) return;
            window.removeEventListener("mousemove", updateMousePosition);
            window.removeEventListener("mouseover", handleMouseOver);
            document.body.removeEventListener("mouseleave", handleMouseLeaveGlobal);
            if (document.head.contains(style)) document.head.removeChild(style);
            document.body.style.cursor = "auto";
        };
    }, [isVisible, isTouchDevice, mouseX, mouseY]);

    if (isTouchDevice) return null;

    const size = isHovering ? 64 : 16;

    return (
        <>
            {/* Main Cursor Dot */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[999] bg-white mix-blend-difference flex items-center justify-center font-bold text-black text-[10px] uppercase tracking-widest overflow-hidden"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isVisible ? 1 : 0,
                }}
                animate={{
                    width: size,
                    height: size,
                    borderRadius: isHovering ? "0%" : "50%",
                    rotate: isHovering ? 90 : 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                }}
            >
                {/* Optional subtle inner text for brutalist feel when hovering */}
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovering ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="rotate-[-90deg] leading-none"
                >
                    +
                </motion.span>
            </motion.div>
        </>
    );
}
