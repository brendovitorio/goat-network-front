import { cloneElement, isValidElement, useEffect, useRef } from "react";
import type { ReactElement } from "react";
import { gsap } from "./gsap";
import { usePrefersReducedMotion } from "./useReducedMotion";

/**
 * Wraps a single interactive element (button/link) and nudges it toward the
 * cursor on desktop, within `max` px, with an elastic return on leave.
 * No-ops on touch devices and when prefers-reduced-motion is set.
 */
export function Magnetic({
  children,
  strength = 0.35,
  max = 5,
}: {
  children: ReactElement;
  strength?: number;
  max?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      xTo(gsap.utils.clamp(-max, max, relX * strength));
      yTo(gsap.utils.clamp(-max, max, relY * strength));
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [reduced, strength, max]);

  if (!isValidElement(children)) return children;

  return cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      ref.current = node;
    },
  } as { ref: (node: HTMLElement | null) => void });
}
