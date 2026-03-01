"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "lenis/react";

export default function InfiniteLoopTrigger() {
    const triggerRef = useRef<HTMLDivElement>(null);
    const lenis = useLenis();

    useEffect(() => {
        if (!triggerRef.current || !lenis) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Instantly jump back to top without smooth animation
                    lenis.scrollTo(0, { immediate: true });
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(triggerRef.current);

        return () => observer.disconnect();
    }, [lenis]);

    return (
        <div
            ref={triggerRef}
            className="h-4 w-full"
            aria-hidden="true"
        />
    );
}
