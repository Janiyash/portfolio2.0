import { motion } from "framer-motion";
import { useState } from "react";
import SectionHeading from "../ui/SectionHeading";
import HudCorners from "../ui/HudCorners";

const stages = [
  { id: "idea", label: "Idea", what: "Clarify the problem and the user need.", tech: "Discovery, notes, quick sketches" },
  { id: "architecture", label: "Architecture", what: "Plan the data model and system structure.", tech: "ERDs, API contracts, folder structure" },
  { id: "ui", label: "UI / UX", what: "Design clean, responsive interfaces.", tech: "Figma, Tailwind, component systems" },
  { id: "api", label: "API", what: "Build REST endpoints and business logic.", tech: "Node.js, Express, validation" },
  { id: "database", label: "Database", what: "Model and persist data reliably.", tech: "MongoDB, MySQL, PostgreSQL, Prisma" },
  { id: "testing", label: "Testing", what: "Verify behavior and catch regressions.", tech: "Manual QA, Postman, edge cases" },
  { id: "deployment", label: "Deployment", what: "Ship and monitor in production.", tech: "Vercel, Firebase, CI basics" },
];

export default function BuildProcess() {
  const [active, setActive] = useState(stages[0].id);
  const activeIndex = stages.findIndex((s) => s.id === active);
  const activeStage = stages[activeIndex];

  return (
    <section className="relative py-28 overflow-hidden bg-[--void] border-b border-[--hair]">
      <div className="grid-pattern absolute inset-0 opacity-[0.08] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6">
        <SectionHeading eyebrow="Engineering Process" title="How I" accent="Build" index="06" />

        {/* Track */}
        <div className="relative mb-4">
          <div className="absolute left-0 right-0 top-[15px] h-px bg-[--hair]" />
          <motion.div
            className="absolute left-0 top-[15px] h-px bg-[--brass]"
            initial={{ width: "0%" }}
            whileInView={{ width: `${(activeIndex / (stages.length - 1)) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            viewport={{ once: true }}
          />

          <div className="relative flex justify-between">
            {stages.map((s, i) => (
              <button
                key={s.id}
                data-cursor="hover"
                onClick={() => setActive(s.id)}
                onMouseEnter={() => setActive(s.id)}
                className="flex flex-col items-center gap-2 group"
                style={{ flex: "1 1 0" }}
              >
                <span
                  className="w-[9px] h-[9px] rounded-full border-2 transition-all"
                  style={{
                    background: active === s.id ? "var(--brass)" : "var(--void)",
                    borderColor: active === s.id ? "var(--brass)" : "rgba(var(--text-hi-rgb),0.25)",
                  }}
                />
                <span className="font-mono-label text-[9px] text-[--text-lo] group-hover:text-[--brass] transition-colors">
                  0{i + 1}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Labels row, hidden on small screens for cleanliness, shown as wrap on mobile */}
        <div className="hidden sm:flex justify-between mb-10 px-0">
          {stages.map((s) => (
            <span
              key={s.id}
              className="flex-1 text-center text-[11px] font-medium transition-colors"
              style={{ color: active === s.id ? "var(--text-hi)" : "var(--text-lo)" }}
            >
              {s.label}
            </span>
          ))}
        </div>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="relative hud-panel p-8 text-center max-w-xl mx-auto"
        >
          <HudCorners />
          <span className="font-mono-label text-[10px] text-[--brass] tracking-widest">STEP 0{activeIndex + 1} / 0{stages.length}</span>
          <h3 className="font-display font-bold text-2xl text-[--text-hi] my-2">{activeStage.label}</h3>
          <p className="text-[--text-lo] mb-3">{activeStage.what}</p>
          <p className="font-mono-label text-xs text-[--brass]">{activeStage.tech}</p>
        </motion.div>
      </div>
    </section>
  );
}