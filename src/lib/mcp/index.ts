import { defineMcp } from "@lovable.dev/mcp-js";
import listPetColors from "./tools/list-pet-colors";
import listPetTraits from "./tools/list-pet-traits";
import suggestPersona from "./tools/suggest-persona";
import listDailyChallenges from "./tools/list-daily-challenges";

export default defineMcp({
  name: "doudou-planet-mcp",
  title: "豆豆星球 MCP",
  version: "0.1.0",
  instructions:
    "豆豆星球的公开工具:查询宠物蛋颜色、性格特质、每日挑战,以及根据特质推荐宠物人格。所有工具都是只读的公共信息,不涉及用户账号或私有数据。",
  tools: [listPetColors, listPetTraits, suggestPersona, listDailyChallenges],
});
