import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { MriCard } from "@/components/ui/MriCard";

type Copy = {
  demoBadge: string;
  simulatedFeed: string;
  activeModules: string;
  othersCount: string;
  columnModule: string;
  columnConfidence: string;
  columnAction: string;
};

const pt: Copy = {
  demoBadge: "Demonstração",
  simulatedFeed: "feed simulado",
  activeModules: "Módulos ativos",
  othersCount: "+ 34 outros",
  columnModule: "módulo",
  columnConfidence: "confiança",
  columnAction: "ação",
};

const en: Copy = {
  demoBadge: "Demo",
  simulatedFeed: "simulated feed",
  activeModules: "Active modules",
  othersCount: "+ 34 others",
  columnModule: "module",
  columnConfidence: "confidence",
  columnAction: "action",
};

type Action = "BAN" | "KICK" | "FLAG";

const ACTION_STYLE: Record<Action, string> = {
  BAN: "text-red-400 bg-red-400/10",
  KICK: "text-orange-400 bg-orange-400/10",
  FLAG: "text-gold bg-gold/10",
};

const POOL: { module: string; conf: number; action: Action }[] = [
  { module: "AntiAimbot", conf: 88, action: "BAN" },
  { module: "AntiNoClip", conf: 85, action: "BAN" },
  { module: "AntiSilentAim", conf: 92, action: "BAN" },
  { module: "AntiWeaponFireRate", conf: 60, action: "FLAG" },
  { module: "AntiVehicle", conf: 80, action: "KICK" },
  { module: "AntiSpeed", conf: 80, action: "KICK" },
  { module: "AntiGodMode", conf: 95, action: "BAN" },
  { module: "AntiEntity", conf: 100, action: "BAN" },
  { module: "AntiRagdollClipExploit", conf: 55, action: "FLAG" },
  { module: "AntiVehicleGodmode", conf: 70, action: "FLAG" },
];

const MODULES = [
  "AntiAimbot",
  "AntiNoClip",
  "AntiSpeed",
  "AntiSilentAim",
  "AntiWeaponFireRate",
  "AntiEconomyDupe",
  "Watchdog",
];

function fakeAcId() {
  return "GOAT-" + Math.random().toString(16).slice(2, 8);
}

function timeNow() {
  return new Date().toLocaleTimeString("pt-BR", { hour12: false });
}

export function CodePanel() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  const [feed, setFeed] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      ...POOL[i % POOL.length],
      acId: fakeAcId(),
      time: timeNow(),
    })),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setFeed((prev) => {
        const next = POOL[Math.floor(Math.random() * POOL.length)];
        const row = { id: Date.now(), ...next, acId: fakeAcId(), time: timeNow() };
        return [row, ...prev].slice(0, 7);
      });
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <MriCard className="mx-auto w-full max-w-[1120px] overflow-hidden border-hairline bg-card p-0 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between border-b border-hairline px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
          </span>
          <span className="font-mono text-[11.5px] tracking-wide text-foreground/85">
            GOAT.Operations
            <span className="ml-0.5 inline-block h-[11px] w-[6px] translate-y-[1px] animate-pulse bg-gold/70 align-middle" />
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
          <span className="animate-pulse rounded border border-hairline px-1.5 py-0.5">
            {t.demoBadge}
          </span>
          <span className="hidden sm:inline">{t.simulatedFeed}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[190px_1fr]">
        <div className="hidden flex-col gap-1 border-r border-hairline p-4 font-mono text-[12px] md:flex">
          <p className="mb-2 text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
            {t.activeModules}
          </p>
          {MODULES.map((m) => (
            <div
              key={m}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-foreground/75"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold/70" />
              <span className="truncate">{m}</span>
            </div>
          ))}
          <p className="mt-1 px-2 text-muted-foreground/60">{t.othersCount}</p>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-6 border-b border-hairline px-5 py-2.5 font-mono text-[11px] text-muted-foreground">
            <span className="text-foreground/70">feed.detections</span>
            <span className="ml-auto hidden sm:inline">{t.columnModule}</span>
            <span className="hidden w-16 text-right sm:inline">{t.columnConfidence}</span>
            <span className="w-14 text-right">{t.columnAction}</span>
          </div>
          <div className="flex flex-col divide-y divide-hairline">
            {feed.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-3 px-5 py-2.5 font-mono text-[11.5px] transition-colors animate-[feed-row-in_0.9s_cubic-bezier(0.22,1,0.36,1)_both]"
              >
                <span className="tabular text-muted-foreground/60">{d.time}</span>
                <span className="hidden text-muted-foreground/50 lg:inline">{d.acId}</span>
                <span className="ml-auto truncate text-foreground/85">{d.module}</span>
                <span className="tabular hidden w-16 text-right text-muted-foreground sm:inline">
                  {d.conf}%
                </span>
                <span
                  className={`w-14 shrink-0 rounded px-1.5 py-0.5 text-right text-[10px] font-bold ${ACTION_STYLE[d.action]}`}
                >
                  {d.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MriCard>
  );
}
