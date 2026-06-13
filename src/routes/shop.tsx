import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/shop")({
  head: () => ({ meta: [{ title: "商店 · 豆豆星球" }, { name: "description", content: "用能量币给豆豆换装、布置小窝。" }] }),
  component: Shop,
});

const cats = ["✨ 装扮", "🪑 家具", "🎨 颜色", "🚀 旅行"];
const items = [
  { name: "草莓帽子", emoji: "🍓", price: 80, tag: "新品" },
  { name: "小熊背包", emoji: "🎒", price: 120 },
  { name: "云朵沙发", emoji: "☁️", price: 200, tag: "热门" },
  { name: "星星灯", emoji: "⭐", price: 60 },
  { name: "彩虹围巾", emoji: "🧣", price: 90 },
  { name: "小木屋", emoji: "🏡", price: 350 },
];

function Shop() {
  return (
    <AppShell bgClass="bg-[oklch(0.96_0.04_85)]">
      <header className="px-5 pb-3 pt-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Shop</p>
            <h1 className="mt-1 text-3xl">豆豆商店 🛍️</h1>
          </div>
          <div className="pill flex items-center gap-1 bg-card">
            <Sparkles className="h-4 w-4 text-primary" /> 420
          </div>
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto px-5 pb-4 text-sm">
        {cats.map((c, i) => (
          <button key={c} className={`whitespace-nowrap rounded-full px-4 py-2 font-bold shadow-sm ${i === 0 ? "bg-primary text-primary-foreground" : "bg-card text-foreground"}`}>{c}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 px-4">
        {items.map((it) => (
          <article key={it.name} className="card-pop relative flex flex-col items-center p-4">
            {it.tag && (
              <span className="absolute left-2 top-2 rounded-full bg-berry px-2 py-0.5 text-[10px] font-bold text-primary-foreground">{it.tag}</span>
            )}
            <div className="flex h-24 w-full items-center justify-center rounded-xl bg-secondary text-5xl">{it.emoji}</div>
            <h3 className="mt-2 text-base">{it.name}</h3>
            <button className="mt-2 flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground shadow-sm">
              <Sparkles className="h-3.5 w-3.5" /> {it.price}
            </button>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
