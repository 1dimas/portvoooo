"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ZoomTransitionSection() {
    const containerRef = useRef<HTMLElement>(null);
    // Detect mobile for reduced animation
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Zoom the text extremely massively (up to 200x)
    const scale = useTransform(scrollYProgress, [0, 0.9], [1, isMobile ? 50 : 200]);

    // Keep text visible longer, fade out right at the peak zoom
    const opacity = useTransform(scrollYProgress, [0, 0.75, 0.9], [1, 1, 0]);

    return (
        <section ref={containerRef} className="relative h-[150vh] md:h-[250vh] bg-bg-primary">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

                <motion.div
                    style={{ scale, opacity }}
                    className="relative z-10 origin-center flex items-center justify-center px-4"
                >
                    <h2 className="text-[clamp(3rem,8vw,10rem)] font-heading uppercase text-text-primary text-center leading-[0.8] tracking-tighter m-0 p-0">
                        BEYOND<br />THE CODE
                    </h2>
                </motion.div>

            </div>
        </section>
    );
}
