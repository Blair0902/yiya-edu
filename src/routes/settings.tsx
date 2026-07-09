import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  ArrowLeft, Copy, Zap, Target, BarChart3, Newspaper,
  CalendarDays, PawPrint, Bell, Lock, HelpCircle, LogOut, Sparkles, Users,
} from "lucide-react";
import { usePet, savePet } from "@/lib/pet-store";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "设置 · 豆豆星球" }] }),
  component: SettingsPage,
});

const tiles = [
  { icon: Zap, label: "活动记录", color: "oklch(0.78 0.16 60)", to: "/journal" },
  { icon: Sparkles, label: "我的自照区", color: "oklch(0.72 0.15 320)", to: "/me" },
  { icon: Target, label: "我的目标", color: "oklch(0.78 0.15 145)", to: "/challenges" },
  { icon: BarChart3, label: "数据洞察", color: "oklch(0.74 0.16 230)", to: "/me" },
  { icon: Newspaper, label: "周报", color: "oklch(0.74 0.13 30)", to: "/me" },
  { icon: CalendarDays, label: "历史日签", color: "oklch(0.7 0.16 280)", to: "/journal" },
] as const;

const rows = [
  { icon: PawPrint, label: "宠物自定义", to: "/pet" },
  { icon: Bell, label: "通知提醒" },
  { icon: Lock, label: "隐私与数据" },
  { icon: HelpCircle, label: "帮助与反馈" },
  { icon: LogOut, label: "退出登录", danger: true },
];

function SettingsPage() {
  const pet = usePet();
  return (
    <AppShell>
      <div className="px-4 pb-10 pt-6">
        <Link to="/" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-sm">
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="card-pop mt-4 flex items-center justify-between p-4">
          <div>
            <h2 className="text-lg leading-tight">
              <span className="font-bold">{pet.name}</span> <span className="text-muted-foreground">& 成长中</span>
            </h2>
            <p className="mt-1 flex items-center gap-1 text-xs font-mono text-muted-foreground">
              DOUDOU-7F3A2K <Copy className="h-3 w-3" />
            </p>
          </div>
          <div className="text-3xl">🐥</div>
        </div>

        {/* Mode switcher — student/parent lives ONLY here now */}
        <div className="card-pop mt-3 p-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <p className="text-xs font-bold uppercase tracking-widest text-primary">使用者</p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">选择当前使用豆豆星球的人</p>
          <div className="mt-3 flex rounded-full bg-secondary p-0.5">
            {[
              { k: "student", label: "学生端" },
              { k: "parent", label: "家长端" },
            ].map((m) => (
              <button
                key={m.k}
                onClick={() => savePet({ mode: m.k as "student" | "parent" })}
                className={`flex-1 rounded-full py-2 text-sm font-bold transition-all ${
                  pet.mode === m.k ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 rounded-3xl bg-[oklch(0.74_0.16_45)] p-4 text-primary-foreground shadow-sm">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🌱</div>
            <div className="flex-1">
              <p className="text-sm font-bold">加入家庭小组</p>
              <p className="text-xs opacity-90">和爸爸妈妈一起照顾豆豆</p>
            </div>
            <button className="rounded-full bg-card px-3 py-1.5 text-xs font-bold text-foreground">邀请</button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {tiles.map((t) => {
            const Icon = t.icon;
            return (
              <Link key={t.label} to={t.to} className="card-pop flex items-center gap-3 p-4 active:scale-[0.98]">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: `color-mix(in oklab, ${t.color} 22%, white)` }}
                >
                  <Icon className="h-4 w-4" style={{ color: t.color }} />
                </span>
                <span className="text-sm font-bold leading-tight">{t.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-4 rounded-3xl bg-gradient-to-br from-[oklch(0.74_0.16_45)] to-[oklch(0.78_0.18_25)] p-4 text-primary-foreground shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-base font-bold">豆豆星球 PLUS</p>
              <p className="mt-0.5 text-xs opacity-90">解锁全部练习与 AI 沟通建议</p>
            </div>
            <button className="rounded-full bg-card px-3 py-1.5 text-xs font-bold text-foreground">7 天免费试用</button>
          </div>
        </div>

        <p className="mt-5 px-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">通用</p>
        <ul className="card-pop mt-2 divide-y divide-border/60 overflow-hidden">
          {rows.map((r) => {
            const Icon = r.icon;
            const body = (
              <div className={`flex items-center gap-3 px-4 py-3 ${r.danger ? "text-destructive" : ""}`}>
                <Icon className="h-4 w-4" />
                <span className="flex-1 text-sm font-bold">{r.label}</span>
                <span className="text-muted-foreground">›</span>
              </div>
            );
            return (
              <li key={r.label} className="active:bg-secondary/60">
                {r.to ? <Link to={r.to}>{body}</Link> : <button className="w-full text-left">{body}</button>}
              </li>
            );
          })}
        </ul>

        <p className="mt-6 text-center text-xs text-muted-foreground">v1.0.0 · 豆豆星球</p>
      </div>
    </AppShell>
  );
}
