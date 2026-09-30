"use client";

import ScrambleText from "@/components/ScrambleText";

interface SectionCommandProps {
    /** Perintah yang ditampilkan, tanpa tanda `$` */
    command: string;
    /** Nama section dalam bahasa manusia — inilah yang dibacakan screen reader */
    label: string;
}

/**
 * Label section sebagai baris perintah terminal.
 *
 * Perintahnya ditandai `aria-hidden`: bagi pembaca layar, "dolar en-pe-em list
 * strip strip depth sama dengan nol" itu derau, bukan informasi. Yang dibacakan
 * tetap nama sectionnya.
 */
export default function SectionCommand({ command, label }: SectionCommandProps) {
    return (
        <span className="inline-flex items-center gap-2 border-2 border-border bg-bg-card px-3 py-2 font-mono text-xs md:text-sm cursor-default">
            <span className="sr-only">{label}</span>

            <span aria-hidden className="text-accent font-bold">
                $
            </span>
            <span aria-hidden className="text-text-primary" lang="en">
                <ScrambleText text={command} />
            </span>
            {/* Kursor terminal. Animasinya otomatis mati lewat blok
                prefers-reduced-motion global di globals.css. */}
            <span aria-hidden className="w-[7px] h-[1.1em] bg-accent animate-pulse" />
        </span>
    );
}
