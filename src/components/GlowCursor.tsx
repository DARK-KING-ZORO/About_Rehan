/**
 * GlowCursor — Glowing cursor effect with smoothing.
 * Can be toggled via admin settings.
 */
import { useEffect, useRef } from "react";
import { useAnimationSettings } from "@/lib/animation-settings";

const GlowCursor = () => {
  const { settings, isMobile, animationsEnabled } = useAnimationSettings();
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!settings.enableGlowCursor || isMobile || !animationsEnabled) return;

    const handleMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    let raf: number;
    const animate = () => {
      // Smooth lerp
      pos.current.x += (target.current.x - pos.current.x) * 0.15;
      pos.current.y += (target.current.y - pos.current.y) * 0.15;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x - 16}px, ${pos.current.y - 16}px)`;
      }
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMove);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(raf);
    };
  }, [settings.enableGlowCursor, isMobile, animationsEnabled]);

  if (!settings.enableGlowCursor || isMobile || !animationsEnabled) return null;

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999] h-8 w-8 rounded-full opacity-60"
      style={{
        background: "radial-gradient(circle, hsl(var(--neon-cyan) / 0.6), transparent 70%)",
        filter: "blur(4px)",
        willChange: "transform",
      }}
    />
  );
};

export default GlowCursor;
