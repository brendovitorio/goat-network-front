import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface MriToggleProps {
  checked: boolean;
  onChange: () => void;
  ariaLabel: string;
  disabled?: boolean;
  /**
   * Estilo do estado "desligado": "danger" (padrão) é o vermelho usado em
   * Protections/goat_ac, pra módulo de proteção desativado. "neutral" é o
   * cinza usado em preferências simples (ex: Notifications).
   */
  offTone?: "danger" | "neutral";
}

// Mesmo switch usado em Protections/Notifications/Settings
// (dashboard/sections.tsx) — extraído pro kit em vez de repetido em cada
// seção.
export function MriToggle({ checked, onChange, ariaLabel, disabled, offTone = "danger" }: MriToggleProps) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      className={cn(
        "flex h-5 w-9 shrink-0 items-center rounded-full border p-[3px] transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        checked
          ? "justify-end border-gold/40 bg-gold"
          : offTone === "danger"
            ? "justify-start border-red-500/30 bg-red-500/10"
            : "justify-start border-border bg-accent",
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 34 }}
        className={cn(
          "h-3.5 w-3.5 rounded-full",
          checked ? "bg-primary-foreground" : offTone === "danger" ? "bg-red-500/70" : "bg-muted-foreground",
        )}
      />
    </button>
  );
}
