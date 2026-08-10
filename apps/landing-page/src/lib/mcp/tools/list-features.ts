import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { features } from "../content";

export default defineTool({
  name: "list_features",
  title: "List platform features",
  description:
    "List NUDLE's platform features with descriptions. Optionally filter by a keyword matched against the title and description.",
  inputSchema: {
    query: z
      .string()
      .trim()
      .optional()
      .describe("Optional keyword to filter features, e.g. 'analytics'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query }) => {
    const q = query?.toLowerCase();
    const items = q
      ? features.filter(
          (f) =>
            f.title.toLowerCase().includes(q) ||
            f.description.toLowerCase().includes(q),
        )
      : features;
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { features: items },
    };
  },
});
