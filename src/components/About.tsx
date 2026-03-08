import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import type { ProfileData } from "@/lib/firestore";

interface AboutProps {
  profile: ProfileData | null;
}

const About = ({ profile }: AboutProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 px-6" ref={ref}>
      <div className="container mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center font-display text-4xl font-bold gradient-text"
        >
          About Me
        </motion.h2>

        <div className="grid gap-12 md:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center"
          >
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <p className="text-lg leading-relaxed text-muted-foreground">
              {profile?.about || "A passionate developer crafting modern digital experiences."}
            </p>

            {profile?.highlights && profile.highlights.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-4">
                {profile.highlights.map((h, i) => (
                  <div key={i} className="glass rounded-xl px-4 py-3 text-sm text-foreground">
                    {h}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
