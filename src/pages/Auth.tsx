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
  heroLine1: string;
  heroLine2: string;
  heroParagraph: string;
  stats: { value: string; label: string }[];
  brandTagline: string;
  welcome: string;
  subtitle: string;
  connecting: string;
  continueWithDiscord: string;
  termsPrefix: string;
  termsLinkLabel: string;
  termsMiddle: string;
  privacyLinkLabel: string;
  termsSuffix: string;
};

const pt: Copy = {
  pageTitle: "Entrar — Goat Network",
  authError: "Falha na autenticação via Discord. Tente novamente.",
  discordLoginError: "Erro ao iniciar login via Discord.",
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
  subtitle: "Entre com sua conta do Discord pra acessar o painel e seus produtos da Goat Network.",
  connecting: "Conectando...",
  continueWithDiscord: "Continuar com Discord",
  termsPrefix: "Ao continuar você concorda com os",
  termsLinkLabel: "Termos de Uso",
  termsMiddle: "e a",
  privacyLinkLabel: "Política de Privacidade",
  termsSuffix: "da Goat Network.",
};

const en: Copy = {
  pageTitle: "Sign in — Goat Network",
  authError: "Discord authentication failed. Please try again.",
  discordLoginError: "Error starting Discord login.",
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
  subtitle: "Sign in with your Discord account to access the dashboard and your Goat Network products.",
  connecting: "Connecting...",
  continueWithDiscord: "Continue with Discord",
  termsPrefix: "By continuing you agree to the",
  termsLinkLabel: "Terms of Use",
  termsMiddle: "and",
  privacyLinkLabel: "Privacy Policy",
  termsSuffix: "of Goat Network.",
};

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
    const code = urlParams.get("code");

    if (code) {
      setLoading(true);
      api
        .handleDiscordCallback(code)
        .then((data) => {
          if (data.user) {
            localStorage.setItem("goat_user", JSON.stringify(data.user));
          }
          if (data.token) {
            localStorage.setItem("goat_auth_token", data.token);
          }
          window.location.href = "/";
        })
        .catch((err) => {
          setErrorMsg(t.authError);
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
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
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
              {t.subtitle}
            </p>

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
