import { useEffect, useRef, useState } from "react";

/**
 * HUD "target-lock" cursor
 *  - tiny brass diamond = exact pointer position (always)
 *  - over links/buttons 4 brackets expand from the pointer and lock onto
 *    the element; when you leave they simply fade out (no trailing square)
 *  - data-cursor="xyz" adds a small label tag under the reticle
 *  - over inputs/textareas the native text cursor is used instead
 * Only enabled on devices with a real mouse (hover + fine pointer).
 */
function hasMouse() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

const IDLE = 30; // idle reticle size (px)

export default function CustomCursor() {
  const dotRef = useRef(null);
  const boxRef = useRef(null);
  const tagRef = useRef(null);
  const [enabled] = useState(hasMouse);

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add("custom-cursor-active");

    const mouse = { x: -100, y: -100 };
    // current (animated) box: centre x/y + width/height
    const cur = { x: -100, y: -100, w: IDLE, h: IDLE };
    let target = null; // locked element rect
    let wasLocked = false;
    let raf;

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      document.body.classList.add("cursor-visible");
    };

    const tick = () => {
      const b = boxRef.current;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%) rotate(45deg)`;
      }
      if (target) {
        // re-measure each frame so it stays glued while scrolling / animating
        const r = target.el.getBoundingClientRect();
        const pad = 6;
        const tx = r.left + r.width / 2;
        const ty = r.top + r.height / 2;
        const tw = r.width + pad * 2;
        const th = r.height + pad * 2;
        if (!wasLocked) {
          // lock-on starts from the pointer and expands onto the element
          cur.x = mouse.x; cur.y = mouse.y; cur.w = IDLE; cur.h = IDLE;
          wasLocked = true;
        }
        cur.x += (tx - cur.x) * 0.3;
        cur.y += (ty - cur.y) * 0.3;
        cur.w += (tw - cur.w) * 0.25;
        cur.h += (th - cur.h) * 0.25;
      } else {
        wasLocked = false; // on release the box just fades out where it is
      }
      if (b) {
        b.style.width = cur.w + "px";
        b.style.height = cur.h + "px";
        b.style.transform = `translate(${cur.x}px, ${cur.y}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    const setLabel = (text) => {
      const t = tagRef.current;
      if (!t) return;
      t.textContent = text || "";
      t.classList.toggle("on", !!text);
    };

    const resolve = (el) => {
      if (!(el instanceof Element)) return null;
      if (el.closest("input, textarea, select, [contenteditable='true']")) return { native: true };
      const c = el.closest("[data-cursor]");
      const lock = el.closest("a, button, [role='button'], [data-hover], [data-cursor]");
      if (!lock) return null;
      const label = c ? c.getAttribute("data-cursor") : null;
      return { el: lock, label: label && label !== "hover" ? label : "" };
    };

    const apply = (res) => {
      const b = boxRef.current;
      document.body.classList.toggle("cursor-native", !!(res && res.native));
      if (!res || res.native) {
        target = null;
        b?.classList.remove("locked");
        setLabel("");
        return;
      }
      target = res;
      b?.classList.add("locked");
      setLabel(res.label ? res.label.toUpperCase() : "");
    };

    const onOver = (e) => apply(resolve(e.target));
    const onOut = (e) => {
      if (!e.relatedTarget) {
        document.body.classList.remove("cursor-visible");
        apply(null);
      }
    };
    const onDown = () => { dotRef.current?.classList.add("pressed"); boxRef.current?.classList.add("pressed"); };
    const onUp = () => { dotRef.current?.classList.remove("pressed"); boxRef.current?.classList.remove("pressed"); };
    const onLeaveDoc = () => document.body.classList.remove("cursor-visible");

    window.addEventListener("pointermove", onMove, { passive: true, capture: true });
    window.addEventListener("mousemove", onMove, { passive: true, capture: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeaveDoc);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove, { capture: true });
      window.removeEventListener("mousemove", onMove, { capture: true });
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeaveDoc);
      document.body.classList.remove("custom-cursor-active", "cursor-visible", "cursor-native");
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={boxRef} className="cursor-box" aria-hidden="true">
        <i className="c tl" /><i className="c tr" /><i className="c bl" /><i className="c br" />
        <span ref={tagRef} className="cursor-tag" />
      </div>
    </>
  );
}