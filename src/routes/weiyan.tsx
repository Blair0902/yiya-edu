import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Send, Sparkle, Volume2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/weiyan")({
  head: () => ({ meta: [{ title: "微言 · 自我探索" }, { name: "description", content: "假定性的对话，温柔地认识自己。AI 分析后会推送给家长端。" }] }),
  component: Weiyan,
});

type Msg = { who: "ai" | "me"; text: string };

const initial: Msg[] = [
  { who: "ai", text: "嗨，今天有什么小事让你心里轻轻动了一下吗？" },
  { who: "me", text: "上数学课的时候被老师叫起来，没回答出来。" },
  { who: "ai", text: "那一刻，你最希望旁边的人怎么对待你呢？" },
];

function Weiyan() {
  const [msgs, setMsgs] = useState(initial);
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    setMsgs((m) => [
      ...m,
      { who: "me", text },
      { who: "ai", text: "谢谢你愿意说出来。这不是脆弱，是看见自己的勇气 🌱" },
    ]);
    setText("");
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-gradient-to-b from-[oklch(0.92_0.06_200)] to-[oklch(0.96_0.04_80)]">
      <header className="flex items-center gap-3 bg-card/70 px-4 py-3 backdrop-blur-md">
        <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-sm" aria-label="返回">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="flex items-center gap-1 text-lg font-bold"><Sparkle className="h-4 w-4 text-primary" /> 微言</h1>
          <p className="text-xs text-muted-foreground">温柔的自我探索 · AI 仅做温和回应</p>
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.who === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                m.who === "me" ? "bg-primary text-primary-foreground" : "bg-card"
              }`}
            >
              {m.text}
              {m.who === "ai" && (
                <button className="ml-2 inline-flex items-center text-muted-foreground" aria-label="朗读">
                  <Volume2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border bg-card p-3">
        <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="说说今天的小事…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button onClick={send} className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">对话片段会被 AI 提取分析，温和推送给家长 💝</p>
      </div>
    </div>
  );
}
