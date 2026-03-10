"use client";

import { motion } from "framer-motion";
import ParticleField from "@/components/animations/ParticleField";
import ScrambleText from "@/components/ScrambleText";
import LabItemCard from "@/components/LabItemCard";
import Link from "next/link";
import MagneticButton from "@/components/MagneticButton";

const labItems = [
    {
        title: "Liquid Distortion",
        description: "Eksperimen WebGL menggunakan Three.js untuk menciptakan efek distorsi cairan pada gambar saat kursor digerakkan.",
        tech: ["WebGL", "Three.js", "React Three Fiber"],
        status: "Concept" as const,
    },
    {
        title: "The Cross-Window Portal",
        description: "Sihir sinkronisasi antar-jendela. Lempar objek dari Jendela A dan saksikan ia menyeberang ke Jendela B secara real-time menggunakan koordinat absolut layar.",
        tech: ["BroadcastChannel", "Framer Motion", "Math"],
        status: "Done" as const,
        link: "/lab/cross-window"
    },
    {
        title: "The Sentient UI",
        description: "Sistem cerdas yang merekam heatmap interaksi user (hover, scroll) dan bermutasi secara mandiri untuk menyesuaikan gaya elemen yang sering diperhatikan.",
        tech: ["LocalStorage", "Intersection/Mouse Observer", "Framer Motion"],
        status: "Done" as const,
        link: "/lab/sentient-ui"
    },
    {
        title: "Neural Gesture Interface",
        description: "Kontrol peramban tanpa menyentuh mouse. Render UI melayang dan melukis kanvas interaktif dengan melacak koordinat kerangka jari dari webcam.",
        tech: ["MediaPipe Vision AI", "Framer Motion", "Canvas 2D"],
        status: "Done" as const,
        link: "/lab/neural-gesture"
    },
    {
        title: "Chaos Desktop",
        description: "Tiling Window Manager tribute. UI Cards berwujud fisik yang reaktif terhadap gravitasi, tabrakan, dan momentum (Hyprland style).",
        tech: ["Matter.js", "Framer Motion", "Physics"],
        status: "Done" as const,
        link: "/lab/chaos-desktop"
    },
    {
        title: "Kinetic Typography",
        description: "Eksplorasi ilusi optik 'Semantic Shift' dan lensa cair menggunakan CSS Masking dan Velocity Tracking GPU.",
        tech: ["clip-path", "Framer Motion", "useVelocity"],
        status: "Done" as const,
        link: "/lab/kinetic-typography"
    },
    {
        title: "Magnetic Grid",
        description: "Sistem grid berkinerja tinggi yang bereaksi terhadap posisi kursor. Mensimulasikan gaya magnet multi-force dengan variasi visual interaktif.",
        tech: ["Framer Motion", "useMotionValue", "Math Physics"],
        status: "Done" as const,
        link: "/lab/magnetic-grid"
    }
];

export default function LabPage() {
    return (
        <main className="min-h-screen bg-bg-primary relative overflow-hidden selection:bg-accent selection:text-white">
            <ParticleField />

            <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-32">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-20"
                >
                    <MagneticButton>
                        <Link href="/" className="inline-flex items-center gap-4 text-text-secondary hover:text-accent font-mono uppercase tracking-widest text-sm transition-colors cursor-none">
                            <span className="text-xl">←</span>
                            <span>Return to Base</span>
                        </Link>
                    </MagneticButton>
                </motion.div>

                {/* Lab Header */}
                <div className="mb-24 md:mb-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                        className="inline-block border border-accent/30 bg-accent/5 px-4 py-1 mb-8"
                    >
                        <span className="text-accent font-mono text-xs uppercase tracking-[0.3em] font-bold">Warning: Experimental Zone</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
                        className="text-[clamp(3rem,8vw,6rem)] font-heading leading-[0.9] tracking-wide uppercase text-text-primary mb-6"
                    >
                        The <span className="text-accent">Lab</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-text-secondary max-w-2xl text-lg md:text-xl font-mono leading-relaxed"
                    >
                        <ScrambleText text="Kumpulan eksperimen UI/UX, micro-interactions, dan eksplorasi visual yang terlalu liar untuk production." delay={0.5} />
                    </motion.p>
                </div>

                {/* Experiments Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {labItems.map((item, index) => (
                        <LabItemCard
                            key={index}
                            {...item}
                            delay={0.6 + (index * 0.1)}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}
