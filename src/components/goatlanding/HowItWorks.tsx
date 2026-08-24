import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Check, CreditCard } from "lucide-react";
import { FadeUp } from "./animations";
import logo from "@/assets/goat2.png";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

type StepCopy = { n: string; title: string; body: string };
type ChecklistRow = { label: string; status: string };

type Copy = {
  heading: string;
  steps: [StepCopy, StepCopy, StepCopy];
  checklistRows: [ChecklistRow, ChecklistRow, ChecklistRow, ChecklistRow];
  pending: string;
  customerPanel: string;
};

const pt: Copy = {
  heading: "Do clique no produto até a licença ativa.",
  steps: [
    {
      n: "Passo 1",
      title: "Escolha o produto",
      body: "Veja o catálogo da Goat Network e escolha o produto e o plano que fazem sentido pra sua operação — mensal, recorrente ou pagamento único.",
    },
    {
      n: "Passo 2",
      title: "Pague com segurança",
      body: "Checkout processado pela Stripe. A Goat Network nunca vê nem guarda os dados do seu cartão — e cupons de desconto são aceitos direto ali.",
    },
    {
      n: "Passo 3",
      title: "Acesso liberado na hora",
      body: "Assim que o pagamento é aprovado: licença ativa ou arquivo pra download, na hora. Gerencie tudo pelo seu painel, a qualquer momento.",
    },
  ],
  checklistRows: [
    { label: "Pagamento", status: "Confirmado" },
    { label: "Licença", status: "Gerada" },
    { label: "Webhook Discord", status: "Notificado" },
    { label: "Painel do cliente", status: "Liberado" },
  ],
  pending: "pendente",
  customerPanel: "Painel do cliente",
};

const en: Copy = {
  heading: "From clicking a product to an active license.",
  steps: [
    {
      n: "Step 1",
      title: "Choose the product",
      body: "Browse the Goat Network catalog and pick the product and plan that fit your operation — monthly, recurring, or one-time payment.",
    },
    {
      n: "Step 2",
      title: "Pay securely",
      body: "Checkout processed by Stripe. Goat Network never sees or stores your card details — and discount coupons are accepted right there.",
    },
    {
      n: "Step 3",
      title: "Instant access",
      body: "As soon as payment is approved: an active license or a downloadable file, instantly. Manage everything from your dashboard, anytime.",
    },
  ],
  checklistRows: [
    { label: "Payment", status: "Confirmed" },
    { label: "License", status: "Generated" },
    { label: "Discord Webhook", status: "Notified" },
    { label: "Customer panel", status: "Unlocked" },
  ],
  pending: "pending",
  customerPanel: "Customer panel",
};

export function HowItWorks() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;

  return (
    <section className="border-b border-hairline">
      <div className="rails mx-auto w-full max-w-[1200px]">
        <FadeUp className="px-5 py-16 text-center">
          <h2 className="mx-auto max-w-[540px] text-[30px] leading-[1.12] font-semibold tracking-[-0.02em] text-balance sm:text-[36px]">
            {t.heading}
          </h2>
        </FadeUp>

        <div className="grid border-t border-hairline md:grid-cols-3">
          <FadeUp delay={0}>
            <Step n={t.steps[0].n} title={t.steps[0].title} body={t.steps[0].body}>
              <Orbit />
            </Step>
          </FadeUp>
          <FadeUp delay={0.1}>
            <Step n={t.steps[1].n} title={t.steps[1].title} body={t.steps[1].body} border>
              <Checklist />
            </Step>
          </FadeUp>
          <FadeUp delay={0.2}>
            <Step n={t.steps[2].n} title={t.steps[2].title} body={t.steps[2].body}>
              <Sparkline />
            </Step>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function Step({
  n,
  title,
  body,
  children,
  border,
}: {
  n: string;
  title: string;
  body: string;
  children: React.ReactNode;
  border?: boolean;
}) {
  return (
    <div className={`p-8 ${border ? "border-y border-hairline md:border-x md:border-y-0" : ""}`}>
      <div className="flex h-[230px] items-center justify-center">{children}</div>
      <span className="inline-block rounded bg-foreground/10 px-2 py-1 font-mono text-[10px] tracking-[0.12em] uppercase">
        {n}
      </span>
      <h3 className="mt-4 text-[15px] font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-[13px] leading-[1.6] text-muted-foreground">{body}</p>
    </div>
  );
}

function Orbit() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div
      ref={ref}
      className="relative flex h-[240px] w-full max-w-[240px] items-center justify-between"
    >
      <div className="absolute inset-x-8 top-1/2 flex -translate-y-[26px] flex-col gap-[7px] opacity-20">
        <div className="h-[1px] w-full bg-foreground" />
        <div className="h-[1px] w-full bg-foreground" />
        <div className="h-[1px] w-full bg-foreground" />
      </div>
      <div className="absolute inset-x-8 top-1/2 -translate-y-[26px]">
        {inView && (
          <span className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 animate-[travel-x_2.6s_ease-in-out_infinite] rounded-full bg-gold shadow-[0_0_8px_2px_oklch(0.94_0.012_240/0.5)]" />
        )}
      </div>

      <div className="relative flex flex-col items-center gap-3">
        <div className="relative z-10 flex h-[76px] w-[76px] items-center justify-center rounded-2xl border border-hairline bg-surface shadow-sm">
          <img src={logo} alt="GOAT" className="h-5 w-auto invert object-contain opacity-90" />
        </div>
        <span className="font-mono text-[10px] font-medium tracking-[0.05em] text-muted-foreground uppercase">
          GOAT
        </span>
      </div>

      <div className="relative flex flex-col items-center gap-3">
        <div
          className={cn(
            "relative z-10 flex h-[76px] w-[76px] items-center justify-center rounded-2xl border border-hairline bg-surface shadow-sm transition-shadow duration-700",
            inView && "shadow-[0_0_0_1px_oklch(0.94_0.012_240/0.25)]",
          )}
        >
          <CreditCard className="h-[30px] w-[30px] text-foreground opacity-90" strokeWidth={1.5} />
        </div>
        <span className="font-mono text-[10px] font-medium tracking-[0.05em] text-muted-foreground uppercase">
          Checkout
        </span>
      </div>
    </div>
  );
}

function Checklist() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  const rows = t.checklistRows;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [doneCount, setDoneCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const timeouts = rows.map((_, i) =>
      setTimeout(() => setDoneCount((c) => Math.max(c, i + 1)), 350 + i * 450),
    );
    return () => timeouts.forEach(clearTimeout);
  }, [inView, rows]);

  return (
    <div ref={ref} className="w-full max-w-[280px] space-y-2.5">
      {rows.map((row, i) => {
        const done = i < doneCount;
        return (
          <div
            key={row.label}
            className={cn(
              "flex items-center justify-between rounded-lg border px-3.5 py-2.5 transition-all duration-500",
              done ? "border-hairline bg-surface" : "border-hairline/50 bg-surface/40 opacity-70",
            )}
          >
            <div className="min-w-0">
              <p className="truncate text-[12.5px] font-medium">{row.label}</p>
              <p className="truncate font-mono text-[10.5px] text-muted-foreground">
                {done ? row.status : t.pending}
              </p>
            </div>
            <span
              className={cn(
                "grid h-5 w-5 shrink-0 place-items-center rounded-full transition-all duration-300",
                done ? "scale-100 bg-foreground" : "scale-90 bg-foreground/15",
              )}
            >
              <Check
                className={cn(
                  "h-3 w-3 transition-colors duration-300",
                  done ? "text-background" : "text-transparent",
                )}
                strokeWidth={3}
              />
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Sparkline() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: "-60px" });

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
  }, []);

  useEffect(() => {
    const path = pathRef.current;
    if (!path || !inView) return;
    path.style.transition = "stroke-dashoffset 1.6s cubic-bezier(0.22, 1, 0.36, 1)";
    path.style.strokeDashoffset = "0";
  }, [inView]);

  return (
    <div ref={wrapRef} className="w-full max-w-[260px]">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
        <span className="font-mono text-[10.5px] tracking-[0.05em] text-muted-foreground uppercase">
          {t.customerPanel}
        </span>
      </div>
      <svg viewBox="0 0 240 90" className="mt-6 w-full" fill="none">
        <path
          ref={pathRef}
          d="M0 82 C 30 80, 45 70, 62 52 C 78 34, 92 10, 112 14 C 130 18, 140 52, 156 62 C 168 70, 176 60, 188 44 C 200 28, 214 34, 240 26"
          stroke="var(--foreground)"
          strokeWidth="1.2"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}
