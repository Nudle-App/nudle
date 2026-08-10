import { defineTool } from "@lovable.dev/mcp-js";
import { testimonials } from "../content";

export default defineTool({
  name: "list_testimonials",
  title: "List testimonials",
  description:
    "List public customer testimonials shown on the NUDLE site, with author, role, and institution.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(testimonials, null, 2) }],
    structuredContent: { testimonials },
  }),
});
