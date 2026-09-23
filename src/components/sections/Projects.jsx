import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiExternalLink, FiArrowRight, FiGrid, FiLayers } from "react-icons/fi";
import SectionHeading from "../ui/SectionHeading";
import { projects } from "../../data/projects";

/* fan-out positions for the stacked deck — index 0 is the front card */
const STACK = [
  { x: 0,   y: 0,   rotate: 0,  scale: 1,    z: 10 },
  { x: 60,  y: -10, rotate: 3,  scale: 0.93, z: 9  },
  { x: 97,  y: -4,  rotate: 6,  scale: 0.88, z: 8  },
  { x: 128, y: 4,   rotate: 9,  scale: 0.83, z: 7  },
  { x: 152, y: 12,  rotate: 12, scale: 0.78, z: 6  },
];

function CardPreview({ project }) {
  if (project.image) {
    return (
      <div style={{
        width: "100%", borderRadius: 8, overflow: "hidden",
        background: "var(--void)",
        border: `1px solid ${project.accent}20`,
        lineHeight: 0, height: 200,
      }}>
        <img
          src={project.image}
          alt={`${project.title} screenshot`}
          loading="lazy"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>
    );
  }
  return (
    <div
      className="w-full flex flex-col items-center justify-center gap-1"
      style={{
        height: 160, borderRadius: 8,
        background: `linear-gradient(135deg, ${project.accent}22 0%, ${project.accent}0a 100%)`,
        border: `1px dashed ${project.accent}55`,
      }}
    >
      <span style={{ fontFamily: "'Georgia',serif", fontSize: 26, fontWeight: 900, color: project.accent }}>
        {project.num}
      </span>
      <span className="font-mono-label uppercase tracking-[0.18em]" style={{ fontSize: 8, color: "var(--text-lo)" }}>
        Preview coming soon
      </span>
    </div>
  );
}

/* the small deck card — adapts to light/dark mode */
function DeckCard({ project, onClick, isActive, style, ...motionProps }) {
  const acc = project.accent;
  return (
    <motion.div
      onClick={onClick}
      className="select-none deck-card"
      style={{
        width: 295,
        height: 420,
        borderRadius: 18,
        border: `1px solid ${acc}55`,
        cursor: isActive ? "default" : "pointer",
        boxShadow: isActive
          ? "none"
          : `0 0 0 1px ${acc}30, 0 8px 24px rgba(0,0,0,0.5), 0 20px 48px rgba(0,0,0,0.35), 0 0 40px ${acc}20`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        ...style,
      }}
      {...motionProps}
    >
      {/* top accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3, zIndex: 2,
        background: `linear-gradient(90deg, ${acc}, ${acc}44)`,
      }} />

      {/* glass shine */}
      <div style={{
        position: "absolute", top: 0, left: "-40%", width: "80%", height: "55%",
        background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 1, borderRadius: "0 0 100% 0",
      }} />

      {/* watermark number — more visible */}
      <div style={{
        position: "absolute", bottom: -8, right: 0,
        fontFamily: "'Georgia', serif", fontSize: 110, fontWeight: 900, lineHeight: 1,
        color: `${acc}25`,
        pointerEvents: "none", userSelect: "none", zIndex: 0, letterSpacing: "-0.05em",
      }}>
        {project.num}
      </div>

      {/* top row: number pill + dots */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 0", position: "relative", zIndex: 2 }}>
        <span style={{
          fontFamily: "monospace", fontSize: 11, fontWeight: 800,
          color: acc, letterSpacing: "0.18em", textTransform: "uppercase",
          background: `${acc}22`, border: `1px solid ${acc}60`,
          padding: "3px 10px", borderRadius: 20,
        }}>
          {project.num}
        </span>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {[acc, `${acc}70`, `${acc}40`].map((c, i) => (
            <div key={i} style={{ width: i === 0 ? 8 : 6, height: i === 0 ? 8 : 6, borderRadius: "50%", background: c }} />
          ))}
        </div>
      </div>

      {/* logo area - full bleed no border radius so no rectangle edge */}
      <div style={{
        margin: "10px 12px 0", borderRadius: 12,
        position: "relative", zIndex: 2, flexShrink: 0,
        background: project.logoBg || "#ffffff",
        height: 160,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        border: "none",
      }}>
        {project.logo ? (
          <img
            src={project.logo}
            alt={`${project.title} logo`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
              display: "block",
              padding: "16px 20px",
              mixBlendMode: project.logoBlend || "normal",
            }}
          />
        ) : (
          <span style={{ fontFamily: "'Georgia',serif", fontSize: 40, fontWeight: 900, color: acc, opacity: 0.7 }}>{project.num}</span>
        )}
      </div>

      {/* tech chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "9px 12px 0", position: "relative", zIndex: 2 }}>
        {project.tech.slice(0, 3).map((t) => (
          <span key={t} style={{
            fontFamily: "monospace", fontSize: 8, textTransform: "uppercase",
            letterSpacing: "0.08em", color: acc,
            background: `${acc}18`, border: `1px solid ${acc}45`,
            padding: "2px 7px", borderRadius: 4, fontWeight: 600,
          }}>
            {t}
          </span>
        ))}
      </div>

      {/* title + category */}
      <div style={{ marginTop: "auto", padding: "0 12px 14px", position: "relative", zIndex: 2 }}>
        <div style={{ height: 1, background: `linear-gradient(90deg, ${acc}55, transparent)`, marginBottom: 9 }} />
        <h4 className="deck-title" style={{
          fontFamily: "'Georgia', serif", fontSize: 17, fontWeight: 800,
          color: "#F8F0E0", margin: "0 0 5px", lineHeight: 1.2,
          textShadow: `0 1px 6px rgba(0,0,0,0.9), 0 0 20px ${acc}50`,
        }}>
          {project.title}
        </h4>
        <p className="deck-category" style={{
          fontFamily: "monospace", fontSize: 10, color: acc,
          margin: 0, letterSpacing: "0.1em", textTransform: "uppercase",
          fontWeight: 600, opacity: 0.9,
        }}>
          {project.category}
        </p>
      </div>

      {/* arrow */}
      <div style={{ position: "absolute", bottom: 14, right: 14, color: acc, opacity: 0.8, zIndex: 2 }}>
        <FiArrowRight size={15} />
      </div>
    </motion.div>
  );
}

/* full technical-detail card — used both as the focused stack card AND for
   every card in the "reveal all" grid */
function DetailCard({ project, onFocus }) {
  return (
    <div
      onClick={onFocus}
      className="relative hud-panel overflow-hidden"
      style={{ padding: "26px 28px 28px", cursor: onFocus ? "pointer" : "default" }}
    >
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: 3, background: `linear-gradient(90deg, ${project.accent}, transparent)` }}
      />

      <div className="flex items-center justify-between mb-3">
        <span className="font-mono-label text-[11px] tracking-[0.15em] uppercase" style={{ color: project.accent }}>
          {project.num}
        </span>
        <span className="font-mono-label text-[9px] tracking-[0.1em] uppercase text-[--text-lo]">
          {project.category}
        </span>
      </div>

      <h3 className="font-display font-black text-[--text-hi] leading-tight mb-4" style={{ fontSize: "clamp(19px, 2.4vw, 25px)" }}>
        {project.title}
      </h3>

      <CardPreview project={project} />

      <div className="flex flex-wrap gap-1.5 my-4">
        {project.tech.map((t) => (
          <span
            key={t}
            className="tech-chip font-mono-label uppercase tracking-[0.08em] text-[--text-lo] border border-[--hair]"
            style={{ fontSize: 9, padding: "3px 8px" }}
          >
            {t}
          </span>
        ))}
      </div>

      <p className="font-mono-label text-[--text-lo] mb-4" style={{ fontSize: 12, lineHeight: 1.65 }}>
        {project.description}
      </p>

      <div
        className="mb-5"
        style={{
          borderLeft: `2px solid ${project.accent}`,
          background: `${project.accent}12`,
          padding: "9px 12px",
          borderRadius: "0 8px 8px 0",
        }}
      >
        <p className="font-mono-label italic text-[--text-lo]" style={{ fontSize: 11, margin: 0, letterSpacing: "0.03em" }}>
          {project.result}
        </p>
      </div>

      <div className="flex gap-2.5" onClick={(e) => e.stopPropagation()}>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="hover"
          className="inline-flex items-center gap-2 font-mono-label uppercase tracking-[0.08em] font-bold text-[--on-accent]"
          style={{ background: "var(--brass)", padding: "9px 17px", fontSize: 11 }}
        >
          <FiGithub size={12} />
          Source
        </a>
        {project.demo ? (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="inline-flex items-center gap-2 font-mono-label uppercase tracking-[0.08em] border border-[--hair] text-[--text-lo]"
            style={{ padding: "9px 17px", fontSize: 11 }}
          >
            <FiExternalLink size={12} />
            Launch &rarr;
          </a>
        ) : (
          <span
            className="inline-flex items-center gap-2 font-mono-label uppercase tracking-[0.08em] border border-[--hair] cursor-not-allowed"
            style={{ padding: "9px 17px", fontSize: 11, color: "var(--dim-text-faint)" }}
          >
            Private
          </span>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  const featuredIdx = Math.max(0, projects.findIndex((p) => p.featured));
  const [activeIdx, setActiveIdx] = useState(featuredIdx);
  const [revealAll, setRevealAll] = useState(true);
  const active = projects[activeIdx];

  const transitionLock = useRef(false);

  const goToStackPos = useCallback((stackPos) => {
    if (stackPos === 0 || transitionLock.current) return;
    transitionLock.current = true;
    setActiveIdx((cur) => (cur + stackPos) % projects.length);
    setTimeout(() => { transitionLock.current = false; }, 420);
  }, []);

  const focusFromGrid = (i) => {
    setActiveIdx(i);
    setRevealAll(false);
  };

  const ordered = [...projects.slice(activeIdx), ...projects.slice(0, activeIdx)];

  return (
    <section id="projects" className="relative pt-14 pb-24 overflow-hidden bg-[--void] border-b border-[--hair]">
      <div className="grid-pattern absolute inset-0 opacity-[0.08] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        <SectionHeading eyebrow="Selected Work" title="My" accent="Projects" subtitle="Real-world applications, built end to end." index="04" />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center font-mono-label text-[10px] uppercase tracking-[0.2em] text-[--brass] mb-5 -mt-8"
        >
          {revealAll ? "Click any card to focus it in the stack" : "Click on any card in the stack to bring it forward"}
        </motion.p>

        <AnimatePresence mode="wait">
          {revealAll ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="flex flex-wrap justify-center gap-6"
            >
              {projects.map((p, i) => (
                <motion.div
                  key={p.num}
                  initial={{ opacity: 0, scale: 0.94, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  whileHover={{ y: -6 }}
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(50%-12px)] xl:w-[calc(33.333%-16px)]"
                >
                  <DetailCard project={p} onFocus={() => focusFromGrid(i)} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="stack"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16"
              style={{ minHeight: 500 }}
            >
              {/* detail card */}
              <div className="w-full" style={{ maxWidth: 430 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIdx}
                    initial={{ opacity: 0, y: 20, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -14, scale: 0.97 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <DetailCard project={active} />
                    <div className="flex gap-1.5 mt-5 pt-4 border-t border-[--hair]">
                      {projects.map((_, i) => (
                        <button
                          key={i}
                          aria-label={`Go to project ${i + 1}`}
                          onClick={() => goToStackPos((i - activeIdx + projects.length) % projects.length)}
                          style={{
                            width: i === activeIdx ? 22 : 6,
                            height: 6,
                            borderRadius: 3,
                            background: i === activeIdx ? active.accent : "var(--dim-border)",
                            border: "none",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            padding: 0,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* fanned deck */}
              <div className="relative flex-shrink-0" style={{ width: 520, height: 560 }}>
                {[...ordered].reverse().map((project, revIdx) => {
                  const stackPos = ordered.length - 1 - revIdx;
                  const cfg = STACK[stackPos] || STACK[STACK.length - 1];
                  const isActive = stackPos === 0;

                  return (
                    <DeckCard
                      key={project.num}
                      project={project}
                      isActive={isActive}
                      onClick={() => !isActive && goToStackPos(stackPos)}
                      initial={false}
                      animate={{
                        x: cfg.x, y: cfg.y, rotate: cfg.rotate, scale: cfg.scale,
                        zIndex: cfg.z,
                        opacity: isActive ? 0 : 1,
                      }}
                      transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.9 }}
                      whileHover={!isActive ? { x: cfg.x - 10, scale: cfg.scale + 0.02 } : {}}
                      style={{ position: "absolute", top: 20, left: 20, pointerEvents: isActive ? "none" : "auto" }}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* counter */}
        {!revealAll && (
          <div className="flex justify-center items-center gap-3 mt-12">
            <span className="font-mono-label tracking-[0.15em] text-[--brass]" style={{ fontSize: 11 }}>
              {String(activeIdx + 1).padStart(2, "0")}
            </span>
            <div className="relative overflow-hidden" style={{ width: 80, height: 1, background: "var(--dim-border)" }}>
              <motion.div
                animate={{ width: `${((activeIdx + 1) / projects.length) * 100}%` }}
                transition={{ duration: 0.4 }}
                className="absolute left-0 top-0 h-full bg-[--brass]"
              />
            </div>
            <span className="font-mono-label tracking-[0.15em] text-[--text-lo]" style={{ fontSize: 11 }}>
              {String(projects.length).padStart(2, "0")}
            </span>
          </div>
        )}

        {/* view toggle */}
        <div className={`flex justify-center ${revealAll ? "mt-4" : "mt-8"}`}>
          <button
            onClick={() => setRevealAll((v) => !v)}
            data-cursor="hover"
            className="inline-flex items-center gap-2.5 font-mono-label uppercase tracking-[0.15em] border border-[--brass] text-[--brass] hover:bg-[--brass] hover:text-[--on-accent] transition-colors"
            style={{ fontSize: 10, padding: "9px 20px" }}
          >
            {revealAll ? <FiLayers size={13} /> : <FiGrid size={13} />}
            {revealAll ? "Collapse to stack" : "Reveal all projects"}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <a
            href="https://github.com/Janiyash"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="shine inline-flex items-center gap-3 px-10 py-4 bg-[--brass] text-[--on-accent] text-sm font-mono-label uppercase tracking-widest font-bold"
          >
            <FiGithub className="text-xl" />
            View All Projects on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}