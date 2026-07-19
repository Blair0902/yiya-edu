import { useEffect, useState } from "react";
import { usePet, savePet, PET_AVATARS } from "@/lib/pet-store";
import { ArrowRight, SkipForward, Check, Sparkles, X } from "lucide-react";

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

const MBTI_LIST = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
];

const TAG_SUGGESTIONS = [
  "巨蟹座", "白羊座", "金牛座", "双子座", "狮子座", "处女座",
  "天秤座", "天蝎座", "射手座", "摩羯座", "水瓶座", "双鱼座",
  "猫奴", "狗派", "挑灯夜读", "早起鸟", "夜猫子", "运动爱好者",
  "追剧党", "电竞少年", "文艺青年", "游戏迷", "手账控", "美食家",
  "小书虫", "画画中", "音乐节拍", "旅行控", "颜控", "社恐",
];

function Egg({ color, pattern, size = 180, animate }: {
  color: string; pattern: string; size?: number; animate?: "float" | "shake" | "none";
}) {
  const c = EGG_COLORS.find((x) => x.key === color) ?? EGG_COLORS[0];
  const patternId = `pat-${color}-${pattern}`;
  const renderPattern = () => {
    switch (pattern) {
      case "dots":
        return <g fill={c.shell} opacity={0.75}>{[[30,40],[65,55],[45,80],[75,95],[30,115],[60,130]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={5}/>)}</g>;
      case "stripes":
        return <g stroke={c.shell} strokeWidth={5} opacity={0.7} fill="none" strokeLinecap="round"><path d="M15,55 Q50,50 85,58"/><path d="M10,85 Q50,80 90,88"/><path d="M12,115 Q50,110 88,118"/></g>;
      case "stars":
        return <g fill={c.shell} opacity={0.85}>{[[35,45],[65,65],[40,95],[70,115],[30,130]].map(([x,y],i)=><text key={i} x={x} y={y} fontSize={14} textAnchor="middle">★</text>)}</g>;
      case "hearts":
        return <g fill={c.shell} opacity={0.85}>{[[35,55],[65,75],[40,105],[70,125]].map(([x,y],i)=><text key={i} x={x} y={y} fontSize={14} textAnchor="middle">♥</text>)}</g>;
      case "zigzag":
        return <g stroke={c.shell} strokeWidth={4} fill="none" opacity={0.7} strokeLinecap="round" strokeLinejoin="round"><path d="M10,60 L25,50 L40,60 L55,50 L70,60 L85,50"/><path d="M10,95 L25,85 L40,95 L55,85 L70,95 L85,85"/><path d="M12,130 L27,120 L42,130 L57,120 L72,130 L87,120"/></g>;
      default: return null;
    }
  };
  const anim = animate === "shake" ? "animate-[eggshake_0.35s_ease-in-out_infinite]"
    : animate === "float" ? "animate-[bounce_2.6s_ease-in-out_infinite]" : "";
  return (
    <div style={{ width: size, height: size }} className={`relative ${anim}`}>
      <svg viewBox="0 0 100 140" className="h-full w-full drop-shadow-[0_10px_18px_rgba(120,80,40,0.28)]">
        <defs><radialGradient id={patternId} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85"/>
          <stop offset="55%" stopColor={c.base}/>
          <stop offset="100%" stopColor={c.shell}/>
        </radialGradient></defs>
        <path d="M50,4 C22,4 8,55 8,90 C8,120 27,136 50,136 C73,136 92,120 92,90 C92,55 78,4 50,4 Z" fill={`url(#${patternId})`} stroke={c.shell} strokeWidth={1.5}/>
        {renderPattern()}
      </svg>
      <style>{`@keyframes eggshake { 0%,100% { transform: rotate(-8deg) translateY(0); } 50% { transform: rotate(8deg) translateY(-6px); } }`}</style>
    </div>
  );
}

type Phase = "splash" | "egg" | "name" | "profile" | "avatar" | "done";

const STEPS: { key: Phase; label: string; short: string }[] = [
  { key: "splash", label: "开屏", short: "开屏" },
  { key: "egg", label: "选蛋", short: "选蛋" },
  { key: "name", label: "起名", short: "起名" },
  { key: "profile", label: "个人资料", short: "资料" },
  { key: "avatar", label: "选形象", short: "形象" },
  { key: "done", label: "完成", short: "完成" },
];

export function AdoptionFlow() {
  const pet = usePet();
  const [phase, setPhase] = useState<Phase>("splash");
  const [name, setName] = useState(pet.name || "豆豆");
  const [eggColor, setEggColor] = useState<string>("sun");
  const [eggPattern, setEggPattern] = useState<string>("dots");
  const [mbti, setMbti] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [avatar, setAvatar] = useState<string>(PET_AVATARS[0]);

  useEffect(() => {
    if (pet.adopted) return;
    if (phase !== "splash") return;
    const t = setTimeout(() => setPhase("egg"), 1800);
    return () => clearTimeout(t);
  }, [phase, pet.adopted]);

  if (pet.adopted) return null;

  const toggleTag = (t: string) => {
    setTags((s) => s.includes(t) ? s.filter((x) => x !== t) : [...s, t]);
  };
  const addCustom = () => {
    const t = customTag.trim();
    if (!t) return;
    if (!tags.includes(t)) setTags([...tags, t]);
    setCustomTag("");
  };

  const finish = () => {
    savePet({
      adopted: true,
      name: name.trim() || "豆豆",
      color: eggColor,
      traits: [],
      avatar,
      eggColor,
      eggPattern,
      mbti: mbti || undefined,
      tags,
      mode: "student",
    });
  };

  const currentStepIdx = STEPS.findIndex((s) => s.key === phase);
  const currentStep = STEPS[currentStepIdx];
  const canSkip = phase === "splash";

  return (
    <div className="fixed inset-0 z-[100] flex items-stretch justify-center overflow-y-auto bg-gradient-to-b from-[oklch(0.95_0.08_60)] via-[oklch(0.94_0.06_320)] to-[oklch(0.94_0.08_230)]">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col px-6 pb-8 pt-6">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
              {String(currentStepIdx + 1).padStart(2, "0")} · {currentStep.label}
            </p>
            {canSkip && (
              <button
                onClick={() => setPhase("egg")}
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
                  <div className={`h-1.5 w-full rounded-full transition-all ${done ? "bg-primary" : active ? "bg-primary/70" : "bg-card"}`}/>
                  <span className={`text-[9px] font-bold transition-colors ${done || active ? "text-primary" : "text-foreground/40"}`}>{s.short}</span>
                </div>
              );
            })}
          </div>
        </div>

        {phase === "splash" && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="text-8xl animate-[bounce_1.2s_ease-in-out_infinite]">🌍</div>
            <h1 className="mt-8 text-3xl">豆豆星球</h1>
            <p className="mt-2 leading-relaxed text-foreground/70">一颗蛋正在等你领取…</p>
            <button onClick={() => setPhase("egg")} className="mt-8 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-md active:scale-95">开始 →</button>
          </div>
        )}

        {phase === "egg" && (
          <div className="flex flex-1 flex-col">
            <h2 className="mt-2 text-2xl">领取你的蛋 🥚</h2>
            <p className="mt-1 text-sm text-foreground/60">选一个颜色和花纹</p>
            <div className="mt-6 flex items-center justify-center">
              <Egg color={eggColor} pattern={eggPattern} size={180} animate="float" />
            </div>
            <p className="mt-4 px-1 text-xs font-bold uppercase tracking-widest text-primary">颜色</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {EGG_COLORS.map((c) => (
                <button key={c.key} onClick={() => setEggColor(c.key)} aria-label={c.label}
                  className={`flex h-11 w-11 items-center justify-center rounded-full ring-2 transition-all active:scale-90 ${eggColor === c.key ? "ring-primary scale-105" : "ring-transparent"}`}
                  style={{ background: `linear-gradient(135deg, ${c.base}, ${c.shell})` }}>
                  {eggColor === c.key && <Check className="h-5 w-5 text-white drop-shadow" />}
                </button>
              ))}
            </div>
            <p className="mt-4 px-1 text-xs font-bold uppercase tracking-widest text-primary">花纹</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {EGG_PATTERNS.map((p) => {
                const on = eggPattern === p.key;
                return (
                  <button key={p.key} onClick={() => setEggPattern(p.key)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${on ? "bg-primary text-primary-foreground" : "bg-card text-foreground/70 ring-1 ring-border"}`}>
                    {p.label}
                  </button>
                );
              })}
            </div>
            <div className="mt-auto pt-6">
              <button onClick={() => setPhase("name")} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-bold text-primary-foreground shadow-lg active:scale-95">
                领取这颗蛋 <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {phase === "name" && (
          <div className="flex flex-1 flex-col">
            <h2 className="mt-2 text-2xl">给蛋里的 ta 起个名字</h2>
            <p className="mt-1 text-sm text-foreground/60">这个名字会陪伴你们很久</p>
            <div className="mt-6 flex justify-center">
              <Egg color={eggColor} pattern={eggPattern} size={140} animate="float" />
            </div>
            <input autoFocus value={name} onChange={(e) => setName(e.target.value.slice(0, 8))} placeholder="例如：豆豆"
              className="mt-6 w-full rounded-2xl bg-card px-5 py-4 text-center text-xl font-bold shadow-sm outline-none ring-2 ring-transparent focus:ring-primary"/>
            <p className="mt-2 text-center text-xs text-muted-foreground">{name.length}/8</p>
            <div className="mt-auto pt-6">
              <button disabled={!name.trim()} onClick={() => setPhase("profile")}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-bold text-primary-foreground disabled:opacity-40">
                下一步 <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {phase === "profile" && (
          <div className="flex flex-1 flex-col">
            <h2 className="mt-2 text-2xl">你是一个什么样的人？</h2>
            <p className="mt-1 text-sm text-foreground/60">选择你的 MBTI，添加一些能代表你的标签</p>

            <p className="mt-5 px-1 text-xs font-bold uppercase tracking-widest text-primary">MBTI（可跳过）</p>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {MBTI_LIST.map((m) => {
                const on = mbti === m;
                return (
                  <button key={m} onClick={() => setMbti(on ? "" : m)}
                    className={`rounded-xl py-2 text-xs font-bold ring-1 transition-all active:scale-95 ${on ? "bg-primary text-primary-foreground ring-primary" : "bg-card text-foreground/70 ring-border"}`}>
                    {m}
                  </button>
                );
              })}
            </div>

            <p className="mt-5 px-1 text-xs font-bold uppercase tracking-widest text-primary">
              标签 <span className="text-foreground/50">· 已选 {tags.length}</span>
            </p>
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5 rounded-2xl bg-card/60 p-2">
                {tags.map((t) => (
                  <span key={t} className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
                    {t}
                    <button onClick={() => toggleTag(t)} aria-label="移除"><X className="h-3 w-3"/></button>
                  </span>
                ))}
              </div>
            )}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {TAG_SUGGESTIONS.filter((t) => !tags.includes(t)).map((t) => (
                <button key={t} onClick={() => toggleTag(t)}
                  className="rounded-full bg-card px-3 py-1 text-xs font-bold text-foreground/70 ring-1 ring-border active:scale-95">
                  + {t}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-2xl bg-card p-2 ring-1 ring-border">
              <input value={customTag} onChange={(e) => setCustomTag(e.target.value.slice(0, 10))}
                onKeyDown={(e) => { if (e.key === "Enter") addCustom(); }}
                placeholder="添加自定义标签…"
                className="flex-1 bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground"/>
              <button onClick={addCustom} disabled={!customTag.trim()}
                className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground disabled:opacity-40">添加</button>
            </div>

            <div className="mt-auto pt-6">
              <button onClick={() => setPhase("avatar")}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-bold text-primary-foreground shadow-lg active:scale-95">
                下一步 <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {phase === "avatar" && (
          <div className="flex flex-1 flex-col">
            <h2 className="mt-2 text-2xl">给 {name} 选一个形象</h2>
            <p className="mt-1 text-sm text-foreground/60">挑一个你最喜欢的</p>

            <div className="mt-6 flex justify-center">
              <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-card text-7xl shadow-md">
                {avatar}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-4 gap-2">
              {PET_AVATARS.map((a) => {
                const on = avatar === a;
                return (
                  <button key={a} onClick={() => setAvatar(a)}
                    className={`flex h-16 items-center justify-center rounded-2xl text-3xl ring-2 transition-all active:scale-95 ${on ? "bg-primary/15 ring-primary" : "bg-card ring-transparent"}`}>
                    {a}
                  </button>
                );
              })}
            </div>

            <div className="mt-auto pt-6">
              <button onClick={finish}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-bold text-primary-foreground shadow-lg active:scale-95">
                <Sparkles className="h-5 w-5" /> 带 {name} 回家
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
