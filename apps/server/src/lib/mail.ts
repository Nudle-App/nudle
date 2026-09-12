import { readFileSync } from "node:fs";
import path from "node:path";
import { brand } from "../emails/brand.js";

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export type SendEmailResult = { delivered: boolean };

function emailLogoPath() {
  return path.resolve(process.cwd(), "assets/kleva-mark.png");
}

export function emailLogoAttachment() {
  const content = readFileSync(emailLogoPath()).toString("base64");
  return {
    filename: "kleva-mark.png",
    content,
    content_id: brand.logoCid,
    content_type: "image/png",
    content_disposition: "inline",
  };
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM || "Kleva <beth.t@example.com>";

  if (!apiKey) {
    console.log(
      `[mail] RESEND_API_KEY is not set. Skipping send.\nTo: ${input.to}\nSubject: ${input.subject}\n${input.text}`,
    );
    return { delivered: false };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
      attachments: [emailLogoAttachment()],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Failed to send email: ${response.status} ${detail}`);
  }

  return { delivered: true };
}

export function studentAppOrigin() {
  const configured = (process.env.STUDENT_ORIGIN || "").replace(/\/$/, "");
  if (process.env.NODE_ENV !== "production") {
    if (configured.includes("localhost") || configured.includes("127.0.0.1")) {
      return configured;
    }
    return "http://localhost:5173";
  }
  return configured || "http://localhost:5173";
}
