import { useEffect, useMemo, useRef, useState } from "react";
import { X, Sparkles, Mic, Send, Timer, Trophy } from "lucide-react";

export type GameId =
  | "math754"
  | "poetry"
  | "english"
  | "why"
  | "hats"
  | "schulte";

type Props = {
  gameId: GameId;
  title: string;
  intro: string;
  energy: number;
  color: string;
  onClose: () => void;
  onComplete: () => void;
};

export function GameModal({ gameId, title, intro, energy, color, onClose, onComplete }: Props) {
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  const finish = () => {
    setDone(true);
    setTimeout(() => {
      onComplete();
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl bg-background p-5 pb-8 max-h-[90vh] overflow-y-auto animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold" style={{ color }}>{title}</h3>
          <button onClick={onClose} className="rounded-full p-1 active:scale-90">
            <X className="h-5 w-5" />
          </button>
        </div>

        {done ? (
          <div className="py-10 text-center">
            <Trophy className="mx-auto h-12 w-12 text-primary animate-bounce" />
            <p className="mt-3 text-xl font-bold">太棒了！</p>
            <p className="mt-1 flex items-center justify-center gap-1 text-sm text-primary">
              <Sparkles className="h-4 w-4" /> +{energy} 能量已获得
            </p>
          </div>
        ) : !started ? (
          <div>
            <p className="rounded-2xl bg-card p-4 text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
              {intro}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-primary">
              <Sparkles className="h-3 w-3" /> 完成可获得 +{energy} 能量
            </div>
            <button
              onClick={() => setStarted(true)}
              className="mt-4 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground active:scale-95"
            >
              开始挑战
            </button>
          </div>
        ) : (
          <GameBody gameId={gameId} color={color} onFinish={finish} />
        )}
      </div>
    </div>
  );
}

function GameBody({ gameId, color, onFinish }: { gameId: GameId; color: string; onFinish: () => void }) {
  if (gameId === "math754") return <Math754 color={color} onFinish={onFinish} />;
  if (gameId === "poetry") return <Poetry color={color} onFinish={onFinish} />;
  if (gameId === "english") return <English color={color} onFinish={onFinish} />;
  if (gameId === "why") return <WhyGame color={color} onFinish={onFinish} />;
  if (gameId === "hats") return <SixHats color={color} onFinish={onFinish} />;
  return <Schulte color={color} onFinish={onFinish} />;
}

/* -------- 754 数学 -------- */
function Math754({ color, onFinish }: { color: string; onFinish: () => void }) {
  const problems = useMemo(
    () =>
      Array.from({ length: 5 }, () => {
        const a = 1000 + Math.floor(Math.random() * 9000);
        const b = 1000 + Math.floor(Math.random() * 9000);
        return { a, b, ans: a * b };
      }),
    []
  );
  const [i, setI] = useState(0);
  const [val, setVal] = useState("");
  const [correct, setCorrect] = useState(0);
  const [seconds, setSeconds] = useState(7 * 60);
  const [feedback, setFeedback] = useState<null | boolean>(null);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const p = problems[i];
  const submit = () => {
    const ok = Number(val) === p.ans;
    setFeedback(ok);
    if (ok) setCorrect((c) => c + 1);
    setTimeout(() => {
      setFeedback(null);
      setVal("");
      if (i + 1 >= problems.length) onFinish();
      else setI(i + 1);
    }, 700);
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="flex items-center gap-1 font-bold text-primary">
          <Timer className="h-4 w-4" /> {mm}:{ss}
        </span>
        <span className="text-muted-foreground">第 {i + 1}/5 题 · 答对 {correct}</span>
      </div>
      <div className="rounded-2xl bg-card p-6 text-center">
        <div className="font-mono text-3xl font-bold tracking-wider" style={{ color }}>
          {p.a} × {p.b}
        </div>
        <input
          type="number"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="输入结果"
          className="mt-4 w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-center font-mono text-lg outline-none focus:border-primary"
        />
        {feedback !== null && (
          <p className={`mt-2 text-sm font-bold ${feedback ? "text-primary" : "text-destructive"}`}>
            {feedback ? "✅ 正确！" : `❌ 正确答案：${p.ans}`}
          </p>
        )}
      </div>
      <button
        onClick={submit}
        disabled={!val}
        className="mt-4 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground active:scale-95 disabled:opacity-50"
      >
        提交
      </button>
    </div>
  );
}

/* -------- 古诗文 -------- */
function Poetry({ color, onFinish }: { color: string; onFinish: () => void }) {
  const qs = [
    { poem: "《静夜思》李白", line: "床前明月光，____。", ans: "疑是地上霜" },
    { poem: "《登鹳雀楼》王之涣", line: "欲穷千里目，____。", ans: "更上一层楼" },
    { poem: "《爱莲说》周敦颐", line: "出淤泥而不染，____。", ans: "濯清涟而不妖" },
  ];
  const [i, setI] = useState(0);
  const [val, setVal] = useState("");
  const [reveal, setReveal] = useState(false);
  const q = qs[i];

  const next = () => {
    setReveal(false);
    setVal("");
    if (i + 1 >= qs.length) onFinish();
    else setI(i + 1);
  };

  return (
    <div>
      <div className="mb-2 text-sm text-muted-foreground">第 {i + 1}/{qs.length} 题</div>
      <div className="rounded-2xl bg-card p-5">
        <p className="text-xs text-muted-foreground">{q.poem}</p>
        <p className="mt-2 text-lg font-bold leading-relaxed" style={{ color }}>{q.line}</p>
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="填写下一句"
          className="mt-3 w-full rounded-xl border-2 border-border bg-background px-4 py-3 outline-none focus:border-primary"
        />
        {reveal && (
          <p className="mt-2 text-sm">
            {val.trim() === q.ans
              ? <span className="font-bold text-primary">✅ 完美！</span>
              : <span className="text-muted-foreground">正确答案：<span className="font-bold text-foreground">{q.ans}</span></span>}
          </p>
        )}
      </div>
      {!reveal ? (
        <button
          onClick={() => setReveal(true)}
          disabled={!val}
          className="mt-4 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground active:scale-95 disabled:opacity-50"
        >
          对答案
        </button>
      ) : (
        <button
          onClick={next}
          className="mt-4 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground active:scale-95"
        >
          {i + 1 >= qs.length ? "完成打卡" : "下一题"}
        </button>
      )}
    </div>
  );
}

/* -------- 英语单词成文 -------- */
function English({ color, onFinish }: { color: string; onFinish: () => void }) {
  const [words, setWords] = useState(["", "", "", "", ""]);
  const [essay, setEssay] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);

  useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => setRecordSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  const generate = () => {
    const [w1, w2, w3, w4, w5] = words;
    setEssay(
      `On a sunny Saturday, I decided to ${w1 || "explore"} a hidden garden. The air was full of ${
        w3 || "wonder"
      }, and every step felt like a ${w2 || "journey"}. A tiny bird tried to ${
        w4 || "sing"
      } beside me, its voice as bright as ${w5 || "sunshine"}. I smiled and wrote down what I saw.`
    );
  };

  if (!essay) {
    return (
      <div>
        <p className="text-sm text-muted-foreground">输入本周新学的 5 个英文单词：</p>
        <div className="mt-3 flex flex-col gap-2">
          {words.map((w, idx) => (
            <input
              key={idx}
              value={w}
              onChange={(e) => setWords(words.map((v, i) => (i === idx ? e.target.value : v)))}
              placeholder={`word ${idx + 1}`}
              className="rounded-xl border-2 border-border bg-background px-4 py-2 outline-none focus:border-primary"
            />
          ))}
        </div>
        <button
          onClick={generate}
          disabled={words.filter((w) => w.trim()).length < 5}
          className="mt-4 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground active:scale-95 disabled:opacity-50"
        >
          <Sparkles className="mr-1 inline h-4 w-4" /> AI 生成短文
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-2xl bg-card p-4 text-sm leading-relaxed" style={{ borderLeft: `4px solid ${color}` }}>
        {essay}
      </div>
      <button
        onClick={() => setRecording((r) => !r)}
        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold active:scale-95 ${
          recording ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
        }`}
      >
        <Mic className="h-4 w-4" /> {recording ? `录音中… ${recordSecs}s（点击停止）` : "开始朗读录音"}
      </button>
      {recordSecs > 0 && !recording && (
        <button
          onClick={onFinish}
          className="mt-3 w-full rounded-full bg-secondary py-3 text-sm font-bold active:scale-95"
        >
          完成打卡
        </button>
      )}
    </div>
  );
}

/* -------- 今天的一个为什么 -------- */
function WhyGame({ color, onFinish }: { color: string; onFinish: () => void }) {
  const [q, setQ] = useState("");
  const [chat, setChat] = useState<{ role: "you" | "ai"; text: string }[]>([]);
  const ask = () => {
    if (!q.trim()) return;
    const you = q;
    setChat((c) => [...c, { role: "you", text: you }]);
    setQ("");
    setTimeout(() => {
      setChat((c) => [
        ...c,
        {
          role: "ai",
          text: `好问题！我们可以从三个角度看：\n1. 事实：先梳理已知的现象和数据。\n2. 原因：可能有哪些相互作用？\n3. 验证：怎么用一个小实验来检验？\n你觉得从哪一步开始最有意思？`,
        },
      ]);
    }, 600);
  };

  return (
    <div>
      <div className="flex max-h-64 flex-col gap-2 overflow-y-auto rounded-2xl bg-card p-3">
        {chat.length === 0 && (
          <p className="text-sm text-muted-foreground">今天有什么让你好奇的事？提一个「为什么」～</p>
        )}
        {chat.map((m, i) => (
          <div
            key={i}
            className={`rounded-2xl px-3 py-2 text-sm ${
              m.role === "you" ? "self-end bg-primary text-primary-foreground" : "self-start bg-background whitespace-pre-wrap"
            }`}
            style={m.role === "ai" ? { borderLeft: `3px solid ${color}` } : undefined}
          >
            {m.text}
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="为什么…？"
          className="flex-1 rounded-xl border-2 border-border bg-background px-4 py-2 outline-none focus:border-primary"
        />
        <button onClick={ask} className="rounded-xl bg-primary px-3 text-primary-foreground active:scale-95">
          <Send className="h-4 w-4" />
        </button>
      </div>
      {chat.length >= 2 && (
        <button
          onClick={onFinish}
          className="mt-3 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground active:scale-95"
        >
          完成本次思考
        </button>
      )}
    </div>
  );
}

/* -------- 六顶思考帽 -------- */
function SixHats({ onFinish }: { color: string; onFinish: () => void }) {
  const hats = [
    { name: "白帽", color: "#e5e7eb", prompt: "客观事实和数据是什么？" },
    { name: "红帽", color: "#ef4444", prompt: "你的第一直觉和情绪是？" },
    { name: "黑帽", color: "#1f2937", prompt: "潜在的风险和弊端有哪些？" },
    { name: "黄帽", color: "#f59e0b", prompt: "有哪些积极价值与机遇？" },
    { name: "绿帽", color: "#10b981", prompt: "有哪些创新的解决思路？" },
    { name: "蓝帽", color: "#3b82f6", prompt: "总结全部观点，下一步怎么做？" },
  ];
  const topics = ["AI 是否应该进入课堂？", "青少年该不该使用短视频？", "无人驾驶让谁更受益？"];
  const [topic, setTopic] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const [notes, setNotes] = useState<string[]>(Array(6).fill(""));

  if (!topic) {
    return (
      <div>
        <p className="text-sm text-muted-foreground">选一个议题开始平行思考：</p>
        <div className="mt-3 flex flex-col gap-2">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className="rounded-2xl bg-card p-3 text-left text-sm font-bold active:scale-95"
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const h = hats[idx];
  return (
    <div>
      <p className="rounded-xl bg-card p-3 text-sm font-bold">议题：{topic}</p>
      <div className="mt-3 flex gap-1">
        {hats.map((hh, i) => (
          <div
            key={hh.name}
            className={`h-2 flex-1 rounded-full ${i <= idx ? "opacity-100" : "opacity-30"}`}
            style={{ background: hh.color }}
          />
        ))}
      </div>
      <div className="mt-3 rounded-2xl p-4" style={{ background: `${h.color}22`, border: `2px solid ${h.color}` }}>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full" style={{ background: h.color }} />
          <p className="font-bold" style={{ color: h.color === "#e5e7eb" ? "#374151" : h.color }}>
            {h.name} · {idx + 1}/6
          </p>
        </div>
        <p className="mt-2 text-sm text-foreground/80">{h.prompt}</p>
        <textarea
          value={notes[idx]}
          onChange={(e) => setNotes(notes.map((n, i) => (i === idx ? e.target.value : n)))}
          placeholder="写下你的思考…"
          className="mt-2 h-20 w-full rounded-xl border-2 border-border bg-background p-3 text-sm outline-none focus:border-primary"
        />
      </div>
      <button
        onClick={() => (idx + 1 >= hats.length ? onFinish() : setIdx(idx + 1))}
        disabled={!notes[idx].trim()}
        className="mt-4 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground active:scale-95 disabled:opacity-50"
      >
        {idx + 1 >= hats.length ? "完成六帽思考" : "下一顶帽子"}
      </button>
    </div>
  );
}

/* -------- 舒尔特方格 -------- */
function Schulte({ color, onFinish }: { color: string; onFinish: () => void }) {
  const nums = useMemo(() => {
    const arr = Array.from({ length: 25 }, (_, i) => i + 1);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);
  const [next, setNext] = useState(1);
  const [start] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const done = next > 25;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (done) return;
    timerRef.current = setInterval(() => setElapsed(((Date.now() - start) / 1000)), 100);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [done, start]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="flex items-center gap-1 font-bold text-primary">
          <Timer className="h-4 w-4" /> {elapsed.toFixed(1)}s
        </span>
        <span className="text-muted-foreground">下一个：{done ? "✅" : next}</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {nums.map((n) => {
          const passed = n < next;
          return (
            <button
              key={n}
              disabled={passed || done}
              onClick={() => n === next && setNext((v) => v + 1)}
              className={`aspect-square rounded-lg text-lg font-bold transition-all active:scale-90 ${
                passed ? "bg-muted text-muted-foreground opacity-40" : "bg-card"
              }`}
              style={!passed ? { color } : undefined}
            >
              {n}
            </button>
          );
        })}
      </div>
      {done && (
        <button
          onClick={onFinish}
          className="mt-4 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground active:scale-95"
        >
          用时 {elapsed.toFixed(1)}s · 完成打卡
        </button>
      )}
    </div>
  );
}
