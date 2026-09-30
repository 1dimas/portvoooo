/**
 * Colorscheme yang bisa diganti dari terminal — *ricing*, kebiasaan yang sangat
 * dikenali pengguna Linux.
 *
 * Bekerja dengan menimpa lapisan `--theme-*` di `globals.css`. Lapisan
 * `--color-*` di atasnya tidak disentuh, jadi seluruh situs ikut berubah tanpa
 * satu pun komponen perlu tahu soal tema.
 */

export interface Scheme {
    name: string;
    blurb: string;
    vars: Record<string, string>;
}

/** Hanya variabel yang menentukan karakter warna; sisanya diwariskan. */
function scheme(
    name: string,
    blurb: string,
    bg: string,
    card: string,
    text: string,
    secondary: string,
    muted: string,
    accent: string,
    accentLight: string,
    border: string
): Scheme {
    return {
        name,
        blurb,
        vars: {
            "--theme-bg-primary": bg,
            "--theme-bg-secondary": card,
            "--theme-bg-tertiary": card,
            "--theme-bg-card": card,
            "--theme-bg-card-hover": card,
            "--theme-text-primary": text,
            "--theme-text-secondary": secondary,
            "--theme-text-muted": muted,
            "--theme-accent": accent,
            "--theme-accent-light": accentLight,
            "--theme-accent-dark": accent,
            "--theme-cyan": accent,
            "--theme-gradient-start": accent,
            "--theme-gradient-mid": accentLight,
            "--theme-gradient-end": accent,
            "--theme-border": border,
            "--theme-border-hover": accent,
        },
    };
}

export const SCHEMES: Record<string, Scheme> = {
    gruvbox: scheme(
        "gruvbox", "hangat, retro, kesayangan pengguna Vim",
        "#1d2021", "#282828", "#ebdbb2", "#d5c4a1", "#928374",
        "#fabd2f", "#fe8019", "rgba(235,219,178,0.18)"
    ),
    dracula: scheme(
        "dracula", "ungu gelap, kontras tinggi",
        "#282a36", "#343746", "#f8f8f2", "#bd93f9", "#6272a4",
        "#ff79c6", "#8be9fd", "rgba(248,248,242,0.18)"
    ),
    amber: scheme(
        "amber", "monitor CRT fosfor amber",
        "#0c0700", "#140d02", "#ffb000", "#cc8c00", "#7a5400",
        "#ffb000", "#ffd166", "rgba(255,176,0,0.22)"
    ),
    matrix: scheme(
        "matrix", "fosfor hijau, terminal paling klise sedunia",
        "#000000", "#020a02", "#33ff33", "#22aa22", "#116611",
        "#33ff33", "#88ff88", "rgba(51,255,51,0.22)"
    ),
    nord: scheme(
        "nord", "biru arktik, dingin dan tenang",
        "#2e3440", "#3b4252", "#eceff4", "#d8dee9", "#7b88a1",
        "#88c0d0", "#8fbcbb", "rgba(236,239,244,0.18)"
    ),
    mono: scheme(
        "mono", "hitam putih murni, tanpa ampun",
        "#000000", "#0a0a0a", "#ffffff", "#b0b0b0", "#666666",
        "#ffffff", "#e0e0e0", "rgba(255,255,255,0.22)"
    ),
};

const STORAGE_KEY = "terminal-scheme";

export function applyScheme(key: string) {
    const s = SCHEMES[key];
    if (!s) return false;
    for (const [prop, value] of Object.entries(s.vars)) {
        document.documentElement.style.setProperty(prop, value);
    }
    try {
        localStorage.setItem(STORAGE_KEY, key);
    } catch {
        /* Mode privat: tema tetap berlaku untuk sesi ini. */
    }
    return true;
}

export function resetScheme() {
    for (const s of Object.values(SCHEMES)) {
        for (const prop of Object.keys(s.vars)) {
            document.documentElement.style.removeProperty(prop);
        }
    }
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        /* abaikan */
    }
}

/** Dipanggil setelah mount supaya pilihan tema bertahan antar kunjungan. */
export function restoreScheme() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && SCHEMES[saved]) applyScheme(saved);
    } catch {
        /* abaikan */
    }
}
