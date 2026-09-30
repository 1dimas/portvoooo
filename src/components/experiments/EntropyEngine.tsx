"use client";

import { useMemo } from "react";

const GLITCH_CHARS = "▓▒░█▄▀■□◆◇╱╲│─┤├┼/\\|_-=+*#@%$&?!<>[]{}";

/**
 * PRNG kecil berbasis seed. Dipakai supaya korupsi teks stabil di dalam satu tick
 * (tidak berkedip acak tiap render) dan tetap deterministik saat SSR.
 */
function seeded(n: number) {
    const x = Math.sin(n) * 43758.5453;
    return x - Math.floor(x);
}

/** Mengganti sebagian karakter dengan simbol rusak. `amount` 0..1 */
function corrupt(text: string, amount: number, seed: number) {
    if (amount <= 0) return text;
    let out = "";
    for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
            out += " ";
            continue;
        }
        if (seeded(seed + i * 31.7) < amount) {
            out += GLITCH_CHARS[Math.floor(seeded(seed + i * 17.3) * GLITCH_CHARS.length)];
        } else {
            out += text[i];
        }
    }
    return out;
}

export interface EntropyEngineProps {
    /** 100 = utuh, 0 = hancur total */
    integrity: number;
    /** Dinaikkan tiap tick agar pola korupsi bergeser */
    tick: number;
    /** Bekukan kedipan untuk pengguna yang meminta minim gerak */
    still?: boolean;
}

/** Satu blok teks yang ikut membusuk. */
function DecayLine({
    text,
    decay,
    tick,
    index,
    className = "",
}: {
    text: string;
    decay: number;
    tick: number;
    index: number;
    className?: string;
}) {
    const seed = index * 1000 + tick;

    // Korupsi karakter mulai terasa setelah integritas turun ~10%.
    const charAmount = Math.max(0, (decay - 0.1) * 0.85);

    // Pergeseran layout: tiap baris punya arah sendiri, makin parah makin jauh.
    const drift = decay > 0.3 ? (seeded(index * 7.1) - 0.5) * (decay - 0.3) * 40 : 0;
    const skew = decay > 0.55 ? (seeded(index * 3.3 + tick * 0.01) - 0.5) * (decay - 0.55) * 6 : 0;

    // Aberasi kromatik: kanal warna mulai terpisah.
    const split = decay > 0.45 ? (decay - 0.45) * 8 : 0;

    return (
        <span
            className={`block whitespace-pre-wrap break-words ${className}`}
            style={{
                transform: `translateX(${drift}px) skewX(${skew}deg)`,
                textShadow: split
                    ? `${split}px 0 rgba(255,0,60,0.55), ${-split}px 0 rgba(0,255,220,0.45)`
                    : undefined,
                opacity: decay > 0.8 ? 1 - (decay - 0.8) * 1.6 : 1,
            }}
        >
            {corrupt(text, charAmount, seed)}
        </span>
    );
}

const DOCUMENT = [
    { text: "> user_profile.dat", kind: "cmd" },
    { text: "  DIMAS DWI ANANDA PUTRA", kind: "head" },
    { text: "  Full Stack Developer", kind: "sub" },
    { text: "", kind: "gap" },
    { text: "> manifest.log", kind: "cmd" },
    {
        text: "  Antarmuka seharusnya terasa hidup — bukan sekadar\n  tampil, tapi merespons, beradaptasi, dan mengingat.",
        kind: "body",
    },
    { text: "", kind: "gap" },
    { text: "> system.status", kind: "cmd" },
    { text: "  [OK] renderer .......... aktif", kind: "ok" },
    { text: "  [OK] memory ............ stabil", kind: "ok" },
    { text: "  [OK] integritas data ... terjaga", kind: "ok" },
    { text: "", kind: "gap" },
    { text: "> catatan", kind: "cmd" },
    {
        text: "  Tidak ada yang dibangun untuk bertahan selamanya.\n  Halaman ini pun tidak.",
        kind: "body",
    },
] as const;

const KIND_CLASS: Record<string, string> = {
    cmd: "text-accent font-bold",
    head: "text-text-primary font-heading text-2xl md:text-4xl tracking-wider uppercase",
    sub: "text-text-secondary",
    body: "text-text-secondary",
    ok: "text-text-muted",
    gap: "",
};

export default function EntropyEngine({ integrity, tick, still = false }: EntropyEngineProps) {
    const decay = useMemo(() => 1 - Math.min(100, Math.max(0, integrity)) / 100, [integrity]);
    const frame = still ? 0 : tick;

    // Seluruh panggung ikut goyah saat kerusakan parah.
    const stageSkew = decay > 0.7 ? (seeded(frame * 0.07) - 0.5) * (decay - 0.7) * 10 : 0;
    const hueShift = decay > 0.5 ? (decay - 0.5) * 60 : 0;

    return (
        <div
            className="relative h-full w-full overflow-hidden bg-[#050505]"
            style={{ filter: hueShift ? `hue-rotate(${hueShift}deg) saturate(${1 + decay})` : undefined }}
        >
            {/* Scanline makin pekat seiring kerusakan */}
            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                    opacity: 0.04 + decay * 0.22,
                    backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.09) 2px, rgba(255,255,255,0.09) 4px)",
                }}
            />

            {/* Garis sobek horizontal, muncul setelah kerusakan menengah */}
            {decay > 0.4 &&
                Array.from({ length: Math.floor((decay - 0.4) * 14) }).map((_, i) => (
                    <div
                        key={i}
                        aria-hidden
                        className="absolute left-0 right-0 z-10 pointer-events-none bg-accent/20"
                        style={{
                            top: `${seeded(i * 5.3 + frame * 0.03) * 100}%`,
                            height: `${1 + seeded(i * 2.1) * 3}px`,
                            transform: `translateX(${(seeded(i * 9.7 + frame * 0.05) - 0.5) * decay * 120}px)`,
                        }}
                    />
                ))}

            <div
                className="relative z-0 h-full w-full overflow-auto p-6 md:p-12 font-mono text-sm md:text-base leading-relaxed"
                style={{ transform: `skewY(${stageSkew}deg)` }}
            >
                <div className="max-w-2xl mx-auto flex flex-col gap-1">
                    {DOCUMENT.map((line, i) =>
                        line.kind === "gap" ? (
                            <span key={i} className="block h-4" />
                        ) : (
                            <DecayLine
                                key={i}
                                text={line.text}
                                decay={decay}
                                tick={frame}
                                index={i}
                                className={KIND_CLASS[line.kind]}
                            />
                        )
                    )}
                </div>
            </div>

            {/* Layar mati total */}
            {integrity <= 0 && (
                <div className="absolute inset-0 z-30 bg-black flex items-center justify-center">
                    <div className="font-mono text-center px-6">
                        <p className="text-accent text-lg md:text-2xl font-bold tracking-widest">
                            SYSTEM INTEGRITY: 0%
                        </p>
                        <p className="text-text-muted text-xs md:text-sm mt-3 tracking-widest uppercase">
                            struktur dokumen hilang — jalankan repair untuk memulihkan
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
