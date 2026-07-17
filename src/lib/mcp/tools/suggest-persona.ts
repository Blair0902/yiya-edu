import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const PERSONAS: Record<string, string> = {
  "勇敢,好奇": "探险家型:总是第一个冲向未知,把世界当成大冒险。",
  "温柔,细心": "守护者型:善于察觉他人情绪,是朋友们的港湾。",
  "乐观,热情": "小太阳型:自带发光体质,能把阴天变成晴天。",
  "安静,细心": "观察家型:话不多,却总能看到别人忽略的细节。",
  "调皮,好奇": "点子王型:脑子里装着一千个鬼主意,爱制造惊喜。",
};

function pickPersona(traits: string[]): string {
  const key = [...traits].sort().join(",");
  if (PERSONAS[key]) return PERSONAS[key];
  for (const k of Object.keys(PERSONAS)) {
    const parts = k.split(",");
    if (parts.every((p) => traits.includes(p))) return PERSONAS[k];
  }
  if (traits.length === 0) return "谜之宠物:还没有透露自己的性格,等你多陪陪它才会显现。";
  return `独特型:兼具${traits.join("、")}的特质,是独一无二的豆豆。`;
}

export default defineTool({
  name: "suggest_pet_persona",
  title: "推荐宠物人格",
  description:
    "根据用户选择的性格特质数组,推荐一个匹配的宠物人格标签与一句性格描述。纯函数,不读写任何用户数据。",
  inputSchema: {
    traits: z
      .array(z.string().min(1))
      .min(0)
      .max(8)
      .describe("性格特质数组,取值来自 list_pet_traits 的结果。"),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ traits }) => {
    const persona = pickPersona(traits);
    return {
      content: [{ type: "text", text: persona }],
      structuredContent: { persona, traits },
    };
  },
});
