import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import type { Skill } from "@/lib/firestore";

interface SkillsProps {
  skills: Skill[];
}

const iconMap: Record<string, string> = {
  react: "⚛️", javascript: "🟨", typescript: "🔷", html: "🌐", css: "🎨",
  node: "🟩", python: "🐍", firebase: "🔥", git: "📦", docker: "🐳",
  aws: "☁️", figma: "🎯", default: "💻",
};

const SkillCard = ({ skill, index }: { skill: Skill; index: number }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="glass rounded-2xl p-6 transition-all duration-300 hover:neon-glow"
      style={{
        transform: hovered ? "translateY(-5px) rotateX(5deg)" : "translateY(0) rotateX(0)",
        transformStyle: "preserve-3d",
      }}
    >
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
    </motion.div>
  );
};

const Skills = ({ skills }: SkillsProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-24 px-6" ref={ref}>
      <div className="container mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center font-display text-4xl font-bold gradient-text"
        >
          Skills & Technologies
        </motion.h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.length > 0 ? (
            skills.map((skill, i) => <SkillCard key={skill.id || i} skill={skill} index={i} />)
          ) : (
            <>
              {[
                { name: "React", level: 90, icon: "⚛️" },
                { name: "TypeScript", level: 85, icon: "🔷" },
                { name: "Node.js", level: 80, icon: "🟩" },
                { name: "Firebase", level: 75, icon: "🔥" },
                { name: "CSS/Tailwind", level: 90, icon: "🎨" },
                { name: "Git", level: 85, icon: "📦" },
              ].map((s, i) => <SkillCard key={i} skill={s} index={i} />)}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Skills;
