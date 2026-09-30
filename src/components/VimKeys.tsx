"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface Target {
    id: string;
    label: string;
}

/** Hanya section yang benar-benar punya anchor di halaman utama. */
const TARGETS: Target[] = [
    { id: "hero", label: "Hero" },
    { id: "lab", label: "The Lab" },
    { id: "services", label: "Services" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "certificates", label: "Certificates" },
    { id: "tech", label: "Tech Stack" },
    { id: "contact", label: "Contact" },
];

const BINDINGS: [string, string][] = [
    ["j / k", "gulir turun / naik"],
    ["Ctrl+d / Ctrl+u", "setengah layar"],
    ["g g", "ke paling atas"],
    ["G", "ke paling bawah"],
    ["/", "lompat ke section"],
    ["Ctrl+j", "buka terminal"],
    ["?", "bantuan ini"],
    ["Esc", "tutup"],
];

/** Jangan bajak tombol saat pengguna sedang mengetik di suatu tempat. */
function isTyping() {
    const el = document.activeElement as HTMLElement | null;
    if (!el) return false;
    const tag = el.tagName;
    return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        el.isContentEditable
    );
}

/**
 * Navigasi ala Vim untuk seluruh situs.
 *
 * Memakai instance Lenis yang sama dengan smooth scroll situs — memanggil
 * window.scrollTo akan berkelahi dengan Lenis dan menghasilkan gerakan patah.
 */
export default function VimKeys() {
    const lenis = useLenis();
    const pathname = usePathname();
    const prefersReducedMotion = useReducedMotion();

    const [showHelp, setShowHelp] = useState(false);
    const [showJump, setShowJump] = useState(false);
    const [query, setQuery] = useState("");
    const [cursor, setCursor] = useState(0);
    const lastG = useRef(0);

    const matches = TARGETS.filter((t) =>
        t.label.toLowerCase().includes(query.toLowerCase())
    );

    const scrollBy = useCallback(
        (amount: number) => {
            const y = (lenis?.actualScroll ?? window.scrollY) + amount;
            if (lenis) lenis.scrollTo(y, { immediate: !!prefersReducedMotion });
            else window.scrollTo({ top: y });
        },
        [lenis, prefersReducedMotion]
    );

    const jumpTo = useCallback(
        (id: string) => {
            const el = document.getElementById(id);
            if (!el) return;
            if (lenis) lenis.scrollTo(el, { immediate: !!prefersReducedMotion });
            else el.scrollIntoView();
            setShowJump(false);
            setQuery("");
        },
        [lenis, prefersReducedMotion]
    );

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            // Palet lompat punya penanganan sendiri di inputnya.
            if (showJump) return;
            if (isTyping() || e.metaKey || e.altKey) return;

            if (e.key === "Escape") {
                setShowHelp(false);
                return;
            }

            if (e.ctrlKey) {
                if (e.key === "d") {
                    e.preventDefault();
                    scrollBy(window.innerHeight / 2);
                } else if (e.key === "u") {
                    e.preventDefault();
                    scrollBy(-window.innerHeight / 2);
                }
                return;
            }

            switch (e.key) {
                case "j":
                    e.preventDefault();
                    scrollBy(120);
                    break;
                case "k":
                    e.preventDefault();
                    scrollBy(-120);
                    break;
                case "G":
                    e.preventDefault();
                    if (lenis) {
                        lenis.scrollTo(document.body.scrollHeight, {
                            immediate: !!prefersReducedMotion,
                        });
                    } else {
                        window.scrollTo({ top: document.body.scrollHeight });
                    }
                    break;
                case "g": {
                    // `gg` — dua ketukan dalam 500ms, persis seperti di Vim.
                    const now = Date.now();
                    if (now - lastG.current < 500) {
                        e.preventDefault();
                        if (lenis) lenis.scrollTo(0, { immediate: !!prefersReducedMotion });
                        else window.scrollTo({ top: 0 });
                        lastG.current = 0;
                    } else {
                        lastG.current = now;
                    }
                    break;
                }
                case "/":
                    e.preventDefault();
                    setQuery("");
                    setCursor(0);
                    setShowJump(true);
                    break;
                case "?":
                    e.preventDefault();
                    setShowHelp((v) => !v);
                    break;
            }
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [scrollBy, showJump, lenis, prefersReducedMotion]);

    // Palet lompat hanya relevan di halaman yang punya section-section itu.
    const jumpEnabled = pathname === "/";

    return (
        <>
            <AnimatePresence>
                {showJump && jumpEnabled && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 z-[120] flex items-start justify-center pt-[15vh] px-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowJump(false)}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-bg-card border-2 border-accent font-mono"
                        >
                            <div className="flex items-center gap-2 px-4 py-3 border-b-2 border-border">
                                <span className="text-accent font-bold">/</span>
                                <input
                                    autoFocus
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        setCursor(0);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Escape") {
                                            setShowJump(false);
                                        } else if (e.key === "Enter") {
                                            if (matches[cursor]) jumpTo(matches[cursor].id);
                                        } else if (e.key === "ArrowDown" || (e.ctrlKey && e.key === "n")) {
                                            e.preventDefault();
                                            setCursor((c) => Math.min(c + 1, matches.length - 1));
                                        } else if (e.key === "ArrowUp" || (e.ctrlKey && e.key === "p")) {
                                            e.preventDefault();
                                            setCursor((c) => Math.max(c - 1, 0));
                                        }
                                    }}
                                    placeholder="lompat ke section…"
                                    className="flex-1 bg-transparent outline-none text-text-primary text-sm placeholder:text-text-muted/50"
                                    spellCheck={false}
                                />
                            </div>
                            <ul className="max-h-64 overflow-y-auto">
                                {matches.map((t, i) => (
                                    <li key={t.id}>
                                        <button
                                            onMouseEnter={() => setCursor(i)}
                                            onClick={() => jumpTo(t.id)}
                                            className={`w-full text-left px-4 py-2 text-sm flex justify-between ${
                                                i === cursor
                                                    ? "bg-accent text-bg-primary"
                                                    : "text-text-secondary"
                                            }`}
                                        >
                                            <span>{t.label}</span>
                                            <span className="opacity-60">#{t.id}</span>
                                        </button>
                                    </li>
                                ))}
                                {!matches.length && (
                                    <li className="px-4 py-3 text-sm text-text-muted">
                                        tidak ada yang cocok
                                    </li>
                                )}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showHelp && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-6 left-6 z-[120] bg-bg-card border-2 border-border p-4 font-mono text-xs max-w-[min(20rem,calc(100vw-3rem))]"
                    >
                        <p className="text-accent font-bold mb-3">KEYBINDINGS</p>
                        <ul className="flex flex-col gap-1.5">
                            {BINDINGS.map(([key, desc]) => (
                                <li key={key} className="flex justify-between gap-4">
                                    <span className="text-text-primary">{key}</span>
                                    <span className="text-text-muted text-right">{desc}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
