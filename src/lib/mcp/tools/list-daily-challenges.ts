import { defineTool } from "@lovable.dev/mcp-js";

const CHALLENGES = [
  { id: "walk", title: "户外散步 15 分钟", energy: 20, category: "身体" },
  { id: "water", title: "喝够 6 杯水", energy: 10, category: "身体" },
  { id: "read", title: "阅读 20 分钟", energy: 15, category: "学习" },
  { id: "gratitude", title: "写下 3 件感恩的小事", energy: 15, category: "情绪" },
  { id: "sleep", title: "23 点前上床", energy: 25, category: "作息" },
  { id: "compliment", title: "真诚夸赞一位家人或朋友", energy: 15, category: "关系" },
];

export default defineTool({
  name: "list_daily_challenges",
  title: "列出每日挑战",
  description: "返回豆豆星球内置的每日挑战列表,可用于外部客户端展示或规划。",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(CHALLENGES, null, 2) }],
    structuredContent: { challenges: CHALLENGES },
  }),
});
