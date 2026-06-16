import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Settings, Flame, Sparkles, Calendar, Heart, ChevronRight, BookOpen, Trophy, Bell } from "lucide-react";

export const Route = createFileRoute("/me")({
  head: () => ({
    meta: [
      { title: "我 · 我的成长数据" },
      { name: "description", content: "我的能量、情绪日历、成就与设置。" },
    ],
  }),
  component: Me,
});

const stats = [
  { icon: Flame, label: "连续打卡", value: "12 天", color: "var(--berry)" },
  { icon: Sparkles, label: "总能量", value: "1,420", color: "var(--primary)" },
  { icon: Trophy, label: "完成挑战", value: "37", color: "var(--sun)" },
];

const menu = [
  { icon: Calendar, label: "情绪日历", to: "/emotion" as const, desc: "看见每天的感受" },
  { icon: Heart, label: "我的微言", to: "/weiyan" as const, desc: "对内心说的话" },
  { icon: BookOpen, label: "成长数据看板", to: "/me" as const, desc: "行为·想法·感受·需求" },
  { icon: Bell, label: "亲子推送", to: "/me" as const, desc: "给爸爸妈妈的提醒" },
];

function Me() {
  return (
    <AppShell bgClass="bg-gradient-to-b from-[oklch(0.92_0.07_45)] to-background">
      <header className="flex items-center justify-between px-5 pt-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Me</p>
          <h1 className="mt-1 text-3xl">我的主页 ✨</h1>
        </div>
        <button aria-label="设置" className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-sm">
          <Settings className="h-5 w-5 text-foreground/70" />
        </button>
      </header>

      {/* user card */}
      <section className="mt-5 px-4">
        <div className="card-pop flex items-center gap-4 p-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-3xl">🧒</div>
          <div className="flex-1">
            <p className="text-lg font-bold">小豆 · Lv.4</p>
            <p className="text-xs text-muted-foreground">12 岁 · 今天也是温柔的一天</p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full w-2/3 rounded-full" style={{ background: "var(--gradient-sun)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* stats */}
      <section className="mt-3 grid grid-cols-3 gap-2 px-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card-pop flex flex-col items-center gap-1 p-3">
              <Icon className="h-5 w-5" style={{ color: s.color }} />
              <p className="text-base font-bold">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          );
        })}
      </section>

      {/* menu */}
      <section className="mt-4 px-4">
        <ul className="card-pop divide-y divide-border overflow-hidden">
          {menu.map((m) => {
            const Icon = m.icon;
            return (
              <li key={m.label}>
                <Link to={m.to} className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{m.label}</p>
                    <p className="text-xs text-muted-foreground">{m.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-4 px-4">
        <div className="card-pop bg-gradient-to-r from-[oklch(0.88_0.1_230)] to-[oklch(0.9_0.07_280)] p-4">
          <p className="text-xs font-bold uppercase text-primary">家长端入口</p>
          <p className="mt-1 text-sm font-bold">让爸爸妈妈也看见你的成长</p>
          <p className="mt-0.5 text-xs text-foreground/70">数据分享 · 沟通建议 · 一件好事</p>
        </div>
      </section>
    </AppShell>
  );
}
