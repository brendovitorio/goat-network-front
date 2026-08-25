import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Shield,
  BadgeCheck,
  Bell,
  CreditCard,
  Upload,
  Monitor,
  Check,
  Loader2,
  Globe,
  Lock,
  Smartphone,
  Activity,
} from "lucide-react";
import { api, ServerItem, LicenseItem, resolveLicenseForServer } from "@/lib/goat-api";
import { useLanguage } from "@/i18n/LanguageContext";
import { formatDate } from "@/lib/format";
import { useDialog } from "./Dialog";
import { MriCard } from "@/components/ui/MriCard";
import { MriButton } from "@/components/ui/MriButton";
import { MriInput } from "@/components/ui/MriInput";
import { MriTabs, type MriTabItem } from "@/components/ui/MriTabs";

type Copy = {
  loading: string;
  settingsTitle: string;
  settingsSubtitle: string;
  activeServerLabel: string;
  tabInformacoes: string;
  tabSeguranca: string;
  tabLicenca: string;
  tabIntegracoes: string;
  tabFaturas: string;
  changeModalPrefix: string;
  cancel: string;
  save: string;
  changeLogo: string;
  infoSectionLabel: string;
  fieldName: string;
  fieldDescription: string;
  fieldStatus: string;
  serverSectionLabel: string;
  fieldIp: string;
  fieldPort: string;
  fieldCfx: string;
  fieldPlan: string;
  change: string;
  securityTitle: string;
  securitySubtitle: string;
  metric2fa: string;
  metricIpAllowlist: string;
  metricSessions: string;
  metricDevices: string;
  enabled: string;
  notConfigured: string;
  licenseIdLabel: string;
  copied: string;
  copyBtn: string;
  ipAllowlistHeading: string;
  persistedBackend: string;
  ipPlaceholder: string;
  add: string;
  noAuthorizedIps: string;
  remove: string;
  licenseTitle: string;
  licenseSubtitle: string;
  licenseActive: string;
  planLabel: string;
  activatedOn: string;
  validity: string;
  lifetime: string;
  serversLabel: string;
  serversCount: string;
  integrationsTitle: string;
  integrationsSubtitle: string;
  discordWebhookLabel: string;
  apiLabel: string;
  logsLabel: string;
  logsCountSuffix: string;
  externalServicesLabel: string;
  servicesActive: string;
  servicesDisabled: string;
  saveIntegration: string;
  invoicesTitle: string;
  invoicesSubtitle: string;
  itemsSuffix: string;
  noInvoicesFound: string;
  serverFallback: string;
  statusLabel: string;
};

const pt: Copy = {
  loading: "Carregando configurações do servidor...",
  settingsTitle: "Configurações",
  settingsSubtitle: "Gerencie informações, segurança, licença, integrações e faturas do seu servidor.",
  activeServerLabel: "Servidor Ativo:",
  tabInformacoes: "Informações",
  tabSeguranca: "Segurança",
  tabLicenca: "Licença",
  tabIntegracoes: "Integrações",
  tabFaturas: "Faturas",
  changeModalPrefix: "Alterar",
  cancel: "Cancelar",
  save: "Salvar",
  changeLogo: "Trocar logo",
  infoSectionLabel: "Informações",
  fieldName: "Nome",
  fieldDescription: "Descrição",
  fieldStatus: "Status",
  serverSectionLabel: "Servidor",
  fieldIp: "IP",
  fieldPort: "Porta",
  fieldCfx: "CFX",
  fieldPlan: "Plano",
  change: "Alterar",
  securityTitle: "Segurança",
  securitySubtitle: "2FA, IP Allowlist, sessões e dispositivos validados pelo backend.",
  metric2fa: "2FA",
  metricIpAllowlist: "IP Allowlist",
  metricSessions: "Sessões",
  metricDevices: "Dispositivos",
  enabled: "Ativado",
  notConfigured: "Não configurado",
  licenseIdLabel: "LICENSE ID",
  copied: "Copiado!",
  copyBtn: "Copiar",
  ipAllowlistHeading: "Allowlist de IPs",
  persistedBackend: "Persistido no backend",
  ipPlaceholder: "Ex.: 45.12.54.90",
  add: "Adicionar",
  noAuthorizedIps: "Nenhum IP autorizado cadastrado.",
  remove: "Remover",
  licenseTitle: "Licença",
  licenseSubtitle: "Dados ativos vindos do backend.",
  licenseActive: "Ativada",
  planLabel: "Plano",
  activatedOn: "Ativada em",
  validity: "Validade",
  lifetime: "Vitalícia",
  serversLabel: "Servidores",
  serversCount: "1 de 1",
  integrationsTitle: "Integrações",
  integrationsSubtitle: "Discord Webhook, API, logs e serviços externos conectados ao backend.",
  discordWebhookLabel: "Discord Webhook",
  apiLabel: "API",
  logsLabel: "Logs",
  logsCountSuffix: "registros",
  externalServicesLabel: "Serviços externos",
  servicesActive: "Ativos",
  servicesDisabled: "Desativados",
  saveIntegration: "Salvar Integração",
  invoicesTitle: "Faturas",
  invoicesSubtitle: "Histórico real de pedidos do backend.",
  itemsSuffix: "itens",
  noInvoicesFound: "Nenhuma fatura encontrada.",
  serverFallback: "Servidor",
  statusLabel: "Status",
};

const en: Copy = {
  loading: "Loading server settings...",
  settingsTitle: "Settings",
  settingsSubtitle: "Manage your server's information, security, license, integrations, and invoices.",
  activeServerLabel: "Active Server:",
  tabInformacoes: "Information",
  tabSeguranca: "Security",
  tabLicenca: "License",
  tabIntegracoes: "Integrations",
  tabFaturas: "Invoices",
  changeModalPrefix: "Change",
  cancel: "Cancel",
  save: "Save",
  changeLogo: "Change logo",
  infoSectionLabel: "Information",
  fieldName: "Name",
  fieldDescription: "Description",
  fieldStatus: "Status",
  serverSectionLabel: "Server",
  fieldIp: "IP",
  fieldPort: "Port",
  fieldCfx: "CFX",
  fieldPlan: "Plan",
  change: "Change",
  securityTitle: "Security",
  securitySubtitle: "2FA, IP allowlist, sessions, and devices validated by the backend.",
  metric2fa: "2FA",
  metricIpAllowlist: "IP Allowlist",
  metricSessions: "Sessions",
  metricDevices: "Devices",
  enabled: "Enabled",
  notConfigured: "Not configured",
  licenseIdLabel: "LICENSE ID",
  copied: "Copied!",
  copyBtn: "Copy",
  ipAllowlistHeading: "IP Allowlist",
  persistedBackend: "Persisted on the backend",
  ipPlaceholder: "E.g.: 45.12.54.90",
  add: "Add",
  noAuthorizedIps: "No authorized IPs registered.",
  remove: "Remove",
  licenseTitle: "License",
  licenseSubtitle: "Active data from the backend.",
  licenseActive: "Active",
  planLabel: "Plan",
  activatedOn: "Activated on",
  validity: "Validity",
  lifetime: "Lifetime",
  serversLabel: "Servers",
  serversCount: "1 of 1",
  integrationsTitle: "Integrations",
  integrationsSubtitle: "Discord Webhook, API, logs, and external services connected to the backend.",
  discordWebhookLabel: "Discord Webhook",
  apiLabel: "API",
  logsLabel: "Logs",
  logsCountSuffix: "entries",
  externalServicesLabel: "External services",
  servicesActive: "Active",
  servicesDisabled: "Disabled",
  saveIntegration: "Save Integration",
  invoicesTitle: "Invoices",
  invoicesSubtitle: "Real order history from the backend.",
  itemsSuffix: "items",
  noInvoicesFound: "No invoices found.",
  serverFallback: "Server",
  statusLabel: "Status",
};

export function SettingsTabs() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  const dialog = useDialog();
  const [activeTab, setActiveTab] = useState("informacoes");
  const [allServers, setAllServers] = useState<ServerItem[]>([]);
  const [server, setServer] = useState<ServerItem | null>(null);
  const [license, setLicense] = useState<LicenseItem | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [profileData, setProfileData] = useState({
    nome: "GOAT Server",
    logoUrl: "",
    descricao: "Servidor GOAT com proteção ativa e monitoramento em tempo real.",
    username: "@goat",
  });

  const load = async () => {
    setLoading(true);
    try {
      const [serverList, licenseData, userOrders] = await Promise.all([
        api.getServers(),
        api.getLicenses(),
        api.getUserOrders(),
      ]);

      setAllServers(serverList || []);
      setOrders(userOrders || []);

      const activeId = localStorage.getItem("goat_active_server_id");
      let selected = (serverList || []).find((s) => s._id === activeId);

      if (!selected && serverList && serverList.length > 0) {
        selected = serverList[0];
        localStorage.setItem("goat_active_server_id", selected._id);
      }

      setServer(selected || null);

      if (selected) {
        const targetServer = selected;
        setLicense(resolveLicenseForServer(targetServer, licenseData || []));
        setProfileData({
          nome: targetServer.name || "Servidor GOAT",
          username: `@${targetServer.cfxCode || "goat"}`,
          logoUrl: targetServer.logo || "",
          descricao:
            targetServer.description ||
            "Servidor GOAT com proteção ativa e monitoramento em tempo real.",
        });
      } else {
        setLicense(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();

    const handleServerChanged = () => load();
    window.addEventListener("goat_server_changed", handleServerChanged);
    window.addEventListener("storage", handleServerChanged);
    return () => {
      window.removeEventListener("goat_server_changed", handleServerChanged);
      window.removeEventListener("storage", handleServerChanged);
    };
  }, []);

  const tabs: MriTabItem[] = [
    { id: "informacoes", label: t.tabInformacoes, icon: User },
    { id: "seguranca", label: t.tabSeguranca, icon: Shield },
    { id: "licenca", label: t.tabLicenca, icon: BadgeCheck },
    { id: "integracoes", label: t.tabIntegracoes, icon: Bell },
    { id: "faturas", label: t.tabFaturas, icon: CreditCard },
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !server) return;

    const reader = new FileReader();
    reader.onload = async (result) => {
      const dataUrl = result.target?.result as string;
      if (!dataUrl) return;

      setProfileData((prev) => ({ ...prev, logoUrl: dataUrl }));
      setServer({ ...server, logo: dataUrl });

      try {
        await api.updateServerGeneral(server._id, { logo: dataUrl });
      } catch (error) {
        console.error("Erro ao salvar logo:", error);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEditField = async (key: string, label: string, value: string) => {
    if (!server) return;
    const nextValue = await dialog.prompt({
      title: `${t.changeModalPrefix} ${label}`,
      label,
      defaultValue: value,
      confirmLabel: t.save,
      cancelLabel: t.cancel,
    });
    if (nextValue === null) return;

    try {
      const payload: Record<string, string> = {};
      if (key === "nome") payload.name = nextValue;
      if (key === "descricao") payload.description = nextValue;

      if (Object.keys(payload).length > 0) {
        await api.updateServerGeneral(server._id, payload);
        setServer({ ...server, ...payload });
        setProfileData((prev) => ({ ...prev, [key]: nextValue }));
      }
    } catch (error) {
      console.error("Erro ao salvar campo:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center text-muted-foreground text-xs">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Carregando configurações do servidor...
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-foreground font-sans">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Configurações</h1>
            {server && (
              <span className="rounded-md border border-hairline bg-secondary px-2.5 py-0.5 text-[11px] font-mono text-foreground/75">
                {server.name}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Gerencie informações, segurança, licença, integrações e faturas do seu servidor.
          </p>
        </div>

        {allServers.length > 1 && (
          <div className="flex items-center gap-2 rounded-lg border border-hairline bg-elevated px-3 py-1.5 text-xs">
            <span className="text-muted-foreground">Servidor Ativo:</span>
            <select
              value={server?._id || ""}
              onChange={(e) => {
                const newId = e.target.value;
                localStorage.setItem("goat_active_server_id", newId);
                window.dispatchEvent(new Event("goat_server_changed"));
              }}
              className="bg-transparent font-semibold text-foreground outline-none cursor-pointer"
            >
              {allServers.map((s) => (
                <option key={s._id} value={s._id} className="bg-popover text-foreground">
                  {s.name} ({s.ip}:{s.port})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <MriTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="w-full pt-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="w-full"
          >
            {activeTab === "informacoes" && (
              <InformacoesTab
                profileData={profileData}
                server={server}
                onOpenEdit={handleEditField}
                onTriggerFileUpload={() => fileInputRef.current?.click()}
              />
            )}
            {activeTab === "seguranca" && <SegurancaTab server={server} />}
            {activeTab === "licenca" && <LicencaTab server={server} license={license} />}
            {activeTab === "integracoes" && (
              <IntegracoesTab server={server} setServer={setServer} />
            )}
            {activeTab === "faturas" && <FaturasTab orders={orders} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function InformacoesTab({
  profileData,
  server,
  onOpenEdit,
  onTriggerFileUpload,
}: {
  profileData: { nome: string; logoUrl: string; descricao: string; username: string };
  server: ServerItem | null;
  onOpenEdit: (key: string, label: string, value: string) => void;
  onTriggerFileUpload: () => void;
}) {
  const logo = profileData.logoUrl || server?.logo;

  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;

  return (
    <div className="space-y-4 w-full">
      <MriCard className="w-full p-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-hairline bg-elevated/60 text-muted-foreground shadow-inner shrink-0">
            {logo ? (
              <img src={logo} alt={profileData.nome} className="h-full w-full object-cover" />
            ) : (
              <Monitor className="h-9 w-9 text-foreground/75" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-foreground tracking-tight truncate">
              {profileData.nome}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">{profileData.username}</p>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              {profileData.descricao}
            </p>
            <MriButton
              variant="ghost"
              size="sm"
              onClick={onTriggerFileUpload}
              className="mt-3 px-0 py-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
            >
              <Upload className="h-3.5 w-3.5" />
              {t.changeLogo}
            </MriButton>
          </div>
        </div>
      </MriCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <MriCard className="p-5 space-y-4">
          <span className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground block">
            {t.infoSectionLabel}
          </span>

          <InfoRow
            label={t.fieldName}
            value={server?.name || profileData.nome}
            onEdit={() => onOpenEdit("nome", t.fieldName, server?.name || profileData.nome)}
          />
          <InfoRow
            label={t.fieldDescription}
            value={server?.description || profileData.descricao}
            onEdit={() =>
              onOpenEdit(
                "descricao",
                t.fieldDescription,
                server?.description || profileData.descricao,
              )
            }
          />
          <InfoRow label={t.fieldStatus} value={server?.status ? server.status.toUpperCase() : "ONLINE"} />
        </MriCard>

        <MriCard className="p-5 space-y-4">
          <span className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground block">
            {t.serverSectionLabel}
          </span>

          <InfoRow label={t.fieldIp} value={server?.ip || "127.0.0.1"} />
          <InfoRow label={t.fieldPort} value={String(server?.port || 30120)} />
          <InfoRow label={t.fieldCfx} value={server?.cfxCode || "—"} />
          <InfoRow label={t.fieldPlan} value={String(server?.plan || "pro").toUpperCase()} />
        </MriCard>
      </div>
    </div>
  );
}

function SegurancaTab({ server }: { server: ServerItem | null }) {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  const [keyCopied, setKeyCopied] = useState(false);
  const [newIp, setNewIp] = useState("");
  const [busy, setBusy] = useState(false);

  const allowedIps = server?.security?.authorizedIps ?? [];
  const accessLogs = server?.security?.accessLogs ?? [];

  const persistIps = async (ips: string[]) => {
    if (!server) return;
    setBusy(true);
    try {
      await api.updateServerSecurity(server._id, { authorizedIps: ips });
      server.security = { ...(server.security ?? {}), authorizedIps: ips };
    } finally {
      setBusy(false);
    }
  };

  const addIp = async () => {
    const trimmed = newIp.trim();
    if (!trimmed || !server) return;
    const next = Array.from(new Set([...allowedIps, trimmed]));
    await persistIps(next);
    setNewIp("");
  };

  const removeIp = async (ip: string) => {
    const next = allowedIps.filter((item) => item !== ip);
    await persistIps(next);
  };

  return (
    <div className="w-full space-y-4">
      <MriCard className="w-full p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{t.securityTitle}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{t.securitySubtitle}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricBox
            label={t.metric2fa}
            value={server?.security?.twoFactorEnabled ? t.enabled : t.notConfigured}
            icon={Lock}
          />
          <MetricBox label={t.metricIpAllowlist} value={`${allowedIps.length} IPs`} icon={Globe} />
          <MetricBox label={t.metricSessions} value={`${accessLogs.length}`} icon={Smartphone} />
          <MetricBox label={t.metricDevices} value={`${allowedIps.length || 0}`} icon={Activity} />
        </div>

        <MriCard className="flex items-center justify-between gap-4 border-hairline bg-elevated/60">
          <div>
            <span className="text-[11px] font-semibold uppercase text-muted-foreground">
              {t.licenseIdLabel}
            </span>
            <p className="text-xs font-mono text-emerald-400 mt-1 break-all">
              {server?.licenseKey || "—"}
            </p>
          </div>
          <MriButton
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(server?.licenseKey || "");
              setKeyCopied(true);
              setTimeout(() => setKeyCopied(false), 2000);
            }}
          >
            {keyCopied ? t.copied : t.copyBtn}
          </MriButton>
        </MriCard>

        <MriCard className="space-y-3 border-hairline bg-elevated/60">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-[11px] font-semibold uppercase text-muted-foreground">
              {t.ipAllowlistHeading}
            </h4>
            <span className="text-[10px] text-muted-foreground">{t.persistedBackend}</span>
          </div>

          <div className="flex gap-2">
            <MriInput
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
              placeholder={t.ipPlaceholder}
              className="rounded-md bg-background px-3 py-2 text-xs"
            />
            <MriButton variant="outline" size="sm" onClick={addIp} disabled={busy}>
              {t.add}
            </MriButton>
          </div>

          {allowedIps.length === 0 ? (
            <p className="text-xs text-muted-foreground">{t.noAuthorizedIps}</p>
          ) : (
            <div className="space-y-2">
              {allowedIps.map((ip) => (
                <div
                  key={ip}
                  className="flex items-center justify-between rounded-md border border-hairline bg-background px-3 py-2"
                >
                  <span className="text-xs text-foreground/75 font-mono">{ip}</span>
                  <button
                    onClick={() => removeIp(ip)}
                    className="text-[10px] uppercase tracking-[0.12em] text-red-400 hover:text-red-300"
                  >
                    {t.remove}
                  </button>
                </div>
              ))}
            </div>
          )}
        </MriCard>
      </MriCard>
    </div>
  );
}

function LicencaTab({
  server,
  license,
}: {
  server: ServerItem | null;
  license: LicenseItem | null;
}) {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  const formatDate = (raw?: string) => {
    if (!raw) return "—";
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return raw;
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <MriCard className="w-full p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{t.licenseTitle}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{t.licenseSubtitle}</p>
        </div>
        <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-emerald-300">
          {license?.status === "active" ? t.licenseActive : license?.status || t.licenseActive}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatTile label={t.licenseIdLabel} value={license?.key || server?.licenseKey || "—"} />
        <StatTile label={t.planLabel} value={(license?.plan || server?.plan || "pro").toUpperCase()} />
        <StatTile label={t.activatedOn} value={formatDate(license?.createdAt || server?.createdAt)} />
        <StatTile label={t.validity} value={license ? formatDate(license.expiresAt) : t.lifetime} />
        <StatTile label={t.serversLabel} value={t.serversCount} />
      </div>
    </MriCard>
  );
}

function IntegracoesTab({ server, setServer }: { server: ServerItem | null; setServer: any }) {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  const [webhook, setWebhook] = useState(server?.notifications?.discordWebhook || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setWebhook(server?.notifications?.discordWebhook || "");
  }, [server?._id, server?.notifications?.discordWebhook]);

  const handleSave = async () => {
    if (!server) return;
    setSaving(true);
    try {
      await api.updateServerNotifications(server._id, {
        discordWebhook: webhook,
        alerts: server.notifications?.alerts || {
          detections: true,
          bans: true,
          critical: true,
          offline: true,
        },
      });
      setServer({
        ...server,
        notifications: { ...(server.notifications || {}), discordWebhook: webhook },
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <MriCard className="w-full p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{t.integrationsTitle}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{t.integrationsSubtitle}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <MriCard className="space-y-2 border-hairline bg-elevated/60">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {t.discordWebhookLabel}
            </p>
            <MriInput
              value={webhook}
              onChange={(e) => setWebhook(e.target.value)}
              placeholder="https://discord.com/api/webhooks/..."
              className="rounded-md bg-background px-3 py-2 text-xs"
            />
          </MriCard>

          <MriCard className="space-y-2 border-hairline bg-elevated/60">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {t.apiLabel}
            </p>
            <p className="text-xs font-mono text-emerald-400 break-all">
              {server?.licenseKey || "—"}
            </p>
          </MriCard>

          <MriCard className="space-y-2 border-hairline bg-elevated/60">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {t.logsLabel}
            </p>
            <p className="text-sm font-semibold text-foreground">
              {server?.security?.accessLogs?.length || 0} {t.logsCountSuffix}
            </p>
          </MriCard>

          <MriCard className="space-y-2 border-hairline bg-elevated/60">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {t.externalServicesLabel}
            </p>
            <p className="text-sm font-semibold text-foreground">
              {server?.notifications?.alerts?.critical ? t.servicesActive : t.servicesDisabled}
            </p>
          </MriCard>
        </div>

        <div className="flex justify-end pt-2">
          <MriButton variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            {t.saveIntegration}
          </MriButton>
        </div>
      </MriCard>
    </div>
  );
}

export function FaturasTab({ orders }: { orders: any[] }) {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  return (
    <MriCard className="w-full p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{t.invoicesTitle}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{t.invoicesSubtitle}</p>
        </div>
        <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {orders.length} {t.itemsSuffix}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-hairline bg-elevated/60 p-5 text-sm text-muted-foreground">
          {t.noInvoicesFound}
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <MriCard key={order._id || order.orderId} className="border-hairline bg-elevated/60">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    #{order.orderId || order._id}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {order.serverName || t.serverFallback}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {(order.plan || "PRO").toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-hairline pt-3">
                <span className="text-xs text-muted-foreground">{t.statusLabel}</span>
                <span className="rounded-md border border-hairline bg-elevated px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-foreground/75">
                  {order.status || "approved"}
                </span>
              </div>
            </MriCard>
          ))}
        </div>
      )}
    </MriCard>
  );
}

function InfoRow({ label, value, onEdit }: { label: string; value: string; onEdit?: () => void }) {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <div>
        <p className="text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
        <p className="mt-1 text-xs text-foreground/90 break-words">{value || "—"}</p>
      </div>
      {onEdit && (
        <MriButton variant="outline" size="sm" onClick={onEdit} className="rounded-md text-[10px]">
          {t.change}
        </MriButton>
      )}
    </div>
  );
}

function MetricBox({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Lock;
}) {
  return (
    <MriCard className="border-hairline bg-elevated/60">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <p className="text-[10px] uppercase tracking-[0.14em]">{label}</p>
      </div>
      <p className="mt-3 text-sm font-semibold text-foreground">{value}</p>
    </MriCard>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <MriCard className="border-hairline bg-elevated/60">
      <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-semibold text-foreground break-all">{value}</p>
    </MriCard>
  );
}
