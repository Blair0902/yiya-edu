import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import petImg from "@/assets/pet.png";
import sceneImg from "@/assets/scene.jpg";
import { Sparkles, Plus, Check, Flame } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "豆豆星球 · 亲子微习惯" },
      { name: "description", content: "和孩子一起养宠物，培养每日小小好习惯。" },
    ],
  }),
  component: Home,
});

const initialHabits = [
  { id: 1, emoji: "🪥", title: "认真刷牙", who: "宝宝", energy: 10, done: true },
  { id: 2, emoji: "📚", title: "亲子共读 10 分钟", who: "家长", energy: 15, done: false },
  { id: 3, emoji: "🧦", title: "自己穿袜子", who: "宝宝", energy: 8, done: false },
  { id: 4, emoji: "🥦", title: "吃一口蔬菜", who: "宝宝", energy: 12, done: false },
];

function Home() {
  const [habits, setHabits] = useState(initialHabits);
  const done = habits.filter((h) => h.done).length;
  const total = habits.length;
  const energy = habits.filter((h) => h.done).reduce((s, h) => s + h.energy, 0);

  const toggle = (id: number) =>
    setHabits((hs) => hs.map((h) => (h.id === id ? { ...h, done: !h.done } : h)));

  return (
    <AppShell>
      <div className="relative">
        <div
          className="relative h-72 w-full overflow-hidden"
          style={{ backgroundImage: `url(${sceneImg})`, backgroundSize: "cover", backgroundPosition: "center bottom" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <div className="pill flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-primary" />连续 12 天</div>
          </div>
          <div className="absolute right-4 top-4 pill flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> {energy} 能量
          </div>
          <img
            src={petImg}
            alt="宠物豆豆"
            width={768}
            height={768}
            className="absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 drop-shadow-xl"
          />
        </div>

        <section className="-mt-4 px-4">
          <div className="card-pop p-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">今日进度</p>
                <h2 className="text-2xl">{done} / {total} 个小习惯</h2>
              </div>
              <span className="text-3xl">{done === total ? "🥳" : "💪"}</span>
            </div>
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(done / total) * 100}%`, background: "var(--gradient-sun)" }}
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {done === total ? "今天太棒啦！豆豆开心地跳起来了～" : "再完成几个，豆豆就要升级啦！"}
            </p>
          </div>
        </section>

        <section className="mt-5 px-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg">今日小习惯</h3>
            <button className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground shadow-sm">
              <Plus className="h-4 w-4" /> 添加
            </button>
          </div>
          <ul className="flex flex-col gap-3">
            {habits.map((h) => (
              <li key={h.id} className="card-pop flex items-center gap-3 p-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-2xl">
                  {h.emoji}
                </div>
                <div className="flex-1">
                  <p className={`font-bold ${h.done ? "text-muted-foreground line-through" : ""}`}>{h.title}</p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-accent px-2 py-0.5 font-semibold text-accent-foreground">{h.who}</span>
                    <span className="flex items-center gap-0.5"><Sparkles className="h-3 w-3" />+{h.energy}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggle(h.id)}
                  aria-label="完成"
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    h.done
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-transparent"
                  }`}
                >
                  <Check className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
