import { site } from "@/lib/data";

/**
 * Contact form delivery through Resend (https://resend.com).
 *
 * Env (set in .env.local and on the host):
 *   RESEND_API_KEY      required. A "Sending access" key from Resend → API keys.
 *   CONTACT_TO_EMAIL    inbox that receives messages. Defaults to site.email. Until a
 *                       domain is verified, Resend only delivers to the account's own email.
 *   CONTACT_FROM_EMAIL  sender, e.g. "Parth Lodat <hello@parthlodat.in>". Needs a verified
 *                       domain; defaults to Resend's shared test sender.
 *                       Setting it also turns on the "thanks, I got your message" auto-reply.
 */

const TOPICS = ["A project", "A job opportunity", "Something else"];
const LIMITS = { name: 100, email: 200, message: 5000 };
const TEST_SENDER = "Portfolio Contact <onboarding@resend.dev>";

// Best-effort flood guard per server instance: 5 messages per IP per 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const json = (body: object, status = 200) => Response.json(body, { status });

async function send(apiKey: string, payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${detail.slice(0, 300)}`);
  }
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return json({ error: "not_configured" }, 503);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  // Honeypot: real visitors never see this field. Pretend success so bots move on.
  if (body.botcheck) return json({ ok: true });

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  const topic = TOPICS.includes(String(body.topic)) ? String(body.topic) : TOPICS[2];

  if (!name || name.length > LIMITS.name) return json({ error: "Please enter your name." }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > LIMITS.email)
    return json({ error: "Please enter a valid email address." }, 400);
  if (message.length < 10 || message.length > LIMITS.message)
    return json({ error: "Please write a message of at least 10 characters." }, 400);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return json({ error: "Too many messages. Please try again in a few minutes." }, 429);

  const to = process.env.CONTACT_TO_EMAIL || site.email;
  const customFrom = process.env.CONTACT_FROM_EMAIL;
  const from = customFrom || TEST_SENDER;
  const safe = { name: escapeHtml(name), email: escapeHtml(email), topic: escapeHtml(topic), message: escapeHtml(message) };

  try {
    await send(apiKey, {
      from,
      to: [to],
      reply_to: email,
      subject: `Portfolio: ${topic} from ${name}`,
      text: `${message}\n\n---\n${name} <${email}>\nTopic: ${topic}\nSent from the contact form on ${site.url}`,
      html: `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#111">
  <p style="margin:0 0 4px;color:#666;font-size:13px">New message from your portfolio · ${safe.topic}</p>
  <p style="margin:0 0 16px"><strong>${safe.name}</strong> &lt;<a href="mailto:${safe.email}">${safe.email}</a>&gt;</p>
  <div style="white-space:pre-wrap;border-left:3px solid #ddd;padding-left:12px">${safe.message}</div>
  <p style="margin:20px 0 0;color:#888;font-size:12px">Reply to this email to answer ${safe.name} directly.</p>
</div>`,
    });
  } catch (err) {
    console.error("[contact] notification failed", err);
    return json({ error: "The message could not be sent." }, 502);
  }

  // Auto-reply only from a verified domain; Resend's test sender can't reach visitors.
  if (customFrom) {
    try {
      await send(apiKey, {
        from: customFrom,
        to: [email],
        reply_to: to,
        subject: "Thanks for your message",
        text: `Hi ${name},\n\nThanks for getting in touch. I've received your message and will reply soon.\n\nYour message:\n${message}\n\n${site.name}\n${site.url}`,
        html: `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#111">
  <p>Hi ${safe.name},</p>
  <p>Thanks for getting in touch. I've received your message and will reply soon.</p>
  <div style="white-space:pre-wrap;border-left:3px solid #ddd;padding-left:12px;color:#555">${safe.message}</div>
  <p style="margin-top:20px">${escapeHtml(site.name)}<br><a href="${site.url}">${site.url.replace("https://", "")}</a></p>
</div>`,
      });
    } catch (err) {
      console.error("[contact] auto-reply failed", err); // the main message already went through
    }
  }

  return json({ ok: true });
}
