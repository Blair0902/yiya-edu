import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import petImg from "@/assets/pet.png";
import { Heart, Zap, Smile, Cookie } from "lucide-react";

export const Route = createFileRoute("/pet")({
  head: () => ({ meta: [{ title: "我的宠物 · 豆豆星球" }, { name: "description", content: "查看豆豆的心情、属性和成长。" }] }),
  component: Pet,
});

function Stat({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <div className="card-pop flex-1 p-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <Icon className="h-3.5 w-3.5" style={{ color }} /> {label}
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <p className="mt-1 text-right text-xs font-bold" style={{ color }}>{value}%</p>
    </div>
  );
}

function Pet() {
  return (
    <AppShell bgClass="bg-gradient-to-b from-[oklch(0.86_0.08_230)] via-[oklch(0.94_0.05_95)] to-background">
      <header className="flex items-center justify-between px-5 pt-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">My Pet</p>
          <h1 className="mt-1 text-3xl">豆豆 <span className="text-base font-semibold text-muted-foreground">Lv.4</span></h1>
        </div>
        <button className="rounded-full bg-card px-3 py-1.5 text-sm font-bold shadow-sm">换装 ✨</button>
      </header>

      <div className="relative mt-4 flex h-72 items-end justify-center">
        <div className="absolute bottom-6 h-6 w-44 rounded-full bg-foreground/10 blur-md" />
        <img src={petImg} alt="豆豆" width={768} height={768} className="relative h-64 w-64 drop-shadow-2xl" />
      </div>

      <p className="text-center text-sm font-semibold text-muted-foreground">"今天和你一起好开心呀～" 💬</p>

      <section className="mt-5 px-4">
        <div className="flex gap-3">
          <Stat icon={Heart} label="开心" value={82} color="oklch(0.65 0.2 15)" />
          <Stat icon={Zap} label="能量" value={64} color="oklch(0.78 0.18 75)" />
        </div>
        <div className="mt-3 flex gap-3">
          <Stat icon={Smile} label="自信" value={55} color="oklch(0.68 0.16 145)" />
          <Stat icon={Cookie} label="饱腹" value={40} color="oklch(0.72 0.14 50)" />
        </div>
      </section>

      <section className="mt-5 px-4">
        <h3 className="mb-2 text-lg">和豆豆互动</h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { e: "🍎", t: "喂食" },
            { e: "🛁", t: "洗澡" },
            { e: "🎾", t: "玩耍" },
            { e: "💤", t: "睡觉" },
          ].map((a) => (
            <button key={a.t} className="card-pop flex flex-col items-center gap-1 py-3">
              <span className="text-2xl">{a.e}</span>
              <span className="text-xs font-bold">{a.t}</span>
            </button>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
