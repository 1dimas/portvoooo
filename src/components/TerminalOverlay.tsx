"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendAIMessage } from "@/lib/ai/ai";
import * as vfs from "@/lib/terminal/fs";
import { ASCII_LOGO, collectSystemInfo } from "@/lib/terminal/neofetch";
import { SCHEMES, applyScheme, resetScheme, restoreScheme } from "@/lib/terminal/themes";

const COMMAND_NAMES = [
    "help", "whoami", "skills", "projects", "contact", "lab", "ask",
    "ls", "cd", "cat", "pwd", "tree", "find", "uname", "neofetch", "theme",
    "clear", "exit",
];

export default function TerminalOverlay() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<{ command: string; output: React.ReactNode }[]>([
        {
            command: "",
            output: "Welcome to DIMAS-OS v1.0.0\nType 'help' for a list of commands."
        }
    ]);
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Shell state
    const [cwd, setCwd] = useState("");            // "" = ~  (root src/)
    const commandLog = useRef<string[]>([]);       // riwayat untuk panah atas/bawah
    const logCursor = useRef(-1);                  // -1 = sedang mengetik baris baru
    const draft = useRef("");                      // simpan ketikan saat menelusuri riwayat
    const startedAt = useRef(0);            // diisi saat mount, bukan saat render
    const tabHits = useRef<{ prefix: string; list: string[]; i: number } | null>(null);

    const prompt = cwd ? `~/${cwd}` : "~";

    // Kembalikan colorscheme pilihan pengunjung dari kunjungan sebelumnya.
    useEffect(() => {
        startedAt.current = Date.now();
        restoreScheme();
    }, []);

    // Handle Ctrl+` (backtick) or Ctrl+J to avoid Chrome URL bar hijacking Ctrl+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === "`" || e.key === "j" || e.key === "k")) {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };

        const handleOpenTerminal = () => setIsOpen(true);

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("open-terminal", handleOpenTerminal);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("open-terminal", handleOpenTerminal);
        };
    }, [isOpen]);

    // Keep focus on input
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Auto scroll to bottom
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [history, isOpen]);


    /** Tombol-tombol yang dicari orang dalam lima detik pertama di sebuah shell. */
    const handleInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const log = commandLog.current;

        if (e.key === "ArrowUp") {
            e.preventDefault();
            if (!log.length) return;
            if (logCursor.current === -1) draft.current = input;
            logCursor.current = Math.min(logCursor.current + 1, log.length - 1);
            setInput(log[log.length - 1 - logCursor.current]);
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (logCursor.current <= 0) {
                logCursor.current = -1;
                setInput(draft.current);
                return;
            }
            logCursor.current -= 1;
            setInput(log[log.length - 1 - logCursor.current]);
            return;
        }

        if (e.key === "Tab") {
            e.preventDefault();
            const parts = input.split(" ");
            const last = parts[parts.length - 1];

            // Argumen pertama = nama perintah; sisanya = path.
            const candidates =
                parts.length === 1
                    ? COMMAND_NAMES.filter((c) => c.startsWith(last))
                    : vfs.completePath(cwd, last);

            if (!candidates.length) return;

            // Tab berulang menelusuri kandidat, seperti shell sungguhan.
            if (tabHits.current && tabHits.current.prefix === last) {
                tabHits.current.i = (tabHits.current.i + 1) % tabHits.current.list.length;
            } else {
                tabHits.current = { prefix: last, list: candidates, i: 0 };
            }

            parts[parts.length - 1] = tabHits.current.list[tabHits.current.i];
            setInput(parts.join(" "));
            return;
        }

        if (e.ctrlKey && e.key === "l") {
            e.preventDefault();
            setHistory([]);
            return;
        }

        if (e.ctrlKey && e.key === "c") {
            e.preventDefault();
            setHistory((prev) => [...prev, { command: input + "^C", output: "" }]);
            setInput("");
            logCursor.current = -1;
            return;
        }

        tabHits.current = null;
    };

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = input.trim().toLowerCase();

        if (cmd) {
            commandLog.current.push(cmd);
        }
        logCursor.current = -1;
        tabHits.current = null;

        let output: React.ReactNode = "";

        if (cmd === "") {
            // Do nothing
        } else if (cmd === "help") {
            output = (
                <div className="flex flex-col gap-1">
                    <span className="text-text-muted">INFO</span>
                    <span className="text-accent">whoami <span className="text-text-muted">- Siapa pemilik situs ini</span></span>
                    <span className="text-accent">skills <span className="text-text-muted">- Tech stack</span></span>
                    <span className="text-accent">projects <span className="text-text-muted">- Karya pilihan</span></span>
                    <span className="text-accent">contact <span className="text-text-muted">- Cara menghubungi</span></span>
                    <span className="text-accent">neofetch <span className="text-text-muted">- Spesifikasi mesin ANDA</span></span>
                    <span className="text-accent">uname -a <span className="text-text-muted">- Info kernel</span></span>

                    <span className="text-text-muted mt-2">FILESYSTEM <span className="text-text-muted/60">(source code asli)</span></span>
                    <span className="text-accent">ls [path] <span className="text-text-muted">- Daftar isi direktori</span></span>
                    <span className="text-accent">cd &lt;path&gt; <span className="text-text-muted">- Pindah direktori</span></span>
                    <span className="text-accent">cat &lt;file&gt; <span className="text-text-muted">- Info sebuah file</span></span>
                    <span className="text-accent">tree [path] <span className="text-text-muted">- Pohon direktori</span></span>
                    <span className="text-accent">find &lt;teks&gt; <span className="text-text-muted">- Cari file</span></span>
                    <span className="text-accent">pwd <span className="text-text-muted">- Direktori saat ini</span></span>

                    <span className="text-text-muted mt-2">LAINNYA</span>
                    <span className="text-accent">theme [nama] <span className="text-text-muted">- Ganti colorscheme</span></span>
                    <span className="text-accent">lab <span className="text-text-muted">- Buka halaman Lab</span></span>
                    <span className="text-accent">ask &lt;tanya&gt; <span className="text-text-muted">- Tanya asisten AI</span></span>
                    <span className="text-accent">clear / exit</span>

                    <span className="text-text-muted mt-2">↑ ↓ riwayat · Tab autocomplete · Ctrl+L clear · Ctrl+C batal</span>
                </div>
            );
        } else if (cmd === "whoami") {
            output = (
                <div className="flex flex-col gap-4 text-gray-300 leading-relaxed max-w-2xl">
                    <p>Halo! Kenalin, saya <span className="text-accent font-bold">Dimas Dwi Ananda Putra (Dimm)</span>, Software Developer muda yang siap jadi partner digital bisnis Anda.</p>
                    <p>Selain sibuk sekolah di jurusan Rekayasa Perangkat Lunak, saya punya passion besar ngebantu UMKM naik kelas lewat teknologi. Saya terbiasa ngulik website dari nol sampai jadi. Kalau lagi nggak di depan layar, biasanya saya lagi gowes cari udara segar, nonton anime detektif, atau ngeracik kopi andalan yang rasanya nggak kalah sama buatan cafe.</p>
                    <p>Punya bisnis yang butuh website atau lagi cari rekanan IT yang asik diajak diskusi? Sini, ngobrol santai sama saya!<br />
                        📞 <a href="https://wa.me/628998076063" className="text-blue-400 hover:underline">08998076063</a> | ✉️ <a href="mailto:dimasdwianandaputra@gmail.com" className="text-blue-400 hover:underline">dimasdwianandaputra@gmail.com</a></p>
                </div>
            );
        } else if (cmd === "skills") {
            output = (
                <div className="flex flex-col gap-1 border-l-2 border-accent pl-4">
                    <span className="font-bold text-white mb-2">TECH STACK:</span>
                    <span className="text-green-400">Frontend: React, Next.js, Framer Motion, Tailwind CSS</span>
                    <span className="text-blue-400">Backend: Node.js, NestJS, Express, PHP</span>
                    <span className="text-yellow-400">Database: PostgreSQL, MySQL, Prisma ORM</span>
                </div>
            );
        } else if (cmd === "projects") {
            output = (
                <div className="flex flex-col gap-2">
                    <span className="font-bold text-white">FEATURED PROJECTS:</span>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="border border-border p-3">
                            <span className="text-accent font-bold">1. Website Company Profile</span> - Brutalist design untuk memukau calon klien UMKM.
                        </div>
                        <div className="border border-border p-3">
                            <span className="text-accent font-bold">2. SportZone</span> - Platform E-Commerce dengan interaktivitas tinggi.
                        </div>
                        <div className="border border-border p-3">
                            <span className="text-accent font-bold">3. Yomu</span> - Sistem Perpustakaan Digital dengan real-time chat & notifikasi.
                        </div>
                    </div>
                </div>
            );
        } else if (cmd === "contact") {
            output = (
                <div className="flex flex-col gap-1">
                    <span className="font-bold text-white mb-2">INITIATING SECURE CONNECTION...</span>
                    <span>Email: <a href="mailto:dimasdwianandaputra@gmail.com" className="text-blue-400 hover:underline">dimasdwianandaputra@gmail.com</a></span>
                    <span>WhatsApp: <a href="https://wa.me/628998076063" className="text-green-400 hover:underline">08998076063</a></span>
                    <span>LinkedIn: <a href="https://www.linkedin.com/in/dimas-dwi-ananda-putra-4224a9298" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">linkedin.com/in/dimas-dwi-ananda-putra</a></span>
                    <span>GitHub: <a href="https://github.com/1dimas" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">github.com/1dimas</a></span>
                    <span className="text-text-muted italic mt-2">Status: Waiting for ping...</span>
                </div>
            );
        } else if (cmd === "lab") {
            output = (
                <div className="flex flex-col gap-1">
                    <span className="text-accent font-bold">Initiating warp sequence to /lab...</span>
                    <span className="text-text-primary">Prepare for experimental UI and interactions.</span>
                </div>
            );
            setTimeout(() => {
                window.location.href = "/lab";
            }, 1200);
        } else if (cmd === "sudo") {
            output = (
                <div className="mt-4 flex flex-col gap-2 items-start">
                    <span className="text-red-500 font-bold uppercase tracking-widest text-lg">⚠️ SECURITY BREACH DETECTED ⚠️</span>
                    <span className="text-text-primary">Initiating countermeasures...</span>
                    <div className="w-full max-w-[400px] aspect-video mt-2 border-2 border-red-500 rounded bg-black overflow-hidden relative shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0&modestbranding=1&rel=0"
                            title="Never Gonna Give You Up"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0"
                        ></iframe>
                    </div>
                </div>
            );
        } else if (cmd === "clear") {
            setHistory([]);
            setInput("");
            return;
        } else if (cmd === "exit") {
            setIsOpen(false);
            setInput("");
            return;
        } else if (cmd.startsWith("ask ")) {
            const question = cmd.slice(4).trim();
            if (!question) {
                setHistory(prev => [...prev, { command: cmd, output: "Usage: ask <your question>" }]);
                setInput("");
                return;
            }
            setHistory(prev => [...prev, { command: cmd, output: "✦ thinking..." }]);
            setInput("");

            sendAIMessage(question, "terminal").then(response => {
                setHistory(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                        command: cmd,
                        output: (
                            <div className="flex flex-col gap-1">
                                <span className="text-accent text-xs font-bold">✦ AI RESPONSE:</span>
                                <span className="text-gray-300">{response.reply}</span>
                            </div>
                        ),
                    };
                    return updated;
                });
            });
            return;
        } else if (cmd === "pwd") {
            output = `~/${cwd}`.replace(/\/$/, "");
        } else if (cmd === "ls" || cmd.startsWith("ls ")) {
            const target = vfs.resolvePath(cwd, cmd.slice(2).trim());
            if (!vfs.isDir(target)) {
                output = `ls: cannot access '${cmd.slice(2).trim()}': No such file or directory`;
            } else {
                const { dirs, files } = vfs.listDir(target);
                output = (
                    <div className="flex flex-wrap gap-x-6 gap-y-1">
                        {dirs.map((d) => (
                            <span key={d} className="text-blue-400 font-bold">{d}/</span>
                        ))}
                        {files.map((f) => (
                            <span key={f.path} className="text-gray-300">{f.name}</span>
                        ))}
                    </div>
                );
            }
        } else if (cmd.startsWith("cd")) {
            const arg = cmd.slice(2).trim();
            const target = vfs.resolvePath(cwd, arg);
            if (vfs.isDir(target)) {
                setCwd(target);
                output = "";
            } else {
                output = `cd: ${arg}: Not a directory`;
            }
        } else if (cmd.startsWith("cat ")) {
            const arg = cmd.slice(4).trim();
            const target = vfs.resolvePath(cwd, arg);
            const f = vfs.getFile(target);
            if (!f) {
                output = vfs.isDir(target)
                    ? `cat: ${arg}: Is a directory`
                    : `cat: ${arg}: No such file or directory`;
            } else {
                output = (
                    <div className="flex flex-col gap-1">
                        <span className="text-accent">{f.path}</span>
                        <span className="text-text-muted">
                            {f.sizeKb} KB · {f.extension || "no extension"}
                        </span>
                        <span className="text-gray-400 mt-1">
                            Isi file tidak disertakan di bundle — buka di GitHub untuk membacanya.
                        </span>
                    </div>
                );
            }
        } else if (cmd === "tree" || cmd.startsWith("tree ")) {
            const target = vfs.resolvePath(cwd, cmd.slice(4).trim());
            output = vfs.isDir(target)
                ? <span className="text-gray-300">{vfs.treeString(target).join("\n")}</span>
                : `tree: ${cmd.slice(4).trim()}: No such directory`;
        } else if (cmd.startsWith("find ")) {
            const needle = cmd.slice(5).trim();
            const hits = vfs.allPaths().filter((p) => p.includes(needle));
            output = hits.length
                ? <span className="text-gray-300">{hits.slice(0, 40).join("\n")}</span>
                : `find: tidak ada yang cocok dengan '${needle}'`;
        } else if (cmd === "uname" || cmd === "uname -a") {
            output = "portfolio 1.0.0-next16 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Web";
        } else if (cmd === "neofetch") {
            setHistory((prev) => [...prev, { command: cmd, output: "collecting…" }]);
            setInput("");
            collectSystemInfo(Date.now() - startedAt.current).then((info) => {
                const rows = Math.max(ASCII_LOGO.length, info.length);
                setHistory((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                        command: cmd,
                        output: (
                            <div className="flex gap-6">
                                <pre className="text-accent leading-tight">{ASCII_LOGO.join("\n")}</pre>
                                <div className="flex flex-col leading-tight">
                                    <span className="text-accent font-bold">visitor@portfolio</span>
                                    <span className="text-text-muted">─────────────────</span>
                                    {Array.from({ length: rows - ASCII_LOGO.length + info.length })
                                        .slice(0, info.length)
                                        .map((_, i) => (
                                            <span key={info[i].label}>
                                                <span className="text-accent font-bold">{info[i].label}</span>
                                                <span className="text-text-muted">: </span>
                                                <span className="text-gray-300">{info[i].value}</span>
                                            </span>
                                        ))}
                                </div>
                            </div>
                        ),
                    };
                    return updated;
                });
            });
            return;
        } else if (cmd === "theme" || cmd.startsWith("theme ")) {
            const arg = cmd.slice(5).trim();
            if (!arg) {
                output = (
                    <div className="flex flex-col gap-1">
                        <span className="text-text-muted">Usage: theme &lt;nama&gt; | theme reset</span>
                        {Object.values(SCHEMES).map((sc) => (
                            <span key={sc.name}>
                                <span className="text-accent">{sc.name.padEnd(10)}</span>
                                <span className="text-text-muted">{sc.blurb}</span>
                            </span>
                        ))}
                    </div>
                );
            } else if (arg === "reset" || arg === "default") {
                resetScheme();
                output = "Colorscheme dikembalikan ke bawaan.";
            } else if (applyScheme(arg)) {
                output = `Colorscheme diganti ke '${arg}'. Tersimpan untuk kunjungan berikutnya.`;
            } else {
                output = `theme: '${arg}' tidak dikenal. Jalankan 'theme' untuk melihat daftarnya.`;
            }
        } else {
            output = `bash: ${cmd.split(" ")[0]}: command not found`;
        }

        if (cmd !== "") {
            setHistory((prev) => [...prev, { command: cmd, output }]);
        }
        setInput("");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto"
                    onClick={(e) => {
                        // Close if clicked outside terminal window
                        if (e.target === e.currentTarget) setIsOpen(false);
                    }}
                >
                    <div className="w-full max-w-3xl bg-[#0c0c0c] border border-text-muted/30 rounded-lg overflow-hidden shadow-2xl font-mono text-sm sm:text-base flex flex-col max-h-[80vh]">
                        {/* Fake Mac/Linux Header */}
                        <div className="bg-[#1a1a1a] px-4 py-2 flex items-center border-b border-text-muted/30">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" onClick={() => setIsOpen(false)} />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <div className="text-text-muted text-xs mx-auto">dimas@portfolio: {prompt}</div>
                        </div>

                        {/* Terminal Body */}
                        <div className="p-4 overflow-y-auto flex-1 text-green-400 whitespace-pre-wrap">
                            {history.map((item, i) => (
                                <div key={i} className="mb-4">
                                    {item.command && (
                                        <div className="flex gap-2">
                                            <span className="text-accent">➜</span>
                                            <span className="text-blue-400">{prompt}</span>
                                            <span className="text-white">{item.command}</span>
                                        </div>
                                    )}
                                    <div className="mt-1 text-gray-300">{item.output}</div>
                                </div>
                            ))}

                            <form onSubmit={handleCommand} className="flex gap-2 mt-2">
                                <span className="text-accent">➜</span>
                                <span className="text-blue-400">{prompt}</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleInputKey}
                                    className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0 p-0"
                                    autoComplete="off"
                                    spellCheck="false"
                                />
                            </form>
                            <div ref={bottomRef} className="h-4" />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
