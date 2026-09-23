import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HudCorners from "./HudCorners";

/* ── command registry ─────────────────────────────────────────────────── */
const COMMANDS = {
  "yash --help": {
    output: [
      { text: "Available commands:", color: "var(--brass)" },
      { text: "  yash --whoami              who is this guy" },
      { text: "  yash --stack               tech I build with" },
      { text: "  yash --projects            things I've shipped" },
      { text: "  yash --achievements        wins & milestones" },
      { text: "  yash --hobbies             life outside the IDE" },
      { text: "  yash --currently-learning  what's next on the list" },
      { text: "  yash --goals               where I'm headed" },
      { text: "  yash --motto               the philosophy" },
      { text: "  yash --contact             let's work together" },
      { text: "  clear                      reset terminal" },
    ],
  },
  "yash --whoami": {
    output: [
      { text: "Yash Jani", color: "var(--brass)", bold: true },
      { text: "Full Stack Developer — React, Node.js, MongoDB & scalable web apps." },
      { text: "Currently interning @ WebIdeal, building real-world production features." },
      { text: "B.Tech Computer Science @ ITM (SLS) Baroda University, 2023–2027." },
      { text: "Built 5+ full-stack projects and ranked Top 32 nationally." },
      { text: "I don't just write code — I turn ideas into things people can use." },
    ],
  },
  "yash --stack": {
    output: [
      { text: "── Frontend ──────────────────────────────", color: "var(--brass)" },
      { text: "   React.js, JavaScript, Tailwind CSS, HTML/CSS" },
      { text: "── Backend ───────────────────────────────", color: "var(--brass)" },
      { text: "   Node.js, Express.js, REST APIs, JWT Auth" },
      { text: "── Database ──────────────────────────────", color: "var(--brass)" },
      { text: "   MongoDB, MySQL, Mongoose" },
      { text: "── Tools & DevOps ────────────────────────", color: "var(--brass)" },
      { text: "   Git, GitHub, Postman, Vite, VS Code" },
      { text: "── Currently learning ────────────────────", color: "var(--brass)" },
      { text: "   TypeScript, Docker, AI/ML integrations" },
    ],
  },
  "yash --projects": {
      output: [
        { text: "[ 5 projects built ]", color: "var(--brass)" },
        { text: "  01 · SaaS Platform         — subscription SaaS, auth & dashboards" },
        { text: "  02 · KARM Services         — booking platform, service management" },
        { text: "  03 · Mithai-Ghar           — e-commerce storefront" },
        { text: "  04 · Artify Gallery        — art gallery management web app" },
        { text: "  05 · GolfCharity Platform  — SaaS with Stripe billing" },
        { text: "" },
        { text: " → see all at github.com/janiyash", color: "var(--brass)" },
      ],
  },
  "yash --achievements": {
    output: [
      { text: "[ HIGHLIGHTS ]", color: "var(--brass)" },
      { text: "   • Top 32 — iDEA 2.0 National Hackathon" },
      { text: "   • Full Stack Developer Intern @ WebIdeal" },
      { text: "   • Built 5+ full-stack applications" },
      { text: "   • B.Tech CSE — ITM (SLS) Baroda University" },
    ],
  },
  "yash --hobbies": {
    output: [
      { text: "⬡  Weekend ideas → late-night commits." },
      { text: "⬡  Gaming — competitive games & story-driven adventures" },
      { text: "⬡  Soft beats, clean code, and a little peace." },
        ],
  },
  "yash --currently-learning": {
    output: [
      { text: "[ IN PROGRESS ]", color: "var(--brass)" },
      { text: "  → TypeScript — writing safer, maintainable code" },
      { text: "  → Docker — containerising and deploying projects" },
      { text: "  → AI/ML integration — building smarter full-stack apps" },
      { text: "  → System design — learning to design scalable systems" },
    ],
  },
  "yash --goals": {
    output: [
      { text: "[ 2026 → 2027 ROADMAP ]", color: "var(--brass)" },
      { text: "  ✦  Land a full-time SDE role at a product company" },
      { text: "  ✦  Build and launch a SaaS product with real users" },
      { text: "  ✦  Master TypeScript + system design fundamentals" },
      { text: "  ✦  Contribute to meaningful open-source projects" },
      { text: "  ✦  Graduate with strong practical engineering experience" },
    ],
  },
  "yash --motto": {
    output: [
      { text: '"Build it. Break it. Understand it. Improve it."', color: "var(--text-hi)" },
      { text: "Curiosity gets it started. Consistency gets it finished.", color: "var(--brass)" },
    ],
  },
  "yash --contact": {
    output: [
      { text: "Let's build something together.", color: "var(--brass)" },
      { text: "  Email    →  janiyash0911@gmail.com" },
      { text: "  GitHub   →  github.com/janiyash" },
      { text: "  LinkedIn →  linkedin.com/in/jani-yash001/" },
    ],
  },
};

const SUGGESTIONS = [
  "--whoami",
  "--stack",
  "--projects",
  "--achievements",
  "--hobbies",
  "--currently-learning",
  "--goals",
  "--motto",
  "--contact",
];

const BOOT_LINES = [
  { text: "yash_os v2.0 — interactive bio shell", color: "var(--brass)" },
  { text: 'type "yash --help" or click a command below to begin.' },
];

const TYPING_SPEED = 32;

/* ── typewriter hook ──────────────────────────────────────────────────── */
function useOutputReveal(lines) {
  const [revealed, setRevealed] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    setRevealed([]);
    if (!lines || lines.length === 0) return;
    let i = 0;
    const tick = () => {
      i++;
      setRevealed(lines.slice(0, i));
      if (i < lines.length) timerRef.current = setTimeout(tick, 90);
    };
    timerRef.current = setTimeout(tick, 80);
    return () => clearTimeout(timerRef.current);
  }, [lines]);

  return revealed;
}

/* ── single history entry ─────────────────────────────────────────────── */
function HistoryEntry({ entry }) {
  const revealed = useOutputReveal(entry.output);
  return (
    <div style={{ marginBottom: "1rem" }}>
      <p>
        <span style={{ color: "var(--brass)", userSelect: "none" }}>❯ </span>
        <span style={{ color: "var(--text-hi)" }}>{entry.cmd}</span>
      </p>
      {revealed.map((line, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            color: line.color || "var(--text-lo)",
            paddingLeft: "1rem",
            fontWeight: line.bold ? 600 : 400,
            lineHeight: 1.75,
          }}
        >
          {line.text}
        </motion.p>
      ))}
    </div>
  );
}

/* ── main component ───────────────────────────────────────────────────── */
export default function TerminalBio() {
  const [history, setHistory]           = useState([]);
  const [inputVal, setInputVal]         = useState("");
  const [isTyping, setIsTyping]         = useState(false);
  const [typingText, setTypingText]     = useState("");
  const [blink, setBlink]               = useState(true);
  const [inputFocused, setInputFocused] = useState(false);

  const scrollRef   = useRef(null);
  const inputRef    = useRef(null);
  const typingTimer = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setBlink((b) => !b), 530);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history, typingText]);

  const runCommand = useCallback((raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    if (cmd === "clear") { setHistory([]); return; }
    const full = COMMANDS[cmd] ? cmd : COMMANDS[`yash ${cmd}`] ? `yash ${cmd}` : null;
    const result = full ? COMMANDS[full] : null;
    setHistory((prev) => [
      ...prev,
      {
        cmd: full || cmd,
        output: result
          ? result.output
          : [{ text: `command not found: ${cmd}. Try "yash --help".`, color: "#e06c75" }],
      },
    ]);
  }, []);

  const handleKey = (e) => {
    if (e.key === "Enter") {
      const val = inputVal.trim();
      setInputVal("");
      if (val) runCommand(val);
    }
  };

  const handleChipClick = (flag) => {
    if (isTyping) return;
    const full = `yash ${flag}`;
    setIsTyping(true);
    setTypingText("");
    let i = 0;
    const tick = () => {
      i++;
      setTypingText(full.slice(0, i));
      if (i < full.length) {
        typingTimer.current = setTimeout(tick, TYPING_SPEED);
      } else {
        typingTimer.current = setTimeout(() => {
          setIsTyping(false);
          setTypingText("");
          runCommand(full);
        }, 280);
      }
    };
    typingTimer.current = setTimeout(tick, 60);
  };

  const focusInput = () => inputRef.current?.focus();
  const displayInput = isTyping ? typingText : inputVal;
  const showCursor   = inputFocused || isTyping;

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative w-full"
    >
      <div
        className="relative border border-[--hair] overflow-hidden"
        style={{ background: "var(--surface)" }}
        onClick={focusInput}
      >
        <HudCorners />

        {/* title bar */}
        <div
          className="flex items-center gap-3 px-4 py-3 border-b border-[--hair] select-none"
          style={{ background: "rgba(255,255,255,0.025)" }}
        >
          <span className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FFBD2E" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28C840" }} />
          </span>
          <span className="font-mono-label text-[10px] tracking-[0.2em] uppercase mx-auto" style={{ color: "var(--text-lo)" }}>
            root@yash:~/profile
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--brass)", boxShadow: "0 0 4px 1px rgba(var(--brass-rgb),0.5)", animation: "pulse 2s infinite" }} />
            <span className="font-mono-label text-[9px] tracking-widest" style={{ color: "var(--brass)" }}>INTERACTIVE</span>
          </span>
        </div>

        {/* terminal body */}
        <div
          ref={scrollRef}
          className="px-5 py-4 font-mono-label text-xs overflow-y-auto"
          style={{ minHeight: 320, maxHeight: 380, lineHeight: "1.75", scrollbarWidth: "none", cursor: "text" }}
        >
          {BOOT_LINES.map((line, i) => (
            <p key={i} style={{ color: line.color || "var(--text-lo)", marginBottom: i === BOOT_LINES.length - 1 ? "0.75rem" : 0 }}>
              {line.text}
            </p>
          ))}
          <div style={{ borderTop: "1px solid var(--hair)", marginBottom: "0.75rem" }} />

          <AnimatePresence initial={false}>
            {history.map((entry, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                <HistoryEntry entry={entry} />
              </motion.div>
            ))}
          </AnimatePresence>

          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ color: "var(--brass)", userSelect: "none", marginRight: 6 }}>❯</span>
            <span style={{ color: "var(--text-hi)", minWidth: 4 }}>{displayInput}</span>
            <span style={{
              display: "inline-block", width: 7, height: 13,
              background: (showCursor ? blink : false) ? "var(--brass)" : "transparent",
              verticalAlign: "text-bottom", marginLeft: 1, transition: "background 0.08s",
            }} />
          </div>

          <input
            ref={inputRef}
            value={inputVal}
            onChange={(e) => !isTyping && setInputVal(e.target.value)}
            onKeyDown={handleKey}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            style={{ position: "absolute", opacity: 0, width: 1, height: 1, pointerEvents: isTyping ? "none" : "auto" }}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {/* command chips */}
        <div className="px-4 py-3 border-t border-[--hair] flex flex-wrap gap-2" style={{ background: "rgba(255,255,255,0.015)" }}>
          <span className="font-mono-label text-[9px] tracking-widest uppercase self-center" style={{ color: "var(--dim-text-faint)", marginRight: 2 }}>run:</span>
          {SUGGESTIONS.map((flag) => (
            <button
              key={flag}
              onClick={(e) => { e.stopPropagation(); handleChipClick(flag); }}
              disabled={isTyping}
              className="font-mono-label text-[9px] tracking-[0.1em] px-2.5 py-1 border transition-all"
              style={{
                background: "transparent",
                borderColor: isTyping ? "var(--dim-border-faint)" : "var(--dim-border)",
                color: isTyping ? "var(--dim-text-faint)" : "var(--dim-text)",
                cursor: isTyping ? "default" : "pointer",
                transition: "border-color 0.2s, color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!isTyping) {
                  e.currentTarget.style.borderColor = "var(--brass)";
                  e.currentTarget.style.color = "var(--brass)";
                  e.currentTarget.style.background = "rgba(var(--brass-rgb),0.07)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--dim-border)";
                e.currentTarget.style.color = "var(--dim-text)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {flag}
            </button>
          ))}
          <button
            onClick={(e) => { e.stopPropagation(); setHistory([]); }}
            className="font-mono-label text-[9px] tracking-[0.1em] px-2.5 py-1 border ml-auto"
            style={{ background: "transparent", borderColor: "var(--dim-border-faint)", color: "var(--dim-text-faint)", cursor: "pointer", transition: "border-color 0.2s, color 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e06c75"; e.currentTarget.style.color = "#e06c75"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--dim-border-faint)"; e.currentTarget.style.color = "var(--dim-text-faint)"; }}
          >
            clear
          </button>
        </div>

        {/* status bar */}
        <div
          className="flex items-center justify-between px-4 py-1.5 border-t border-[--hair] font-mono-label text-[9px] tracking-widest uppercase select-none"
          style={{ color: "var(--text-lo)", background: "rgba(0,0,0,0.15)" }}
        >
          <span>bash — 80×24</span>
          <span style={{ color: "var(--brass)" }}>UTF-8</span>
          <span>yash@dev</span>
        </div>
      </div>
    </motion.div>
  );
}