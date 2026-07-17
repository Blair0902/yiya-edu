import { defineTool } from "@lovable.dev/mcp-js";

const TRAITS = ["勇敢", "温柔", "好奇", "调皮", "细心", "乐观", "安静", "热情"];

export default defineTool({
  name: "list_pet_traits",
  title: "列出宠物性格特质",
  description: "返回豆豆星球领养流程中可选的性格特质词。",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(TRAITS) }],
    structuredContent: { traits: TRAITS },
  }),
});
