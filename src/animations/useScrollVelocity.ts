import { useEffect, useRef } from "react";

type VelocityListener = (velocity: number) => void;

let lastY = 0;
let lastT = 0;
let rafId: number | null = null;
const listeners = new Set<VelocityListener>();

function tick() {
  const y = window.scrollY;
  const t = performance.now();
  const dt = Math.max(t - lastT, 1);
  const velocity = ((y - lastY) / dt) * 16.67;
  lastY = y;
  lastT = t;
  listeners.forEach((fn) => fn(velocity));
  rafId = requestAnimationFrame(tick);
}

function ensureLoop() {
  if (rafId != null || typeof window === "undefined") return;
  lastY = window.scrollY;
  lastT = performance.now();
  rafId = requestAnimationFrame(tick);
}

function maybeStopLoop() {
  if (listeners.size === 0 && rafId != null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

/** Single shared rAF loop that broadcasts scroll velocity (px/frame) to all subscribers. */
export function useScrollVelocity(onVelocity: VelocityListener, enabled = true) {
  const cbRef = useRef(onVelocity);
  cbRef.current = onVelocity;

  useEffect(() => {
    if (!enabled) return;
    const listener: VelocityListener = (v) => cbRef.current(v);
    listeners.add(listener);
    ensureLoop();
    return () => {
      listeners.delete(listener);
      maybeStopLoop();
    };
  }, [enabled]);
}
