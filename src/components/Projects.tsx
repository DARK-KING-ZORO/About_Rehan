/**
 * Projects Section — Enhanced with pointer-based 3D tilt, scroll reveal,
 * and modal with Z-translate + animated backdrop blur.
 */
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import { ExternalLink, Github, X } from "lucide-react";
import type { Project } from "@/lib/firestore";
import { use3DTilt } from "@/hooks/use3DTilt";
import { ScrollReveal } from "@/hooks/useScrollReveal";

interface ProjectsProps {
  projects: Project[];
}

const ProjectCard = ({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) => {
  const { ref, tiltStyle, glowStyle, handleMove, handleLeave } = use3DTilt(12);

  return (
    <ScrollReveal index={index}>
      <div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        onClick={onClick}
        className="group cursor-pointer glass rounded-2xl overflow-hidden transition-shadow duration-300 hover:neon-glow"
        style={tiltStyle}
      >
        {/* Pointer-following glow overlay */}
        <div className="absolute inset-0 z-10 rounded-2xl pointer-events-none" style={glowStyle} />

        <div className="relative h-48 overflow-hidden">
          {project.image ? (
            <img src={project.image} alt={project.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <span className="text-4xl">🚀</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
        </div>

        <div className="p-5 relative z-20">
          <h3 className="font-display text-lg font-semibold text-foreground">{project.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{project.description}</p>
          <div className="mt-4 flex gap-3">
            {project.demoLink && (
              <a href={project.demoLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                className="flex items-center gap-1 text-xs text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded">
                <ExternalLink size={14} /> Demo
              </a>
            )}
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded">
                <Github size={14} /> Code
              </a>
            )}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

/** Modal with Z-translate entry and animated backdrop blur */
const ProjectModal = ({ project, onClose }: { project: Project; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
    animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
    transition={{ duration: 0.3 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 p-6"
    onClick={onClose}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.92, z: -100 }}
      animate={{ opacity: 1, scale: 1, z: 0 }}
      exit={{ opacity: 0, scale: 0.92, z: -100 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onClick={e => e.stopPropagation()}
      className="glass-strong w-full max-w-2xl rounded-2xl overflow-hidden"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="relative">
        {project.image && (
          <img src={project.image} alt={project.title} className="h-64 w-full object-cover" />
        )}
        <button onClick={onClose} className="absolute top-4 right-4 rounded-full glass p-2 text-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary">
          <X size={20} />
        </button>
      </div>
      <div className="p-8">
        <h3 className="font-display text-2xl font-bold gradient-text">{project.title}</h3>
        <p className="mt-4 text-muted-foreground leading-relaxed">{project.description}</p>
        <div className="mt-6 flex gap-4">
          {project.demoLink && (
            <a href={project.demoLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 glass neon-glow rounded-full px-6 py-2 text-sm text-primary hover:neon-glow-strong focus:outline-none focus:ring-2 focus:ring-primary">
              <ExternalLink size={16} /> Live Demo
            </a>
          )}
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-muted px-6 py-2 text-sm text-foreground hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary">
              <Github size={16} /> Source Code
            </a>
          )}
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const Projects = ({ projects }: ProjectsProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [selected, setSelected] = useState<Project | null>(null);

  const displayProjects = projects.length > 0 ? projects : [
    { title: "Project One", description: "A modern web application built with React and Firebase.", image: "", demoLink: "#", githubLink: "#" },
    { title: "Project Two", description: "An AI-powered dashboard with real-time analytics.", image: "", demoLink: "#", githubLink: "#" },
    { title: "Project Three", description: "Mobile-first e-commerce platform with seamless UX.", image: "", demoLink: "#", githubLink: "#" },
  ];

  return (
    <section id="projects" className="py-24 px-6" ref={ref}>
      <div className="container mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center font-display text-4xl font-bold gradient-text"
        >
          Featured Projects
        </motion.h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {displayProjects.map((project, i) => (
            <ProjectCard key={i} project={project as Project} index={i} onClick={() => setSelected(project as Project)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
