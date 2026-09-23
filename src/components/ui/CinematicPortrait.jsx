/**
 * CinematicPortrait — cursor-torch reveal
 *
 * • No delay — reveal tracks cursor instantly from the first pixel
 * • Small-to-medium reveal radius (not full image)  
 * • Smooth CSS transition on the mask itself
 * • Both images on identical 560×560 canvas, heads perfectly aligned
 * • Zero tilt / rotateX / rotateY
 */

import { useRef, useState, useCallback, useEffect } from "react";
import heroCutout      from "../../assets/photo1.png";
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
  const reduced = useReducedMotion();
  const wrapRef = useRef(null);

  /* cursor as CSS % strings — updated on every rAF flush */
  const [cx, setCx] = useState("50%");
  const [cy, setCy] = useState("35%");
  const pendingCursor = useRef(null);
  const rafCursor     = useRef(null);

  /* hovered controls whether the panther layer is visible */
  const [hovered, setHovered] = useState(false);

  /* mobile: tap-toggle */
  const [isMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(hover:none)").matches
  );
  const [tapped, setTapped] = useState(false);

  /* track mouse — update cursor position immediately via rAF */
  const onMove = useCallback((e) => {
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    const nx = Math.max(0, Math.min(1, (e.clientX - r.left)  / r.width));
    const ny = Math.max(0, Math.min(1, (e.clientY - r.top)   / r.height));
    pendingCursor.current = { nx, ny };
    if (!rafCursor.current) {
      rafCursor.current = requestAnimationFrame(() => {
        const { nx: x, ny: y } = pendingCursor.current;
        setCx(`${(x * 100).toFixed(2)}%`);
        setCy(`${(y * 100).toFixed(2)}%`);
        rafCursor.current = null;
      });
    }
  }, []);

  const onEnter = useCallback(() => setHovered(true),  []);
  const onLeave = useCallback(() => setHovered(false), []);

  const onTap = useCallback(() => {
    if (!isMobile) return;
    setTapped(v => !v);
    setHovered(v => !v);
  }, [isMobile]);

  useEffect(() => () => {
    if (rafCursor.current) cancelAnimationFrame(rafCursor.current);
  }, []);

  /* ─── reveal mask ──────────────────────────────────────────
   *
   * The panther sits on top of the portrait (z-index above).
   * Its CSS mask-image is a radial gradient centred on the cursor:
   *   inside radius  → black  (panther visible)
   *   feather zone   → fade
   *   outside        → transparent (portrait shows through)
   *
   * Radius when hovered:  38% (contained spotlight, not full bleed)
   * Radius when not:       0% (panther invisible)
   *
   * The CSS transition on mask-image itself handles the smooth
   * in/out — NO JavaScript animation loop needed for the reveal.
   * Cursor tracking is instant (no easing on position).
   * Reveal on hover-enter / leave uses CSS transition: 0.55s ease.
   */
  const R_IN  = hovered ? 32 : 0;   // inner solid radius %
  const R_OUT = hovered ? 52 : 0;   // outer feather radius %

  // For reduced motion: simple opacity swap
  const pantherStyle = reduced
    ? {
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.3s ease",
      }
    : {
        WebkitMaskImage: `radial-gradient(ellipse ${R_OUT}% ${R_OUT}% at ${cx} ${cy}, black ${R_IN}%, transparent ${R_OUT}%)`,
        maskImage:        `radial-gradient(ellipse ${R_OUT}% ${R_OUT}% at ${cx} ${cy}, black ${R_IN}%, transparent ${R_OUT}%)`,
        // transition ONLY on mask-size (the % values), NOT position — position tracks instantly
        transition: "mask-image 0.50s ease, -webkit-mask-image 0.50s ease",
        willChange: "mask-image",
      };

  /* gold edge ring at cursor — follows instantly, fades in/out with hover */
  const ringSize = 46; // px — fixed pixel ring, looks crisp

  return (
    <div
      ref={wrapRef}
      className={`relative select-none -mt-20 ${className}`}
      onPointerEnter={!isMobile ? onEnter : undefined}
      onPointerLeave={!isMobile ? onLeave : undefined}
      onMouseMove={!isMobile ? onMove : undefined}
      onClick={isMobile ? onTap : undefined}
      style={{ cursor: "none" }}
    >
      {/* ── ambient base glow ── */}
      <div
        aria-hidden="true"
        className="absolute inset-x-8 -bottom-6 top-16 -z-10 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 85%, rgba(217,154,78,${hovered ? 0.28 : 0.07}) 0%, transparent 65%)`,
          filter: "blur(30px)",
          transition: "background 0.6s ease",
        }}
      />

      {/* ── image stack — both 560×560, heads aligned ── */}
      <div className="relative" style={{ isolation: "isolate" }}>

        {/* LAYER 1 — Portrait (always visible) */}
        <img
          src={heroCutout}
          alt="Yash Jani"
          width="560"
          height="560"
          draggable="false"
          className="relative z-10 w-full h-auto object-contain block"
          style={{
            filter: `drop-shadow(0 22px 44px rgba(0,0,0,0.80)) drop-shadow(0 0 ${hovered ? 22 : 6}px rgba(217,154,78,${hovered ? 0.22 : 0.06}))`,
            transition: "filter 0.5s ease",
          }}
        />

        {/* LAYER 2 — Panther (revealed by cursor mask) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-20 pointer-events-none"
          style={pantherStyle}
        >
          <img
            src={pantherActivated}
            alt=""
            width="560"
            height="560"
            draggable="false"
            className="w-full h-auto object-contain block"
            style={{
              filter: `drop-shadow(0 0 28px rgba(217,154,78,0.55)) drop-shadow(0 22px 44px rgba(0,0,0,0.9))`,
            }}
          />
        </div>

        {/* LAYER 3 — gold ring at cursor edge (desktop only) */}
        {!reduced && !isMobile && hovered && (
          <div
            aria-hidden="true"
            className="absolute z-[35] pointer-events-none rounded-full"
            style={{
              width:  ringSize,
              height: ringSize,
              left: `calc(${cx} - ${ringSize / 2}px)`,
              top:  `calc(${cy} - ${ringSize / 2}px)`,
              border: "1.5px solid rgba(217,154,78,0.70)",
              boxShadow: "0 0 10px 2px rgba(217,154,78,0.25), inset 0 0 8px 1px rgba(217,154,78,0.12)",
              // ring position tracks instantly too
            }}
          />
        )}

        {/* LAYER 4 — particles */}
        {!reduced && <Particles active={hovered} />}

      </div>

      {/* ── corner brackets ── */}
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
              borderColor: `rgba(217,154,78,${hovered ? 0.95 : 0.45})`,
              transition: "border-color 0.4s ease",
            }}
          />
        ))}
      </div>

      {/* ── caption ── */}
      <div className="flex items-center gap-3 mt-2" aria-hidden="true">
        <span className="h-px flex-1 bg-[--hair]" />
        <span
          className="font-mono-label text-[12px] tracking-[0.15em] uppercase whitespace-nowrap"
          style={{
            color: hovered ? "var(--brass)" : "var(--text-lo)",
            transition: "color 0.4s ease",
          }}
        >
          {hovered ? "SYSTEM ACTIVE" : "YASH JANI"}
        </span>
        <span className="h-px flex-1 bg-[--hair]" />
      </div>

      {isMobile && !tapped && (
        <p className="text-center font-mono-label text-[9px] text-[--text-lo] tracking-widest uppercase mt-1 opacity-50">
          TAP TO REVEAL
        </p>
      )}
    </div>
  );
}