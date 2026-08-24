import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ArrowRight,
  Server,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Upload,
  ArrowLeft,
} from "lucide-react";
import { Nav } from "@/components/goatlanding/Nav";
import { api, PlanItem } from "@/lib/goat-api";
import { useLanguage } from "@/i18n/LanguageContext";

const formatBRL = (amount: number) => `R$ ${amount.toFixed(2).replace(".", ",")}`;

type Copy = {
  pageTitle: string;
  loadingPlan: string;
  badgeLabel: string;
  formTitle: string;
  formSubtitle: string;
  includedInPlan: string;
  orderSummary: string;
  planLabel: string;
  periodLabel: string;
  subtotalLabel: string;
  orderTotalLabel: string;
  termsPrefix: string;
  termsLinkLabel: string;
  submitLoading: string;
  submitCta: string;
  stripeNote: string;
  confirmingTitle: string;
  confirmingSubtitle: string;
  paymentConfirmedTitle: string;
  paymentConfirmedSubtitle: string;
  setupServerCta: string;
  reg1Title: string;
  step1of2: string;
  serverNameLabel: string;
  serverNamePlaceholder: string;
  logoLabel: string;
  uploadClickLabel: string;
  nextStepCta: string;
  reg2Title: string;
  step2of2: string;
  cfxCodeLabel: string;
  cfxCodePlaceholder: string;
  cfxCodeHint: string;
  serverIpLabel: string;
  serverIpPlaceholder: string;
  finalizeLoading: string;
  finalizeCta: string;
  processingTitle: string;
  processingSubtitle: string;
  successTitle: string;
  successSubtitle: string;
  periodOneTime: string;
  periodAnnual: string;
  periodMonthly: string;
  periodEvery: (count: number, unit: "year" | "month") => string;
  errorPaymentNotCompleted: string;
  errorStillConfirming: string;
  errorCheckoutStart: string;
  errorServerNameRequired: string;
  errorInvalidOrder: string;
  errorRegisterServerFallback: string;
};

const pt: Copy = {
  pageTitle: "Checkout — Goat Network",
  loadingPlan: "Carregando plano...",
  badgeLabel: "Checkout & Setup",
  formTitle: "Finalizar compra",
  formSubtitle: "Complete as informações abaixo para prosseguir.",
  includedInPlan: "Incluído no plano:",
  orderSummary: "Resumo do pedido",
  planLabel: "Plano",
  periodLabel: "Período",
  subtotalLabel: "Subtotal",
  orderTotalLabel: "Total do pedido",
  termsPrefix: "Concordo com os",
  termsLinkLabel: "termos de uso",
  submitLoading: "Redirecionando para a Stripe...",
  submitCta: "Ir para pagamento seguro",
  stripeNote: "Pagamento processado pela Stripe. Não armazenamos dados do seu cartão.",
  confirmingTitle: "Confirmando seu pagamento...",
  confirmingSubtitle: "A Stripe está processando. Isso leva só alguns segundos.",
  paymentConfirmedTitle: "Pagamento Confirmado!",
  paymentConfirmedSubtitle:
    "A licença está reservada. Agora precisamos configurar as credenciais do seu servidor.",
  setupServerCta: "Configurar Servidor agora",
  reg1Title: "Perfil do Servidor",
  step1of2: "Passo 1 de 2",
  serverNameLabel: "Nome do Servidor *",
  serverNamePlaceholder: "Ex: Hype RP",
  logoLabel: "Logo (Opcional)",
  uploadClickLabel: "Clique para fazer upload",
  nextStepCta: "Próximo passo",
  reg2Title: "Conexão Técnica",
  step2of2: "Passo 2 de 2",
  cfxCodeLabel: "Código CFX (Opcional)",
  cfxCodePlaceholder: "Ex: cfx.re/join/xxxxxx",
  cfxCodeHint: "Necessário para monitoramento live dos jogadores.",
  serverIpLabel: "IP do Servidor (Opcional)",
  serverIpPlaceholder: "Ex: 177.10.20.30:30120",
  finalizeLoading: "Processando...",
  finalizeCta: "Finalizar Instalação",
  processingTitle: "Ativando sua licença...",
  processingSubtitle: "Vinculando ao seu servidor. Isso leva só alguns segundos.",
  successTitle: "Servidor Blindado!",
  successSubtitle:
    "Sua licença foi ativada com sucesso. Redirecionando você para o dashboard em instantes...",
  periodOneTime: "Pagamento único",
  periodAnnual: "Anual",
  periodMonthly: "Mensal",
  periodEvery: (count, unit) => `A cada ${count} ${unit === "year" ? "anos" : "meses"}`,
  errorPaymentNotCompleted: "O pagamento não foi concluído. Tente novamente.",
  errorStillConfirming: "Ainda confirmando seu pagamento com a Stripe. Atualize a página em instantes.",
  errorCheckoutStart: "Erro ao iniciar o checkout.",
  errorServerNameRequired: "Por favor, informe o nome do servidor.",
  errorInvalidOrder: "Pedido inválido. Reinicie o processo.",
  errorRegisterServerFallback: "Erro ao registrar servidor.",
};

const en: Copy = {
  pageTitle: "Checkout — Goat Network",
  loadingPlan: "Loading plan...",
  badgeLabel: "Checkout & Setup",
  formTitle: "Complete your purchase",
  formSubtitle: "Fill in the information below to proceed.",
  includedInPlan: "Included in the plan:",
  orderSummary: "Order summary",
  planLabel: "Plan",
  periodLabel: "Billing period",
  subtotalLabel: "Subtotal",
  orderTotalLabel: "Order total",
  termsPrefix: "I agree to the",
  termsLinkLabel: "terms of use",
  submitLoading: "Redirecting to Stripe...",
  submitCta: "Go to secure payment",
  stripeNote: "Payment processed by Stripe. We don't store your card data.",
  confirmingTitle: "Confirming your payment...",
  confirmingSubtitle: "Stripe is processing it. This only takes a few seconds.",
  paymentConfirmedTitle: "Payment Confirmed!",
  paymentConfirmedSubtitle:
    "Your license is reserved. Now we need to set up your server's credentials.",
  setupServerCta: "Set Up Server Now",
  reg1Title: "Server Profile",
  step1of2: "Step 1 of 2",
  serverNameLabel: "Server Name *",
  serverNamePlaceholder: "e.g. Hype RP",
  logoLabel: "Logo (Optional)",
  uploadClickLabel: "Click to upload",
  nextStepCta: "Next step",
  reg2Title: "Technical Connection",
  step2of2: "Step 2 of 2",
  cfxCodeLabel: "CFX Code (Optional)",
  cfxCodePlaceholder: "e.g. cfx.re/join/xxxxxx",
  cfxCodeHint: "Required for live player monitoring.",
  serverIpLabel: "Server IP (Optional)",
  serverIpPlaceholder: "e.g. 177.10.20.30:30120",
  finalizeLoading: "Processing...",
  finalizeCta: "Complete Installation",
  processingTitle: "Activating your license...",
  processingSubtitle: "Linking it to your server. This only takes a few seconds.",
  successTitle: "Server Protected!",
  successSubtitle: "Your license was activated successfully. Redirecting you to the dashboard shortly...",
  periodOneTime: "One-time payment",
  periodAnnual: "Annual",
  periodMonthly: "Monthly",
  periodEvery: (count, unit) => `Every ${count} ${unit === "year" ? "years" : "months"}`,
  errorPaymentNotCompleted: "The payment was not completed. Please try again.",
  errorStillConfirming: "Still confirming your payment with Stripe. Please refresh the page in a moment.",
  errorCheckoutStart: "Error starting checkout.",
  errorServerNameRequired: "Please enter your server name.",
  errorInvalidOrder: "Invalid order. Please restart the process.",
  errorRegisterServerFallback: "Error registering server.",
};

const periodLabel = (plan: PlanItem, t: Copy) => {
  if (plan.mode !== "subscription") return t.periodOneTime;
  if (plan.intervalCount <= 1) return plan.intervalUnit === "year" ? t.periodAnnual : t.periodMonthly;
  return t.periodEvery(plan.intervalCount, plan.intervalUnit ?? "month");
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  // Busca o catálogo real (Produto->Plano) em vez de uma lista fixa - assim
  // um checkout pra qualquer produto novo cadastrado no painel CEO já
  // funciona aqui sem precisar mexer em código.
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [selectedPlan, setSelectedPlan] = useState("goat-anticheat:quarterly");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<
    | "form"
    | "confirming"
    | "payment-confirmed"
    | "registration-1"
    | "registration-2"
    | "processing"
    | "success"
  >("form");
  const [errorMsg, setErrorMsg] = useState("");

  const [serverName, setServerName] = useState("");
  const [logoBase64, setLogoBase64] = useState("");
  const [cfxCode, setCfxCode] = useState("");
  const [ip, setIp] = useState("");
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

  useEffect(() => {
    document.title = t.pageTitle;
  }, [lang]);

  useEffect(() => {
    (async () => {
      const products = await api.getProducts();
      setPlans(products.flatMap((p) => p.plans || []));
    })();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("goat_auth_token");
    if (!token) {
      navigate("/auth");
    }

    // Voltando do Checkout hospedado pela Stripe (success_url) - o pagamento
    // em si ja aconteceu la, aqui so confirmamos com o backend (que so sabe
    // que aprovou depois do webhook da Stripe chegar, por isso o polling).
    const searchParams = new URLSearchParams(window.location.search);
    const orderIdFromUrl = searchParams.get("orderId");
    const stepFromUrl = searchParams.get("step");
    if (orderIdFromUrl && stepFromUrl === "confirming") {
      setPendingOrderId(orderIdFromUrl);
      setStep("confirming");
      window.history.replaceState({}, "", "/checkout");
    }
  }, [navigate]);

  useEffect(() => {
    if (plans.length === 0) return;
    const planFromUrl = new URLSearchParams(window.location.search).get("plan");
    if (!planFromUrl) return;
    // Aceita tanto o code completo ("goat-anticheat:monthly") quanto so a
    // chave curta ("monthly"), pra manter link antigo funcionando.
    const matched = plans.find((p) => p.code === planFromUrl || p.code.endsWith(`:${planFromUrl}`));
    if (matched) setSelectedPlan(matched.code);
  }, [plans]);

  useEffect(() => {
    if (step !== "confirming" || !pendingOrderId) return;

    let attempts = 0;
    const maxAttempts = 30; // ~60s (webhook da Stripe costuma chegar em poucos segundos)
    const interval = setInterval(async () => {
      attempts += 1;
      try {
        const { order } = await api.getOrderStatus(pendingOrderId);
        if (order.status === "approved") {
          clearInterval(interval);
          // Tenta finalizar direto, sem pedir nada - se o cliente já comprou
          // outro produto antes, o backend reaproveita os dados do servidor
          // dele e a licença sai na hora. Só cai no formulário se for
          // realmente a primeira compra dele (needsRegistration).
          try {
            await api.finalizeOrder(pendingOrderId);
            setStep("success");
            setTimeout(() => navigate("/servers"), 2000);
          } catch (finalizeErr: any) {
            if (!finalizeErr?.needsRegistration) console.error(finalizeErr);
            setStep("payment-confirmed");
          }
        } else if (order.status === "failed" || order.status === "cancelled") {
          clearInterval(interval);
          setErrorMsg(t.errorPaymentNotCompleted);
          setStep("form");
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          setErrorMsg(t.errorStillConfirming);
        }
      } catch (err) {
        console.error(err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [step, pendingOrderId, navigate]);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const { checkoutUrl } = await api.createOrder(selectedPlan, "Pending Registration");
      window.location.href = checkoutUrl;
    } catch (err: any) {
      console.error(err);
      setErrorMsg(t.errorCheckoutStart);
      setLoading(false);
    }
  };

  const handleStartRegistration = () => setStep("registration-1");

  const handleNextToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverName.trim()) {
      setErrorMsg(t.errorServerNameRequired);
      return;
    }
    setErrorMsg("");
    setStep("registration-2");
  };

  const handleFinalizeRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingOrderId) {
      setErrorMsg(t.errorInvalidOrder);
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setStep("processing");

    try {
      await api.finalizeOrder(pendingOrderId, {
        serverName,
        logo: logoBase64,
        cfxCode,
        ip,
      });
      setStep("success");
      setTimeout(() => {
        navigate("/servers");
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || t.errorRegisterServerFallback);
      setStep("registration-2");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const currentPlan = plans.find((p) => p.code === selectedPlan) || plans[0];

  if (!currentPlan) {
    return (
      <main className="relative min-h-screen bg-background text-foreground">
        <Nav />
        <div className="pt-40 text-center text-sm text-muted-foreground">{t.loadingPlan}</div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground pb-24">
      <Nav />

      <div className="pt-36 pb-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated/60 px-3.5 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-foreground" />
              {t.badgeLabel}
            </div>
            {step === "form" && (
              <>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {t.formTitle}
                </h1>
                <p className="mt-2 text-[13px] text-muted-foreground max-w-xl mx-auto">
                  {t.formSubtitle}
                </p>
              </>
            )}
          </div>

          {errorMsg && (
            <div className="mt-8 mx-auto max-w-xl flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-medium text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === "form" && (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                onSubmit={handleCreateOrder}
                className="mt-10"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                  <div className="flex-1 space-y-6 text-left">
                    <div className="rounded-2xl border border-border/50 bg-card/40 p-8">
                      <h2 className="text-xl font-semibold text-foreground">{currentPlan.name}</h2>
                      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                        {currentPlan.description}
                      </p>
                      <div className="mt-8 border-t border-border/50 pt-8">
                        <h3 className="text-[13px] font-semibold text-foreground mb-4">
                          {t.includedInPlan}
                        </h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-[12.5px] text-muted-foreground">
                          {currentPlan.features.map((f) => (
                            <li key={f} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-foreground shrink-0 mt-[1px]" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-[400px] shrink-0 text-left">
                    <div className="rounded-2xl border border-border/50 bg-card/40 p-8 sticky top-24">
                      <h3 className="text-base font-semibold text-foreground">{t.orderSummary}</h3>
                      <div className="mt-6 space-y-4 border-y border-border/50 py-6">
                        <div className="flex items-center justify-between text-[13px]">
                          <span className="text-muted-foreground">{t.planLabel}</span>
                          <span className="font-medium text-foreground">{currentPlan.name}</span>
                        </div>
                        <div className="flex items-center justify-between text-[13px]">
                          <span className="text-muted-foreground">{t.periodLabel}</span>
                          <span className="font-medium text-foreground">
                            {periodLabel(currentPlan, t)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[13px]">
                          <span className="text-muted-foreground">{t.subtotalLabel}</span>
                          <span className="font-medium text-foreground">
                            {formatBRL(currentPlan.amount)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-6">
                        <span className="text-[14px] font-semibold text-foreground">
                          {t.orderTotalLabel}
                        </span>
                        <span className="text-lg font-bold text-foreground">
                          {formatBRL(currentPlan.amount)}
                        </span>
                      </div>
                      <p className="-mt-3 mb-6 text-[11px] leading-[1.6] text-muted-foreground">
                        {currentPlan.billingNote}
                      </p>
                      <div className="mb-6 flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="terms"
                          required
                          className="mt-[2px] h-4 w-4 shrink-0 rounded-sm border-border bg-background"
                        />
                        <label
                          htmlFor="terms"
                          className="text-[11.5px] leading-[1.6] text-muted-foreground"
                        >
                          {t.termsPrefix}{" "}
                          <a
                            href="/termos"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-foreground hover:underline"
                          >
                            {t.termsLinkLabel}
                          </a>
                          .
                        </label>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3.5 text-[14px] font-semibold text-background transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                      >
                        {loading ? t.submitLoading : t.submitCta}
                      </button>
                      <p className="mt-3 text-center text-[10.5px] text-muted-foreground">
                        {t.stripeNote}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.form>
            )}

            {step === "confirming" && (
              <motion.div
                key="confirming"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-24 mx-auto max-w-md text-center"
              >
                <RefreshCw className="mx-auto h-12 w-12 animate-spin text-foreground opacity-50" />
                <h3 className="mt-6 text-xl font-medium text-foreground">
                  {t.confirmingTitle}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t.confirmingSubtitle}
                </p>
              </motion.div>
            )}

            {step === "payment-confirmed" && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-16 mx-auto max-w-md text-center rounded-2xl border border-border bg-card/40 p-10"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-background">
                  <Check className="h-8 w-8 stroke-[3]" />
                </div>
                <h2 className="mt-6 text-2xl font-semibold text-foreground">
                  {t.paymentConfirmedTitle}
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  {t.paymentConfirmedSubtitle}
                </p>
                <button
                  onClick={handleStartRegistration}
                  className="mt-8 w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  {t.setupServerCta} <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}

            {step === "registration-1" && (
              <motion.form
                key="reg1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleNextToStep2}
                className="mt-16 mx-auto max-w-lg"
              >
                <div className="rounded-2xl border border-border bg-card/40 p-8 text-left">
                  <div className="mb-8 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">{t.reg1Title}</h2>
                      <p className="text-xs text-muted-foreground mt-1">{t.step1of2}</p>
                    </div>
                    <Server className="h-6 w-6 text-muted-foreground opacity-50" />
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-[13px] font-medium text-foreground mb-2">
                        {t.serverNameLabel}
                      </label>
                      <input
                        type="text"
                        required
                        value={serverName}
                        onChange={(e) => setServerName(e.target.value)}
                        placeholder={t.serverNamePlaceholder}
                        className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition-colors focus:border-foreground/40"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium text-foreground mb-2">
                        {t.logoLabel}
                      </label>
                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/50 py-8 transition-colors hover:bg-border/30">
                        {logoBase64 ? (
                          <img
                            src={logoBase64}
                            alt="Preview"
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center text-muted-foreground">
                            <Upload className="mb-2 h-5 w-5" />
                            <span className="text-xs">{t.uploadClickLabel}</span>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="mt-10 flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background hover:opacity-90"
                    >
                      {t.nextStepCta} <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.form>
            )}

            {step === "registration-2" && (
              <motion.form
                key="reg2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleFinalizeRegistration}
                className="mt-16 mx-auto max-w-lg"
              >
                <div className="rounded-2xl border border-border bg-card/40 p-8 text-left">
                  <div className="mb-8 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">{t.reg2Title}</h2>
                      <p className="text-xs text-muted-foreground mt-1">{t.step2of2}</p>
                    </div>
                    <Server className="h-6 w-6 text-muted-foreground opacity-50" />
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-[13px] font-medium text-foreground mb-2">
                        {t.cfxCodeLabel}
                      </label>
                      <input
                        type="text"
                        value={cfxCode}
                        onChange={(e) => setCfxCode(e.target.value)}
                        placeholder={t.cfxCodePlaceholder}
                        className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition-colors focus:border-foreground/40"
                      />
                      <p className="mt-1.5 text-[11px] text-muted-foreground">
                        {t.cfxCodeHint}
                      </p>
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium text-foreground mb-2">
                        {t.serverIpLabel}
                      </label>
                      <input
                        type="text"
                        value={ip}
                        onChange={(e) => setIp(e.target.value)}
                        placeholder={t.serverIpPlaceholder}
                        className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition-colors focus:border-foreground/40"
                      />
                    </div>
                  </div>

                  <div className="mt-10 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep("registration-1")}
                      className="flex items-center justify-center rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold hover:bg-elevated"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
                    >
                      {loading ? t.finalizeLoading : t.finalizeCta}
                    </button>
                  </div>
                </div>
              </motion.form>
            )}

            {step === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-24 mx-auto max-w-md text-center"
              >
                <RefreshCw className="mx-auto h-12 w-12 animate-spin text-foreground opacity-50" />
                <h3 className="mt-6 text-xl font-medium text-foreground">
                  {t.processingTitle}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t.processingSubtitle}
                </p>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-24 mx-auto max-w-md text-center"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <Check className="h-10 w-10 stroke-[3]" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-foreground">{t.successTitle}</h3>
                <p className="mt-2 text-sm text-muted-foreground mb-8">
                  {t.successSubtitle}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
