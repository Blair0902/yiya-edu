import { useEffect, useRef, useState } from "react";
import { X, Sparkles, ArrowLeft, Volume2, Plus } from "lucide-react";

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

const REWARD_SKIP = 12;
const REWARD_NEED = 30;

type Step = "emotion" | "custom" | "ask" | "needs" | "reward";

export function EmotionDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<Step>("emotion");
  const [picked, setPicked] = useState<string | null>(null);
  const [pickedEmoji, setPickedEmoji] = useState<string>("💗");
  const [customText, setCustomText] = useState("");
  const [need, setNeed] = useState<string | null>(null);
  const closer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = () => {
    setStep("emotion");
    setPicked(null);
    setPickedEmoji("💗");
    setCustomText("");
    setNeed(null);
    if (closer.current) clearTimeout(closer.current);
  };

  useEffect(() => {
    if (!open) reset();
    return () => { if (closer.current) clearTimeout(closer.current); };
  }, [open]);

  const finish = () => {
    closer.current = setTimeout(() => onClose(), 1800);
  };

  const pickEmotion = (name: string, emoji: string) => {
    setPicked(name);
    setPickedEmoji(emoji);
    setStep("ask");
  };

  const submitCustom = () => {
    const t = customText.trim();
    if (!t) return;
    setPicked(t);
    setPickedEmoji("💫");
    setStep("ask");
  };

  const skip = () => { setNeed(null); setStep("reward"); finish(); };
  const goNeeds = () => setStep("needs");
  const pickNeed = (n: string) => { setNeed(n); setStep("reward"); finish(); };

  if (!open) return null;

  const reward = need ? REWARD_NEED : REWARD_SKIP;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/40 p-3 sm:items-center" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-b from-[oklch(0.96_0.05_320)] to-[oklch(0.97_0.03_60)] shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-5 pt-4">
          <h2 className="text-base font-bold">情绪地图</h2>
          <button onClick={onClose} aria-label="关闭" className="flex h-8 w-8 items-center justify-center rounded-full bg-card shadow-sm">
            <X className="h-4 w-4" />
          </button>
        </div>

        {step === "emotion" && (
          <div className="px-5 pb-5 pt-2">
            <p className="text-center text-xs text-muted-foreground">此刻你心里浮现的是哪一种情绪？</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {emotions.map((em) => (
                <button key={em.n} onClick={() => pickEmotion(em.n, em.e)}
                  className="card-pop flex flex-col items-center gap-1 py-3 transition-transform active:scale-95"
                  style={{ background: `color-mix(in oklab, ${em.c} 25%, white)` }}>
                  <span className="text-3xl">{em.e}</span>
                  <span className="text-xs font-bold">{em.n}</span>
                </button>
              ))}
              <button
                onClick={() => setStep("custom")}
                className="card-pop flex flex-col items-center gap-1 py-3 transition-transform active:scale-95 bg-card"
              >
                <span className="text-3xl">✍️</span>
                <span className="text-xs font-bold">其他</span>
              </button>
            </div>
          </div>
        )}

        {step === "custom" && (
          <div className="px-5 pb-5 pt-2">
            <button onClick={() => setStep("emotion")} className="mb-2 flex items-center gap-1 text-xs font-bold text-muted-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> 返回
            </button>
            <p className="text-center text-xs text-muted-foreground">用一个词或一句话描述现在的感觉</p>
            <textarea
              autoFocus
              value={customText}
              onChange={(e) => setCustomText(e.target.value.slice(0, 40))}
              placeholder="例如：紧张但期待、有点空空的…"
              className="mt-3 h-24 w-full rounded-2xl border-2 border-border bg-background p-3 text-sm outline-none focus:border-primary"
            />
            <p className="mt-1 text-right text-[11px] text-muted-foreground">{customText.length}/40</p>
            <button
              onClick={submitCustom}
              disabled={!customText.trim()}
              className="mt-2 flex w-full items-center justify-center gap-1 rounded-2xl bg-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-40"
            >
              <Plus className="h-4 w-4" /> 记下这个情绪
            </button>
          </div>
        )}

        {step === "ask" && picked && (
          <div className="flex flex-col items-center px-6 pb-6 pt-2 text-center">
            <div className="text-6xl">{pickedEmoji}</div>
            <h3 className="mt-2 text-xl">这个"{picked}"背后，<br />可能是你的什么需要？</h3>
            <p className="mt-1 text-xs text-muted-foreground">看见需要，就是看见自己 💗</p>

            <button onClick={goNeeds} className="mt-5 w-full rounded-2xl bg-primary py-3.5 text-base font-bold text-primary-foreground shadow-md">
              想去看看 ✨
            </button>
            <button onClick={skip}
              className="mt-2 flex w-full items-center justify-center gap-1 rounded-2xl bg-card py-2.5 text-sm font-bold text-foreground/60 opacity-50">
              下次再说（+{REWARD_SKIP} 能量）
              <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-primary-foreground countdown-ring">3</span>
            </button>
            <p className="mt-1 text-[10px] text-muted-foreground">3 秒后自动收下能量并返回主页</p>
          </div>
        )}

        {step === "needs" && (
          <div className="px-5 pb-5 pt-2">
            <button onClick={() => setStep("ask")} className="mb-2 flex items-center gap-1 text-xs font-bold text-muted-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> 返回
            </button>
            <p className="text-center text-xs text-muted-foreground">轻轻选一个最贴近的需要</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {needs.map((n) => (
                <button key={n} onClick={() => pickNeed(n)}
                  className="rounded-full bg-card px-4 py-2 text-sm font-bold shadow-sm transition-transform active:scale-95">
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "reward" && (
          <div className="flex flex-col items-center px-6 pb-8 pt-3 text-center">
            <div className="text-6xl">🌟</div>
            {need ? (
              <>
                <h3 className="mt-2 text-xl">看见需要，<br />就是看见自己</h3>
                <button className="mt-3 flex items-center gap-1 rounded-full bg-card px-3 py-1.5 text-xs font-bold shadow-sm">
                  <Volume2 className="h-4 w-4" /> 声优朗读
                </button>
              </>
            ) : (
              <h3 className="mt-2 text-xl">感谢你愿意停下来，<br />看一眼自己 💗</h3>
            )}
            <div className="mt-4 flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-lg font-black text-primary-foreground shadow-lg">
              <Sparkles className="h-5 w-5" /> +{reward} 能量
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">已存档进情绪日历 · 即将返回主页</p>
          </div>
        )}
      </div>
    </div>
  );
}
