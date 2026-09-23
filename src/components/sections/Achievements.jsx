import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect } from "react";
import { FaCrosshairs, FaSatelliteDish, FaShieldAlt, FaTrophy } from "react-icons/fa";
import SectionHeading from "../ui/SectionHeading";
import HudCorners from "../ui/HudCorners";
import { achievement, threatlens } from "../../data/achievements";

const groupMeta = [
  { icon: FaCrosshairs, color: "var(--blue)" },
  { icon: FaSatelliteDish, color: "var(--brass)" },
  { icon: FaShieldAlt, color: "var(--blue)" },
];

function CountUp({ value, prefix = "", suffix = "", duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (inView) {
      const controls = animate(mv, value, { duration, ease: [0.16, 1, 0.3, 1] });
      return controls.stop;
    }
  }, [inView, value, duration, mv]);

  return (
    <span ref={ref}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export default function Achievements() {
  return (
    <section id="achievements" className="relative py-28 overflow-hidden bg-[--ink] border-b border-[--hair]">
      <div className="grid-pattern absolute inset-0 opacity-[0.08] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        <SectionHeading  title="Hackathon" accent="Milestone"  />

        <div className="grid md:grid-cols-[224px_1fr] gap-10 md:gap-14 items-center mb-16">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative w-48 h-56 mx-auto md:mx-0"
          >
            <div
              className="hud-panel achievement-panel h-full flex flex-col items-center justify-center gap-2 px-5"
              style={{ boxShadow: "0 0 60px rgba(217,154,78,0.12)" }}
            >
              <HudCorners />
              <div className="w-11 h-11 rounded-full border border-[--brass]/60 flex items-center justify-center">
                <FaTrophy style={{ color: "var(--brass)" }} className="text-base" />
              </div>
              <span className="font-mono-label text-[9px] tracking-[0.25em] text-[--text-lo] uppercase text-center leading-tight">
                {achievement.series}
              </span>
              <span className="font-display font-black text-3xl text-[--text-hi] leading-none">{achievement.name}</span>
              <span className="text-[10px] text-[--brass] font-mono-label">{achievement.organizer}</span>
              <span className="w-8 h-px bg-[--brass]/50 mt-1" aria-hidden="true" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-wrap gap-2 mb-5">
              {achievement.tags.map((t) => <span key={t} className="tag-chip">{t}</span>)}
            </div>

            <p className="text-[--text-lo] leading-relaxed mb-6 max-w-xl">{achievement.description}</p>

            <div className="grid grid-cols-3 gap-3 max-w-lg">
              <div className="hud-panel stat-card text-center py-3 px-2">
                <div className="font-display font-black text-lg text-[--text-hi]">
                  <CountUp value={1500} suffix="+" />
                </div>
                <div className="font-mono-label text-[8px] uppercase tracking-wider text-[--text-lo] mt-1">Submissions</div>
              </div>
              <div className="hud-panel stat-card stat-pulse text-center py-3 px-2" style={{ borderColor: "var(--brass)" }}>
                <div className="font-display font-black text-lg" style={{ color: "var(--brass)" }}>
                  Top <CountUp value={32} />
                </div>
                <div className="font-mono-label text-[8px] uppercase tracking-wider text-[--brass] mt-1">Grand Finale</div>
              </div>
              <div className="hud-panel stat-card text-center py-3 px-2">
                <div className="font-display font-black text-lg text-[--text-hi]">
                  <CountUp value={2026} duration={1.2} />
                </div>
                <div className="font-mono-label text-[8px] uppercase tracking-wider text-[--text-lo] mt-1">PSBs Series</div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative hud-panel achievement-panel p-8 md:p-10"
        >
          <HudCorners />
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <p className="font-mono-label text-[10px] text-[--text-lo]/50 mb-2">
                $ ./threatlens --status<span className="term-cursor" />
              </p>
              <h3 className="font-display font-bold text-2xl text-[--text-hi]">{threatlens.name}</h3>
              <p className="text-[--brass] font-mono-label text-sm mt-1">{threatlens.tagline}</p>
            </div>
            <span className="font-mono-label text-[9px] text-[--text-lo] border border-[--hair] px-3 py-1.5 uppercase tracking-wider">
              Hackathon Prototype
            </span>
          </div>

          <p className="text-[--text-lo] leading-relaxed mb-8 max-w-2xl">{threatlens.description}</p>

          <div className="grid sm:grid-cols-3 gap-4">
            {threatlens.groups.map((g, gi) => {
              const meta = groupMeta[gi % groupMeta.length];
              const Icon = meta.icon;
              return (
                <motion.div
                  key={g.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: gi * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-[--surface] border border-[--hair] p-5"
                  style={{ borderTop: `2px solid ${meta.color}` }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Icon style={{ color: meta.color }} className="text-sm" />
                    <p className="font-mono-label text-[10px] uppercase tracking-[0.15em]" style={{ color: meta.color }}>
                      {g.name}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {g.items.map((item) => (
                      <span key={item} className="tech-chip text-[10px] font-mono-label text-[--text-lo] border border-[--hair] px-2 py-1">
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <p className="text-xs text-[--text-lo]/70 italic font-mono-label mt-8 pt-6 border-t border-[--hair]">{threatlens.disclaimer}</p>
        </motion.div>
      </div>
    </section>
  );
}