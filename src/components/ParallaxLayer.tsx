/**
 * ParallaxLayer — Applies translateY based on scroll position & depth factor.
 * Uses RAF-based scroll listener for smooth performance.
 */
import { useEffect, useRef, type ReactNode } from "react";
import { useAnimationSettings } from "@/lib/animation-settings";

interface ParallaxLayerProps {
  children: ReactNode;
  /** Depth factor: 0 = no movement, 1 = full parallax */
  depth?: number;
  className?: string;
}

const ParallaxLayer = ({ children, depth = 0.5, className = "" }: ParallaxLayerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { settings, animationsEnabled } = useAnimationSettings();

  useEffect(() => {
    if (!animationsEnabled || !ref.current) return;

    let ticking = false;
    const strength = settings.parallaxStrength * depth;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (ref.current) {
          const scrollY = window.scrollY;
          const offset = scrollY * strength * 0.3;
          ref.current.style.transform = `translate3d(0, ${offset}px, 0)`;
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [settings.parallaxStrength, depth, animationsEnabled]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
};

export default ParallaxLayer;
