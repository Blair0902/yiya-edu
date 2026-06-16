import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import petImg from "@/assets/pet.png";
import { Pencil, Sparkles, Backpack, Home as HomeIcon, School, TreePalm, Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/pet")({
  head: () => ({
    meta: [
      { title: "豆豆 · 生活空间 & 背包" },
      { name: "description", content: "豆豆的家、学校、游乐场和背包。" },
    ],
  }),
  component: Pet,
});

const spaces = [
  { key: "家", icon: HomeIcon, bg: "oklch(0.92 0.05 60)" },
  { key: "学校", icon: School, bg: "oklch(0.9 0.06 230)" },
  { key: "游乐场", icon: TreePalm, bg: "oklch(0.9 0.08 145)" },
  { key: "自定义", icon: Plus, bg: "oklch(0.93 0.04 320)" },
] as const;

const itemsByTab: Record<string, { e: string; n: string; count: number; rare?: string }[]> = {
  装扮: [
    { e: "🎩", n: "魔法师帽", count: 1, rare: "稀有" },
    { e: "🧣", n: "彩虹围巾", count: 1 },
    { e: "👟", n: "小红鞋", count: 2 },
  ],
  家具: [
    { e: "🛏️", n: "云朵小床", count: 1 },
    { e: "🪴", n: "幸运绿植", count: 3 },
    { e: "📚", n: "书架", count: 1 },
  ],
  道具: [
    { e: "🍎", n: "能量苹果", count: 8 },
    { e: "💎", n: "心愿水晶", count: 2, rare: "限定" },
  ],
  奖励: [
    { e: "🏅", n: "7 日早睡奖章", count: 1 },
    { e: "✉️", n: "妈妈的小纸条", count: 3 },
  ],
};

const bagTabs = ["装扮", "家具", "道具", "奖励"] as const;

function Pet() {
  const [view, setView] = useState<"space" | "bag">("space");
  const [space, setSpace] = useState<(typeof spaces)[number]["key"]>("家");
  const [bagTab, setBagTab] = useState<(typeof bagTabs)[number]>("装扮");
  const list = itemsByTab[bagTab];

  return (
    <AppShell bgClass="bg-gradient-to-b from-[oklch(0.9_0.06_60)] to-[oklch(0.96_0.04_80)]">
      <header className="flex items-center justify-between px-5 pt-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">My Doudou</p>
          <h1 className="mt-1 text-3xl">豆豆 🐣</h1>
        </div>
        <button className="flex items-center gap-1 rounded-full bg-card px-3 py-2 text-sm font-bold shadow-sm">
          <Pencil className="h-4 w-4" /> 装饰
        </button>
      </header>

      {/* segmented control: 生活空间 / 背包 */}
      <div className="mx-4 mt-4 flex rounded-full bg-card p-1 shadow-sm">
        {[
          { k: "space", label: "生活空间" },
          { k: "bag", label: "背包" },
        ].map((s) => (
          <button
            key={s.k}
            onClick={() => setView(s.k as "space" | "bag")}
            className={`flex-1 rounded-full py-2 text-sm font-bold transition-all ${
              view === s.k ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {view === "space" ? (
        <>
          {/* space tabs */}
          <div className="mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
            {spaces.map((sp) => {
              const Icon = sp.icon;
              const active = sp.key === space;
              return (
                <button
                  key={sp.key}
                  onClick={() => setSpace(sp.key)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-bold ${
                    active ? "bg-primary text-primary-foreground" : "bg-card text-foreground/70"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {sp.key}
                </button>
              );
            })}
          </div>

          {/* scene */}
          <div className="mx-4 mt-3 overflow-hidden rounded-3xl shadow-inner" style={{ background: spaces.find((s) => s.key === space)!.bg }}>
            <div className="relative h-72 w-full">
              <div className="absolute inset-x-0 top-0 h-2/3 bg-[repeating-linear-gradient(45deg,_oklch(0.88_0.06_60_/_0.4)_0_10px,_transparent_10px_20px)]" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[oklch(0.8_0.08_50)]" />
              {space === "家" && (
                <>
                  <div className="absolute left-4 top-4 text-4xl">🪟</div>
                  <div className="absolute right-4 top-6 text-4xl">🖼️</div>
                  <div className="absolute left-3 bottom-20 text-4xl">📚</div>
                  <div className="absolute right-8 bottom-2 text-4xl">🛏️</div>
                </>
              )}
              {space === "学校" && (
                <>
                  <div className="absolute left-4 top-4 text-4xl">🏫</div>
                  <div className="absolute right-4 top-6 text-4xl">🧮</div>
                  <div className="absolute left-3 bottom-16 text-4xl">📐</div>
                  <div className="absolute right-8 bottom-2 text-4xl">🪑</div>
                </>
              )}
              {space === "游乐场" && (
                <>
                  <div className="absolute left-4 top-4 text-4xl">🎡</div>
                  <div className="absolute right-4 top-6 text-4xl">🎈</div>
                  <div className="absolute left-3 bottom-16 text-4xl">🛝</div>
                  <div className="absolute right-8 bottom-2 text-4xl">🎠</div>
                </>
              )}
              {space === "自定义" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-foreground/60">
                  <Plus className="h-10 w-10" />
                  <p className="mt-2 text-sm font-bold">命名你的专属空间</p>
                </div>
              )}
              <img src={petImg} alt="豆豆" width={768} height={768} className="absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2" />
            </div>
          </div>

          <section className="mt-4 px-4">
            <div className="card-pop flex items-center gap-3 bg-gradient-to-r from-[oklch(0.88_0.1_85)] to-[oklch(0.86_0.13_60)] p-4">
              <Sparkles className="h-7 w-7 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-bold">让朋友来串门</p>
                <p className="text-xs text-foreground/70">开启好友空间访问</p>
              </div>
              <button className="rounded-full bg-card px-3 py-1.5 text-sm font-bold">开启</button>
            </div>
          </section>
        </>
      ) : (
        <>
          <div className="mt-4 flex items-center gap-2 px-5">
            <Backpack className="h-5 w-5 text-primary" />
            <h2 className="text-lg">豆豆的背包</h2>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto px-5 pb-3 text-sm">
            {bagTabs.map((t) => (
              <button
                key={t}
                onClick={() => setBagTab(t)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 font-bold ${
                  bagTab === t ? "bg-primary text-primary-foreground" : "bg-card text-foreground/70"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="px-4">
            <div className="grid grid-cols-3 gap-3 pb-6">
              {list.map((i) => (
                <article key={i.n} className="card-pop relative flex flex-col items-center p-3">
                  {i.rare && (
                    <span className="absolute right-1.5 top-1.5 rounded-full bg-berry px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">
                      {i.rare}
                    </span>
                  )}
                  <div className="flex h-16 w-full items-center justify-center rounded-xl bg-secondary text-3xl">{i.e}</div>
                  <p className="mt-1.5 text-center text-xs font-bold leading-tight">{i.n}</p>
                  <p className="text-[10px] text-muted-foreground">× {i.count}</p>
                </article>
              ))}
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
