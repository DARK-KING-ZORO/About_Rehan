/**
 * Animation Settings Context
 * Provides global animation configuration from Firestore (settings/animations).
 * Portfolio subscribes for live updates; admin can modify settings.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface AnimationSettings {
  particlesDensity: "low" | "med" | "high";
  parallaxStrength: number; // 0–1
  enableSkillSphere: boolean;
  disableAnimationsOnMobile: boolean;
  enableGlowCursor: boolean;
}

const defaults: AnimationSettings = {
  particlesDensity: "med",
  parallaxStrength: 0.5,
  enableSkillSphere: true,
  disableAnimationsOnMobile: true,
  enableGlowCursor: true,
};

const AnimationSettingsContext = createContext<{
  settings: AnimationSettings;
  isMobile: boolean;
  animationsEnabled: boolean;
}>({ settings: defaults, isMobile: false, animationsEnabled: true });

/** Returns particle count based on density and device */
export const getParticleCount = (density: AnimationSettings["particlesDensity"], mobile: boolean) => {
  if (mobile) return density === "high" ? 30 : density === "med" ? 20 : 10;
  return density === "high" ? 100 : density === "med" ? 60 : 30;
};

export const useAnimationSettings = () => useContext(AnimationSettingsContext);

export const AnimationSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AnimationSettings>(defaults);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile / low-power device
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || navigator.maxTouchPoints > 1);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Subscribe to Firestore for live updates
  useEffect(() => {
    try {
      const unsub = onSnapshot(doc(db, "settings", "animations"), (snap) => {
        if (snap.exists()) {
          setSettings({ ...defaults, ...snap.data() } as AnimationSettings);
        }
      });
      return unsub;
    } catch {
      // Firebase not configured — use defaults
    }
  }, []);

  const animationsEnabled = !(settings.disableAnimationsOnMobile && isMobile);

  return (
    <AnimationSettingsContext.Provider value={{ settings, isMobile, animationsEnabled }}>
      {children}
    </AnimationSettingsContext.Provider>
  );
};

/** Save animation settings to Firestore */
export const saveAnimationSettings = async (settings: AnimationSettings) => {
  await setDoc(doc(db, "settings", "animations"), settings, { merge: true });
};
