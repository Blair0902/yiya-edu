import { useSyncExternalStore } from "react";

export type ShopItem = {
  id: string;
  name: string;
  emoji: string;
  price: number;
  category: "装扮" | "家具" | "颜色" | "旅行";
  tag?: string;
};

export const SHOP_ITEMS: ShopItem[] = [
  { id: "hat-strawberry", name: "草莓帽子", emoji: "🍓", price: 80, category: "装扮", tag: "新品" },
  { id: "backpack-bear", name: "小熊背包", emoji: "🎒", price: 120, category: "装扮" },
  { id: "scarf-rainbow", name: "彩虹围巾", emoji: "🧣", price: 90, category: "装扮" },
  { id: "shoes-red", name: "小红鞋", emoji: "👟", price: 70, category: "装扮" },
  { id: "sofa-cloud", name: "云朵沙发", emoji: "☁️", price: 200, category: "家具", tag: "热门" },
  { id: "lamp-star", name: "星星灯", emoji: "⭐", price: 60, category: "家具" },
  { id: "plant-lucky", name: "幸运绿植", emoji: "🪴", price: 50, category: "家具" },
  { id: "bed-cloud", name: "云朵小床", emoji: "🛏️", price: 180, category: "家具" },
  { id: "house-wood", name: "小木屋", emoji: "🏡", price: 350, category: "旅行" },
  { id: "balloon", name: "彩色气球", emoji: "🎈", price: 40, category: "旅行" },
];

export type WardrobeState = {
  coins: number;
  owned: string[];
  equipped: string[];
};

const KEY = "doudou.wardrobe";
const DEFAULT: WardrobeState = { coins: 420, owned: [], equipped: [] };

const listeners = new Set<() => void>();
let cache: WardrobeState = DEFAULT;
let loaded = false;

function load(): WardrobeState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}
function read(): WardrobeState {
  if (!loaded && typeof window !== "undefined") { cache = load(); loaded = true; }
  return cache;
}
function persist(s: WardrobeState) {
  cache = s; loaded = true;
  window.localStorage.setItem(KEY, JSON.stringify(s));
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

export function buyItem(id: string): { ok: boolean; msg?: string } {
  const it = SHOP_ITEMS.find((x) => x.id === id);
  if (!it) return { ok: false, msg: "商品不存在" };
  const s = read();
  if (s.owned.includes(id)) return { ok: false, msg: "已拥有" };
  if (s.coins < it.price) return { ok: false, msg: "能量币不够" };
  persist({ ...s, coins: s.coins - it.price, owned: [...s.owned, id] });
  return { ok: true };
}

export function toggleEquip(id: string) {
  const s = read();
  if (!s.owned.includes(id)) return;
  const equipped = s.equipped.includes(id)
    ? s.equipped.filter((x) => x !== id)
    : [...s.equipped, id];
  persist({ ...s, equipped });
}

export function useWardrobe(): WardrobeState {
  return useSyncExternalStore(subscribe, read, () => DEFAULT);
}
