/**
 * SkillSphere — Lazy-loaded Three.js rotating skill sphere.
 * Falls back to SVG on low-power devices.
 */
import { Suspense, lazy, useMemo } from "react";
import { useAnimationSettings } from "@/lib/animation-settings";
import type { Skill } from "@/lib/firestore";

// Lazy-load the Three.js canvas to keep initial bundle small
const ThreeSphere = lazy(() => import("./SkillSphereCanvas"));

interface SkillSphereProps {
  skills: Skill[];
}

/** SVG fallback for low-power devices */
const SvgFallback = ({ skills }: { skills: Skill[] }) => {
  const items = skills.slice(0, 12);
  return (
    <div className="relative mx-auto h-72 w-72 sm:h-80 sm:w-80">
      <svg viewBox="0 0 300 300" className="h-full w-full">
        {/* Orbit rings */}
        <circle cx="150" cy="150" r="120" fill="none" stroke="hsl(var(--neon-cyan))" strokeWidth="0.5" opacity="0.2" />
        <circle cx="150" cy="150" r="80" fill="none" stroke="hsl(var(--neon-purple))" strokeWidth="0.5" opacity="0.2" />
        {items.map((skill, i) => {
          const angle = (i / items.length) * Math.PI * 2;
          const radius = 80 + (i % 2) * 40;
          const x = 150 + Math.cos(angle) * radius;
          const y = 150 + Math.sin(angle) * radius;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill="hsl(var(--neon-cyan))" opacity="0.6">
                <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
              <text x={x} y={y - 10} textAnchor="middle" fill="hsl(var(--foreground))" fontSize="9" opacity="0.7">
                {skill.name}
              </text>
            </g>
          );
        })}
        {/* Center glow */}
        <circle cx="150" cy="150" r="6" fill="hsl(var(--neon-cyan))" opacity="0.8">
          <animate attributeName="r" values="4;8;4" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
};

const SkillSphere = ({ skills }: SkillSphereProps) => {
  const { settings, isMobile, animationsEnabled } = useAnimationSettings();

  if (!settings.enableSkillSphere) return null;

  // Use SVG fallback on mobile or when animations disabled
  if (isMobile || !animationsEnabled) {
    return <SvgFallback skills={skills} />;
  }

  return (
    <Suspense fallback={<SvgFallback skills={skills} />}>
      <ThreeSphere skills={skills} />
    </Suspense>
  );
};

export default SkillSphere;
