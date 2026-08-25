import * as React from "react";
import { cn } from "@/lib/utils";
import { mriBadgeVariants, type MriBadgeTone } from "./mri-badge-variants";

export interface MriBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: MriBadgeTone;
  /** Compat com o antigo <Tag solid />: equivale a tone="gold" quando tone não é passado. */
  solid?: boolean;
}

export const MriBadge = React.forwardRef<HTMLSpanElement, MriBadgeProps>(
  ({ className, tone, solid, ...props }, ref) => {
    const resolvedTone: MriBadgeTone = tone ?? (solid ? "gold" : "neutral");
    return (
      <span ref={ref} className={cn(mriBadgeVariants({ tone: resolvedTone }), className)} {...props} />
    );
  },
);
MriBadge.displayName = "MriBadge";
