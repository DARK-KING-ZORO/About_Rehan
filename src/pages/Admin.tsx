import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  getProfile, updateProfile, getSkills, addSkill, updateSkill, deleteSkill,
  getProjects, addProject, updateProject, deleteProject, uploadImage,
  getSocialLinks, updateSocialLinks,
} from "@/lib/firestore";
import type { ProfileData, Skill, Project, SocialLink } from "@/lib/firestore";
import { LogOut, Plus, Trash2, Save, Edit2, X, Upload } from "lucide-react";
import AnimationSettingsEditor from "@/components/AnimationSettingsEditor";

// ─── Login ───
const LoginForm = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch {
      setError("Invalid credentials");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-strong w-full max-w-md rounded-2xl p-8"
      >
        <h1 className="mb-2 font-display text-3xl font-bold gradient-text">Admin Login</h1>
        <p className="mb-8 text-sm text-muted-foreground">Sign in to manage your portfolio</p>
        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full rounded-xl bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
            className="w-full rounded-xl bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary" />
          <button type="submit" disabled={loading}
            className="w-full glass neon-glow rounded-full py-3 font-medium text-primary transition-all hover:neon-glow-strong disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// ─── Profile Editor ───
const ProfileEditor = ({ profile, onSave }: { profile: ProfileData | null; onSave: () => void }) => {
  const [data, setData] = useState<ProfileData>({
    name: "", title: "", about: "", image: "", highlights: [],
    ...profile,
  });
  const [highlightInput, setHighlightInput] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await updateProfile(data);
    onSave();
    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, `profile/${Date.now()}_${file.name}`);
    setData({ ...data, image: url });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold gradient-text">Edit Profile</h2>
      <div className="grid gap-4">
        <input placeholder="Name" value={data.name} onChange={e => setData({ ...data, name: e.target.value })}
          className="w-full rounded-xl bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary" />
        <input placeholder="Title" value={data.title} onChange={e => setData({ ...data, title: e.target.value })}
          className="w-full rounded-xl bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary" />
        <textarea placeholder="About" rows={4} value={data.about} onChange={e => setData({ ...data, about: e.target.value })}
          className="w-full rounded-xl bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary resize-none" />
        <div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <Upload size={16} /> Upload Profile Image
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
          {data.image && <img src={data.image} alt="Profile" className="mt-2 h-20 w-20 rounded-xl object-cover" />}
        </div>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Highlights</p>
          <div className="flex gap-2 flex-wrap mb-2">
            {data.highlights.map((h, i) => (
              <span key={i} className="flex items-center gap-1 glass rounded-full px-3 py-1 text-sm">
                {h}
                <button onClick={() => setData({ ...data, highlights: data.highlights.filter((_, j) => j !== i) })} className="text-destructive"><X size={14} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input placeholder="Add highlight" value={highlightInput} onChange={e => setHighlightInput(e.target.value)}
              className="flex-1 rounded-xl bg-muted/50 px-4 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary" />
            <button onClick={() => { if (highlightInput.trim()) { setData({ ...data, highlights: [...data.highlights, highlightInput.trim()] }); setHighlightInput(""); } }}
              className="glass rounded-full px-4 py-2 text-sm text-primary"><Plus size={16} /></button>
          </div>
        </div>
      </div>
      <button onClick={save} disabled={saving} className="flex items-center gap-2 glass neon-glow rounded-full px-6 py-2 text-primary hover:neon-glow-strong disabled:opacity-50">
        <Save size={16} /> {saving ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
};

// ─── Social Links Editor ───
const SocialEditor = ({ links: initialLinks, onSave }: { links: SocialLink[]; onSave: () => void }) => {
  const [links, setLinks] = useState<SocialLink[]>(initialLinks);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await updateSocialLinks(links);
    onSave();
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold gradient-text">Social Links</h2>
      {links.map((link, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input placeholder="Platform" value={link.platform} onChange={e => { const u = [...links]; u[i] = { ...u[i], platform: e.target.value }; setLinks(u); }}
            className="w-28 rounded-xl bg-muted/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary" />
          <input placeholder="URL" value={link.url} onChange={e => { const u = [...links]; u[i] = { ...u[i], url: e.target.value }; setLinks(u); }}
            className="flex-1 rounded-xl bg-muted/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary" />
          <input placeholder="Icon" value={link.icon} onChange={e => { const u = [...links]; u[i] = { ...u[i], icon: e.target.value }; setLinks(u); }}
            className="w-16 rounded-xl bg-muted/50 px-3 py-2 text-sm text-foreground text-center outline-none focus:ring-2 focus:ring-primary" />
          <button onClick={() => setLinks(links.filter((_, j) => j !== i))} className="text-destructive"><Trash2 size={16} /></button>
        </div>
      ))}
      <button onClick={() => setLinks([...links, { platform: "", url: "", icon: "" }])} className="flex items-center gap-1 text-sm text-primary"><Plus size={16} /> Add Link</button>
      <button onClick={save} disabled={saving} className="flex items-center gap-2 glass neon-glow rounded-full px-6 py-2 text-primary hover:neon-glow-strong disabled:opacity-50">
        <Save size={16} /> {saving ? "Saving..." : "Save Links"}
      </button>
    </div>
  );
};

// ─── Skills Manager ───
const SkillsManager = ({ skills: initialSkills, onUpdate }: { skills: Skill[]; onUpdate: () => void }) => {
  const [skills, setSkills] = useState(initialSkills);
  const [newSkill, setNewSkill] = useState({ name: "", icon: "", level: 50 });
  const [editId, setEditId] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!newSkill.name) return;
    await addSkill({ ...newSkill, order: skills.length });
    setNewSkill({ name: "", icon: "", level: 50 });
    onUpdate();
  };

  const handleUpdate = async (id: string, data: Partial<Skill>) => {
    await updateSkill(id, data);
    onUpdate();
    setEditId(null);
  };

  const handleDelete = async (id: string) => {
    await deleteSkill(id);
    onUpdate();
  };

  useEffect(() => { setSkills(initialSkills); }, [initialSkills]);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold gradient-text">Manage Skills</h2>
      <div className="space-y-3">
        {skills.map((s) => (
          <div key={s.id} className="glass rounded-xl p-4 flex items-center gap-3">
            {editId === s.id ? (
              <>
                <input value={s.name} onChange={e => setSkills(skills.map(sk => sk.id === s.id ? { ...sk, name: e.target.value } : sk))}
                  className="flex-1 rounded-lg bg-muted/50 px-3 py-2 text-sm text-foreground outline-none" />
                <input value={s.icon} onChange={e => setSkills(skills.map(sk => sk.id === s.id ? { ...sk, icon: e.target.value } : sk))}
                  className="w-16 rounded-lg bg-muted/50 px-3 py-2 text-sm text-center outline-none" />
                <input type="number" min={0} max={100} value={s.level} onChange={e => setSkills(skills.map(sk => sk.id === s.id ? { ...sk, level: Number(e.target.value) } : sk))}
                  className="w-16 rounded-lg bg-muted/50 px-3 py-2 text-sm text-center outline-none" />
                <button onClick={() => handleUpdate(s.id!, { name: s.name, icon: s.icon, level: s.level })} className="text-primary"><Save size={16} /></button>
                <button onClick={() => setEditId(null)} className="text-muted-foreground"><X size={16} /></button>
              </>
            ) : (
              <>
                <span className="text-xl">{s.icon || "💻"}</span>
                <span className="flex-1 font-medium text-foreground">{s.name}</span>
                <span className="text-sm text-muted-foreground">{s.level}%</span>
                <button onClick={() => setEditId(s.id!)} className="text-primary"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(s.id!)} className="text-destructive"><Trash2 size={16} /></button>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="glass rounded-xl p-4 flex gap-2 items-center">
        <input placeholder="Skill Name" value={newSkill.name} onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
          className="flex-1 rounded-lg bg-muted/50 px-3 py-2 text-sm text-foreground outline-none" />
        <input placeholder="Icon" value={newSkill.icon} onChange={e => setNewSkill({ ...newSkill, icon: e.target.value })}
          className="w-16 rounded-lg bg-muted/50 px-3 py-2 text-sm text-center outline-none" />
        <input type="number" min={0} max={100} value={newSkill.level} onChange={e => setNewSkill({ ...newSkill, level: Number(e.target.value) })}
          className="w-16 rounded-lg bg-muted/50 px-3 py-2 text-sm text-center outline-none" />
        <button onClick={handleAdd} className="text-primary"><Plus size={16} /></button>
      </div>
    </div>
  );
};

// ─── Project Manager ───
const ProjectManager = ({ projects: initialProjects, onUpdate }: { projects: Project[]; onUpdate: () => void }) => {
  const [projects, setProjects] = useState(initialProjects);
  const [editId, setEditId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<Omit<Project, "id">>({ title: "", description: "", image: "", demoLink: "", githubLink: "", order: 0 });
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { setProjects(initialProjects); }, [initialProjects]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "new" | string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, `projects/${Date.now()}_${file.name}`);
    if (target === "new") {
      setNewProject({ ...newProject, image: url });
    } else {
      setProjects(projects.map(p => p.id === target ? { ...p, image: url } : p));
    }
  };

  const handleAdd = async () => {
    if (!newProject.title) return;
    await addProject({ ...newProject, order: projects.length });
    setNewProject({ title: "", description: "", image: "", demoLink: "", githubLink: "", order: 0 });
    setShowAdd(false);
    onUpdate();
  };

  const handleUpdate = async (id: string) => {
    const p = projects.find(pr => pr.id === id);
    if (!p) return;
    await updateProject(id, { title: p.title, description: p.description, image: p.image, demoLink: p.demoLink, githubLink: p.githubLink });
    setEditId(null);
    onUpdate();
  };

  const handleDelete = async (id: string) => {
    await deleteProject(id);
    onUpdate();
  };

  const ProjectForm = ({ data, onChange, onImageUpload }: {
    data: Omit<Project, "id">; onChange: (d: any) => void; onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <div className="space-y-3">
      <input placeholder="Title" value={data.title} onChange={e => onChange({ ...data, title: e.target.value })}
        className="w-full rounded-xl bg-muted/50 px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary" />
      <textarea placeholder="Description" rows={3} value={data.description} onChange={e => onChange({ ...data, description: e.target.value })}
        className="w-full rounded-xl bg-muted/50 px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary resize-none" />
      <input placeholder="Demo Link" value={data.demoLink} onChange={e => onChange({ ...data, demoLink: e.target.value })}
        className="w-full rounded-xl bg-muted/50 px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary" />
      <input placeholder="GitHub Link" value={data.githubLink} onChange={e => onChange({ ...data, githubLink: e.target.value })}
        className="w-full rounded-xl bg-muted/50 px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary" />
      <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
        <Upload size={16} /> Upload Image
        <input type="file" accept="image/*" onChange={onImageUpload} className="hidden" />
      </label>
      {data.image && <img src={data.image} alt="" className="h-20 rounded-xl object-cover" />}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold gradient-text">Manage Projects</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1 glass rounded-full px-4 py-2 text-sm text-primary">
          <Plus size={16} /> Add Project
        </button>
      </div>

      {showAdd && (
        <div className="glass rounded-2xl p-6 space-y-4">
          <ProjectForm data={newProject} onChange={setNewProject}
            onImageUpload={(e) => handleImageUpload(e, "new")} />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="flex items-center gap-2 glass neon-glow rounded-full px-6 py-2 text-primary"><Save size={16} /> Save</button>
            <button onClick={() => setShowAdd(false)} className="rounded-full px-4 py-2 text-muted-foreground text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {projects.map((p) => (
          <div key={p.id} className="glass rounded-2xl p-6">
            {editId === p.id ? (
              <div className="space-y-4">
                <ProjectForm
                  data={p}
                  onChange={(d) => setProjects(projects.map(pr => pr.id === p.id ? { ...pr, ...d } : pr))}
                  onImageUpload={(e) => handleImageUpload(e, p.id!)}
                />
                <div className="flex gap-2">
                  <button onClick={() => handleUpdate(p.id!)} className="flex items-center gap-2 glass neon-glow rounded-full px-6 py-2 text-sm text-primary"><Save size={16} /> Save</button>
                  <button onClick={() => setEditId(null)} className="text-sm text-muted-foreground">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                {p.image && <img src={p.image} alt={p.title} className="h-16 w-24 rounded-xl object-cover" />}
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-foreground">{p.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{p.description}</p>
                </div>
                <button onClick={() => setEditId(p.id!)} className="text-primary"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(p.id!)} className="text-destructive"><Trash2 size={16} /></button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Admin Page ───
const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"profile" | "social" | "skills" | "projects" | "animations">("profile");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const loadData = async () => {
    try {
      const [p, sk, pr, sl] = await Promise.all([getProfile(), getSkills(), getProjects(), getSocialLinks()]);
      if (p) setProfile(p);
      setSkills(sk);
      setProjects(pr);
      setSocialLinks(sl);
    } catch (e) {
      console.log("Firebase not configured");
    }
  };

  useEffect(() => { if (user) loadData(); }, [user]);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-background"><div className="animate-spin h-8 w-8 rounded-full border-2 border-primary border-t-transparent" /></div>;
  if (!user) return <LoginForm onLogin={() => {}} />;

  const tabs = [
    { key: "profile" as const, label: "Profile" },
    { key: "social" as const, label: "Social" },
    { key: "skills" as const, label: "Skills" },
    { key: "projects" as const, label: "Projects" },
    { key: "animations" as const, label: "✨ Animations" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="glass-strong sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="font-display text-xl font-bold gradient-text">Admin Dashboard</h1>
          <button onClick={() => signOut(auth)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </nav>

      <div className="container mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8 flex gap-2 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all whitespace-nowrap ${tab === t.key ? "glass neon-glow text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {t.label}
            </button>
          ))}
        </div>

        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {tab === "profile" && <ProfileEditor profile={profile} onSave={loadData} />}
          {tab === "social" && <SocialEditor links={socialLinks} onSave={loadData} />}
          {tab === "skills" && <SkillsManager skills={skills} onUpdate={loadData} />}
          {tab === "projects" && <ProjectManager projects={projects} onUpdate={loadData} />}
          {tab === "animations" && <AnimationSettingsEditor />}
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
