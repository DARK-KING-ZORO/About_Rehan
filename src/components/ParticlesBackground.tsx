import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "tsparticles-slim";

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine as any);
    }).then(() => setInit(true));
  }, []);

  const options = useMemo(() => ({
    fullScreen: false,
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: "grab" as const },
        onClick: { enable: true, mode: "push" as const },
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

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={options as any}
      className="absolute inset-0 z-0"
    />
  );
};

export default ParticlesBackground;
