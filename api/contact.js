// Vercel Serverless Function — proxies the contact form to EmailJS.
//
// Why this exists instead of calling EmailJS straight from the browser:
//   1. Real per-IP rate limiting is only possible server-side. Browsers
//      never expose a visitor's real IP to JavaScript, and any counter
//      kept in the browser (localStorage etc.) is wiped by clearing site
//      data or opening a private window — so it protects against nothing.
//   2. EmailJS's private key (needed for their "Strict Mode" / server auth)
//      must never be shipped to the browser. Keeping the whole email send
//      server-side means none of your EmailJS credentials touch client code.
//
// Required environment variables (set in Vercel → Project → Settings →
// Environment Variables, NOT prefixed with VITE_ — that prefix is what
// tells Vite to bundle a value into the public browser JS, which is the
// opposite of what we want here):
//   EMAILJS_SERVICE_ID
//   EMAILJS_TEMPLATE_ID
//   EMAILJS_PUBLIC_KEY
//   EMAILJS_PRIVATE_KEY   (EmailJS dashboard → Account → API Keys)
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const DAILY_LIMIT_PER_IP = 12;

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(DAILY_LIMIT_PER_IP, "1 d"),
  analytics: false,
  prefix: "contact-form",
});

function getClientIp(req) {
  // Vercel sets x-forwarded-for reliably at the edge; take the first
  // (left-most) address, which is the original client.
  const fwd = req.headers["x-forwarded-for"];
  if (fwd) return fwd.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = getClientIp(req);

  let rl;
  try {
    rl = await ratelimit.limit(ip);
  } catch (err) {
    // If Upstash is unreachable, fail closed on the side of NOT sending
    // unlimited mail — better to briefly block real messages than to let
    // rate limiting silently stop working.
    console.error("Rate limiter error:", err);
    return res.status(503).json({ error: "Service temporarily unavailable. Please try again shortly." });
  }

  res.setHeader("X-RateLimit-Limit", String(rl.limit));
  res.setHeader("X-RateLimit-Remaining", String(rl.remaining));

  if (!rl.success) {
    const retryAfterSec = Math.max(1, Math.ceil((rl.reset - Date.now()) / 1000));
    res.setHeader("Retry-After", String(retryAfterSec));
    return res.status(429).json({
      error: `You've reached the daily limit of ${DAILY_LIMIT_PER_IP} messages from this network. Please try again tomorrow.`,
    });
  }

  const body = req.body || {};
  const { from_name, from_email, subject, message, company_website } = body;

  // Honeypot — real visitors never see or fill this field. If it's filled,
  // silently pretend success so the bot doesn't learn it was caught, and
  // we don't spend an EmailJS send (or count it against the real limit's
  // usefulness for the person who owns this IP).
  if (company_website) {
    return res.status(200).json({ ok: true });
  }

  if (!from_name || !from_email || !message) {
    return res.status(400).json({ error: "Please fill in your name, email, and message." });
  }
  if (
    typeof from_name !== "string" || from_name.length > 100 ||
    typeof from_email !== "string" || from_email.length > 150 ||
    typeof message !== "string" || message.length > 2000 ||
    (subject !== undefined && (typeof subject !== "string" || subject.length > 150))
  ) {
    return res.status(400).json({ error: "One of the fields is invalid or too long." });
  }
  if (!EMAIL_RE.test(from_email)) {
    return res.status(400).json({ error: "That doesn't look like a valid email address." });
  }

  try {
    const emailRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
          from_name,
          from_email,
          subject: subject || "(no subject)",
          message,
        },
      }),
    });

    if (!emailRes.ok) {
      const text = await emailRes.text().catch(() => "");
      console.error("EmailJS send failed:", emailRes.status, text);
      return res.status(502).json({ error: "Failed to send your message. Please try again." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact API unexpected error:", err);
    return res.status(500).json({ error: "Unexpected server error. Please try again." });
  }
}