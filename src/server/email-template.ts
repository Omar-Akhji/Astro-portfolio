import type { ContactPayload } from "@/types";

/**
 * Builds the plain-text fallback for the contact email.
 */
export const buildContactText = (payload: ContactPayload): string =>
  [
    "━━━ New Contact Message ━━━",
    "",
    `From:    ${payload.fullname}`,
    `Email:   ${payload.email}`,
    "",
    "Message:",
    payload.message,
    "",
    "— Omar Akhji · Portfolio",
  ].join("\n");

/**
 * Builds the HTML body for the contact email.
 * Design mirrors the portfolio: Montserrat font, dark bg, glass-border cards,
 * gradient underline bar on section title, muted labels.
 */
export const buildContactHtml = (payload: ContactPayload): string => {
  const year = String(new Date().getFullYear());

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
</head>
<body style="margin: 0; padding: 0; background-color: #202030; font-family: 'Montserrat', system-ui, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #202030; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%;">

          <!-- Section Title -->
          <tr>
            <td style="padding: 0 0 24px 0;">
              <h1 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600; color: #ffffff; text-transform: capitalize; letter-spacing: -0.025em;">
                New contact message
              </h1>
              <div style="width: 32px; height: 3px; border-radius: 2px; background: linear-gradient(to right, #b06aff, #6a3aaf);"></div>
            </td>
          </tr>

          <!-- Sender Info -->
          <tr>
            <td style="padding: 0 0 20px 0;">
              <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 500; color: rgba(255, 255, 255, 0.6); text-transform: uppercase; letter-spacing: 0.05em;">Name</p>
              <p style="margin: 0 0 16px 0; font-size: 15px; font-weight: 500; color: #ffffff;">${payload.fullname}</p>
              <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 500; color: rgba(255, 255, 255, 0.6); text-transform: uppercase; letter-spacing: 0.05em;">Email</p>
              <p style="margin: 0; font-size: 15px;"><a href="mailto:${payload.email}" style="color: #b06aff; text-decoration: none; font-weight: 400;">${payload.email}</a></p>
            </td>
          </tr>

          <!-- Card: Message -->
          <tr>
            <td style="padding: 0 0 16px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(255, 255, 255, 0.05); border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 16px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 500; color: rgba(255, 255, 255, 0.6); text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
                    <p style="margin: 0; font-size: 14px; line-height: 1.8; font-weight: 300; color: rgba(255, 255, 255, 0.75); white-space: pre-wrap;">${payload.message}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 16px 0 0 0; text-align: center;">
              <p style="margin: 0; font-size: 11px; font-weight: 500; color: rgba(255, 255, 255, 0.35);">
                &copy; ${year} Omar Akhji. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
