"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import ScrambleText from "@/components/ScrambleText";
import CertificateModal from "@/components/CertificateModal";
import { certificates, type Certificate } from "@/data/certificates";

/** Maps bento span to Tailwind grid classes */
function getSpanClasses(span: Certificate["span"]) {
    switch (span) {
        case "large":
            return "md:col-span-2 md:row-span-2";
        case "medium":
            return "md:col-span-2 md:row-span-1";
        case "small":
        default:
            return "md:col-span-1 md:row-span-1";
    }
}

/** Placeholder deterministik: aman untuk SSR dan menjaga lebar agar tidak ada CLS. */
function hexPlaceholder(length: number) {
    let result = "";
    for (let i = 0; i < length; i++) {
        if (i > 0 && i % 4 === 0) result += " ";
        result += "0";
    }
    return result;
}

/**
 * Hex acak untuk kesan "terkunci". Hanya berjalan saat kartunya terlihat —
 * tanpa gerbang ini, tiap kartu menyalakan interval 150ms selamanya.
 */
function useEncryptedText(length: number, active: boolean) {
    const [text, setText] = useState(() => hexPlaceholder(length));

    useEffect(() => {
        if (!active) return;

        const chars = "0123456789ABCDEF";
        const generate = () => {
            let result = "";
            for (let i = 0; i < length; i++) {
                if (i > 0 && i % 4 === 0) result += " ";
                result += chars[Math.floor(Math.random() * chars.length)];
            }
            return result;
        };

        const interval = setInterval(() => setText(generate()), 150);
        return () => clearInterval(interval);
    }, [length, active]);

    return text;
}

function CertificateCard({
    cert,
    index,
    onClick,
}: {
    cert: Certificate;
    index: number;
    onClick: () => void;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const isVisible = useInView(cardRef);
    const prefersReducedMotion = useReducedMotion();
    const encryptedText = useEncryptedText(16, isVisible && !prefersReducedMotion);
    const isLarge = cert.span === "large";

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            onClick={onClick}
            className={`group relative bg-bg-card border-2 border-border overflow-hidden cursor-pointer transition-all duration-300
                hover:border-accent hover:shadow-[-4px_4px_0px_0px_var(--color-accent)]
                ${getSpanClasses(cert.span)}
                ${isLarge ? "min-h-[280px] md:min-h-[340px]" : "min-h-[200px] md:min-h-[220px]"}
            `}
        >
            {/* Scan-line overlay for hacker aesthetic */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03] z-10"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)",
                }}
            />

            {/* Corner brackets — terminal file look */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-text-muted/30 group-hover:border-accent transition-colors duration-300" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-text-muted/30 group-hover:border-accent transition-colors duration-300" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-text-muted/30 group-hover:border-accent transition-colors duration-300" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-text-muted/30 group-hover:border-accent transition-colors duration-300" />

            {/* Content */}
            <div className="relative z-20 p-5 md:p-6 h-full flex flex-col justify-between">
                {/* Top section */}
                <div>
                    {/* Status indicator */}
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted group-hover:text-accent transition-colors duration-300">
                            ◈ {cert.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                                Secured
                            </span>
                        </div>
                    </div>

                    {/* Lock icon + title area */}
                    <div className="mb-3">
                        <h3
                            className={`font-heading uppercase text-text-primary group-hover:text-accent transition-colors duration-300 leading-tight ${
                                isLarge
                                    ? "text-xl md:text-2xl"
                                    : "text-base md:text-lg"
                            }`}
                        >
                            {cert.title}
                        </h3>
                    </div>

                    {/* Issuer */}
                    <p className="text-xs md:text-sm text-text-secondary font-mono">
                        <span className="text-accent">▸</span> {cert.issuer} — {cert.date}
                    </p>
                </div>

                {/* Bottom section: encrypted data simulation */}
                <div className="mt-4 pt-3 border-t border-border">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-mono text-text-muted/60 tracking-wider group-hover:text-text-muted transition-colors duration-300">
                            {encryptedText}
                        </p>
                        <span className="text-xs font-mono text-text-muted group-hover:text-accent transition-colors duration-300">
                            [CLICK]
                        </span>
                    </div>
                </div>
            </div>

            {/* Hover glow effect (bottom edge) */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
    );
}

export default function CertificatesSection() {
    const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpen = (cert: Certificate) => {
        setSelectedCert(cert);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    return (
        <section id="certificates" className="relative section-container">
            <div className="absolute inset-0 bg-bg-primary" />

            <div className="relative z-10 max-w-6xl mx-auto py-12 md:py-20">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-bg-primary text-sm font-bold uppercase tracking-widest bg-text-primary px-4 py-1.5 border-2 border-text-primary cursor-default" lang="en">
                        <ScrambleText text="Credentials" />
                    </span>
                    <h2 lang="en" className="text-h2 font-heading uppercase text-text-primary mt-6 mb-4 cursor-default">
                        <ScrambleText text="Certi" />
                        <span className="text-accent underline decoration-4 underline-offset-8">
                            <ScrambleText text="ficates" />
                        </span>
                    </h2>
                    <p className="text-text-secondary text-lead max-w-2xl mx-auto" lang="en">
                        Verified credentials and certifications — click to decrypt and reveal details.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5 auto-rows-auto">
                    {certificates.map((cert, index) => (
                        <CertificateCard
                            key={cert.id}
                            cert={cert}
                            index={index}
                            onClick={() => handleOpen(cert)}
                        />
                    ))}
                </div>
            </div>

            {/* Modal */}
            <CertificateModal
                certificate={selectedCert}
                isOpen={isModalOpen}
                onClose={handleClose}
            />
        </section>
    );
}
