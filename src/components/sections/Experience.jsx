import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "../ui/SectionHeading";
import StatusBadge from "../ui/StatusBadge";
import HudCorners from "../ui/HudCorners";
import { experience, education } from "../../data/experience";

/* ── Education split cards ─────────────────────────────────────────────── */
const EDU_META = {
  school: {
    icon: "▸",
    tag: "SECONDARY",
    badge: "COMPLETED",
    badgeColor: "rgba(var(--text-hi-rgb),0.18)",
    badgeText: "rgba(var(--text-hi-rgb),0.45)",
    accentBorder: false,
    detail: null,
  },
  university: {
    icon: "◈",
    tag: "UNDERGRADUATE",
    badge: "IN PROGRESS",
    badgeColor: "rgba(var(--brass-rgb),0.15)",
    badgeText: "var(--brass)",
    accentBorder: true,
    detail: null,
  },
};

function EduCard({ edu, index }) {
  const [hovered, setHovered] = useState(false);
  const meta = EDU_META[edu.id] ?? {};
  const accent = meta.accentBorder;

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative overflow-hidden border p-6 flex flex-col gap-4"
      style={{
        background: hovered
          ? accent ? "rgba(var(--brass-rgb),0.06)" : "rgba(var(--text-hi-rgb),0.03)"
          : "var(--surface)",
        borderColor: hovered
          ? accent ? "rgba(var(--brass-rgb),0.45)" : "rgba(var(--text-hi-rgb),0.2)"
          : accent ? "rgba(var(--brass-rgb),0.2)" : "var(--hair)",
        transition: "background 0.25s, border-color 0.25s",
      }}
    >
      {/* HUD corner ticks */}
      <span
        className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l pointer-events-none"
        style={{ borderColor: accent ? (hovered ? "var(--brass)" : "rgba(var(--brass-rgb),0.4)") : "rgba(var(--text-hi-rgb),0.15)" }}
      />
      <span
        className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r pointer-events-none"
        style={{ borderColor: accent ? (hovered ? "var(--brass)" : "rgba(var(--brass-rgb),0.4)") : "rgba(var(--text-hi-rgb),0.15)" }}
      />

      {/* ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: accent
            ? "radial-gradient(circle at 15% 15%, rgba(var(--brass-rgb),0.1), transparent 65%)"
            : "radial-gradient(circle at 15% 15%, rgba(var(--text-hi-rgb),0.04), transparent 65%)",
        }}
      />

      {/* ── row 1: icon + tag + badge ── */}
      <div className="flex items-center justify-between relative">
        <div className="flex items-center gap-2">
          <motion.span
            animate={{ color: hovered ? "var(--brass)" : accent ? "rgba(var(--brass-rgb),0.6)" : "rgba(var(--text-hi-rgb),0.3)" }}
            transition={{ duration: 0.2 }}
            className="font-mono-label text-base leading-none"
          >
            {meta.icon}
          </motion.span>
          <span
            className="font-mono-label text-[11px] tracking-[0.2em] uppercase"
            style={{ color: accent ? "rgba(var(--brass-rgb),0.9)" : "rgba(var(--text-hi-rgb),0.75)" }}
          >
            {meta.tag}
          </span>
        </div>

        {/* status badge */}
        <span
          className="font-mono-label text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 border"
          style={{
            background: meta.badgeColor,
            color: meta.badgeText,
            borderColor: accent ? "rgba(var(--brass-rgb),0.25)" : "rgba(var(--text-hi-rgb),0.1)",
          }}
        >
          {meta.badge}
        </span>
      </div>

      {/* ── row 2: period ── */}
      <span
        className="font-mono-label text-[12px] tracking-[0.12em] relative"
        style={{ color: accent ? "var(--brass)" : "rgba(var(--text-hi-rgb),0.35)" }}
      >
        {edu.period}
      </span>

      {/* ── divider ── */}
      <motion.div
        className="relative h-px"
        style={{ background: accent ? "rgba(var(--brass-rgb),0.15)" : "rgba(var(--text-hi-rgb),0.06)" }}
      >
        <motion.span
          className="absolute left-0 top-0 h-px"
          style={{ background: accent ? "var(--brass)" : "rgba(var(--text-hi-rgb),0.25)" }}
          initial={{ width: 0 }}
          whileInView={{ width: "35%" }}
          transition={{ duration: 0.8, delay: index * 0.12 + 0.3, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        />
      </motion.div>

      {/* ── row 3: degree title ── */}
      <p
        className="font-mono-label text-base font-semibold leading-snug relative"
        style={{
          color: hovered
            ? accent ? "var(--text-hi)" : "rgba(var(--text-hi-rgb),0.8)"
            : accent ? "rgba(var(--text-hi-rgb),0.85)" : "rgba(var(--text-hi-rgb),0.6)",
          transition: "color 0.25s",
        }}
      >
        {edu.title}
      </p>

      {/* ── row 4: institution ── */}
      <p
        className="font-mono-label text-[12px] relative"
        style={{ color: accent ? "rgba(var(--brass-rgb),0.9)" : "rgba(var(--text-hi-rgb),0.65)" }}
      >
        {edu.place}
      </p>


    </motion.div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="relative py-28 pb-36 bg-[--void] border-b border-[--hair]">
      <div className="grid-pattern absolute inset-0 opacity-[0.08] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6">
        <SectionHeading  title="Work" accent="Experience"  />

        {/* ── Experience card ── */}
        {experience.map((role) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative hud-panel p-8 md:p-10 mb-16"
          >
            <HudCorners />
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <StatusBadge>Current</StatusBadge>
                <h3 className="font-display font-black text-2xl md:text-3xl text-[--text-hi] mt-4">
                  {role.role}
                </h3>
                <p className="text-[--brass] font-mono-label text-sm mt-1">{role.company}</p>
                <p className="text-[--text-lo] text-sm mt-0.5">{role.location}</p>
              </div>
              <span className="font-mono-label text-xs text-[--text-lo] border border-[--hair] px-3 py-1.5">
                {role.period}
              </span>
            </div>

            <p className="text-[--text-lo] leading-relaxed mb-6 max-w-2xl">{role.summary}</p>

            <div className="grid sm:grid-cols-2 gap-3">
              {role.responsibilities.map((r) => (
                <div key={r} className="flex items-start gap-2.5 text-sm text-[--text-hi]/80 font-mono-label">
                  <span className="text-[--brass] mt-0.5">›</span>
                  {r}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* ── Education split panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="flex items-center gap-4 mb-8">
            <span className="shrink-0 rounded-sm" style={{ width: "4px", height: "44px", background: "var(--brass)" }} />
            <div>
              <p className="font-mono-label font-bold text-xl tracking-[0.06em] uppercase text-[--text-hi] leading-tight">
                Education
              </p>
              <p className="font-mono-label text-sm tracking-[0.16em] uppercase mt-1" style={{ color: "rgba(var(--brass-rgb),0.65)" }}>
                Academic Background
              </p>
            </div>
          </div>

          {/* two cards — school left, college right */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* school first (left), university second (right) */}
            {[...education].reverse().map((edu, i) => (
              <EduCard key={edu.id} edu={edu} index={i} />
            ))}
          </div>
        </motion.div>

        {/* ── Currently building strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative hud-panel p-6 flex flex-wrap items-center gap-4 justify-between"
        >
          <HudCorners />
          <span
            className="font-mono-label text-[10px] tracking-[0.18em] uppercase select-none"
            style={{ color: "rgba(var(--brass-rgb),0.35)" }}
          >
            ❝
          </span>
          <p className="flex-1 font-display italic text-xl" style={{ color: "var(--brass)" }}>
            Clean code always looks like it was written by someone who cares.
          </p>
          <span
            className="font-mono-label text-[15px] tracking-[0.14em] uppercase"
            style={{ color: "rgba(var(--text-hi-rgb),0.4)" }}
          >
            — Robert C. Martin
          </span>
        </motion.div>
      </div>
    </section>
  );
}