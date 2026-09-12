/** Public brand tokens from the Kleva landing page and learner mark. */

export const brand = {
  name: "Kleva",
  tagline: "Grades, growth, and insight — together, for your whole school.",
  cream: "#F7F1E6",
  canvasStart: "#EEE4F7",
  canvasMid: "#F6EEE2",
  canvasEnd: "#E8F4EE",
  paper: "#FFFCF7",
  ink: "#14121A",
  muted: "#5C5866",
  line: "#E6DCC8",
  purple: "#6B3EF0",
  teal: "#2DD4C0",
  orange: "#F07818",
  white: "#FFFFFF",
  footerMuted: "#B7B1A6",
  footerLine: "#2C2933",
  footerCream: "#F4EEE3",
  supportEmail: "hello@joinkleva.app",
  siteUrl: "https://joinkleva.app",
  loansUrl: "https://joinkleva.app/loans/",
  displayFont: "Fraunces, Georgia, 'Times New Roman', serif",
  bodyFont: "Inter, 'Helvetica Neue', Arial, sans-serif",
  logoCid: "kleva-mark",
} as const;

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
