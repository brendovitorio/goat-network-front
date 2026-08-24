import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  CreditCard,
  User,
  LifeBuoy,
  Zap,
  Server as ServerIcon,
  RefreshCw,
  Key,
  Activity,
  Users,
  Copy,
  Check,
  Star,
  MoreHorizontal,
  ShieldCheck,
  Download,
} from "lucide-react";
import { Nav } from "@/components/goatlanding/Nav";
import {
  api,
  ServerItem,
  UserProfile,
  DownloadableProduct,
  discordAvatarUrl,
} from "@/lib/goat-api";
import { FaturasTab } from "@/components/dashboard/SettingsTabs";
import { cn } from "@/lib/utils";
import goatLoading from "@/assets/goatloading.png";
import { useLanguage } from "@/i18n/LanguageContext";
import { formatDate } from "@/lib/format";

type Copy = {
  tabTitle: string;
  tabServers: string;
  tabInvoices: string;
  tabDownloads: string;
  tabAccount: string;
  support: string;
  serversTitle: string;
  serversSubtitle: string;
  searchPlaceholder: string;
  filters: string;
  newServer: string;
  syncing: string;
  noServersFound: string;
  noServersMatch: string;
  noServersYet: string;
  clearSearch: string;
  getLicense: string;
  onlineProtected: string;
  offline: string;
  playersOnline: string;
  currentPlan: string;
  loadingPlayers: string;
  accessDashboard: string;
  viewDownloads: string;
  invoicesTitle: string;
  invoicesSubtitle: string;
  loadingInvoices: string;
  downloadsTitle: string;
  downloadsSubtitle: string;
  loadingDownloads: string;
  noDownloadsYet: string;
  downloading: string;
  download: string;
  downloadErrorFallback: string;
  accountTitle: string;
  accountSubtitle: string;
  loadingAccount: string;
  accountLoadError: string;
  emailNotProvided: string;
  activePlan: string;
  roleLabel: string;
  discordIdLabel: string;
  memberSince: string;
  logout: string;
};

const pt: Copy = {
  tabTitle: "Meus Servidores — Goat Network",
  tabServers: "Servidores",
  tabInvoices: "Faturas",
  tabDownloads: "Downloads",
  tabAccount: "Minha Conta",
  support: "Suporte",
  serversTitle: "Meus Servidores",
  serversSubtitle: "Gerencie suas licenças e acesse o painel de controle dos seus servidores FiveM.",
  searchPlaceholder: "Buscar servidor...",
  filters: "Filtros",
  newServer: "Novo Servidor",
  syncing: "Sincronizando seus servidores...",
  noServersFound: "Nenhum servidor encontrado",
  noServersMatch: "Não encontramos nenhum servidor correspondente à sua busca.",
  noServersYet: "Você ainda não possui nenhum servidor protegido pelo GOAT Anticheat.",
  clearSearch: "Limpar busca",
  getLicense: "Adquirir Licença",
  onlineProtected: "Online e Protegido",
  offline: "Offline",
  playersOnline: "Players Online",
  currentPlan: "Plano Atual",
  loadingPlayers: "Carregando...",
  accessDashboard: "Acessar Dashboard",
  viewDownloads: "Ver Downloads",
  invoicesTitle: "Faturas",
  invoicesSubtitle: "Histórico de pedidos e pagamentos da sua conta.",
  loadingInvoices: "Carregando faturas...",
  downloadsTitle: "Downloads",
  downloadsSubtitle: "Arquivos dos produtos que você já comprou.",
  loadingDownloads: "Carregando downloads...",
  noDownloadsYet: "Nenhum produto com arquivo pra baixar ainda.",
  downloading: "Baixando...",
  download: "Baixar",
  downloadErrorFallback: "Erro ao baixar arquivo.",
  accountTitle: "Minha Conta",
  accountSubtitle: "Dados da sua conta, vinculados ao login via Discord.",
  loadingAccount: "Carregando conta...",
  accountLoadError: "Não foi possível carregar os dados da conta.",
  emailNotProvided: "E-mail não informado",
  activePlan: "Plano ativo",
  roleLabel: "Cargo",
  discordIdLabel: "Discord ID",
  memberSince: "Membro desde",
  logout: "Sair da conta",
};

const en: Copy = {
  tabTitle: "My Servers — Goat Network",
  tabServers: "Servers",
  tabInvoices: "Invoices",
  tabDownloads: "Downloads",
  tabAccount: "My Account",
  support: "Support",
  serversTitle: "My Servers",
  serversSubtitle: "Manage your licenses and access the control panel for your FiveM servers.",
  searchPlaceholder: "Search server...",
  filters: "Filters",
  newServer: "New Server",
  syncing: "Syncing your servers...",
  noServersFound: "No servers found",
  noServersMatch: "We couldn't find any server matching your search.",
  noServersYet: "You don't have any server protected by GOAT Anticheat yet.",
  clearSearch: "Clear search",
  getLicense: "Get a License",
  onlineProtected: "Online & Protected",
  offline: "Offline",
  playersOnline: "Players Online",
  currentPlan: "Current Plan",
  loadingPlayers: "Loading...",
  accessDashboard: "Open Dashboard",
  viewDownloads: "View Downloads",
  invoicesTitle: "Invoices",
  invoicesSubtitle: "Order and payment history for your account.",
  loadingInvoices: "Loading invoices...",
  downloadsTitle: "Downloads",
  downloadsSubtitle: "Files for the products you've already purchased.",
  loadingDownloads: "Loading downloads...",
  noDownloadsYet: "No products with a downloadable file yet.",
  downloading: "Downloading...",
  download: "Download",
  downloadErrorFallback: "Error downloading the file.",
  accountTitle: "My Account",
  accountSubtitle: "Your account data, linked to your Discord login.",
  loadingAccount: "Loading account...",
  accountLoadError: "Could not load account data.",
  emailNotProvided: "No email provided",
  activePlan: "Active plan",
  roleLabel: "Role",
  discordIdLabel: "Discord ID",
  memberSince: "Member since",
  logout: "Log out",
};

export default function ServersPage() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [servers, setServers] = useState<ServerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const validTabs = ["servidores", "faturas", "downloads", "conta"];
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTabState] = useState(
    validTabs.includes(tabFromUrl || "") ? tabFromUrl! : "servidores",
  );
  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    setSearchParams(tab === "servidores" ? {} : { tab }, { replace: true });
  };
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [cfxData, setCfxData] = useState<
    Record<string, { clients: number; maxClients?: number } | null>
  >({});
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [downloads, setDownloads] = useState<DownloadableProduct[]>([]);
  const [downloadsLoading, setDownloadsLoading] = useState(true);
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);
  const [me, setMe] = useState<UserProfile | null>(null);
  const [meLoading, setMeLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("goat_fav_servers") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    document.title = t.tabTitle;
  }, [lang, t.tabTitle]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const newFavs = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem("goat_fav_servers", JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const fetchServers = async () => {
    setLoading(true);
    try {
      const data = await api.getServers();
      setServers(data);

      data.forEach(async (server: ServerItem) => {
        if (server.cfxCode) {
          try {
            const cfx = await api.getCfxServerData(server.cfxCode);
            if (cfx && cfx.Data && cfx.Data.clients !== undefined) {
              setCfxData((prev) => ({
                ...prev,
                [server._id]: { clients: cfx.Data.clients, maxClients: cfx.Data.sv_maxclients },
              }));
            } else {
              setCfxData((prev) => ({ ...prev, [server._id]: null }));
            }
          } catch (e) {
            console.error("Erro ao buscar cfx para", server.cfxCode);
            setCfxData((prev) => ({ ...prev, [server._id]: null }));
          }
        }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("goat_auth_token");
    if (!token) {
      navigate("/auth");
      return;
    }
    fetchServers();

    api.getUserOrders().then((data) => {
      setOrders(data);
      setOrdersLoading(false);
    });

    api.getMyDownloads().then((data) => {
      setDownloads(data);
      setDownloadsLoading(false);
    });

    api.getMe().then((profile) => {
      setMe(profile);
      setMeLoading(false);
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  const handleDownload = async (product: DownloadableProduct) => {
    setDownloadingKey(product.code);
    try {
      await api.downloadProductFile(product.code, product.downloadFileName);
    } catch (err: any) {
      alert(err.message || t.downloadErrorFallback);
    } finally {
      setDownloadingKey(null);
    }
  };

  const handleCopyKey = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredServers = servers.filter((s) => {
    return (
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.ip.toLowerCase().includes(search.toLowerCase()) ||
      s.licenseKey.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <main className="relative min-h-screen bg-background text-foreground font-sans flex flex-col">
      <Nav />

      <div className="flex-1 flex flex-col pt-[104px]">
        <div className="border-b border-white/[0.08] px-4 sm:px-6">
          <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-3">
            <div className="flex h-full min-w-0 items-center gap-4 overflow-x-auto sm:gap-6">
              <button
                onClick={() => setActiveTab("servidores")}
                className={cn(
                  "relative h-full flex shrink-0 items-center gap-2 text-[13px] font-medium transition-colors",
                  activeTab === "servidores"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/90",
                )}
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">{t.tabServers}</span>
                {activeTab === "servidores" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 inset-x-0 h-[2px] bg-primary"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("faturas")}
                className={cn(
                  "relative h-full flex shrink-0 items-center gap-2 text-[13px] font-medium transition-colors",
                  activeTab === "faturas"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/90",
                )}
              >
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">{t.tabInvoices}</span>
                {activeTab === "faturas" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 inset-x-0 h-[2px] bg-primary"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("downloads")}
                className={cn(
                  "relative h-full flex shrink-0 items-center gap-2 text-[13px] font-medium transition-colors",
                  activeTab === "downloads"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/90",
                )}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">{t.tabDownloads}</span>
                {activeTab === "downloads" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 inset-x-0 h-[2px] bg-primary"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("conta")}
                className={cn(
                  "relative h-full flex shrink-0 items-center gap-2 text-[13px] font-medium transition-colors",
                  activeTab === "conta"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/90",
                )}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{t.tabAccount}</span>
                {activeTab === "conta" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 inset-x-0 h-[2px] bg-primary"
                  />
                )}
              </button>
            </div>

            <div className="flex shrink-0 items-center gap-4 text-[13px] text-muted-foreground">
              <a
                href="https://discord.gg/VpHaMPpEHZ"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 transition-colors hover:text-gold"
              >
                <LifeBuoy className="h-4 w-4" />
                <span className="hidden sm:inline">{t.support}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="flex-1 px-6 py-10">
          <div className="mx-auto max-w-[1400px]">
            {activeTab === "servidores" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                      {t.serversTitle}
                    </h1>
                    <p className="text-sm text-muted-foreground">{t.serversSubtitle}</p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative min-w-0 flex-1 sm:flex-none">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-10 w-full rounded-md border border-hairline bg-secondary pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/30 focus:outline-none focus:ring-0 transition-colors sm:w-64"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="h-10 px-4 flex items-center gap-2 rounded-md border border-hairline bg-secondary text-sm font-medium hover:bg-secondary transition-colors text-foreground">
                        <Filter className="h-4 w-4" />
                        {t.filters}
                      </button>
                      <button
                        onClick={() => navigate("/products")}
                        className="h-10 px-4 flex items-center gap-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-colors"
                      >
                        <Zap className="h-4 w-4 fill-black" />
                        {t.newServer}
                      </button>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <div className="relative w-24 h-24 mb-6">
                      <div className="absolute inset-0 bg-secondary rounded-full animate-ping opacity-75"></div>
                      <div className="relative bg-black border border-hairline rounded-full p-4 flex items-center justify-center">
                        <img src={goatLoading} alt="Loading" className="w-12 h-12 opacity-80" />
                      </div>
                    </div>
                    <p className="text-sm animate-pulse">{t.syncing}</p>
                  </div>
                ) : filteredServers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 border border-dashed border-hairline rounded-xl bg-elevated/60">
                    <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                      <ServerIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      {t.noServersFound}
                    </h3>
                    <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                      {search ? t.noServersMatch : t.noServersYet}
                    </p>
                    {search ? (
                      <button
                        onClick={() => setSearch("")}
                        className="text-sm text-foreground hover:underline"
                      >
                        {t.clearSearch}
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate("/products")}
                        className="h-10 px-6 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-colors"
                      >
                        {t.getLicense}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                      {filteredServers.map((server) => {
                        const isFav = favorites.includes(server._id);
                        const cfx = cfxData[server._id];
                        const isOnline = cfx !== undefined ? cfx !== null : true;
                        // O dashboard de gestão (detecções, bans, módulos) só faz
                        // sentido pro produto anticheat - outros produtos (ex:
                        // downloads) não têm nada pra mostrar ali.
                        const hasDashboard = (server.productType || "anticheat") === "anticheat";

                        return (
                          <motion.div
                            key={server._id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            onClick={() => {
                              if (!hasDashboard) {
                                setActiveTab("downloads");
                                return;
                              }
                              localStorage.setItem("goat_active_server_id", server._id);
                              navigate("/dashboard");
                            }}
                            className="group relative flex flex-col rounded-xl border border-hairline bg-black overflow-hidden hover:border-gold/30 transition-all duration-300 cursor-pointer"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            <div className="p-6 pb-5 border-b border-hairline flex items-start justify-between">
                              <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-lg bg-secondary border border-hairline flex items-center justify-center flex-shrink-0 overflow-hidden">
                                  {server.logo ? (
                                    <img
                                      src={server.logo}
                                      alt={server.name}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-xl font-medium">
                                      {server.name.substring(0, 2).toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <h3 className="font-normal text-[28px] tracking-tight text-foreground flex items-center gap-2 leading-none">
                                    {server.name}
                                    {server.plan === "enterprise" && (
                                      <ShieldCheck className="h-5 w-5 text-emerald-400" />
                                    )}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 relative">
                                      {isOnline && (
                                        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></span>
                                      )}
                                    </span>
                                    <span className="text-xs font-medium text-emerald-500">
                                      {isOnline ? t.onlineProtected : t.offline}
                                    </span>
                                    <span className="text-muted-foreground/70 text-xs">•</span>
                                    <span className="text-xs text-muted-foreground">
                                      {server.ip}:{server.port}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 relative z-10">
                                <button
                                  onClick={(e) => toggleFavorite(server._id, e)}
                                  className="h-8 w-8 rounded-md hover:bg-secondary flex items-center justify-center transition-colors text-muted-foreground hover:text-yellow-400"
                                >
                                  <Star
                                    className={cn(
                                      "h-4 w-4",
                                      isFav && "fill-yellow-400 text-yellow-400",
                                    )}
                                  />
                                </button>
                                <button className="h-8 w-8 rounded-md hover:bg-secondary flex items-center justify-center transition-colors text-muted-foreground">
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            <div className="p-6 py-5 flex-1 flex flex-col justify-between">
                              <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="space-y-1">
                                  <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                                    <Users className="h-3.5 w-3.5" /> {t.playersOnline}
                                  </span>
                                  <p className="text-xl font-semibold text-foreground">
                                    {cfx
                                      ? `${cfx.clients}/${cfx.maxClients || 64}`
                                      : isOnline
                                        ? t.loadingPlayers
                                        : "0"}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                                    <Activity className="h-3.5 w-3.5" /> {t.currentPlan}
                                  </span>
                                  <p className="text-sm font-semibold text-foreground capitalize mt-1">
                                    GOAT {server.plan}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 pt-0">
                              <button className="w-full h-10 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300">
                                {hasDashboard ? t.accessDashboard : t.viewDownloads}
                                <ArrowRight className="h-4 w-4" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "faturas" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                    {t.invoicesTitle}
                  </h1>
                  <p className="text-sm text-muted-foreground">{t.invoicesSubtitle}</p>
                </div>
                {ordersLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <p className="text-sm animate-pulse">{t.loadingInvoices}</p>
                  </div>
                ) : (
                  <FaturasTab orders={orders} />
                )}
              </motion.div>
            )}

            {activeTab === "downloads" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                    {t.downloadsTitle}
                  </h1>
                  <p className="text-sm text-muted-foreground">{t.downloadsSubtitle}</p>
                </div>
                {downloadsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <p className="text-sm animate-pulse">{t.loadingDownloads}</p>
                  </div>
                ) : downloads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 border border-dashed border-hairline rounded-xl bg-elevated/60">
                    <p className="text-sm text-muted-foreground">{t.noDownloadsYet}</p>
                  </div>
                ) : (
                  <div className="max-w-2xl space-y-3">
                    {downloads.map((d) => (
                      <div
                        key={d.code}
                        className="flex items-center justify-between rounded-xl border border-hairline bg-black p-5"
                      >
                        <div>
                          <p className="text-sm font-semibold text-foreground">{d.name}</p>
                          <p className="text-xs text-muted-foreground">{d.downloadFileName}</p>
                        </div>
                        <button
                          onClick={() => handleDownload(d)}
                          disabled={downloadingKey === d.code}
                          className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-[12.5px] font-semibold text-background hover:opacity-90 disabled:opacity-50"
                        >
                          <Download className="h-3.5 w-3.5" />{" "}
                          {downloadingKey === d.code ? t.downloading : t.download}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "conta" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                    {t.accountTitle}
                  </h1>
                  <p className="text-sm text-muted-foreground">{t.accountSubtitle}</p>
                </div>
                {meLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <p className="text-sm animate-pulse">{t.loadingAccount}</p>
                  </div>
                ) : !me ? (
                  <div className="flex flex-col items-center justify-center py-24 border border-dashed border-hairline rounded-xl bg-elevated/60">
                    <p className="text-sm text-muted-foreground">{t.accountLoadError}</p>
                  </div>
                ) : (
                  <div className="max-w-2xl rounded-xl border border-hairline bg-black p-6 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-secondary border border-hairline flex items-center justify-center overflow-hidden flex-shrink-0">
                        {discordAvatarUrl(me.discordId, me.avatar) ? (
                          <img
                            src={discordAvatarUrl(me.discordId, me.avatar)!}
                            alt={me.username}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xl font-medium text-foreground">
                            {me.username.substring(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{me.username}</h3>
                        <p className="text-sm text-muted-foreground">
                          {me.email || t.emailNotProvided}
                        </p>
                      </div>
                    </div>

                    <div className="h-px bg-secondary" />

                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <p className="text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                          {t.activePlan}
                        </p>
                        <p className="mt-1.5 text-sm font-medium text-foreground capitalize">
                          {me.activePlan}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                          {t.roleLabel}
                        </p>
                        <p className="mt-1.5 text-sm font-medium text-foreground capitalize">
                          {me.role}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                          {t.discordIdLabel}
                        </p>
                        <p className="mt-1.5 text-sm font-mono text-foreground/75">
                          {me.discordId}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                          {t.memberSince}
                        </p>
                        <p className="mt-1.5 text-sm font-medium text-foreground">
                          {me.createdAt ? formatDate(me.createdAt, lang) : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="h-px bg-secondary" />

                    <button
                      onClick={handleLogout}
                      className="h-10 px-4 rounded-md border border-red-500/30 bg-red-500/10 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      {t.logout}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
