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
  X,
  Globe,
  Lock,
  Smartphone,
  Activity,
} from "lucide-react";
import { api, ServerItem, LicenseItem, resolveLicenseForServer } from "@/lib/goat-api";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";
import { formatDate } from "@/lib/format";

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
  const [activeTab, setActiveTab] = useState("informacoes");
  const [allServers, setAllServers] = useState<ServerItem[]>([]);
  const [server, setServer] = useState<ServerItem | null>(null);
  const [license, setLicense] = useState<LicenseItem | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalField, setModalField] = useState<{
    key: string;
    label: string;
    value: string;
  } | null>(null);
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

  const tabs = [
    { id: "informacoes", label: "Informações", icon: User },
    { id: "seguranca", label: "Segurança", icon: Shield },
    { id: "licenca", label: "Licença", icon: BadgeCheck },
    { id: "integracoes", label: "Integrações", icon: Bell },
    { id: "faturas", label: "Faturas", icon: CreditCard },
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

  const handleSaveModal = async () => {
    if (!modalField || !server) return;

    setSaving(true);

    try {
      const payload: Record<string, string> = {};
      if (modalField.key === "nome") payload.name = modalField.value;
      if (modalField.key === "descricao") payload.description = modalField.value;

      if (Object.keys(payload).length > 0) {
        await api.updateServerGeneral(server._id, payload);
        setServer({ ...server, ...payload });
        setProfileData((prev) => ({ ...prev, [modalField.key]: modalField.value }));
      }
    } catch (error) {
      console.error("Erro ao salvar campo:", error);
    } finally {
      setSaving(false);
      setModalField(null);
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

      <div className="flex flex-wrap items-center gap-3 border-b border-hairline pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-2 border px-3 py-2 text-[12.5px] font-medium transition-colors",
                isActive
                  ? "border-hairline bg-elevated text-foreground"
                  : "border-transparent text-muted-foreground hover:border-hairline hover:bg-elevated/60 hover:text-foreground/75",
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

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
                onOpenEdit={(key, label, value) => setModalField({ key, label, value })}
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

      {modalField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-hairline bg-background p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Alterar {modalField.label}</h3>
              <button
                onClick={() => setModalField(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <input
              type="text"
              value={modalField.value}
              onChange={(e) => setModalField({ ...modalField, value: e.target.value })}
              className="w-full rounded-md border border-hairline bg-secondary px-4 py-2.5 text-xs text-foreground outline-none focus:border-gold/40"
              autoFocus
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setModalField(null)}
                className="rounded-md px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveModal}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-md bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-50"
              >
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
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

  return (
    <div className="space-y-4 w-full">
      <div className="w-full rounded-xl border border-white/[0.07] bg-background p-6 shadow-sm">
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
            <button
              onClick={onTriggerFileUpload}
              className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <Upload className="h-3.5 w-3.5" />
              Trocar logo
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="rounded-xl border border-white/[0.07] bg-background p-5 space-y-4">
          <span className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground block">
            Informações
          </span>

          <InfoRow
            label="Nome"
            value={server?.name || profileData.nome}
            onEdit={() => onOpenEdit("nome", "Nome", server?.name || profileData.nome)}
          />
          <InfoRow
            label="Descrição"
            value={server?.description || profileData.descricao}
            onEdit={() =>
              onOpenEdit("descricao", "Descrição", server?.description || profileData.descricao)
            }
          />
          <InfoRow label="Status" value={server?.status ? server.status.toUpperCase() : "ONLINE"} />
        </div>

        <div className="rounded-xl border border-white/[0.07] bg-background p-5 space-y-4">
          <span className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground block">
            Servidor
          </span>

          <InfoRow label="IP" value={server?.ip || "127.0.0.1"} />
          <InfoRow label="Porta" value={String(server?.port || 30120)} />
          <InfoRow label="CFX" value={server?.cfxCode || "—"} />
          <InfoRow label="Plano" value={String(server?.plan || "pro").toUpperCase()} />
        </div>
      </div>
    </div>
  );
}

function SegurancaTab({ server }: { server: ServerItem | null }) {
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
      <div className="rounded-xl border border-white/[0.07] bg-background p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Segurança</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            2FA, IP Allowlist, sessões e dispositivos validados pelo backend.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricBox
            label="2FA"
            value={server?.security?.twoFactorEnabled ? "Ativado" : "Não configurado"}
            icon={Lock}
          />
          <MetricBox label="IP Allowlist" value={`${allowedIps.length} IPs`} icon={Globe} />
          <MetricBox label="Sessões" value={`${accessLogs.length}`} icon={Smartphone} />
          <MetricBox label="Dispositivos" value={`${allowedIps.length || 0}`} icon={Activity} />
        </div>

        <div className="rounded-xl border border-hairline bg-elevated/60 p-4 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase text-muted-foreground">
              LICENSE ID
            </span>
            <p className="text-xs font-mono text-emerald-400 mt-1 break-all">
              {server?.licenseKey || "—"}
            </p>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(server?.licenseKey || "");
              setKeyCopied(true);
              setTimeout(() => setKeyCopied(false), 2000);
            }}
            className="rounded-md border border-hairline bg-elevated px-4 py-1.5 text-xs text-foreground/75 hover:bg-secondary hover:text-foreground transition-colors"
          >
            {keyCopied ? "Copiado!" : "Copiar"}
          </button>
        </div>

        <div className="rounded-xl border border-hairline bg-elevated/60 p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-[11px] font-semibold uppercase text-muted-foreground">
              Allowlist de IPs
            </h4>
            <span className="text-[10px] text-muted-foreground">Persistido no backend</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
              placeholder="Ex.: 45.12.54.90"
              className="w-full rounded-md border border-hairline bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-gold/40"
            />
            <button
              onClick={addIp}
              disabled={busy}
              className="rounded-md border border-hairline bg-secondary px-3 py-2 text-[11px] font-medium text-foreground hover:bg-secondary disabled:opacity-50"
            >
              Adicionar
            </button>
          </div>

          {allowedIps.length === 0 ? (
            <p className="text-xs text-muted-foreground">Nenhum IP autorizado cadastrado.</p>
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
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
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
  const formatDate = (raw?: string) => {
    if (!raw) return "—";
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return raw;
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="w-full rounded-xl border border-white/[0.07] bg-background p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Licença</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Dados ativos vindos do backend.</p>
        </div>
        <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-emerald-300">
          {license?.status === "active" ? "Ativada" : license?.status || "Ativada"}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatTile label="LICENSE ID" value={license?.key || server?.licenseKey || "—"} />
        <StatTile label="Plano" value={(license?.plan || server?.plan || "pro").toUpperCase()} />
        <StatTile label="Ativada em" value={formatDate(license?.createdAt || server?.createdAt)} />
        <StatTile label="Validade" value={license ? formatDate(license.expiresAt) : "Vitalícia"} />
        <StatTile label="Servidores" value="1 de 1" />
      </div>
    </div>
  );
}

function IntegracoesTab({ server, setServer }: { server: ServerItem | null; setServer: any }) {
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
      <div className="rounded-xl border border-white/[0.07] bg-background p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Integrações</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Discord Webhook, API, logs e serviços externos conectados ao backend.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-hairline bg-elevated/60 p-4 space-y-2">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Discord Webhook
            </p>
            <input
              value={webhook}
              onChange={(e) => setWebhook(e.target.value)}
              placeholder="https://discord.com/api/webhooks/..."
              className="w-full rounded-md border border-hairline bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-gold/40"
            />
          </div>

          <div className="rounded-xl border border-hairline bg-elevated/60 p-4 space-y-2">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">API</p>
            <p className="text-xs font-mono text-emerald-400 break-all">
              {server?.licenseKey || "—"}
            </p>
          </div>

          <div className="rounded-xl border border-hairline bg-elevated/60 p-4 space-y-2">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Logs</p>
            <p className="text-sm font-semibold text-foreground">
              {server?.security?.accessLogs?.length || 0} registros
            </p>
          </div>

          <div className="rounded-xl border border-hairline bg-elevated/60 p-4 space-y-2">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Serviços externos
            </p>
            <p className="text-sm font-semibold text-foreground">
              {server?.notifications?.alerts?.critical ? "Ativos" : "Desativados"}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:brightness-110 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            Salvar Integração
          </button>
        </div>
      </div>
    </div>
  );
}

export function FaturasTab({ orders }: { orders: any[] }) {
  return (
    <div className="w-full rounded-xl border border-white/[0.07] bg-background p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Faturas</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Histórico real de pedidos do backend.
          </p>
        </div>
        <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {orders.length} itens
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-hairline bg-elevated/60 p-5 text-sm text-muted-foreground">
          Nenhuma fatura encontrada.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order._id || order.orderId}
              className="rounded-xl border border-hairline bg-elevated/60 p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    #{order.orderId || order._id}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {order.serverName || "Servidor"}
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
                <span className="text-xs text-muted-foreground">Status</span>
                <span className="rounded-md border border-hairline bg-elevated px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-foreground/75">
                  {order.status || "approved"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value, onEdit }: { label: string; value: string; onEdit?: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <div>
        <p className="text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
        <p className="mt-1 text-xs text-foreground/90 break-words">{value || "—"}</p>
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          className="rounded-md border border-hairline bg-elevated px-3 py-1.5 text-[10px] font-medium text-foreground/75 hover:bg-secondary hover:text-foreground"
        >
          Alterar
        </button>
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
    <div className="rounded-xl border border-hairline bg-elevated/60 p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <p className="text-[10px] uppercase tracking-[0.14em]">{label}</p>
      </div>
      <p className="mt-3 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-hairline bg-elevated/60 p-4">
      <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-semibold text-foreground break-all">{value}</p>
    </div>
  );
}
