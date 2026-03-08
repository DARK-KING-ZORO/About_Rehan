/**
 * Hero Section — Enhanced with HeroParticles, parallax layers, and neon ripple CTAs.
 */
import { motion } from "framer-motion";
import HeroParticles from "./HeroParticles";
import ParallaxLayer from "./ParallaxLayer";
import type { ProfileData } from "@/lib/firestore";
import { useAnimationSettings } from "@/lib/animation-settings";

interface HeroProps {
  profile: ProfileData | null;
}

/** Neon ripple button */
const NeonButton = ({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "outline" }) => (
  <a
    href={href}
    className={`group relative overflow-hidden rounded-full px-8 py-3 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
      variant === "primary"
        ? "glass neon-glow text-primary hover:neon-glow-strong"
        : "border border-muted text-foreground hover:border-primary hover:text-primary"
    }`}
  >
    {/* Ripple effect on hover */}
    <span className="absolute inset-0 overflow-hidden rounded-full">
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
    </span>
    <span className="relative z-10">{children}</span>
  </a>
);

const Hero = ({ profile }: HeroProps) => {
  const { animationsEnabled } = useAnimationSettings();

  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background parallax layer */}
      <ParallaxLayer depth={0.8} className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-secondary/5 blur-3xl" />
        </div>
      </ParallaxLayer>

      {/* Foreground particles */}
      <HeroParticles />

      {/* Bottom gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-[1]" />

      {/* Content — mid parallax */}
      <ParallaxLayer depth={0.2} className="relative z-10 text-center px-6">
        <motion.h1
          initial={animationsEnabled ? { opacity: 0, y: 30 } : undefined}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-display text-5xl font-bold leading-tight sm:text-7xl lg:text-8xl"
        >
          <span className="gradient-text">{profile?.name || "Your Name"}</span>
        </motion.h1>

        <motion.p
          initial={animationsEnabled ? { opacity: 0, y: 20 } : undefined}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-4 text-lg text-muted-foreground sm:text-xl lg:text-2xl"
        >
          {profile?.title || "Full-Stack Developer"}
        </motion.p>

        <motion.div
          initial={animationsEnabled ? { opacity: 0, y: 20 } : undefined}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <NeonButton href="#projects">View Projects</NeonButton>
          <NeonButton href="#contact" variant="outline">Contact Me</NeonButton>
        </motion.div>
      </ParallaxLayer>
    </section>
  );
};

export default Hero;
