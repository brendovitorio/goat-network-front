import {
  Gauge,
  Users,
  Bug,
  FileSearch,
  ShieldCheck,
  Boxes,
  Activity,
  Globe,
  BadgeCheck,
  Wallpaper,
  Eraser,
  UserCog,
  KeyRound,
  Bell,
  Settings,
  Headphones,
  Pencil,
  ChevronDown,
  X,
  Settings2,
  Gavel,
  BrainCircuit,
} from "lucide-react";
import logo from "@/assets/goat2.png";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import { discordAvatarUrl } from "@/lib/goat-api";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";
import { MriButton } from "@/components/ui/MriButton";

type Item = {
  icon: LucideIcon;
  label: string;
  slug?: string;
  href?: string;
};

type SidebarUser = {
  username: string;
  email: string;
  avatar?: string;
  discordId?: string;
} | null;

type Copy = {
  navDashboard: string;
  navPlayers: string;
  navDetections: string;
  navEvidence: string;
  navBans: string;
  navProtections: string;
  navCore: string;
  navPunishments: string;
  navGoatAi: string;
  navEvents: string;
  navGlobalBan: string;
  navAcId: string;
  navWall: string;
  navQuickWipe: string;
  navStaff: string;
  navPermissions: string;
  navNotifications: string;
  navSettings: string;
  navSupport: string;
  sectionMonitoring: string;
  sectionInfraSecurity: string;
  sectionTools: string;
  sectionTeamManagement: string;
  serverOnline: string;
  serverOffline: string;
  closeMenuAria: string;
  accountLabel: string;
  profileLabel: string;
  logoutLabel: string;
  defaultAdminName: string;
};

const pt: Copy = {
  navDashboard: "Dashboard",
  navPlayers: "Jogadores",
  navDetections: "Detecções",
  navEvidence: "Evidências",
  navBans: "Banimentos",
  navProtections: "Proteções",
  navCore: "Núcleo",
  navPunishments: "Punições",
  navGoatAi: "GOAT AI",
  navEvents: "Eventos",
  navGlobalBan: "Global Ban",
  navAcId: "AC-ID",
  navWall: "Wall",
  navQuickWipe: "Wipe Rápido",
  navStaff: "Staff",
  navPermissions: "Permissões",
  navNotifications: "Notificações",
  navSettings: "Configurações",
  navSupport: "Suporte",
  sectionMonitoring: "Monitoramento",
  sectionInfraSecurity: "Infra & Segurança",
  sectionTools: "Ferramentas",
  sectionTeamManagement: "Gestão de Equipe",
  serverOnline: "Servidor online",
  serverOffline: "Servidor offline",
  closeMenuAria: "Fechar menu",
  accountLabel: "Conta",
  profileLabel: "Perfil",
  logoutLabel: "Sair",
  defaultAdminName: "Administrador",
};

const en: Copy = {
  navDashboard: "Dashboard",
  navPlayers: "Players",
  navDetections: "Detections",
  navEvidence: "Evidence",
  navBans: "Bans",
  navProtections: "Protections",
  navCore: "Core",
  navPunishments: "Punishments",
  navGoatAi: "GOAT AI",
  navEvents: "Events",
  navGlobalBan: "Global Ban",
  navAcId: "AC-ID",
  navWall: "Wall",
  navQuickWipe: "Quick Wipe",
  navStaff: "Staff",
  navPermissions: "Permissions",
  navNotifications: "Notifications",
  navSettings: "Settings",
  navSupport: "Support",
  sectionMonitoring: "Monitoring",
  sectionInfraSecurity: "Infra & Security",
  sectionTools: "Tools",
  sectionTeamManagement: "Team Management",
  serverOnline: "Server online",
  serverOffline: "Server offline",
  closeMenuAria: "Close menu",
  accountLabel: "Account",
  profileLabel: "Profile",
  logoutLabel: "Log out",
  defaultAdminName: "Administrator",
};

const getMonitoramento = (t: Copy): Item[] => [
  { icon: Gauge, label: t.navDashboard, slug: "" },
  { icon: Users, label: t.navPlayers, slug: "jogadores" },
  { icon: Bug, label: t.navDetections, slug: "deteccoes" },
  { icon: FileSearch, label: t.navEvidence, slug: "evidencias" },
  { icon: ShieldCheck, label: t.navBans, slug: "banimentos" },
];

const getInfraestrutura = (t: Copy): Item[] => [
  { icon: Boxes, label: t.navProtections, slug: "protecoes" },
  { icon: Settings2, label: t.navCore, slug: "nucleo" },
  { icon: Gavel, label: t.navPunishments, slug: "punicoes" },
  { icon: BrainCircuit, label: t.navGoatAi, slug: "goat-ai" },
  { icon: Activity, label: t.navEvents, slug: "eventos" },
  { icon: Globe, label: t.navGlobalBan, slug: "global-ban" },
  { icon: BadgeCheck, label: t.navAcId, slug: "ac-id" },
];

const getFerramentas = (t: Copy): Item[] => [
  { icon: Wallpaper, label: t.navWall, slug: "wall" },
  { icon: Eraser, label: t.navQuickWipe, slug: "wipe" },
];

const getEquipe = (t: Copy): Item[] => [
  { icon: UserCog, label: t.navStaff, slug: "staff" },
  { icon: KeyRound, label: t.navPermissions, slug: "permissoes" },
  { icon: Bell, label: t.navNotifications, slug: "notificacoes" },
];

export function DashboardSidebar({
  collapsed = false,
  online = false,
  mobileOpen = false,
  onCloseMobile,
}: {
  collapsed?: boolean;
  online?: boolean;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}) {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  const [user, setUser] = useState<SidebarUser>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("goat_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {}
  }, []);

  return (
    <>
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col overflow-hidden border-r border-hairline bg-sidebar transition-[width] duration-200 lg:flex ${
          collapsed ? "w-[68px]" : "w-[240px]"
        }`}
      >
        <SidebarContent collapsed={collapsed} online={online} user={user} t={t} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={onCloseMobile} />
          <aside className="absolute top-0 left-0 flex h-full w-[260px] flex-col border-r border-hairline bg-sidebar shadow-2xl">
            <MriButton
              variant="ghost"
              size="icon"
              onClick={onCloseMobile}
              aria-label={t.closeMenuAria}
              className="absolute top-3 right-3 z-10 h-7 w-7 rounded-md text-foreground/60"
            >
              <X className="h-4 w-4" />
            </MriButton>
            <SidebarContent
              collapsed={false}
              online={online}
              user={user}
              onNavClick={onCloseMobile}
              t={t}
            />
          </aside>
        </div>
      )}
    </>
  );
}

function SidebarContent({
  collapsed,
  online,
  user,
  onNavClick,
  t,
}: {
  collapsed: boolean;
  online: boolean;
  user: SidebarUser;
  onNavClick?: () => void;
  t: Copy;
}) {
  return (
    <>
      <div
        className={`flex h-14 items-center border-b border-hairline ${collapsed ? "justify-center px-2" : "justify-between px-4"}`}
      >
        <div className="flex items-center gap-2">
          <img src={logo} alt="GOAT" className="h-6 w-auto" />
          {!collapsed && (
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                online
                  ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)] animate-pulse"
                  : "bg-red-500/80"
              }`}
              title={online ? t.serverOnline : t.serverOffline}
            />
          )}
        </div>
        {!collapsed && (
          <button className="flex h-7 w-7 items-center justify-center rounded-md text-foreground/30 transition-colors hover:text-foreground/70">
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <nav
        onClick={onNavClick}
        className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2"
      >
        {!collapsed && <SectionLabel small>{t.sectionMonitoring}</SectionLabel>}
        <div className="space-y-0.5">
          {getMonitoramento(t).map((i) => (
            <NavRow key={i.slug} {...i} collapsed={collapsed} />
          ))}
        </div>

        {!collapsed && <SectionLabel small>{t.sectionInfraSecurity}</SectionLabel>}
        <div className={collapsed ? "mt-2 space-y-0.5" : "space-y-0.5"}>
          {getInfraestrutura(t).map((i) => (
            <NavRow key={i.slug} {...i} collapsed={collapsed} />
          ))}
        </div>

        {!collapsed && <SectionLabel small>{t.sectionTools}</SectionLabel>}
        <div className={collapsed ? "mt-2 space-y-0.5" : "space-y-0.5"}>
          {getFerramentas(t).map((i) => (
            <NavRow key={i.slug} {...i} collapsed={collapsed} />
          ))}
        </div>

        {!collapsed && <SectionLabel small>{t.sectionTeamManagement}</SectionLabel>}
        <div className={collapsed ? "mt-2 space-y-0.5" : "space-y-0.5"}>
          {getEquipe(t).map((i) => (
            <NavRow key={i.slug} {...i} collapsed={collapsed} />
          ))}
        </div>
      </nav>

      <div className="space-y-0.5 border-t border-hairline px-2 py-2">
        <NavRow
          icon={Settings}
          label={t.navSettings}
          slug="configuracoes"
          small
          collapsed={collapsed}
        />
        <NavRow
          icon={Headphones}
          label={t.navSupport}
          slug="suporte"
          small
          collapsed={collapsed}
          href="https://discord.gg/goatnetworkgg"
        />

        <button
          className={`group relative mt-2 flex w-full items-center gap-2.5 rounded-md py-2 text-left transition-colors hover:bg-secondary ${collapsed ? "justify-center px-0" : "px-2.5"}`}
        >
          {discordAvatarUrl(user?.discordId, user?.avatar) ? (
            <img
              src={discordAvatarUrl(user?.discordId, user?.avatar)!}
              alt="Avatar"
              className="h-6 w-6 shrink-0 rounded bg-secondary object-cover"
            />
          ) : (
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-secondary text-[10px] font-semibold text-foreground/80 uppercase">
              {user?.username ? user.username.substring(0, 2) : "GU"}
            </span>
          )}
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[11.5px] font-medium text-foreground/80">
                  {user?.username || t.defaultAdminName}
                </span>
                <span className="block truncate text-[10px] text-foreground/35">
                  {user?.email || "admin@goatpay.com"}
                </span>
              </span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-foreground/25" />
            </>
          )}

          <div
            className={`absolute bottom-full mb-2 hidden w-48 rounded-md border border-hairline bg-popover p-1 shadow-xl group-focus-within:block group-hover:block ${collapsed ? "left-0" : "left-0 w-full"}`}
          >
            <div className="px-2 py-1.5 font-mono text-[10px] tracking-widest text-foreground/40 uppercase">
              {t.accountLabel}
            </div>
            <Link
              to="/servers?tab=conta"
              className="block w-full rounded px-2 py-1.5 text-left text-[12px] text-foreground/70 hover:bg-secondary hover:text-foreground"
            >
              {t.profileLabel}
            </Link>
            <MriButton
              variant="ghost"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/auth";
              }}
              className="w-full justify-start rounded px-2 py-1.5 text-[12px] text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              {t.logoutLabel}
            </MriButton>
          </div>
        </button>
      </div>
    </>
  );
}

function SectionLabel({ children, small }: { children: React.ReactNode; small?: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 px-2.5 pb-1.5 ${small ? "pt-4" : "pt-5"}`}>
      <span className="h-[3px] w-[3px] shrink-0 rounded-[1px] bg-gold/70" />
      <p
        className={`shrink-0 font-mono tracking-[0.16em] text-foreground/35 uppercase ${small ? "text-[8.5px]" : "text-[9px]"}`}
      >
        {children}
      </p>
      <span className="h-px flex-1 bg-hairline" />
    </div>
  );
}

function NavRow({
  icon: Icon,
  label,
  slug,
  small,
  collapsed,
  href,
}: Item & { small?: boolean; collapsed?: boolean }) {
  const derivedSlug =
    slug !== undefined
      ? slug
      : label
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-");

  const isHome = derivedSlug === "";

  const { pathname } = useLocation();
  const isActive =
    !href &&
    (isHome
      ? pathname === "/dashboard" || pathname === "/dashboard/"
      : pathname.startsWith(`/dashboard/${derivedSlug}`));

  const rowClassName = `group relative flex w-full items-center gap-2.5 rounded-md text-left transition-all duration-150 ${
    collapsed
      ? "justify-center px-0 py-[6px]"
      : small
        ? "pl-3 pr-2 py-[5px]"
        : "pl-3 pr-2.5 py-[6px]"
  } ${
    isActive ? "text-gold" : "text-foreground/45 hover:bg-secondary/60 hover:text-foreground/80"
  }`;

  const content = (
    <>
      {isActive && (
        <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-gold shadow-[0_0_6px_var(--gold)]" />
      )}
      <span
        className={cn(
          "grid shrink-0 place-items-center rounded-[6px] border transition-colors",
          small ? "h-[22px] w-[22px]" : "h-[26px] w-[26px]",
          isActive
            ? "border-gold/40 bg-gold/10 text-gold"
            : "border-transparent text-current group-hover:border-hairline",
        )}
      >
        <Icon className={small ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </span>
      {!collapsed && (
        <span
          className={`min-w-0 flex-1 truncate ${
            small ? "text-[11.5px] font-normal" : "text-[12px] font-medium"
          }`}
        >
          {label}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        title={collapsed ? label : undefined}
        className={rowClassName}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      to={isHome ? "/dashboard" : `/dashboard/${derivedSlug}`}
      title={collapsed ? label : undefined}
      className={rowClassName}
    >
      {content}
    </Link>
  );
}
