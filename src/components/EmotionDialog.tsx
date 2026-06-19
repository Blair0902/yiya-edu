import { useEffect, useRef, useState } from "react";
import { X, Sparkles } from "lucide-react";

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

const REWARD = 12;
const AUTO_MS = 3000;

export function EmotionDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = () => {
    setPicked(null);
    setDone(false);
    if (timer.current) clearTimeout(timer.current);
    if (closer.current) clearTimeout(closer.current);
  };

  useEffect(() => {
    if (!open) reset();
    return () => {
      if (timer.current) clearTimeout(timer.current);
      if (closer.current) clearTimeout(closer.current);
    };
  }, [open]);

  const finish = () => {
    setDone(true);
    closer.current = setTimeout(() => {
      onClose();
    }, 1200);
  };

  const pick = (n: string) => {
    setPicked(n);
    timer.current = setTimeout(finish, AUTO_MS);
  };

  if (!open) return null;

  const em = picked ? emotions.find((e) => e.n === picked)! : null;

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

        {!picked && !done && (
          <div className="px-5 pb-5 pt-2">
            <p className="text-center text-xs text-muted-foreground">此刻你心里浮现的是哪一种情绪？</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {emotions.map((em) => (
                <button
                  key={em.n}
                  onClick={() => pick(em.n)}
                  className="card-pop flex flex-col items-center gap-1 py-3 transition-transform active:scale-95"
                  style={{ background: `color-mix(in oklab, ${em.c} 25%, white)` }}
                >
                  <span className="text-3xl">{em.e}</span>
                  <span className="text-xs font-bold">{em.n}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {picked && !done && em && (
          <div className="flex flex-col items-center px-6 pb-6 pt-2 text-center">
            <div className="text-6xl">{em.e}</div>
            <h3 className="mt-2 text-xl">这个"{picked}"背后，<br />可能是你的什么需要？</h3>
            <p className="mt-1 text-xs text-muted-foreground">看见需要，就是看见自己 💗</p>

            <button className="mt-5 w-full rounded-2xl bg-primary py-3.5 text-base font-bold text-primary-foreground shadow-md">
              想去看看 ✨
            </button>

            <button
              onClick={finish}
              className="mt-2 flex w-full items-center justify-center gap-1 rounded-2xl bg-card py-2.5 text-sm font-bold text-foreground/60 opacity-50"
            >
              下次再说（+{REWARD} 能量）
              <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-primary-foreground countdown-ring">
                3
              </span>
            </button>
            <p className="mt-1 text-[10px] text-muted-foreground">3 秒后自动收下能量并返回主页</p>
          </div>
        )}

        {done && (
          <div className="flex flex-col items-center px-6 pb-8 pt-3 text-center">
            <div className="text-6xl">🌟</div>
            <h3 className="mt-2 text-xl">感谢你愿意停下来，<br />看一眼自己 💗</h3>
            <div className="mt-4 flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-lg font-black text-primary-foreground shadow-lg">
              <Sparkles className="h-5 w-5" /> +{REWARD} 能量
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">已存档进情绪日历 · 即将返回主页</p>
          </div>
        )}
      </div>
    </div>
  );
}
