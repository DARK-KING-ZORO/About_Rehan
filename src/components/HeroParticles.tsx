/**
 * HeroParticles — Enhanced tsParticles with depth, links, mouse repulse.
 * Lazy-loaded on mount, reacts to admin density settings.
 */
import { useEffect, useMemo, useState } from "react";
import { useAnimationSettings, getParticleCount } from "@/lib/animation-settings";

// Lazy-load tsParticles
let Particles: any = null;
let initParticlesEngine: any = null;
let loadSlim: any = null;

const HeroParticles = () => {
  const [init, setInit] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { settings, isMobile, animationsEnabled } = useAnimationSettings();

  // Dynamic import on mount
  useEffect(() => {
    if (!animationsEnabled) return;

    const load = async () => {
      const [particlesModule, engineModule, slimModule] = await Promise.all([
        import("@tsparticles/react"),
        import("@tsparticles/react"),
        import("tsparticles-slim"),
      ]);
      Particles = particlesModule.default;
      initParticlesEngine = engineModule.initParticlesEngine;
      loadSlim = slimModule.loadSlim;
      setLoaded(true);

      await initParticlesEngine(async (engine: any) => {
        await loadSlim(engine as any);
      });
      setInit(true);
    };
    load();
  }, [animationsEnabled]);

  const particleCount = getParticleCount(settings.particlesDensity, isMobile);

  const options = useMemo(() => ({
    fullScreen: false,
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: !isMobile, mode: ["grab", "repulse"] as string[] },
        onClick: { enable: true, mode: "push" as const },
      },
      modes: {
        grab: { distance: 160, links: { opacity: 0.4 } },
        repulse: { distance: 100, duration: 0.4, speed: 0.5 },
        push: { quantity: 2 },
      },
    },
    particles: {
      color: { value: ["#00e5ff", "#7c4dff", "#ff4081"] },
      links: {
        color: "#00e5ff",
        distance: 140,
        enable: true,
        opacity: 0.12,
        width: 1,
        triangles: { enable: !isMobile, opacity: 0.02 },
      },
      move: {
        enable: true,
        speed: isMobile ? 0.5 : 0.8,
        direction: "none" as const,
        outModes: { default: "bounce" as const },
        attract: { enable: true, rotateX: 600, rotateY: 1200 },
      },
      number: { density: { enable: true, area: 800 }, value: particleCount },
      opacity: {
        value: { min: 0.1, max: 0.6 },
        animation: { enable: true, speed: 0.5, minimumValue: 0.1 },
      },
      shape: { type: "circle" },
      size: {
        value: { min: 1, max: isMobile ? 2 : 4 },
        animation: { enable: true, speed: 1, minimumValue: 0.5 },
      },
    },
    detectRetina: true,
  }), [particleCount, isMobile]);

  if (!animationsEnabled || !init || !Particles) return null;

  return (
    <Particles
      id="hero-particles"
      options={options as any}
      className="absolute inset-0 z-0"
    />
  );
};

export default HeroParticles;
