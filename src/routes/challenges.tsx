import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Trophy, Clock } from "lucide-react";

export const Route = createFileRoute("/challenges")({
  head: () => ({ meta: [{ title: "挑战 · 豆豆星球" }, { name: "description", content: "和宝宝一起完成 7 日小挑战。" }] }),
  component: Challenges,
});

const challenges = [
  { id: 1, title: "7 日早睡小达人", emoji: "🌙", desc: "连续 7 天 21:00 前上床", days: 5, total: 7, reward: "解锁睡帽装扮", color: "from-sky-200 to-indigo-200" },
  { id: 2, title: "蔬菜超人挑战", emoji: "🥦", desc: "每天吃一种新蔬菜", days: 2, total: 5, reward: "+50 能量币", color: "from-emerald-200 to-lime-200" },
  { id: 3, title: "亲子共读马拉松", emoji: "📚", desc: "和家长共读 14 天", days: 9, total: 14, reward: "限定故事书家具", color: "from-amber-200 to-orange-200" },
  { id: 4, title: "整理小帮手", emoji: "🧸", desc: "睡前自己收拾玩具", days: 0, total: 7, reward: "稀有玩具盒", color: "from-rose-200 to-pink-200" },
];

function Challenges() {
  return (
    <AppShell>
      <header className="px-5 pb-3 pt-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Challenges</p>
        <h1 className="mt-1 text-3xl">小小挑战 🏆</h1>
        <p className="mt-1 text-sm text-muted-foreground">完成挑战，赢取专属奖励～</p>
      </header>

      <div className="flex gap-2 overflow-x-auto px-5 pb-3 text-sm">
        {["全部", "进行中", "新挑战", "已完成"].map((t, i) => (
          <button key={t} className={`whitespace-nowrap rounded-full px-4 py-1.5 font-semibold ${i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{t}</button>
        ))}
      </div>

      <ul className="flex flex-col gap-4 px-4">
        {challenges.map((c) => {
          const pct = (c.days / c.total) * 100;
          return (
            <li key={c.id} className={`card-pop overflow-hidden bg-gradient-to-br ${c.color}`}>
              <div className="bg-card/70 p-4 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card text-3xl shadow-sm">{c.emoji}</div>
                  <div className="flex-1">
                    <h3 className="text-lg leading-tight">{c.title}</h3>
                    <p className="text-sm text-muted-foreground">{c.desc}</p>
                  </div>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-card">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-3.5 w-3.5" />{c.days}/{c.total} 天</span>
                  <span className="flex items-center gap-1 font-semibold text-foreground"><Trophy className="h-3.5 w-3.5 text-primary" />{c.reward}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
