import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COMMANDS = [
  { id: "home", label: "Go Home", hint: "/home", action: (nav) => nav("#home") },
  { id: "about", label: "View About", hint: "/about", action: (nav) => nav("#about") },
  { id: "experience", label: "View Experience", hint: "/experience", action: (nav) => nav("#experience") },
  { id: "skills", label: "View Skills", hint: "/skills", action: (nav) => nav("#skills") },
  { id: "projects", label: "View Projects", hint: "/projects", action: (nav) => nav("#projects") },
  { id: "achievements", label: "View Achievements", hint: "/achievements", action: (nav) => nav("#achievements") },
  { id: "contact", label: "Contact Yash", hint: "/contact", action: (nav) => nav("#contact") },
  { id: "github", label: "Open GitHub", hint: "/github", action: () => window.open("https://github.com/janiyash", "_blank") },
  { id: "linkedin", label: "Open LinkedIn", hint: "", action: () => window.open("https://www.linkedin.com/in/jani-yash/", "_blank") },
  { id: "resume", label: "Download Resume", hint: "", action: () => {
      const a = document.createElement("a");
      a.href = "/Resume.pdf";
      a.download = "Yash_Jani_Resume.pdf";
      a.click();
    } },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return COMMANDS;
    const q = query.toLowerCase().replace(/^\//, "");
    return COMMANDS.filter(
      (c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q)
    );
  }, [query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const navigate = useCallback((hash) => {
    const el = document.querySelector(hash);
    el?.scrollIntoView({ behavior: "smooth" });
    close();
  }, [close]);

  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA";

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (!open && e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
        return;
      }
      if (open) {
        if (e.key === "Escape") close();
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setActive((a) => Math.min(a + 1, filtered.length - 1));
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setActive((a) => Math.max(a - 1, 0));
        }
        if (e.key === "Enter" && filtered[active]) {
          filtered[active].action(navigate);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, active, close, navigate]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 z-[100001] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[14vh] px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="hud-panel w-full max-w-lg overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[--hair]">
              <span className="text-[--brass] font-mono-label text-sm">/</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                placeholder="Type a command..."
                className="bg-transparent outline-none text-sm text-[--text-hi] placeholder-[--text-lo] flex-1 font-mono-label"
              />
              <kbd className="text-[10px] text-[--text-lo] border border-[--hair] px-1.5 py-0.5">ESC</kbd>
            </div>
            <div className="max-h-72 overflow-y-auto py-2">
              {filtered.length === 0 && (
                <p className="px-5 py-4 text-sm text-[--text-lo]">No commands found.</p>
              )}
              {filtered.map((cmd, i) => (
                <button
                  key={cmd.id}
                  data-cursor="hover"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => cmd.action(navigate)}
                  className={`w-full flex items-center justify-between px-5 py-2.5 text-sm text-left transition-colors ${
                    active === i ? "bg-[--brass]/10 text-[--text-hi]" : "text-[--text-lo]"
                  }`}
                >
                  <span>{cmd.label}</span>
                  {cmd.hint && <span className="font-mono-label text-[10px] text-[--brass]">{cmd.hint}</span>}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
