import { useCallback, useMemo } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const options = useMemo(() => ({
    fullScreen: false,
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: "grab" },
        onClick: { enable: true, mode: "push" },
      },
      modes: {
        grab: { distance: 140, links: { opacity: 0.5 } },
        push: { quantity: 2 },
      },
    },
    particles: {
      color: { value: ["#00e5ff", "#7c4dff", "#ff4081"] },
      links: {
        color: "#00e5ff",
        distance: 150,
        enable: true,
        opacity: 0.15,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none" as const,
        outModes: { default: "bounce" as const },
      },
      number: { density: { enable: true, area: 800 }, value: 60 },
      opacity: { value: { min: 0.1, max: 0.5 } },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  }), []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={options as any}
      className="absolute inset-0 z-0"
    />
  );
};

export default ParticlesBackground;
