import { useState } from "react";
import { usePet, savePet, PET_COLORS, PET_TRAITS } from "@/lib/pet-store";
import { Sparkles, ArrowRight, Check } from "lucide-react";

export function AdoptionFlow() {
  const pet = usePet();
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [name, setName] = useState(pet.name || "豆豆");
  const [color, setColor] = useState(pet.color || "sun");
  const [traits, setTraits] = useState<string[]>(pet.traits || []);

  if (pet.adopted) return null;

  const palette = PET_COLORS.find((c) => c.key === color)!;

  const toggleTrait = (t: string) =>
    setTraits((ts) => (ts.includes(t) ? ts.filter((x) => x !== t) : ts.length < 3 ? [...ts, t] : ts));

  const finish = () => savePet({ adopted: true, name: name.trim() || "豆豆", color, traits });

  return (
    <div className="fixed inset-0 z-[100] flex items-stretch justify-center bg-gradient-to-b from-[oklch(0.95_0.08_60)] via-[oklch(0.94_0.06_320)] to-[oklch(0.94_0.08_230)]">
      <div className="mx-auto flex w-full max-w-md flex-col px-6 pb-8 pt-12">
        {/* progress */}
        <div className="mb-4 flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-card"}`} />
          ))}
        </div>

        {step === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full blur-2xl" style={{ background: palette.bg }} />
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full text-8xl shadow-xl" style={{ background: palette.bg }}>
                🥚
              </div>
            </div>
            <h1 className="mt-8 text-3xl">欢迎来到豆豆星球 🌍</h1>
            <p className="mt-3 px-4 leading-relaxed text-foreground/70">
              这里有一个小生命正等着你。
              <br />一起照顾我们的小伙伴吧！
            </p>
            <button onClick={() => setStep(1)} className="mt-10 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-bold text-primary-foreground shadow-lg">
              开始领养 <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-1 flex-col">
            <h2 className="mt-6 text-2xl">给 ta 起个名字吧</h2>
            <p className="mt-1 text-sm text-foreground/60">这个名字会陪伴你们很久</p>
            <div className="mt-8 flex justify-center text-7xl">🥚</div>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 8))}
              placeholder="例如：豆豆"
              className="mt-8 w-full rounded-2xl bg-card px-5 py-4 text-center text-xl font-bold shadow-sm outline-none ring-2 ring-transparent focus:ring-primary"
            />
            <p className="mt-2 text-center text-xs text-muted-foreground">{name.length}/8</p>
            <div className="mt-auto flex gap-2">
              <button onClick={() => setStep(0)} className="rounded-2xl bg-card px-5 py-3 font-bold">返回</button>
              <button disabled={!name.trim()} onClick={() => setStep(2)} className="flex-1 rounded-2xl bg-primary py-3 font-bold text-primary-foreground disabled:opacity-40">下一步</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-1 flex-col">
            <h2 className="mt-6 text-2xl">{name} 长什么样？</h2>
            <p className="mt-1 text-sm text-foreground/60">选一个你喜欢的颜色</p>

            <div className="mt-6 flex justify-center">
              <div className="flex h-40 w-40 items-center justify-center rounded-full text-7xl shadow-lg transition-all" style={{ background: palette.bg }}>
                {palette.emoji}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-5 gap-3">
              {PET_COLORS.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setColor(c.key)}
                  className={`flex aspect-square flex-col items-center justify-center rounded-2xl text-2xl transition-all ${
                    color === c.key ? "ring-4 ring-primary" : "ring-1 ring-border"
                  }`}
                  style={{ background: c.bg }}
                  aria-label={c.label}
                >
                  {c.emoji}
                </button>
              ))}
            </div>
            <p className="mt-2 text-center text-sm font-bold">{palette.label}</p>

            <div className="mt-auto flex gap-2">
              <button onClick={() => setStep(1)} className="rounded-2xl bg-card px-5 py-3 font-bold">返回</button>
              <button onClick={() => setStep(3)} className="flex-1 rounded-2xl bg-primary py-3 font-bold text-primary-foreground">下一步</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-1 flex-col">
            <h2 className="mt-6 text-2xl">{name} 的性格</h2>
            <p className="mt-1 text-sm text-foreground/60">最多选 3 个 · 这会影响 ta 的小习惯</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {PET_TRAITS.map((t) => {
                const on = traits.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleTrait(t)}
                    className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                      on ? "bg-primary text-primary-foreground" : "bg-card text-foreground/70 ring-1 ring-border"
                    }`}
                  >
                    {on && <Check className="h-3.5 w-3.5" />}
                    {t}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 rounded-2xl bg-card p-4 text-center shadow-sm">
              <div className="text-5xl">{palette.emoji}</div>
              <p className="mt-2 text-lg font-bold">{name}</p>
              <p className="text-xs text-muted-foreground">
                {palette.label}
                {traits.length ? " · " + traits.join("·") : ""}
              </p>
            </div>

            <div className="mt-auto flex gap-2">
              <button onClick={() => setStep(2)} className="rounded-2xl bg-card px-5 py-3 font-bold">返回</button>
              <button onClick={finish} className="flex flex-1 items-center justify-center gap-1 rounded-2xl bg-primary py-3 font-bold text-primary-foreground shadow-lg">
                <Sparkles className="h-4 w-4" /> 带 {name} 回家
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
