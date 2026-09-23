import { useEffect, useRef, useState } from "react";

function isFinePointer() {
  return typeof window !== "undefined" && !window.matchMedia("(pointer: coarse)").matches;
}

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled] = useState(isFinePointer);

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add("custom-cursor-active");

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0, raf;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = mouseX + "px";
        dotRef.current.style.top = mouseY + "px";
      }
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.left = ringX + "px";
        ringRef.current.style.top = ringY + "px";
      }
      raf = requestAnimationFrame(animateRing);
    };

    const resolveState = (el) => {
      const cursorAttr = el.closest("[data-cursor]");
      if (cursorAttr) return cursorAttr.getAttribute("data-cursor");
      if (el.closest("a, button, [data-hover]")) return "hover";
      return null;
    };

    // Shape (via class) and text (via textContent) are both set here,
    // imperatively, in the same synchronous handler — never through React
    // state. Mixing a synchronous DOM class change with an async React
    // state update for the same visual element is what previously let the
    // ring's shape and its label text fall out of sync for a frame,
    // showing stale leftover text from whatever was hovered a moment
    // earlier.
    const setRing = (state) => {
      const ring = ringRef.current;
      if (!ring) return;
      if (!state) {
        ring.classList.remove("hovered", "label");
        ring.textContent = "";
        return;
      }
      if (state === "hover") {
        ring.classList.add("hovered");
        ring.classList.remove("label");
        ring.textContent = "";
      } else {
        ring.classList.add("label");
        ring.classList.remove("hovered");
        ring.textContent = state.toUpperCase();
      }
    };

    const onOver = (e) => setRing(resolveState(e.target));

    const onOut = (e) => {
      const next = e.relatedTarget instanceof Element ? e.relatedTarget : document.body;
      if (!resolveState(next)) setRing(null);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    raf = requestAnimationFrame(animateRing);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.body.classList.remove("custom-cursor-active");
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}