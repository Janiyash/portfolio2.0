import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import HudCorners from "./HudCorners";

/* ── data ─────────────────────────────────────────────────────────────── */
const STATS = [
  { value: 12,   suffix: "+",  label: "Projects Built",      sub: "shipped to production",  accent: true  },
  { value: 1200, suffix: "+",  label: "GitHub Commits",      sub: "across all repos",        accent: false },
  { value: 3,    suffix: "+",  label: "Years Coding",        sub: "since age 16",            accent: false },
  { value: 6,    suffix: "+",  label: "Tech Stacks",         sub: "frontend to backend",     accent: false },
  { value: 99,   suffix: "%",  label: "Coffee Dependency",   sub: "non-negotiable",          accent: false },
  { value: 2,    suffix: "am", label: "Best Debug Hour",     sub: "lo-fi playing",           accent: false },
];

const BARS = [
  { label: "Frontend",  pct: 90, color: "var(--brass)"                  },
  { label: "Backend",   pct: 78, color: "var(--blue)"                   },
  { label: "Databases", pct: 70, color: "rgba(var(--text-hi-rgb),0.35)"        },
  { label: "DevOps",    pct: 50, color: "rgba(var(--brass-rgb),0.55)"         },
];

/* ── animated counter hook ────────────────────────────────────────────── */
function useCounter(target, duration = 1600, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, started]);
  return count;
}

/* ── single stat card ─────────────────────────────────────────────────── */
function StatCard({ value, suffix, label, sub, accent, started, delay }) {
  const count = useCounter(value, 1400, started);
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      viewport={{ once: true }}
      className="relative overflow-hidden border border-[--hair] p-4"
      style={{ background: accent ? "rgba(var(--brass-rgb),0.07)" : "var(--surface)" }}
    >
      {accent && (
        <span
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: "inset 0 0 0 1px rgba(var(--brass-rgb),0.22)" }}
        />
      )}
      {/* top-left tick mark */}
      <span
        className="absolute top-0 left-0 w-2 h-2 border-t border-l"
        style={{ borderColor: accent ? "var(--brass)" : "rgba(var(--text-hi-rgb),0.18)" }}
      />
      {/* bottom-right tick mark */}
      <span
        className="absolute bottom-0 right-0 w-2 h-2 border-b border-r"
        style={{ borderColor: accent ? "var(--brass)" : "rgba(var(--text-hi-rgb),0.18)" }}
      />

      <p
        className="font-mono-label font-bold leading-none mb-1"
        style={{
          fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
          color: accent ? "var(--brass)" : "var(--text-hi)",
          letterSpacing: "-0.01em",
        }}
      >
        {count}
        <span
          style={{
            fontSize: "0.55em",
            color: accent ? "var(--brass)" : "rgba(var(--text-hi-rgb),0.5)",
            marginLeft: "2px",
          }}
        >
          {suffix}
        </span>
      </p>
      <p className="font-mono-label text-[11px] tracking-[0.12em] uppercase text-[--text-hi] mb-0.5">
        {label}
      </p>
      <p className="font-mono-label text-[9px] tracking-[0.1em] uppercase text-[--text-lo]">
        {sub}
      </p>
    </motion.div>
  );
}

/* ── skill bar ────────────────────────────────────────────────────────── */
function SkillBar({ label, pct, color, started, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      viewport={{ once: true }}
      className="mb-3 last:mb-0"
    >
      <div className="flex justify-between items-baseline mb-1">
        <span className="font-mono-label text-[10px] tracking-[0.15em] uppercase text-[--text-lo]">
          {label}
        </span>
        <span className="font-mono-label text-[10px] text-[--text-lo]">{pct}%</span>
      </div>
      <div
        className="h-px relative"
        style={{ background: "rgba(var(--text-hi-rgb),0.08)" }}
      >
        <motion.span
          className="absolute left-0 top-0 h-px"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={started ? { width: `${pct}%` } : { width: 0 }}
          transition={{ duration: 1.1, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* traveling glow dot */}
        <motion.span
          className="absolute top-[-2px] w-1 h-1 rounded-full"
          style={{ background: color, boxShadow: `0 0 6px 2px ${color}` }}
          initial={{ left: 0 }}
          animate={started ? { left: `${pct}%` } : { left: 0 }}
          transition={{ duration: 1.1, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  );
}

/* ── main component ───────────────────────────────────────────────────── */
export default function DevStats() {
  const ref     = useRef(null);
  const inView  = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative w-full flex flex-col gap-5"
    >
      {/* ── panel header ── */}
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[--brass] animate-pulse" />
        <span className="font-mono-label text-[10px] tracking-[0.22em] uppercase text-[--text-lo]">
          sys.stats — live register
        </span>
        <span
          className="ml-auto font-mono-label text-[9px] tracking-widest"
          style={{ color: "var(--brass)" }}
        >
          ●&nbsp;ONLINE
        </span>
      </div>

      {/* ── stat cards grid ── */}
      <div className="grid grid-cols-3 gap-3">
        {STATS.map((s, i) => (
          <StatCard key={s.label} {...s} started={inView} delay={i * 0.07} />
        ))}
      </div>

      {/* ── focus meter panel ── */}
      <div className="relative border border-[--hair] p-5" style={{ background: "var(--surface)" }}>
        <HudCorners />
        <p className="font-mono-label text-[10px] tracking-[0.2em] uppercase text-[--text-lo] mb-4">
          // discipline.meter — avg proficiency
        </p>
        {BARS.map((b, i) => (
          <SkillBar key={b.label} {...b} started={inView} delay={0.3 + i * 0.1} />
        ))}
      </div>

      {/* ── bottom status strip ── */}
      <div
        className="relative flex items-center justify-between border border-[--hair] px-4 py-2.5"
        style={{ background: "var(--surface)" }}
      >
        <HudCorners size={6} />
        <span className="font-mono-label text-[9px] tracking-[0.18em] uppercase text-[--text-lo]">
          uptime.since
        </span>
        <span className="font-mono-label text-[11px] text-[--text-hi]">
          2021 — present
        </span>
        <span
          className="font-mono-label text-[9px] tracking-widest"
          style={{ color: "var(--brass)" }}
        >
          ✓ operational
        </span>
      </div>
    </motion.div>
  );
}