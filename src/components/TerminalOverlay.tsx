"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TerminalOverlay() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<{ command: string; output: React.ReactNode }[]>([
        {
            command: "",
            output: "Welcome to DIMAS-OS v1.0.0\nType 'help' for a list of commands."
        }
    ]);
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Handle Ctrl+` (backtick) or Ctrl+J to avoid Chrome URL bar hijacking Ctrl+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === "`" || e.key === "j" || e.key === "k")) {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };

        const handleOpenTerminal = () => setIsOpen(true);

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("open-terminal", handleOpenTerminal);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("open-terminal", handleOpenTerminal);
        };
    }, [isOpen]);

    // Keep focus on input
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Auto scroll to bottom
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [history, isOpen]);

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = input.trim().toLowerCase();

        let output: React.ReactNode = "";

        if (cmd === "") {
            // Do nothing
        } else if (cmd === "help") {
            output = (
                <div className="flex flex-col gap-1">
                    <span>Available commands:</span>
                    <span className="text-accent">whoami <span className="text-text-muted">- Display owner info</span></span>
                    <span className="text-accent">skills <span className="text-text-muted">- List technical stack</span></span>
                    <span className="text-accent">cat resume.txt <span className="text-text-muted">- Output resume details</span></span>
                    <span className="text-accent">clear <span className="text-text-muted">- Clear terminal</span></span>
                    <span className="text-accent">exit <span className="text-text-muted">- Close terminal</span></span>
                    <span className="text-red-500 mt-2 font-bold animate-pulse">sudo <span className="text-text-muted font-normal text-xs">- DO NOT USE THIS COMMAND. CLASSIFIED.</span></span>
                </div>
            );
        } else if (cmd === "whoami") {
            output = "dimas - Full Stack Developer & Digital Business Architect.";
        } else if (cmd === "skills") {
            output = "Frontend: React, Next.js, Framer Motion, Tailwind\nBackend: Node.js, NestJS, PHP, Express\nDatabase: PostgreSQL, MySQL, Prisma";
        } else if (cmd === "cat resume.txt") {
            output = (
                <div className="flex flex-col gap-2 border-l-2 border-accent pl-4 mt-2">
                    <span className="font-bold">DIMAS</span>
                    <span>Role: Full Stack Engineer</span>
                    <span>Experience: Building scalable web applications, e-commerce platforms, and enterprise solutions.</span>
                    <span>Contact: type 'email' or 'github' (just kidding, use the contact form!)</span>
                </div>
            );
        } else if (cmd === "sudo") {
            output = (
                <div className="mt-4 flex flex-col gap-2 items-start">
                    <span className="text-red-500 font-bold uppercase tracking-widest text-lg">⚠️ SECURITY BREACH DETECTED ⚠️</span>
                    <span className="text-text-primary">Initiating countermeasures...</span>
                    <div className="w-full max-w-[400px] aspect-video mt-2 border-2 border-red-500 rounded bg-black overflow-hidden relative shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0&modestbranding=1&rel=0"
                            title="Never Gonna Give You Up"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0"
                        ></iframe>
                    </div>
                </div>
            );
        } else if (cmd === "clear") {
            setHistory([]);
            setInput("");
            return;
        } else if (cmd === "exit") {
            setIsOpen(false);
            setInput("");
            return;
        } else {
            output = `Command not found: ${cmd}. Type 'help' for available commands.`;
        }

        if (cmd !== "") {
            setHistory((prev) => [...prev, { command: cmd, output }]);
        }
        setInput("");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto"
                    onClick={(e) => {
                        // Close if clicked outside terminal window
                        if (e.target === e.currentTarget) setIsOpen(false);
                    }}
                >
                    <div className="w-full max-w-3xl bg-[#0c0c0c] border border-text-muted/30 rounded-lg overflow-hidden shadow-2xl font-mono text-sm sm:text-base flex flex-col max-h-[80vh]">
                        {/* Fake Mac/Linux Header */}
                        <div className="bg-[#1a1a1a] px-4 py-2 flex items-center border-b border-text-muted/30">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" onClick={() => setIsOpen(false)} />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <div className="text-text-muted text-xs mx-auto">dimas@portfolio: ~</div>
                        </div>

                        {/* Terminal Body */}
                        <div className="p-4 overflow-y-auto flex-1 text-green-400 whitespace-pre-wrap">
                            {history.map((item, i) => (
                                <div key={i} className="mb-4">
                                    {item.command && (
                                        <div className="flex gap-2">
                                            <span className="text-accent">➜</span>
                                            <span className="text-blue-400">~</span>
                                            <span className="text-white">{item.command}</span>
                                        </div>
                                    )}
                                    <div className="mt-1 text-gray-300">{item.output}</div>
                                </div>
                            ))}

                            <form onSubmit={handleCommand} className="flex gap-2 mt-2">
                                <span className="text-accent">➜</span>
                                <span className="text-blue-400">~</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0 p-0"
                                    autoComplete="off"
                                    spellCheck="false"
                                />
                            </form>
                            <div ref={bottomRef} className="h-4" />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
