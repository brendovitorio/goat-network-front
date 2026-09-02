import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Rocket,
  Mail,
  Users,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
  LogIn,
} from "lucide-react";
import { Nav } from "@/components/goatlanding/Nav";
import { Footer } from "@/components/goatlanding/Sections";
import { FadeUp, FadeLeft } from "@/components/goatlanding/animations";
import { MriButton } from "@/components/ui/MriButton";
import { MriCard } from "@/components/ui/MriCard";
import { MriInput, MriTextarea } from "@/components/ui/MriInput";
import { api, UserProfile, SystemOrderItem } from "@/lib/goat-api";
import { useLanguage } from "@/i18n/LanguageContext";

type ProjectType = SystemOrderItem["projectType"];

type Copy = {
  pageTitle: string;
  eyebrow: string;
  h1Before: string;
  h1Highlight: string;
  h1After: string;
  subtitle: string;
  perks: { icon: "rocket" | "mail" | "users" | "shield"; title: string; body: string }[];
  formHeading: string;
  formSubheading: string;
  nameLabel: string;
  companyLabel: string;
  phoneLabel: string;
  typeLabel: string;
  types: Record<ProjectType, string>;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  budgetLabel: string;
  budgetPlaceholder: string;
  timelineLabel: string;
  timelinePlaceholder: string;
  submitIdle: string;
  submitBusy: string;
  loginRequiredTitle: string;
  loginRequiredBody: string;
  loginCta: string;
  checkingAuth: string;
  successTitle: string;
  successBody: (email: string) => string;
  successAnother: string;
  errorGeneric: string;
  errorNameDescription: string;
};

const pt: Copy = {
  pageTitle: "Encomendar um sistema — Goat Network",
  eyebrow: "Sistemas sob encomenda",
  h1Before: "Seu ",
  h1Highlight: "sistema, app ou site",
  h1After: ", construído do jeito certo.",
  subtitle:
    "A mesma equipe por trás do GOAT Anticheat constrói sistemas web, aplicativos e sites sob medida pra empresas. Conta o que você precisa — a gente analisa e volta com uma proposta.",
  perks: [
    {
      icon: "rocket",
      title: "Do zero ou evoluindo o que já existe",
      body: "Sistemas novos, apps, sites institucionais ou e-commerce, automações — ou melhorias em algo que você já tem.",
    },
    {
      icon: "mail",
      title: "Resposta no seu e-mail",
      body: "Toda proposta e atualização vai direto pro e-mail da sua conta — sem depender de acompanhar um ticket.",
    },
    {
      icon: "users",
      title: "Time sênior, sem intermediário",
      body: "Você fala direto com quem vai construir e decidir o preço, sem camadas de vendas no meio.",
    },
    {
      icon: "shield",
      title: "Sem compromisso pra pedir orçamento",
      body: "Manda os detalhes do projeto, a gente analisa e te passa um valor — só depois disso você decide.",
    },
  ],
  formHeading: "Conta seu projeto",
  formSubheading: "Quanto mais detalhe, mais rápido a gente consegue te dar um valor certeiro.",
  nameLabel: "Seu nome *",
  companyLabel: "Empresa (opcional)",
  phoneLabel: "WhatsApp / telefone (opcional)",
  typeLabel: "Tipo de projeto",
  types: {
    web_system: "Sistema web",
    mobile_app: "Aplicativo mobile",
    website: "Site institucional / landing page",
    ecommerce: "E-commerce",
    automation_bot: "Automação / bot",
    other: "Outro",
  },
  descriptionLabel: "Descreva o projeto *",
  descriptionPlaceholder:
    "O que o sistema/app/site precisa fazer, pra quem é, funcionalidades principais, referências...",
  budgetLabel: "Faixa de orçamento (opcional)",
  budgetPlaceholder: "Ex: R$ 5.000 - R$ 15.000",
  timelineLabel: "Prazo desejado (opcional)",
  timelinePlaceholder: "Ex: em até 2 meses",
  submitIdle: "Enviar encomenda",
  submitBusy: "Enviando...",
  loginRequiredTitle: "Entre pra encomendar",
  loginRequiredBody:
    "Pra garantir que a resposta chegue certinho no seu e-mail, é preciso ter uma conta na Goat Network (Discord ou Google).",
  loginCta: "Entrar pra continuar",
  checkingAuth: "Verificando sua conta...",
  successTitle: "Encomenda enviada!",
  successBody: (email) =>
    `Vamos analisar e responder em ${email}. Você também pode acompanhar em "Minhas Encomendas".`,
  successAnother: "Enviar outra encomenda",
  errorGeneric: "Erro ao enviar encomenda. Tente novamente.",
  errorNameDescription: "Preencha seu nome e a descrição do projeto.",
};

const en: Copy = {
  pageTitle: "Order a custom system — Goat Network",
  eyebrow: "Custom software",
  h1Before: "Your ",
  h1Highlight: "system, app or site",
  h1After: ", built the right way.",
  subtitle:
    "The same team behind GOAT Anticheat builds custom web systems, apps and sites for businesses. Tell us what you need — we'll review it and come back with a proposal.",
  perks: [
    {
      icon: "rocket",
      title: "From scratch or building on what you have",
      body: "New systems, apps, institutional sites or e-commerce, automations — or improvements to something you already run.",
    },
    {
      icon: "mail",
      title: "Replies in your inbox",
      body: "Every proposal and update goes straight to your account's email — no ticket to babysit.",
    },
    {
      icon: "users",
      title: "Senior team, no middleman",
      body: "You talk directly to whoever builds it and prices it, no sales layer in between.",
    },
    {
      icon: "shield",
      title: "No commitment to ask for a quote",
      body: "Send the project details, we review it and send you a price — you decide after that.",
    },
  ],
  formHeading: "Tell us about your project",
  formSubheading: "The more detail you give us, the faster we can send an accurate quote.",
  nameLabel: "Your name *",
  companyLabel: "Company (optional)",
  phoneLabel: "WhatsApp / phone (optional)",
  typeLabel: "Project type",
  types: {
    web_system: "Web system",
    mobile_app: "Mobile app",
    website: "Institutional site / landing page",
    ecommerce: "E-commerce",
    automation_bot: "Automation / bot",
    other: "Other",
  },
  descriptionLabel: "Describe the project *",
  descriptionPlaceholder:
    "What the system/app/site needs to do, who it's for, main features, references...",
  budgetLabel: "Budget range (optional)",
  budgetPlaceholder: "E.g: $1,000 - $3,000",
  timelineLabel: "Desired timeline (optional)",
  timelinePlaceholder: "E.g: within 2 months",
  submitIdle: "Send request",
  submitBusy: "Sending...",
  loginRequiredTitle: "Sign in to request a quote",
  loginRequiredBody:
    "To make sure the reply reaches the right inbox, you need a Goat Network account (Discord or Google).",
  loginCta: "Sign in to continue",
  checkingAuth: "Checking your account...",
  successTitle: "Request sent!",
  successBody: (email) =>
    `We'll review it and reply at ${email}. You can also track it under "My Orders".`,
  successAnother: "Send another request",
  errorGeneric: "Error sending request. Please try again.",
  errorNameDescription: "Fill in your name and the project description.",
};

const iconFor = { rocket: Rocket, mail: Mail, users: Users, shield: ShieldCheck } as const;

const emptyForm = {
  name: "",
  company: "",
  phone: "",
  projectType: "web_system" as ProjectType,
  description: "",
  budgetRange: "",
  timeline: "",
};

export default function OrderSystemPage() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  const navigate = useNavigate();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [me, setMe] = useState<UserProfile | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ email: string } | null>(null);

  useEffect(() => {
    document.title = t.pageTitle;
  }, [lang, t.pageTitle]);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("goat_auth_token");
      if (!token) {
        setCheckingAuth(false);
        return;
      }
      const profile = await api.getMe();
      setMe(profile);
      if (profile?.username && !form.name) {
        setForm((f) => ({ ...f, name: profile.username }));
      }
      setCheckingAuth(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.description.trim()) {
      setError(t.errorNameDescription);
      return;
    }
    setSubmitting(true);
    try {
      await api.systemOrders.create({
        name: form.name.trim(),
        company: form.company.trim() || undefined,
        phone: form.phone.trim() || undefined,
        projectType: form.projectType,
        description: form.description.trim(),
        budgetRange: form.budgetRange.trim() || undefined,
        timeline: form.timeline.trim() || undefined,
      });
      setSuccess({ email: me?.email || "" });
      setForm({ ...emptyForm, name: form.name });
    } catch (err: any) {
      setError(err.message || t.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Nav />

      <section className="pt-32 pb-16">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <FadeUp>
            <span className="eyebrow justify-center">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
              </span>
              {t.eyebrow}
            </span>
            <h1 className="mx-auto mt-5 max-w-[720px] text-[36px] leading-[1.1] font-semibold tracking-[-0.02em] text-balance sm:text-[46px]">
              {t.h1Before}
              <span className="text-gold">{t.h1Highlight}</span>
              {t.h1After}
            </h1>
            <p className="mx-auto mt-5 max-w-[560px] text-[14.5px] leading-[1.6] text-muted-foreground">
              {t.subtitle}
            </p>
          </FadeUp>

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
            {t.perks.map((perk, i) => {
              const Icon = iconFor[perk.icon];
              return (
                <FadeUp key={perk.title} delay={i * 0.06}>
                  <MriCard className="h-full text-left">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold/10 text-gold">
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="mt-3 text-[13.5px] font-semibold text-foreground">{perk.title}</p>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                      {perk.body}
                    </p>
                  </MriCard>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-2xl px-6">
          {checkingAuth ? (
            <div className="rounded-2xl border border-border/50 bg-card/40 p-10 text-center text-sm text-muted-foreground">
              {t.checkingAuth}
            </div>
          ) : !me ? (
            <FadeUp>
              <MriCard className="p-10 text-center">
                <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-gold/10 text-gold">
                  <LogIn className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-lg font-semibold">{t.loginRequiredTitle}</h2>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {t.loginRequiredBody}
                </p>
                <MriButton
                  variant="solid"
                  className="mt-6 rounded-lg px-6 py-2.5 text-sm"
                  onClick={() => navigate("/auth?next=/encomendar")}
                >
                  {t.loginCta}
                </MriButton>
              </MriCard>
            </FadeUp>
          ) : success ? (
            <FadeUp>
              <MriCard className="p-10 text-center">
                <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-lg font-semibold">{t.successTitle}</h2>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {t.successBody(success.email || me.email || "—")}
                </p>
                <MriButton
                  variant="outline"
                  className="mt-6 rounded-lg px-6 py-2.5 text-sm"
                  onClick={() => setSuccess(null)}
                >
                  {t.successAnother}
                </MriButton>
              </MriCard>
            </FadeUp>
          ) : (
            <FadeLeft>
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-border/50 bg-card/40 p-8"
              >
                <h2 className="text-base font-semibold text-foreground">{t.formHeading}</h2>
                <p className="mt-1 text-[12.5px] text-muted-foreground">{t.formSubheading}</p>

                {error && (
                  <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-medium text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <MriInput
                    label={t.nameLabel}
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                  <MriInput
                    label={t.companyLabel}
                    value={form.company}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  />
                  <MriInput
                    label={t.phoneLabel}
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                      {t.typeLabel}
                    </span>
                    <select
                      value={form.projectType}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, projectType: e.target.value as ProjectType }))
                      }
                      className="w-full rounded-lg border border-border bg-card/60 px-3 py-2 text-[13px] text-foreground outline-none transition-colors focus:border-gold/50"
                    >
                      {(Object.keys(t.types) as ProjectType[]).map((key) => (
                        <option key={key} value={key}>
                          {t.types[key]}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-4">
                  <MriTextarea
                    label={t.descriptionLabel}
                    placeholder={t.descriptionPlaceholder}
                    rows={6}
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    required
                  />
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <MriInput
                    label={t.budgetLabel}
                    placeholder={t.budgetPlaceholder}
                    value={form.budgetRange}
                    onChange={(e) => setForm((f) => ({ ...f, budgetRange: e.target.value }))}
                  />
                  <MriInput
                    label={t.timelineLabel}
                    placeholder={t.timelinePlaceholder}
                    value={form.timeline}
                    onChange={(e) => setForm((f) => ({ ...f, timeline: e.target.value }))}
                  />
                </div>

                <MriButton
                  type="submit"
                  variant="solid"
                  disabled={submitting}
                  className="mt-7 w-full rounded-lg py-3 text-sm"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {submitting ? t.submitBusy : t.submitIdle}
                </MriButton>
              </form>
            </FadeLeft>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
