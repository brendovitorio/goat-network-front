import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Copy, Download, KeyRound, LogIn, Radio, Server as ServerIcon } from "lucide-react";
import { Nav } from "@/components/goatlanding/Nav";
import { FadeUp } from "@/components/goatlanding/animations";
import { MriButton } from "@/components/ui/MriButton";
import { MriCard } from "@/components/ui/MriCard";
import { api, ServerProductDashboard } from "@/lib/goat-api";
import { formatDateTime } from "@/lib/format";
import { useLanguage } from "@/i18n/LanguageContext";

type Copy = {
  pageTitle: string;
  back: string;
  loginRequiredTitle: string;
  loginRequiredBody: string;
  loginCta: string;
  checking: string;
  loading: string;
  notFound: string;
  licenseHeading: string;
  licenseKeyLabel: string;
  licenseStatusLabel: string;
  licenseExpiresLabel: string;
  copyKey: string;
  copied: string;
  statusHeading: string;
  serverLabel: string;
  ipLabel: string;
  planLabel: string;
  resourceStatusHeading: string;
  online: string;
  offline: string;
  neverCheckedIn: string;
  lastSeenLabel: string;
  buildIdLabel: string;
  versionLabel: string;
  downloadHeading: string;
  downloadCta: string;
  noDownloadYet: string;
};

const pt: Copy = {
  pageTitle: "Meu Produto — Goat Network",
  back: "Voltar pros meus servidores",
  loginRequiredTitle: "Entre pra ver seu produto",
  loginRequiredBody: "Faça login com Discord ou Google pra acessar essa página.",
  loginCta: "Entrar",
  checking: "Verificando sua conta...",
  loading: "Carregando...",
  notFound: "Servidor não encontrado ou acesso negado.",
  licenseHeading: "Licença",
  licenseKeyLabel: "Chave",
  licenseStatusLabel: "Status",
  licenseExpiresLabel: "Expira em",
  copyKey: "Copiar",
  copied: "Copiado!",
  statusHeading: "Servidor",
  serverLabel: "Nome",
  ipLabel: "Endereço",
  planLabel: "Plano",
  resourceStatusHeading: "Status do resource",
  online: "Online",
  offline: "Offline",
  neverCheckedIn: "Esse resource ainda não fez check-in no backend.",
  lastSeenLabel: "Última vez visto",
  buildIdLabel: "Build",
  versionLabel: "Versão",
  downloadHeading: "Download",
  downloadCta: "Baixar arquivo",
  noDownloadYet: "Nenhum arquivo disponível pra esse produto ainda - entre em contato com o suporte.",
};

const en: Copy = {
  pageTitle: "My Product — Goat Network",
  back: "Back to my servers",
  loginRequiredTitle: "Sign in to see your product",
  loginRequiredBody: "Sign in with Discord or Google to access this page.",
  loginCta: "Sign in",
  checking: "Checking your account...",
  loading: "Loading...",
  notFound: "Server not found or access denied.",
  licenseHeading: "License",
  licenseKeyLabel: "Key",
  licenseStatusLabel: "Status",
  licenseExpiresLabel: "Expires at",
  copyKey: "Copy",
  copied: "Copied!",
  statusHeading: "Server",
  serverLabel: "Name",
  ipLabel: "Address",
  planLabel: "Plan",
  resourceStatusHeading: "Resource status",
  online: "Online",
  offline: "Offline",
  neverCheckedIn: "This resource hasn't checked in with the backend yet.",
  lastSeenLabel: "Last seen",
  buildIdLabel: "Build",
  versionLabel: "Version",
  downloadHeading: "Download",
  downloadCta: "Download file",
  noDownloadYet: "No file available for this product yet - contact support.",
};

export default function ProductDashboardPage() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  const navigate = useNavigate();
  const { serverId } = useParams<{ serverId: string }>();

  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ServerProductDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

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
      if (!serverId) return;
      try {
        const result = await api.getServerProductDashboard(serverId);
        setData(result);
      } catch (err: any) {
        setError(err.message || t.notFound);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverId]);

  const handleCopyKey = () => {
    if (!data?.license?.key) return;
    navigator.clipboard.writeText(data.license.key).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = async () => {
    if (!data?.download || data.download.type === "none") return;
    if (data.download.type === "auto" && data.download.url) {
      window.location.href = data.download.url;
      return;
    }
    if (data.download.type === "legacy" && data.download.planCode) {
      setDownloading(true);
      try {
        await api.downloadProductFile(data.download.planCode, `${data.product.name || "produto"}.zip`);
      } finally {
        setDownloading(false);
      }
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground pb-24">
      <Nav />

      <div className="pt-32 pb-12">
        <div className="mx-auto max-w-2xl px-6">
          <button
            onClick={() => navigate("/servers")}
            className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> {t.back}
          </button>

          {checking ? (
            <p className="mt-10 text-center text-sm text-muted-foreground">{t.checking}</p>
          ) : !authorized ? (
            <FadeUp>
              <MriCard className="mt-8 p-10 text-center">
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
                  onClick={() => navigate("/auth")}
                >
                  {t.loginCta}
                </MriButton>
              </MriCard>
            </FadeUp>
          ) : loading ? (
            <p className="mt-10 text-center text-sm text-muted-foreground">{t.loading}</p>
          ) : error || !data ? (
            <MriCard className="mt-8 p-10 text-center">
              <p className="text-[13.5px] text-muted-foreground">{error || t.notFound}</p>
            </MriCard>
          ) : (
            <div className="mt-6 space-y-4">
              <FadeUp>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-foreground text-background">
                    <ServerIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                      {data.server.name}
                    </h1>
                    <p className="text-[12.5px] text-muted-foreground">
                      {data.product.name || data.server.plan}
                    </p>
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.05}>
                <MriCard>
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <KeyRound className="h-3 w-3" /> {t.licenseHeading}
                  </p>
                  {data.license ? (
                    <div className="mt-3 space-y-2 text-[13px]">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">{t.licenseKeyLabel}</span>
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-secondary px-2 py-1 text-[12px]">
                            {data.license.key}
                          </code>
                          <MriButton variant="ghost" size="icon" onClick={handleCopyKey}>
                            <Copy className="h-3.5 w-3.5" />
                          </MriButton>
                        </div>
                      </div>
                      {copied && <p className="text-right text-[11px] text-emerald-400">{t.copied}</p>}
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{t.licenseStatusLabel}</span>
                        <span className="capitalize">{data.license.status}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{t.licenseExpiresLabel}</span>
                        <span>{formatDateTime(data.license.expiresAt, lang)}</span>
                      </div>
                    </div>
                  ) : null}
                </MriCard>
              </FadeUp>

              <FadeUp delay={0.1}>
                <MriCard>
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <ServerIcon className="h-3 w-3" /> {t.statusHeading}
                  </p>
                  <div className="mt-3 space-y-2 text-[13px]">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t.serverLabel}</span>
                      <span>{data.server.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t.ipLabel}</span>
                      <span>
                        {data.server.ip}:{data.server.port}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t.planLabel}</span>
                      <span>{data.server.plan}</span>
                    </div>
                  </div>
                </MriCard>
              </FadeUp>

              <FadeUp delay={0.15}>
                <MriCard>
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <Radio className="h-3 w-3" /> {t.resourceStatusHeading}
                  </p>
                  {data.deployment ? (
                    <div className="mt-3 space-y-2 text-[13px]">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{t.resourceStatusHeading}</span>
                        <span
                          className={
                            data.deployment.online
                              ? "text-emerald-400 font-medium"
                              : "text-muted-foreground"
                          }
                        >
                          {data.deployment.online ? t.online : t.offline}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{t.lastSeenLabel}</span>
                        <span>{formatDateTime(data.deployment.lastSeen, lang)}</span>
                      </div>
                      {data.deployment.buildId && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">{t.buildIdLabel}</span>
                          <code className="text-[11px]">{data.deployment.buildId}</code>
                        </div>
                      )}
                      {data.deployment.resourceVersion && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">{t.versionLabel}</span>
                          <span>{data.deployment.resourceVersion}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="mt-3 text-[12.5px] text-muted-foreground">{t.neverCheckedIn}</p>
                  )}
                </MriCard>
              </FadeUp>

              <FadeUp delay={0.2}>
                <MriCard>
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <Download className="h-3 w-3" /> {t.downloadHeading}
                  </p>
                  {data.download.type !== "none" ? (
                    <MriButton
                      variant="solid"
                      disabled={downloading}
                      onClick={handleDownload}
                      className="mt-3 rounded-lg px-5 py-2.5 text-sm"
                    >
                      <Download className="h-3.5 w-3.5" /> {t.downloadCta}
                    </MriButton>
                  ) : (
                    <p className="mt-3 text-[12.5px] text-muted-foreground">{t.noDownloadYet}</p>
                  )}
                </MriCard>
              </FadeUp>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
