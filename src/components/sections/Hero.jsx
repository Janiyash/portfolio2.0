import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import useReducedMotion from "../../hooks/useReducedMotion";
import CinematicPortrait from "../ui/CinematicPortrait";

export default function Hero() {
  const reduced = useReducedMotion();

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-[--void] border-b border-[--hair]">
      <div className="grid-pattern absolute inset-0 opacity-[0.12] pointer-events-none" aria-hidden="true" />

      {/* Frame brackets */}
      <div className="absolute inset-4 md:inset-6 pointer-events-none" aria-hidden="true">
        <span className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[--brass]/70" />
        <span className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[--brass]/70" />
        <span className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[--brass]/70" />
        <span className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[--brass]/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 md:px-8 pt-24 grid md:grid-cols-[1fr_1fr] gap-8 md:gap-6 items-center">

        {/* Text column */}
        <div className="max-w-2xl order-2 md:order-1">

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono-label text-[13px] tracking-[0.25em] text-[--brass] uppercase mb-6"
          >
            Full Stack Developer · Systems Engineer
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-black leading-[0.86] text-[--text-hi] select-none"
            style={{ fontSize: "clamp(3.8rem, 9vw, 7rem)" }}
          >
            Yash<br />
            <span className="text-[--brass] text-glow italic">Jani.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="font-mono-label text-base text-[--text-lo] flex items-center gap-2 mt-7 mb-7"
          >
            <span className="text-[--brass] text-base">role /</span>
            <TypeAnimation
              sequence={[
                "Full Stack Developer", 1700,
                "MERN Stack Developer", 1700,
              ]}
              speed={60}
              repeat={Infinity}
              className="text-[--text-hi]"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-[--text-lo] leading-relaxed mb-10 text-[17px] max-w-lg"
          >
            Building modern web products, scalable systems, and intelligent digital
            experiences with <span className="text-[--text-hi] font-medium">React</span>,{" "}
            <span className="text-[--text-hi] font-medium">Node.js</span>, and production-grade
            backend architecture.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62, duration: 0.6 }}
            className="flex flex-wrap gap-4 mb-14"
          >
            <a
              href="#projects"
              data-cursor="hover"
              onClick={(e) => { e.preventDefault(); document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }); }}
              className="group relative px-8 py-4 font-mono-label text-[13px] tracking-[0.15em] uppercase text-[--on-accent] bg-[--brass] flex items-center gap-3 cursor-pointer"
            >
              Explore Projects
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="/Resume.pdf"
              download="Yash_Jani_Resume.pdf"
              data-cursor="hover"
              className="relative px-8 py-4 font-mono-label text-[13px] tracking-[0.15em] uppercase text-[--text-hi] bg-[--surface] border border-[--hair] hover:border-[--brass] hover:text-[--brass] transition-colors flex items-center gap-3 cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v8M3 9l4 4 4-4M1 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download CV
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-wrap gap-x-8 gap-y-3 font-mono-label text-[11px] text-[--text-lo] uppercase tracking-[0.14em] border-t border-[--hair] pt-6 max-w-lg"
          >
            <span>STACK <span className="text-[--brass]">MERN</span></span>
            <span>SHIPPED <span className="text-[--brass]">05 PROJECTS</span></span>
            <span>TOP 32 <span className="text-[--brass]">NATIONAL HACKATHON</span></span>
          </motion.div>
        </div>

        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 md:order-2 mx-auto md:ml-auto md:mr-0 w-full max-w-[380px] sm:max-w-[480px] md:max-w-[560px]"
        >
          <CinematicPortrait />
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-[--text-lo] text-[11px] font-mono-label tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-[--brass] to-transparent"
          style={{ animation: reduced ? "none" : "float 1.6s ease-in-out infinite" }} />
      </div>
    </section>
  );
}