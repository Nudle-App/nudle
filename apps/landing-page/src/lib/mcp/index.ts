import { defineMcp } from "@lovable.dev/mcp-js";
import getSiteOverviewTool from "./tools/get-site-overview";
import listFeaturesTool from "./tools/list-features";
import getAudienceBenefitsTool from "./tools/get-audience-benefits";
import listTestimonialsTool from "./tools/list-testimonials";

export default defineMcp({
  name: "nudle-ai-landing",
  title: "Nudle AI Landing",
  version: "0.1.0",
  instructions:
    "Public tools for the NUDLE AI learning platform landing page. Use `get_site_overview` for positioning and stats, `list_features` for platform capabilities, `get_audience_benefits` for institution or student value props, and `list_testimonials` for customer quotes.",
  tools: [
    getSiteOverviewTool,
    listFeaturesTool,
    getAudienceBenefitsTool,
    listTestimonialsTool,
  ],
});
