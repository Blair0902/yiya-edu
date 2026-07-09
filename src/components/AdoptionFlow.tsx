import { useEffect, useRef, useState } from "react";
import { usePet, savePet } from "@/lib/pet-store";
import { streamImage } from "@/lib/streamImage";
import { Sparkles, ArrowRight, SkipForward, Check, Loader2 } from "lucide-react";

type Axis = "I" | "F" | "C" | "P";
type QOpt = { label: string; emoji: string; axis: Axis; opposite: string };
type Q = { q: string; options: [QOpt, QOpt] };

const QUESTIONS: Q[] = [
  {
    q: "在小伙伴聚会时，我更喜欢…",
    options: [
      { label: "静静观察大家", emoji: "🌙", axis: "I", opposite: "O" },
      { label: "热情加入闹一闹", emoji: "🎉", axis: "I", opposite: "O" },
    ],
  },
  {
    q: "看到路边有只小猫咪，我会…",
    options: [
      { label: "先想它是不是需要帮助", emoji: "💗", axis: "F", opposite: "T" },
      { label: "先观察它，再决定做什么", emoji: "🧠", axis: "F", opposite: "T" },
    ],
  },
  {
    q: "拿到一盒新玩具，我会…",
    options: [
      { label: "先拆开一顿探索！", emoji: "🚀", axis: "C", opposite: "S" },
      { label: "先看说明书再玩", emoji: "📖", axis: "C", opposite: "S" },
    ],
  },
  {
    q: "周末我更喜欢…",
    options: [
      { label: "临时决定去哪玩", emoji: "🌈", axis: "P", opposite: "L" },
      { label: "提前排好小计划", emoji: "🗓️", axis: "P", opposite: "L" },
    ],
  },
];

const PERSONAS: Record<string, { title: string; desc: string; emoji: string; pet: string }> = {
  IFCP: { title: "温柔探索家", desc: "内心柔软，充满好奇，喜欢跟着感觉走", emoji: "🌷", pet: "🦋" },
  IFCL: { title: "细腻小画家", desc: "感受细腻，喜欢把生活安排得温暖有序", emoji: "🎨", pet: "🐰" },
  IFSP: { title: "小小守护者", desc: "安静而体贴，总是默默照顾身边的人", emoji: "🕊️", pet: "🐹" },
  IFSL: { title: "静水深流者", desc: "温柔稳定，是可以依靠的小小灯塔", emoji: "🕯️", pet: "🦉" },
  ITCP: { title: "点子发明家", desc: "爱思考、爱试新，脑袋里全是奇思妙想", emoji: "💡", pet: "🦊" },
  ITCL: { title: "小小策略师", desc: "冷静又机灵，喜欢把事情想明白再做", emoji: "🧩", pet: "🐱" },
  ITSP: { title: "沉思观察员", desc: "安静细心，从细节里发现宝藏", emoji: "🔍", pet: "🐢" },
  ITSL: { title: "小小工程师", desc: "有条不紊，喜欢把世界搭得整整齐齐", emoji: "🛠️", pet: "🐧" },
  OFCP: { title: "阳光冒险家", desc: "热情又勇敢，愿意为在乎的人冲在前面", emoji: "☀️", pet: "🐶" },
  OFCL: { title: "温暖组织者", desc: "爱人也爱计划，是团队里的小太阳", emoji: "🌻", pet: "🐨" },
  OFSP: { title: "开心分享家", desc: "乐观外放，走到哪里都带来笑声", emoji: "🎈", pet: "🐥" },
  OFSL: { title: "温柔小队长", desc: "有责任心，也懂得照顾大家的感受", emoji: "🧡", pet: "🐻" },
  OTCP: { title: "点燃行动派", desc: "有想法就要试试看，勇于打破常规", emoji: "⚡", pet: "🦁" },
  OTCL: { title: "小小指挥官", desc: "目标清晰，喜欢带着大家往前走", emoji: "🚩", pet: "🐯" },
  OTSP: { title: "灵活实干家", desc: "干脆利落，遇到问题就出手解决", emoji: "🔧", pet: "🐵" },
  OTSL: { title: "稳稳建造者", desc: "认真踏实，说到就一定做到", emoji: "🏗️", pet: "🐼" },
};

const EGG_COLORS = [
  { key: "sun", label: "暖阳黄", base: "#FFD87A", shell: "#E8A93A" },
  { key: "berry", label: "莓果粉", base: "#FFB4C7", shell: "#D96A88" },
  { key: "sky", label: "天空蓝", base: "#A9D6FF", shell: "#4E93D4" },
  { key: "leaf", label: "嫩芽绿", base: "#B9E5A6", shell: "#5AA365" },
  { key: "lavender", label: "薰衣紫", base: "#D4BEF5", shell: "#8B6BC4" },
  { key: "cream", label: "奶油白", base: "#FFF3DC", shell: "#C9B48E" },
] as const;

const EGG_PATTERNS = [
  { key: "plain", label: "素蛋" },
  { key: "dots", label: "圆点" },
  { key: "stripes", label: "条纹" },
  { key: "stars", label: "星星" },
  { key: "hearts", label: "爱心" },
  { key: "zigzag", label: "波浪" },
] as const;

function Egg({
  color,
  pattern,
  size = 180,
  animate,
}: {
  color: string;
  pattern: string;
  size?: number;
  animate?: "float" | "shake" | "none";
}) {
  const c = EGG_COLORS.find((x) => x.key === color) ?? EGG_COLORS[0];
  const patternId = `pat-${color}-${pattern}`;

  const renderPattern = () => {
    switch (pattern) {
      case "dots":
        return (
          <g fill={c.shell} opacity={0.75}>
            {[[30, 40], [65, 55], [45, 80], [75, 95], [30, 115], [60, 130]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={5} />
            ))}
          </g>
        );
      case "stripes":
        return (
          <g stroke={c.shell} strokeWidth={5} opacity={0.7} fill="none" strokeLinecap="round">
            <path d="M15,55 Q50,50 85,58" />
            <path d="M10,85 Q50,80 90,88" />
            <path d="M12,115 Q50,110 88,118" />
          </g>
        );
      case "stars":
        return (
          <g fill={c.shell} opacity={0.85}>
            {[[35, 45], [65, 65], [40, 95], [70, 115], [30, 130]].map(([x, y], i) => (
              <text key={i} x={x} y={y} fontSize={14} textAnchor="middle">★</text>
            ))}
          </g>
        );
      case "hearts":
        return (
          <g fill={c.shell} opacity={0.85}>
            {[[35, 55], [65, 75], [40, 105], [70, 125]].map(([x, y], i) => (
              <text key={i} x={x} y={y} fontSize={14} textAnchor="middle">♥</text>
            ))}
          </g>
        );
      case "zigzag":
        return (
          <g stroke={c.shell} strokeWidth={4} fill="none" opacity={0.7} strokeLinecap="round" strokeLinejoin="round">
            <path d="M10,60 L25,50 L40,60 L55,50 L70,60 L85,50" />
            <path d="M10,95 L25,85 L40,95 L55,85 L70,95 L85,85" />
            <path d="M12,130 L27,120 L42,130 L57,120 L72,130 L87,120" />
          </g>
        );
      default:
        return null;
    }
  };

  const anim =
    animate === "shake"
      ? "animate-[eggshake_0.35s_ease-in-out_infinite]"
      : animate === "float"
      ? "animate-[bounce_2.6s_ease-in-out_infinite]"
      : "";

  return (
    <div style={{ width: size, height: size }} className={`relative ${anim}`}>
      <svg viewBox="0 0 100 140" className="h-full w-full drop-shadow-[0_10px_18px_rgba(120,80,40,0.28)]">
        <defs>
          <radialGradient id={patternId} cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="55%" stopColor={c.base} />
            <stop offset="100%" stopColor={c.shell} />
          </radialGradient>
        </defs>
        <path
          d="M50,4 C22,4 8,55 8,90 C8,120 27,136 50,136 C73,136 92,120 92,90 C92,55 78,4 50,4 Z"
          fill={`url(#${patternId})`}
          stroke={c.shell}
          strokeWidth={1.5}
        />
        {renderPattern()}
      </svg>
      <style>{`
        @keyframes eggshake {
          0%,100% { transform: rotate(-8deg) translateY(0); }
          50% { transform: rotate(8deg) translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

type Phase = "splash" | "egg" | "name" | "quiz" | "hatching" | "result";

const STEPS: { key: Phase; label: string; short: string }[] = [
  { key: "splash", label: "开屏", short: "开屏" },
  { key: "egg", label: "选蛋", short: "选蛋" },
  { key: "name", label: "起名", short: "起名" },
  { key: "quiz", label: "人格测评", short: "测评" },
  { key: "hatching", label: "破壳", short: "破壳" },
  { key: "result", label: "生成结果", short: "结果" },
];

export function AdoptionFlow() {
  const pet = usePet();
  const [phase, setPhase] = useState<Phase>("splash");
  const [name, setName] = useState(pet.name || "豆豆");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [eggColor, setEggColor] = useState<string>("sun");
  const [eggPattern, setEggPattern] = useState<string>("dots");
  const [petImage, setPetImage] = useState<string | null>(null);
  const [imgFinal, setImgFinal] = useState(false);
  const [imgError, setImgError] = useState<string | null>(null);
  const genStartedRef = useRef(false);

  // splash auto → egg
  useEffect(() => {
    if (pet.adopted) return;
    if (phase !== "splash") return;
    const t = setTimeout(() => setPhase("egg"), 1800);
    return () => clearTimeout(t);
  }, [phase, pet.adopted]);

  // hatching auto → result
  useEffect(() => {
    if (phase !== "hatching") return;
    const t = setTimeout(() => setPhase("result"), 2400);
    return () => clearTimeout(t);
  }, [phase]);

  const code = answers.join("");
  const persona = PERSONAS[code] ?? PERSONAS.IFCP;

  // Kick off pet image generation as soon as hatching starts.
  useEffect(() => {
    if (phase !== "hatching" || genStartedRef.current) return;
    genStartedRef.current = true;
    const colorLabel = EGG_COLORS.find((c) => c.key === eggColor)?.label ?? "";
    const patternLabel = EGG_PATTERNS.find((p) => p.key === eggPattern)?.label ?? "";
    const displayName = (name.trim() || "豆豆");
    const prompt = [
      `A single adorable cartoon creature companion character named "${displayName}",`,
      `inspired by a hatched egg with a ${colorLabel} base color and a ${patternLabel} pattern —`,
      `the creature's fur/skin color and body markings should echo that egg's palette and motif.`,
      `Personality archetype: ${persona.title} (${persona.desc}).`,
      `Style: soft chibi mascot, big glossy eyes, round friendly body, gentle pastel colors,`,
      `clean vector-like shading, subtle drop shadow, plain off-white background, centered composition,`,
      `no text, no watermark, no border.`,
    ].join(" ");

    streamImage("/api/generate-pet", prompt, (dataUrl, isFinal) => {
      setPetImage(dataUrl);
      if (isFinal) setImgFinal(true);
    }).catch((e) => {
      setImgError(String(e?.message ?? e));
      setImgFinal(true);
    });
  }, [phase, eggColor, eggPattern, name, persona.title, persona.desc]);

  if (pet.adopted) return null;

  const chooseAnswer = (letter: string) => {
    const next = [...answers, letter];
    setAnswers(next);
    if (qIdx + 1 < QUESTIONS.length) {
      setQIdx(qIdx + 1);
    } else {
      setPhase("hatching");
    }
  };

  const finish = () => {
    savePet({
      adopted: true,
      name: name.trim() || "豆豆",
      color: eggColor,
      traits: [],
      personality: persona.title,
      personalityCode: code,
      avatar: persona.pet,
      avatarImage: imgFinal && petImage ? petImage : undefined,
      eggColor,
      eggPattern,
      mode: "student",
    });
  };

  const currentStepIdx = STEPS.findIndex((s) => s.key === phase);
  const currentStep = STEPS[currentStepIdx];
  const canSkip = phase === "splash" || phase === "hatching";
  const skipTarget = phase === "splash" ? "egg" : "result";

  return (
    <div className="fixed inset-0 z-[100] flex items-stretch justify-center overflow-y-auto bg-gradient-to-b from-[oklch(0.95_0.08_60)] via-[oklch(0.94_0.06_320)] to-[oklch(0.94_0.08_230)]">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col px-6 pb-8 pt-6">

        {/* Stepper */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
              {String(currentStepIdx + 1).padStart(2, "0")} · {currentStep.label}
            </p>
            {canSkip && (
              <button
                onClick={() => setPhase(skipTarget as Phase)}
                className="flex items-center gap-1 rounded-full bg-card/80 px-3 py-1 text-[11px] font-bold text-foreground/70 shadow-sm backdrop-blur active:scale-95"
              >
                跳过 <SkipForward className="h-3 w-3" />
              </button>
            )}
          </div>
          <div className="mt-2 flex items-center gap-1">
            {STEPS.map((s, i) => {
              const done = i < currentStepIdx;
              const active = i === currentStepIdx;
              return (
                <div key={s.key} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className={`h-1.5 w-full rounded-full transition-all ${
                      done ? "bg-primary" : active ? "bg-primary/70" : "bg-card"
                    }`}
                  />
                  <span
                    className={`text-[9px] font-bold transition-colors ${
                      done || active ? "text-primary" : "text-foreground/40"
                    }`}
                  >
                    {s.short}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SPLASH */}
        {phase === "splash" && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="text-8xl animate-[bounce_1.2s_ease-in-out_infinite]">🌍</div>
            <h1 className="mt-8 text-3xl">豆豆星球</h1>
            <p className="mt-2 leading-relaxed text-foreground/70">一颗蛋正在等你领取…</p>
            <button
              onClick={() => setPhase("egg")}
              className="mt-8 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-md active:scale-95"
            >
              开始 →
            </button>
          </div>
        )}

        {/* EGG PICKER */}
        {phase === "egg" && (
          <div className="flex flex-1 flex-col">
            <h2 className="mt-2 text-2xl">领取你的蛋 🥚</h2>
            <p className="mt-1 text-sm text-foreground/60">选一个颜色和花纹，蛋里的小生命还是个谜哦</p>

            <div className="mt-6 flex items-center justify-center">
              <Egg color={eggColor} pattern={eggPattern} size={200} animate="float" />
            </div>

            <p className="mt-4 px-1 text-xs font-bold uppercase tracking-widest text-primary">颜色</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {EGG_COLORS.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setEggColor(c.key)}
                  aria-label={c.label}
                  className={`flex h-11 w-11 items-center justify-center rounded-full ring-2 transition-all active:scale-90 ${
                    eggColor === c.key ? "ring-primary scale-105" : "ring-transparent"
                  }`}
                  style={{ background: `linear-gradient(135deg, ${c.base}, ${c.shell})` }}
                >
                  {eggColor === c.key && <Check className="h-5 w-5 text-white drop-shadow" />}
                </button>
              ))}
            </div>

            <p className="mt-4 px-1 text-xs font-bold uppercase tracking-widest text-primary">花纹</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {EGG_PATTERNS.map((p) => {
                const on = eggPattern === p.key;
                return (
                  <button
                    key={p.key}
                    onClick={() => setEggPattern(p.key)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                      on ? "bg-primary text-primary-foreground" : "bg-card text-foreground/70 ring-1 ring-border"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-auto pt-6">
              <button
                onClick={() => setPhase("name")}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-bold text-primary-foreground shadow-lg active:scale-95"
              >
                领取这颗蛋 <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* NAME */}
        {phase === "name" && (
          <div className="flex flex-1 flex-col">
            <h2 className="mt-2 text-2xl">给蛋里的 ta 起个名字</h2>
            <p className="mt-1 text-sm text-foreground/60">这个名字会陪伴你们很久</p>
            <div className="mt-6 flex justify-center">
              <Egg color={eggColor} pattern={eggPattern} size={150} animate="float" />
            </div>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 8))}
              placeholder="例如：豆豆"
              className="mt-6 w-full rounded-2xl bg-card px-5 py-4 text-center text-xl font-bold shadow-sm outline-none ring-2 ring-transparent focus:ring-primary"
            />
            <p className="mt-2 text-center text-xs text-muted-foreground">{name.length}/8</p>
            <div className="mt-auto pt-6">
              <button
                disabled={!name.trim()}
                onClick={() => setPhase("quiz")}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-bold text-primary-foreground disabled:opacity-40"
              >
                下一步 <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* QUIZ */}
        {phase === "quiz" && (
          <div className="flex flex-1 flex-col">
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-primary">
              人格小测验 · {qIdx + 1}/{QUESTIONS.length}
            </p>
            <h2 className="mt-2 text-2xl leading-snug">{QUESTIONS[qIdx].q}</h2>

            <div className="mt-6 flex justify-center">
              <Egg color={eggColor} pattern={eggPattern} size={110} animate="float" />
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {QUESTIONS[qIdx].options.map((opt, i) => {
                const letter = i === 0 ? QUESTIONS[qIdx].options[0].axis : QUESTIONS[qIdx].options[0].opposite;
                return (
                  <button
                    key={opt.label}
                    onClick={() => chooseAnswer(letter)}
                    className="card-pop flex items-center gap-3 p-4 text-left active:scale-[0.98]"
                  >
                    <div className="text-3xl">{opt.emoji}</div>
                    <span className="flex-1 font-bold">{opt.label}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                );
              })}
            </div>

            {qIdx > 0 && (
              <button
                onClick={() => { setAnswers(answers.slice(0, -1)); setQIdx(qIdx - 1); }}
                className="mt-auto self-start rounded-full bg-card px-4 py-2 text-sm font-bold"
              >
                ← 上一题
              </button>
            )}
          </div>
        )}

        {/* HATCHING */}
        {phase === "hatching" && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="relative">
              <div
                className="absolute inset-0 -m-8 animate-pulse rounded-full blur-3xl"
                style={{ background: "oklch(0.9 0.15 80 / 0.7)" }}
              />
              <div className="relative">
                <Egg color={eggColor} pattern={eggPattern} size={200} animate="shake" />
                <span className="absolute -right-2 -top-2 text-2xl animate-ping">✨</span>
                <span className="absolute -left-3 top-10 text-xl animate-pulse">💫</span>
              </div>
            </div>
            <h1 className="mt-10 text-3xl">咔… 咔… 快出来了！</h1>
            <p className="mt-3 leading-relaxed text-foreground/70">看看是谁？</p>
            <button
              onClick={() => setPhase("result")}
              className="mt-8 rounded-full bg-card/80 px-4 py-2 text-xs font-bold text-foreground/70 shadow-sm active:scale-95"
            >
              直接进入 →
            </button>
          </div>
        )}

        {/* RESULT */}
        {phase === "result" && (
          <div className="flex flex-1 flex-col text-center">
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-primary">你的人格是</p>
            <h1 className="mt-2 text-3xl">
              {persona.emoji} {persona.title}
            </h1>
            <p className="mt-1 text-xs font-mono text-muted-foreground">{code}</p>
            <p className="mt-4 leading-relaxed text-foreground/70">{persona.desc}</p>

            <div className="mt-6 rounded-3xl bg-card p-5 shadow-sm">
              <div className="relative mx-auto flex h-48 w-48 items-center justify-center overflow-hidden rounded-2xl bg-secondary">
                {petImage ? (
                  <img
                    src={petImage}
                    alt={name}
                    className={`h-full w-full object-cover transition-[filter] duration-500 ${
                      imgFinal ? "blur-0" : "blur-xl"
                    }`}
                  />
                ) : (
                  <div className="text-6xl opacity-40">{persona.pet}</div>
                )}
                {!imgFinal && !imgError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2 rounded-2xl bg-card/90 px-4 py-3 shadow">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <p className="text-[11px] font-bold text-foreground/70">正在为 ta 画像…</p>
                    </div>
                  </div>
                )}
              </div>
              <p className="mt-3 text-lg font-bold">{name}</p>
              <p className="text-xs text-muted-foreground">{persona.title} · 和你一起成长</p>
              {imgError && (
                <p className="mt-2 text-[11px] text-muted-foreground">生成失败，将使用默认形象</p>
              )}
            </div>

            <div className="mt-auto flex gap-2 pt-6">
              <button
                onClick={() => { setAnswers([]); setQIdx(0); setPhase("quiz"); }}
                className="rounded-2xl bg-card px-5 py-3 font-bold"
              >
                重测
              </button>
              <button
                onClick={finish}
                disabled={!imgFinal}
                className="flex flex-1 items-center justify-center gap-1 rounded-2xl bg-primary py-3 font-bold text-primary-foreground shadow-lg disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" /> {imgFinal ? `带 ${name} 回家` : "正在生成…"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
