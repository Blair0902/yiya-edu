import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import petImg from "@/assets/pet.png";
import { Pencil, Sparkles } from "lucide-react";

export const Route = createFileRoute("/room")({
  head: () => ({ meta: [{ title: "家 · 我的小教室" }, { name: "description", content: "用能量币装饰豆豆的家。" }] }),
  component: Room,
});

const placed = [
  { e: "🪟", n: "窗户" },
  { e: "📚", n: "书架" },
  { e: "🪴", n: "绿植" },
  { e: "🖼️", n: "画框" },
  { e: "🛏️", n: "小床" },
  { e: "🧸", n: "玩具" },
];

function Room() {
  return (
    <AppShell bgClass="bg-gradient-to-b from-[oklch(0.9_0.06_60)] to-[oklch(0.96_0.04_80)]">
      <header className="flex items-center justify-between px-5 pt-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">My Home</p>
          <h1 className="mt-1 text-3xl">豆豆的家 🏡</h1>
        </div>
        <button className="flex items-center gap-1 rounded-full bg-card px-3 py-2 text-sm font-bold shadow-sm">
          <Pencil className="h-4 w-4" /> 装饰
        </button>
      </header>

      {/* Room scene */}
      <div className="mx-4 mt-4 overflow-hidden rounded-3xl bg-[oklch(0.92_0.05_60)] shadow-inner">
        <div className="relative h-72 w-full">
          {/* wallpaper grid */}
          <div className="absolute inset-x-0 top-0 h-2/3 bg-[repeating-linear-gradient(45deg,_oklch(0.88_0.06_60)_0_10px,_oklch(0.92_0.05_60)_10px_20px)]" />
          {/* floor */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[oklch(0.8_0.08_50)]" />
          {/* placed items */}
          <div className="absolute left-4 top-4 text-4xl">🪟</div>
          <div className="absolute right-4 top-6 text-4xl">🖼️</div>
          <div className="absolute left-3 bottom-20 text-4xl">📚</div>
          <div className="absolute right-4 bottom-24 text-3xl">🪴</div>
          <div className="absolute right-8 bottom-2 text-4xl">🛏️</div>
          <div className="absolute left-10 bottom-2 text-3xl">🧸</div>
          <img src={petImg} alt="豆豆" width={768} height={768} className="absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2" />
        </div>
      </div>

      <section className="mt-5 px-4">
        <h3 className="mb-2 text-sm font-bold text-muted-foreground">已摆放</h3>
        <div className="grid grid-cols-4 gap-3">
          {placed.map((p) => (
            <div key={p.n} className="card-pop flex flex-col items-center gap-1 py-3">
              <span className="text-2xl">{p.e}</span>
              <span className="text-xs font-semibold">{p.n}</span>
            </div>
          ))}
        </div>
      </section>

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
    </AppShell>
  );
}
