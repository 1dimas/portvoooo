"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/** Jangan berkedip kalau semuanya sudah cached dan selesai instan. */
const MIN_VISIBLE_MS = 400;
/** Failsafe: satu resource lambat tidak boleh menyandera user. */
const MAX_WAIT_MS = 4000;

export default function Preloader() {
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const targetRef = useRef(0);
    const prefersReducedMotion = useReducedMotion();

    // Progress mengikuti resource yang benar-benar selesai dimuat.
    useEffect(() => {
        document.body.style.overflow = "hidden";
        const startedAt = performance.now();
        let finished = false;

        const signals: Promise<unknown>[] = [
            // Font Anton/Inter dipakai langsung oleh preloader ini — tunggu sampai siap
            // supaya tidak ada pergantian font di depan mata user.
            document.fonts?.ready ?? Promise.resolve(),
            document.readyState === "complete"
                ? Promise.resolve()
                : new Promise<void>((resolve) =>
                      window.addEventListener("load", () => resolve(), { once: true })
                  ),
        ];

        let settled = 0;
        for (const signal of signals) {
            Promise.resolve(signal).finally(() => {
                settled += 1;
                targetRef.current = Math.round((settled / signals.length) * 100);
            });
        }

        const finish = () => {
            if (finished) return;
            finished = true;
            targetRef.current = 100;
            setProgress(100);
            // Jeda singkat di 100% sebelum panel naik.
            window.setTimeout(() => {
                setIsLoading(false);
                document.body.style.overflow = "";
            }, 300);
        };

        void Promise.allSettled(signals).then(() => {
            const elapsed = performance.now() - startedAt;
            window.setTimeout(finish, Math.max(0, MIN_VISIBLE_MS - elapsed));
        });

        const failsafe = window.setTimeout(finish, MAX_WAIT_MS);

        return () => {
            window.clearTimeout(failsafe);
            document.body.style.overflow = "";
        };
    }, []);

    // Angka dianimasikan mendekati target, dengan sedikit "rayapan" supaya
    // tidak pernah terlihat membeku saat menunggu sinyal berikutnya.
    useEffect(() => {
        let raf = 0;
        const tick = () => {
            setProgress((prev) => {
                const target = targetRef.current;
                const ceiling = target >= 100 ? 100 : Math.min(97, target + 9);
                if (prev >= ceiling) return prev;
                return Math.min(ceiling, prev + Math.max(0.4, (ceiling - prev) * 0.07));
            });
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    const shown = Math.floor(progress);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={
                        prefersReducedMotion
                            ? { duration: 0.2 }
                            : { duration: 0.8, ease: [0.76, 0, 0.24, 1] } // Slide brutalist yang tegas
                    }
                    role="status"
                    aria-live="polite"
                    aria-busy="true"
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
                            <h1 className="text-[15vw] leading-none font-black font-heading text-accent tracking-tighter m-0 p-0 mix-blend-difference tabular-nums">
                                {shown}
                                <span className="text-[10vw]">%</span>
                            </h1>
                        </motion.div>

                        {/* Progress Bar Line */}
                        <div className="w-full h-1 bg-white/10 mt-4 overflow-hidden">
                            <div
                                className="h-full bg-accent"
                                style={{ width: `${shown}%` }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
