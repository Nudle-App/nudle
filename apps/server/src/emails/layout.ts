import { brand, escapeHtml } from "./brand.js";

export type EmailDocument = {
  subject: string;
  preheader: string;
  html: string;
  text: string;
};

type LayoutInput = {
  subject: string;
  preheader: string;
  heading: string;
  kicker?: string;
  innerHtml: string;
  text: string;
  footerReason?: string;
};

export function renderLayout(input: LayoutInput): EmailDocument {
  const year = new Date().getFullYear();
  const heading = escapeHtml(input.heading);
  const preheader = escapeHtml(input.preheader);
  const kicker = input.kicker
    ? `<p style="margin:0 0 10px;font-family:${brand.bodyFont};font-size:12px;line-height:1.3;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${brand.purple};">${escapeHtml(input.kicker)}</p>`
    : "";
  const canvasGradient = `linear-gradient(165deg, ${brand.canvasStart} 0%, ${brand.cream} 38%, ${brand.canvasMid} 68%, ${brand.canvasEnd} 100%)`;
  const canvasStyle = `background-color:${brand.cream};background-image:${canvasGradient};background-repeat:no-repeat;background-size:cover;`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${escapeHtml(input.subject)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Inter:wght@400;500;600&display=swap");
    html, body { margin: 0; padding: 0; height: 100%; }
    body { ${canvasStyle} }
    a { color: ${brand.purple}; }
  </style>
</head>
<body style="margin:0;padding:0;${canvasStyle}">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    ${preheader}
    ${"&nbsp;&zwnj;".repeat(70)}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${brand.cream}" style="${canvasStyle}">
    <tr>
      <td align="center" bgcolor="${brand.cream}" style="padding:40px 16px 48px;${canvasStyle}">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;">
          <tr>
            <td style="padding:0 8px 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="middle" style="padding-right:12px;">
                    <img src="cid:${brand.logoCid}" alt="" width="44" height="44" style="display:block;border:0;outline:none;text-decoration:none;" />
                  </td>
                  <td valign="middle">
                    <p style="margin:0;font-family:${brand.displayFont};font-size:28px;line-height:1;font-weight:600;letter-spacing:-0.02em;color:${brand.ink};">
                      ${brand.name}
                    </p>
                    <p style="margin:6px 0 0;font-family:${brand.bodyFont};font-size:13px;line-height:1.3;color:${brand.muted};">
                      Teaching and learning, connected by insight
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:${brand.paper};border:1px solid ${brand.line};border-radius:22px;overflow:hidden;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="46%" height="6" bgcolor="${brand.purple}" style="font-size:0;line-height:0;">&nbsp;</td>
                  <td width="27%" height="6" bgcolor="${brand.teal}" style="font-size:0;line-height:0;">&nbsp;</td>
                  <td width="27%" height="6" bgcolor="${brand.orange}" style="font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:40px 40px 44px;">
                    ${kicker}
                    <h1 style="margin:0 0 20px;font-family:${brand.displayFont};font-size:32px;line-height:1.18;font-weight:600;letter-spacing:-0.03em;color:${brand.ink};">
                      ${heading}
                    </h1>
                    ${input.innerHtml}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 0 0;">
              ${renderFooter(year, input.footerReason)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: input.subject,
    preheader: input.preheader,
    html,
    text: input.text,
  };
}

function renderFooter(year: number, reason?: string) {
  const why =
    reason || `You’re receiving this email from ${brand.name}.`;

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${brand.ink};border-radius:22px;overflow:hidden;">
    <tr>
      <td style="padding:36px 36px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td valign="middle" style="padding-right:10px;">
              <img src="cid:${brand.logoCid}" alt="" width="32" height="32" style="display:block;border:0;outline:none;text-decoration:none;" />
            </td>
            <td valign="middle" style="font-family:${brand.displayFont};font-size:22px;line-height:1;font-weight:600;letter-spacing:-0.02em;color:${brand.footerCream};">
              ${brand.name}
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;max-width:420px;font-family:${brand.bodyFont};font-size:14px;line-height:1.6;color:${brand.footerMuted};">
          ${escapeHtml(brand.tagline)}
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:4px 36px 28px;">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            ${footerLinkCell(brand.siteUrl, "Visit the site")}
            ${footerDot()}
            ${footerLinkCell(`mailto:${brand.supportEmail}`, "Contact us")}
            ${footerDot()}
            ${footerLinkCell(brand.loansUrl, "Education loans")}
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:0 36px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td height="1" bgcolor="${brand.footerLine}" style="font-size:0;line-height:0;border:0;">&nbsp;</td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:22px 36px 28px;font-family:${brand.bodyFont};font-size:12px;line-height:1.65;color:${brand.footerMuted};">
        <p style="margin:0 0 10px;">${escapeHtml(why)}</p>
        <p style="margin:0 0 14px;">
          Questions?
          <a href="mailto:${brand.supportEmail}" style="color:${brand.footerCream};text-decoration:none;">${brand.supportEmail}</a>
        </p>
        <p style="margin:0;">© ${year} ${brand.name}</p>
      </td>
    </tr>
    <tr>
      <td>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="46%" height="5" bgcolor="${brand.purple}" style="font-size:0;line-height:0;">&nbsp;</td>
            <td width="27%" height="5" bgcolor="${brand.teal}" style="font-size:0;line-height:0;">&nbsp;</td>
            <td width="27%" height="5" bgcolor="${brand.orange}" style="font-size:0;line-height:0;">&nbsp;</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

function footerLinkCell(href: string, label: string) {
  return `<td style="font-family:${brand.bodyFont};font-size:13px;line-height:1.3;font-weight:600;">
    <a href="${escapeHtml(href)}" style="color:${brand.footerCream};text-decoration:none;">${escapeHtml(label)}</a>
  </td>`;
}

function footerDot() {
  return `<td style="padding:0 12px;font-family:${brand.bodyFont};font-size:13px;line-height:1.3;color:${brand.footerMuted};">·</td>`;
}

export function paragraph(html: string) {
  return `<p style="margin:0 0 18px;font-family:${brand.bodyFont};font-size:16px;line-height:1.65;color:${brand.ink};">${html}</p>`;
}

export function mutedParagraph(html: string) {
  return `<p style="margin:0;font-family:${brand.bodyFont};font-size:13px;line-height:1.6;color:${brand.muted};">${html}</p>`;
}

export function noteBox(html: string) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 0;">
    <tr>
      <td style="padding:16px 18px;background-color:${brand.cream};border:1px solid ${brand.line};border-radius:14px;">
        ${mutedParagraph(html)}
      </td>
    </tr>
  </table>`;
}

export function featureList(
  items: Array<{ title: string; detail: string; color: string }>,
) {
  const rows = items
    .map(
      (item, index) => `<tr>
      <td width="22" valign="top" style="padding:${index === 0 ? "0" : "14px"} 0 0;">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td width="10" height="10" bgcolor="${item.color}" style="font-size:0;line-height:0;border-radius:10px;">&nbsp;</td>
          </tr>
        </table>
      </td>
      <td valign="top" style="padding:${index === 0 ? "0" : "12px"} 0 0;">
        <p style="margin:0;font-family:${brand.bodyFont};font-size:15px;line-height:1.35;font-weight:600;color:${brand.ink};">${escapeHtml(item.title)}</p>
        <p style="margin:4px 0 0;font-family:${brand.bodyFont};font-size:13px;line-height:1.5;color:${brand.muted};">${escapeHtml(item.detail)}</p>
      </td>
    </tr>`,
    )
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 26px;">
    <tr>
      <td style="padding:18px 20px;background-color:${brand.cream};border:1px solid ${brand.line};border-radius:16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${rows}
        </table>
      </td>
    </tr>
  </table>`;
}

export function primaryButton(href: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:4px 0 18px;">
    <tr>
      <td bgcolor="${brand.purple}" style="border-radius:999px;">
        <a href="${escapeHtml(href)}" style="display:inline-block;padding:15px 30px;font-family:${brand.bodyFont};font-size:15px;font-weight:600;line-height:1;color:${brand.white};text-decoration:none;border-radius:999px;">
          ${escapeHtml(label)}
        </a>
      </td>
    </tr>
  </table>`;
}

export function fallbackLink(href: string, label = "Or paste this link into your browser") {
  return `<p style="margin:0 0 24px;font-family:${brand.bodyFont};font-size:12px;line-height:1.6;color:${brand.muted};word-break:break-all;">
    ${escapeHtml(label)}<br />
    <a href="${escapeHtml(href)}" style="color:${brand.purple};text-decoration:none;">${escapeHtml(href)}</a>
  </p>`;
}

export function footerText(reason: string) {
  return [
    "",
    "—",
    `${brand.name}`,
    brand.tagline,
    brand.siteUrl,
    `Questions? ${brand.supportEmail}`,
    reason,
  ].join("\n");
}
