import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Sparkles, ChevronLeft, Trash2, Zap } from "lucide-react";
import { useEnergyLedger, useEnergyTotal, clearEnergy, ENERGY_BASE } from "@/lib/energy-store";
import { useMemo } from "react";

export const Route = createFileRoute("/energy")({
  head: () => ({
    meta: [
      { title: "能量账本 · 每次打卡明细" },
      { name: "description", content: "查看每次打卡获得的能量与当前能量总数。" },
    ],
  }),
  component: EnergyPage,
});

function fmt(ts: number) {
  const d = new Date(ts);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${mm}/${dd} ${hh}:${mi}`;
}
function dayKey(ts: number) {
  const d = new Date(ts);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

function EnergyPage() {
  const entries = useEnergyLedger();
  const total = useEnergyTotal();

  const todayGained = useMemo(() => {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    return entries.filter((e) => e.at >= start.getTime()).reduce((s, e) => s + e.energy, 0);
  }, [entries]);

  const grouped = useMemo(() => {
    const m = new Map<string, typeof entries>();
    for (const e of entries) {
      const k = dayKey(e.at);
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(e);
    }
    return Array.from(m.entries());
  }, [entries]);

  return (
    <AppShell bgClass="bg-gradient-to-b from-[oklch(0.94_0.06_80)] to-background">
      <header className="flex items-center gap-2 px-4 pt-6">
        <Link to="/me" className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-sm active:scale-95">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Energy Ledger</p>
          <h1 className="text-2xl">能量账本 ⚡</h1>
        </div>
      </header>

      <section className="mt-4 px-4">
        <div
          className="card-pop relative overflow-hidden p-5"
          style={{ background: "var(--gradient-sun, linear-gradient(135deg, oklch(0.9 0.13 80), oklch(0.85 0.14 60)))" }}
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-foreground/70">当前能量总数</p>
              <p className="mt-1 flex items-baseline gap-1">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="text-4xl font-black tabular-nums">{total.toLocaleString()}</span>
              </p>
              <p className="mt-1 text-xs text-foreground/70">
                初始 {ENERGY_BASE} · 累计获得 +{(total - ENERGY_BASE).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-foreground/70">今日进账</p>
              <p className="mt-1 text-2xl font-bold text-primary">+{todayGained}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 px-4 pb-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold text-muted-foreground">明细 ({entries.length})</h2>
          {entries.length > 0 && (
            <button
              onClick={() => { if (confirm("清空所有能量明细？")) clearEnergy(); }}
              className="flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-xs text-muted-foreground active:scale-95"
            >
              <Trash2 className="h-3 w-3" /> 清空
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="card-pop flex flex-col items-center gap-2 p-8 text-center">
            <Zap className="h-10 w-10 text-primary/60" />
            <p className="text-sm text-muted-foreground">还没有打卡记录～</p>
            <Link to="/challenges" className="mt-2 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground">
              去挑战打卡
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {grouped.map(([day, list]) => {
              const daySum = list.reduce((s, e) => s + e.energy, 0);
              return (
                <div key={day}>
                  <div className="mb-1.5 flex items-center justify-between px-1">
                    <p className="text-xs font-bold text-foreground/70">{day}</p>
                    <p className="text-xs font-bold text-primary">+{daySum}</p>
                  </div>
                  <ul className="card-pop divide-y divide-border overflow-hidden">
                    {list.map((e) => (
                      <li key={e.id} className="flex items-center gap-3 p-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-lg">
                          {e.emoji || "✨"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold">{e.name}</p>
                          <p className="text-[11px] text-muted-foreground">{e.source} · {fmt(e.at)}</p>
                        </div>
                        <span className="flex items-center gap-0.5 text-sm font-bold text-primary">
                          +{e.energy}
                          <Sparkles className="h-3.5 w-3.5" />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </AppShell>
  );
}
