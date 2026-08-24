import { useEffect } from "react";
import { Nav } from "@/components/goatlanding/Nav";
import { Footer } from "@/components/goatlanding/Sections";
import { useLanguage } from "@/i18n/LanguageContext";

type TagKey = "new" | "fixed" | "removed";

type Entry = {
  date: string;
  tag: TagKey;
  tagLabel: string;
  product: string;
  items: string[];
};

type Copy = {
  tabTitle: string;
  eyebrow: string;
  heroTitle: string;
  heroBody: string;
  entries: Entry[];
};

const pt: Copy = {
  tabTitle: "Changelog — Goat Network",
  eyebrow: "Changelog",
  heroTitle: "O que muda na Goat Network, quando muda.",
  heroBody:
    "Um registro honesto do que foi adicionado, corrigido ou removido — sem histórico inventado. Começa na primeira entrada real que temos.",
  entries: [
    {
      date: "18 de agosto de 2026",
      tag: "new",
      tagLabel: "Novo",
      product: "GOAT Anticheat",
      items: [
        "19 novos módulos de detecção: troca indevida de modelo de personagem, munição que não é consumida ao atirar, reparo instantâneo de veículo sem autorização, voo anômalo de veículo terrestre, queda sem dano correspondente, cadência de disparo acima do limite real da arma, e mais.",
        "Bloqueio de duplicação de item/dinheiro (Anti-Dupe) e teleporte instantâneo a pé sem autorização.",
        "Todos os módulos reais agora têm toggle individual no painel — mais de 40 no total.",
      ],
    },
    {
      date: "18 de agosto de 2026",
      tag: "removed",
      tagLabel: "Removido",
      product: "GOAT Anticheat",
      items: [
        "Módulo Anti-NUI: estava listado mas nunca era ativado por nenhum fluxo real do sistema. Removido em vez de mantido como proteção fantasma.",
      ],
    },
    {
      date: "18 de agosto de 2026",
      tag: "fixed",
      tagLabel: "Corrigido",
      product: "GOAT Anticheat",
      items: [
        "Ordenação e exibição de data na galeria de evidências.",
        "Sincronização de configuração do painel para o servidor de jogo, incluindo módulos que não tinham efeito real ao serem desativados.",
      ],
    },
  ],
};

const en: Copy = {
  tabTitle: "Changelog — Goat Network",
  eyebrow: "Changelog",
  heroTitle: "What changes at Goat Network, when it changes.",
  heroBody:
    "An honest record of what was added, fixed, or removed — no invented history. Starts at the first real entry we have.",
  entries: [
    {
      date: "August 18, 2026",
      tag: "new",
      tagLabel: "New",
      product: "GOAT Anticheat",
      items: [
        "19 new detection modules: improper character model swapping, ammo not being consumed when firing, unauthorized instant vehicle repair, anomalous ground-vehicle flight, falls without matching damage, fire rate above the weapon's real limit, and more.",
        "Item/money duplication blocking (Anti-Dupe) and unauthorized instant on-foot teleportation.",
        "Every real module now has an individual toggle in the panel — over 40 in total.",
      ],
    },
    {
      date: "August 18, 2026",
      tag: "removed",
      tagLabel: "Removed",
      product: "GOAT Anticheat",
      items: [
        "Anti-NUI module: it was listed but never actually activated by any real system flow. Removed instead of kept as a phantom protection.",
      ],
    },
    {
      date: "August 18, 2026",
      tag: "fixed",
      tagLabel: "Fixed",
      product: "GOAT Anticheat",
      items: [
        "Date sorting and display in the evidence gallery.",
        "Panel configuration sync to the game server, including modules that had no real effect when disabled.",
      ],
    },
  ],
};

const TAG_STYLE: Record<TagKey, string> = {
  new: "text-gold bg-gold/10",
  fixed: "text-sky-400 bg-sky-400/10",
  removed: "text-red-400 bg-red-400/10",
};

export default function Changelog() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;

  useEffect(() => {
    document.title = t.tabTitle;
  }, [lang, t.tabTitle]);

  return (
    <main className="relative min-h-screen bg-background font-sans text-foreground">
      <Nav />
      <section className="border-b border-hairline pt-32 pb-16">
        <div className="mx-auto w-full max-w-[720px] px-5">
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" /> {t.eyebrow}
          </span>
          <h1 className="mt-4 text-[38px] leading-[1.08] font-semibold tracking-[-0.03em] text-balance sm:text-[46px]">
            {t.heroTitle}
          </h1>
          <p className="mt-4 max-w-[520px] text-[14.5px] leading-[1.6] text-muted-foreground">
            {t.heroBody}
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-10 px-5 pt-16">
          {t.entries.map((e, i) => (
            <div key={i} className="flex gap-6 border-b border-hairline pb-10 last:border-b-0">
              <div className="w-[110px] shrink-0 pt-1 font-mono text-[11px] tracking-wide text-muted-foreground">
                {e.date}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-block rounded px-2 py-0.5 font-mono text-[10.5px] font-bold uppercase tracking-wide ${TAG_STYLE[e.tag]}`}
                  >
                    {e.tagLabel}
                  </span>
                  <span className="inline-block rounded bg-secondary px-2 py-0.5 font-mono text-[10.5px] text-muted-foreground uppercase tracking-wide">
                    {e.product}
                  </span>
                </div>
                <ul className="mt-3 space-y-2.5">
                  {e.items.map((item, j) => (
                    <li key={j} className="text-[13.5px] leading-[1.6] text-foreground/80">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
