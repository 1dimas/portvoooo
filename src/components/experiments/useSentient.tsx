"use client";

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

interface SentientState {
    scores: Record<string, number>; // ID -> Score (0 to 100)
    learningRate: number;
    decayRate: number;
    isHeatmapActive: boolean;
}

interface SentientContextType extends SentientState {
    setLearningRate: (rate: number) => void;
    setDecayRate: (rate: number) => void;
    toggleHeatmap: () => void;
    amnesia: () => void;
    registerInteraction: (id: string, amount: number) => void;
}

const SentientContext = createContext<SentientContextType | null>(null);

const STORAGE_KEY = "sentient-ui-memory";
const MAX_SCORE = 100;

export function SentientProvider({ children }: { children: ReactNode }) {
    // Load initial memory from Local Storage
    const [scores, setScores] = useState<Record<string, number>>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch {
                    return {};
                }
            }
        }
        return {};
    });

    const [learningRate, setLearningRate] = useState(1); // Score multiplier per interaction
    const [decayRate, setDecayRate] = useState(0.2); // Score lost per second of inactivity
    const [isHeatmapActive, setIsHeatmapActive] = useState(false);

    // Save to Local Storage whenever scores change significantly
    // Debounced to avoid hitting localStorage too often
    const saveTimeoutRef = useRef<NodeJS.Timeout>(undefined);
    useEffect(() => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
        }, 1000);
        return () => clearTimeout(saveTimeoutRef.current);
    }, [scores]);

    // The Decay Loop (Forgetting over time)
    useEffect(() => {
        const decayInterval = setInterval(() => {
            setScores(prev => {
                let mutated = false;
                const next = { ...prev };

                for (const id in next) {
                    if (next[id] > 0) {
                        // Apply decay, but don't drop below 0
                        next[id] = Math.max(0, next[id] - decayRate);
                        mutated = true;
                    }
                }

                return mutated ? next : prev;
            });
        }, 1000); // Run every second

        return () => clearInterval(decayInterval);
    }, [decayRate]);

    const registerInteraction = (id: string, amount: number) => {
        setScores(prev => {
            const current = prev[id] || 0;
            // Cap at MAX_SCORE
            const nextScore = Math.min(MAX_SCORE, current + (amount * learningRate));

            // Optimization: Only update state if it actually changed
            if (current === nextScore) return prev;

            return {
                ...prev,
                [id]: nextScore
            };
        });
    };

    const amnesia = () => {
        setScores({});
        localStorage.removeItem(STORAGE_KEY);
    };

    const toggleHeatmap = () => setIsHeatmapActive(prev => !prev);

    return (
        <SentientContext.Provider value={{
            scores,
            learningRate,
            decayRate,
            isHeatmapActive,
            setLearningRate,
            setDecayRate,
            toggleHeatmap,
            amnesia,
            registerInteraction
        }}>
            {children}
        </SentientContext.Provider>
    );
}

export const useSentient = () => {
    const context = useContext(SentientContext);
    if (!context) throw new Error("useSentient must be used within SentientProvider");
    return context;
};
