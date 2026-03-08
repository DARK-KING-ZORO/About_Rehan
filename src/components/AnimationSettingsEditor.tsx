/**
 * AnimationSettingsEditor — Admin panel for animation configuration.
 * Controls particles, parallax, sphere, cursor, and mobile settings.
 */
import { useState, useEffect } from "react";
import { Save, Sparkles } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { saveAnimationSettings, type AnimationSettings } from "@/lib/animation-settings";

const defaults: AnimationSettings = {
  particlesDensity: "med",
  parallaxStrength: 0.5,
  enableSkillSphere: true,
  disableAnimationsOnMobile: true,
  enableGlowCursor: true,
};

const AnimationSettingsEditor = () => {
  const [settings, setSettings] = useState<AnimationSettings>(defaults);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "animations"));
        if (snap.exists()) setSettings({ ...defaults, ...snap.data() } as AnimationSettings);
      } catch {}
    };
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    await saveAnimationSettings(settings);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles size={20} className="text-primary" />
        <h2 className="font-display text-2xl font-bold gradient-text">Animation Settings</h2>
      </div>
      <p className="text-sm text-muted-foreground">Configure visual effects for the portfolio. Changes apply in real-time.</p>

      {/* Particles Density */}
      <div className="glass rounded-xl p-5 space-y-3">
        <label className="text-sm font-medium text-foreground">Particles Density</label>
        <div className="flex gap-2">
          {(["low", "med", "high"] as const).map(d => (
            <button
              key={d}
              onClick={() => setSettings({ ...settings, particlesDensity: d })}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                settings.particlesDensity === d ? "glass neon-glow text-primary" : "bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Parallax Strength */}
      <div className="glass rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Parallax Strength</label>
          <span className="text-sm text-primary font-mono">{settings.parallaxStrength.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={settings.parallaxStrength}
          onChange={e => setSettings({ ...settings, parallaxStrength: Number(e.target.value) })}
          className="w-full accent-primary"
        />
      </div>

      {/* Toggles */}
      {[
        { key: "enableSkillSphere" as const, label: "3D Skill Sphere", desc: "Show rotating Three.js sphere in skills section" },
        { key: "enableGlowCursor" as const, label: "Glowing Cursor", desc: "Neon glow effect following cursor on desktop" },
        { key: "disableAnimationsOnMobile" as const, label: "Disable Animations on Mobile", desc: "Reduce effects on mobile/low-power devices" },
      ].map(({ key, label, desc }) => (
        <div key={key} className="glass rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, [key]: !settings[key] })}
            className={`relative h-7 w-12 rounded-full transition-colors ${
              settings[key] ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-foreground transition-transform ${
                settings[key] ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      ))}

      <button
        onClick={save}
        disabled={saving}
        className="flex items-center gap-2 glass neon-glow rounded-full px-6 py-2 text-primary hover:neon-glow-strong disabled:opacity-50"
      >
        <Save size={16} /> {saved ? "Saved!" : saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
};

export default AnimationSettingsEditor;
