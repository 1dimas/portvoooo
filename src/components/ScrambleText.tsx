"use client";

import { useEffect, useState } from "react";

const CHARS = "!<>-_\\/[]{}—=+*^?#________";

interface ScrambleTextProps {
    text: string;
    className?: string;
    duration?: number;
    delay?: number;
}

export default function ScrambleText({ text, className = "", duration = 50, delay = 0 }: ScrambleTextProps) {
    const [displayText, setDisplayText] = useState("");
    const [isScrambling, setIsScrambling] = useState(false);

    useEffect(() => {
        let frame = 0;
        let timeout: NodeJS.Timeout;
        let frameId: number;

        const maxFrames = duration;

        const scramble = () => {
            let result = "";
            for (let i = 0; i < text.length; i++) {
                // If we've passed the frame threshold for this character, reveal it
                if (frame >= maxFrames * (i / text.length)) {
                    result += text[i];
                } else {
                    // Otherwise, show a random symbol
                    result += CHARS[Math.floor(Math.random() * CHARS.length)];
                }
            }

            setDisplayText(result);

            if (frame < maxFrames) {
                frame++;
                frameId = requestAnimationFrame(scramble);
            } else {
                setIsScrambling(false);
            }
        };

        const startScramble = () => {
            setIsScrambling(true);
            frame = 0;
            scramble();
        };

        // Initial delay
        timeout = setTimeout(startScramble, delay * 1000);

        return () => {
            clearTimeout(timeout);
            cancelAnimationFrame(frameId);
        };
    }, [text, duration, delay]);

    const handleHover = () => {
        if (isScrambling) return;
        setIsScrambling(true);
        let hoverFrame = 0;
        const totalHoverFrames = 20;

        const hoverScramble = () => {
            let result = "";
            for (let i = 0; i < text.length; i++) {
                if (hoverFrame >= totalHoverFrames * (i / text.length)) {
                    result += text[i];
                } else {
                    result += CHARS[Math.floor(Math.random() * CHARS.length)];
                }
            }
            setDisplayText(result);

            if (hoverFrame < totalHoverFrames) {
                hoverFrame++;
                requestAnimationFrame(hoverScramble);
            } else {
                setDisplayText(text);
                setIsScrambling(false);
            }
        };

        hoverScramble();
    };

    return (
        <span className={className} onMouseEnter={handleHover}>
            {displayText || text.replace(/./g, "\u00A0")} {/* Preserve space using NBSP */}
        </span>
    );
}
