/**
 * CinematicPortrait — cursor-torch reveal
 *
 * Hover over the portrait → a circular spotlight follows your cursor,
 * revealing the Black Panther image underneath.
 * Move cursor → spotlight moves instantly.
 * Leave image → spotlight closes smoothly.
 * Touch → tap to toggle full reveal.
 */

import { useRef, useState, useCallback, useEffect } from "react";
import heroCutout       from "../../assets/photo1.png";
import pantherActivated from "../../assets/pan.png";
import useReducedMotion from "../../hooks/useReducedMotion";

/* ── tiny gold particle canvas ─────────────────────────────── */
function Particles({ active }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const pts       = useRef([]);

  useEffect(() => {
    const el  = canvasRef.current;
    if (!el) return;
    const ctx = el.getContext("2d");

    function tick() {
      const W = el.offsetWidth;
      const H = el.offsetHeight;
      if (el.width !== W || el.height !== H) { el.width = W; el.height = H; }
      ctx.clearRect(0, 0, W, H);

      if (active && pts.current.length < 22 && Math.random() < 0.18) {
        pts.current.push({
          x: W * 0.15 + Math.random() * W * 0.70,
          y: H * 0.10 + Math.random() * H * 0.80,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -(0.25 + Math.random() * 0.65),
          life: 1,
          decay: 0.010 + Math.random() * 0.009,
          r: 0.7 + Math.random() * 1.8,
        });
      }

      pts.current = pts.current.filter(p => p.life > 0);
      for (const p of pts.current) {
        p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        const a = Math.max(0, p.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * a, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(217,154,78,${a * 0.85})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * a * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(217,154,78,${a * 0.08})`;
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-30"
      aria-hidden="true"
    />
  );
}

/* ── MAIN ───────────────────────────────────────────────────── */
export default function CinematicPortrait({ className = "" }) {
  const reduced   = useReducedMotion();
  const wrapRef   = useRef(null);
  const maskRef   = useRef(null);
  const ringRef   = useRef(null);
  const lastType  = useRef("mouse");

  const [mode, setMode]           = useState("off"); // "off" | "hover" | "full"
  const [touchUsed, setTouchUsed] = useState(false);
  const active = mode !== "off";

  /* Write cursor position straight to DOM — no React re-render per frame */
  const place = useCallback((e) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - r.left)  / r.width))  * 100;
    const y = Math.max(0, Math.min(1, (e.clientY - r.top)   / r.height)) * 100;

    const m = maskRef.current;
    if (m) {
      m.style.setProperty("--mx", x.toFixed(2) + "%");
      m.style.setProperty("--my", y.toFixed(2) + "%");
    }
    const ring = ringRef.current;
    if (ring) {
      ring.style.left = `calc(${x}% - 23px)`;
      ring.style.top  = `calc(${y}% - 23px)`;
    }
  }, []);

  const onPointerEnter = (e) => {
    lastType.current = e.pointerType;
    if (e.pointerType !== "mouse") return;
    place(e);
    setMode("hover");
  };
  const onPointerMove  = (e) => {
    if (e.pointerType !== "mouse") return;
    place(e);
  };
  const onPointerLeave = (e) => {
    if (e.pointerType !== "mouse") return;
    setMode("off");
  };
  const onPointerDown  = (e) => { lastType.current = e.pointerType; };

  const onClick = (e) => {
    if (lastType.current === "mouse") return;
    setTouchUsed(true);
    place(e);
    setMode((m) => (m === "full" ? "off" : "full"));
  };

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) setMode((m) => (m === "full" ? "off" : m));
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const maskClass =
    "absolute inset-0 z-20 pointer-events-none " +
    (reduced ? "" : "panther-mask ") +
    (mode === "hover" ? "on-hover" : mode === "full" ? "on-full" : "");

  const reducedStyle = reduced
    ? { opacity: active ? 1 : 0, transition: "opacity 0.3s ease" }
    : undefined;

  return (
    <div
      ref={wrapRef}
      className={`relative select-none ${className}`}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={mode === "full"}
      aria-label="Toggle Black Panther mode"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setMode((m) => (m === "off" ? "full" : "off"));
        }
      }}
      style={{
        cursor: "none",
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        WebkitTouchCallout: "none",
        outline: "none",
      }}
    >
      {/* ambient base glow */}
      <div
        aria-hidden="true"
        className="absolute inset-x-8 -bottom-6 top-16 -z-10 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 85%, rgba(217,154,78,${active ? 0.28 : 0.07}) 0%, transparent 65%)`,
          filter: "blur(30px)",
          transition: "background 0.6s ease",
        }}
      />

      {/*
        Both images share the EXACT same container so their bounding
        boxes overlap pixel-perfectly. The panther layer is absolute
        inset-0 on top of the portrait.
      */}
      <div className="relative" style={{ isolation: "isolate" }}>

        {/* LAYER 1 — Yash portrait (always visible) */}
        <img
          src={heroCutout}
          alt="Yash Jani"
          draggable="false"
          className="relative z-10 w-full h-auto object-contain block"
          style={{
            filter: `drop-shadow(0 22px 44px rgba(0,0,0,0.80)) drop-shadow(0 0 ${active ? 22 : 6}px rgba(217,154,78,${active ? 0.22 : 0.06}))`,
            transition: "filter 0.5s ease",
          }}
        />

        {/* LAYER 2 — Black Panther, revealed by circular mask at cursor */}
        <div
          ref={maskRef}
          aria-hidden="true"
          className={maskClass}
          style={reducedStyle}
        >
          <img
            src={pantherActivated}
            alt=""
            draggable="false"
            className="w-full h-auto object-contain block"
            style={{
              filter: "drop-shadow(0 0 28px rgba(217,154,78,0.55)) drop-shadow(0 22px 44px rgba(0,0,0,0.9))",
            }}
          />
        </div>

        {/* LAYER 3 — gold ring that follows cursor (mouse only) */}
        {!reduced && mode === "hover" && (
          <div
            ref={ringRef}
            aria-hidden="true"
            className="absolute z-[35] pointer-events-none rounded-full"
            style={{
              width: 46,
              height: 46,
              left: "50%",
              top: "35%",
              border: "1.5px solid rgba(217,154,78,0.70)",
              boxShadow: "0 0 10px 2px rgba(217,154,78,0.25), inset 0 0 8px 1px rgba(217,154,78,0.12)",
              transition: "none",
            }}
          />
        )}

        {/* LAYER 4 — floating gold particles */}
        {!reduced && <Particles active={active} />}
      </div>

      {/* corner HUD brackets */}
      <div className="absolute inset-0 pointer-events-none z-40" aria-hidden="true">
        {[
          "top-0 left-0 border-t-2 border-l-2 -translate-x-0.5 -translate-y-0.5",
          "top-0 right-0 border-t-2 border-r-2  translate-x-0.5 -translate-y-0.5",
          "bottom-0 left-0 border-b-2 border-l-2 -translate-x-0.5  translate-y-0.5",
          "bottom-0 right-0 border-b-2 border-r-2  translate-x-0.5  translate-y-0.5",
        ].map((cls, i) => (
          <span
            key={i}
            className={`absolute w-5 h-5 ${cls}`}
            style={{
              borderColor: `rgba(217,154,78,${active ? 0.95 : 0.45})`,
              transition: "border-color 0.4s ease",
            }}
          />
        ))}
      </div>

      {/* caption line */}
      <div className="flex items-center gap-3 mt-2" aria-hidden="true">
        <span className="h-px flex-1 bg-[--hair]" />
        <span
          className="font-mono-label text-[12px] tracking-[0.15em] uppercase whitespace-nowrap"
          style={{ color: active ? "var(--brass)" : "var(--text-lo)", transition: "color 0.4s ease" }}
        >
          {active ? "SYSTEM ACTIVE" : "YASH JANI"}
        </span>
        <span className="h-px flex-1 bg-[--hair]" />
      </div>

      {/* touch-only hint */}
      <p
        className="portrait-hint text-center font-mono-label text-[10px] text-[--brass] tracking-[0.25em] uppercase mt-2"
        style={{ opacity: touchUsed ? 0 : 0.8, transition: "opacity 0.4s ease" }}
      >
        ◆ Tap to activate ◆
      </p>
    </div>
  );
}