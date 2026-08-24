import type { Lang } from "@/i18n/LanguageContext";

const locale = (lang: Lang) => (lang === "en" ? "en-US" : "pt-BR");

export const formatDate = (raw?: string | Date, lang: Lang = "pt"): string => {
  if (!raw) return "—";
  const date = raw instanceof Date ? raw : new Date(raw);
  if (Number.isNaN(date.getTime())) return typeof raw === "string" ? raw : "—";
  return date.toLocaleDateString(locale(lang));
};

export const formatTime = (raw?: string | Date, lang: Lang = "pt"): string => {
  if (!raw) return "—";
  const date = raw instanceof Date ? raw : new Date(raw);
  if (Number.isNaN(date.getTime())) return typeof raw === "string" ? raw : "—";
  return date.toLocaleTimeString(locale(lang), { hour: "2-digit", minute: "2-digit" });
};

export const formatDateTime = (raw?: string | Date, lang: Lang = "pt"): string => {
  if (!raw) return "—";
  const date = raw instanceof Date ? raw : new Date(raw);
  if (Number.isNaN(date.getTime())) return typeof raw === "string" ? raw : "—";
  return `${formatDate(date, lang)} ${formatTime(date, lang)}`;
};
