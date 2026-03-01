"use client";

import { motion } from "framer-motion";
import InfiniteLoopTrigger from "@/components/InfiniteLoopTrigger";

const socialLinks = [
    {
        name: "GitHub",
        href: "https://github.com/1dimas",
        icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
        ),
    },
    {
        name: "Email",
        href: "mailto:dimasdwianandaputra@gmail.com",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        name: "WhatsApp",
        href: "https://wa.me/628998076063",
        icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
        ),
    },
];

export default function ContactSection() {
    return (
        <section id="contact" className="relative">
            {/* Background */}
            <div className="absolute inset-0 bg-bg-primary" />

            <div className="relative z-10 section-container max-w-4xl mx-auto text-center">
                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-accent text-sm font-semibold uppercase tracking-widest">
                        Kontak
                    </span>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-4 mb-6 uppercase tracking-wider">
                        Mari <span className="text-accent">Berkolaborasi</span>
                    </h2>
                    <p className="text-text-secondary text-lg max-w-xl mx-auto mb-12 leading-relaxed">
                        Punya ide proyek atau butuh partner digital? Jangan ragu untuk
                        menghubungi saya. Lets build something amazing together.
                    </p>
                </motion.div>

                {/* Social Links as Huge Brutalist Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="flex flex-col sm:flex-row justify-center items-stretch gap-6 mb-24 max-w-3xl mx-auto px-6"
                >
                    {socialLinks.map((link, index) => (
                        <motion.a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                            whileHover={{ scale: 1.05, y: -4 }}
                            className="flex-1 flex flex-col items-center justify-center gap-4 py-8 px-6 bg-bg-primary text-text-primary border-4 border-text-primary hover:bg-text-primary hover:text-bg-primary transition-colors duration-300 relative group overflow-hidden"
                        >
                            <div className="z-10">{link.icon}</div>
                            <span className="font-heading font-black text-xl uppercase tracking-widest z-10">{link.name}</span>
                            <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0"></div>
                        </motion.a>
                    ))}
                </motion.div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                >
                    <p className="text-text-muted text-sm">
                        © {new Date().getFullYear()} Dimas. Built with{" "}
                        <span className="text-accent-light">Next.js</span>,{" "}
                        <span className="text-accent-light">Framer Motion</span> &{" "}
                        <span className="text-accent">❤️</span>
                    </p>
                </motion.div>
            </div>

            {/* Scroll Buffer for Infinite Loop */}
            <div className="w-full h-[40vh] flex flex-col items-center justify-center pointer-events-none opacity-20">
                <span className="text-xs uppercase tracking-widest text-text-muted">Keep scrolling to restart</span>
            </div>

            {/* Infinite Loop Trigger */}
            <InfiniteLoopTrigger />
        </section>
    );
}
