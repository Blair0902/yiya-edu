import { useEffect, useState } from "react";
import { usePet, savePet, PET_COLORS } from "@/lib/pet-store";
import { Sparkles, ArrowRight } from "lucide-react";

type Axis = "I" | "F" | "C" | "P"; // playful axes: Inner/Outer, Feeling/Thinking, Curious/Careful, Present/Planner
type QOpt = { label: string; emoji: string; axis: Axis; opposite: string };
type Q = { q: string; options: [QOpt, QOpt] };

const QUESTIONS: Q[] = [
  {
    q: "在小伙伴聚会时，我更喜欢…",
    options: [
      { label: "静静观察大家", emoji: "🌙", axis: "I", opposite: "O" },
      { label: "热情加入闹一闹", emoji: "🎉", axis: "I" /* dummy */, opposite: "O" },
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

// 4-letter code → cute persona name
const PERSONAS: Record<string, { title: string; desc: string; emoji: string }> = {
  IFCP: { title: "温柔探索家", desc: "内心柔软，充满好奇，喜欢跟着感觉走", emoji: "🌷" },
  IFCL: { title: "细腻小画家", desc: "感受细腻，喜欢把生活安排得温暖有序", emoji: "🎨" },
  IFSP: { title: "小小守护者", desc: "安静而体贴，总是默默照顾身边的人", emoji: "🕊️" },
  IFSL: { title: "静水深流者", desc: "温柔稳定，是可以依靠的小小灯塔", emoji: "🕯️" },
  ITCP: { title: "点子发明家", desc: "爱思考、爱试新，脑袋里全是奇思妙想", emoji: "💡" },
  ITCL: { title: "小小策略师", desc: "冷静又机灵，喜欢把事情想明白再做", emoji: "🧩" },
  ITSP: { title: "沉思观察员", desc: "安静细心，从细节里发现宝藏", emoji: "🔍" },
  ITSL: { title: "小小工程师", desc: "有条不紊，喜欢把世界搭得整整齐齐", emoji: "🛠️" },
  OFCP: { title: "阳光冒险家", desc: "热情又勇敢，愿意为在乎的人冲在前面", emoji: "☀️" },
  OFCL: { title: "温暖组织者", desc: "爱人也爱计划，是团队里的小太阳", emoji: "🌻" },
  OFSP: { title: "开心分享家", desc: "乐观外放，走到哪里都带来笑声", emoji: "🎈" },
  OFSL: { title: "温柔小队长", desc: "有责任心，也懂得照顾大家的感受", emoji: "🧡" },
  OTCP: { title: "点燃行动派", desc: "有想法就要试试看，勇于打破常规", emoji: "⚡" },
  OTCL: { title: "小小指挥官", desc: "目标清晰，喜欢带着大家往前走", emoji: "🚩" },
  OTSP: { title: "灵活实干家", desc: "干脆利落，遇到问题就出手解决", emoji: "🔧" },
  OTSL: { title: "稳稳建造者", desc: "认真踏实，说到就一定做到", emoji: "🏗️" },
};

type Phase = "splash" | "hatching" | "hatched" | "name" | "quiz" | "result";

export function AdoptionFlow() {
  const pet = usePet();
  const [phase, setPhase] = useState<Phase>("splash");
  const [name, setName] = useState(pet.name || "豆豆");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  // Splash → hatching → hatched auto sequence
  useEffect(() => {
    if (pet.adopted) return;
    if (phase !== "splash") return;
    const t1 = setTimeout(() => setPhase("hatching"), 1200);
    const t2 = setTimeout(() => setPhase("hatched"), 3200);
    const t3 = setTimeout(() => setPhase("name"), 4400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [phase, pet.adopted]);

  if (pet.adopted) return null;

  const palette = PET_COLORS[0];

  const chooseAnswer = (letter: string) => {
    const next = [...answers, letter];
    setAnswers(next);
    if (qIdx + 1 < QUESTIONS.length) {
      setQIdx(qIdx + 1);
    } else {
      setPhase("result");
    }
  };

  const code = answers.join("");
  const persona = PERSONAS[code] ?? PERSONAS.IFCP;

  const finish = () => {
    savePet({
      adopted: true,
      name: name.trim() || "豆豆",
      color: "sun",
      traits: [],
      personality: persona.title,
      personalityCode: code,
      mode: "student",
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-stretch justify-center bg-gradient-to-b from-[oklch(0.95_0.08_60)] via-[oklch(0.94_0.06_320)] to-[oklch(0.94_0.08_230)]">
      <div className="mx-auto flex w-full max-w-md flex-col px-6 pb-8 pt-12">

        {/* --- SPLASH / HATCHING / HATCHED --- */}
        {(phase === "splash" || phase === "hatching" || phase === "hatched") && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="relative h-56 w-56">
              <div
                className="absolute inset-0 animate-pulse rounded-full blur-3xl"
                style={{ background: "oklch(0.9 0.15 80 / 0.7)" }}
              />
              {/* Egg + hatch */}
              <div className="absolute inset-0 flex items-center justify-center">
                {phase === "splash" && (
                  <div className="text-9xl animate-[bounce_1.1s_ease-in-out_infinite]">🥚</div>
                )}
                {phase === "hatching" && (
                  <div className="relative">
                    <div className="text-9xl animate-[shake_0.35s_ease-in-out_infinite]">🥚</div>
                    <span className="absolute -right-2 -top-2 text-2xl animate-ping">✨</span>
                    <span className="absolute -left-3 top-6 text-xl animate-pulse">💫</span>
                  </div>
                )}
                {phase === "hatched" && (
                  <div className="flex flex-col items-center">
                    <div className="text-9xl drop-shadow-[0_10px_20px_rgba(220,140,40,0.4)] animate-[scale-in_0.4s_ease-out]">
                      {palette.emoji}
                    </div>
                    <div className="mt-2 text-3xl">🎉</div>
                  </div>
                )}
              </div>
            </div>
            <h1 className="mt-10 text-3xl">
              {phase === "splash" && "豆豆星球 🌍"}
              {phase === "hatching" && "咔… 咔… 快出来了！"}
              {phase === "hatched" && "一个新伙伴诞生啦！"}
            </h1>
            <p className="mt-3 px-4 leading-relaxed text-foreground/70">
              {phase === "splash" && "一个小生命正在等你…"}
              {phase === "hatching" && "感觉蛋壳在轻轻晃动"}
              {phase === "hatched" && "ta 想认识你 💛"}
            </p>
            <style>{`
              @keyframes shake {
                0%,100% { transform: rotate(-6deg) translateY(0); }
                50% { transform: rotate(6deg) translateY(-4px); }
              }
            `}</style>
          </div>
        )}

        {/* --- NAME --- */}
        {phase === "name" && (
          <div className="flex flex-1 flex-col">
            <div className="mb-4 flex gap-1.5">
              <div className="h-1.5 flex-1 rounded-full bg-primary" />
              <div className="h-1.5 flex-1 rounded-full bg-card" />
              <div className="h-1.5 flex-1 rounded-full bg-card" />
            </div>
            <h2 className="mt-6 text-2xl">给 ta 起个名字吧</h2>
            <p className="mt-1 text-sm text-foreground/60">这个名字会陪伴你们很久</p>
            <div className="mt-8 flex justify-center text-7xl">{palette.emoji}</div>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 8))}
              placeholder="例如：豆豆"
              className="mt-8 w-full rounded-2xl bg-card px-5 py-4 text-center text-xl font-bold shadow-sm outline-none ring-2 ring-transparent focus:ring-primary"
            />
            <p className="mt-2 text-center text-xs text-muted-foreground">{name.length}/8</p>
            <div className="mt-auto">
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

        {/* --- QUIZ --- */}
        {phase === "quiz" && (
          <div className="flex flex-1 flex-col">
            <div className="mb-4 flex gap-1.5">
              <div className="h-1.5 flex-1 rounded-full bg-primary" />
              <div className="h-1.5 flex-1 rounded-full bg-primary" />
              <div className="h-1.5 flex-1 rounded-full bg-card" />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-primary">
              人格小测验 · {qIdx + 1}/{QUESTIONS.length}
            </p>
            <h2 className="mt-2 text-2xl leading-snug">{QUESTIONS[qIdx].q}</h2>

            <div className="mt-8 flex flex-col gap-3">
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

        {/* --- RESULT --- */}
        {phase === "result" && (
          <div className="flex flex-1 flex-col text-center">
            <div className="mb-4 flex gap-1.5">
              <div className="h-1.5 flex-1 rounded-full bg-primary" />
              <div className="h-1.5 flex-1 rounded-full bg-primary" />
              <div className="h-1.5 flex-1 rounded-full bg-primary" />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-widest text-primary">你的人格是</p>
            <h1 className="mt-2 text-3xl">
              {persona.emoji} {persona.title}
            </h1>
            <p className="mt-1 text-xs font-mono text-muted-foreground">{code}</p>
            <p className="mt-4 leading-relaxed text-foreground/70">{persona.desc}</p>

            <div className="mt-8 rounded-3xl bg-card p-5 shadow-sm">
              <div className="text-6xl">{palette.emoji}</div>
              <p className="mt-2 text-lg font-bold">{name}</p>
              <p className="text-xs text-muted-foreground">{persona.title} · 和你一起成长</p>
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
                className="flex flex-1 items-center justify-center gap-1 rounded-2xl bg-primary py-3 font-bold text-primary-foreground shadow-lg"
              >
                <Sparkles className="h-4 w-4" /> 带 {name} 回家
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
