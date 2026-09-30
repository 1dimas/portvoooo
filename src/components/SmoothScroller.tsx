"use client";

import { ReactLenis } from "lenis/react";
import VimKeys from "@/components/VimKeys";
import { ReactNode } from "react";

interface SmoothScrollerProps {
  children: ReactNode;
}

export default function SmoothScroller({ children }: SmoothScrollerProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.4,
        smoothWheel: true,
        wheelMultiplier: 0.8,
      }}
    >
      {/* Di dalam provider: useLenis() butuh instance yang sama agar
          gulir keyboard tidak berkelahi dengan smooth scroll. */}
      <VimKeys />
      {children}
    </ReactLenis>
  );
}
