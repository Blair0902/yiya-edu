import { useSyncExternalStore } from "react";

export type PetMode = "student" | "parent";

export type PetConfig = {
  adopted: boolean;
  name: string;
  color: string;
  traits: string[];
  personality?: string;
  personalityCode?: string;
  avatar?: string;
  avatarImage?: string;
  eggColor?: string;
  eggPattern?: string;
  mode: PetMode;
  mbti?: string;
  tags?: string[];
};

export const PET_COLORS = [
  { key: "sun", label: "暖阳黄", bg: "oklch(0.88 0.15 80)", emoji: "🐥" },
  { key: "leaf", label: "嫩芽绿", bg: "oklch(0.85 0.13 145)", emoji: "🐸" },
  { key: "berry", label: "莓果粉", bg: "oklch(0.85 0.13 15)", emoji: "🐰" },
  { key: "sky", label: "天空蓝", bg: "oklch(0.85 0.12 230)", emoji: "🐳" },
  { key: "lavender", label: "薰衣紫", bg: "oklch(0.85 0.1 310)", emoji: "🦄" },
] as const;

export const PET_AVATARS = [
  "🐥", "🐰", "🐱", "🐶", "🦊", "🐼", "🐨", "🐯",
  "🐸", "🐳", "🦄", "🐧", "🦉", "🐹", "🐻", "🦁",
] as const;

export const PET_TRAITS = ["勇敢", "温柔", "好奇", "调皮", "细心", "乐观", "安静", "热情"] as const;

const KEY = "doudou.pet";
const DEFAULT: PetConfig = { adopted: false, name: "豆豆", color: "sun", traits: [], mode: "student" };

const listeners = new Set<() => void>();
let cache: PetConfig = DEFAULT;
let cacheLoaded = false;

function loadFromStorage(): PetConfig {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}
function read(): PetConfig {
  if (!cacheLoaded && typeof window !== "undefined") {
    cache = loadFromStorage();
    cacheLoaded = true;
  }
  return cache;
}
function emit() {
  cache = loadFromStorage();
  cacheLoaded = true;
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) emit(); };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(cb); window.removeEventListener("storage", onStorage); };
}

export function savePet(p: Partial<PetConfig>) {
  const merged = { ...read(), ...p };
  window.localStorage.setItem(KEY, JSON.stringify(merged));
  emit();
}
export function resetPet() {
  window.localStorage.removeItem(KEY);
  emit();
}
export function usePet(): PetConfig {
  return useSyncExternalStore(subscribe, read, () => DEFAULT);
}
