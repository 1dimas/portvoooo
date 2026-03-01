"use client";

import { motion } from "framer-motion";
import InfiniteMarquee from "./InfiniteMarquee";

interface ScrollingBannerProps {
    text: string;
    speed?: number;
    reverse?: boolean;
}

export default function ScrollingBanner({
    text = "AVAILABLE FOR FREELANCE • MARI BERKOLABORASI • LET'S BUILD SOMETHING GREAT • ",
    speed = 50,
    reverse = false,
}: ScrollingBannerProps) {
    // Repeat text multiple times to ensure enough content for seamless scrolling
    const repeatedText = `${text} `.repeat(10).split(" • ");

    return (
        <section className="relative w-full overflow-hidden bg-accent border-y-4 border-bg-primary py-4 md:py-6 rotate-[-1deg] scale-105 my-20 z-20">
            <InfiniteMarquee speed={speed} reverse={reverse}>
                <div className="flex whitespace-nowrap items-center">
                    {repeatedText.map((item, i) => (
                        <div key={i} className="flex items-center">
                            <span className="text-3xl md:text-5xl font-black font-heading uppercase text-bg-primary px-4 md:px-8 tracking-wider">
                                {item}
                            </span>
                            {/* The bullet separator */}
                            {i < repeatedText.length - 1 && (
                                <span className="text-3xl md:text-5xl font-black text-bg-primary">
                                    •
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </InfiniteMarquee>
        </section>
    );
}
