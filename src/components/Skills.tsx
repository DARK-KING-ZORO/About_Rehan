/**
 * Skills Section — Enhanced with scroll reveal, 3D tilt cards, parallax layers, and optional SkillSphere.
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { Skill } from "@/lib/firestore";
import { use3DTilt } from "@/hooks/use3DTilt";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import SkillSphere from "./SkillSphere";
import ParallaxLayer from "./ParallaxLayer";

interface SkillsProps {
  skills: Skill[];
}

const iconMap: Record<string, string> = {
  react: "⚛️", javascript: "🟨", typescript: "🔷", html: "🌐", css: "🎨",
  node: "🟩", python: "🐍", firebase: "🔥", git: "📦", docker: "🐳",
  aws: "☁️", figma: "🎯", default: "💻",
};

const SkillCard = ({ skill, index }: { skill: Skill; index: number }) => {
  const { ref, tiltStyle, glowStyle, handleMove, handleLeave } = use3DTilt(10);

  return (
    <ScrollReveal index={index}>
      <div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className="glass rounded-2xl p-6 transition-shadow duration-300 hover:neon-glow relative overflow-hidden"
        style={tiltStyle}
      >
        <div className="absolute inset-0 rounded-2xl pointer-events-none" style={glowStyle} />
        <div className="relative z-10">
          <div className="mb-3 text-3xl">
            {skill.icon || iconMap[skill.name.toLowerCase()] || iconMap.default}
          </div>
          <h3 className="mb-3 font-display text-lg font-semibold text-foreground">{skill.name}</h3>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.level}%` }}
              transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
              viewport={{ once: true }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
            />
          </div>
          <p className="mt-2 text-right text-xs text-muted-foreground">{skill.level}%</p>
        </div>
      </div>
    </ScrollReveal>
  );
};

const Skills = ({ skills }: SkillsProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const displaySkills = skills.length > 0 ? skills : [
    { name: "React", level: 90, icon: "⚛️" },
    { name: "TypeScript", level: 85, icon: "🔷" },
    { name: "Node.js", level: 80, icon: "🟩" },
    { name: "Firebase", level: 75, icon: "🔥" },
    { name: "CSS/Tailwind", level: 90, icon: "🎨" },
    { name: "Git", level: 85, icon: "📦" },
  ] as Skill[];

  return (
    <section id="skills" className="relative py-24 px-6 overflow-hidden" ref={ref}>
      {/* Parallax background orbs for depth */}
      <ParallaxLayer depth={0.7} className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-10 right-10 h-80 w-80 rounded-full bg-secondary/5 blur-3xl" />
        <div className="absolute bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </ParallaxLayer>

      <ParallaxLayer depth={0.35} className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 right-1/4 h-48 w-48 rounded-full bg-accent/4 blur-2xl" />
      </ParallaxLayer>

      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center font-display text-4xl font-bold gradient-text"
        >
          Skills & Technologies
        </motion.h2>

        {/* 3D Skill Sphere — floats at a medium parallax depth */}
        <ParallaxLayer depth={0.25} className="mb-16">
          <SkillSphere skills={displaySkills} />
        </ParallaxLayer>

        {/* Skill cards on a lighter parallax layer */}
        <ParallaxLayer depth={0.1}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displaySkills.map((skill, i) => (
              <SkillCard key={skill.id || i} skill={skill} index={i} />
            ))}
          </div>
        </ParallaxLayer>
      </div>
    </section>
  );
};

export default Skills;
