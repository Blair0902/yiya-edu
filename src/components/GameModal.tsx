import { useEffect, useMemo, useRef, useState } from "react";
import { X, Sparkles, Mic, Send, Timer, Trophy, Pencil, Eraser, Maximize2, Minimize2 } from "lucide-react";

export type GameId =
  | "math754"
  | "poetry"
  | "english"
  | "why"
  | "hats"
  | "schulte"
  | "talk6"
  | "talk30";


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
  const [fullscreen, setFullscreen] = useState(false);

  const finish = () => {
    setDone(true);
    setTimeout(() => {
      onComplete();
      onClose();
    }, 1200);
  };

  const panelClass = fullscreen
    ? "w-full h-full max-w-none bg-background p-5 pb-8 overflow-y-auto animate-fade-in"
    : "w-full max-w-md rounded-t-3xl bg-background p-5 pb-8 max-h-[90vh] overflow-y-auto animate-slide-in-right";
  const wrapClass = fullscreen
    ? "fixed inset-0 z-[60] flex items-stretch justify-center bg-background animate-fade-in"
    : "fixed inset-0 z-[60] flex items-end justify-center bg-black/50 animate-fade-in";

  return (
    <div
      className={wrapClass}
      onClick={fullscreen ? undefined : onClose}
    >
      <div
        className={panelClass}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold" style={{ color }}>{title}</h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFullscreen((v) => !v)}
              aria-label={fullscreen ? "退出全屏" : "全屏"}
              className="rounded-full p-1 active:scale-90"
            >
              {fullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </button>
            <button onClick={onClose} aria-label="关闭" className="rounded-full p-1 active:scale-90">
              <X className="h-5 w-5" />
            </button>
          </div>
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
  if (gameId === "talk6") return <BottleDrop color={color} age="6" onFinish={onFinish} />;
  if (gameId === "talk30") return <BottleDrop color={color} age="30" onFinish={onFinish} />;
  return <Schulte color={color} onFinish={onFinish} />;

}

/* -------- 754 数学 · 4 位数竖式练习 + 全屏草稿本 -------- */
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
  const [scratchOpen, setScratchOpen] = useState(false);

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
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setScratchOpen(true)}
          className="flex flex-1 items-center justify-center gap-1 rounded-full bg-secondary py-2.5 text-sm font-bold active:scale-95"
        >
          <Pencil className="h-4 w-4" /> 打开草稿本
        </button>
      </div>
      <button
        onClick={submit}
        disabled={!val}
        className="mt-3 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground active:scale-95 disabled:opacity-50"
      >
        提交
      </button>
      {scratchOpen && <Scratchpad title={`${p.a} × ${p.b}`} onClose={() => setScratchOpen(false)} />}
    </div>
  );
}

/* -------- 全屏草稿本 -------- */
function Scratchpad({ title, onClose }: { title: string; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");

  useEffect(() => {
    const c = canvasRef.current!;
    const dpr = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();
    c.width = rect.width * dpr;
    c.height = rect.height * dpr;
    const ctx = c.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#fffdf7";
    ctx.fillRect(0, 0, rect.width, rect.height);
    // grid
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    const step = 32;
    for (let x = 0; x < rect.width; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, rect.height); ctx.stroke();
    }
    for (let y = 0; y < rect.height; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(rect.width, y); ctx.stroke();
    }
  }, []);

  const pos = (e: React.PointerEvent) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  const down = (e: React.PointerEvent) => {
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = pos(e);
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current || !last.current) return;
    const p = pos(e);
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.strokeStyle = tool === "pen" ? "#111827" : "#fffdf7";
    ctx.lineWidth = tool === "pen" ? 2.5 : 18;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };
  const up = () => { drawing.current = false; last.current = null; };
  const clear = () => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    const rect = c.getBoundingClientRect();
    ctx.fillStyle = "#fffdf7";
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = "#e5e7eb";
    const step = 32;
    for (let x = 0; x < rect.width; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, rect.height); ctx.stroke();
    }
    for (let y = 0; y < rect.height; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(rect.width, y); ctx.stroke();
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-[#fffdf7] animate-fade-in">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div>
          <p className="text-xs text-muted-foreground">草稿本</p>
          <p className="font-mono text-lg font-bold">{title}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTool("pen")}
            className={`flex h-9 w-9 items-center justify-center rounded-full ${tool === "pen" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => setTool("eraser")}
            className={`flex h-9 w-9 items-center justify-center rounded-full ${tool === "eraser" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
          >
            <Eraser className="h-4 w-4" />
          </button>
          <button onClick={clear} className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold">清空</button>
          <button onClick={onClose} className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
            <Minimize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        className="flex-1 touch-none"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

/* -------- 古诗文 · 高考名篇多形式 -------- */
type PoetryQ =
  | { kind: "fill"; poem: string; author: string; line: string; ans: string; hint?: string }
  | { kind: "choice"; poem: string; author: string; line: string; options: string[]; ans: string }
  | { kind: "author"; poem: string; line: string; options: string[]; ans: string }
  | { kind: "meaning"; poem: string; author: string; line: string; options: string[]; ans: string };

const POETRY_BANK: PoetryQ[] = [
  { kind: "fill", poem: "《劝学》", author: "荀子", line: "青，取之于蓝，____。", ans: "而青于蓝" },
  { kind: "fill", poem: "《师说》", author: "韩愈", line: "师者，____。", ans: "所以传道受业解惑也" },
  { kind: "fill", poem: "《赤壁赋》", author: "苏轼", line: "寄蜉蝣于天地，____。", ans: "渺沧海之一粟" },
  { kind: "fill", poem: "《岳阳楼记》", author: "范仲淹", line: "先天下之忧而忧，____。", ans: "后天下之乐而乐" },
  { kind: "fill", poem: "《出师表》", author: "诸葛亮", line: "受任于败军之际，____。", ans: "奉命于危难之间" },
  { kind: "fill", poem: "《离骚》", author: "屈原", line: "路漫漫其修远兮，____。", ans: "吾将上下而求索" },
  {
    kind: "choice", poem: "《念奴娇·赤壁怀古》", author: "苏轼",
    line: "大江东去，浪淘尽，____。",
    options: ["千古风流人物", "多少英雄豪杰", "无数兴亡旧事"], ans: "千古风流人物",
  },
  {
    kind: "choice", poem: "《登高》", author: "杜甫",
    line: "无边落木萧萧下，____。",
    options: ["不尽长江滚滚来", "万里悲秋常作客", "百年多病独登台"], ans: "不尽长江滚滚来",
  },
  {
    kind: "author", poem: "《琵琶行》",
    line: "同是天涯沦落人，相逢何必曾相识。",
    options: ["李白", "白居易", "王维", "杜牧"], ans: "白居易",
  },
  {
    kind: "author", poem: "《声声慢》",
    line: "寻寻觅觅，冷冷清清，凄凄惨惨戚戚。",
    options: ["李清照", "辛弃疾", "苏轼", "柳永"], ans: "李清照",
  },
  {
    kind: "meaning", poem: "《游山西村》", author: "陆游",
    line: "山重水复疑无路，柳暗花明又一村。",
    options: [
      "困境中往往孕育着新的转机",
      "山路曲折难行，需要向导",
      "描写春天柳绿花红的景色",
    ],
    ans: "困境中往往孕育着新的转机",
  },
  {
    kind: "meaning", poem: "《过零丁洋》", author: "文天祥",
    line: "人生自古谁无死，留取丹心照汗青。",
    options: [
      "以死明志，忠贞不渝的家国情怀",
      "感叹人生无常，及时行乐",
      "劝人淡看生死，不必执着",
    ],
    ans: "以死明志，忠贞不渝的家国情怀",
  },
];

function shuffled<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Poetry({ color, onFinish }: { color: string; onFinish: () => void }) {
  const qs = useMemo(() => shuffled(POETRY_BANK).slice(0, 5), []);
  const [i, setI] = useState(0);
  const [val, setVal] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const [reveal, setReveal] = useState(false);
  const [score, setScore] = useState(0);
  const q = qs[i];

  const kindLabel =
    q.kind === "fill" ? "填空" : q.kind === "choice" ? "选下一句" : q.kind === "author" ? "认作者" : "品诗意";

  const answer = () => {
    let ok = false;
    if (q.kind === "fill") ok = val.trim() === q.ans;
    else ok = picked === q.ans;
    if (ok) setScore((s) => s + 1);
    setReveal(true);
  };

  const next = () => {
    setReveal(false);
    setVal("");
    setPicked(null);
    if (i + 1 >= qs.length) onFinish();
    else setI(i + 1);
  };

  const options = q.kind === "fill" ? [] : (q as { options: string[] }).options;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">第 {i + 1}/{qs.length} 题 · {kindLabel}</span>
        <span className="font-bold text-primary">答对 {score}</span>
      </div>
      <div className="rounded-2xl bg-card p-5">
        <p className="text-xs text-muted-foreground">
          {q.poem}{q.kind !== "author" ? ` · ${(q as { author?: string }).author ?? ""}` : ""}
        </p>
        <p className="mt-2 text-lg font-bold leading-relaxed" style={{ color }}>{q.line}</p>

        {q.kind === "fill" ? (
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="填写空缺内容"
            disabled={reveal}
            className="mt-3 w-full rounded-xl border-2 border-border bg-background px-4 py-3 outline-none focus:border-primary disabled:opacity-70"
          />
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {options.map((opt) => {
              const isPicked = picked === opt;
              const isAns = opt === q.ans;
              const state = !reveal
                ? isPicked ? "border-primary bg-primary/10" : "border-border bg-background"
                : isAns ? "border-primary bg-primary/15" : isPicked ? "border-destructive bg-destructive/10" : "border-border bg-background opacity-70";
              return (
                <button
                  key={opt}
                  disabled={reveal}
                  onClick={() => setPicked(opt)}
                  className={`rounded-xl border-2 px-4 py-2.5 text-left text-sm active:scale-[0.98] ${state}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {reveal && (
          <p className="mt-3 rounded-xl bg-secondary p-3 text-sm">
            {((q.kind === "fill" ? val.trim() === q.ans : picked === q.ans))
              ? <span className="font-bold text-primary">✅ 完美！</span>
              : <>
                  <span className="font-bold text-destructive">再想想～</span>{" "}
                  <span>正确答案：<span className="font-bold text-foreground">{q.ans}</span></span>
                </>
            }
          </p>
        )}
      </div>
      {!reveal ? (
        <button
          onClick={answer}
          disabled={q.kind === "fill" ? !val.trim() : !picked}
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

/* -------- 与 6 岁 / 30 岁的自己对话 (AI) -------- */
type ChatMsg = { role: "user" | "assistant"; content: string };

const OPENERS: Record<"6" | "30", string> = {
  "6": "嗨呀～是长大的我吗？我在小时候的院子里等你好久啦！你今天开心吗？",
  "30": "嘿，是你呀。坐下来喝口水，慢慢说——今天心里在想什么？",
};
const HINTS: Record<"6" | "30", string[]> = {
  "6": ["还记得我最喜欢的玩具吗？", "你现在还怕黑吗？", "你有没有交到新朋友？"],
  "30": ["我最近有件事拿不定主意…", "我担心自己不够好。", "如果你能重来一次，会怎么做？"],
};

function TimeChat({
  color,
  age,
  onFinish,
}: {
  color: string;
  age: "6" | "30";
  onFinish: () => void;
}) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { role: "assistant", content: OPENERS[age] },
  ]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const label = age === "6" ? "6 岁的我" : "30 岁的我";
  const turns = msgs.filter((m) => m.role === "user").length;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  const send = async (raw?: string) => {
    const content = (raw ?? text).trim();
    if (!content || loading) return;
    const next: ChatMsg[] = [...msgs, { role: "user", content }];
    setMsgs(next);
    setText("");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/time-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age, messages: next }),
      });
      if (res.status === 429) throw new Error("对话太热烈啦～稍等一下再说");
      if (res.status === 402) throw new Error("今天的对话额度用完了，明天再来吧");
      if (!res.ok) throw new Error("网络有点小情绪，重试一下～");
      const data = (await res.json()) as { reply: string };
      setMsgs((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "出错了");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>正在对话：<span className="font-bold" style={{ color }}>{label}</span></span>
        <span>已交流 {turns} 轮</span>
      </div>
      <div
        ref={scrollRef}
        className="flex max-h-72 min-h-[16rem] flex-col gap-2 overflow-y-auto rounded-2xl bg-card p-3"
      >
        {msgs.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
              m.role === "user"
                ? "self-end bg-primary text-primary-foreground"
                : "self-start bg-background"
            }`}
            style={m.role === "assistant" ? { borderLeft: `3px solid ${color}` } : undefined}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div
            className="self-start rounded-2xl bg-background px-3 py-2 text-sm text-muted-foreground"
            style={{ borderLeft: `3px solid ${color}` }}
          >
            <span className="inline-flex gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
            </span>
          </div>
        )}
        {error && <p className="self-center rounded-lg bg-destructive/10 px-3 py-1 text-xs text-destructive">{error}</p>}
      </div>

      {msgs.length <= 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {HINTS[age].map((h) => (
            <button
              key={h}
              onClick={() => send(h)}
              className="rounded-full bg-secondary px-3 py-1.5 text-xs active:scale-95"
            >
              {h}
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={age === "6" ? "对小时候的自己说点什么…" : "对未来的自己说点什么…"}
          disabled={loading}
          className="flex-1 rounded-xl border-2 border-border bg-background px-4 py-2 outline-none focus:border-primary disabled:opacity-60"
        />
        <button
          onClick={() => send()}
          disabled={loading || !text.trim()}
          className="rounded-xl bg-primary px-3 text-primary-foreground active:scale-95 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      {turns >= 3 && (
        <button
          onClick={onFinish}
          className="mt-3 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground active:scale-95"
        >
          结束对话 · 完成打卡
        </button>
      )}
      {turns > 0 && turns < 3 && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          再聊 {3 - turns} 轮就能完成今日打卡 ✨
        </p>
      )}
    </div>
  );
}

