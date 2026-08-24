import { ArrowRight } from "lucide-react";
import { CodePanel } from "./CodePanel";
import { FadeUp } from "./animations";
import { useLanguage } from "@/i18n/LanguageContext";

type Copy = {
  eyebrow: string;
  heading: string;
  subheading: string;
  cta: string;
};

const pt: Copy = {
  eyebrow: "Detecção em tempo real",
  heading: "Mais de 40 módulos, flagrando ameaças na hora.",
  subheading:
    "Abaixo, uma demonstração do painel que sua staff usa pra acompanhar cada detecção — sem travar o servidor e sem pegar jogador legítimo no meio.",
  cta: "Ver os 40+ módulos",
};

const en: Copy = {
  eyebrow: "Real-time detection",
  heading: "40+ modules, flagging threats on the spot.",
  subheading:
    "Below, a demo of the panel your staff uses to track every detection — without freezing the server or catching legitimate players in the crossfire.",
  cta: "See the 40+ modules",
};

export function LiveDemo() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;

  return (
    <section className="border-b border-hairline">
      <div className="rails mx-auto w-full max-w-[1200px] px-5">
        <FadeUp className="pt-16 pb-10 text-center">
          <span className="eyebrow justify-center">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
            </span>
            {t.eyebrow}
          </span>
          <h2 className="mx-auto mt-5 max-w-[620px] text-[30px] leading-[1.1] font-semibold tracking-[-0.02em] text-balance sm:text-[38px]">
            {t.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[13.5px] leading-[1.6] text-muted-foreground">
            {t.subheading}
          </p>
        </FadeUp>

        <FadeUp className="pb-10">
          <CodePanel />
        </FadeUp>

        <div className="pb-16 text-center">
          <a
            href="/produtos/goat-anticheat#modulos"
            className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-gold transition-colors hover:text-foreground"
          >
            {t.cta} <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
