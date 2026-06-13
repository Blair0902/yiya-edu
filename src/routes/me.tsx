import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Settings, Bell, Shield, HelpCircle, Heart, ChevronRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/me")({
  head: () => ({ meta: [{ title: "我的 · 豆豆星球" }, { name: "description", content: "孩子档案与家长设置。" }] }),
  component: Me,
});

const groups = [
  {
    title: "亲子",
    items: [
      { icon: Shield, label: "家长模式", hint: "查看孩子进度" },
      { icon: Heart, label: "孩子档案", hint: "豆宝 · 4 岁" },
      { icon: Bell, label: "提醒时间", hint: "20:30" },
    ],
  },
  {
    title: "设置",
    items: [
      { icon: Settings, label: "通用设置", hint: "" },
      { icon: HelpCircle, label: "帮助与反馈", hint: "" },
    ],
  },
];

function Me() {
  return (
    <AppShell>
      <header className="bg-gradient-to-b from-[oklch(0.88_0.1_45)] to-[oklch(0.96_0.04_80)] px-5 pb-8 pt-10">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-card text-5xl shadow-md">🧒</div>
          <div className="flex-1">
            <h1 className="text-2xl">豆宝家</h1>
            <p className="text-sm text-foreground/70">已坚持 12 天 · Lv.4</p>
            <div className="mt-2 flex gap-2">
              <span className="pill bg-card">✨ 420 能量</span>
              <span className="pill bg-card">🏆 3 勋章</span>
            </div>
          </div>
        </div>
      </header>

      <section className="-mt-5 px-4">
        <div className="card-pop grid grid-cols-3 divide-x divide-border p-3 text-center">
          {[
            { n: 12, l: "连续天数" },
            { n: 47, l: "完成习惯" },
            { n: 5, l: "解锁奖励" },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-xl font-black text-primary">{s.n}</p>
              <p className="text-xs text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4 px-4">
        <div className="card-pop flex items-center gap-3 bg-gradient-to-r from-[oklch(0.86_0.13_60)] to-[oklch(0.82_0.16_30)] p-4 text-primary-foreground">
          <Sparkles className="h-8 w-8" />
          <div className="flex-1">
            <p className="text-sm font-bold">升级到家庭版</p>
            <p className="text-xs opacity-90">无限挑战、专属宠物</p>
          </div>
          <button className="rounded-full bg-card px-3 py-1.5 text-sm font-bold text-primary">升级</button>
        </div>
      </section>

      {groups.map((g) => (
        <section key={g.title} className="mt-5 px-4">
          <h3 className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">{g.title}</h3>
          <ul className="card-pop divide-y divide-border overflow-hidden">
            {g.items.map((it) => (
              <li key={it.label}>
                <button className="flex w-full items-center gap-3 px-4 py-3 text-left">
                  <it.icon className="h-5 w-5 text-primary" />
                  <span className="flex-1 font-semibold">{it.label}</span>
                  {it.hint && <span className="text-sm text-muted-foreground">{it.hint}</span>}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </AppShell>
  );
}
