import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { audiences } from "../content";

export default defineTool({
  name: "get_audience_benefits",
  title: "Get audience benefits",
  description:
    "Get NUDLE's value proposition for a specific audience: institutions or students.",
  inputSchema: {
    audience: z
      .enum(["institutions", "students"])
      .describe("Which audience to describe."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ audience }) => {
    const data = audiences[audience];
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { audience, ...data },
    };
  },
});
