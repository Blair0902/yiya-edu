import { useSyncExternalStore } from "react";

export type EnergyEntry = {
  id: string;
  name: string;
  energy: number;
  source: "习惯" | "挑战" | "其它";
  emoji?: string;
  at: number; // ms epoch
};

const KEY = "doudou.energy.ledger";
const BASE = 420;

const listeners = new Set<() => void>();
const EMPTY: EnergyEntry[] = [];
let cache: EnergyEntry[] = EMPTY;
let loaded = false;

function loadFromStorage(): EnergyEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
function read(): EnergyEntry[] {
  if (!loaded && typeof window !== "undefined") {
    cache = loadFromStorage();
    loaded = true;
  }
  return cache;
}
function persist(next: EnergyEntry[]) {
  cache = next;
  loaded = true;
  window.localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = loadFromStorage();
      loaded = true;
      listeners.forEach((l) => l());
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function addEnergy(entry: Omit<EnergyEntry, "id" | "at"> & { at?: number }) {
  const e: EnergyEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    at: entry.at ?? Date.now(),
    ...entry,
  };
  persist([e, ...read()]);
}
export function clearEnergy() {
  persist([]);
}
export function useEnergyLedger(): EnergyEntry[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
export function useEnergyTotal(): number {
  const list = useEnergyLedger();
  return BASE + list.reduce((s, e) => s + e.energy, 0);
}
export const ENERGY_BASE = BASE;
