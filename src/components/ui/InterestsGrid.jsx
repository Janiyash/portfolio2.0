import { useState } from "react";
import { motion } from "framer-motion";
import HudCorners from "./HudCorners";

/* ── data ─────────────────────────────────────────────────────────────── */
const INTERESTS = [
  {
    id: "opensource",
    icon: "⬡",
    label: "Open Source",
    tag: "BELIEF",
    desc: "Code shared freely makes everyone better. I contribute, study, and build in the open.",
    accent: true,
  },
  {
    id: "architecture",
    icon: "◈",
    label: "Clean Architecture",
    tag: "PRINCIPLE",
    desc: "No hacks, no shortcuts. Scalable patterns from day one — the right way or not at all.",
    accent: true,
  },
  {
    id: "performance",
    icon: "◎",
    label: "Performance",
    tag: "OBSESSION",
    desc: "Every millisecond counts. I optimise for speed before users notice it's slow.",
    accent: false,
  },
  {
    id: "learning",
    icon: "△",
    label: "Always Learning",
    tag: "MINDSET",
    desc: "New framework every quarter. Curiosity is the skill that compounds fastest.",
    accent: false,
  },
  {
    id: "ux",
    icon: "◇",
    label: "Thoughtful UX",
    tag: "CRAFT",
    desc: "Backend precision meets frontend empathy. If it feels rough, it isn't done.",
    accent: false,
  },
  {
    id: "shipping",
    icon: "▸",
    label: "Ship It",
    tag: "HABIT",
    desc: "Real feedback only comes from deployed code. Iterate in the open, not in drafts.",
    accent: false,
  },
];

const VALUES = [
  { label: "Reliability",   pct: 95 },
  { label: "Curiosity",     pct: 92 },
  { label: "Ownership",     pct: 88 },
  { label: "Collaboration", pct: 85 },
];

/* ── single card ──────────────────────────────────────────────────────── */
function InterestCard({ item, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-40px" }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      data-cursor="hover"
      className="relative overflow-hidden border p-4 flex flex-col gap-2"
      style={{
        background: hovered
          ? item.accent
            ? "rgba(var(--brass-rgb),0.10)"
            : "rgba(var(--text-hi-rgb),0.04)"
          : item.accent
            ? "rgba(var(--brass-rgb),0.05)"
            : "var(--surface)",
        borderColor: hovered
          ? item.accent
            ? "rgba(var(--brass-rgb),0.5)"
            : "rgba(var(--text-hi-rgb),0.18)"
          : item.accent
            ? "rgba(var(--brass-rgb),0.25)"
            : "var(--hair)",
        transition: "background 0.25s ease, border-color 0.25s ease",
        cursor: "default",
      }}
    >
      {/* corner ticks */}
      <span
        className="absolute top-0 left-0 w-2 h-2 border-t border-l pointer-events-none"
        style={{ borderColor: item.accent ? "rgba(var(--brass-rgb),0.5)" : "rgba(var(--text-hi-rgb),0.12)" }}
      />
      <span
        className="absolute bottom-0 right-0 w-2 h-2 border-b border-r pointer-events-none"
        style={{ borderColor: item.accent ? "rgba(var(--brass-rgb),0.5)" : "rgba(var(--text-hi-rgb),0.12)" }}
      />

      {/* ambient glow on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: item.accent
            ? "radial-gradient(circle at 20% 20%, rgba(var(--brass-rgb),0.12), transparent 70%)"
            : "radial-gradient(circle at 20% 20%, rgba(var(--text-hi-rgb),0.04), transparent 70%)",
        }}
      />

      {/* icon + tag row */}
      <div className="flex items-center justify-between relative">
        <span
          className="font-mono-label text-xl leading-none"
          style={{ color: item.accent ? "var(--brass)" : "rgba(var(--text-hi-rgb),0.35)" }}
        >
          {item.icon}
        </span>
        <span
          className="font-mono-label text-[8px] tracking-[0.2em] uppercase"
          style={{
            color: item.accent ? "rgba(var(--brass-rgb),0.7)" : "rgba(var(--text-hi-rgb),0.2)",
            letterSpacing: "0.18em",
          }}
        >
          {item.tag}
        </span>
      </div>

      {/* label */}
      <p
        className="font-mono-label relative"
        style={{
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.04em",
          color: hovered
            ? item.accent
              ? "var(--brass)"
              : "var(--text-hi)"
            : item.accent
              ? "rgba(var(--brass-rgb),0.85)"
              : "rgba(var(--text-hi-rgb),0.65)",
          transition: "color 0.25s ease",
        }}
      >
        {item.label}
      </p>

      {/* desc — reveal on hover */}
      <motion.p
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 4 }}
        transition={{ duration: 0.22 }}
        className="font-mono-label relative"
        style={{
          fontSize: 9,
          lineHeight: 1.65,
          color: "var(--text-lo)",
          letterSpacing: "0.04em",
        }}
      >
        {item.desc}
      </motion.p>
    </motion.div>
  );
}

/* ── value bar ────────────────────────────────────────────────────────── */
function ValueBar({ label, pct, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3 + index * 0.07 }}
      viewport={{ once: true }}
      className="flex items-center gap-3"
    >
      <span
        className="font-mono-label text-[9px] tracking-[0.14em] uppercase shrink-0"
        style={{ width: 88, color: "var(--text-lo)" }}
      >
        {label}
      </span>
      <div className="flex-1 h-px relative" style={{ background: "rgba(var(--text-hi-rgb),0.07)" }}>
        <motion.span
          className="absolute left-0 top-0 h-px"
          style={{ background: "linear-gradient(to right, var(--brass), rgba(var(--brass-rgb),0.3))" }}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          transition={{ duration: 1.0, delay: 0.4 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        />
        {/* glow dot */}
        <motion.span
          className="absolute top-[-2px] w-1 h-1 rounded-full"
          style={{ background: "var(--brass)", boxShadow: "0 0 5px 1px rgba(var(--brass-rgb),0.6)" }}
          initial={{ left: 0 }}
          whileInView={{ left: `${pct}%` }}
          transition={{ duration: 1.0, delay: 0.4 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        />
      </div>
      <span
        className="font-mono-label text-[9px] shrink-0"
        style={{ color: "rgba(var(--brass-rgb),0.6)", width: 28, textAlign: "right" }}
      >
        {pct}
      </span>
    </motion.div>
  );
}

/* ── main component ───────────────────────────────────────────────────── */
export default function InterestsGrid() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative w-full flex flex-col gap-4"
    >
      {/* ── section header ── */}
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[--brass] animate-pulse" />
        <span className="font-mono-label text-[10px] tracking-[0.22em] uppercase text-[--text-lo]">
          sys.profile — interests &amp; values
        </span>
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="flex-1 h-px origin-left"
          style={{ background: "linear-gradient(to right, rgba(var(--brass-rgb),0.4), transparent)" }}
        />
      </div>

      {/* ── card grid ── */}
      <div className="grid grid-cols-3 gap-2.5">
        {INTERESTS.map((item, i) => (
          <InterestCard key={item.id} item={item} index={i} />
        ))}
      </div>

      {/* ── values meter panel ── */}
      <div
        className="relative border border-[--hair] px-5 py-4 flex flex-col gap-3"
        style={{ background: "var(--surface)" }}
      >
        <HudCorners />
        <p
          className="font-mono-label text-[9px] tracking-[0.2em] uppercase mb-1"
          style={{ color: "rgba(var(--text-hi-rgb),0.22)" }}
        >
          // core.values — self-reported
        </p>
        {VALUES.map((v, i) => (
          <ValueBar key={v.label} {...v} index={i} />
        ))}
      </div>

      {/* ── hover hint strip ── */}
      <div
        className="relative flex items-center justify-between border border-[--hair] px-4 py-2.5"
        style={{ background: "var(--surface)" }}
      >
        <HudCorners />
        <span className="font-mono-label text-[9px] tracking-[0.18em] uppercase text-[--text-lo]">
          hover to inspect
        </span>
        <span className="font-mono-label text-[11px] text-[--text-hi]">
          {INTERESTS.length} modules loaded
        </span>
        <span
          className="font-mono-label text-[9px] tracking-widest"
          style={{ color: "var(--brass)" }}
        >
          ✓ verified
        </span>
      </div>
    </motion.div>
  );
}