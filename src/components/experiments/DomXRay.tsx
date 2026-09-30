"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface HoveredLayer {
    tag: string;
    classes: string;
    depth: number;
    size: string;
}

interface DomXRayProps {
    children: React.ReactNode;
    /** Jarak antar lapisan dalam px */
    spacing: number;
    /** 0 = rata, 1 = terbuka penuh */
    exploded: number;
    showOutlines: boolean;
    onHover?: (layer: HoveredLayer | null) => void;
}

/**
 * Membedah DOM asli menjadi lapisan 3D.
 *
 * Tidak ada rekonstruksi WebGL di sini: setiap elemen nyata diberi
 * `translateZ` secara bertingkat, dan karena transform anak menumpuk di atas
 * induknya, kedalaman visual otomatis mengikuti kedalaman DOM yang sebenarnya.
 * Konsekuensinya elemen tetap hidup — masih bisa di-hover dan dibaca gayanya.
 */
export default function DomXRay({
    children,
    spacing,
    exploded,
    showOutlines,
    onHover,
}: DomXRayProps) {
    const stageRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: -18, y: -24 });
    const dragRef = useRef<{ x: number; y: number } | null>(null);

    // Terapkan kedalaman ke setiap elemen nyata di dalam panggung.
    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;

        const elements = Array.from(stage.querySelectorAll<HTMLElement>("*"));
        const z = spacing * exploded;

        for (const el of elements) {
            el.style.transformStyle = "preserve-3d";
            el.style.transform = z ? `translateZ(${z}px)` : "";
            el.style.transition = "transform 420ms cubic-bezier(0.16, 1, 0.3, 1)";
            el.style.outline = showOutlines && z ? "1px solid var(--color-accent)" : "";
            el.style.outlineOffset = "0px";
        }

        return () => {
            for (const el of elements) {
                el.style.transform = "";
                el.style.outline = "";
            }
        };
    }, [spacing, exploded, showOutlines, children]);

    const handlePointerDown = (e: React.PointerEvent) => {
        dragRef.current = { x: e.clientX, y: e.clientY };
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        const start = dragRef.current;
        if (!start) return;
        setRotation((prev) => ({
            x: Math.max(-80, Math.min(80, prev.x - (e.clientY - start.y) * 0.4)),
            y: Math.max(-80, Math.min(80, prev.y + (e.clientX - start.x) * 0.4)),
        }));
        dragRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
        dragRef.current = null;
    };

    const handleMouseOver = useCallback(
        (e: React.MouseEvent) => {
            if (!onHover) return;
            const el = e.target as HTMLElement;
            if (!stageRef.current?.contains(el) || el === stageRef.current) return;

            let depth = 0;
            let node: HTMLElement | null = el;
            while (node && node !== stageRef.current) {
                depth += 1;
                node = node.parentElement;
            }

            const rect = el.getBoundingClientRect();
            onHover({
                tag: el.tagName.toLowerCase(),
                classes: el.className?.toString().split(/\s+/).filter(Boolean).slice(0, 4).join(" ") || "—",
                depth,
                size: `${Math.round(rect.width)}×${Math.round(rect.height)}`,
            });
        },
        [onHover]
    );

    return (
        <div
            className="relative h-full w-full overflow-hidden bg-[#050505] cursor-grab active:cursor-grabbing select-none"
            style={{ perspective: "1800px" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onMouseOver={handleMouseOver}
            onMouseLeave={() => onHover?.(null)}
        >
            {/* Grid lantai sebagai acuan ruang */}
            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none opacity-[0.12]"
                style={{
                    backgroundImage:
                        "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />

            <div className="absolute inset-0 flex items-center justify-center p-8">
                <div
                    ref={stageRef}
                    style={{
                        transformStyle: "preserve-3d",
                        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                        transition: "transform 120ms linear",
                    }}
                >
                    {children}
                </div>
            </div>

            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-widest text-text-muted/60 pointer-events-none">
                seret untuk memutar
            </p>
        </div>
    );
}
