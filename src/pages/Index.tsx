/**
 * Portfolio Index — Wraps everything in AnimationSettingsProvider.
 * Includes GlowCursor for enhanced UX.
 */
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import GlowCursor from "@/components/GlowCursor";
import { AnimationSettingsProvider } from "@/lib/animation-settings";
import { getProfile, getSkills, getProjects, getSocialLinks } from "@/lib/firestore";
import type { ProfileData, Skill, Project, SocialLink } from "@/lib/firestore";

const Index = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, sk, pr, sl] = await Promise.all([
          getProfile(), getSkills(), getProjects(), getSocialLinks(),
        ]);
        if (p) setProfile(p);
        setSkills(sk);
        setProjects(pr);
        setSocialLinks(sl);
      } catch (e) {
        console.log("Firebase not configured yet, showing demo content");
      }
    };
    load();
  }, []);

  return (
    <AnimationSettingsProvider>
      <LoadingScreen />
      <GlowCursor />
      <Navbar />
      <main>
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Contact socialLinks={socialLinks} />
      </main>
      <Footer />
    </AnimationSettingsProvider>
  );
};

export default Index;
