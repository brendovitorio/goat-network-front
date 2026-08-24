import { useEffect, type RefObject } from "react";
import { gsap } from "./gsap";
import { usePrefersReducedMotion } from "./useReducedMotion";

/**
 * Desktop-only card tilt + mouse-following spotlight. Sets `--spotlight-x/-y`
 * (0-100%) CSS custom properties for a radial-gradient spotlight and applies
 * a small perspective tilt, both driven off refs (no React state, no rerenders).
 */
export function useTilt(ref: RefObject<HTMLElement | null>, maxTilt = 3.5) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const rotateX = gsap.quickTo(el, "rotateX", { duration: 0.4, ease: "power3.out" });
    const rotateY = gsap.quickTo(el, "rotateY", { duration: 0.4, ease: "power3.out" });
    const translateY = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      rotateY(gsap.utils.clamp(-maxTilt, maxTilt, (px - 0.5) * maxTilt * 2));
      rotateX(gsap.utils.clamp(-maxTilt, maxTilt, (0.5 - py) * maxTilt * 2));
      translateY(-2);
      el.style.setProperty("--spotlight-x", `${px * 100}%`);
      el.style.setProperty("--spotlight-y", `${py * 100}%`);
      el.style.setProperty("--spotlight-opacity", "1");
    };
    const onLeave = () => {
      rotateX(0);
      rotateY(0);
      translateY(0);
      el.style.setProperty("--spotlight-opacity", "0");
    };

    (el.style as CSSStyleDeclaration & { transformPerspective: string }).transformPerspective =
      "800px";
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsap.set(el, { rotateX: 0, rotateY: 0, y: 0 });
    };
  }, [ref, reduced, maxTilt]);
}
