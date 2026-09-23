import { motion } from "framer-motion";
import SectionHeading from "../ui/SectionHeading";
import HudCorners from "../ui/HudCorners";
import TerminalBio from "../ui/TerminalBio";

const profile = [
  { k: "NAME",      v: "Yash Jani" },
  { k: "ROLE",      v: "Full Stack Developer" },
  { k: "EDUCATION", v: "B.Tech, Computer Science" },
  { k: "STATUS",    v: "Full Stack Developer Intern @ WebIdeal" },
  { k: "LOCATION",  v: "India" },
];

export default function About() {
  return (
    <section id="about" className="relative py-28 overflow-hidden bg-[--ink] border-b border-[--hair]">
      <div className="grid-pattern absolute inset-0 opacity-[0.08] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <SectionHeading  title="About" accent="Me"  />

        {/* FIX: items-start stops left col from stretching when terminal grows */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* ── Left: profile card + bio text ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-28"   /* keeps left pinned while right scrolls */
          >
            <div className="hud-panel p-6 mb-8">
              <HudCorners />
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2 h-2 bg-[--brass] animate-pulse" />
                <span className="font-mono-label text-[11px] tracking-[0.2em] text-[--text-lo] uppercase">
                  root@yash:~/profile
                </span>
              </div>
              <div className="space-y-3">
                {profile.map(({ k, v }) => (
                  <div
                    key={k}
                    className="flex items-center justify-between text-sm border-b border-[--hair] pb-3 last:border-0 last:pb-0 font-mono-label"
                  >
                    <span className="text-[11px] tracking-widest text-[--text-lo]">{k}</span>
                    <span className="text-[--text-hi]">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[--text-lo] leading-relaxed mb-4">
              I'm a{" "}
              <span className="text-[--text-hi] font-medium">Full Stack Developer</span> who builds
              scalable, secure, high-performance web applications — from clean, responsive UIs
              to robust backend systems.
            </p>
            <p className="text-[--text-lo] leading-relaxed">
              My primary focus is the{" "}
              <span className="text-[--brass] font-medium">MERN stack</span>, building real-world
              products with React, Node.js, Express, and MongoDB — with a relentless focus on
              clean architecture.
            </p>
          </motion.div>

          {/* ── Right: Interactive Terminal ── */}
          <TerminalBio />
        </div>
      </div>
    </section>
  );
}
