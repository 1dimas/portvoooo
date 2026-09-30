"use client";

import { useEffect, useState } from "react";

/**
 * Mounted-guard: render pertama di klien harus identik dengan HTML dari server,
 * baru setelah hydration selesai komponen boleh memakai API browser
 * (window, matchMedia, Web Audio, WebGL, dan sejenisnya).
 *
 * Dipakai lewat `if (!useMounted()) return null;` — pola yang sama dengan yang
 * direkomendasikan next-themes.
 */
export function useMounted() {
    const [mounted, setMounted] = useState(false);

    // Disengaja: menandai "hydration sudah selesai" memang hanya bisa lewat effect.
    // Justru inilah yang mencegah cascading render akibat mismatch server/klien.
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    return mounted;
}
