"use client";

import { motion } from "framer-motion";
import ServiceCard from "@/components/ServiceCard";
import ScrambleText from "@/components/ScrambleText";

const services = [
    {
        icon: (
            <svg
                className="w-7 h-7 text-accent-light"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                />
            </svg>
        ),
        title: "Website E-Commerce",
        description:
            "Platform e-commerce berperforma tinggi yang dirancang khusus untuk meminimalkan bounce-rate dan melipatgandakan tingkat konversi ritel Anda.",
    },
    {
        icon: (
            <svg
                className="w-7 h-7 text-accent-light"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
            </svg>
        ),
        title: "Company Profile",
        description:
            "Kesan pertama digital yang presisi. Arsitektur web korporat yang dirancang untuk mendominasi kompetitor dan membangun kredibilitas instan.",
    },
    {
        icon: (
            <svg
                className="w-7 h-7 text-accent-light"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
            </svg>
        ),
        title: "Sistem Kustom",
        description:
            "Infrastruktur backend dan antarmuka kustom berskala enterprise untuk merampingkan operasional bisnis Anda yang paling kompleks.",
    },
];

export default function ServicesSection() {
    return (
        <section id="services" className="relative section-container">
            {/* Background */}
            <div className="absolute inset-0 bg-bg-primary" />

            <div className="relative z-10 max-w-6xl mx-auto py-12 md:py-20">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <span className="text-bg-primary text-sm font-bold uppercase tracking-widest bg-text-primary px-4 py-1.5 border-2 border-text-primary cursor-default">
                        <ScrambleText text="What I Build" />
                    </span>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-heading mt-6 mb-6 tracking-wider uppercase text-text-primary cursor-default">
                        <ScrambleText text="Digital" /> <span className="text-accent underline decoration-4 underline-offset-8">
                            <ScrambleText text="Services" />
                        </span>
                    </h2>
                    <p className="text-text-secondary font-medium text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        End-to-end solutions from design to deployment. Performance-focused web applications built for real business impact.
                    </p>
                </motion.div>

                {/* Service Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <ServiceCard
                            key={service.title}
                            icon={service.icon}
                            title={service.title}
                            description={service.description}
                            delay={index * 0.15}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
