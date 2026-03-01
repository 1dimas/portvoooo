"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Detect mobile & touch devices
        if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
            setIsTouchDevice(true);
            return;
        }

        // Hide default cursor globally
        document.body.style.cursor = "none";

        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
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
    }, [isVisible, isTouchDevice]);

    if (!mounted || typeof window === "undefined" || isTouchDevice) return null;

    const cursorSize = isHovering ? 64 : 16;

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[999] bg-white mix-blend-difference"
            animate={{
                x: mousePosition.x - cursorSize / 2,
                y: mousePosition.y - cursorSize / 2,
                width: cursorSize,
                height: cursorSize,
                borderRadius: isHovering ? "0%" : "50%", // Square when hovering, circle otherwise
                rotate: isHovering ? 45 : 0, // Diamond shape on hover
            }}
            transition={{
                type: "tween",
                ease: "backOut",
                duration: 0.15, // Fast response
            }}
            style={{
                opacity: isVisible ? 1 : 0,
            }}
        />
    );
}
