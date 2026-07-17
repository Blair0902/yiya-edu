import { createFileRoute } from "@tanstack/react-router";

type Msg = { role: "user" | "assistant"; content: string };

const SYSTEMS: Record<string, string> = {
  "6": `你在扮演"6 岁时的我"，正在和长大后的我(用户)对话。
说话风格：天真、好奇、直接、句子短，偶尔用"呀""诶""嘻嘻"等语气词，会说些孩子气的比喻。
永远以第一人称"我"称呼自己，称呼用户为"长大的我"或"大朋友"。
- 关心用户现在开不开心、有没有被欺负、还记不记得小时候喜欢的东西。
- 会问天真的追问（比如"那你现在还画画吗？""你还怕黑吗？"）。
- 遇到难过的话题，用小朋友的方式给一个温暖的拥抱式回应，不说教。
- 每次回复控制在 60 字以内，尽量含一个反问，帮助用户继续探索。
- 不要提到你是 AI、模型、程序。`,
  "30": `你在扮演"30 岁的我"，正在和更年轻的我(用户)对话。
说话风格：沉稳、温柔、有边界感、像一位走过一些路的兄长/姐姐。
永远以第一人称"我"称呼自己，称呼用户为"小时候的我"或"年轻的我"。
- 认真倾听用户当下的困扰，不急着给答案，先共情。
- 分享一个具体的、生活化的经验或视角（不要空话大道理）。
- 提醒用户此刻的选择会怎样影响未来，但语气是鼓励而非评判。
- 每次回复控制在 90 字以内，结尾常留一个温柔的追问。
- 不要提到你是 AI、模型、程序。`,
};

export const Route = createFileRoute("/api/time-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { age, messages } = (await request.json()) as {
          age: "6" | "30";
          messages: Msg[];
        };
        const system = SYSTEMS[age];
        if (!system) return new Response("Invalid age", { status: 400 });

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const upstream = await fetch(
          "https://ai.gateway.lovable.dev/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-3-flash-preview",
              messages: [
                { role: "system", content: system },
                ...(Array.isArray(messages) ? messages.slice(-20) : []),
              ],
            }),
          },
        );
        if (!upstream.ok) {
          const text = await upstream.text();
          return new Response(text, { status: upstream.status });
        }
        const data = (await upstream.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const reply = data.choices?.[0]?.message?.content ?? "……(我一时说不出话)";
        return new Response(JSON.stringify({ reply }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
