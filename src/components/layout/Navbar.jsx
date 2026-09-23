import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { FaSun, FaMoon } from "react-icons/fa";

const links = [
  { id: "home",         label: "Home" },
  { id: "about",        label: "About" },
  { id: "experience",   label: "Experience" },
  { id: "skills",       label: "Skills" },
  { id: "projects",     label: "Projects" },
  { id: "achievements", label: "Achievements" },
  { id: "contact",      label: "Contact" },
];

/* ── Animated sun/moon toggle ── */
function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";

  return (
    <button
      onClick={onToggle}
      aria-label="Toggle color theme"
      className="relative flex items-center gap-0 p-[3px] rounded-full transition-all duration-300 focus:outline-none"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #1a1a14 0%, #2a2516 100%)"
          : "linear-gradient(135deg, #ede8df 0%, #e0d8cc 100%)",
        border: isDark ? "1px solid rgba(180,140,70,0.35)" : "1px solid rgba(180,140,70,0.4)",
        width: 56,
        height: 28,
        boxShadow: isDark
          ? "0 0 12px rgba(180,140,70,0.15), inset 0 1px 2px rgba(0,0,0,0.4)"
          : "inset 0 1px 3px rgba(0,0,0,0.12)",
      }}
    >
      {/* sliding pill */}
      <motion.span
        layout
        animate={{ x: isDark ? 0 : 28 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="relative z-10 w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: "var(--brass)",
          boxShadow: isDark
            ? "0 2px 6px rgba(0,0,0,0.5), 0 0 8px rgba(180,140,70,0.3)"
            : "0 2px 6px rgba(0,0,0,0.2), 0 0 8px rgba(180,140,70,0.3)",
        }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.span
              key="moon"
              initial={{ opacity: 0, rotate: -30, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 30, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className="text-[#1a1408]"
              style={{ fontSize: 11 }}
            >
              <FaMoon />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ opacity: 0, rotate: 30, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -30, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className="text-[#1a1408]"
              style={{ fontSize: 11 }}
            >
              <FaSun />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </button>
  );
}

export default function Navbar() {
  const [open,     setOpen]     = useState(false);
  const [active,   setActive]   = useState("home");
  const [compact,  setCompact]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [theme,    setTheme]    = useState(
    () => (typeof window !== "undefined" && localStorage.getItem("theme")) || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => {
      setCompact(window.scrollY > 40);
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);

      // deterministic active-section detection: find the last section whose
      // top has been scrolled past (offset for the fixed navbar height).
      // Unlike IntersectionObserver, this never has two sections "intersecting"
      // at once — there's exactly one answer at any scroll position.
      const probe = scrollTop + 96;
      let current = links[0].id;
      for (const l of links) {
        const el = document.getElementById(l.id);
        if (el && el.offsetTop <= probe) {
          current = l.id;
        }
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (id) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[9999] border-b transition-[background-color,border-color] duration-200 ${
          compact ? "bg-[--void]/90 backdrop-blur-md border-[--hair]" : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">

          {/* logo */}
          <button
            data-cursor="hover"
            onClick={() => goTo("home")}
            className="font-mono-label text-sm font-bold tracking-widest text-[--text-hi] flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 bg-[--brass]" />
            YJ<span className="text-[--brass]">.DEV</span>
          </button>

          {/* desktop nav links */}
          <div className="hidden lg:flex items-center h-full gap-1">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => goTo(l.id)}
                className="relative h-8 px-4 font-mono-label text-[11px] tracking-[0.12em] uppercase"
              >
                <span className={active === l.id ? "text-[--text-hi] font-bold" : "text-[--text-lo] hover:text-[--text-hi] transition-colors"}>
                  {l.label}
                </span>
                <span
                  className="absolute left-4 right-4 bottom-1.5 h-[2px] bg-[--brass] origin-center pointer-events-none"
                  style={{
                    transform: active === l.id ? "scaleX(1)" : "scaleX(0)",
                    transition: "transform 220ms cubic-bezier(0.4,0,0.2,1)",
                  }}
                />
              </button>
            ))}
          </div>

          {/* right controls */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <button
              data-cursor="hover"
              onClick={() => goTo("contact")}
              className="px-4 py-1.5 font-mono-label text-[11px] tracking-[0.1em] uppercase bg-[--brass] text-[--on-accent] font-bold"
            >
              Hire Me
            </button>
          </div>

          {/* mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden w-9 h-9 border border-[--hair] flex items-center justify-center text-[--text-hi] text-lg"
          >
            {open ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* scroll progress bar */}
        <div className="h-[2px] bg-[--hair]">
          <div
            className="h-full bg-[--brass] transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </nav>

      {/* mobile menu */}
      <div
        className="fixed inset-0 z-[9998] bg-[--void]/98 backdrop-blur-xl flex flex-col items-start justify-center gap-1 px-8 lg:hidden transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
      >
        {links.map((l, i) => (
          <button
            key={l.id}
            onClick={() => goTo(l.id)}
            className="font-display font-black text-4xl text-[--text-hi] flex items-center gap-4 py-2"
            style={{
              transform: open ? "translateX(0)" : "translateX(20px)",
              opacity: open ? 1 : 0,
              transition: `all 0.3s ease ${i * 0.04}s`,
            }}
          >
            <span className="font-mono-label text-xs text-[--brass]">0{i + 1}</span>
            {l.label}
          </button>
        ))}

        {/* theme toggle in mobile menu */}
        <div className="mt-8 flex items-center gap-3">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <span className="font-mono-label text-[10px] tracking-[0.2em] text-[--text-lo] uppercase">
            {theme === "dark" ? "Dark mode" : "Light mode"}
          </span>
        </div>
      </div>
    </>
  );
}