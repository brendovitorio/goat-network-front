import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import logoAsset from "@/assets/goat2.png";
import { api } from "@/lib/goat-api";
import { useLanguage } from "@/i18n/LanguageContext";
import { MriButton } from "@/components/ui/MriButton";

type Copy = {
  pageTitle: string;
  authError: string;
  discordLoginError: string;
  googleLoginError: string;
  heroLine1: string;
  heroLine2: string;
  heroParagraph: string;
  stats: { value: string; label: string }[];
  brandTagline: string;
  welcome: string;
  subtitle: string;
  connecting: string;
  continueWithDiscord: string;
  continueWithGoogle: string;
  orDivider: string;
  termsPrefix: string;
  termsLinkLabel: string;
  termsMiddle: string;
  privacyLinkLabel: string;
  termsSuffix: string;
};

const pt: Copy = {
  pageTitle: "Entrar — Goat Network",
  authError: "Falha na autenticação. Tente novamente.",
  discordLoginError: "Erro ao iniciar login via Discord.",
  googleLoginError: "Login com Google indisponível no momento.",
  heroLine1: "Sua cidade",
  heroLine2: "merece o melhor.",
  heroParagraph:
    "Catálogo de produtos, pagamento seguro via Stripe e acesso liberado na hora — tudo em um painel feito pra sua staff agir em segundos.",
  stats: [
    { value: "100%", label: "seguro" },
    { value: "Na hora", label: "entrega" },
    { value: "24/7", label: "suporte" },
  ],
  brandTagline: "Goat Network · FiveM Marketplace",
  welcome: "Bem-vindo",
  subtitle: "Entre pra acessar o painel, seus produtos e suas encomendas na Goat Network.",
  connecting: "Conectando...",
  continueWithDiscord: "Continuar com Discord",
  continueWithGoogle: "Continuar com Google",
  orDivider: "ou",
  termsPrefix: "Ao continuar você concorda com os",
  termsLinkLabel: "Termos de Uso",
  termsMiddle: "e a",
  privacyLinkLabel: "Política de Privacidade",
  termsSuffix: "da Goat Network.",
};

const en: Copy = {
  pageTitle: "Sign in — Goat Network",
  authError: "Authentication failed. Please try again.",
  discordLoginError: "Error starting Discord login.",
  googleLoginError: "Google login is unavailable right now.",
  heroLine1: "Your city",
  heroLine2: "deserves the best.",
  heroParagraph:
    "Product catalog, secure payment via Stripe, and instant access — all in a dashboard built for your staff to act in seconds.",
  stats: [
    { value: "100%", label: "secure" },
    { value: "Same-day", label: "delivery" },
    { value: "24/7", label: "support" },
  ],
  brandTagline: "Goat Network · FiveM Marketplace",
  welcome: "Welcome",
  subtitle:
    "Sign in to access the dashboard, your products and your custom orders on Goat Network.",
  connecting: "Connecting...",
  continueWithDiscord: "Continue with Discord",
  continueWithGoogle: "Continue with Google",
  orDivider: "or",
  termsPrefix: "By continuing you agree to the",
  termsLinkLabel: "Terms of Use",
  termsMiddle: "and",
  privacyLinkLabel: "Privacy Policy",
  termsSuffix: "of Goat Network.",
};

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.26v3.11A11.998 11.998 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.26A11.998 11.998 0 0 0 0 12c0 1.94.46 3.77 1.26 5.39l4.01-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.26 6.61l4.01 3.11C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}

export default function AuthPage() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = t.pageTitle;
  }, [lang]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const nextParam = urlParams.get("next");
    if (nextParam) {
      sessionStorage.setItem("goat_auth_next", nextParam);
    }

    const code = urlParams.get("code");
    if (!code) return;

    // O provider ecoa "state" de volta junto com o "code" - usamos isso pra
    // saber se esse callback é do Discord ou do Google (mesma página /auth
    // trata os dois). Sem state, assume Discord (compatibilidade com links
    // antigos que não tinham esse param).
    const state = urlParams.get("state");
    const isGoogle = state === "google";

    setLoading(true);
    const callback = isGoogle ? api.handleGoogleCallback(code) : api.handleDiscordCallback(code);
    callback
      .then((data) => {
        if (data.user) {
          localStorage.setItem("goat_user", JSON.stringify(data.user));
        }
        if (data.token) {
          localStorage.setItem("goat_auth_token", data.token);
        }
        const next = sessionStorage.getItem("goat_auth_next");
        sessionStorage.removeItem("goat_auth_next");
        window.location.href = next || "/";
      })
      .catch((err) => {
        setErrorMsg(t.authError);
        console.error(err);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleDiscordClick = async () => {
    setLoading(true);
    try {
      const url = await api.getDiscordLoginUrl();
      window.location.href = url;
    } catch {
      setErrorMsg(t.discordLoginError);
      setLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    setLoading(true);
    try {
      const url = await api.getGoogleLoginUrl();
      window.location.href = url;
    } catch (err: any) {
      setErrorMsg(err?.message || t.googleLoginError);
      setLoading(false);
    }
  };

  return (
    <main className="relative grid min-h-screen grid-cols-1 bg-background lg:grid-cols-[1fr_560px]">
      <section className="relative hidden overflow-hidden border-r border-border lg:block">
        <div className="bars absolute inset-0 opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <a href="/">
            <img src={logoAsset} alt="GOAT" className="h-8 w-auto" />
          </a>
          <div className="max-w-md">
            <h1 className="text-[clamp(2rem,3vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
              {t.heroLine1}
              <br />
              <span className="text-muted-foreground">{t.heroLine2}</span>
            </h1>
            <p className="mt-5 text-[14.5px] leading-relaxed text-muted-foreground">
              {t.heroParagraph}
            </p>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {t.stats.map(({ value, label }) => (
                <div key={label} className="border-l border-border pl-3">
                  <p className="text-[20px] font-semibold tracking-tight">{value}</p>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {t.brandTagline}
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[380px]">
          <div className="lg:hidden">
            <a href="/">
              <img src={logoAsset} alt="GOAT" className="h-6 w-auto" />
            </a>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="mt-8 text-[26px] font-semibold tracking-tight lg:mt-0">{t.welcome}</h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{t.subtitle}</p>

            {errorMsg && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                {errorMsg}
              </div>
            )}

            <MriButton
              variant="solid"
              onClick={handleDiscordClick}
              disabled={loading}
              className="mt-6 w-full rounded-xl py-3 text-sm"
            >
              <ShieldCheck className="h-4 w-4" />
              {loading ? t.connecting : t.continueWithDiscord}
            </MriButton>

            <div className="mt-4 flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
                {t.orDivider}
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <MriButton
              variant="outline"
              onClick={handleGoogleClick}
              disabled={loading}
              className="mt-4 w-full rounded-xl border-hairline py-3 text-sm"
            >
              <GoogleIcon className="h-4 w-4" />
              {loading ? t.connecting : t.continueWithGoogle}
            </MriButton>

            <p className="mt-8 text-center text-[12px] leading-relaxed text-muted-foreground">
              {t.termsPrefix}{" "}
              <a
                href="/termos"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-foreground hover:underline"
              >
                {t.termsLinkLabel}
              </a>{" "}
              {t.termsMiddle}{" "}
              <a
                href="/privacidade"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-foreground hover:underline"
              >
                {t.privacyLinkLabel}
              </a>{" "}
              {t.termsSuffix}
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
