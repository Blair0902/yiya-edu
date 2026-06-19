import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ArrowLeft, Flame, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/journal")({
  head: () => ({ meta: [{ title: "日签 · 打卡日历" }] }),
  component: JournalPage,
});

// Mock check-in history for the last ~40 days.
// Map: ISO date (YYYY-MM-DD) -> { habits: string[], energy: number }
function buildMock() {
  const out: Record<string, { habits: string[]; energy: number }> = {};
  const pool = ["按时起床", "认真刷牙", "喝水", "深呼吸", "拉伸", "今日收获", "感恩", "古诗一诵", "数学思维", "微言"];
  const today = new Date();
  for (let i = 0; i < 40; i++) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    const k = d.toISOString().slice(0, 10);
    if (i % 7 === 3) continue; // a few empty days
    const n = (i * 3 + 2) % 5 + 1;
    const habits = pool.slice((i * 2) % pool.length).slice(0, n).concat(pool.slice(0, Math.max(0, n - (pool.length - (i * 2) % pool.length))));
    out[k] = { habits: habits.slice(0, n), energy: n * 8 };
  }
  return out;
}

const HISTORY = buildMock();

function JournalPage() {
  const today = new Date();
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = useState(today.toISOString().slice(0, 10));

  const grid = useMemo(() => {
    const first = new Date(cursor.y, cursor.m, 1);
    const startDay = first.getDay(); // 0 sun
    const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
    const cells: (string | null)[] = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(cursor.y, cursor.m, d);
      cells.push(dt.toISOString().slice(0, 10));
    }
    return cells;
  }, [cursor]);

  const streak = Object.keys(HISTORY).length > 0 ? 12 : 0;
  const totalEnergy = Object.values(HISTORY).reduce((s, x) => s + x.energy, 0);
  const day = HISTORY[selected];

  return (
    <AppShell>
      <div className="px-4 pb-10 pt-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-sm">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-bold">日签 · 打卡日历</h1>
          <div className="w-9" />
        </div>

        <div className="card-pop mt-4 flex items-center justify-around p-3">
          <div className="text-center">
            <p className="flex items-center justify-center gap-1 text-lg font-bold text-primary">
              <Flame className="h-4 w-4" /> {streak}
            </p>
            <p className="text-[11px] text-muted-foreground">连续天数</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="flex items-center justify-center gap-1 text-lg font-bold text-primary">
              <Sparkles className="h-4 w-4" /> {totalEnergy}
            </p>
            <p className="text-[11px] text-muted-foreground">累计能量</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="text-lg font-bold text-primary">{Object.keys(HISTORY).length}</p>
            <p className="text-[11px] text-muted-foreground">已打卡天</p>
          </div>
        </div>

        <div className="card-pop mt-3 p-3">
          <div className="flex items-center justify-between px-1">
            <button
              onClick={() => setCursor((c) => ({ y: c.m === 0 ? c.y - 1 : c.y, m: (c.m + 11) % 12 }))}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="text-sm font-bold">{cursor.y} 年 {cursor.m + 1} 月</p>
            <button
              onClick={() => setCursor((c) => ({ y: c.m === 11 ? c.y + 1 : c.y, m: (c.m + 1) % 12 }))}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
            {["日", "一", "二", "三", "四", "五", "六"].map((d) => <div key={d}>{d}</div>)}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {grid.map((iso, i) => {
              if (!iso) return <div key={i} className="aspect-square" />;
              const entry = HISTORY[iso];
              const d = parseInt(iso.slice(8, 10), 10);
              const isSel = iso === selected;
              const intensity = entry ? Math.min(1, entry.habits.length / 5) : 0;
              return (
                <button
                  key={iso}
                  onClick={() => setSelected(iso)}
                  className={`aspect-square rounded-lg text-xs font-bold transition-all ${
                    isSel ? "ring-2 ring-primary" : ""
                  }`}
                  style={{
                    background: entry
                      ? `color-mix(in oklab, var(--primary) ${20 + intensity * 50}%, white)`
                      : "var(--secondary)",
                    color: entry && intensity > 0.6 ? "white" : "var(--foreground)",
                  }}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        <div className="card-pop mt-3 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">{selected}</p>
          {day ? (
            <>
              <p className="mt-1 text-sm">完成 {day.habits.length} 项习惯 · +{day.energy} 能量</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {day.habits.map((h, i) => (
                  <li key={i} className="rounded-full bg-secondary px-3 py-1 text-xs font-bold">{h}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">这一天还没有打卡记录～</p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
