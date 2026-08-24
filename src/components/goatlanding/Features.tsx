import { useEffect, useRef, useState } from "react";
import { ShieldCheck, Zap, KeyRound, MessagesSquare } from "lucide-react";
import { FadeUp, FadeStagger } from "./animations";
import { useLanguage } from "@/i18n/LanguageContext";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/animations/useReducedMotion";
import { cn } from "@/lib/utils";
import logo from "@/assets/goat2.png";

const ICONS = [ShieldCheck, Zap, KeyRound, MessagesSquare];

type Pillar = { title: string; body: string };

type Copy = {
  heading: string;
  pillars: [Pillar, Pillar, Pillar, Pillar];
};

const pt: Copy = {
  heading: "Cada produto do catálogo, com o mesmo padrão.",
  pillars: [
    {
      title: "Pagamento 100% seguro",
      body: "Todo checkout é processado pela Stripe. A Goat Network nunca vê nem guarda os dados do seu cartão.",
    },
    {
      title: "Acesso liberado na hora",
      body: "Pagamento aprovado, produto liberado — licença ativa ou arquivo disponível pra download, sem espera.",
    },
    {
      title: "Licença única por compra",
      body: "Cada compra gera uma licença própria, vinculada à sua conta. Nada de chave compartilhada entre clientes.",
    },
    {
      title: "Suporte direto no Discord",
      body: "Dúvida, problema ou sugestão: nossa equipe responde no Discord — não em um formulário genérico.",
    },
  ],
};

const en: Copy = {
  heading: "Every product in the catalog, held to the same standard.",
  pillars: [
    {
      title: "100% secure payment",
      body: "Every checkout is processed by Stripe. Goat Network never sees or stores your card details.",
    },
    {
      title: "Instant access",
      body: "Payment approved, product unlocked — an active license or a downloadable file, no waiting.",
    },
    {
      title: "One license per purchase",
      body: "Each purchase generates its own license, tied to your account. No shared keys between customers.",
    },
    {
      title: "Direct support on Discord",
      body: "Question, issue, or suggestion: our team responds on Discord — not through some generic form.",
    },
  ],
};

const STEP_NUMBERS = ["01", "02", "03", "04"];

function PaymentVisual({ active }: { active: boolean }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="grid h-16 w-16 place-items-center rounded-2xl border border-hairline bg-surface">
        <img src={logo} alt="" className="h-5 w-auto invert opacity-90" />
      </div>
      <div className="relative h-14 w-[2px] bg-hairline">
        <span
          className={cn(
            "absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-gold",
            active && "animate-[travel-y_1.8s_ease-in-out_infinite]",
          )}
        />
      </div>
      <div
        className={cn(
          "grid h-16 w-16 place-items-center rounded-2xl border border-hairline bg-surface transition-shadow duration-500",
          active && "shadow-[0_0_0_1px_oklch(0.94_0.012_240/0.3)]",
        )}
      >
        <ShieldCheck className="h-6 w-6 text-gold" strokeWidth={1.75} />
      </div>
    </div>
  );
}

function InstantAccessVisual({ active }: { active: boolean }) {
  return (
    <div
      className={cn(
        "grid h-20 w-20 place-items-center rounded-full border border-gold/30 bg-gold/10 transition-transform duration-500",
        active && "scale-105",
      )}
      style={active ? { animation: "pop-ring 0.7s ease-out" } : undefined}
    >
      <Zap
        className={cn(
          "h-8 w-8 text-gold transition-transform duration-500",
          active && "-rotate-6 scale-110",
        )}
        strokeWidth={1.5}
      />
    </div>
  );
}

function LicenseVisual({ active }: { active: boolean }) {
  return (
    <div
      className={cn(
        "grid h-20 w-20 place-items-center rounded-2xl border border-gold/30 bg-gold/10 transition-transform duration-500",
        active && "rotate-3",
      )}
      style={active ? { animation: "pop-ring 0.7s ease-out" } : undefined}
    >
      <KeyRound className="h-8 w-8 text-gold" strokeWidth={1.5} />
    </div>
  );
}

function SupportVisual({ active }: { active: boolean }) {
  return (
    <div className="relative grid h-20 w-20 place-items-center rounded-2xl border border-gold/30 bg-gold/10">
      <MessagesSquare className="h-8 w-8 text-gold" strokeWidth={1.5} />
      {active && (
        <span className="absolute top-2 right-2 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
        </span>
      )}
    </div>
  );
}

const VISUALS = [PaymentVisual, InstantAccessVisual, LicenseVisual, SupportVisual];

function CinematicStage({ pillars }: { pillars: (Pillar & { icon: typeof ShieldCheck })[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const activeStepRef = useRef(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${self.progress})`;
        }
        const idx = Math.min(pillars.length - 1, Math.floor(self.progress * pillars.length));
        if (idx !== activeStepRef.current) {
          activeStepRef.current = idx;
          setActiveStep(idx);
        }
      },
    });

    return () => st.kill();
  }, [pillars.length]);

  return (
    <div
      ref={wrapRef}
      className="relative hidden lg:block"
      style={{ height: `${pillars.length * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden border-t border-hairline">
        <div className="mx-auto grid w-full max-w-[1000px] grid-cols-2 items-center gap-16 px-5">
          <div className="relative flex h-[280px] items-center justify-center">
            {pillars.map((p, i) => {
              const Visual = VISUALS[i];
              return (
                <div
                  key={p.title}
                  className={cn(
                    "absolute inset-0 flex items-center justify-center transition-all duration-500",
                    activeStep === i
                      ? "scale-100 opacity-100"
                      : "pointer-events-none scale-95 opacity-0",
                  )}
                >
                  <Visual active={activeStep === i} />
                </div>
              );
            })}
          </div>

          <div className="relative h-[220px]">
            {pillars.map((p, i) => (
              <div
                key={p.title}
                className={cn(
                  "absolute inset-0 flex flex-col justify-center transition-all duration-500",
                  activeStep === i
                    ? "translate-y-0 opacity-100"
                    : activeStep > i
                      ? "-translate-y-3 opacity-0"
                      : "translate-y-3 opacity-0",
                )}
                style={{ clipPath: activeStep === i ? "inset(0 0 0 0)" : "inset(0 0 100% 0)" }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[12px] tracking-[0.14em] text-gold">
                    {STEP_NUMBERS[i]}
                  </span>
                  <span className="h-px flex-1 max-w-[48px] bg-hairline" />
                  <p.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 text-[26px] font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-3 max-w-[360px] text-[13.5px] leading-[1.6] text-muted-foreground">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute right-0 bottom-10 left-0 mx-auto flex w-full max-w-[1000px] items-center gap-2 px-5">
          {pillars.map((p, i) => (
            <span
              key={p.title}
              className={cn(
                "h-1 flex-1 overflow-hidden rounded-full bg-hairline transition-colors",
                activeStep >= i && "bg-gold/20",
              )}
            >
              <span
                className="block h-full origin-left rounded-full bg-gold transition-transform duration-300"
                style={{
                  transform:
                    activeStep > i ? "scaleX(1)" : activeStep === i ? "scaleX(0.5)" : "scaleX(0)",
                }}
              />
            </span>
          ))}
        </div>
        <div
          ref={progressRef}
          className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gold/50"
        />
      </div>
    </div>
  );
}

export function Features() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  const reduced = usePrefersReducedMotion();
  const pillars = ICONS.map((icon, i) => ({ icon, ...t.pillars[i] }));

  return (
    <section className="border-b border-hairline">
      <div className="rails mx-auto w-full max-w-[1200px]">
        <FadeUp className="px-5 py-16 text-center">
          <h2 className="mx-auto max-w-[520px] text-[30px] leading-[1.12] font-semibold tracking-[-0.02em] text-balance sm:text-[36px]">
            {t.heading}
          </h2>
        </FadeUp>

        {!reduced && <CinematicStage pillars={pillars} />}

        <FadeStagger
          className={cn(
            "grid grid-cols-1 gap-4 border-t border-hairline px-5 py-10 sm:grid-cols-2 md:grid-cols-4",
            !reduced && "lg:hidden",
          )}
        >
          {pillars.map((p, i) => (
            <FadeUp key={p.title} delay={i * 0.05}>
              <div className="h-full rounded-xl border border-hairline bg-surface-2/40 p-6">
                <p.icon className="h-4 w-4 text-gold" strokeWidth={1.75} />
                <h3 className="mt-4 text-[14.5px] font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-[13px] leading-[1.6] text-muted-foreground">{p.body}</p>
              </div>
            </FadeUp>
          ))}
        </FadeStagger>
      </div>
    </section>
  );
}
