import { useState, useEffect } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, PanelLeft, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, ServerItem } from "@/lib/goat-api";
import { DashboardSidebar } from "@/goatdash/DashboardSidebar";
import { DialogProvider } from "./Dialog";
import { useLanguage } from "@/i18n/LanguageContext";
import { MriButton } from "@/components/ui/MriButton";
import { MriPanel } from "@/components/ui/MriPanel";
import { MriStat } from "@/components/ui/MriStat";
import { MriBadge } from "@/components/ui/MriBadge";
import { MriTable } from "@/components/ui/MriTable";
import type { MriBadgeTone } from "@/components/ui/mri-badge-variants";

type Copy = {
  loadingDashboard: string;
  openMenuAria: string;
  expandMenuAria: string;
  collapseMenuAria: string;
  dashboardLabel: string;
  serverLabel: string;
};

const pt: Copy = {
  loadingDashboard: "Carregando dashboard...",
  openMenuAria: "Abrir menu",
  expandMenuAria: "Expandir menu",
  collapseMenuAria: "Recolher menu",
  dashboardLabel: "Dashboard",
  serverLabel: "Servidor:",
};

const en: Copy = {
  loadingDashboard: "Loading dashboard...",
  openMenuAria: "Open menu",
  expandMenuAria: "Expand menu",
  collapseMenuAria: "Collapse menu",
  dashboardLabel: "Dashboard",
  serverLabel: "Server:",
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  const [servers, setServers] = useState<ServerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeServerId, setActiveServerId] = useState<string>(
    typeof window !== "undefined" ? localStorage.getItem("goat_active_server_id") || "" : "",
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(
    typeof window !== "undefined" ? localStorage.getItem("goat_sidebar_collapsed") === "1" : false,
  );
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    api.getServers().then((list) => {
      // O dashboard de gestão (detecções, bans, módulos) só existe pro
      // produto anticheat - filtra fora qualquer outro tipo de recurso.
      const anticheatServers = list.filter((s) => (s.productType || "anticheat") === "anticheat");
      setServers(anticheatServers);
      if (
        anticheatServers.length > 0 &&
        (!activeServerId || !anticheatServers.some((s) => s._id === activeServerId))
      ) {
        setActiveServerId(anticheatServers[0]._id);
        localStorage.setItem("goat_active_server_id", anticheatServers[0]._id);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading && servers.length === 0) {
      navigate("/servers");
    }
  }, [loading, servers, navigate]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
          <p className="text-sm text-muted-foreground">{t.loadingDashboard}</p>
        </div>
      </div>
    );
  }

  if (servers.length === 0) {
    return null;
  }

  const activeServer = servers.find((s) => s._id === activeServerId) || servers[0];

  const handleServerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setActiveServerId(id);
    localStorage.setItem("goat_active_server_id", id);
    window.dispatchEvent(new Event("goat_server_changed"));
  };

  const isHome = pathname === "/dashboard" || pathname === "/dashboard/";
  const sectionMatch = pathname.match(/^\/dashboard\/([^/]+)/);
  const sectionLabel = isHome
    ? t.dashboardLabel
    : sectionMatch
      ? sectionMatch[1].charAt(0).toUpperCase() + sectionMatch[1].slice(1).replace("-", " ")
      : t.dashboardLabel;

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("goat_sidebar_collapsed", next ? "1" : "0");
      return next;
    });
  };

  return (
    <DialogProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <DashboardSidebar
          collapsed={sidebarCollapsed}
          online={activeServer?.status === "online"}
          mobileOpen={mobileNavOpen}
          onCloseMobile={() => setMobileNavOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
            <div className="flex min-w-0 items-center gap-3 text-[12px] font-medium text-muted-foreground">
              <MriButton
                variant="ghost"
                size="icon"
                onClick={() => setMobileNavOpen(true)}
                aria-label={t.openMenuAria}
                className="rounded-md hover:bg-accent/50 lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </MriButton>
              <MriButton
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                aria-label={sidebarCollapsed ? t.expandMenuAria : t.collapseMenuAria}
                className="hidden rounded-md hover:bg-accent/50 lg:flex"
              >
                <PanelLeft className="h-4 w-4" />
              </MriButton>
              <span className="hidden font-mono text-[10.5px] tracking-[0.08em] text-foreground/40 uppercase sm:inline">
                goat.anticheat
              </span>
              <ChevronRight className="hidden h-3.5 w-3.5 opacity-30 sm:block" />
              <span className="truncate text-[13px] font-semibold text-foreground capitalize">
                {sectionLabel}
              </span>
            </div>

            <div className="flex min-w-0 shrink-0 items-center gap-3">
              {servers.length > 0 && activeServer && (
                <div className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-card/80 px-3 py-1 text-[12px] font-medium shadow-sm">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${activeServer.status === "online" ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" : "bg-muted-foreground/50"}`}
                  />
                  <span className="hidden shrink-0 text-muted-foreground sm:inline">{t.serverLabel}</span>
                  <select
                    value={activeServer._id}
                    onChange={handleServerChange}
                    className="max-w-[110px] cursor-pointer truncate bg-transparent pr-1 text-[12px] font-semibold text-foreground outline-none sm:max-w-[220px]"
                  >
                    {servers.map((s) => (
                      <option key={s._id} value={s._id} className="bg-background text-foreground">
                        {s.name} ({s.ip}:{s.port})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </header>

          <main className="min-w-0 flex-1 overflow-auto">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-full px-6 py-6"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </DialogProvider>
  );
}

// Panel/Stat/Tag/Table agora vivem em src/components/ui/ (kit "Mri*"
// compartilhado com o painel in-game do goat_ac). Mantidos re-exportados
// aqui com os nomes antigos pra não quebrar nenhum import existente em
// sections.tsx/SettingsTabs.tsx/etc.
export const Panel = MriPanel;
export const Stat = MriStat;

export type TagTone = NonNullable<MriBadgeTone>;
export const TAG_TONE_CLASS: Record<TagTone, string> = {
  neutral: "border border-border text-muted-foreground",
  gold: "bg-gold text-primary-foreground",
  warning: "border border-amber-500/30 bg-amber-500/12 text-amber-400",
  critical: "border border-red-500/30 bg-red-500/12 text-red-400",
  success: "border border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
};

export function Tag({
  children,
  solid,
  tone,
}: {
  children: React.ReactNode;
  solid?: boolean;
  tone?: TagTone;
}) {
  return (
    <MriBadge tone={tone} solid={solid}>
      {children}
    </MriBadge>
  );
}

export const Table = MriTable;
