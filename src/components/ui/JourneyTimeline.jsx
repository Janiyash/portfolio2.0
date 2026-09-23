import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import HudCorners from "./HudCorners";

/* ── milestones ──────────────────────────────────────────────────────── */
const MILESTONES = [
  {
    year: "2021",
    tag: "ORIGIN",
    title: "First Line of Code",
    desc: "Wrote my first HTML page at 16. Got hooked instantly — stayed up all night changing colors and font sizes.",
    accent: false,
  },
  {
    year: "2022",
    tag: "LEVEL UP",
    title: "JavaScript & the DOM",
    desc: "Discovered JS, built mini-games and interactive UIs. Realized the web could actually feel alive.",
    accent: false,
  },
  {
    year: "2023",
    tag: "STACK",
    title: "MERN Stack Unlocked",
    desc: "Jumped into React, Node.js, Express & MongoDB. Built my first full-stack app — login to dashboard.",
    accent: false,
  },
  {
    year: "2023",
    tag: "SHIPPED",
    title: "First Real Project",
    desc: "Launched a SaaS dashboard with auth, billing & real users. Clean architecture, zero shortcuts.",
    accent: true,
  },
  {
    year: "2024",
    tag: "INDUSTRY",
    title: "Internship @ WebIdeal",
    desc: "Full Stack Developer Intern — building production features, collaborating on live client products.",
    accent: true,
  },
  {
    year: "NOW",
    tag: "PRESENT",
    title: "Building & Growing",
    desc: "Exploring TypeScript, Docker & AI integrations. Always shipping, always learning.",
    accent: false,
  },
];

/* ── single milestone node ───────────────────────────────────────────── */
function Milestone({ item, index, totalCount }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isLast = index === totalCount - 1;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-4"
    >
      {/* ── spine column ── */}
      <div className="flex flex-col items-center" style={{ width: 32, flexShrink: 0 }}>
        {/* node dot */}
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.35, delay: index * 0.08 + 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-center"
          style={{
            width: 14,
            height: 14,
            border: `1px solid ${item.accent ? "var(--brass)" : "rgba(var(--text-hi-rgb),0.22)"}`,
            background: item.accent ? "rgba(var(--brass-rgb),0.18)" : "var(--surface)",
            flexShrink: 0,
            marginTop: 3,
          }}
        >
          {item.accent && (
            <span
              style={{
                display: "block",
                width: 5,
                height: 5,
                background: "var(--brass)",
              }}
            />
          )}
        </motion.div>

        {/* connecting line segment */}
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.55, delay: index * 0.08 + 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              flex: 1,
              width: 1,
              background: item.accent
                ? "linear-gradient(to bottom, rgba(var(--brass-rgb),0.4), rgba(var(--text-hi-rgb),0.07))"
                : "linear-gradient(to bottom, rgba(var(--text-hi-rgb),0.1), rgba(var(--text-hi-rgb),0.04))",
              transformOrigin: "top",
              marginTop: 4,
              marginBottom: 4,
            }}
          />
        )}
      </div>

      {/* ── content ── */}
      <div
        className="relative pb-6"
        style={{ flex: 1, minWidth: 0, paddingBottom: isLast ? 0 : 20 }}
      >
        {/* year + tag row */}
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="font-mono-label font-bold"
            style={{
              fontSize: 11,
              color: item.accent ? "var(--brass)" : "rgba(var(--text-hi-rgb),0.35)",
              letterSpacing: "0.12em",
            }}
          >
            {item.year}
          </span>
          <span
            className="font-mono-label"
            style={{
              fontSize: 8,
              letterSpacing: "0.22em",
              color: item.accent ? "rgba(var(--brass-rgb),0.7)" : "rgba(var(--text-hi-rgb),0.18)",
              paddingLeft: 6,
              borderLeft: `1px solid ${item.accent ? "rgba(var(--brass-rgb),0.3)" : "rgba(var(--text-hi-rgb),0.1)"}`,
            }}
          >
            {item.tag}
          </span>
        </div>

        {/* title */}
        <p
          className="font-mono-label mb-1"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: item.accent ? "var(--text-hi)" : "rgba(var(--text-hi-rgb),0.75)",
            letterSpacing: "0.02em",
          }}
        >
          {item.title}
        </p>

        {/* description */}
        <p
          className="font-mono-label leading-relaxed"
          style={{ fontSize: 10, color: "var(--text-lo)", letterSpacing: "0.04em" }}
        >
          {item.desc}
        </p>
      </div>
    </motion.div>
  );
}

/* ── main component ───────────────────────────────────────────────────── */
export default function JourneyTimeline() {
  const wrapRef  = useRef(null);
  const inView   = useInView(wrapRef, { once: true, margin: "-40px" });

  /* subtle parallax on the header label */
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start end", "end start"] });
  const labelY = useTransform(scrollYProgress, [0, 1], [-10, 10]);

  return (
    <motion.div
      ref={wrapRef}
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative w-full flex flex-col gap-4"
    >
      {/* ── panel header ── */}
      <motion.div style={{ y: labelY }} className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[--brass] animate-pulse" />
        <span className="font-mono-label text-[10px] tracking-[0.22em] uppercase text-[--text-lo]">
          sys.journey — dev log
        </span>
        <motion.span
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 h-px origin-left"
          style={{ background: "linear-gradient(to right, rgba(var(--brass-rgb),0.35), transparent)" }}
        />
        <span className="font-mono-label text-[9px] tracking-widest" style={{ color: "var(--brass)" }}>
          ● ACTIVE
        </span>
      </motion.div>

      {/* ── timeline panel ── */}
      <div
        className="relative border border-[--hair] p-5 pt-6"
        style={{ background: "var(--surface)" }}
      >
        <HudCorners />

        {/* scan-line shimmer strip at top */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: [0, 0.06, 0] } : {}}
          transition={{ duration: 2.2, delay: 0.4, ease: "easeInOut" }}
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(to right, transparent, var(--brass), transparent)" }}
        />

        {/* milestones */}
        <div>
          {MILESTONES.map((item, i) => (
            <Milestone
              key={i}
              item={item}
              index={i}
              totalCount={MILESTONES.length}
            />
          ))}
        </div>
      </div>

      {/* ── bottom status strip ── */}
      <div
        className="relative flex items-center justify-between border border-[--hair] px-4 py-2.5"
        style={{ background: "var(--surface)" }}
      >
        <HudCorners />
        <span className="font-mono-label text-[9px] tracking-[0.18em] uppercase text-[--text-lo]">
          milestones
        </span>
        <span className="font-mono-label text-[11px] text-[--text-hi]">
          {MILESTONES.length} logged
        </span>
        <span
          className="font-mono-label text-[9px] tracking-widest"
          style={{ color: "var(--brass)" }}
        >
          ✓ still writing
        </span>
      </div>
    </motion.div>
  );
}