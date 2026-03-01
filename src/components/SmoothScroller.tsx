"use client";

import { ReactLenis } from "lenis/react";
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
      {children}
    </ReactLenis>
  );
}
