import { db, storage } from "./firebase";
import {
  doc, getDoc, setDoc, collection, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// --- Profile ---
export interface ProfileData {
  name: string;
  title: string;
  about: string;
  image: string;
  highlights: string[];
}

export const getProfile = async (): Promise<ProfileData | null> => {
  const snap = await getDoc(doc(db, "settings", "profile"));
  return snap.exists() ? (snap.data() as ProfileData) : null;
};

export const updateProfile = async (data: Partial<ProfileData>) => {
  await setDoc(doc(db, "settings", "profile"), data, { merge: true });
};

// --- Social Links ---
export interface SocialLink {
  id?: string;
  platform: string;
  url: string;
  icon: string;
}

export const getSocialLinks = async (): Promise<SocialLink[]> => {
  const snap = await getDocs(collection(db, "socialLinks"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as SocialLink));
};

export const updateSocialLinks = async (links: SocialLink[]) => {
  // Delete all then re-add
  const existing = await getDocs(collection(db, "socialLinks"));
  for (const d of existing.docs) await deleteDoc(d.ref);
  for (const link of links) {
    await addDoc(collection(db, "socialLinks"), { platform: link.platform, url: link.url, icon: link.icon });
  }
};

// --- Skills ---
export interface Skill {
  id?: string;
  name: string;
  icon: string;
  level: number; // 0-100
  order?: number;
}

export const getSkills = async (): Promise<Skill[]> => {
  const snap = await getDocs(query(collection(db, "skills"), orderBy("order", "asc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Skill));
};

export const addSkill = async (skill: Omit<Skill, "id">) => {
  await addDoc(collection(db, "skills"), skill);
};

export const updateSkill = async (id: string, data: Partial<Skill>) => {
  await updateDoc(doc(db, "skills", id), data);
};

export const deleteSkill = async (id: string) => {
  await deleteDoc(doc(db, "skills", id));
};

// --- Projects ---
export interface Project {
  id?: string;
  title: string;
  description: string;
  image: string;
  demoLink: string;
  githubLink: string;
  order?: number;
}

export const getProjects = async (): Promise<Project[]> => {
  const snap = await getDocs(query(collection(db, "projects"), orderBy("order", "asc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
};

export const addProject = async (project: Omit<Project, "id">) => {
  await addDoc(collection(db, "projects"), project);
};

export const updateProject = async (id: string, data: Partial<Project>) => {
  await updateDoc(doc(db, "projects", id), data);
};

export const deleteProject = async (id: string) => {
  await deleteDoc(doc(db, "projects", id));
};

// --- Image Upload ---
export const uploadImage = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};
