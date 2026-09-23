import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MdEmail } from "react-icons/md";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useRef, useState, useCallback, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

// The contact form now submits to /api/contact — a Vercel serverless function
// that handles real per-IP rate limiting and sends the email server-side.
// No EmailJS credentials of any kind are shipped to the browser anymore;
// see api/contact.js for where those live and how it's configured.

const socials = [
  { icon: MdEmail,    label: "Email",    value: "janiyash0911@gmail.com",    href: "mailto:janiyash0911@gmail.com" },
  { icon: FaLinkedin, label: "LinkedIn", value: "linkedin.com/in/jani-yash001/", href: "https://www.linkedin.com/in/jani-yash001/" },
  { icon: FaGithub,   label: "GitHub",   value: "github.com/janiyash",       href: "https://github.com/janiyash" },
];

/* ─── inject global autofill fix once ─── */
function useAutofillFix() {
  useEffect(() => {
    const id = "contact-autofill-fix";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      textarea:-webkit-autofill,
      textarea:-webkit-autofill:hover,
      textarea:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0px 1000px var(--surface) inset !important;
        box-shadow: 0 0 0px 1000px var(--surface) inset !important;
        -webkit-text-fill-color: var(--text-hi) !important;
        caret-color: var(--brass) !important;
        border-color: var(--hair) !important;
        transition: background-color 9999s ease-in-out 0s;
      }
      .contact-input {
        background: transparent !important;
        -webkit-appearance: none;
        appearance: none;
      }
      .contact-input:focus {
        background: transparent !important;
        outline: none !important;
        box-shadow: none !important;
      }
    `;
    document.head.appendChild(style);
  }, []);
}

/* ─── Dot grid ─── */
function DotGrid() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="cg2" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.75" fill="var(--brass)" opacity="0.09" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cg2)" />
    </svg>
  );
}

/* ─── Tilt card ─── */
function TiltCard({ children }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 28 });
  const sy = useSpring(y, { stiffness: 160, damping: 28 });
  const rotateX = useTransform(sy, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(sx, [-0.5, 0.5], ["-4deg", "4deg"]);

  const onMove = useCallback((e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - r.left) / r.width  - 0.5);
    y.set((e.clientY - r.top)  / r.height - 0.5);
  }, [x, y]);
  const onLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
      {children}
    </motion.div>
  );
}

/* ─── Social row ─── */
function SocialRow({ s, index }) {
  const Icon = s.icon;
  const [hov, setHov] = useState(false);
  return (
    <motion.a
      href={s.href} target="_blank" rel="noopener noreferrer"
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.08 + index * 0.07 }}
      viewport={{ once: true }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="relative flex items-center gap-4 py-4 px-4 overflow-hidden cursor-pointer"
      style={{
        border: `1px solid ${hov ? "rgba(var(--brass-rgb),0.35)" : "rgba(var(--text-hi-rgb),0.09)"}`,
        background: hov ? "rgba(var(--brass-rgb),0.055)" : "rgba(var(--text-hi-rgb),0.02)",
        transition: "border-color 0.22s, background 0.22s",
      }}
    >
      {/* left bar */}
      <motion.span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[--brass] origin-bottom"
        animate={{ scaleY: hov ? 1 : 0 }} transition={{ duration: 0.2 }} />

      {/* icon */}
      <span
        className="flex-shrink-0 w-11 h-11 flex items-center justify-center transition-colors duration-200"
        style={{
          background: hov ? "var(--brass)" : "rgba(var(--brass-rgb),0.09)",
          border: `1px solid ${hov ? "var(--brass)" : "rgba(var(--brass-rgb),0.22)"}`,
        }}
      >
        <span style={{ color: hov ? "var(--on-accent)" : "var(--brass)", transition: "color 0.2s" }}>
          <Icon size={18} />
        </span>
      </span>

      {/* text */}
      <div className="flex-1 min-w-0">
        <p className="font-mono-label text-[10px] tracking-[0.18em] text-[--text-lo] uppercase mb-0.5">{s.label}</p>
        <p className="text-sm font-medium truncate transition-colors duration-200" style={{ color: hov ? "var(--brass)" : "var(--text-hi)" }}>
          {s.value}
        </p>
      </div>

      {/* arrow */}
      <motion.span className="flex-shrink-0 text-[--brass] text-base"
        animate={{ x: hov ? 0 : -6, opacity: hov ? 1 : 0 }} transition={{ duration: 0.18 }}>
        ↗
      </motion.span>
    </motion.a>
  );
}

/* ─── Field ─── */
function Field({ type = "text", name, label, required, rows, maxLength, onCharCount }) {
  const [focused, setFocused] = useState(false);
  const [val, setVal] = useState("");
  const Tag = rows ? "textarea" : "input";
  const id = `cf2-${name}`;
  const lifted = focused || val.length > 0;

  return (
    <div className="relative">
      {/* floating label */}
      <label htmlFor={id}
        className="absolute left-0 pointer-events-none z-10 font-mono-label uppercase transition-all duration-200"
        style={{
          top: rows ? (lifted ? 0 : 16) : "50%",
          transform: rows ? "none" : lifted ? "translateY(-160%)" : "translateY(-50%)",
          fontSize: lifted ? 9 : 10,
          letterSpacing: "0.18em",
          color: focused ? "var(--brass)" : "var(--dim-text-faint)",
        }}
      >{label}</label>

      {/* bottom track */}
      <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: focused ? "var(--brass)" : "var(--hair)", transition: "background 0.25s" }} />

      <Tag
        id={id} type={type} name={name} required={required} rows={rows} maxLength={maxLength}
        value={val}
        className="contact-input w-full text-[--text-hi] text-sm font-mono-label resize-none"
        onChange={(e) => { setVal(e.target.value); onCharCount?.(e.target.value.length); }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background: "var(--surface)",
          WebkitBoxShadow: `0 0 0 1000px var(--surface) inset`,
          boxShadow: "none",
          WebkitTextFillColor: "var(--text-hi)",
          caretColor: "var(--brass)",
          border: "none",
          outline: "none",
          paddingTop:    rows ? (lifted ? 22 : 14) : 20,
          paddingBottom: rows ? 10 : 14,
          paddingLeft: 0, paddingRight: 0,
          color: "var(--text-hi)",
        }}
      />
    </div>
  );
}

/* ─── MAIN ─── */
const SUBMIT_COOLDOWN_MS = 45_000; // don't allow another send within 45s
const MIN_FILL_TIME_MS = 2_500; // real humans take at least this long to fill the form

export default function Contact() {
  useAutofillFix();
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [chars,   setChars]   = useState(0);
  const mountedAt = useRef(Date.now());
  const lastSentAt = useRef(0);

  const sendEmail = async (e) => {
    e.preventDefault();

    // honeypot: real visitors never see or fill this field. Any bot that
    // blindly fills every input on the page will trip it.
    const honeypot = formRef.current.elements["company_website"]?.value;
    if (honeypot) {
      // fail silently — don't tip the bot off that it was caught, and don't
      // spend a send against the daily rate limit for it.
      return;
    }

    // basic bot heuristic: a form submitted within ~2.5s of the page loading
    // almost certainly wasn't filled out by a human.
    if (Date.now() - mountedAt.current < MIN_FILL_TIME_MS) {
      toast.error("Please take a moment before sending.", { style: { background: "var(--surface)", color: "#ff6b6b", border: "1px solid #ff444460", borderRadius: 0 } });
      return;
    }

    // quick client-side cooldown so the button can't be mashed — the real,
    // unbypassable limit is enforced server-side per IP in api/contact.js.
    const now = Date.now();
    if (now - lastSentAt.current < SUBMIT_COOLDOWN_MS) {
      const waitSec = Math.ceil((SUBMIT_COOLDOWN_MS - (now - lastSentAt.current)) / 1000);
      toast.error(`Please wait ${waitSec}s before sending another message.`, { style: { background: "var(--surface)", color: "#ff6b6b", border: "1px solid #ff444460", borderRadius: 0 } });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData(formRef.current);
      const payload = Object.fromEntries(formData.entries());

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 429) {
        toast.error(data.error || "Daily message limit reached. Please try again tomorrow.", { style: { background: "var(--surface)", color: "#ff6b6b", border: "1px solid #ff444460", borderRadius: 0 } });
        setLoading(false);
        return;
      }
      if (!res.ok) {
        throw new Error(data.error || "Failed to send");
      }

      toast.success("Message sent!", { style: { background: "var(--surface)", color: "var(--text-hi)", border: "1px solid var(--brass)", borderRadius: 0, fontSize: 13 } });
      setLoading(false); setSent(true);
      lastSentAt.current = Date.now();
      formRef.current.reset(); setChars(0);
      setTimeout(() => setSent(false), 3800);
    } catch (err) {
      toast.error("Failed. Try again.", { style: { background: "var(--surface)", color: "#ff6b6b", border: "1px solid #ff444460", borderRadius: 0 } });
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative pt-28 pb-16 overflow-hidden bg-[--ink]">
      <Toaster position="top-right" />
      <DotGrid />

      {/* ambient glows */}
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[800px] h-[460px] pointer-events-none rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(var(--brass-rgb),0.07) 0%, transparent 65%)", filter: "blur(48px)" }} />
      <div className="absolute top-0 right-0 w-[460px] h-[360px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top right, rgba(var(--brass-rgb),0.04) 0%, transparent 60%)" }} />

      <div className="relative max-w-6xl mx-auto px-6">

        {/* ── eyebrow ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }} viewport={{ once: true }}
          className="flex items-center gap-3 mb-4"
        >
        </motion.div>

        {/* ── headline ── */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} viewport={{ once: true }}
          className="font-display font-black leading-none text-[--text-hi] mb-14"
          style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}
        >
          Let's <span className="text-[--brass] italic">Talk</span>
        </motion.h2>

        {/* ── two columns ── */}
        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-12 items-start">

          {/* ── LEFT ── */}
          <div className="flex flex-col gap-7">

            <motion.p
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }} viewport={{ once: true }}
              className="text-[--text-lo] leading-relaxed text-[0.9375rem]"
            >
              Whether you have a project in mind, want to collaborate on something cool, or just want to say hi — my inbox is always open.
            </motion.p>

            {/* availability badge */}
            <motion.div
              initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2.5 px-4 py-2.5 w-fit"
              style={{ border: "1px solid rgba(var(--brass-rgb),0.2)", background: "rgba(var(--brass-rgb),0.04)" }}
            >
              <motion.span className="w-2 h-2 rounded-full bg-emerald-400"
                animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
              <span className="font-mono-label text-[10px] tracking-[0.2em] text-[--brass] uppercase">Open to opportunities</span>
            </motion.div>

            {/* social cards */}
            <div className="flex flex-col gap-2.5">
              {socials.map((s, i) => <SocialRow key={s.label} s={s} index={i} />)}
            </div>

            {/* response time */}
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }} viewport={{ once: true }}
              className="font-mono-label text-[10px] tracking-[0.18em] uppercase text-[--text-lo] pl-3"
              style={{ borderLeft: "2px solid rgba(var(--brass-rgb),0.28)" }}
            >
              Avg. response &lt; 24 hrs
            </motion.p>
          </div>

          {/* ── RIGHT – form card ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }} viewport={{ once: true }}
          >
            <TiltCard>
              <div className="relative overflow-hidden"
                style={{
                  background: "linear-gradient(140deg, rgba(var(--text-hi-rgb),0.05) 0%, rgba(var(--text-hi-rgb),0.015) 100%), var(--surface)",
                  border: "1px solid var(--hair)",
                  backdropFilter: "blur(16px)",
                }}>

                {/* top brass bar */}
                <div className="h-[1.5px] w-full"
                  style={{ background: "linear-gradient(90deg, transparent 0%, var(--brass) 40%, var(--brass) 60%, transparent 100%)" }} />

                {/* corner accents */}
                {[
                  "top-0 right-0 border-t border-r",
                  "bottom-0 left-0 border-b border-l",
                ].map((cls, i) => (
                  <span key={i} className={`absolute w-5 h-5 pointer-events-none ${cls}`}
                    style={{ borderColor: "rgba(var(--brass-rgb),0.35)" }} />
                ))}

                {/* card header */}
                <div className="flex items-center justify-between px-7 py-4"
                  style={{ borderBottom: "1px solid var(--hair)" }}>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-[5px]">
                      {["#ff5f57cc","#febc2ecc","#28c840cc"].map((c, i) => (
                        <span key={i} className="w-[11px] h-[11px] rounded-full" style={{ background: c }} />
                      ))}
                    </div>
                    <span className="font-mono-label text-[10px] tracking-[0.2em] text-[--text-lo] uppercase ml-1">Compose</span>
                  </div>
                  <span className="font-mono-label text-[10px] text-[--text-lo]">
                    {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>

                {/* success overlay */}
                <AnimatePresence>
                  {sent && (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5"
                      style={{ background: "var(--void)", backdropFilter: "blur(10px)" }}
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -12 }} animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 280, damping: 20 }}
                        className="w-16 h-16 flex items-center justify-center"
                        style={{ border: "1px solid var(--brass)", background: "rgba(var(--brass-rgb),0.08)" }}
                      >
                        <motion.span className="text-[--brass] text-2xl"
                          initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.18 }}>✓</motion.span>
                      </motion.div>
                      <motion.p className="font-mono-label text-xs tracking-[0.28em] text-[--brass] uppercase"
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
                        Transmitted
                      </motion.p>
                      <motion.p className="text-[--text-lo] text-xs font-mono-label"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42 }}>
                        I'll reply within 24 hours.
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* form */}
                <form ref={formRef} onSubmit={sendEmail} className="px-7 py-7 flex flex-col gap-7">
                  {/* honeypot — visually hidden, unreachable by keyboard, off-screen for
                      screen readers too. Real visitors never interact with this field. */}
                  <div style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }} aria-hidden="true">
                    <label htmlFor="company_website">Company website</label>
                    <input type="text" id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-8">
                    <Field name="from_name"  label="Your name"  required maxLength={100} />
                    <Field type="email" name="from_email" label="Your email" required maxLength={150} />
                  </div>

                  <Field name="subject" label="Subject" maxLength={150} />

                  <div className="relative">
                    <Field name="message" label="Your message" required rows={6} maxLength={2000} onCharCount={setChars} />
                    <span className="absolute bottom-2 right-0 font-mono-label text-[9px] text-[--text-lo] opacity-50 tracking-widest pointer-events-none">
                      {chars}/2000
                    </span>
                  </div>

                  {/* divider */}
                  <div className="h-px" style={{ background: "var(--hair)" }} />

                  {/* submit */}
                  <motion.button
                    type="submit" disabled={loading}
                    whileHover="hover" whileTap={{ scale: 0.985 }}
                    className="relative w-full py-[14px] overflow-hidden font-mono-label text-[11px] uppercase tracking-[0.22em] font-bold disabled:opacity-50"
                    style={{ background: "var(--brass)", color: "var(--on-accent)" }}
                  >
                    {/* shine */}
                    <motion.span className="absolute inset-0 pointer-events-none skew-x-12"
                      style={{ background: "linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.22) 50%, transparent 80%)", x: "-150%" }}
                      variants={{ hover: { x: "220%", transition: { duration: 0.5, ease: "easeInOut" } } }}
                    />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <motion.span className="w-3 h-3 border border-[--on-accent]/60 border-t-transparent rounded-full"
                            animate={{ rotate: 360 }} transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }} />
                          Sending…
                        </>
                      ) : "Send Message →"}
                    </span>
                  </motion.button>
                </form>
              </div>
            </TiltCard>
          </motion.div>
        </div>


      </div>
    </section>
  );
}