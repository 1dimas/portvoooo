"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type PerformanceTier = "HIGH" | "MEDIUM" | "ECO";

export interface NetworkInfo {
    effectiveType: "4g" | "3g" | "2g" | "slow-2g";
    saveData: boolean;
    downlink?: number;
    rtt?: number;
}

export interface BatteryInfo {
    level: number;
    charging: boolean;
    chargingTime?: number;
    dischargingTime?: number;
}

interface HardwareContextType {
    tier: PerformanceTier;
    network: NetworkInfo | null;
    battery: BatteryInfo | null;
    isSimulating: boolean;
    simulateTier: (tier: PerformanceTier | null) => void;
    simulateBattery: (val: number | null) => void;
    simulateNetwork: (type: NetworkInfo['effectiveType'] | null) => void;
}

const HardwareContext = createContext<HardwareContextType | null>(null);

export function HardwareOracleProvider({ children }: { children: ReactNode }) {
    const [network, setNetwork] = useState<NetworkInfo | null>(null);
    const [battery, setBattery] = useState<BatteryInfo | null>(null);

    // Simulation state
    const [simulatedTier, setSimulatedTier] = useState<PerformanceTier | null>(null);
    const [simulatedBatteryLevel, setSimulatedBatteryLevel] = useState<number | null>(null);
    const [simulatedNetworkType, setSimulatedNetworkType] = useState<NetworkInfo['effectiveType'] | null>(null);

    // 1. Network Interface API Monitor
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nav = navigator as any;
        const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

        if (connection) {
            const updateNetwork = () => {
                setNetwork({
                    effectiveType: connection.effectiveType,
                    saveData: connection.saveData,
                    downlink: connection.downlink,
                    rtt: connection.rtt
                });
            };

            updateNetwork();
            connection.addEventListener("change", updateNetwork);
            return () => connection.removeEventListener("change", updateNetwork);
        }
    }, []);

    // 2. Battery Status API Monitor
    useEffect(() => {
        if ("getBattery" in navigator) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let batteryManager: any = null;

            const updateBattery = () => {
                if (batteryManager) {
                    setBattery({
                        level: batteryManager.level,
                        charging: batteryManager.charging,
                        chargingTime: batteryManager.chargingTime,
                        dischargingTime: batteryManager.dischargingTime,
                    });
                }
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (navigator as any).getBattery().then((bm: any) => {
                batteryManager = bm;
                updateBattery();

                batteryManager.addEventListener("levelchange", updateBattery);
                batteryManager.addEventListener("chargingchange", updateBattery);
                batteryManager.addEventListener("chargingtimechange", updateBattery);
                batteryManager.addEventListener("dischargingtimechange", updateBattery);
            });

            return () => {
                if (batteryManager) {
                    batteryManager.removeEventListener("levelchange", updateBattery);
                    batteryManager.removeEventListener("chargingchange", updateBattery);
                    batteryManager.removeEventListener("chargingtimechange", updateBattery);
                    batteryManager.removeEventListener("dischargingtimechange", updateBattery);
                }
            };
        }
    }, []);

    // 3. Compute the active tier
    let activeTier: PerformanceTier = "HIGH";

    const activeNetworkType = simulatedNetworkType || network?.effectiveType;
    const activeDataSaver = network?.saveData || false;
    const activeBatteryLevel = simulatedBatteryLevel ?? battery?.level;
    const isCharging = battery?.charging ?? true; // Optimistic default

    if (simulatedTier) {
        activeTier = simulatedTier;
    } else {
        // Real-world logic

        // ECO TIER: Low battery and not charging, or Data Saver is explicitly ON
        if ((activeBatteryLevel !== undefined && activeBatteryLevel < 0.2 && !isCharging) || activeDataSaver) {
            activeTier = "ECO";
        }
        // MEDIUM TIER: Slow network connection, or Battery is < 40%
        else if (activeNetworkType === '2g' || activeNetworkType === 'slow-2g' || activeNetworkType === '3g' ||
            (activeBatteryLevel !== undefined && activeBatteryLevel < 0.4 && !isCharging)) {
            activeTier = "MEDIUM";
        }
        // HIGH TIER: Good network, sufficient battery
        else {
            activeTier = "HIGH";
        }
    }

    const value: HardwareContextType = {
        tier: activeTier,
        battery: battery,
        network: network,
        isSimulating: simulatedTier !== null || simulatedBatteryLevel !== null || simulatedNetworkType !== null,
        simulateTier: setSimulatedTier,
        simulateBattery: setSimulatedBatteryLevel,
        simulateNetwork: setSimulatedNetworkType
    };

    return (
        <HardwareContext.Provider value={value}>
            {children}
        </HardwareContext.Provider>
    );
}

export const useHardwareOracle = () => {
    const context = useContext(HardwareContext);
    if (!context) {
        throw new Error("useHardwareOracle must be used within a HardwareOracleProvider");
    }
    return context;
};
