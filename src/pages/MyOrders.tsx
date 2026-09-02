import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, LogIn, Clock, MessageSquare } from "lucide-react";
import { Nav } from "@/components/goatlanding/Nav";
import { Footer } from "@/components/goatlanding/Sections";
import { FadeUp } from "@/components/goatlanding/animations";
import { MriButton } from "@/components/ui/MriButton";
import { MriCard } from "@/components/ui/MriCard";
import { api, SystemOrderItem } from "@/lib/goat-api";
import { formatDateTime } from "@/lib/format";
import { useLanguage } from "@/i18n/LanguageContext";

type Copy = {
  pageTitle: string;
  heading: string;
  subheading: string;
  loginRequiredTitle: string;
  loginRequiredBody: string;
  loginCta: string;
  checking: string;
  loading: string;
  empty: string;
  emptyCta: string;
  statuses: Record<SystemOrderItem["status"], string>;
  types: Record<SystemOrderItem["projectType"], string>;
  quotedLabel: string;
  repliesHeading: string;
  noReplies: string;
};

const pt: Copy = {
  pageTitle: "Minhas Encomendas — Goat Network",
  heading: "Minhas Encomendas",
  subheading: "Acompanhe o status e as respostas dos sistemas que você encomendou.",
  loginRequiredTitle: "Entre pra ver suas encomendas",
  loginRequiredBody: "Faça login com Discord ou Google pra acessar essa página.",
  loginCta: "Entrar",
  checking: "Verificando sua conta...",
  loading: "Carregando encomendas...",
  empty: "Você ainda não encomendou nenhum sistema.",
  emptyCta: "Encomendar um sistema",
  statuses: {
    pending: "Recebida",
    analyzing: "Em análise",
    quoted: "Orçamento enviado",
    accepted: "Aceita",
    rejected: "Recusada",
    in_progress: "Em desenvolvimento",
    completed: "Concluída",
  },
  types: {
    web_system: "Sistema web",
    mobile_app: "Aplicativo mobile",
    website: "Site institucional",
    ecommerce: "E-commerce",
    automation_bot: "Automação / bot",
    other: "Outro",
  },
  quotedLabel: "Valor proposto",
  repliesHeading: "Respostas",
  noReplies: "Ainda sem resposta — assim que analisarmos, você recebe um e-mail.",
};

const en: Copy = {
  pageTitle: "My Orders — Goat Network",
  heading: "My Orders",
  subheading: "Track the status and replies for the systems you've ordered.",
  loginRequiredTitle: "Sign in to see your orders",
  loginRequiredBody: "Sign in with Discord or Google to access this page.",
  loginCta: "Sign in",
  checking: "Checking your account...",
  loading: "Loading orders...",
  empty: "You haven't ordered any system yet.",
  emptyCta: "Order a system",
  statuses: {
    pending: "Received",
    analyzing: "Under review",
    quoted: "Quote sent",
    accepted: "Accepted",
    rejected: "Declined",
    in_progress: "In progress",
    completed: "Completed",
  },
  types: {
    web_system: "Web system",
    mobile_app: "Mobile app",
    website: "Institutional site",
    ecommerce: "E-commerce",
    automation_bot: "Automation / bot",
    other: "Other",
  },
  quotedLabel: "Quoted price",
  repliesHeading: "Replies",
  noReplies: "No reply yet — you'll get an email once we've reviewed it.",
};

const statusColor: Record<SystemOrderItem["status"], string> = {
  pending: "border-muted-foreground/30 text-muted-foreground",
  analyzing: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  quoted: "border-gold/30 bg-gold/10 text-gold",
  accepted: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  rejected: "border-red-500/30 bg-red-500/10 text-red-400",
  in_progress: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
};

export default function MyOrdersPage() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<SystemOrderItem[]>([]);

  useEffect(() => {
    document.title = t.pageTitle;
  }, [lang, t.pageTitle]);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("goat_auth_token");
      if (!token) {
        setChecking(false);
        return;
      }
      setAuthorized(true);
      setChecking(false);
      const mine = await api.systemOrders.mine();
      setOrders(mine);
      setLoading(false);
    })();
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground pb-24">
      <Nav />

      <div className="pt-32 pb-12">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-foreground text-background">
              <Briefcase className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t.heading}</h1>
              <p className="text-[12.5px] text-muted-foreground">{t.subheading}</p>
            </div>
          </div>

          {checking ? (
            <p className="mt-10 text-center text-sm text-muted-foreground">{t.checking}</p>
          ) : !authorized ? (
            <FadeUp>
              <MriCard className="mt-10 p-10 text-center">
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
                  onClick={() => navigate("/auth?next=/minhas-encomendas")}
                >
                  {t.loginCta}
                </MriButton>
              </MriCard>
            </FadeUp>
          ) : loading ? (
            <p className="mt-10 text-center text-sm text-muted-foreground">{t.loading}</p>
          ) : orders.length === 0 ? (
            <FadeUp>
              <MriCard className="mt-10 p-10 text-center">
                <p className="text-[13.5px] text-muted-foreground">{t.empty}</p>
                <MriButton
                  variant="outline"
                  className="mt-5 rounded-lg px-6 py-2.5 text-sm"
                  onClick={() => navigate("/encomendar")}
                >
                  {t.emptyCta}
                </MriButton>
              </MriCard>
            </FadeUp>
          ) : (
            <div className="mt-8 space-y-4">
              {orders.map((order, i) => (
                <FadeUp key={order._id} delay={i * 0.05}>
                  <MriCard>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[13.5px] font-semibold text-foreground">
                          {t.types[order.projectType]}
                        </p>
                        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                          {order.requestId}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusColor[order.status]}`}
                      >
                        {t.statuses[order.status]}
                      </span>
                    </div>

                    <p className="mt-3 whitespace-pre-wrap text-[12.5px] leading-relaxed text-muted-foreground">
                      {order.description}
                    </p>

                    {typeof order.quotedPrice === "number" && (
                      <p className="mt-3 text-[13px] font-medium text-gold">
                        {t.quotedLabel}: {order.quotedCurrency || "BRL"}{" "}
                        {order.quotedPrice.toFixed(2)}
                      </p>
                    )}

                    <div className="mt-4 border-t border-border/50 pt-3">
                      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <MessageSquare className="h-3 w-3" /> {t.repliesHeading}
                      </p>
                      {order.messages.length === 0 ? (
                        <p className="mt-2 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                          <Clock className="h-3 w-3" /> {t.noReplies}
                        </p>
                      ) : (
                        <div className="mt-2 space-y-2">
                          {order.messages.map((m, idx) => (
                            <div key={idx} className="rounded-lg bg-elevated/60 p-3">
                              <p className="whitespace-pre-wrap text-[12.5px] text-foreground/90">
                                {m.body}
                              </p>
                              <p className="mt-1 text-[10.5px] text-muted-foreground">
                                {formatDateTime(m.sentAt, lang)}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </MriCard>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
