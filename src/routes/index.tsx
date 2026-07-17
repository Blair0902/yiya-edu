import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { AdoptionFlow } from "@/components/AdoptionFlow";
import { FireworksCanvas } from "@/components/Fireworks";
import { EmotionDialog } from "@/components/EmotionDialog";
import { GameModal, type GameId } from "@/components/GameModal";
import { usePet, PET_COLORS } from "@/lib/pet-store";
import { addEnergy, useEnergyTotal } from "@/lib/energy-store";
import sceneImg from "@/assets/scene.jpg";
import {
  Sparkles, Check, Settings, Share2, Smile, Volume2, MessageCircleHeart, Sparkle, Flame, Heart, Send,
  CalendarDays, Clock, Rocket, NotebookPen, Plus, X, Trash2,
} from "lucide-react";
import { useEffect, useState, useRef, type ReactNode } from "react";


const HABIT_SUGGESTIONS: { cat: string; emoji: string; items: { emoji: string; title: string; energy: number }[] }[] = [
  { cat: "Easy Wins", emoji: "⭐", items: [
    { emoji: "🛏️", title: "整理床铺", energy: 5 },
    { emoji: "🧦", title: "把袜子放好", energy: 3 },
  ]},
  { cat: "Gratitude", emoji: "🙏", items: [
    { emoji: "💌", title: "写一件感谢的事", energy: 8 },
    { emoji: "🤗", title: "对家人说谢谢", energy: 6 },
  ]},
  { cat: "Calm", emoji: "🧘", items: [
    { emoji: "🌬️", title: "三个深呼吸", energy: 8 },
    { emoji: "🕯️", title: "静坐 3 分钟", energy: 10 },
  ]},
  { cat: "Connection", emoji: "💗", items: [
    { emoji: "📞", title: "给朋友发条消息", energy: 8 },
    { emoji: "👨‍👩‍👧", title: "和家人聊 5 分钟", energy: 10 },
  ]},
  { cat: "Hygiene", emoji: "🧼", items: [
    { emoji: "🪥", title: "认真刷牙", energy: 5 },
    { emoji: "🚿", title: "洗澡", energy: 6 },
  ]},
  { cat: "Movement", emoji: "🏃", items: [
    { emoji: "🧘", title: "三个拉伸动作", energy: 8 },
    { emoji: "🚶", title: "散步 15 分钟", energy: 12 },
  ]},
  { cat: "Nutrition", emoji: "🥗", items: [
    { emoji: "💧", title: "喝一杯水", energy: 5 },
    { emoji: "🍎", title: "吃一份水果", energy: 6 },
  ]},
  { cat: "Productivity", emoji: "🎯", items: [
    { emoji: "📝", title: "列今日 3 件事", energy: 8 },
    { emoji: "📚", title: "专注 25 分钟", energy: 15 },
  ]},
  { cat: "Self Kindness", emoji: "💛", items: [
    { emoji: "🪞", title: "对自己说一句好话", energy: 8 },
    { emoji: "🌿", title: "允许自己休息", energy: 6 },
  ]},
  { cat: "Sleep", emoji: "🌙", items: [
    { emoji: "📵", title: "睡前放下手机", energy: 8 },
    { emoji: "😴", title: "11 点前上床", energy: 10 },
  ]},
];

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
  { id: 1, emoji: "🌅", title: "按时起床", energy: 5, done: false, cat: "健房" },
  { id: 2, emoji: "🪥", title: "认真刷牙", energy: 5, done: false, cat: "健房" },
  { id: 3, emoji: "💧", title: "喝一杯水", energy: 5, done: false, cat: "健房" },
  { id: 4, emoji: "🌬️", title: "三个深呼吸", energy: 8, done: false, cat: "健房" },
  { id: 5, emoji: "🧘", title: "三个拉伸动作", energy: 8, done: false, cat: "健房" },
];

function HomePage() {
  const pet = usePet();
  const [emotionOpen, setEmotionOpen] = useState(false);
  return (
    <>
      <AdoptionFlow />
      <AppShell>
        <TopBar onOpenEmotion={() => setEmotionOpen(true)} />
        {pet.mode === "parent" ? <ParentHome /> : <StudentHome />}
        <EmotionDialog open={emotionOpen} onClose={() => setEmotionOpen(false)} />
      </AppShell>
    </>
  );
}

function TopBar({ onOpenEmotion }: { onOpenEmotion: () => void }) {
  const pet = usePet();
  return (
    <div className="sticky top-0 z-40 flex items-center justify-between gap-3 bg-background/85 px-4 py-2.5 backdrop-blur-md">
      <Link to="/settings" aria-label="设置" className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-sm">
        <Settings className="h-4 w-4 text-foreground/70" />
      </Link>
      <p className="text-sm font-bold">
        {pet.name} <span className="text-muted-foreground">· {pet.personality ?? "小小星球"}</span>
      </p>
      <div className="flex items-center gap-2">
        <Link to="/journal" aria-label="日签" className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-sm">
          <CalendarDays className="h-4 w-4 text-primary" />
        </Link>
        <button onClick={onOpenEmotion} aria-label="情绪标签" className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-sm">
          <Smile className="h-4 w-4 text-berry" />
        </button>
      </div>
    </div>
  );
}

function StudentHome() {
  const pet = usePet();
  const palette = PET_COLORS.find((c) => c.key === pet.color) ?? PET_COLORS[0];
  const petEmoji = pet.avatar || palette.emoji;
  const [tasks, setTasks] = useState(seed);
  const [nextId, setNextId] = useState(seed.length + 1);
  const [exploding, setExploding] = useState<Set<number>>(new Set());
  const [showFireworks, setShowFireworks] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const fireworksTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const visible = tasks.filter((t) => !t.done);
  const totalToday = tasks.length;
  const done = totalToday - visible.length;
  const energy = tasks.filter((t) => t.done).reduce((s, t) => s + t.energy, 0);
  const energyTotal = useEnergyTotal();
  void energy;

  const complete = (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (task && !task.done) {
      addEnergy({ name: task.title, emoji: task.emoji, energy: task.energy, source: "习惯" });
    }
    setShowFireworks(true);
    if (fireworksTimer.current) clearTimeout(fireworksTimer.current);
    fireworksTimer.current = setTimeout(() => setShowFireworks(false), 2200);
    setExploding((s) => new Set(s).add(id));
    setTimeout(() => {
      setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: true } : t)));
      setExploding((s) => { const n = new Set(s); n.delete(id); return n; });
    }, 500);
  };

  const addTask = (emoji: string, title: string, energy: number, cat: string) => {
    if (!title.trim()) return;
    setTasks((ts) => [...ts, { id: nextId, emoji, title: title.trim(), energy, done: false, cat }]);
    setNextId((n) => n + 1);
    setAddOpen(false);
  };

  const removeTask = (id: number) => {
    setTasks((ts) => ts.filter((t) => t.id !== id));
  };

  return (
    <div className="relative">
      <FireworksCanvas active={showFireworks} />

      {/* status pills */}
      <div className="flex items-center justify-center gap-2 px-4 pt-1">
        <span className="pill flex items-center gap-1 bg-card"><Flame className="h-3.5 w-3.5 text-primary" />12 天</span>
        <Link to="/energy" className="pill flex items-center gap-1 bg-card active:scale-95"><Sparkles className="h-3.5 w-3.5 text-primary" />{energyTotal}</Link>
        <button className="pill flex items-center gap-1 bg-card"><Share2 className="h-3.5 w-3.5 text-leaf" />分享</button>
      </div>

      {/* Pet scene */}
      <div
        className="relative mt-2 h-64 w-full overflow-hidden"
        style={{ backgroundImage: `url(${sceneImg})`, backgroundSize: "cover", backgroundPosition: "center bottom" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <CuteChick emoji={petEmoji} image={pet.avatarImage} />
        <div className="absolute bottom-4 right-3 rounded-2xl bg-card/90 px-3 py-1.5 text-xs font-bold shadow-sm">
          {pet.name} · Lv.4{pet.personality ? ` · ${pet.personality}` : ""}
        </div>
      </div>

      {/* Chat 聊天区 */}
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily progress */}
      <section className="mt-4 px-4">
        <div className="flex items-end justify-between">
          <h2 className="text-xl">今日打卡 · {done}/{totalToday}</h2>
          <Link to="/journal" className="text-xs font-bold text-primary">查看日签 →</Link>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full transition-all" style={{ width: `${totalToday ? (done / totalToday) * 100 : 0}%`, background: "var(--gradient-sun)" }} />
        </div>
      </section>

      <section className="mt-4 px-4">
        <div className="mb-2 flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-muted-foreground">🧘 健房 · 基础自我照亮</h3>
          <button
            onClick={() => setAddOpen(true)}
            aria-label="自定义打卡"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm active:scale-90"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {visible.length === 0 ? (
          <div className="card-pop p-4 text-center text-sm text-muted-foreground">
            今天的习惯都完成啦 🎉
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {visible.map((t) => {
              const isBursting = exploding.has(t.id);
              return (
                <SwipeableTask
                  key={t.id}
                  onDelete={() => removeTask(t.id)}
                >
                  <div
                    className={`card-pop flex items-center gap-3 p-3 transition-all duration-500 ${
                      isBursting ? "scale-125 opacity-0 blur-sm" : ""
                    }`}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-xl">{t.emoji}</div>
                    <div className="flex-1">
                      <p className="font-bold">{t.title}</p>
                      <span className="flex items-center gap-0.5 text-xs text-primary">
                        <Sparkles className="h-3 w-3" /> +{t.energy} 能量
                      </span>
                    </div>
                    <button
                      onClick={() => complete(t.id)}
                      disabled={isBursting}
                      aria-label="完成"
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-border bg-card text-transparent active:scale-90 active:border-primary active:bg-primary active:text-primary-foreground"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                </SwipeableTask>
              );
            })}
          </ul>
        )}
      </section>

      {addOpen && <AddHabitSheet onClose={() => setAddOpen(false)} onAdd={addTask} />}


      {/* 自我觉察 — kept on home */}
      <AwarenessSection />

      {/* 遇见 — kept on home */}
      <TimeTravelSection />
    </div>
  );
}

type Reflection = { type: "gain" | "thought"; text: string; at: number };
const REFLECT_KEY = "doudou.reflections";

function loadReflections(): Reflection[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(REFLECT_KEY);
    return raw ? (JSON.parse(raw) as Reflection[]) : [];
  } catch {
    return [];
  }
}
function saveReflections(list: Reflection[]) {
  window.localStorage.setItem(REFLECT_KEY, JSON.stringify(list.slice(-50)));
}
function isToday(ts: number) {
  const d = new Date(ts);
  const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
}

function AwarenessSection() {
  const [list, setList] = useState<Reflection[]>([]);
  const [open, setOpen] = useState<null | "gain" | "thought">(null);

  useEffect(() => {
    setList(loadReflections());
  }, []);

  const todayGain = list.find((r) => r.type === "gain" && isToday(r.at));
  const todayThought = list.find((r) => r.type === "thought" && isToday(r.at));

  const submit = (type: "gain" | "thought", text: string) => {
    if (!text.trim()) return;
    const next = [...list, { type, text: text.trim(), at: Date.now() }];
    setList(next);
    saveReflections(next);
    addEnergy({
      name: type === "gain" ? "今天的一个收获" : "今天的一个感想",
      emoji: type === "gain" ? "🌟" : "📓",
      energy: 12,
      source: "觉察",
    });
    setOpen(null);
  };

  return (
    <section className="mt-5 px-4">
      <h3 className="mb-2 px-1 text-sm font-bold text-muted-foreground">💗 自我觉察 · 今天的我</h3>
      <ul className="flex flex-col gap-2">
        <li className="card-pop flex items-center gap-3 p-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[oklch(0.92_0.06_15)] text-xl">🌟</div>
          <div className="flex-1 overflow-hidden">
            <p className="font-bold">今天的一个收获</p>
            <p className="truncate text-xs text-muted-foreground">
              {todayGain ? todayGain.text : "一句话记录今天看见的自己"}
            </p>
          </div>
          <button
            onClick={() => setOpen("gain")}
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              todayGain ? "bg-secondary text-foreground/70" : "bg-primary text-primary-foreground"
            }`}
          >
            {todayGain ? "已写 · 修改" : "写下"}
          </button>
        </li>
        <li className="card-pop flex items-center gap-3 p-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[oklch(0.92_0.06_145)] text-xl">
            <NotebookPen className="h-5 w-5 text-leaf" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="font-bold">今天的一个感想</p>
            <p className="truncate text-xs text-muted-foreground">
              {todayThought ? todayThought.text : "日记 · 随心写"}
            </p>
          </div>
          <button
            onClick={() => setOpen("thought")}
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              todayThought ? "bg-secondary text-foreground/70" : "bg-primary text-primary-foreground"
            }`}
          >
            {todayThought ? "已写 · 修改" : "写下"}
          </button>
        </li>
      </ul>

      {open && (
        <ReflectSheet
          type={open}
          initial={(open === "gain" ? todayGain?.text : todayThought?.text) ?? ""}
          onClose={() => setOpen(null)}
          onSubmit={(t) => submit(open, t)}
        />
      )}
    </section>
  );
}

function ReflectSheet({
  type,
  initial,
  onClose,
  onSubmit,
}: {
  type: "gain" | "thought";
  initial: string;
  onClose: () => void;
  onSubmit: (text: string) => void;
}) {
  const [text, setText] = useState(initial);
  const isGain = type === "gain";
  const prompts = isGain
    ? ["今天我完成了…", "我第一次注意到自己…", "让我小小骄傲的一件事是…"]
    : ["今天心里有一点…", "让我印象最深的一刻是…", "如果用一个比喻形容今天，那是…"];

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-md rounded-t-3xl bg-background p-5 pb-8 animate-slide-in-right" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold">{isGain ? "🌟 今天的一个收获" : "📓 今天的一个感想"}</h3>
          <button onClick={onClose} aria-label="关闭" className="rounded-full p-1 active:scale-90">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">试试从这里开始：</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {prompts.map((p) => (
            <button
              key={p}
              onClick={() => setText((t) => (t ? t : p))}
              className="rounded-full bg-secondary px-3 py-1 text-xs active:scale-95"
            >
              {p}
            </button>
          ))}
        </div>
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isGain ? "把今天看见自己的那一刻写下来…" : "随心写，写多写少都可以…"}
          className="mt-3 h-32 w-full rounded-2xl border-2 border-border bg-background p-3 text-sm outline-none focus:border-primary"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{text.length} 字</span>
          <span className="flex items-center gap-1 text-primary"><Sparkles className="h-3 w-3" /> +12 能量</span>
        </div>
        <button
          onClick={() => onSubmit(text)}
          disabled={!text.trim()}
          className="mt-3 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground active:scale-95 disabled:opacity-50"
        >
          保存并获得能量
        </button>
      </div>
    </div>
  );
}

function TimeTravelSection() {
  const [game, setGame] = useState<null | { id: GameId; title: string; color: string; intro: string }>(null);

  return (
    <section className="mt-5 px-4 pb-4">
      <h3 className="mb-2 px-1 text-sm font-bold text-muted-foreground">🌌 遇见 · 跨时空对话</h3>
      <ul className="flex flex-col gap-2">
        <li className="card-pop flex items-center gap-3 p-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[oklch(0.92_0.07_60)]">
            <Clock className="h-5 w-5 text-[oklch(0.65_0.16_60)]" />
          </div>
          <div className="flex-1">
            <p className="font-bold">与 6 岁的自己对话</p>
            <p className="text-xs text-muted-foreground">回到那个小小的你 · +25 能量</p>
          </div>
          <button
            onClick={() =>
              setGame({
                id: "talk6",
                title: "与 6 岁的自己对话",
                color: "oklch(0.65 0.16 60)",
                intro:
                  "回到童年的院子，和 6 岁的自己聊一聊。TA 会用小朋友天真的口气回应你，帮你重新看见那些被大人遗忘的心情。至少交流 3 轮即可完成打卡。",
              })
            }
            className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground active:scale-95"
          >
            开始
          </button>
        </li>
        <li className="card-pop flex items-center gap-3 p-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[oklch(0.9_0.08_280)]">
            <Rocket className="h-5 w-5 text-[oklch(0.6_0.18_280)]" />
          </div>
          <div className="flex-1">
            <p className="font-bold">与 30 岁的自己对话</p>
            <p className="text-xs text-muted-foreground">未来的你想说什么 · +25 能量</p>
          </div>
          <button
            onClick={() =>
              setGame({
                id: "talk30",
                title: "与 30 岁的自己对话",
                color: "oklch(0.6 0.18 280)",
                intro:
                  "去未来见见 30 岁的自己。TA 会用温柔而坚定的语气回应你当下的困惑，分享一份走过弯路后的经验与视角。至少交流 3 轮即可完成打卡。",
              })
            }
            className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground active:scale-95"
          >
            开始
          </button>
        </li>
      </ul>

      {game && (
        <GameModal
          gameId={game.id}
          title={game.title}
          intro={game.intro}
          energy={25}
          color={game.color}
          onClose={() => setGame(null)}
          onComplete={() =>
            addEnergy({ name: game.title, energy: 25, source: "跨时空" })
          }
        />
      )}
    </section>
  );
}


function SwipeableTask({ children, onDelete }: { children: ReactNode; onDelete: () => void }) {
  const [dx, setDx] = useState(0);
  const [open, setOpen] = useState(false);
  const startX = useRef<number | null>(null);
  const REVEAL = 80;

  const onStart = (x: number) => { startX.current = x; };
  const onMove = (x: number) => {
    if (startX.current == null) return;
    const delta = x - startX.current;
    const base = open ? -REVEAL : 0;
    const next = Math.min(0, Math.max(-140, base + delta));
    setDx(next);
  };
  const onEnd = () => {
    startX.current = null;
    if (dx < -REVEAL) { setOpen(true); setDx(-REVEAL); }
    else { setOpen(false); setDx(0); }
  };

  return (
    <li className="relative">
      <button
        onClick={onDelete}
        aria-label="删除"
        className="absolute inset-y-0 right-0 flex w-20 items-center justify-center rounded-2xl bg-berry text-berry-foreground active:scale-95"
        style={{ background: "oklch(0.7 0.16 20)" }}
      >
        <Trash2 className="h-5 w-5 text-white" />
      </button>
      <div
        className="relative touch-pan-y transition-transform"
        style={{ transform: `translateX(${dx}px)`, transitionDuration: startX.current == null ? "200ms" : "0ms" }}
        onTouchStart={(e) => onStart(e.touches[0].clientX)}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
        onTouchEnd={onEnd}
        onMouseDown={(e) => onStart(e.clientX)}
        onMouseMove={(e) => { if (startX.current != null) onMove(e.clientX); }}
        onMouseUp={onEnd}
        onMouseLeave={() => { if (startX.current != null) onEnd(); }}
      >
        {children}
      </div>
    </li>
  );
}

function CuteChick({ emoji, image }: { emoji: string; image?: string }) {
  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
      <div className="relative">
        <div
          className="absolute -inset-6 rounded-full blur-2xl"
          style={{ background: "radial-gradient(closest-side, oklch(0.95 0.15 85 / 0.55), transparent)" }}
        />
        {image ? (
          <img
            src={image}
            alt="pet"
            className="relative h-40 w-40 object-contain drop-shadow-[0_8px_18px_rgba(220,140,40,0.35)] animate-[bounce_2.6s_ease-in-out_infinite]"
          />
        ) : (
          <div className="relative text-[7.5rem] drop-shadow-[0_8px_18px_rgba(220,140,40,0.35)] animate-[bounce_2.6s_ease-in-out_infinite]">
            {emoji}
          </div>
        )}
        <div
          className="mx-auto mt-1 h-2 w-24 rounded-full"
          style={{ background: "radial-gradient(closest-side, oklch(0.4 0.05 40 / 0.35), transparent)" }}
        />
      </div>
    </div>
  );
}

function AddHabitSheet({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (emoji: string, title: string, energy: number, cat: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("✨");
  const [cat, setCat] = useState("Easy Wins");

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl bg-background p-5 pb-8 animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">自定义打卡</h3>
          <button onClick={onClose} className="rounded-full p-1 active:scale-90" aria-label="关闭">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-card p-2 ring-1 ring-border">
          <input
            value={emoji}
            onChange={(e) => setEmoji(e.target.value.slice(0, 2) || "✨")}
            className="w-12 rounded-xl bg-secondary py-2 text-center text-xl outline-none"
            aria-label="emoji"
          />
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 20))}
            placeholder="写下你的小习惯…"
            className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            disabled={!title.trim()}
            onClick={() => onAdd(emoji, title, 8, cat)}
            className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground disabled:opacity-40"
          >
            添加
          </button>
        </div>

        <p className="mt-5 px-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          推荐类目
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {HABIT_SUGGESTIONS.map((c) => {
            const on = c.cat === cat;
            return (
              <button
                key={c.cat}
                onClick={() => setCat(c.cat)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                  on ? "bg-primary text-primary-foreground" : "bg-card text-foreground/70 ring-1 ring-border"
                }`}
              >
                {c.emoji} {c.cat}
              </button>
            );
          })}
        </div>

        <div className="mt-4 max-h-[40vh] overflow-y-auto">
          {(HABIT_SUGGESTIONS.find((c) => c.cat === cat) ?? HABIT_SUGGESTIONS[0]).items.map((it) => (
            <button
              key={it.title}
              onClick={() => onAdd(it.emoji, it.title, it.energy, cat)}
              className="mb-2 flex w-full items-center gap-3 rounded-2xl bg-card p-3 text-left ring-1 ring-border active:scale-[0.98]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-xl">
                {it.emoji}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">{it.title}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-primary">
                  <Sparkles className="h-3 w-3" /> +{it.energy} 能量
                </p>
              </div>
              <Plus className="h-4 w-4 text-primary" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


function ParentHome() {
  return (
    <div className="px-4 pt-2">
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
      </section>

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

        <div className="card-pop bg-gradient-to-br from-[oklch(0.93_0.08_145)] to-[oklch(0.96_0.04_80)] p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-leaf">一件好事</p>
          <p className="mt-1 text-sm text-foreground/70">记录今天孩子的一个小小进步</p>
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
