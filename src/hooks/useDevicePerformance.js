import { useState } from "react";

function computeTier() {
  if (typeof window === "undefined") return "high";
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isNarrow = window.innerWidth < 768;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;

  if ((isTouch && isNarrow) || cores <= 4 || mem <= 4) {
    return isTouch && isNarrow ? "low" : "medium";
  }
  return "high";
}

/**
 * Cheap heuristic device-tier detector so heavy scenes can scale down
 * (fewer particles, lower DPR, simplified geometry) on mobile / low-end hardware.
 */
export default function useDevicePerformance() {
  const [tier] = useState(computeTier); // "low" | "medium" | "high"
  return tier;
}
