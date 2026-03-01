"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import Image from "next/image";

interface ZoomableImageProps {
    src: string;
    alt: string;
}

export default function ZoomableImage({ src, alt }: ZoomableImageProps) {
    const [isZoomed, setIsZoomed] = useState(false);

    return (
        <>
            {/* Thumbnail / Inline Image Focus Area */}
            <div
                className="w-full aspect-video md:aspect-[21/9] bg-bg-card border-2 border-border overflow-hidden relative cursor-zoom-in group"
                onClick={() => setIsZoomed(true)}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 80vw"
                />

                {/* Overlay Hint on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-bg-primary text-text-primary px-6 py-3 font-bold uppercase tracking-widest text-sm flex items-center gap-2 border-2 border-border">
                        <ZoomIn className="w-4 h-4" />
                        View Fullscreen
                    </div>
                </div>
            </div>

            {/* Fullscreen Zoom Modal */}
            <AnimatePresence>
                {isZoomed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
                        onClick={() => setIsZoomed(false)}
                    >
                        {/* Close Button Hint */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsZoomed(false);
                            }}
                            className="absolute top-6 right-6 z-[10000] bg-bg-primary border-2 border-border text-text-primary p-3 hover:bg-accent hover:border-accent hover:text-black transition-colors"
                            aria-label="Close fullscreen image"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full h-full max-w-7xl max-h-[90vh] border-2 border-border shadow-2xl bg-bg-card"
                            onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to backdrop
                        >
                            {/* 
                 We use object-contain here so the entire image is visible without cropping, 
                 unlike the thumbnail which uses object-cover.
               */}
                            <Image
                                src={src}
                                alt={alt}
                                fill
                                className="object-contain"
                                sizes="100vw"
                                quality={100}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
