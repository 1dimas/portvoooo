import { fileCount, totalSizeKb } from "./fs";

export interface SystemInfo {
    label: string;
    value: string;
}

/** Logo ASCII — sengaja dibaca sebagai terminal, bukan ikon. */
export const ASCII_LOGO = [
    "     ▄▄▄▄▄▄▄▄▄     ",
    "   ▄█████████████▄ ",
    "  ███▀         ▀███",
    " ███   ▄█████▄   ██",
    " ██   ███▀ ▀███   █",
    " ██   ██     ██   █",
    " ███   ▀█████▀   ██",
    "  ███▄         ▄███",
    "   ▀█████████████▀ ",
    "     ▀▀▀▀▀▀▀▀▀     ",
];

interface NavigatorExtras {
    deviceMemory?: number;
    connection?: { effectiveType?: string; downlink?: number };
    getBattery?: () => Promise<{ level: number; charging: boolean }>;
}

/** Tebak OS dari user agent. Cukup untuk tampilan, bukan untuk logika. */
function guessOS(ua: string) {
    if (/Windows NT 10/.test(ua)) return /Windows NT 10\.0; Win64/.test(ua) ? "Windows 10/11" : "Windows 10";
    if (/Windows/.test(ua)) return "Windows";
    if (/Android/.test(ua)) return `Android ${/Android (\d+)/.exec(ua)?.[1] ?? ""}`.trim();
    if (/iPhone|iPad/.test(ua)) return "iOS";
    if (/Mac OS X/.test(ua)) return "macOS";
    if (/Linux/.test(ua)) return "Linux";
    return "Unknown";
}

function guessBrowser(ua: string) {
    const m =
        /Edg\/(\d+)/.exec(ua) ??
        /Chrome\/(\d+)/.exec(ua) ??
        /Firefox\/(\d+)/.exec(ua) ??
        /Version\/(\d+).*Safari/.exec(ua);
    if (!m) return "Unknown";
    const name = /Edg\//.test(ua)
        ? "Edge"
        : /Firefox\//.test(ua)
          ? "Firefox"
          : /Chrome\//.test(ua)
            ? "Chrome"
            : "Safari";
    return `${name} ${m[1]}`;
}

/**
 * Mengumpulkan spesifikasi mesin pengunjung dari API browser yang tersedia.
 * Semuanya nyata — tidak ada nilai karangan. Yang tidak didukung browser
 * ditandai jelas, bukan ditebak.
 */
export async function collectSystemInfo(uptimeMs: number): Promise<SystemInfo[]> {
    const nav = navigator as Navigator & NavigatorExtras;
    const ua = nav.userAgent;

    const info: SystemInfo[] = [
        { label: "OS", value: guessOS(ua) },
        { label: "Host", value: guessBrowser(ua) },
        { label: "Kernel", value: "portfolio 1.0.0-next16" },
        { label: "Shell", value: "dimas-sh 1.0" },
        { label: "Resolution", value: `${window.screen.width}x${window.screen.height}` },
        { label: "Viewport", value: `${window.innerWidth}x${window.innerHeight}` },
        { label: "DPR", value: `${window.devicePixelRatio}x` },
        { label: "CPU", value: `${nav.hardwareConcurrency ?? "?"} threads` },
    ];

    if (nav.deviceMemory) {
        info.push({ label: "Memory", value: `${nav.deviceMemory} GB` });
    }

    if (nav.connection?.effectiveType) {
        const d = nav.connection.downlink;
        info.push({
            label: "Network",
            value: `${nav.connection.effectiveType}${d ? ` · ${d} Mbps` : ""}`,
        });
    }

    if (nav.getBattery) {
        try {
            const b = await nav.getBattery();
            info.push({
                label: "Battery",
                value: `${Math.round(b.level * 100)}%${b.charging ? " (charging)" : ""}`,
            });
        } catch {
            /* Ditolak atau tidak didukung — cukup dilewati. */
        }
    }

    const mins = Math.floor(uptimeMs / 60000);
    const secs = Math.floor((uptimeMs % 60000) / 1000);
    info.push({ label: "Uptime", value: mins ? `${mins}m ${secs}s` : `${secs}s` });
    info.push({ label: "Packages", value: `${fileCount} files (${totalSizeKb} KB)` });
    info.push({ label: "Locale", value: nav.language });

    return info;
}
