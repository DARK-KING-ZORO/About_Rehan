/**
 * useScrollReveal — IntersectionObserver hook for staggered scroll animations.
 * Interrupt-safe: uses once:true so animations don't re-trigger on jitter.
 */
import { useEffect, useRef, useState, useCallback } from "react";
import { useAnimationSettings } from "@/lib/animation-settings";

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  /** Stagger delay in ms per item index */
  staggerDelay?: number;
  index?: number;
}

export const useScrollReveal = ({
  threshold = 0.15,
  rootMargin = "-50px",
  staggerDelay = 100,
  index = 0,
}: ScrollRevealOptions = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const { animationsEnabled } = useAnimationSettings();

  useEffect(() => {
    if (!animationsEnabled) {
      setIsRevealed(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger delay based on index
          setTimeout(() => setIsRevealed(true), index * staggerDelay);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, staggerDelay, index, animationsEnabled]);

  const revealStyle: React.CSSProperties = {
    opacity: isRevealed ? 1 : 0,
    transform: isRevealed
      ? "perspective(600px) rotateX(0deg) scale(1)"
      : "perspective(600px) rotateX(3deg) scale(0.98)",
    transition: `opacity 0.6s ease-out, transform 0.6s ease-out`,
    willChange: "opacity, transform",
  };

  return { ref, isRevealed, revealStyle };
};

/**
 * ScrollReveal wrapper component for convenience
 */
export const ScrollReveal = ({
  children,
  index = 0,
  className = "",
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
}) => {
  const { ref, revealStyle } = useScrollReveal({ index });
  return (
    <div ref={ref} style={revealStyle} className={className}>
      {children}
    </div>
  );
};
