import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { mriBadgeVariants, toneForAction } from "./mri-badge-variants";

const PUNISHMENT_TIERS = ["FLAG", "KICK", "BAN"] as const;

export interface MriPunishmentSelectProps {
  value: string;
  onChange: (tier: string) => void;
}

// Mesmo hover-dropdown já usado como PunishmentSelect em
// dashboard/sections.tsx (~linha 1206) — movido pro kit e generalizado, em
// vez de duplicado por página. Comportamento idêntico ao original.
export function MriPunishmentSelect({ value, onChange }: MriPunishmentSelectProps) {
  const tone = toneForAction(value);
  return (
    <div className="group/psel relative">
      <button className={cn(mriBadgeVariants({ tone }), "gap-1")}>
        {value}
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>
      <div className="invisible absolute left-0 top-full z-10 mt-1 w-20 rounded-md border border-hairline bg-popover p-1 opacity-0 shadow-xl transition-opacity group-focus-within/psel:visible group-focus-within/psel:opacity-100 group-hover/psel:visible group-hover/psel:opacity-100">
        {PUNISHMENT_TIERS.map((tier) => (
          <button
            key={tier}
            onClick={() => onChange(tier)}
            className={cn(
              "block w-full rounded px-2 py-1 text-left text-[11px] transition-colors hover:bg-secondary",
              tier === value ? "font-medium text-foreground" : "text-muted-foreground",
            )}
          >
            {tier}
          </button>
        ))}
      </div>
    </div>
  );
}
