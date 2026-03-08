/**
 * use3DTilt — Pointer-based 3D tilt hook with translateZ pop and glow.
 * Smooth, responsive, and cleans up on unmount.
 */
import { useRef, useCallback, useState } from "react";
import { useAnimationSettings } from "@/lib/animation-settings";

interface TiltState {
  rotateX: number;
  rotateY: number;
  scale: number;
  glowX: number;
  glowY: number;
}

export const use3DTilt = (intensity = 15) => {
  const ref = useRef<HTMLDivElement>(null);
  const { animationsEnabled } = useAnimationSettings();
  const [tilt, setTilt] = useState<TiltState>({
    rotateX: 0, rotateY: 0, scale: 1, glowX: 50, glowY: 50,
  });

  const handleMove = useCallback((e: React.PointerEvent) => {
    if (!animationsEnabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      rotateX: (0.5 - y) * intensity,
      rotateY: (x - 0.5) * intensity,
      scale: 1.03,
      glowX: x * 100,
      glowY: y * 100,
    });
  }, [intensity, animationsEnabled]);

  const handleLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0, scale: 1, glowX: 50, glowY: 50 });
  }, []);

  const tiltStyle: React.CSSProperties = {
    transform: `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateZ(${tilt.scale > 1 ? 20 : 0}px) scale(${tilt.scale})`,
    transition: "transform 0.15s ease-out",
    transformStyle: "preserve-3d" as const,
  };

  const glowStyle: React.CSSProperties = {
    background: tilt.scale > 1
      ? `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, hsl(var(--neon-cyan) / 0.15), transparent 60%)`
      : "none",
  };

  return { ref, tiltStyle, glowStyle, handleMove, handleLeave };
};
