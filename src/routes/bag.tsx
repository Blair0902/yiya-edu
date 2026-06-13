import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Backpack } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/bag")({
  head: () => ({ meta: [{ title: "背包 · 豆豆星球" }, { name: "description", content: "查看已获得的装扮、家具、道具与奖励。" }] }),
  component: Bag,
});

const tabs = ["全部", "装扮", "家具", "道具", "奖励"] as const;

const items = [
  { e: "🎩", n: "魔法师帽", t: "装扮", count: 1, rare: "稀有" },
  { e: "🧣", n: "彩虹围巾", t: "装扮", count: 1 },
  { e: "👟", n: "小红鞋", t: "装扮", count: 2 },
  { e: "🛏️", n: "云朵小床", t: "家具", count: 1 },
  { e: "🪴", n: "幸运绿植", t: "家具", count: 3 },
  { e: "🍎", n: "能量苹果", t: "道具", count: 8 },
  { e: "💎", n: "心愿水晶", t: "道具", count: 2, rare: "限定" },
  { e: "🏅", n: "7 日早睡奖章", t: "奖励", count: 1 },
  { e: "✉️", n: "妈妈的小纸条", t: "奖励", count: 3 },
];

function Bag() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("全部");
  const list = tab === "全部" ? items : items.filter((i) => i.t === tab);
  return (
    <AppShell bgClass="bg-gradient-to-b from-[oklch(0.86_0.13_60)] to-[oklch(0.92_0.08_60)]">
      <header className="px-5 pt-8">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card shadow-sm">
            <Backpack className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-foreground/80">My Bag</p>
            <h1 className="text-3xl text-primary-foreground">豆豆的背包</h1>
          </div>
        </div>
      </header>

      <div className="mt-4 flex gap-2 overflow-x-auto px-5 pb-3 text-sm">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 font-bold ${tab === t ? "bg-card text-primary shadow-sm" : "bg-card/40 text-primary-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-t-3xl bg-background px-4 pt-5">
        <div className="grid grid-cols-3 gap-3 pb-6">
          {list.map((i) => (
            <article key={i.n} className="card-pop relative flex flex-col items-center p-3">
              {i.rare && (
                <span className="absolute right-1.5 top-1.5 rounded-full bg-berry px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">{i.rare}</span>
              )}
              <div className="flex h-16 w-full items-center justify-center rounded-xl bg-secondary text-3xl">{i.e}</div>
              <p className="mt-1.5 text-center text-xs font-bold leading-tight">{i.n}</p>
              <p className="text-[10px] text-muted-foreground">× {i.count}</p>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
