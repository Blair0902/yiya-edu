import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { UserPlus, Crown, Flame } from "lucide-react";

export const Route = createFileRoute("/friends")({
  head: () => ({ meta: [{ title: "好友 · 豆豆星球" }, { name: "description", content: "邀请家人朋友一起养宠物。" }] }),
  component: Friends,
});

const family = [
  { name: "妈妈", emoji: "👩", streak: 28, role: "家长" },
  { name: "爸爸", emoji: "👨", streak: 14, role: "家长" },
  { name: "豆宝", emoji: "🧒", streak: 12, role: "宝宝", me: true },
  { name: "外婆", emoji: "👵", streak: 6, role: "家长" },
];

function Friends() {
  return (
    <AppShell bgClass="bg-[oklch(0.96_0.04_140)]">
      <header className="px-5 pb-2 pt-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Family</p>
        <h1 className="mt-1 text-3xl">小家庭 🌳</h1>
        <p className="mt-1 text-sm text-muted-foreground">一起打卡，宠物成长更快～</p>
      </header>

      <div className="px-4 pt-3">
        <button className="card-pop flex w-full items-center justify-center gap-2 bg-card py-3 text-base font-bold text-primary">
          <UserPlus className="h-5 w-5" /> 邀请家人
        </button>
      </div>

      <section className="mt-5 px-4">
        <h3 className="mb-2 flex items-center gap-1 text-lg"><Crown className="h-5 w-5 text-sun" /> 本周排行</h3>
        <ul className="flex flex-col gap-2">
          {[...family].sort((a, b) => b.streak - a.streak).map((m, i) => (
            <li key={m.name} className={`card-pop flex items-center gap-3 p-3 ${m.me ? "ring-2 ring-primary" : ""}`}>
              <span className="w-5 text-center font-black text-muted-foreground">{i + 1}</span>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-2xl">{m.emoji}</div>
              <div className="flex-1">
                <p className="font-bold">{m.name} {m.me && <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground">我</span>}</p>
                <p className="text-xs text-muted-foreground">{m.role}</p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm font-bold text-primary">
                <Flame className="h-3.5 w-3.5" /> {m.streak}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-5 px-4">
        <div className="card-pop flex items-center gap-3 bg-gradient-to-r from-[oklch(0.88_0.1_85)] to-[oklch(0.86_0.13_60)] p-4">
          <span className="text-3xl">🐮</span>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase text-primary">限定奖励</p>
            <p className="text-sm font-bold">邀请 3 位家人，解锁小奶牛宠物！</p>
          </div>
          <button className="rounded-full bg-card px-3 py-1.5 text-sm font-bold">去邀请</button>
        </div>
      </section>
    </AppShell>
  );
}
