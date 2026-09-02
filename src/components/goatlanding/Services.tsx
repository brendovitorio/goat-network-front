import { Code2, Smartphone, Globe2, Bot, ShieldCheck, ArrowUpRight } from "lucide-react";
import { FadeUp, FadeStagger } from "./animations";
import { useLanguage } from "@/i18n/LanguageContext";
import { MriCard } from "@/components/ui/MriCard";

type Service = { title: string; body: string; href: string };

type Copy = {
  eyebrow: string;
  heading: string;
  services: [Service, Service, Service, Service, Service];
};

const pt: Copy = {
  eyebrow: "O que a gente constrói",
  heading: "Software sob medida, do primeiro rascunho à produção.",
  services: [
    {
      title: "Sistemas web",
      body: "Painéis internos, ERPs, plataformas — sob medida pro seu processo, não o contrário.",
      href: "/encomendar",
    },
    {
      title: "Aplicativos mobile",
      body: "Apps iOS e Android nativos ou multiplataforma, do zero ou evoluindo o que já existe.",
      href: "/encomendar",
    },
    {
      title: "Sites & e-commerce",
      body: "Institucionais, landing pages e lojas online rápidas, responsivas e prontas pra converter.",
      href: "/encomendar",
    },
    {
      title: "Automação & bots",
      body: "Integrações, bots de Discord/WhatsApp e automações que tiram trabalho manual do seu time.",
      href: "/encomendar",
    },
    {
      title: "GOAT Anticheat",
      body: "Nosso produto de prateleira: proteção em tempo real pra servidores FiveM, pronta em minutos.",
      href: "/produtos/goat-anticheat",
    },
  ],
};

const en: Copy = {
  eyebrow: "What we build",
  heading: "Custom software, from first draft to production.",
  services: [
    {
      title: "Web systems",
      body: "Internal dashboards, ERPs, platforms — built around your process, not the other way around.",
      href: "/encomendar",
    },
    {
      title: "Mobile apps",
      body: "Native or cross-platform iOS and Android apps, from scratch or building on what you already have.",
      href: "/encomendar",
    },
    {
      title: "Sites & e-commerce",
      body: "Institutional sites, landing pages and online stores that are fast, responsive and built to convert.",
      href: "/encomendar",
    },
    {
      title: "Automation & bots",
      body: "Integrations, Discord/WhatsApp bots and automations that take manual work off your team's plate.",
      href: "/encomendar",
    },
    {
      title: "GOAT Anticheat",
      body: "Our off-the-shelf product: real-time protection for FiveM servers, ready in minutes.",
      href: "/produtos/goat-anticheat",
    },
  ],
};

const ICONS = [Code2, Smartphone, Globe2, Bot, ShieldCheck];

export function Services() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  const services = ICONS.map((icon, i) => ({ icon, ...t.services[i] }));

  return (
    <section className="border-b border-hairline">
      <div className="rails mx-auto w-full max-w-[1200px]">
        <FadeUp className="px-5 pt-16 pb-10 text-center">
          <span className="eyebrow justify-center">{t.eyebrow}</span>
          <h2 className="mx-auto mt-4 max-w-[560px] text-[28px] leading-[1.15] font-semibold tracking-[-0.02em] text-balance sm:text-[34px]">
            {t.heading}
          </h2>
        </FadeUp>

        <FadeStagger className="grid grid-cols-1 gap-4 border-t border-hairline px-5 py-10 sm:grid-cols-2 lg:grid-cols-5">
          {services.map((s, i) => (
            <FadeUp key={s.title} delay={i * 0.05}>
              <a href={s.href} className="block h-full">
                <MriCard interactive className="h-full border-hairline bg-surface-2/40 p-6">
                  <s.icon className="h-4 w-4 text-gold" strokeWidth={1.75} />
                  <h3 className="mt-4 flex items-center gap-1.5 text-[14px] font-semibold tracking-tight">
                    {s.title}
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-[1.6] text-muted-foreground">{s.body}</p>
                </MriCard>
              </a>
            </FadeUp>
          ))}
        </FadeStagger>
      </div>
    </section>
  );
}
