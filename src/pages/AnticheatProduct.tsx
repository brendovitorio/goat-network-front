import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";
import { Nav } from "@/components/goatlanding/Nav";
import { CodePanel } from "@/components/goatlanding/CodePanel";
import { CTA, Footer } from "@/components/goatlanding/Sections";
import { FadeUp, FadeLeft, FadeRight } from "@/components/goatlanding/animations";
import { useLanguage } from "@/i18n/LanguageContext";
import vetor01 from "@/assets/vetor01.png";
import vetor02 from "@/assets/vetor02.png";
import vetor03 from "@/assets/vetor03.png";
import goatLoading from "@/assets/goatloading.png";

type FaqItem = { q: string; a: string };
type SolutionCell = { title: string; body: string };
type ProductBlock = { title: string; body: string; items: string[] };

type Copy = {
  pageTitle: string;
  heroEyebrow: string;
  heroH1Before: string;
  heroH1Highlight: string;
  heroH1After: string;
  heroParagraph: string;
  ctaPricing: string;
  ctaModules: string;
  featuresEyebrow: string;
  featuresH2: string;
  featureAlt1: string;
  featureAlt2: string;
  featureAlt3: string;
  block1: ProductBlock;
  block2: ProductBlock;
  block3: ProductBlock;
  solutionEyebrow: string;
  solutionH2: string;
  solutionP: string;
  solutionCells: SolutionCell[];
  faqEyebrow: string;
  faqH2: string;
  faqP: string;
  faqs: FaqItem[];
};

const pt: Copy = {
  pageTitle: "GOAT Anticheat — Goat Network",
  heroEyebrow: "Detecção em tempo real · zero tolerância",
  heroH1Before: "O anticheat que sua cidade",
  heroH1Highlight: "FiveM",
  heroH1After: "deveria ter desde o primeiro dia",
  heroParagraph:
    "Mais de 40 módulos de detecção, do aimbot ao dupe de item, rodando em produção agora. O GOAT flagra a ameaça no instante em que ela acontece — sem travar o servidor e sem pegar jogador legítimo no meio.",
  ctaPricing: "Ver planos de proteção",
  ctaModules: "Ver os 40+ módulos",
  featuresEyebrow: "Recursos",
  featuresH2: "Como o GOAT protege, na prática.",
  featureAlt1: "Recurso 1",
  featureAlt2: "Recurso 2",
  featureAlt3: "Recurso 3",
  block1: {
    title: "Pronto em minutos, sem complicação",
    body: "Instale o resource, inicie a configuração automática e a proteção entra em operação — sem necessidade de editar o código base do seu servidor.",
    items: [
      "Mais de 40 módulos de proteção ativados por padrão",
      "Configuração automática sem intervenção manual",
      "Integração nativa com QBCore, ESX, vRP e frameworks custom",
    ],
  },
  block2: {
    title: "Integrado com o que você já usa",
    body: "Discord, txAdmin, banco de dados. O GOAT se conecta à sua stack atual e leva logs e relatórios direto para onde a sua equipe trabalha.",
    items: [
      "Logs enriquecidos enviados para webhooks Discord",
      "Sincronização automática com txAdmin",
      "Painel web completo para operação diária",
    ],
  },
  block3: {
    title: "Funciona mesmo com a staff offline",
    body: "A proteção do GOAT opera de forma autônoma, analisando a telemetria de cada jogador e respondendo a ameaças sem precisar de um admin online.",
    items: [
      "Bloqueio de cheats modernos: Aimbot, Noclip, Exploits",
      "Banimento global blindado via HWID, IP e Subnet",
      "Proteção contra injeção de eventos e Trigger Nuke",
    ],
  },
  solutionEyebrow: "A solução",
  solutionH2: "Proteção que não vira desculpa pra lag.",
  solutionP:
    "Cada recurso do GOAT Anticheat foi desenvolvido pra proteger o ambiente sem interferir na experiência dos jogadores ou na operação do servidor.",
  solutionCells: [
    {
      title: "Detecção em tempo real",
      body: "O GOAT identifica comportamentos suspeitos e ameaças no momento em que ocorrem, fornecendo informações precisas para uma tomada de decisão mais rápida.",
    },
    {
      title: "Resposta automática",
      body: "Bane infratores, kicka suspeitos e alerta a staff sem intervenção manual. Segurança contínua mesmo sem um Admin conectado.",
    },
    {
      title: "Monitoramento completo",
      body: "Cada evento é registrado com precisão. Logs detalhados, evidências e histórico acessados diretamente no painel ou no Discord.",
    },
    {
      title: "0.00ms no Resmon",
      body: "Arquitetura otimizada do lado do cliente — a proteção não aparece no Resmon nem afeta a experiência de quem está jogando.",
    },
  ],
  faqEyebrow: "FAQ do Anticheat",
  faqH2: "Perguntas sobre o Anticheat",
  faqP: "O que costuma aparecer antes de proteger o servidor.",
  faqs: [
    {
      q: "O GOAT Anticheat é fácil de configurar?",
      a: "Sim. Mais de 40 módulos de proteção já vêm ativados por padrão. Basta adicionar o resource ao servidor, inserir a licença e a proteção entra em operação automaticamente.",
    },
    {
      q: "Que tipos de ameaça o GOAT detecta?",
      a: "Mod Menus modernos (Eulen, Skript, etc.), Aimbot, Noclip, Godmode, Spawners e injeção de eventos (Triggers). A detecção acontece em tempo real, sem depender de atualizações manuais.",
    },
    {
      q: "A proteção impacta a performance do servidor?",
      a: "Não. A arquitetura do GOAT foi projetada para operar com alto desempenho, garantindo segurança contínua sem comprometer a experiência dos jogadores. 0.00ms no Resmon do lado do cliente.",
    },
    {
      q: "Funciona com QBCore, ESX ou vRP?",
      a: "Sim. O GOAT possui integrações nativas prontas para os principais frameworks do FiveM: QBCore, ESX, vRP e VRPEX.",
    },
    {
      q: "O preço é acessível para servidores menores?",
      a: "Sim. Buscamos oferecer uma solução profissional por um dos preços mais competitivos do mercado, tornando recursos avançados de proteção acessíveis a servidores de diferentes portes.",
    },
    {
      q: "Como funciona a ativação após o pagamento?",
      a: "A ativação é 100% automática. Assim que o pagamento for aprovado, seu painel será liberado e você poderá iniciar a configuração imediatamente.",
    },
  ],
};

const en: Copy = {
  pageTitle: "GOAT Anticheat — Goat Network",
  heroEyebrow: "Real-time detection · zero tolerance",
  heroH1Before: "The anticheat your",
  heroH1Highlight: "FiveM",
  heroH1After: "city should have had since day one",
  heroParagraph:
    "40+ detection modules, from aimbots to item duping, running in production right now. GOAT flags the threat the instant it happens — without freezing the server and without catching legitimate players in the crossfire.",
  ctaPricing: "See protection plans",
  ctaModules: "See the 40+ modules",
  featuresEyebrow: "Features",
  featuresH2: "How GOAT protects, in practice.",
  featureAlt1: "Feature 1",
  featureAlt2: "Feature 2",
  featureAlt3: "Feature 3",
  block1: {
    title: "Ready in minutes, no hassle",
    body: "Install the resource, kick off the automatic setup, and protection goes live — no need to touch your server's base code.",
    items: [
      "40+ protection modules enabled by default",
      "Automatic setup with no manual intervention",
      "Native integration with QBCore, ESX, vRP, and custom frameworks",
    ],
  },
  block2: {
    title: "Integrated with what you already use",
    body: "Discord, txAdmin, database. GOAT connects to your current stack and delivers logs and reports right where your team works.",
    items: [
      "Rich logs sent to Discord webhooks",
      "Automatic sync with txAdmin",
      "Full web dashboard for day-to-day operation",
    ],
  },
  block3: {
    title: "Works even when staff is offline",
    body: "GOAT's protection runs autonomously, analyzing each player's telemetry and responding to threats without needing an admin online.",
    items: [
      "Blocks modern cheats: Aimbot, Noclip, Exploits",
      "Hardened global bans via HWID, IP, and subnet",
      "Protection against event injection and Trigger Nuke",
    ],
  },
  solutionEyebrow: "The solution",
  solutionH2: "Protection that never becomes an excuse for lag.",
  solutionP:
    "Every GOAT Anticheat feature was built to protect your environment without interfering with the player experience or server performance.",
  solutionCells: [
    {
      title: "Real-time detection",
      body: "GOAT identifies suspicious behavior and threats the moment they happen, giving you precise data for faster decisions.",
    },
    {
      title: "Automatic response",
      body: "Bans offenders, kicks suspects, and alerts staff with no manual intervention. Continuous security even without an admin online.",
    },
    {
      title: "Complete monitoring",
      body: "Every event is logged with precision. Detailed logs, evidence, and history accessible directly in the dashboard or on Discord.",
    },
    {
      title: "0.00ms on Resmon",
      body: "Client-side optimized architecture — protection doesn't show up on Resmon and doesn't affect the experience of anyone playing.",
    },
  ],
  faqEyebrow: "Anticheat FAQ",
  faqH2: "Questions about the Anticheat",
  faqP: "What usually comes up before protecting your server.",
  faqs: [
    {
      q: "Is GOAT Anticheat easy to set up?",
      a: "Yes. 40+ protection modules come enabled by default. Just add the resource to your server, enter your license, and protection goes live automatically.",
    },
    {
      q: "What kinds of threats does GOAT detect?",
      a: "Modern mod menus (Eulen, Skript, etc.), Aimbot, Noclip, Godmode, spawners, and event injection (Triggers). Detection happens in real time, without relying on manual updates.",
    },
    {
      q: "Does the protection impact server performance?",
      a: "No. GOAT's architecture was designed for high performance, guaranteeing continuous security without compromising the player experience. 0.00ms on Resmon, client-side.",
    },
    {
      q: "Does it work with QBCore, ESX, or vRP?",
      a: "Yes. GOAT has native, ready-to-use integrations for the main FiveM frameworks: QBCore, ESX, vRP, and VRPEX.",
    },
    {
      q: "Is the price affordable for smaller servers?",
      a: "Yes. We aim to offer a professional solution at one of the most competitive prices on the market, making advanced protection features accessible to servers of every size.",
    },
    {
      q: "How does activation work after payment?",
      a: "Activation is 100% automatic. As soon as payment is approved, your dashboard is unlocked and you can start setup right away.",
    },
  ],
};

export default function AnticheatProductPage() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;

  useEffect(() => {
    document.title = t.pageTitle;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <main className="relative min-h-screen bg-background font-sans text-foreground">
      <Nav />

      <section className="relative overflow-hidden border-b border-hairline">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[320px] glow-top opacity-20" />
        <div className="rails mx-auto w-full max-w-[1200px] px-5">
          <FadeUp className="pt-24 pb-10 text-center">
            <span className="eyebrow justify-center">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
              </span>
              {t.heroEyebrow}
            </span>
            <h1 className="mx-auto mt-5 max-w-[760px] text-[42px] leading-[1.05] font-semibold tracking-[-0.02em] text-balance sm:text-[56px]">
              {t.heroH1Before} <span className="text-gold">{t.heroH1Highlight}</span>{" "}
              {t.heroH1After}
            </h1>
            <p className="mx-auto mt-5 max-w-[520px] text-[14.5px] leading-[1.6] text-muted-foreground">
              {t.heroParagraph}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="/products"
                className="rounded-lg bg-primary px-6 py-3 text-[13.5px] font-semibold text-primary-foreground shadow-[0_0_0_1px_oklch(0.755_0.135_73/0.4)] transition-transform hover:scale-[1.02]"
              >
                {t.ctaPricing}
              </a>
              <a
                href="#modulos"
                className="rounded-lg border border-hairline px-6 py-3 text-[13.5px] font-medium text-foreground/85 transition-colors hover:border-gold/40 hover:text-foreground"
              >
                {t.ctaModules}
              </a>
            </div>
          </FadeUp>

          <FadeUp className="relative pb-14">
            <CodePanel />
          </FadeUp>
        </div>
      </section>

      <section id="modulos" className="border-b border-hairline">
        <div className="rails mx-auto w-full max-w-[1200px]">
          <FadeUp className="px-5 py-16 text-center">
            <span className="eyebrow justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" /> {t.featuresEyebrow}
            </span>
            <h2 className="mx-auto mt-6 max-w-[560px] text-[30px] leading-[1.1] font-semibold tracking-[-0.02em] text-balance sm:text-[38px]">
              {t.featuresH2}
            </h2>
          </FadeUp>

          <div className="grid border-t border-hairline md:grid-cols-2">
            <FadeLeft className="group relative flex min-h-[340px] items-center justify-center overflow-hidden border-b border-hairline p-8 md:border-r md:border-b-0">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 transition-opacity duration-500 group-hover:opacity-100" />
              <img
                src={vetor01}
                alt={t.featureAlt1}
                className="relative z-10 max-h-[280px] w-auto object-contain transition-all duration-700 ease-out group-hover:-translate-y-2 group-hover:scale-105"
              />
            </FadeLeft>
            <FadeRight>
              <ProductCopy {...t.block1} />
            </FadeRight>
          </div>

          <div className="grid border-t border-hairline md:grid-cols-2">
            <FadeLeft>
              <ProductCopy {...t.block2} />
            </FadeLeft>
            <FadeRight className="group relative flex min-h-[340px] items-center justify-center overflow-hidden border-t border-hairline p-8 md:border-t-0 md:border-l">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 transition-opacity duration-500 group-hover:opacity-100" />
              <img
                src={vetor02}
                alt={t.featureAlt2}
                className="relative z-10 max-h-[280px] w-auto object-contain transition-all duration-700 ease-out group-hover:-translate-y-2 group-hover:scale-105"
              />
            </FadeRight>
          </div>

          <div className="grid border-t border-hairline md:grid-cols-2">
            <FadeLeft className="group relative flex min-h-[340px] items-center justify-center overflow-hidden border-b border-hairline p-8 md:border-r md:border-b-0">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 transition-opacity duration-500 group-hover:opacity-100" />
              <img
                src={vetor03}
                alt={t.featureAlt3}
                className="relative z-10 max-h-[280px] w-auto object-contain transition-all duration-700 ease-out group-hover:-translate-y-2 group-hover:scale-105"
              />
            </FadeLeft>
            <FadeRight>
              <ProductCopy {...t.block3} />
            </FadeRight>
          </div>
        </div>
      </section>

      <section className="border-b border-hairline">
        <div className="rails mx-auto w-full max-w-[1200px]">
          <FadeUp className="px-5 py-16 text-center">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground" /> {t.solutionEyebrow}
            </span>
            <h2 className="mx-auto mt-6 max-w-[560px] text-[30px] leading-[1.1] font-semibold tracking-[-0.02em] text-balance sm:text-[38px]">
              {t.solutionH2}
            </h2>
            <p className="mx-auto mt-4 max-w-[480px] text-[13.5px] leading-[1.6] text-muted-foreground">
              {t.solutionP}
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 border-t border-hairline md:grid-cols-3">
            <FadeLeft className="grid grid-cols-1 sm:grid-cols-2 md:order-1 md:col-span-1 md:grid-cols-1">
              {t.solutionCells.slice(0, 2).map((c) => (
                <Cell key={c.title} {...c} />
              ))}
            </FadeLeft>

            <FadeUp
              delay={0.15}
              className="order-3 flex min-h-[300px] items-center justify-center border-t border-hairline p-2 md:order-2 md:border-x md:border-t-0"
            >
              <img
                src={goatLoading}
                alt="GOAT Anticheat"
                className="h-auto w-full max-w-[900px] object-contain opacity-95 drop-shadow-[0_0_60px_rgba(255,255,255,0.1)]"
              />
            </FadeUp>

            <FadeRight className="order-2 grid grid-cols-1 sm:grid-cols-2 md:order-3 md:grid-cols-1">
              {t.solutionCells.slice(2).map((c) => (
                <Cell key={c.title} {...c} />
              ))}
            </FadeRight>
          </div>
        </div>
      </section>

      <AnticheatFAQ />

      <CTA />
      <Footer />
    </main>
  );
}

function ProductCopy({ title, body, items }: { title: string; body: string; items: string[] }) {
  return (
    <div className="flex flex-col justify-center p-8 sm:p-12">
      <h3 className="max-w-[340px] text-[28px] leading-[1.1] font-semibold tracking-[-0.03em] text-balance sm:text-[32px]">
        {title}
      </h3>
      <p className="mt-4 max-w-[340px] text-[13.5px] leading-[1.6] text-muted-foreground">{body}</p>
      <ul className="mt-6 space-y-3">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-2.5 text-[13px] text-muted-foreground">
            <span className="mt-[2px] grid h-4 w-4 shrink-0 place-items-center rounded-full bg-gold/15">
              <Check className="h-2.5 w-2.5 text-gold" strokeWidth={3} />
            </span>
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Cell({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-b border-hairline p-7 last:border-b-0">
      <h3 className="text-[15px] font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-[13px] leading-[1.6] text-muted-foreground">{body}</p>
    </div>
  );
}

function AnticheatFAQ() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="border-b border-hairline">
      <div className="rails mx-auto grid w-full max-w-[1200px] md:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <FadeLeft className="flex flex-col justify-between border-hairline md:border-r">
          <div className="p-8">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" /> {t.faqEyebrow}
            </span>
            <h2 className="mt-4 text-[32px] leading-[1.08] font-semibold tracking-[-0.03em]">
              {t.faqH2}
            </h2>
            <p className="mt-3 max-w-[260px] text-[13px] leading-[1.6] text-muted-foreground">
              {t.faqP}
            </p>
          </div>
        </FadeLeft>
        <div>
          {t.faqs.map((f, i) => (
            <FadeUp key={f.q} delay={i * 0.05}>
              <div className="border-b border-hairline last:border-b-0">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-6 px-8 py-6 text-left"
                >
                  <span className="text-[14px] font-medium">{f.q}</span>
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                    <Plus
                      className={`h-3 w-3 transition-transform ${open === i ? "rotate-45" : ""}`}
                    />
                  </span>
                </button>
                {open === i && (
                  <p className="animate-rise px-8 pb-6 text-[13px] leading-[1.6] text-muted-foreground">
                    {f.a}
                  </p>
                )}
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
