import { sendEmail, type SendEmailResult } from "../lib/mail.js";
import { renderInviteEmail, type InviteEmailVars } from "./templates/invite.js";

export { renderInviteEmail, type InviteEmailVars };

/**
 * Render a named template. Add new cases here as we introduce
 * reset-password, welcome, and similar mail.
 */
export function renderEmail(
  template: { type: "invite" } & InviteEmailVars,
) {
  switch (template.type) {
    case "invite":
      return renderInviteEmail(template);
  }
}

export async function sendInviteEmail(
  to: string,
  vars: InviteEmailVars,
): Promise<SendEmailResult> {
  const email = renderInviteEmail(vars);
  return sendEmail({
    to,
    subject: email.subject,
    html: email.html,
    text: email.text,
  });
}
