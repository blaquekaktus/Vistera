/**
 * Email notification service via Resend REST API.
 * Requires RESEND_API_KEY env var — silently skips if not set.
 * Set RESEND_FROM_EMAIL to customise the sender (default: noreply@vistera.at).
 */

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function send({ to, subject, html }: { to: string; subject: string; html: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return; // not configured — skip silently in dev

  const from = process.env.RESEND_FROM_EMAIL ?? 'Vistera <noreply@vistera.at>';

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
  } catch {
    // Email failure must never break the main server action
  }
}

// ── Inquiry confirmation → sent to the person who submitted ─────────────────

export async function sendInquiryConfirmation({
  to,
  senderName,
  propertyTitle,
}: {
  to: string;
  senderName: string;
  propertyTitle: string;
}) {
  await send({
    to,
    subject: `Ihre Anfrage ist eingegangen – ${escHtml(propertyTitle)}`,
    html: `
      <p>Hallo ${escHtml(senderName)},</p>
      <p>Vielen Dank für Ihre Anfrage zu <strong>${escHtml(propertyTitle)}</strong>.</p>
      <p>Der Makler wird sich in Kürze bei Ihnen melden.</p>
      <p>Mit freundlichen Grüßen,<br/>Das Vistera-Team</p>
    `,
  });
}

// ── Inquiry notification → sent to the agent ────────────────────────────────

export async function sendInquiryNotification({
  to,
  senderName,
  senderEmail,
  propertyTitle,
  message,
}: {
  to: string;
  senderName: string;
  senderEmail: string;
  propertyTitle: string;
  message: string;
}) {
  await send({
    to,
    subject: `Neue Anfrage: ${escHtml(propertyTitle)}`,
    html: `
      <p>Sie haben eine neue Anfrage zu <strong>${escHtml(propertyTitle)}</strong> erhalten.</p>
      <p><strong>Von:</strong> ${escHtml(senderName)} (${escHtml(senderEmail)})</p>
      <p><strong>Nachricht:</strong></p>
      <blockquote>${escHtml(message)}</blockquote>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/dashboard/inquiries">Zur Anfragen-Übersicht →</a></p>
    `,
  });
}

// ── Reply notification → sent to the original inquiry sender ────────────────

export async function sendReplyNotification({
  to,
  senderName,
  agentName,
  propertyTitle,
  replyMessage,
}: {
  to: string;
  senderName: string;
  agentName: string;
  propertyTitle: string;
  replyMessage: string;
}) {
  await send({
    to,
    subject: `Antwort auf Ihre Anfrage – ${escHtml(propertyTitle)}`,
    html: `
      <p>Hallo ${escHtml(senderName)},</p>
      <p>${escHtml(agentName)} hat auf Ihre Anfrage zu <strong>${escHtml(propertyTitle)}</strong> geantwortet:</p>
      <blockquote>${escHtml(replyMessage)}</blockquote>
      <p>Mit freundlichen Grüßen,<br/>Das Vistera-Team</p>
    `,
  });
}
