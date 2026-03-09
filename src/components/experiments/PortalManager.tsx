"use client";

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

// The shape of the data we broadcast to other windows
export interface PortalEntityState {
    id: string;
    type: "drone" | "energy-ball" | "anime";
    // Absolute position on the physical monitor (screenX/Y + browser inner X/Y)
    absoluteX: number;
    absoluteY: number;
    velocityX: number;
    velocityY: number;
    // Who currently "owns" or is actively grabbing/controlling the entity
    ownerWindowId: string | null;
    timestamp: number;
}

export interface WindowMetrics {
    id: string;
    screenX: number;
    screenY: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
    timestamp: number;
}

interface PortalContextType {
    windowId: string;
    entityState: PortalEntityState | null;
    otherWindows: Record<string, WindowMetrics>;
    isConnected: boolean;
    updateEntityAbsolutePosition: (x: number, y: number, vx: number, vy: number, isDragging: boolean) => void;
    claimEntity: () => void;
    releaseEntity: () => void;
    setEntityType: (type: "drone" | "energy-ball" | "anime") => void;
    toggleConnection: () => void;
}

const PortalContext = createContext<PortalContextType | null>(null);

const CHANNEL_NAME = "cross-window-portal";

// Helper to generate a unique ID for this browser window instance
const generateWindowId = () => Math.random().toString(36).substring(2, 9);

export function PortalProvider({ children }: { children: ReactNode }) {
    const [windowId] = useState(() => generateWindowId());
    const [isConnected, setIsConnected] = useState(true);

    // Global state of the shared entity
    const [entityState, setEntityState] = useState<PortalEntityState | null>(null);

    // Keep track of other connected windows for the "Ghost Lines"
    const [otherWindows, setOtherWindows] = useState<Record<string, WindowMetrics>>({});

    const channelRef = useRef<BroadcastChannel | null>(null);
    const metricsIntervalRef = useRef<number>();

    // 1. Initialize Broadcast Channel
    useEffect(() => {
        if (!isConnected) {
            if (channelRef.current) {
                channelRef.current.close();
                channelRef.current = null;
            }
            return;
        }

        const channel = new BroadcastChannel(CHANNEL_NAME);
        channelRef.current = channel;

        channel.onmessage = (event) => {
            const data = event.data;

            if (data.type === "ENTITY_UPDATE") {
                // Ignore older updates if we recently received a newer one
                setEntityState(prev => {
                    if (!prev || data.state.timestamp > prev.timestamp) {
                        return data.state;
                    }
                    return prev;
                });
            } else if (data.type === "WINDOW_METRICS") {
                // Receive heartbeats from other windows
                setOtherWindows(prev => ({
                    ...prev,
                    [data.metrics.id]: data.metrics
                }));
            }
        };

        // Broadcast our initial presence
        broadcastMetrics();

        // Cleanup
        return () => {
            channel.close();
            channelRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, windowId]);

    // 2. Continually broadcast our window's physical layout
    const broadcastMetrics = () => {
        if (!channelRef.current || !isConnected) return;

        try {
            const metrics: WindowMetrics = {
                id: windowId,
                screenX: window.screenLeft || window.screenX,
                screenY: window.screenTop || window.screenY,
                width: window.innerWidth,
                height: window.innerHeight,
                centerX: (window.screenLeft || window.screenX) + (window.innerWidth / 2),
                centerY: (window.screenTop || window.screenY) + (window.innerHeight / 2),
                timestamp: Date.now()
            };

            channelRef.current.postMessage({ type: "WINDOW_METRICS", metrics });
        } catch (e) {
            // Screen metrics might be restricted in some environments/iframes
            console.warn("Could not read window metrics", e);
        }
    };

    // Heartbeat loop for window metrics (runs at 10fps to save performance)
    useEffect(() => {
        if (isConnected) {
            metricsIntervalRef.current = window.setInterval(broadcastMetrics, 100);
        }

        // Also cleanup stale windows (if we haven't heard from them in 2 seconds)
        const cleanupInterval = setInterval(() => {
            setOtherWindows(prev => {
                const now = Date.now();
                const next = { ...prev };
                let mutated = false;
                for (const id in next) {
                    if (now - next[id].timestamp > 2000) {
                        delete next[id];
                        mutated = true;
                    }
                }
                return mutated ? next : prev;
            });
        }, 2000);

        return () => {
            clearInterval(metricsIntervalRef.current);
            clearInterval(cleanupInterval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected]);

    // Initialize default entity if none exists
    useEffect(() => {
        if (isConnected && !entityState) {
            // We just connected. Let's wait a tiny bit to see if we receive an entity from others
            const timeout = setTimeout(() => {
                setEntityState(prev => {
                    if (prev) return prev; // Someone else sent it

                    // We are the first window, create it at our center
                    const screenX = window.screenLeft || window.screenX;
                    const screenY = window.screenTop || window.screenY;

                    const newState: PortalEntityState = {
                        id: "shared-entity-1",
                        type: "energy-ball",
                        absoluteX: screenX + window.innerWidth / 2,
                        absoluteY: screenY + window.innerHeight / 2,
                        velocityX: 0,
                        velocityY: 0,
                        ownerWindowId: null,
                        timestamp: Date.now()
                    };

                    if (channelRef.current) {
                        channelRef.current.postMessage({ type: "ENTITY_UPDATE", state: newState });
                    }
                    return newState;
                });
            }, 500); // 500ms grace period to receive existing state

            return () => clearTimeout(timeout);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected]);

    // Actions
    const updateEntityAbsolutePosition = (x: number, y: number, vx: number, vy: number, isDragging: boolean) => {
        if (!entityState || !isConnected) return;

        // Important: Only update if WE are the owner, OR if no one owns it (it's floating)
        if (entityState.ownerWindowId !== null && entityState.ownerWindowId !== windowId) {
            return;
        }

        const newState: PortalEntityState = {
            ...entityState,
            absoluteX: x,
            absoluteY: y,
            velocityX: vx,
            velocityY: vy,
            timestamp: Date.now(),
            ownerWindowId: isDragging ? windowId : null
        };

        setEntityState(newState);

        // Broadcast the update (throttle slightly handled by requestAnimationFrame in consumer)
        if (channelRef.current) {
            channelRef.current.postMessage({ type: "ENTITY_UPDATE", state: newState });
        }
    };

    const claimEntity = () => {
        if (!entityState || !isConnected) return;
        const newState = { ...entityState, ownerWindowId: windowId, timestamp: Date.now() };
        setEntityState(newState);
        if (channelRef.current) channelRef.current.postMessage({ type: "ENTITY_UPDATE", state: newState });
    };

    const releaseEntity = () => {
        if (!entityState || !isConnected || entityState.ownerWindowId !== windowId) return;
        const newState = { ...entityState, ownerWindowId: null, timestamp: Date.now() };
        setEntityState(newState);
        if (channelRef.current) channelRef.current.postMessage({ type: "ENTITY_UPDATE", state: newState });
    };

    const setEntityType = (type: "drone" | "energy-ball" | "anime") => {
        if (!entityState || !isConnected) return;
        const newState = { ...entityState, type, timestamp: Date.now() };
        setEntityState(newState);
        if (channelRef.current) channelRef.current.postMessage({ type: "ENTITY_UPDATE", state: newState });
    };

    const toggleConnection = () => setIsConnected(prev => !prev);

    return (
        <PortalContext.Provider value={{
            windowId,
            entityState,
            otherWindows,
            isConnected,
            updateEntityAbsolutePosition,
            claimEntity,
            releaseEntity,
            setEntityType,
            toggleConnection
        }}>
            {children}
        </PortalContext.Provider>
    );
}

export const usePortalManager = () => {
    const context = useContext(PortalContext);
    if (!context) throw new Error("usePortalManager must be used within PortalProvider");
    return context;
};
