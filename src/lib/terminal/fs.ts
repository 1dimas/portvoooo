import rawFiles from "@/data/fileTree.json";

export interface FileEntry {
    name: string;
    path: string;
    sizeKb: number;
    extension: string;
}

interface RawFile {
    name: string;
    path: string;
    type: string;
    extension?: string;
    sizeKb?: number;
}

/**
 * Filesystem virtual yang dibangun dari `src/data/fileTree.json` — daftar file
 * asli di `src/`, diregenerasi tiap build oleh `scripts/generate-file-tree.mjs`.
 * Jadi `ls` dan `cat` di terminal menelusuri source code yang sebenarnya,
 * bukan data karangan.
 */
const files: FileEntry[] = (rawFiles as RawFile[])
    .filter((f) => f.type === "file")
    .map((f) => ({
        name: f.name,
        path: f.path.replace(/\\/g, "/"),
        sizeKb: f.sizeKb ?? 0,
        extension: f.extension ?? "",
    }))
    .sort((a, b) => a.path.localeCompare(b.path));

/** Semua direktori yang tersirat dari path file. */
const dirs = new Set<string>([""]);
for (const f of files) {
    const parts = f.path.split("/");
    for (let i = 1; i < parts.length; i++) {
        dirs.add(parts.slice(0, i).join("/"));
    }
}

export function isDir(path: string) {
    return dirs.has(normalize(path));
}

export function isFile(path: string) {
    const p = normalize(path);
    return files.some((f) => f.path === p);
}

export function getFile(path: string) {
    const p = normalize(path);
    return files.find((f) => f.path === p);
}

/** Bersihkan `.`, `..`, slash ganda. String kosong = root (`~`). */
export function normalize(path: string) {
    const out: string[] = [];
    for (const part of path.split("/")) {
        if (!part || part === ".") continue;
        if (part === "..") out.pop();
        else out.push(part);
    }
    return out.join("/");
}

/** Gabungkan direktori kerja dengan argumen, tangani path absolut dan `~`. */
export function resolvePath(cwd: string, arg: string) {
    if (!arg || arg === "~") return "";
    if (arg.startsWith("~/")) return normalize(arg.slice(2));
    if (arg.startsWith("/")) return normalize(arg.slice(1));
    return normalize(cwd ? `${cwd}/${arg}` : arg);
}

export interface DirListing {
    dirs: string[];
    files: FileEntry[];
}

export function listDir(path: string): DirListing {
    const base = normalize(path);
    const prefix = base ? `${base}/` : "";
    const childDirs = new Set<string>();
    const childFiles: FileEntry[] = [];

    for (const f of files) {
        if (!f.path.startsWith(prefix)) continue;
        const rest = f.path.slice(prefix.length);
        const slash = rest.indexOf("/");
        if (slash === -1) childFiles.push(f);
        else childDirs.add(rest.slice(0, slash));
    }

    return { dirs: [...childDirs].sort(), files: childFiles };
}

/** Kandidat untuk autocomplete Tab pada argumen path. */
export function completePath(cwd: string, partial: string): string[] {
    const slash = partial.lastIndexOf("/");
    const dirPart = slash === -1 ? "" : partial.slice(0, slash);
    const leaf = slash === -1 ? partial : partial.slice(slash + 1);
    const target = resolvePath(cwd, dirPart);
    if (!isDir(target)) return [];

    const { dirs: d, files: f } = listDir(target);
    const names = [...d.map((n) => `${n}/`), ...f.map((n) => n.name)];
    const hits = names.filter((n) => n.startsWith(leaf));
    return hits.map((n) => (slash === -1 ? n : `${dirPart}/${n}`));
}

/** Pohon direktori bergaya `tree`. */
export function treeString(path: string, maxDepth = 3): string[] {
    const lines: string[] = [];
    const walk = (dir: string, prefix: string, depth: number) => {
        if (depth > maxDepth) return;
        const { dirs: d, files: f } = listDir(dir);
        const entries = [...d.map((n) => ({ name: n, dir: true })), ...f.map((n) => ({ name: n.name, dir: false }))];
        entries.forEach((entry, i) => {
            const last = i === entries.length - 1;
            lines.push(`${prefix}${last ? "└── " : "├── "}${entry.name}${entry.dir ? "/" : ""}`);
            if (entry.dir) {
                walk(dir ? `${dir}/${entry.name}` : entry.name, `${prefix}${last ? "    " : "│   "}`, depth + 1);
            }
        });
    };
    walk(normalize(path), "", 1);
    return lines;
}

export const fileCount = files.length;
export const totalSizeKb = Math.round(files.reduce((a, f) => a + f.sizeKb, 0));

/** Path lengkap semua file — dipakai `find`. */
export function allPaths() {
    return files.map((f) => f.path);
}
