import * as React from "react";
import { cn } from "@/lib/utils";

export interface MriCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Aplica o hover de borda/fundo usado nos cards clicáveis de lista (ex: módulos, players). */
  interactive?: boolean;
  /** Quando false, aplica opacity-55 (ex: módulo/regra desativada). */
  active?: boolean;
}

export const MriCard = React.forwardRef<HTMLDivElement, MriCardProps>(
  ({ className, interactive, active = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-border p-4 transition-colors",
        interactive && "hover:border-foreground/30 hover:bg-elevated",
        !active && "opacity-55",
        className,
      )}
      {...props}
    />
  ),
);
MriCard.displayName = "MriCard";
