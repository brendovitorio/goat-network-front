import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Server,
  LayoutDashboard,
  User,
  LogOut,
  ArrowRight,
  Globe,
} from "lucide-react";
import logo from "@/assets/goat-logo.png";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";

const DISCORD_URL = "https://discord.gg/VpHaMPpEHZ";

type Copy = {
  links: { label: string; href: string; dropdown: boolean }[];
  discordAria: string;
  accountConnected: string;
  myServers: string;
  dashboard: string;
  myAccount: string;
  logout: string;
  getStarted: string;
  defaultUsername: string;
  switchLangAria: string;
};

const pt: Copy = {
  links: [
    { label: "Produtos", href: "/products", dropdown: false },
    { label: "Changelog", href: "/changelog", dropdown: false },
    { label: "Empresa", href: "/empresa", dropdown: false },
    { label: "FAQ", href: "/#faq", dropdown: false },
  ],
  discordAria: "Entrar no Discord",
  accountConnected: "Conta conectada",
  myServers: "Meus Servidores",
  dashboard: "Dashboard",
  myAccount: "Minha Conta",
  logout: "Sair da conta",
  getStarted: "Começar agora",
  defaultUsername: "Usuário",
  switchLangAria: "Switch to English",
};

const en: Copy = {
  links: [
    { label: "Products", href: "/products", dropdown: false },
    { label: "Changelog", href: "/changelog", dropdown: false },
    { label: "Company", href: "/empresa", dropdown: false },
    { label: "FAQ", href: "/#faq", dropdown: false },
  ],
  discordAria: "Join Discord",
  accountConnected: "Account connected",
  myServers: "My Servers",
  dashboard: "Dashboard",
  myAccount: "My Account",
  logout: "Log out",
  getStarted: "Get started",
  defaultUsername: "User",
  switchLangAria: "Mudar para Português",
};

export function Nav() {
  const { lang, setLang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  const links = t.links;
  const [user, setUser] = useState<{
    username: string;
    avatar?: string;
    discordId?: string;
  } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const tickingRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled((prev) => (prev === y > 72 ? prev : y > 72));
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const pct = max > 0 ? Math.min(100, Math.max(0, (y / max) * 100)) : 0;
        if (progressRef.current) progressRef.current.style.width = `${pct}%`;
        tickingRef.current = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const username = params.get("username");
      const avatar = params.get("avatar");
      const discordId = params.get("discordId");

      if (token) {
        localStorage.setItem("goat_auth_token", token);
        const userData = {
          username: username || t.defaultUsername,
          avatar: avatar || undefined,
          discordId: discordId || undefined,
        };
        localStorage.setItem("goat_user", JSON.stringify(userData));
        setUser(userData);
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        const storedUser = localStorage.getItem("goat_user");
        const storedToken = localStorage.getItem("goat_auth_token");
        if (storedToken && storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            setUser({ username: t.defaultUsername });
          }
        } else if (storedToken) {
          setUser({ username: t.defaultUsername });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("goat_auth_token");
    localStorage.removeItem("goat_user");
    setUser(null);
    setMenuOpen(false);
    window.location.href = "/";
  };

  return (
    <header
      className={cn(
        "fixed left-1/2 z-50 w-full max-w-[960px] -translate-x-1/2 px-4 transition-[top] duration-500 ease-out",
        scrolled ? "top-4" : "top-6",
      )}
    >
      <div className="pointer-events-none fixed top-0 left-0 z-[60] h-[2px] w-full bg-transparent">
        <div
          ref={progressRef}
          className="h-full w-0 bg-gold/70 transition-[width] duration-100 ease-linear"
        />
      </div>
      <div
        className={cn(
          "flex w-full items-center justify-between rounded-full border transition-all duration-500 ease-out",
          scrolled
            ? "h-[52px] border-hairline bg-popover/90 px-4 shadow-2xl backdrop-blur-xl"
            : "h-14 border-transparent bg-popover/40 px-4 shadow-none backdrop-blur-md",
        )}
      >
        <a href="/" className="flex items-center gap-2 pl-2">
          <img
            src={logo}
            alt="GOAT"
            className={cn(
              "w-auto transition-[height] duration-500 ease-out",
              scrolled ? "h-7" : "h-8",
            )}
          />
        </a>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
              {l.dropdown && <ChevronDown className="h-3 w-3 opacity-60" />}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setLang(lang === "pt" ? "en" : "pt")}
            aria-label={t.switchLangAria}
            className="hidden items-center justify-center gap-1 rounded-full border border-hairline px-2.5 py-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === "pt" ? "PT" : "EN"}
          </button>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noreferrer"
            aria-label={t.discordAria}
            className="hidden items-center justify-center text-muted-foreground transition-colors hover:text-gold sm:flex"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-[18px] w-[18px]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
            </svg>
          </a>
          {user ? (
            <div className="relative z-[999]">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-md border border-hairline bg-surface-2 p-1 pr-2 backdrop-blur transition-all hover:bg-secondary"
              >
                <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded bg-emerald-500/20 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  {user.avatar && user.discordId ? (
                    <img
                      src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`}
                      alt={user.username}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    (user.username[0] || "U").toUpperCase()
                  )}
                </div>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 text-muted-foreground transition-transform duration-200",
                    menuOpen && "rotate-180",
                  )}
                />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-hairline bg-surface p-1.5 shadow-2xl backdrop-blur-xl z-[999]"
                  >
                    <div className="border-b border-hairline px-3 py-2">
                      <p className="truncate text-[13px] font-semibold text-foreground">
                        {user.username}
                      </p>
                      <p className="text-[9.5px] font-semibold uppercase tracking-wider text-emerald-400">
                        {t.accountConnected}
                      </p>
                    </div>

                    <div className="pt-1.5 space-y-0.5">
                      <a
                        href="/servers"
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12.5px] font-medium text-foreground transition-colors hover:bg-secondary"
                      >
                        <Server className="h-4 w-4" />
                        {t.myServers}
                      </a>
                      <a
                        href="/dashboard"
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12.5px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        {t.dashboard}
                      </a>
                      <a
                        href="/dashboard/configuracoes"
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12.5px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <User className="h-4 w-4" />
                        {t.myAccount}
                      </a>
                    </div>

                    <div className="my-1.5 border-t border-hairline" />

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[12.5px] text-red-400 transition-colors hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      {t.logout}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <a
              href="/auth"
              className="group flex h-9 items-center gap-2 rounded-full bg-primary pl-4 pr-1.5 text-[13px] font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              {t.getStarted}
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/15 text-primary-foreground">
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
