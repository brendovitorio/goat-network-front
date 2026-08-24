import { useEffect, useLayoutEffect, useRef } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/animations/useReducedMotion";
import { useScrollVelocity } from "@/animations/useScrollVelocity";
import { Magnetic } from "@/animations/Magnetic";
import { GOAT_ICON_PATH, GOAT_ICON_VIEWBOX } from "./goat-icon";

const brands = [
  "COMPLEXO",
  "CIDADE ALTA",
  "PAULISTA",
  "BRASIL ROLEPLAY",
  "HYPEX",
  "NEXUS",
  "RIVIERA CITY",
];

type Copy = {
  eyebrow: string;
  heroTitlePre: string;
  heroTitlePost: string;
  subtitle: string;
  ctaProducts: string;
  ctaAbout: string;
  runningInProduction: string;
};

const pt: Copy = {
  eyebrow: "Loja oficial Goat Network",
  heroTitlePre: "Recursos pra servidor ",
  heroTitlePost: ", começando pelo Anticheat.",
  subtitle:
    "Pagamento via Stripe, licença liberada na hora e suporte direto no Discord — em qualquer produto do catálogo.",
  ctaProducts: "Ver produtos",
  ctaAbout: "Sobre a Goat Network",
  runningInProduction: "Rodando em produção em",
};

const en: Copy = {
  eyebrow: "Official Goat Network store",
  heroTitlePre: "Resources for your ",
  heroTitlePost: " server, starting with Anticheat.",
  subtitle:
    "Payment via Stripe, license unlocked instantly, and direct support on Discord — on every product in the catalog.",
  ctaProducts: "View products",
  ctaAbout: "About Goat Network",
  runningInProduction: "Running in production on",
};

export function Hero() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  const reduced = usePrefersReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const bgLogoWrapRef = useRef<HTMLDivElement>(null);
  const bgLogoScaleRef = useRef<HTMLDivElement>(null);
  const bgLogoImgRef = useRef<SVGSVGElement>(null);
  const bgLogoPathRef = useRef<SVGPathElement>(null);
  const contentOuterRef = useRef<HTMLDivElement>(null);
  const contentInnerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const statusRowRef = useRef<HTMLDivElement>(null);
  const marqueeSkewRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);

  // Entrance: eyebrow -> heading -> subtitle -> buttons -> status, as one cinematic beat.
  useLayoutEffect(() => {
    const els = [
      eyebrowRef.current,
      headingRef.current,
      subtitleRef.current,
      buttonsRef.current,
      statusRowRef.current,
    ];
    if (els.some((el) => !el) || reduced) return;

    const ctx = gsap.context(() => {
      gsap.set(eyebrowRef.current, { opacity: 0, y: 10, filter: "blur(4px)" });
      gsap.set(headingRef.current, {
        opacity: 0,
        y: 26,
        filter: "blur(10px)",
        clipPath: "inset(0% 0% 100% 0%)",
      });
      gsap.set(subtitleRef.current, { opacity: 0, y: 18, filter: "blur(4px)" });
      gsap.set(buttonsRef.current, { opacity: 0, y: 16, scale: 0.98 });
      gsap.set(statusRowRef.current, { opacity: 0, y: 12 });

      gsap
        .timeline({ defaults: { ease: "power3.out" }, delay: 0.15 })
        .to(eyebrowRef.current, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6 })
        .to(
          headingRef.current,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.9,
            ease: "power4.out",
          },
          "-=0.35",
        )
        .to(subtitleRef.current, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7 }, "-=0.5")
        .to(buttonsRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.6 }, "-=0.4")
        .to(statusRowRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  // Background goat mark: traces itself in as a thin line, then settles into the
  // faint filled watermark used for the rest of the visit.
  useLayoutEffect(() => {
    const path = bgLogoPathRef.current;
    const wrap = bgLogoWrapRef.current;
    if (!path || !wrap || reduced) return;

    const length = path.getTotalLength();

    const ctx = gsap.context(() => {
      gsap.set(wrap, { opacity: 0 });
      gsap.set(path, {
        fill: "transparent",
        stroke: "currentColor",
        strokeWidth: 3,
        strokeDasharray: length,
        strokeDashoffset: length,
      });

      gsap
        .timeline({ delay: 0.1 })
        .to(wrap, { opacity: 0.18, duration: 0.6, ease: "power2.out" }, 0)
        .to(path, { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut" }, 0)
        .to(path, { fill: "currentColor", duration: 0.8, ease: "power2.out" }, 1.9)
        .to(wrap, { opacity: 0.035, duration: 1, ease: "power2.out" }, 2.1)
        .set(path, { stroke: "none" });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  // Scroll-driven exit: content lifts & fades, background logo grows, as the page moves into Pricing.
  useEffect(() => {
    if (reduced) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const tween = gsap
        .timeline()
        .to(
          contentOuterRef.current,
          { yPercent: -16, opacity: 0, filter: "blur(6px)", ease: "none" },
          0,
        )
        .to(bgLogoWrapRef.current, { opacity: 0.05, ease: "none" }, 0)
        .to(bgLogoScaleRef.current, { scale: 1.16, ease: "none" }, 0)
        .to(glowRef.current, { opacity: 0.06, ease: "none" }, 0)
        .to(statusRowRef.current, { opacity: 0, yPercent: -10, ease: "none" }, 0.1);

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
        animation: tween,
      });

      return () => st.kill();
    });
    return () => mm.revert();
  }, [reduced]);

  // Cursor parallax: background logo, content and glow drift a few px toward the pointer.
  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return;

    const layers = (
      [
        { el: bgLogoImgRef.current as HTMLElement | null, max: 10 },
        { el: contentInnerRef.current as HTMLElement | null, max: 5 },
        { el: glowRef.current as HTMLElement | null, max: 15 },
      ] satisfies { el: HTMLElement | null; max: number }[]
    ).filter((l): l is { el: HTMLElement; max: number } => l.el !== null);
    if (layers.length === 0) return;

    const target = { x: 0, y: 0 };
    const current = layers.map(() => ({ x: 0, y: 0 }));

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX / window.innerWidth - 0.5;
      target.y = e.clientY / window.innerHeight - 0.5;
    };
    const onTick = () => {
      layers.forEach((layer, i) => {
        const cur = current[i];
        cur.x += (target.x * layer.max * 2 - cur.x) * 0.06;
        cur.y += (target.y * layer.max * 2 - cur.y) * 0.06;
        layer.el.style.transform = `translate3d(${cur.x.toFixed(2)}px, ${cur.y.toFixed(2)}px, 0)`;
      });
    };

    window.addEventListener("mousemove", onMove);
    gsap.ticker.add(onTick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      gsap.ticker.remove(onTick);
      layers.forEach((layer) => {
        layer.el.style.transform = "";
      });
    };
  }, [reduced]);

  // Marquee: continuous GSAP loop, sped up and skewed slightly with scroll velocity.
  useEffect(() => {
    const track = marqueeInnerRef.current;
    if (!track) return;
    if (reduced) {
      gsap.set(track, { x: 0 });
      return;
    }
    const distance = track.scrollWidth / 2;
    const tween = gsap.to(track, { x: -distance, duration: 34, ease: "none", repeat: -1 });
    return () => {
      tween.kill();
    };
  }, [reduced, lang]);

  const skewCurrent = useRef(0);
  useScrollVelocity((velocity) => {
    if (!marqueeSkewRef.current) return;
    const targetSkew = gsap.utils.clamp(-8, 8, velocity * -0.6);
    skewCurrent.current += (targetSkew - skewCurrent.current) * 0.12;
    marqueeSkewRef.current.style.transform = `skewX(${skewCurrent.current.toFixed(2)}deg)`;
  }, !reduced);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-b border-hairline lg:flex lg:min-h-[132vh] lg:flex-col lg:justify-between"
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[320px] glow-top opacity-25"
      />
      <div
        ref={bgLogoWrapRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid place-items-center opacity-[0.02] select-none"
      >
        <div ref={bgLogoScaleRef} className="w-[900px] max-w-none">
          <svg
            ref={bgLogoImgRef}
            viewBox={GOAT_ICON_VIEWBOX}
            className="h-auto w-full text-foreground"
          >
            <path ref={bgLogoPathRef} d={GOAT_ICON_PATH} fill="currentColor" />
          </svg>
        </div>
      </div>

      <div className="rails mx-auto w-full max-w-[1200px] px-5">
        <div ref={contentOuterRef} className="pt-24 pb-20 text-center">
          <div ref={contentInnerRef}>
            <span ref={eyebrowRef} className="eyebrow justify-center">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
              </span>
              {t.eyebrow}
            </span>
            <h1
              ref={headingRef}
              className="mx-auto mt-5 max-w-[720px] text-[40px] leading-[1.06] font-semibold tracking-[-0.02em] text-balance sm:text-[54px]"
            >
              {t.heroTitlePre}
              <span className="text-gold">FiveM</span>
              {t.heroTitlePost}
            </h1>
            <p
              ref={subtitleRef}
              className="mx-auto mt-5 max-w-[500px] text-[14.5px] leading-[1.6] text-muted-foreground"
            >
              {t.subtitle}
            </p>
            <div
              ref={buttonsRef}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Magnetic max={5}>
                <a
                  href="/products"
                  className="rounded-lg bg-primary px-6 py-3 text-[13.5px] font-semibold text-primary-foreground shadow-[0_0_0_1px_oklch(0.94_0.012_240/0.4)] transition-transform hover:scale-[1.02]"
                >
                  {t.ctaProducts}
                </a>
              </Magnetic>
              <a
                href="/empresa"
                className="rounded-lg border border-hairline px-6 py-3 text-[13.5px] font-medium text-foreground/85 transition-colors hover:border-gold/40 hover:text-foreground"
              >
                {t.ctaAbout}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div ref={statusRowRef} className="border-t border-hairline">
        <div className="rails mx-auto flex w-full max-w-[1200px] flex-col gap-3 px-5 py-7 md:flex-row md:items-center md:gap-8">
          <p className="shrink-0 font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
            {t.runningInProduction}
          </p>
          <div className="relative min-w-0 flex-1 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent" />
            <div ref={marqueeSkewRef} className="will-change-transform">
              <div ref={marqueeInnerRef} className="flex w-max items-center gap-10">
                {[...brands, ...brands].map((b, i) => (
                  <span
                    key={i}
                    className="text-[13.5px] font-medium tracking-tight text-muted-foreground/70"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
