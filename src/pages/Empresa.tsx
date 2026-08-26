import { useEffect, useState } from "react";
import { Nav } from "@/components/goatlanding/Nav";
import { Footer } from "@/components/goatlanding/Sections";
import { FadeUp, FadeLeft, FadeRight } from "@/components/goatlanding/animations";
import { api, type FounderItem } from "@/lib/goat-api";
import { useLanguage } from "@/i18n/LanguageContext";
import { MriButton } from "@/components/ui/MriButton";

const DISCORD_URL = "https://discord.gg/goatnetworkgg";

type Copy = {
  tabTitle: string;
  eyebrowEmpresa: string;
  heroTitle: string;
  heroBody: string;
  reasonEyebrow: string;
  reasonTitle: string;
  reasonBody: string;
  goalEyebrow: string;
  goalTitle: string;
  goalBody: string;
  foundationEyebrow: string;
  foundationTitle: string;
  ctaTitle: string;
  ctaBody: string;
  ctaDiscord: string;
};

const pt: Copy = {
  tabTitle: "Empresa — Goat Network",
  eyebrowEmpresa: "Empresa",
  heroTitle: "Duas pessoas que não se conheciam. Uma aposta que virou a Goat Network.",
  heroBody:
    "A Goat Network nasceu de duas pessoas que nunca tinham se falado antes — mas decidiram acreditar uma na outra e investir tempo, trabalho e reputação no mesmo projeto.",
  reasonEyebrow: "O motivo",
  reasonTitle: "Uma inconformidade com o preço do mercado",
  reasonBody:
    "A ideia surgiu de uma discordância simples: o valor cobrado pelas grandes soluções pra FiveM não fazia sentido pra algo que, antes de qualquer coisa, deveria existir para ajudar a comunidade a crescer — não para explorá-la.",
  goalEyebrow: "O objetivo",
  goalTitle: "Bater de frente com as grandes. Não em preço, nem em nome.",
  goalBody:
    "Em qualidade. Não qualidade de design — qualidade de produto de verdade, facilidade real de uso e suporte sério para servidores FiveM de qualquer tamanho.",
  foundationEyebrow: "Fundação",
  foundationTitle: "O projeto nasceu em 10 de agosto de 2026",
  ctaTitle: "Acompanhe de perto, converse com quem constrói.",
  ctaBody:
    "Dúvidas, sugestões ou só quer ver o projeto crescer em tempo real — o Discord é onde a conversa acontece.",
  ctaDiscord: "Entrar no Discord",
};

const en: Copy = {
  tabTitle: "Company — Goat Network",
  eyebrowEmpresa: "Company",
  heroTitle: "Two people who'd never met. A bet that became Goat Network.",
  heroBody:
    "Goat Network started with two people who had never spoken before — but decided to trust each other and put time, work, and reputation into the same project.",
  reasonEyebrow: "The reason",
  reasonTitle: "A disagreement with market pricing",
  reasonBody:
    "The idea came from a simple disagreement: what the big FiveM solutions charge didn't make sense for something that, above all, should exist to help the community grow — not to exploit it.",
  goalEyebrow: "The goal",
  goalTitle: "Go head-to-head with the big players. Not on price, not on name.",
  goalBody:
    "On quality. Not design quality — real product quality, genuine ease of use, and serious support for FiveM servers of any size.",
  foundationEyebrow: "Founding",
  foundationTitle: "The project was founded on August 10, 2026",
  ctaTitle: "Follow along closely, talk to the people building it.",
  ctaBody:
    "Questions, suggestions, or you just want to watch the project grow in real time — Discord is where it all happens.",
  ctaDiscord: "Join Discord",
};

const FALLBACK_FOUNDERS: FounderItem[] = [
  {
    discordId: "1525402934815232010",
    name: "Alvezx",
    role: "Founder, Goat Network",
    avatarUrl: null,
    profileUrl: "https://discord.com/users/1525402934815232010",
  },
  {
    discordId: "1325846495626268693",
    name: "Nexus",
    role: "Founder, Goat Network",
    avatarUrl: null,
    profileUrl: "https://discord.com/users/1325846495626268693",
  },
];

export default function Empresa() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  const [founders, setFounders] = useState<FounderItem[]>(FALLBACK_FOUNDERS);

  useEffect(() => {
    document.title = t.tabTitle;
  }, [lang, t.tabTitle]);

  useEffect(() => {
    api.getFounders().then((data) => {
      if (data.length) setFounders(data);
    });
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background font-sans text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[400px] glow-top opacity-20" />

      <Nav />

      <section className="relative pt-32 pb-16">
        <div className="mx-auto w-full max-w-[720px] px-5 text-center">
          <FadeUp>
            <span className="eyebrow justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" /> {t.eyebrowEmpresa}
            </span>
            <h1 className="mx-auto mt-5 max-w-[560px] text-[38px] leading-[1.08] font-semibold tracking-[-0.03em] text-balance sm:text-[46px]">
              {t.heroTitle}
            </h1>
            <p className="mx-auto mt-5 max-w-[540px] text-[14.5px] leading-[1.65] text-muted-foreground">
              {t.heroBody}
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="relative border-t border-hairline">
        <div className="mx-auto grid w-full max-w-[1000px] md:grid-cols-2">
          <FadeLeft className="border-b border-hairline p-10 md:border-r md:border-b-0 md:p-14">
            <span className="font-mono text-[11px] tracking-[0.12em] text-gold uppercase">
              {t.reasonEyebrow}
            </span>
            <h2 className="mt-4 text-[24px] leading-[1.2] font-semibold tracking-[-0.02em]">
              {t.reasonTitle}
            </h2>
            <p className="mt-4 text-[13.5px] leading-[1.7] text-muted-foreground">
              {t.reasonBody}
            </p>
          </FadeLeft>
          <FadeRight className="p-10 md:p-14">
            <span className="font-mono text-[11px] tracking-[0.12em] text-gold uppercase">
              {t.goalEyebrow}
            </span>
            <h2 className="mt-4 text-[24px] leading-[1.2] font-semibold tracking-[-0.02em]">
              {t.goalTitle}
            </h2>
            <p className="mt-4 text-[13.5px] leading-[1.7] text-muted-foreground">
              {t.goalBody}
            </p>
          </FadeRight>
        </div>
      </section>

      <section className="relative border-t border-hairline py-20">
        <div className="mx-auto w-full max-w-[1000px] px-5">
          <FadeUp className="text-center">
            <span className="eyebrow justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" /> {t.foundationEyebrow}
            </span>
            <h2 className="mx-auto mt-4 max-w-[440px] text-[28px] leading-[1.15] font-semibold tracking-[-0.02em] text-balance">
              {t.foundationTitle}
            </h2>
          </FadeUp>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {founders.map((f, i) => (
              <FadeUp key={f.discordId} delay={i * 0.1}>
                <a
                  href={f.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 rounded-xl border border-hairline bg-card p-6 transition-colors hover:border-gold/40"
                >
                  {f.avatarUrl ? (
                    <img
                      src={f.avatarUrl}
                      alt={f.name}
                      className="h-14 w-14 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gold/15 text-[20px] font-bold text-gold">
                      {f.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-[16px] font-semibold">{f.name}</p>
                    <p className="mt-0.5 font-mono text-[11.5px] text-muted-foreground">{f.role}</p>
                  </div>
                </a>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-hairline">
        <div className="mx-auto w-full max-w-[720px] px-5 py-20 text-center">
          <FadeUp>
            <h2 className="text-[26px] leading-[1.2] font-semibold tracking-[-0.02em] text-balance">
              {t.ctaTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-[440px] text-[13.5px] leading-[1.6] text-muted-foreground">
              {t.ctaBody}
            </p>
            <MriButton
              asChild
              variant="solid"
              className="mt-7 rounded-lg px-6 py-3 text-[13.5px] transition-transform hover:scale-[1.02] hover:brightness-100"
            >
              <a href={DISCORD_URL} target="_blank" rel="noreferrer">
                {t.ctaDiscord}
              </a>
            </MriButton>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </main>
  );
}
