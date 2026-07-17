import { defineTool } from "@lovable.dev/mcp-js";

const COLORS = [
  { key: "sun", label: "暖阳黄", hint: "温暖、乐观" },
  { key: "leaf", label: "嫩芽绿", hint: "自然、平和" },
  { key: "berry", label: "莓果粉", hint: "甜美、活泼" },
  { key: "sky", label: "天空蓝", hint: "自由、理性" },
  { key: "lavender", label: "薰衣紫", hint: "神秘、想象力" },
];

export default defineTool({
  name: "list_pet_colors",
  title: "列出宠物蛋颜色",
  description: "返回豆豆星球中所有可选的宠物蛋颜色及其气质提示。",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(COLORS, null, 2) }],
    structuredContent: { colors: COLORS },
  }),
});
