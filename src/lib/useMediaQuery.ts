"use client";

import { useEffect, useState } from "react";

/**
 * Membaca media query lewat listener, bukan sekali saat render.
 * Nilai awal selalu `false` supaya render pertama di klien identik dengan
 * HTML server (tidak ada hydration mismatch), lalu disinkronkan setelah mount.
 */
export function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia(query);
        const sync = (e: MediaQueryList | MediaQueryListEvent) => setMatches(e.matches);
        sync(mq);
        mq.addEventListener("change", sync);
        return () => mq.removeEventListener("change", sync);
    }, [query]);

    return matches;
}

/** Perangkat sentuh: tidak punya hover dan pointer-nya kasar. */
export function useIsTouchDevice() {
    return useMediaQuery("(hover: none) and (pointer: coarse)");
}
