import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { FireworksCanvas } from "@/components/Fireworks";
import { BookOpen, Calculator, Languages, Scroll, Brain, HardHat, Sparkles } from "lucide-react";
import { useState, useRef } from "react";

export const Route = createFileRoute("/challenges")({
  head: () => ({ meta: [{ title: "挑战 · 学科打卡" }, { name: "description", content: "学科能力、古诗文与 AI 时代核心能力打卡。" }] }),
  component: Challenges,
});

type Item = { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; name: string; energy: number; done: number; total: number; color: string; tag?: string };

type Group = { title: string; items: Item[] };

const initialGroups: Group[] = [
  {
    title: "学科能力",
    items: [
      { icon: BookOpen, name: "语文 · 一日一句", energy: 15, done: 3, total: 5, color: "oklch(0.86 0.12 25)" },
      { icon: Calculator, name: "数学 · 口算 10 题", energy: 15, done: 1, total: 3, color: "oklch(0.82 0.13 230)" },
      { icon: Languages, name: "英语 · 5 单词成文", energy: 20, done: 0, total: 1, color: "oklch(0.82 0.14 150)", tag: "AI 生成" },
    ],
  },
  {
    title: "文化素养",
    items: [
      { icon: Scroll, name: "古诗文 · 每日一诵", energy: 12, done: 7, total: 7, color: "oklch(0.8 0.13 60)" },
      { icon: Sparkles, name: "754 · 思维训练", energy: 18, done: 2, total: 3, color: "oklch(0.78 0.16 320)" },
    ],
  },
  {
    title: "AI 时代核心能力",
    items: [
      { icon: Brain, name: "思辨：今天的一个为什么", energy: 20, done: 0, total: 1, color: "oklch(0.74 0.16 280)" },
      { icon: HardHat, name: "六顶思考帽 · 角色练习", energy: 25, done: 1, total: 1, color: "oklch(0.72 0.18 35)", tag: "新" },
    ],
  },
];

function Challenges() {
  const [groups, setGroups] = useState(initialGroups);
  const [showFireworks, setShowFireworks] = useState(false);
  const fireworksTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const handleCheckIn = (groupIndex: number, itemIndex: number) => {
    setGroups((gs) => {
      const g = gs[groupIndex];
      const it = g.items[itemIndex];
      if (it.done >= it.total) return gs;
      const updated: Group[] = gs.map((grp, gi) =>
        gi !== groupIndex
          ? grp
          : {
              ...grp,
              items: grp.items.map((item, ii) =>
                ii !== itemIndex ? item : { ...item, done: Math.min(item.done + 1, item.total) }
              ),
            }
      );
      const newDone = updated[groupIndex].items[itemIndex].done;
      const newPct = (newDone / it.total) * 100;
      if (newPct === 100) {
        setShowFireworks(true);
        if (fireworksTimer.current) clearTimeout(fireworksTimer.current);
        fireworksTimer.current = setTimeout(() => setShowFireworks(false), 2500);
      }
      return updated;
    });
  };

  return (
    <AppShell>
      <div className="relative">
        <FireworksCanvas active={showFireworks} />
        <header className="px-5 pb-3 pt-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Challenges</p>
          <h1 className="mt-1 text-3xl">学科打卡 🏆</h1>
          <p className="mt-1 text-sm text-muted-foreground">每完成一项任务，豆豆都会闪闪发光～</p>
        </header>

        {groups.map((g, gi) => (
          <section key={g.title} className="mt-2 px-4 pb-2">
            <h3 className="mb-2 px-1 text-sm font-bold text-muted-foreground">{g.title}</h3>
            <ul className="flex flex-col gap-3">
              {g.items.map((it, ii) => {
                const pct = (it.done / it.total) * 100;
                const Icon = it.icon;
                const finished = pct === 100;
                return (
                  <li key={it.name} className="card-pop p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: `color-mix(in oklab, ${it.color} 20%, white)` }}>
                        <Icon className="h-6 w-6" style={{ color: it.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold leading-tight">{it.name}</h4>
                          {it.tag && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">{it.tag}</span>}
                        </div>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-primary">
                          <Sparkles className="h-3 w-3" /> +{it.energy} 能量 · {it.done}/{it.total}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCheckIn(gi, ii)}
                        disabled={finished}
                        className={`rounded-full px-3 py-1.5 text-sm font-bold transition-all ${finished ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground active:scale-95"}`}
                      >
                        {finished ? "已完成" : "打卡"}
                      </button>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: it.color }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
