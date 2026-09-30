"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/** Jangan berkedip kalau semuanya sudah cached dan selesai instan. */
const MIN_VISIBLE_MS = 500;
/** Failsafe: satu resource lambat tidak boleh menyandera user. */
const MAX_WAIT_MS = 4000;

/** Tiap baris terikat ke satu sinyal loading nyata — bukan hiasan. */
const BOOT_STEPS = ["mounting runtime", "loading typefaces", "resolving assets"] as const;

export default function Preloader() {
    const [progress, setProgress] = useState(0);
    const [doneCount, setDoneCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const targetRef = useRef(0);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        document.body.style.overflow = "hidden";
        const startedAt = performance.now();
        let finished = false;

        const signals: Promise<unknown>[] = [
            // runtime: React sudah hydrate begitu effect ini jalan.
            Promise.resolve(),
            // typefaces: Anton/Inter dipakai langsung di layar ini.
            document.fonts?.ready ?? Promise.resolve(),
            // assets: seluruh resource halaman.
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
                setDoneCount(settled);
                targetRef.current = Math.round((settled / signals.length) * 100);
            });
        }

        const finish = () => {
            if (finished) return;
            finished = true;
            targetRef.current = 100;
            setDoneCount(signals.length);
            setProgress(100);
            window.setTimeout(() => {
                setIsLoading(false);
                document.body.style.overflow = "";
            }, 320);
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

    // Angka merayap mendekati target supaya tidak pernah terlihat membeku.
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
                            : { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
                    }
                    role="status"
                    aria-live="polite"
                    aria-busy="true"
                    className="fixed inset-0 z-[100] bg-bg-primary overflow-hidden"
                >
                    {/* Scanline tipis — bahasa visual yang sama dengan modal sertifikat */}
                    <div
                        aria-hidden
                        className="absolute inset-0 pointer-events-none opacity-[0.04]"
                        style={{
                            backgroundImage:
                                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.06) 2px, rgba(255,255,255,0.06) 4px)",
                        }}
                    />

                    <div className="relative h-full w-full flex flex-col justify-between p-8 md:p-12">
                        {/* Boot log */}
                        <div className="font-mono text-[11px] md:text-sm leading-relaxed">
                            <p className="text-accent">$ ./portfolio --init</p>
                            <div className="mt-3 space-y-1">
                                {BOOT_STEPS.map((step, index) => {
                                    const isDone = index < doneCount;
                                    return (
                                        <p
                                            key={step}
                                            className={
                                                isDone ? "text-text-secondary" : "text-text-muted/50"
                                            }
                                        >
                                            <span className="text-text-muted">{">"}</span> {step}{" "}
                                            <span className="text-text-muted/40">
                                                {".".repeat(Math.max(2, 26 - step.length))}
                                            </span>{" "}
                                            <span className={isDone ? "text-accent" : ""}>
                                                {isDone ? "OK" : ".."}
                                            </span>
                                        </p>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Angka besar */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className="w-full"
                        >
                            <div className="flex justify-between items-end w-full">
                                <span className="text-text-secondary uppercase tracking-[0.3em] font-bold text-sm md:text-base max-w-[200px]">
                                    Sedang Memuat Pengalaman Digital
                                </span>
                                <h1 className="text-[15vw] leading-none font-black font-heading text-accent tracking-tighter m-0 p-0 mix-blend-difference tabular-nums">
                                    {shown}
                                    <span className="text-[10vw]">%</span>
                                </h1>
                            </div>

                            <div className="w-full h-1 bg-white/10 mt-4 overflow-hidden">
                                <div className="h-full bg-accent" style={{ width: `${shown}%` }} />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
