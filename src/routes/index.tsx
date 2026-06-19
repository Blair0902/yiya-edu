import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { FireworksCanvas } from "@/components/Fireworks";
import { EmotionDialog } from "@/components/EmotionDialog";
import { usePet, PET_COLORS } from "@/lib/pet-store";
import petImg from "@/assets/pet.png";
import sceneImg from "@/assets/scene.jpg";
import {
  Sparkles, Check, Settings, Share2, Smile, Volume2, MessageCircleHeart, Sparkle, Flame, Heart, Send,
} from "lucide-react";
import { useState, useRef } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "豆豆星球 · 亲子习惯 & 心灵相通" },
      { name: "description", content: "完成微小任务，养成宠物，看见彼此的感受与需要。" },
    ],
  }),
  component: HomePage,
});

type Task = { id: number; emoji: string; title: string; energy: number; done: boolean; cat: string };

const seed: Task[] = [
  { id: 1, emoji: "🌅", title: "按时起床", energy: 5, done: true, cat: "健房" },
  { id: 2, emoji: "🪥", title: "认真刷牙", energy: 5, done: true, cat: "健房" },
  { id: 3, emoji: "💧", title: "喝一杯水", energy: 5, done: false, cat: "健房" },
  { id: 4, emoji: "🌬️", title: "三个深呼吸", energy: 8, done: false, cat: "健房" },
  { id: 5, emoji: "🧘", title: "三个拉伸动作", energy: 8, done: false, cat: "健房" },
  { id: 6, emoji: "🌟", title: "今天的一个收获", energy: 12, done: false, cat: "自我觉察" },
  { id: 7, emoji: "💝", title: "今天的一个感恩", energy: 12, done: false, cat: "自我觉察" },
];

function HomePage() {
  const [mode, setMode] = useState<"student" | "parent">("student");
  const [emotionOpen, setEmotionOpen] = useState(false);
  return (
    <AppShell>
      <ModeToggle mode={mode} setMode={setMode} onOpenEmotion={() => setEmotionOpen(true)} />
      {mode === "student" ? <StudentHome /> : <ParentHome />}
      <EmotionDialog open={emotionOpen} onClose={() => setEmotionOpen(false)} />
    </AppShell>
  );
}

function ModeToggle({ mode, setMode, onOpenEmotion }: { mode: "student" | "parent"; setMode: (m: "student" | "parent") => void; onOpenEmotion: () => void }) {
  return (
    <div className="sticky top-0 z-40 flex items-center justify-between gap-3 bg-background/85 px-4 py-2.5 backdrop-blur-md">
      <button aria-label="设置" className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-sm">
        <Settings className="h-4 w-4 text-foreground/70" />
      </button>
      <div className="flex rounded-full bg-card p-0.5 shadow-sm">
        {[
          { k: "student", label: "学生端" },
          { k: "parent", label: "家长端" },
        ].map((m) => (
          <button
            key={m.k}
            onClick={() => setMode(m.k as "student" | "parent")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
              mode === m.k ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <button onClick={onOpenEmotion} aria-label="情绪标签" className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-sm">
        <Smile className="h-4 w-4 text-berry" />
      </button>
    </div>
  );
}

function StudentHome() {
  const [tasks, setTasks] = useState(seed);
  const [showFireworks, setShowFireworks] = useState(false);
  const fireworksTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const done = tasks.filter((t) => t.done).length;
  const energy = tasks.filter((t) => t.done).reduce((s, t) => s + t.energy, 0);

  const toggle = (id: number) => {
    setTasks((ts) => {
      const target = ts.find((t) => t.id === id);
      if (target && !target.done) {
        setShowFireworks(true);
        if (fireworksTimer.current) clearTimeout(fireworksTimer.current);
        fireworksTimer.current = setTimeout(() => setShowFireworks(false), 2500);
      }
      return ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    });
  };

  const groups = ["健房", "自我觉察"];

  return (
    <div className="relative">
      <FireworksCanvas active={showFireworks} />

      {/* status pills */}
      <div className="flex items-center justify-center gap-2 px-4 pt-1">
        <span className="pill flex items-center gap-1 bg-card"><Flame className="h-3.5 w-3.5 text-primary" />12 天</span>
        <span className="pill flex items-center gap-1 bg-card"><Sparkles className="h-3.5 w-3.5 text-primary" />{420 + energy}</span>
        <button className="pill flex items-center gap-1 bg-card"><Share2 className="h-3.5 w-3.5 text-leaf" />分享</button>
      </div>

      {/* Pet scene */}
      <div
        className="relative mt-2 h-64 w-full overflow-hidden"
        style={{ backgroundImage: `url(${sceneImg})`, backgroundSize: "cover", backgroundPosition: "center bottom" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <img src={petImg} alt="宠物豆豆" width={768} height={768} className="absolute bottom-0 left-1/2 h-52 w-52 -translate-x-1/2 drop-shadow-xl" />
        <div className="absolute bottom-4 right-3 rounded-2xl bg-card/90 px-3 py-1.5 text-xs font-bold shadow-sm">豆豆 · Lv.4</div>
      </div>

      {/* Chat 聊天区 (学生：跟自己说好听的话 / 探索 / 概略) */}
      <section className="px-4">
        <div className="card-pop relative -mt-6 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-secondary">
              <MessageCircleHeart className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">跟自己说点好听的</p>
              <p className="mt-1 leading-relaxed">"你今天愿意起床这件事本身，就已经很勇敢了。" 🌱</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-bold">
                  <Volume2 className="h-3.5 w-3.5" /> 朗读
                </button>
                <Link to="/weiyan" className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  <Sparkle className="h-3.5 w-3.5" /> 微言 · 探索
                </Link>
                <button className="flex items-center gap-1 rounded-full bg-card px-3 py-1 text-xs font-bold text-foreground/70 ring-1 ring-border">
                  概略 · AI 剖析
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily progress */}
      <section className="mt-4 px-4">
        <div className="flex items-end justify-between">
          <h2 className="text-xl">今日打卡 · {done}/{tasks.length}</h2>
          <span className="text-xs text-muted-foreground">零压力启动 ✨</span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full transition-all" style={{ width: `${(done / tasks.length) * 100}%`, background: "var(--gradient-sun)" }} />
        </div>
      </section>

      {groups.map((g) => (
        <section key={g} className="mt-4 px-4">
          <h3 className="mb-2 px-1 text-sm font-bold text-muted-foreground">
            {g === "健房" ? "🧘 健房 · 基础自我照亮" : "💗 自我觉察"}
          </h3>
          <ul className="flex flex-col gap-2">
            {tasks.filter((t) => t.cat === g).map((t) => (
              <li key={t.id} className="card-pop flex items-center gap-3 p-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-xl">{t.emoji}</div>
                <div className="flex-1">
                  <p className={`font-bold ${t.done ? "text-muted-foreground line-through" : ""}`}>{t.title}</p>
                  <span className="flex items-center gap-0.5 text-xs text-primary">
                    <Sparkles className="h-3 w-3" /> +{t.energy} 能量
                  </span>
                </div>
                <button
                  onClick={() => toggle(t.id)}
                  aria-label="完成"
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                    t.done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-transparent"
                  }`}
                >
                  <Check className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <div className="mt-4 px-4">
        <Link to="/challenges" className="card-pop flex items-center justify-between bg-gradient-to-r from-[oklch(0.88_0.1_85)] to-[oklch(0.86_0.13_60)] p-4">
          <div>
            <p className="text-xs font-bold uppercase text-primary">学习 · 自我觉察 · 遇见</p>
            <p className="text-sm font-bold">学科 + AI 核心能力 + 跨时空对话</p>
          </div>
          <span className="rounded-full bg-card px-3 py-1.5 text-sm font-bold">去挑战 →</span>
        </Link>
      </div>
    </div>
  );
}

function ParentHome() {
  return (
    <div className="px-4 pt-2">
      {/* 看见自己 */}
      <section className="card-pop mt-2 p-4">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-berry" />
          <p className="text-xs font-bold uppercase tracking-widest text-berry">看见自己</p>
        </div>
        <h2 className="mt-1 text-lg">有能量的话</h2>
        <p className="mt-2 rounded-2xl bg-secondary p-3 leading-relaxed">
          "当你愿意慢下来听孩子说话，你已经在做最重要的那件事。" 🌿
        </p>
        <div className="mt-3 flex gap-2">
          <button className="flex items-center gap-1 rounded-full bg-card px-3 py-1.5 text-xs font-bold ring-1 ring-border">
            <Volume2 className="h-3.5 w-3.5" /> 朗读
          </button>
          <button className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">
            <Share2 className="h-3.5 w-3.5" /> 转发日签
          </button>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">微信 · 朋友圈 · 小红书 · 抖音 · 微博</p>
      </section>

      {/* 看见孩子 */}
      <section className="mt-3">
        <div className="mb-2 flex items-center gap-2 px-1">
          <Sparkle className="h-4 w-4 text-primary" />
          <p className="text-xs font-bold uppercase tracking-widest text-primary">看见孩子</p>
        </div>

        <div className="card-pop mb-2 p-4">
          <p className="text-xs font-bold text-muted-foreground">新发布的微言 · 自我观察</p>
          <p className="mt-1 leading-relaxed">"今天数学课没听懂，但我没有不开心，下课问了同桌。"</p>
          <div className="mt-2 flex gap-2 text-xs">
            <span className="rounded-full bg-secondary px-2 py-0.5">💗 想回应</span>
            <span className="rounded-full bg-secondary px-2 py-0.5">🌿 我懂</span>
          </div>
        </div>

        <div className="card-pop mb-2 p-4">
          <p className="text-xs font-bold text-muted-foreground">概略 · 释放负能量</p>
          <p className="mt-1 text-sm leading-relaxed text-foreground/80">
            最近一周，孩子情绪关键词：<span className="font-bold text-berry">紧张</span> · <span className="font-bold text-primary">期待</span> · <span className="font-bold text-leaf">小自豪</span>
          </p>
          <button className="mt-2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">查看 AI 沟通建议</button>
        </div>

        {/* 一件好事 */}
        <div className="card-pop bg-gradient-to-br from-[oklch(0.93_0.08_145)] to-[oklch(0.96_0.04_80)] p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-leaf">一件好事</p>
          <p className="mt-1 text-sm text-foreground/70">记录今天孩子的一个小小进步，把注意力放在成长上</p>
          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-card p-2 ring-1 ring-border">
            <input
              type="text"
              placeholder="今天孩子做了什么让你觉得温暖的事？"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 数据看板入口 */}
      <section className="mt-3">
        <Link to="/me" className="card-pop flex items-center justify-between bg-gradient-to-r from-[oklch(0.88_0.1_230)] to-[oklch(0.9_0.07_280)] p-4">
          <div>
            <p className="text-xs font-bold uppercase text-primary">家长数据看板</p>
            <p className="text-sm font-bold">行为 · 想法 · 感受 · 需求</p>
          </div>
          <span className="rounded-full bg-card px-3 py-1.5 text-sm font-bold">查看 →</span>
        </Link>
      </section>
    </div>
  );
}
