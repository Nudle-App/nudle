import { defineTool } from "@lovable.dev/mcp-js";
import { overview } from "../content";

export default defineTool({
  name: "get_site_overview",
  title: "Get site overview",
  description:
    "Get NUDLE's positioning: product name, tagline, description, headline stats, and primary calls to action.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(overview, null, 2) }],
    structuredContent: overview,
  }),
});
