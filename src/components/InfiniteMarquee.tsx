"use client";

interface InfiniteMarqueeProps {
    children: React.ReactNode;
    reverse?: boolean;
    speed?: number;
}

export default function InfiniteMarquee({
    children,
    reverse = false,
    speed = 80, // Increased from 30s to 80s for a very slow-motion read
}: InfiniteMarqueeProps) {
    return (
        <div className="overflow-hidden relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-bg-primary to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-bg-primary to-transparent z-10" />

            <div
                className="flex whitespace-nowrap w-max"
                style={{
                    animation: `${reverse ? "marquee-reverse" : "marquee"} ${speed}s linear infinite`,
                }}
            >
                {/* Duplicate content multiple times for ultra-wide monitors and zoom outs */}
                <div className="flex items-center justify-around translate-z-0">{children}</div>
                <div className="flex items-center justify-around translate-z-0">{children}</div>
                <div className="flex items-center justify-around translate-z-0">{children}</div>
                <div className="flex items-center justify-around translate-z-0">{children}</div>
            </div>
        </div>
    );
}
