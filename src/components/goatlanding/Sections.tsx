import { useEffect, useRef, useState } from "react";
import { Plus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/goat2.png";
import { FadeUp, FadeLeft } from "./animations";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/animations/useReducedMotion";
import { Magnetic } from "@/animations/Magnetic";

const clampAbs = (v: number, max: number) => Math.max(-max, Math.min(max, v));

type FaqCopy = {
  faqs: { q: string; a: string }[];
  heading: string;
  subheading: string;
  stillHaveQuestions: string;
  talkToTeam: string;
  joinDiscord: string;
};

const faqPt: FaqCopy = {
  faqs: [
    {
      q: "Como funciona o pagamento?",
      a: "Todo o checkout é processado pela Stripe, com suporte a cartão e outros métodos. A Goat Network nunca vê nem armazena os dados do seu cartão.",
    },
    {
      q: "Como eu recebo acesso depois de comprar?",
      a: "Depende do produto: recursos com licença (como o Anticheat) geram uma chave vinculada à sua conta na hora. Produtos de download já aparecem na aba Downloads do seu painel assim que o pagamento é aprovado.",
    },
    {
      q: "Os planos são recorrentes ou dá pra comprar uma vez só?",
      a: "Depende do produto e do plano escolhido — alguns são assinaturas (mensal, trimestral) que você cancela quando quiser, outros são pagamento único, sem mensalidade. Cada plano deixa isso claro antes de você finalizar a compra.",
    },
    {
      q: "Preciso de conhecimento técnico pra usar os produtos?",
      a: "Não. Cada produto é feito pra instalar e configurar em minutos, sem precisar mexer no código do seu servidor.",
    },
    {
      q: "Tem suporte se eu tiver algum problema?",
      a: "Sim. Nosso time responde direto no Discord — não é um formulário genérico que demora dias pra responder.",
    },
    {
      q: "Os preços variam entre os produtos?",
      a: "Sim. Cada produto tem seus próprios planos e valores, todos exibidos na página de Produtos antes de você escolher.",
    },
  ],
  heading: "Perguntas frequentes",
  subheading: "Tudo o que costuma aparecer antes de começar.",
  stillHaveQuestions: "Ainda tem dúvidas?",
  talkToTeam: "Fale com o time da Goat Network no Discord.",
  joinDiscord: "Entrar no Discord",
};

const faqEn: FaqCopy = {
  faqs: [
    {
      q: "How does payment work?",
      a: "All checkout is processed through Stripe, with support for cards and other payment methods. Goat Network never sees or stores your card data.",
    },
    {
      q: "How do I get access after buying?",
      a: "It depends on the product: licensed resources (like Anticheat) generate a key tied to your account right away. Download products show up in the Downloads tab of your dashboard as soon as the payment is approved.",
    },
    {
      q: "Are plans recurring, or can I buy just once?",
      a: "It depends on the product and plan you choose — some are subscriptions (monthly, quarterly) that you can cancel whenever you want, others are one-time payments with no recurring fee. Each plan makes this clear before you complete your purchase.",
    },
    {
      q: "Do I need technical knowledge to use the products?",
      a: "No. Every product is built to install and set up in minutes, without touching your server's code.",
    },
    {
      q: "Is there support if I run into a problem?",
      a: "Yes. Our team responds directly on Discord — not a generic form that takes days to get back to you.",
    },
    {
      q: "Do prices vary between products?",
      a: "Yes. Each product has its own plans and prices, all shown on the Products page before you choose.",
    },
  ],
  heading: "Frequently asked questions",
  subheading: "Everything that usually comes up before getting started.",
  stillHaveQuestions: "Still have questions?",
  talkToTeam: "Talk to the Goat Network team on Discord.",
  joinDiscord: "Join Discord",
};

export function FAQ() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? faqPt : faqEn;
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="border-b border-hairline">
      <div className="rails mx-auto grid w-full max-w-[1200px] md:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <FadeLeft className="flex flex-col justify-between border-hairline md:border-r">
          <div className="p-8">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" /> FAQ
            </span>
            <h2 className="mt-4 text-[32px] leading-[1.08] font-semibold tracking-[-0.03em]">
              {t.heading}
            </h2>
            <p className="mt-3 max-w-[260px] text-[13px] leading-[1.6] text-muted-foreground">
              {t.subheading}
            </p>
          </div>
          <div className="border-t border-hairline p-8">
            <p className="text-[14px] font-semibold">{t.stillHaveQuestions}</p>
            <p className="mt-1.5 text-[13px] text-muted-foreground">{t.talkToTeam}</p>
            <a
              href="https://discord.gg/VpHaMPpEHZ"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex rounded-md border border-hairline bg-surface-2 px-4 py-2 text-[12.5px] font-medium transition-colors hover:border-gold/40"
            >
              {t.joinDiscord}
            </a>
          </div>
        </FadeLeft>
        <div>
          {t.faqs.map((f, i) => (
            <FadeUp key={f.q} delay={i * 0.05}>
              <div
                className={cn(
                  "border-b transition-colors duration-300 last:border-b-0",
                  open === i ? "border-gold/20" : "border-hairline",
                )}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-6 px-8 py-6 text-left"
                >
                  <span className="text-[14px] font-medium">{f.q}</span>
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                    <Plus
                      className={`h-3 w-3 transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}
                    />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-8 pb-6 text-[13px] leading-[1.6] text-muted-foreground">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

type CtaCopy = {
  eyebrow: string;
  heading: string;
  viewProducts: string;
};

const ctaPt: CtaCopy = {
  eyebrow: "Sem contrato longo, sem taxa escondida.",
  heading: "Escolha um produto e comece ainda hoje.",
  viewProducts: "Ver produtos",
};

const ctaEn: CtaCopy = {
  eyebrow: "No long contracts, no hidden fees.",
  heading: "Pick a product and get started today.",
  viewProducts: "View products",
};

export function CTA() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? ctaPt : ctaEn;
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const glow = glowRef.current;
    if (!section || !glow) return;
    if (!window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return;

    let raf = 0;
    const target = { x: 50, y: 40 };
    const current = { x: 50, y: 40 };

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      target.x = ((e.clientX - rect.left) / rect.width) * 100;
      target.y = ((e.clientY - rect.top) / rect.height) * 100;
    };
    const loop = () => {
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      glow.style.setProperty("--cta-x", `${current.x.toFixed(1)}%`);
      glow.style.setProperty("--cta-y", `${current.y.toFixed(1)}%`);
      raf = requestAnimationFrame(loop);
    };

    section.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      section.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-b border-hairline">
      <motion.div
        ref={glowRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="grain pointer-events-none absolute inset-0"
        style={
          {
            "--cta-x": "50%",
            "--cta-y": "40%",
            background:
              "radial-gradient(560px circle at var(--cta-x) var(--cta-y), oklch(0.755 0.135 73 / 0.14), transparent 70%)",
          } as React.CSSProperties
        }
      />
      <div className="rails relative mx-auto w-full max-w-[1200px] px-5 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28, clipPath: "inset(0% 0% 100% 0%)" }}
          whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[12.5px] text-muted-foreground">{t.eyebrow}</p>
          <h2 className="mx-auto mt-4 max-w-[520px] text-[36px] leading-[1.1] font-semibold tracking-[-0.02em] text-balance sm:text-[44px]">
            {t.heading}
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 inline-block"
        >
          <Magnetic max={5}>
            <a
              href="/products"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-[13.5px] font-medium text-primary-foreground transition-colors hover:opacity-90"
            >
              {t.viewProducts} <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}

type FooterCopy = {
  cols: {
    t: string;
    l: { label: string; href: string }[];
  }[];
  stayInLoop: string;
  newsletterBlurb: string;
  joinDiscord: string;
  rights: string;
  qualityFirst: string;
};

const footerPt: FooterCopy = {
  cols: [
    {
      t: "Produto",
      l: [
        { label: "Produtos", href: "/products" },
        { label: "Changelog", href: "/changelog" },
        { label: "FAQs", href: "/#faq" },
      ],
    },
    {
      t: "Empresa",
      l: [
        { label: "Sobre a Goat Network", href: "/empresa" },
        { label: "Discord", href: "https://discord.gg/VpHaMPpEHZ" },
      ],
    },
    {
      t: "Legal",
      l: [
        { label: "Termos de Uso", href: "/termos" },
        { label: "Privacidade", href: "/privacidade" },
      ],
    },
  ],
  stayInLoop: "Fique por dentro",
  newsletterBlurb: "Novidades sobre produtos e atualizações saem primeiro no nosso Discord.",
  joinDiscord: "Entrar no Discord",
  rights: "© 2026 Goat Network. Todos os direitos reservados.",
  qualityFirst: "Qualidade em primeiro lugar",
};

const footerEn: FooterCopy = {
  cols: [
    {
      t: "Product",
      l: [
        { label: "Products", href: "/products" },
        { label: "Changelog", href: "/changelog" },
        { label: "FAQs", href: "/#faq" },
      ],
    },
    {
      t: "Company",
      l: [
        { label: "About Goat Network", href: "/empresa" },
        { label: "Discord", href: "https://discord.gg/VpHaMPpEHZ" },
      ],
    },
    {
      t: "Legal",
      l: [
        { label: "Terms of Use", href: "/termos" },
        { label: "Privacy", href: "/privacidade" },
      ],
    },
  ],
  stayInLoop: "Stay in the loop",
  newsletterBlurb: "Product news and updates land first on our Discord.",
  joinDiscord: "Join Discord",
  rights: "© 2026 Goat Network. All rights reserved.",
  qualityFirst: "Quality first",
};

export function Footer() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? footerPt : footerEn;
  const cols = t.cols;
  const reduced = usePrefersReducedMotion();
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (reduced) return;
    const el = logoRef.current;
    if (!el) return;
    if (!window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return;

    const parent = el.closest("footer") as HTMLElement | null;
    if (!parent) return;

    let raf = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      target.x = clampAbs(e.clientX - (rect.left + rect.width / 2), 6);
      target.y = clampAbs(e.clientY - (rect.top + rect.height / 2), 6);
    };
    const loop = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      el.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    parent.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      parent.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, [reduced]);

  return (
    <footer>
      <div className="rails mx-auto grid w-full max-w-[1200px] md:grid-cols-[minmax(0,1fr)_200px_minmax(0,1fr)]">
        <div className="border-b border-hairline p-8 md:border-r md:border-b-0">
          <p className="text-[15px] font-semibold">{t.stayInLoop}</p>
          <p className="mt-2 max-w-[280px] text-[13px] leading-[1.6] text-muted-foreground">
            {t.newsletterBlurb}
          </p>
          <a
            href="https://discord.gg/VpHaMPpEHZ"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center rounded-md border border-hairline bg-surface-2 px-3.5 py-2 text-[12.5px] font-medium transition-colors hover:border-gold/40"
          >
            {t.joinDiscord}
          </a>
        </div>
        <div className="grid place-items-center border-b border-hairline p-8 md:border-r md:border-b-0">
          <img ref={logoRef} src={logo} alt="GOAT" className="h-8 w-auto opacity-90" />
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-6 p-8 sm:flex sm:items-start sm:gap-8 lg:gap-16">
          {cols.map((c) => (
            <div key={c.t} className="min-w-0">
              <p className="text-[14px] font-semibold">{c.t}</p>
              <ul className="mt-4 space-y-2.5">
                {c.l.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="group relative inline-flex items-center text-[12.5px] text-muted-foreground transition-colors hover:text-gold"
                    >
                      <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                        {l.label}
                      </span>
                      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-hairline">
        <div className="rails mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-3 px-5 py-4 font-mono text-[10.5px] tracking-[0.1em] text-muted-foreground uppercase">
          <span>{t.rights}</span>
          <span>{t.qualityFirst}</span>
        </div>
      </div>
    </footer>
  );
}
