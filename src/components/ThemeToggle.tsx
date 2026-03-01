"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import MagneticButton from "./MagneticButton";
import { motion } from "framer-motion";
import { playPop } from "@/utils/audio";


export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-12 h-12" />; // Placeholder to prevent layout shift
    }

    const isLight = theme === "light";

    return (
        <div className="fixed top-6 right-6 z-50 mix-blend-difference pointer-events-auto">
            <MagneticButton>
                <button
                    onClick={() => {
                        setTheme(isLight ? "dark" : "light");
                        playPop();
                    }}
                    className="relative w-14 h-14 bg-white dark:bg-black border-2 border-black dark:border-white rounded-none flex items-center justify-center cursor-none group overflow-hidden"
                    aria-label="Toggle Theme"
                >
                    {/* Hover fill effect */}
                    <div className="absolute inset-0 bg-black dark:bg-white origin-bottom scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100" />

                    <motion.div
                        initial={false}
                        animate={{ rotate: isLight ? 180 : 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="relative z-10 text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors duration-300 flex items-center justify-center w-full h-full"
                    >
                        {isLight ? (
                            // Moon icon for switching to dark form light
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        ) : (
                            // Sun icon for switching to light from dark
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                        )}
                    </motion.div>
                </button>
            </MagneticButton>
        </div>
    );
}
