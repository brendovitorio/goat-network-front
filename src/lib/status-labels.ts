import type { Lang } from "@/i18n/LanguageContext";

const LABELS: Record<Lang, Record<string, string>> = {
  pt: {
    Limpo: "Limpo",
    Suspeito: "Suspeito",
    "Sob análise": "Sob análise",
    Online: "Online",
    Ausente: "Ausente",
    Offline: "Offline",
    Local: "Local",
    Global: "Global",
  },
  en: {
    Limpo: "Clean",
    Suspeito: "Suspicious",
    "Sob análise": "Under review",
    Online: "Online",
    Ausente: "Away",
    Offline: "Offline",
    Local: "Local",
    Global: "Global",
  },
};

export const statusLabel = (status: string | undefined | null, lang: Lang): string => {
  if (!status) return "—";
  return LABELS[lang][status] ?? status;
};
