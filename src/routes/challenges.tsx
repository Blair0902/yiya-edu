import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { FireworksCanvas } from "@/components/Fireworks";
import { GameModal, type GameId } from "@/components/GameModal";
import {
  Calculator, Languages, Scroll, Brain, HardHat, Sparkles,
  Focus, Heart, NotebookPen, Clock, Rocket, Gift, X,
} from "lucide-react";
import { useState, useRef } from "react";

export const Route = createFileRoute("/challenges")({
  head: () => ({
    meta: [
      { title: "挑战 · 学习 · 自我觉察 · 遇见" },
      { name: "description", content: "学科能力、AI 时代核心能力、自我觉察与跨时空对话。" },
    ],
  }),
  component: Challenges,
});

type Item = {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  name: string; energy: number; done: number; total: number; color: string; tag?: string;
  game?: GameId; intro?: string;
};
type Sub = { title: string; items: Item[] };
type Section = { key: string; title: string; emoji: string; subs: Sub[] };

const initial: Section[] = [
  {
    key: "学习", title: "学习", emoji: "📚",
    subs: [
      {
        title: "学科能力",
        items: [
          {
            icon: Scroll, name: "古诗文 · 智能背诵", energy: 25, done: 0, total: 1, color: "oklch(0.8 0.13 60)", tag: "AI",
            game: "poetry",
            intro:
              "覆盖中考古诗文阅读、高考古代诗文阅读全部课内必考篇目，包含文言文、古诗词两大核心内容。可自主选择教材及篇目，通过智能出题和周期性滚动复习，解决古诗文背诵及理解问题，对接默写、文言文翻译、诗词鉴赏等题型，稳步提升语文古诗文板块分值。",
          },
          {
            icon: Calculator, name: "数学 · 754 每日练习", energy: 18, done: 0, total: 1, color: "oklch(0.82 0.13 230)",
            game: "math754",
            intro:
              "在 7 分钟内完成 5 道 4 位数相乘的竖式练习。通过限时计算打磨细心度和心理韧性，提升运算速度、准确率，夯实数学计算基础。",
          },
          {
            icon: Languages, name: "英语 · 单词成文", energy: 20, done: 0, total: 1, color: "oklch(0.82 0.14 150)", tag: "AI",
            game: "english",
            intro:
              "录入本周新学的 5 个英文单词，AI 根据所选题材生成适配阅读水平的英文短文。完成短文朗读录音即可打卡，在语境中活学活用生词。",
          },
        ],
      },
      {
        title: "AI 时代核心能力",
        items: [
          {
            icon: Brain, name: "思辨 · 今天的一个为什么", energy: 20, done: 0, total: 1, color: "oklch(0.74 0.16 280)",
            game: "why",
            intro:
              "根据当日学习、生活真实情境，从青少年全人发展维度中任选其一，提出好奇问题，和 AI 协作梳理思考逻辑，锻炼提问、求证与独立思辨能力。",
          },
          {
            icon: HardHat, name: "六顶思考帽 · 多维度思考", energy: 30, done: 0, total: 1, color: "oklch(0.72 0.18 35)",
            game: "hats",
            intro:
              "从适宜青少年思辨讨论的新闻事件列表中选取感兴趣的议题，联动 AI 依次切换六重视角开展平行思考：白帽梳理客观事实数据、红帽表达直观情绪感受、黑帽深挖潜在风险弊端、黄帽探索事件价值机遇、绿帽构思创新解决思路、蓝帽统筹流程并汇总全部观点。建立结构化完整思考框架，完成深度思辨训练。",
          },
          {
            icon: Focus, name: "专注 · 舒尔特方格", energy: 15, done: 0, total: 1, color: "oklch(0.78 0.16 320)",
            game: "schulte",
            intro:
              "标准舒尔特方格专注力训练，按从小到大顺序快速点选方格内数字，限时完成多组练习。长期训练可提升视觉搜寻速度、视觉稳定性与注意力持续时长，改善上课走神、做题粗心、阅读跳字漏行、专注力薄弱等问题，高效夯实专注底层能力。",
          },
        ],
      },
    ],
  },
  {
    key: "觉察", title: "自我觉察（当下）", emoji: "💗",
    subs: [
      {
        title: "今天的我",
        items: [
          { icon: Heart, name: "一个收获", energy: 12, done: 0, total: 1, color: "oklch(0.74 0.16 15)" },
          { icon: NotebookPen, name: "一个感想 · 日记", energy: 12, done: 0, total: 1, color: "oklch(0.78 0.12 145)" },
        ],
      },
    ],
  },
  {
    key: "遇见", title: "遇见（跨时空）", emoji: "🌌",
    subs: [
      {
        title: "对话",
        items: [
          { icon: Clock, name: "与 6 岁的自己对话", energy: 25, done: 0, total: 1, color: "oklch(0.78 0.13 60)", tag: "历史" },
          { icon: Rocket, name: "与 30 岁的自己对话", energy: 25, done: 0, total: 1, color: "oklch(0.72 0.16 280)", tag: "未来" },
        ],
      },
    ],
  },
];

type Completed = { name: string; energy: number; color: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> };

function Challenges() {
  const [sections, setSections] = useState(initial);
  const [activeKey, setActiveKey] = useState(initial[0].key);
  const [showFireworks, setShowFireworks] = useState(false);
  const [exploding, setExploding] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState<Completed[]>([]);
  const [showBox, setShowBox] = useState(false);
  const fireworksTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const removeItem = (name: string, doneItem: Completed) => {
    setSections((sects) =>
      sects.map((sec) => ({
        ...sec,
        subs: sec.subs.map((sub) => ({
          ...sub,
          items: sub.items.filter((it) => it.name !== name),
        })),
      }))
    );
    setCompleted((c) => [doneItem, ...c]);
    setExploding((s) => {
      const n = new Set(s); n.delete(name); return n;
    });
  };

  const handleCheckIn = (sKey: string, subIdx: number, itemIdx: number) => {
    let burstItem: Completed | null = null;
    let burstName: string | null = null;
    setSections((sects) =>
      sects.map((sec) => {
        if (sec.key !== sKey) return sec;
        return {
          ...sec,
          subs: sec.subs.map((sub, si) =>
            si !== subIdx ? sub : {
              ...sub,
              items: sub.items.map((it, ii) => {
                if (ii !== itemIdx) return it;
                if (it.done >= it.total) return it;
                const next = Math.min(it.done + 1, it.total);
                if (next === it.total) {
                  burstName = it.name;
                  burstItem = { name: it.name, energy: it.energy, color: it.color, icon: it.icon };
                }
                return { ...it, done: next };
              }),
            }
          ),
        };
      })
    );
    if (burstName && burstItem) {
      setShowFireworks(true);
      if (fireworksTimer.current) clearTimeout(fireworksTimer.current);
      fireworksTimer.current = setTimeout(() => setShowFireworks(false), 2500);
      const name = burstName; const item = burstItem;
      setExploding((s) => new Set(s).add(name));
      setTimeout(() => removeItem(name, item), 550);
    }
  };

  const active = sections.find((s) => s.key === activeKey)!;

  return (
    <AppShell>
      <div className="relative">
        <FireworksCanvas active={showFireworks} />
        <header className="px-5 pb-3 pt-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Challenges</p>
          <h1 className="mt-1 text-3xl">打卡挑战 🏆</h1>
          <p className="mt-1 text-sm text-muted-foreground">每完成一项，豆豆都会闪闪发光～</p>

          <button
            onClick={() => setShowBox(true)}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-sm font-bold shadow-sm active:scale-95"
          >
            <span>今日已打卡 {completed.length}</span>
            <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-primary/15">
              <Gift className="h-4 w-4 text-primary" />
              {completed.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {completed.length}
                </span>
              )}
            </span>
          </button>
        </header>

        {/* Section tabs */}
        <div className="sticky top-0 z-20 flex gap-2 overflow-x-auto bg-background/85 px-4 py-2 backdrop-blur-md">
          {sections.map((s) => {
            const a = s.key === activeKey;
            return (
              <button
                key={s.key}
                onClick={() => setActiveKey(s.key)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-bold ${
                  a ? "bg-primary text-primary-foreground" : "bg-card text-foreground/70"
                }`}
              >
                {s.emoji} {s.title}
              </button>
            );
          })}
        </div>

        {active.subs.map((g, gi) => (
          <section key={g.title} className="mt-2 px-4 pb-2">
            <h3 className="mb-2 px-1 text-sm font-bold text-muted-foreground">{g.title}</h3>
            {g.items.length === 0 ? (
              <p className="px-1 text-xs text-muted-foreground">全部完成啦 🎉</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {g.items.map((it, ii) => {
                  const pct = (it.done / it.total) * 100;
                  const Icon = it.icon;
                  const finished = pct === 100;
                  const isBursting = exploding.has(it.name);
                  return (
                    <li
                      key={it.name}
                      className={`card-pop p-4 transition-all duration-500 ${
                        isBursting ? "scale-125 opacity-0 blur-sm" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-2xl"
                          style={{ background: `color-mix(in oklab, ${it.color} 20%, white)` }}
                        >
                          <Icon className="h-6 w-6" style={{ color: it.color }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold leading-tight">{it.name}</h4>
                            {it.tag && (
                              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                                {it.tag}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-primary">
                            <Sparkles className="h-3 w-3" /> +{it.energy} 能量 · {it.done}/{it.total}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCheckIn(active.key, gi, ii)}
                          disabled={finished || isBursting}
                          className={`rounded-full px-3 py-1.5 text-sm font-bold transition-all ${
                            finished ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground active:scale-95"
                          }`}
                        >
                          {finished ? "已完成" : "打卡"}
                        </button>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: it.color }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ))}

        {showBox && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 animate-fade-in"
            onClick={() => setShowBox(false)}
          >
            <div
              className="w-full max-w-md rounded-t-3xl bg-background p-5 pb-8 animate-slide-in-right"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" /> 今日已打卡 ({completed.length})
                </h3>
                <button onClick={() => setShowBox(false)} className="rounded-full p-1 active:scale-90">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {completed.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">还没有完成的习惯，去打卡吧～</p>
              ) : (
                <ul className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
                  {completed.map((c) => {
                    const Icon = c.icon;
                    return (
                      <li key={c.name} className="flex items-center gap-3 rounded-2xl bg-card p-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl"
                          style={{ background: `color-mix(in oklab, ${c.color} 20%, white)` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: c.color }} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm leading-tight">{c.name}</p>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-primary">
                            <Sparkles className="h-3 w-3" /> +{c.energy} 能量
                          </p>
                        </div>
                        <span className="text-lg">✅</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
