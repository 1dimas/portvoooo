"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Certificate } from "@/data/certificates";

interface CertificateModalProps {
    certificate: Certificate | null;
    isOpen: boolean;
    onClose: () => void;
}

/** Retro/Cyberpunk image component with skeleton loader and hover zoom */
function CertificateImage({ src, alt }: { src: string; alt: string }) {
    // Dipanggil dengan key={src}: ganti gambar = remount, jadi status ikut reset
    // tanpa perlu setState di dalam effect.
    const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

    return (
        <div className="relative w-full aspect-[4/3] md:aspect-auto md:h-[360px] bg-black/40 overflow-hidden flex items-center justify-center border border-border/30 rounded-sm">
            {status === "loading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-bg-card z-10">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                        <span className="text-label font-mono text-text-muted uppercase">LOADING DECRYPTED IMAGE</span>
                    </div>
                </div>
            )}
            {status === "error" && (
                <div className="absolute inset-0 flex items-center justify-center bg-bg-card z-10 px-4">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <span className="text-2xl text-accent">⚠</span>
                        <span className="text-label font-mono text-accent uppercase">DECRYPTION FAILED</span>
                        <span className="text-[10px] font-mono text-text-muted break-all">{src}</span>
                    </div>
                </div>
            )}
            <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, 720px"
                className="object-contain transition-transform duration-500 hover:scale-102"
                onLoad={() => setStatus("loaded")}
                onError={() => setStatus("error")}
            />
            {/* Light scanline effect on image */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%]" />
            {/* Corner accents */}
            <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-text-muted/40" />
            <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-text-muted/40" />
            <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-text-muted/40" />
            <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-text-muted/40" />
        </div>
    );
}

/**
 * Isi modal. Sengaja dipisah dari pembungkusnya: komponen ini hanya ter-mount
 * selama modal terbuka, jadi fase dekripsi dan sisi kartu otomatis segar setiap
 * kali dibuka — tidak perlu effect khusus untuk me-reset keduanya.
 */
function ModalContent({
    certificate,
    onClose,
}: {
    certificate: Certificate;
    onClose: () => void;
}) {
    const [phase, setPhase] = useState<"decrypting" | "revealed">("decrypting");
    const [showBack, setShowBack] = useState(false);

    // Animasi "DECRYPTING..." sebelum isi ditampilkan.
    useEffect(() => {
        const timer = setTimeout(() => setPhase("revealed"), 900);
        return () => clearTimeout(timer);
    }, []);

    // Kunci scroll + tombol ESC. Ter-mount berarti terbuka, jadi tanpa syarat isOpen.
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal Content */}
            <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 w-full max-w-lg md:max-w-4xl bg-bg-card border-2 border-border overflow-hidden"
            >
                {/* Terminal Header Bar */}
                <div className="flex items-center justify-between px-5 py-3 border-b-2 border-border bg-bg-primary">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-accent" />
                            <span className="w-3 h-3 rounded-full bg-text-muted/40" />
                            <span className="w-3 h-3 rounded-full bg-text-muted/40" />
                        </div>
                        <span className="text-xs font-mono text-text-muted uppercase tracking-wider">
                            credential_vault.exe
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-text-muted hover:text-accent transition-colors duration-200 text-lg font-mono leading-none"
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 md:p-8 min-h-[280px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        {phase === "decrypting" ? (
                            <motion.div
                                key="decrypting"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="flex flex-col items-center justify-center gap-4 py-8"
                            >
                                {/* Scanning animation */}
                                <div className="relative w-16 h-16 border-2 border-accent">
                                    <motion.div
                                        className="absolute inset-x-0 h-0.5 bg-accent"
                                        animate={{ top: ["0%", "100%", "0%"] }}
                                        transition={{
                                            duration: 1.2,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg
                                            className="w-8 h-8 text-accent opacity-60"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <DecryptingText />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="revealed"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start"
                            >
                                {/* Left Side: Certificate Image Container */}
                                <div className="flex flex-col gap-3">
                                    <CertificateImage
                                        key={
                                            showBack && certificate.backImage
                                                ? certificate.backImage
                                                : certificate.image
                                        }
                                        src={
                                            showBack && certificate.backImage
                                                ? certificate.backImage
                                                : certificate.image
                                        }
                                        alt={`${certificate.title} ${showBack ? "(Back)" : "(Front)"}`}
                                    />
                                    
                                    <div className="flex justify-between items-center gap-2">
                                        {/* Back Side Toggle (if available) */}
                                        {certificate.backImage ? (
                                            <div className="flex gap-1.5 bg-bg-primary p-0.5 border border-border/50">
                                                <button
                                                    onClick={() => setShowBack(false)}
                                                    className={`px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-wider transition-all duration-200 ${
                                                        !showBack
                                                            ? "bg-accent text-bg-primary"
                                                            : "text-text-secondary hover:text-accent"
                                                    }`}
                                                >
                                                    Front
                                                </button>
                                                <button
                                                    onClick={() => setShowBack(true)}
                                                    className={`px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-wider transition-all duration-200 ${
                                                        showBack
                                                            ? "bg-accent text-bg-primary"
                                                            : "text-text-secondary hover:text-accent"
                                                    }`}
                                                >
                                                    Back
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-mono text-text-muted">
                                                [SINGLE PAGE CREDENTIAL]
                                            </span>
                                        )}

                                        {/* View High-Res Link */}
                                        <a
                                            href={showBack && certificate.backImage 
                                                ? certificate.backImage
                                                : certificate.image
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-mono text-[10px] text-text-muted hover:text-accent flex items-center gap-1 transition-colors duration-200"
                                        >
                                            [RAW FILE]
                                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>

                                {/* Right Side: Certificate Info */}
                                <div className="space-y-4 flex flex-col justify-between h-full">
                                    <div className="space-y-4">
                                        {/* Category badge */}
                                        <span className="inline-block text-xs font-bold font-mono uppercase tracking-widest text-accent border border-accent px-3 py-1">
                                            {certificate.category}
                                        </span>

                                        {/* Title */}
                                        <h3 className="text-2xl md:text-3xl font-heading uppercase text-text-primary leading-tight">
                                            {certificate.title}
                                        </h3>

                                        {/* Meta info */}
                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-text-secondary">
                                            <div className="flex items-center gap-2">
                                                <span className="text-accent">▸</span>
                                                <span>Issued by <span className="text-text-primary font-semibold">{certificate.issuer}</span></span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-accent">▸</span>
                                                <span>{certificate.date}</span>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-text-secondary leading-relaxed text-sm">
                                            {certificate.description}
                                        </p>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-border mt-auto">
                                        {/* Action */}
                                        {certificate.credentialUrl ? (
                                            <a
                                                href={certificate.credentialUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-bg-primary font-bold text-sm uppercase tracking-widest hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] transition-all duration-300 w-full justify-center md:w-auto"
                                            >
                                                View Credential
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        ) : (
                                            <span className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-border text-text-muted font-bold text-xs uppercase tracking-widest cursor-not-allowed w-full md:w-auto">
                                                No Credential Link
                                            </span>
                                        )}

                                        {/* Terminal status line */}
                                        <div>
                                            <p className="text-[10px] font-mono text-text-muted">
                                                <span className="text-green-500">✓</span> CREDENTIAL VERIFIED — STATUS: <span className="text-accent">AUTHENTIC</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function CertificateModal({
    certificate,
    isOpen,
    onClose,
}: CertificateModalProps) {
    return (
        <AnimatePresence>
            {isOpen && certificate && (
                <ModalContent certificate={certificate} onClose={onClose} />
            )}
        </AnimatePresence>
    );
}


/** Animated "DECRYPTING..." text with cycling characters */
function DecryptingText() {
    const [dots, setDots] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 300);
        return () => clearInterval(interval);
    }, []);

    return (
        <p className="text-sm font-mono text-accent tracking-widest uppercase">
            Decrypting{dots}
        </p>
    );
}
