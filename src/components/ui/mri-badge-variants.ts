import { cva, type VariantProps } from "class-variance-authority";

export const mriBadgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10.5px] font-medium transition-colors",
  {
    variants: {
      tone: {
        neutral: "border border-border text-muted-foreground",
        gold: "bg-gold text-primary-foreground",
        warning: "border border-amber-500/30 bg-amber-500/12 text-amber-400",
        critical: "border border-red-500/30 bg-red-500/12 text-red-400",
        success: "border border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

export type MriBadgeTone = VariantProps<typeof mriBadgeVariants>["tone"];

// Mesma leitura usada em punishmentTone/moduleActionTone (sections.tsx):
// BAN => critical, KICK => warning, FLAG/alerta => gold, resto => neutral.
export function toneForAction(action: string): NonNullable<MriBadgeTone> {
  const a = (action || "").toLowerCase();
  if (a.includes("ban")) return "critical";
  if (a.includes("kick")) return "warning";
  if (a.includes("flag") || a.includes("alerta")) return "gold";
  return "neutral";
}

export function toneForSeverity(value: number): NonNullable<MriBadgeTone> {
  if (value >= 85) return "critical";
  if (value >= 60) return "warning";
  return "gold";
}
