import { motion } from "framer-motion";
import ParticlesBackground from "./ParticlesBackground";
import type { ProfileData } from "@/lib/firestore";

interface HeroProps {
  profile: ProfileData | null;
}

const Hero = ({ profile }: HeroProps) => {
  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <ParticlesBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-[1]" />

      <div className="relative z-10 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-display text-5xl font-bold leading-tight sm:text-7xl lg:text-8xl"
        >
          <span className="gradient-text">{profile?.name || "Your Name"}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-4 text-lg text-muted-foreground sm:text-xl lg:text-2xl"
        >
          {profile?.title || "Full-Stack Developer"}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <a
            href="#projects"
            className="glass neon-glow rounded-full px-8 py-3 font-medium text-primary transition-all hover:neon-glow-strong"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="rounded-full border border-muted px-8 py-3 font-medium text-foreground transition-all hover:border-primary hover:text-primary"
          >
            Contact Me
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
