import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Sparkles, Volume2 } from "lucide-react";

export const Route = createFileRoute("/emotion")({
  head: () => ({ meta: [{ title: "情绪地图 · 看见自己" }, { name: "description", content: "选择当下的情绪与背后的需要。" }] }),
  component: Emotion,
});

const emotions = [
  { e: "😊", n: "开心", c: "oklch(0.85 0.15 85)" },
  { e: "😌", n: "平静", c: "oklch(0.82 0.1 200)" },
  { e: "🥰", n: "被爱", c: "oklch(0.82 0.14 15)" },
  { e: "😔", n: "失落", c: "oklch(0.7 0.08 250)" },
  { e: "😣", n: "委屈", c: "oklch(0.72 0.12 320)" },
  { e: "😡", n: "生气", c: "oklch(0.7 0.18 25)" },
  { e: "😰", n: "焦虑", c: "oklch(0.78 0.13 130)" },
  { e: "😴", n: "疲惫", c: "oklch(0.7 0.06 270)" },
  { e: "🤔", n: "困惑", c: "oklch(0.78 0.1 70)" },
];

const needs = [
  "被看见", "被理解", "被陪伴", "被肯定", "安全感", "自主选择",
  "休息与放松", "玩耍与乐趣", "成就感", "联结与亲密", "尊重", "公平",
];

type Step = "emotion" | "ask" | "needs" | "reward";

function Emotion() {
  const nav = useNavigate();
  const [step, setStep] = useState<Step>("emotion");
  const [picked, setPicked] = useState<string | null>(null);
  const [need, setNeed] = useState<string | null>(null);
  const reward = need ? 30 : 12;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-gradient-to-b from-[oklch(0.92_0.08_320)] to-[oklch(0.96_0.04_60)]">
      <header className="flex items-center justify-between px-4 pt-6">
        <button onClick={() => nav({ to: "/" })} className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-sm" aria-label="返回">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold">情绪地图</h1>
        <div className="w-10" />
      </header>

      {step === "emotion" && (
        <div className="flex-1 px-5 pt-4">
          <p className="text-center text-sm text-muted-foreground">此刻你的心里，浮现的是哪一种情绪？</p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {emotions.map((em) => (
              <button
                key={em.n}
                onClick={() => { setPicked(em.n); setStep("ask"); }}
                className="card-pop flex flex-col items-center gap-1 py-5 transition-transform active:scale-95"
                style={{ background: `color-mix(in oklab, ${em.c} 25%, white)` }}
              >
                <span className="text-4xl">{em.e}</span>
                <span className="text-sm font-bold">{em.n}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "ask" && (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="text-7xl">{emotions.find(e => e.n === picked)?.e}</div>
          <h2 className="mt-4 text-2xl">这个"{picked}"背后，<br />可能是你的什么需要？</h2>
          <p className="mt-2 text-sm text-muted-foreground">看见需要，就是看见自己 💗</p>
          <div className="mt-8 flex w-full flex-col gap-3">
            <button onClick={() => setStep("needs")} className="rounded-2xl bg-primary py-4 text-lg font-bold text-primary-foreground shadow-md">
              想去看看 ✨
            </button>
            <button onClick={() => setStep("reward")} className="rounded-2xl bg-card py-3 font-bold text-foreground">
              下次再说
            </button>
          </div>
        </div>
      )}

      {step === "needs" && (
        <div className="flex-1 px-5 pt-4">
          <p className="text-center text-sm text-muted-foreground">轻轻选一个最贴近的需要</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {needs.map((n) => (
              <button
                key={n}
                onClick={() => { setNeed(n); setStep("reward"); }}
                className="rounded-full bg-card px-4 py-2 text-sm font-bold shadow-sm transition-transform active:scale-95"
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "reward" && (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="text-7xl">🌟</div>
          {need ? (
            <>
              <h2 className="mt-4 text-2xl">看见需要，<br />就是看见自己</h2>
              <button className="mt-3 flex items-center gap-1 rounded-full bg-card px-3 py-1.5 text-xs font-bold shadow-sm">
                <Volume2 className="h-4 w-4" /> 声优朗读
              </button>
            </>
          ) : (
            <h2 className="mt-4 text-2xl">感谢你愿意停下来，<br />看一眼自己 💗</h2>
          )}
          <div className="mt-6 flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-2xl font-black text-primary-foreground shadow-lg">
            <Sparkles className="h-6 w-6" /> +{reward} 能量
          </div>
          <p className="mt-3 text-xs text-muted-foreground">已存档进情绪日历</p>
          <Link to="/" className="mt-8 rounded-2xl bg-card px-8 py-3 font-bold shadow-sm">回到首页</Link>
        </div>
      )}
    </div>
  );
}
