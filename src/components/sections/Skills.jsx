import { useState } from "react";
import { motion } from "framer-motion";
import {
  SiReact, SiJavascript, SiTypescript, SiTailwindcss, SiHtml5, SiCss3, SiVite,
  SiNodedotjs, SiExpress, SiMongodb, SiMysql, SiPostgresql, SiPhp, SiPython,
  SiC, SiDjango, SiFlask, SiFastapi, SiNumpy, SiPandas, SiGit, SiGithub, SiPostman,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import SectionHeading from "../ui/SectionHeading";
import HudCorners from "../ui/HudCorners";
import { skillCategories } from "../../data/skills";

const ICONS = {
  React: SiReact, JavaScript: SiJavascript, TypeScript: SiTypescript, "Tailwind CSS": SiTailwindcss,
  HTML5: SiHtml5, CSS3: SiCss3, Vite: SiVite, "Node.js": SiNodedotjs, "Express.js": SiExpress,
  MongoDB: SiMongodb, MySQL: SiMysql, PostgreSQL: SiPostgresql, PHP: SiPhp, Python: SiPython,
  Java: FaJava, C: SiC, Django: SiDjango, Flask: SiFlask, FastAPI: SiFastapi, NumPy: SiNumpy,
  Pandas: SiPandas, Git: SiGit, GitHub: SiGithub, Postman: SiPostman,
};

const LETTERS = ["A", "B", "C", "D", "E", "F"];

/* ─── Scrolling Ticker Strip ─────────────────────────────────────────────── */
const allSkills = skillCategories.flatMap((cat) =>
  cat.skills.map((skill) => ({ name: skill, color: cat.color }))
);

function SkillTicker() {
  // Duplicate for seamless loop
  const items = [...allSkills, ...allSkills];

  return (
    <div className="relative w-full overflow-hidden border-y border-[--hair] bg-[--ink] py-3 mb-16">
      {/* Left fade */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, var(--ink), transparent)" }}
      />
      {/* Right fade */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, var(--ink), transparent)" }}
      />

      <motion.div
        className="flex items-center gap-0 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        style={{ width: "max-content" }}
      >
        {items.map(({ name, color }, i) => (
          <span key={i} className="flex items-center">
            {/* Slash separator */}
            <span
              className="font-mono-label text-xs mx-3"
              style={{ color: "var(--dim-text-faint)" }}
            >
              /
            </span>
            {/* Dot */}
            <span
              className="inline-block w-[6px] h-[6px] rounded-full mr-2 shrink-0"
              style={{ backgroundColor: color, boxShadow: `0 0 5px ${color}80` }}
            />
            {/* Label */}
            <span
              className="font-mono-label text-[11px] tracking-[0.18em] uppercase"
              style={{ color: "var(--dim-text)" }}
            >
              {name}
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Skill Card ─────────────────────────────────────────────────────────── */
function SkillCard({ skill, color, featured, i }) {
  const Icon = ICONS[skill];
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 26, scale: 0.9, rotate: i % 2 === 0 ? -2 : 2 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -6, scale: 1.03 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      data-cursor="hover"
      className={`group relative flex ${featured ? "sm:col-span-2 flex-row items-center gap-4 px-6 py-5" : "flex-col items-start gap-3 px-4 py-5"} border border-[--hair] bg-[--surface] overflow-hidden`}
      style={{ transition: "border-color 0.25s ease, box-shadow 0.25s ease" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          borderColor: hovered ? color : "transparent",
          boxShadow: hovered ? `0 0 0 1px ${color}55, 0 16px 38px -14px ${color}66` : "none",
          border: "1px solid transparent",
          transition: "box-shadow 0.3s ease",
        }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute -inset-8 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ background: `radial-gradient(circle at 30% 20%, ${color}30, transparent 65%)` }}
      />

      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3.2 + (i % 4) * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
        className="relative flex items-center gap-3 w-full"
      >
        {Icon ? (
          <motion.span
            animate={{ rotate: hovered ? [0, -8, 8, 0] : 0, scale: hovered ? 1.15 : 1 }}
            transition={{ duration: 0.5 }}
            className={`relative shrink-0 flex ${featured ? "text-4xl" : "text-2xl"}`}
            style={{ color }}
          >
            <Icon />
          </motion.span>
        ) : (
          <span
            className={`relative shrink-0 flex items-center justify-center font-mono-label border ${featured ? "w-11 h-11 text-xs" : "w-8 h-8 text-[10px]"}`}
            style={{ borderColor: color, color }}
          >
            {skill.slice(0, 2).toUpperCase()}
          </span>
        )}
        <div className="relative">
          <span className={`block text-[--text-hi] font-medium leading-tight ${featured ? "text-lg" : "text-sm"}`}>{skill}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Category Block ─────────────────────────────────────────────────────── */
function CategoryBlock({ cat, letter, blockIndex }) {
  return (
    <div className="mb-16 last:mb-0">
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: blockIndex * 0.05 }}
        viewport={{ once: true, margin: "-40px" }}
        className="flex items-baseline gap-3 mb-5"
      >
        <h3 className="font-display font-bold text-2xl text-[--text-hi]">{cat.label}</h3>
        <span className="font-mono-label text-[10px] tracking-[0.15em] text-[--text-lo] uppercase">
        </span>
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: blockIndex * 0.05 + 0.1, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-40px" }}
          className="h-px flex-1 origin-left"
          style={{ background: `linear-gradient(to right, ${cat.color}80, transparent)` }}
        />
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cat.skills.map((skill, i) => (
          <SkillCard key={skill} skill={skill} color={cat.color} featured={i === 0} i={i} />
        ))}
      </div>
    </div>
  );
}

/* ─── Main Section ───────────────────────────────────────────────────────── */
export default function Skills() {
  const totalSkills = skillCategories.reduce((sum, c) => sum + c.skills.length, 0);

  return (
    <section id="skills" className="relative py-28 overflow-hidden bg-[--ink] border-b border-[--hair]">
      <div className="grid-pattern absolute inset-0 opacity-[0.1] pointer-events-none" />

      <motion.div
        aria-hidden="true"
        className="absolute w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(217,154,78,0.10), transparent 70%)", filter: "blur(20px)", top: "10%", left: "-6%" }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(110,143,174,0.10), transparent 70%)", filter: "blur(20px)", bottom: "5%", right: "-6%" }}
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        <SectionHeading
          title="Skills &"
          accent="Systems"
        />

        {/* ── Scrolling Ticker Strip ── */}
        <SkillTicker />

        {skillCategories.map((cat, ci) => (
          <CategoryBlock key={cat.id} cat={cat} letter={LETTERS[ci]} blockIndex={ci} />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="hud-panel relative flex flex-wrap items-center justify-between gap-4 p-6 mt-4"
        >
          <HudCorners />
          <div>
            <p className="font-mono-label text-[10px] tracking-[0.2em] text-[--text-lo] uppercase mb-1">Full Stack Register</p>
            <p className="font-display font-bold text-lg text-[--text-hi]">
              {String(totalSkills).padStart(2, "0")} Components <span className="text-[--brass] italic">Across {skillCategories.length} Disciplines</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}