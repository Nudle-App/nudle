import { brand, escapeHtml } from "../brand.js";
import {
  fallbackLink,
  featureList,
  footerText,
  noteBox,
  paragraph,
  primaryButton,
  renderLayout,
  type EmailDocument,
} from "../layout.js";

export type InviteEmailVars = {
  parentName: string;
  relationship: string;
  actionUrl: string;
  expiresInDays: number;
};

export function renderInviteEmail(vars: InviteEmailVars): EmailDocument {
  const parent = escapeHtml(vars.parentName);
  const relationship = escapeHtml(vars.relationship.toLowerCase());
  const subject = `${vars.parentName} invited you to connect on Kleva`;
  const preheader = `Accept so they can view your school portal. This link expires in ${vars.expiresInDays} days.`;
  const footerReason = `You’re receiving this because a parent invited you to connect on ${brand.name}. Nothing is shared until you accept.`;

  const innerHtml = [
    paragraph(
      `<strong>${parent}</strong> listed themselves as your ${relationship} and asked to connect with your Kleva school portal.`,
    ),
    paragraph(
      "If you accept, they can follow your school year with you. They will not receive your password, and they cannot change anything on your behalf.",
    ),
    featureList([
      {
        title: "Courses",
        detail: "Your timetable and the classes you’re taking now.",
        color: brand.purple,
      },
      {
        title: "Assignments",
        detail: "Upcoming work and due dates, so they can stay in the loop.",
        color: brand.teal,
      },
      {
        title: "Report card",
        detail: "Progress and results as they appear in your portal.",
        color: brand.orange,
      },
    ]),
    primaryButton(vars.actionUrl, "Accept invitation"),
    fallbackLink(vars.actionUrl),
    noteBox(
      `This invitation expires in ${vars.expiresInDays} days. If you weren’t expecting it, you can ignore this email — nothing will be shared.`,
    ),
  ].join("");

  const text = [
    `${vars.parentName} (${vars.relationship}) invited you to connect on Kleva.`,
    "",
    "If you accept, they can view your courses, assignments, and report card.",
    "They will not get your password, and they cannot change anything on your behalf.",
    "",
    `Accept the invitation: ${vars.actionUrl}`,
    "",
    `This link expires in ${vars.expiresInDays} days. If you weren’t expecting it, you can ignore this email.`,
    footerText(footerReason),
  ].join("\n");

  return renderLayout({
    subject,
    preheader,
    kicker: "Family invitation",
    heading: `${vars.parentName} wants to view your school portal`,
    innerHtml,
    text,
    footerReason,
  });
}
