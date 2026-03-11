"use client";

import React, { ReactNode } from "react";
import { useHardwareOracle } from "./useHardwareOracle";

interface AdaptiveWrapperProps {
    children: ReactNode;
    fallback?: ReactNode; // Optional light-weight component to render instead
    disableMotionOnMedium?: boolean; // Whether to shut down animations even on Medium tier
}

export default function AdaptiveWrapper({
    children,
    fallback,
    disableMotionOnMedium = false
}: AdaptiveWrapperProps) {
    const { tier } = useHardwareOracle();

    // ECO Tier: Always use fallback if provided, or render children starkly stripping complex effects
    if (tier === "ECO") {
        if (fallback) {
            return <>{fallback}</>;
        }

        // Return raw children but wrapped in a data attribute we can target with global CSS
        // to forcefully disable animations, transitions, and reduce opacity/filters
        return (
            <div data-adaptive-tier="eco" style={{ animation: 'none !important', transition: 'none !important' }}>
                {children}
            </div>
        );
    }

    // MEDIUM Tier: Might turn off specific heavy animations
    if (tier === "MEDIUM" && disableMotionOnMedium) {
        if (fallback) return <>{fallback}</>;

        return (
            <div data-adaptive-tier="medium">
                {children}
            </div>
        );
    }

    // HIGH Tier: Render as originally intended
    return (
        <div data-adaptive-tier="high">
            {children}
        </div>
    );
}

// A specialized wrapper for Media (Images/Videos)
export function AdaptiveMedia({
    highResSrc,
    lowResSrc,
    alt,
    className,
    isVideo = false
}: {
    highResSrc: string,
    lowResSrc?: string,
    alt: string,
    className?: string,
    isVideo?: boolean
}) {
    const { tier } = useHardwareOracle();

    if (tier === "ECO" || tier === "MEDIUM") {
        const src = lowResSrc || highResSrc;

        // If it's supposed to be a video, but we are in ECO mode, render an image poster instead 
        // to save battery and network
        if (isVideo) {
            return (
                <div className={`relative flex items-center justify-center bg-gray-900 overflow-hidden ${className}`}>
                    {/* Fallback image instead of video */}
                    <img src={src} alt={alt} className="w-full h-full object-cover opacity-50 grayscale" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-mono text-white/70 bg-black/50 px-2 py-1 rounded">
                            Video Disabled (Eco Mode)
                        </span>
                    </div>
                </div>
            );
        }

        // Standard image, perhaps heavily compressed or blurhashed
        return <img src={src} alt={alt} className={className} loading="lazy" width="100%" height="100%" />;
    }

    if (isVideo) {
        return (
            <video
                src={highResSrc}
                className={className}
                autoPlay
                loop
                muted
                playsInline
            />
        );
    }

    return <img src={highResSrc} alt={alt} className={className} />;
}
