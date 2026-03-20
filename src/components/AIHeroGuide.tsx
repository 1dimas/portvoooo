"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendAIMessage } from "@/lib/ai/ai";

interface Message {
    role: "user" | "ai";
    text: string;
    suggestion?: string;
}

const QUICK_ACTIONS = [
    { label: "Best Projects", query: "projects", icon: "📁" },
    { label: "Explore Lab", query: "lab", icon: "🧪" },
    { label: "About Me", query: "about", icon: "👤" },
];

export default function AIHeroGuide() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    // Listen for Lab "Ask AI" events
    useEffect(() => {
        const handleLabAI = async (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (!detail) return;

            setIsOpen(true);
            setIsLoading(true);

            // Add user message
            const userMsg: Message = { role: "user", text: `Explain "${detail.title}"` };
            setMessages(prev => [...prev, userMsg]);

            const response = await sendAIMessage(detail.message, "lab", {
                title: detail.title,
                description: detail.description,
                tech: detail.tech,
                useCase: detail.useCase,
                impact: detail.impact,
            });

            setMessages(prev => [...prev, { role: "ai", text: response.reply, suggestion: response.suggestion }]);
            setIsLoading(false);
        };

        window.addEventListener("ask-ai-lab", handleLabAI);
        return () => window.removeEventListener("ask-ai-lab", handleLabAI);
    }, [messages]);

    const handleSend = async (message: string) => {
        if (!message.trim() || isLoading) return;

        const userMsg: Message = { role: "user", text: message.trim() };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        // Build previous messages for memory
        const previousMessages = messages.slice(-4).map(m => ({
            role: m.role === "user" ? "user" : "model",
            text: m.text,
        }));

        const response = await sendAIMessage(message.trim(), "hero", undefined, previousMessages);

        setMessages(prev => [...prev, { role: "ai", text: response.reply, suggestion: response.suggestion }]);
        setIsLoading(false);
    };

    const handleSuggestionClick = (sug: string) => {
        if (sug === "Explore Lab") {
            window.location.href = "/lab";
        } else if (sug === "View Projects") {
            document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
            setIsOpen(false);
        } else if (sug === "Get in Touch") {
            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            setIsOpen(false);
        } else if (sug === "View Tech Stack") {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Floating Trigger Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: 1.5, duration: 0.5 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-accent text-bg-primary rounded-full flex items-center justify-center shadow-lg shadow-accent/30 hover:scale-110 transition-transform cursor-none group"
                        aria-label="Open AI Guide"
                    >
                        <span className="text-xl">✦</span>
                        {/* Pulse ring */}
                        <span className="absolute inset-0 rounded-full border-2 border-accent animate-ping opacity-30" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Guide Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] bg-bg-primary/95 backdrop-blur-xl border border-border rounded-lg shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
                        style={{ maxHeight: "min(500px, 70vh)" }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-card/50">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-xs font-mono uppercase tracking-widest text-text-secondary">
                                    AI Guide
                                </span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-text-muted hover:text-text-primary text-lg transition-colors"
                            >
                                ×
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                            {/* Initial greeting if no messages */}
                            {messages.length === 0 && (
                                <div className="space-y-4">
                                    <p className="text-text-secondary text-sm">
                                        Hi! What do you want to explore?
                                    </p>

                                    {/* Quick Action Buttons — PRIMARY */}
                                    <div className="flex flex-col gap-2">
                                        {QUICK_ACTIONS.map(action => (
                                            <button
                                                key={action.query}
                                                onClick={() => handleSend(action.query)}
                                                className="flex items-center gap-3 px-4 py-3 bg-bg-card border border-border hover:border-accent hover:bg-bg-card-hover text-left transition-all duration-200 group rounded-sm"
                                            >
                                                <span className="text-lg">{action.icon}</span>
                                                <span className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
                                                    {action.label}
                                                </span>
                                                <span className="ml-auto text-text-muted text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                                    →
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Chat messages */}
                            {messages.map((msg, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <div
                                        className={`text-sm leading-relaxed ${
                                            msg.role === "user"
                                                ? "text-accent font-medium text-right"
                                                : "text-text-primary"
                                        }`}
                                    >
                                        {msg.role === "ai" && (
                                            <span className="text-accent text-xs mr-1">✦</span>
                                        )}
                                        {msg.text}
                                    </div>
                                    {msg.suggestion && (
                                        <motion.button
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            onClick={() => handleSuggestionClick(msg.suggestion!)}
                                            className="px-3 py-1.5 bg-accent/10 border border-accent/20 text-accent text-[10px] font-mono uppercase tracking-wider hover:bg-accent/20 transition-colors rounded-sm w-fit self-start"
                                        >
                                            → {msg.suggestion}
                                        </motion.button>
                                    )}
                                </div>
                            ))}

                            {/* Typing indicator */}
                            {isLoading && (
                                <div className="flex items-center gap-1 text-text-muted">
                                    <span className="text-accent text-xs">✦</span>
                                    <span className="text-xs">thinking</span>
                                    <span className="flex gap-0.5">
                                        {[0, 1, 2].map(i => (
                                            <motion.span
                                                key={i}
                                                animate={{ opacity: [0.3, 1, 0.3] }}
                                                transition={{
                                                    duration: 1,
                                                    repeat: Infinity,
                                                    delay: i * 0.2,
                                                }}
                                                className="w-1 h-1 bg-accent rounded-full inline-block"
                                            />
                                        ))}
                                    </span>
                                </div>
                            )}

                        </div>

                        {/* Input — SECONDARY (chat is secondary to actions) */}
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                handleSend(input);
                            }}
                            className="p-3 border-t border-border flex gap-2"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Or type a question..."
                                className="flex-1 bg-bg-card border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent rounded-sm"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="px-3 py-2 bg-accent text-bg-primary text-sm font-bold disabled:opacity-30 hover:bg-accent-light transition-colors rounded-sm"
                            >
                                ↑
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
