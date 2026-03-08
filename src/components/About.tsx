import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import type { ProfileData } from "@/lib/firestore";
import ParallaxLayer from "./ParallaxLayer";
import { ScrollReveal } from "@/hooks/useScrollReveal";

interface AboutProps {
  profile: ProfileData | null;
}

const About = ({ profile }: AboutProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-24 px-6 overflow-hidden" ref={ref}>
      {/* Parallax background decorations */}
      <ParallaxLayer depth={0.6} className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-20 -left-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-10 -right-16 h-56 w-56 rounded-full bg-secondary/5 blur-3xl" />
      </ParallaxLayer>

      <ParallaxLayer depth={0.3} className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/3 h-40 w-40 rounded-full bg-accent/5 blur-2xl" />
      </ParallaxLayer>

      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center font-display text-4xl font-bold gradient-text"
        >
          About Me
        </motion.h2>

        <div className="grid gap-12 md:grid-cols-2 items-center">
          {/* Profile image with deeper parallax */}
          <ParallaxLayer depth={0.4}>
            <ScrollReveal index={0}>
              <div className="flex justify-center">
                <div className="relative h-72 w-72 overflow-hidden rounded-2xl neon-glow">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                  {profile?.image ? (
                    <img src={profile.image} alt={profile.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center glass text-6xl font-display font-bold text-primary">
                      {(profile?.name || "Y")[0]}
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </ParallaxLayer>

          {/* Text with lighter parallax for depth contrast */}
          <ParallaxLayer depth={0.15}>
            <ScrollReveal index={1}>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {profile?.about || "A passionate developer crafting modern digital experiences."}
              </p>

              {profile?.highlights && profile.highlights.length > 0 && (
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {profile.highlights.map((h, i) => (
                    <ScrollReveal key={i} index={i + 2}>
                      <div className="glass rounded-xl px-4 py-3 text-sm text-foreground">
                        {h}
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              )}
            </ScrollReveal>
          </ParallaxLayer>
        </div>
      </div>
    </section>
  );
};

export default About;
