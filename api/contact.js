// Vercel Serverless Function — proxies the contact form to EmailJS.
//
// Required environment variables (Vercel → Project → Settings → Environment
// Variables, NO "VITE_" prefix). After adding/changing them you MUST redeploy.
//   EMAILJS_SERVICE_ID
//   EMAILJS_TEMPLATE_ID
//   EMAILJS_PUBLIC_KEY
//   EMAILJS_PRIVATE_KEY
// Optional (rate limiting — if missing, an in-memory limiter is used instead
// of the whole form breaking):
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const DAILY_LIMIT_PER_IP = 12;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ── Rate limiter: Upstash if configured, otherwise in-memory fallback ── */
let ratelimit = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    }),
    limiter: Ratelimit.slidingWindow(DAILY_LIMIT_PER_IP, "1 d"),
    analytics: false,
    prefix: "contact-form",
  });
} else {
  console.warn("Upstash env vars missing — using in-memory rate limit fallback.");
}

const memHits = new Map(); // ip -> [timestamps]
function memoryLimit(ip) {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const hits = (memHits.get(ip) || []).filter((t) => now - t < day);
  if (hits.length >= DAILY_LIMIT_PER_IP) {
    memHits.set(ip, hits);
    return { success: false, limit: DAILY_LIMIT_PER_IP, remaining: 0, reset: hits[0] + day };
  }
  hits.push(now);
  memHits.set(ip, hits);
  return { success: true, limit: DAILY_LIMIT_PER_IP, remaining: DAILY_LIMIT_PER_IP - hits.length, reset: now + day };
}

function getClientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (fwd) return fwd.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

// Vercel normally parses JSON bodies, but be defensive.
function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return {};
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 1) Make sure EmailJS config exists — most common cause of failure.
  const { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY } = process.env;
  const missing = Object.entries({ EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY })
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) {
    console.error("Missing env vars:", missing.join(", "));
    return res.status(500).json({ error: "Contact form is not configured yet.", code: "ENV_MISSING" });
  }

  // 2) Rate limit (never lets a Redis outage kill the form)
  const ip = getClientIp(req);
  let rl;
  try {
    rl = ratelimit ? await ratelimit.limit(ip) : memoryLimit(ip);
  } catch (err) {
    console.error("Rate limiter error (continuing with in-memory fallback):", err);
    rl = memoryLimit(ip);
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

  // 3) Validate
  const { from_name, from_email, subject, message, company_website } = readBody(req);

  if (company_website) return res.status(200).json({ ok: true }); // honeypot

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

  // 4) Send via EmailJS
  try {
    const emailRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        accessToken: EMAILJS_PRIVATE_KEY,
        template_params: {
          from_name,
          from_email,
          // send several aliases so any template variable naming works
          name: from_name,
          email: from_email,
          reply_to: from_email,
          subject: subject || "(no subject)",
          message,
        },
      }),
    });

    if (!emailRes.ok) {
      const text = await emailRes.text().catch(() => "");
      // Visible in Vercel → Deployments → Functions/Logs
      console.error("EmailJS send failed:", emailRes.status, text);
      return res.status(502).json({
        error: "Failed to send your message. Please try again.",
        code: `EMAILJS_${emailRes.status}`,
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact API unexpected error:", err);
    return res.status(500).json({ error: "Unexpected server error. Please try again.", code: "UNEXPECTED" });
  }
}