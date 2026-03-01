"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Prevent scrolling while loading
        document.body.style.overflow = "hidden";

        const duration = 2000; // 2 seconds total loading animation
        const intervalTime = 20; // 20ms per tick
        const totalTicks = duration / intervalTime;
        let currentTick = 0;

        const timer = setInterval(() => {
            currentTick++;
            // Calculate progress with a slight ease-out curve for realism
            const progressValue = Math.min(
                100,
                Math.floor(100 * (1 - Math.pow(1 - currentTick / totalTicks, 3)))
            );

            setProgress(progressValue);

            if (currentTick >= totalTicks) {
                clearInterval(timer);
                setTimeout(() => {
                    setIsLoading(false);
                    document.body.style.overflow = "";
                }, 400); // Brief pause at 100% before sliding up
            }
        }, intervalTime);

        return () => {
            clearInterval(timer);
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} // Sharp custom cubic-bezier for a brutalist slide up
                    className="fixed inset-0 z-[100] bg-bg-primary flex flex-col items-center justify-center overflow-hidden"
                >
                    <div className="relative w-full h-full flex flex-col justify-end p-8 md:p-12">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex justify-between items-end w-full"
                        >
                            <span className="text-text-secondary uppercase tracking-[0.3em] font-bold text-sm md:text-base max-w-[200px]">
                                Sedang Memuat Pengalaman Digital
                            </span>
                            <h1 className="text-[15vw] leading-none font-black font-heading text-accent tracking-tighter m-0 p-0 mix-blend-difference">
                                {progress}<span className="text-[10vw]">%</span>
                            </h1>
                        </motion.div>

                        {/* Progress Bar Line */}
                        <div className="w-full h-1 bg-white/10 mt-4 overflow-hidden">
                            <motion.div
                                className="h-full bg-accent"
                                style={{ width: `${progress}%` }}
                                transition={{ ease: "linear" }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
