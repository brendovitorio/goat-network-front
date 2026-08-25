import * as React from "react";
import { cn } from "@/lib/utils";

export interface MriInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

// Mesmo estilo de campo usado no Dialog.tsx (form/prompt) e em vários
// formulários do dashboard: border-border, bg-card/60, foco em border-gold/50.
export const MriInput = React.forwardRef<HTMLInputElement, MriInputProps>(
  ({ className, label, id, ...props }, ref) => {
    const input = (
      <input
        ref={ref}
        id={id}
        className={cn(
          "w-full rounded-lg border border-border bg-card/60 px-3 py-2 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold/50",
          className,
        )}
        {...props}
      />
    );
    if (!label) return input;
    return (
      <label className="block" htmlFor={id}>
        <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          {label}
        </span>
        {input}
      </label>
    );
  },
);
MriInput.displayName = "MriInput";

export interface MriTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const MriTextarea = React.forwardRef<HTMLTextAreaElement, MriTextareaProps>(
  ({ className, label, id, rows = 3, ...props }, ref) => {
    const textarea = (
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className={cn(
          "w-full resize-none rounded-lg border border-border bg-card/60 px-3 py-2 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold/50",
          className,
        )}
        {...props}
      />
    );
    if (!label) return textarea;
    return (
      <label className="block" htmlFor={id}>
        <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          {label}
        </span>
        {textarea}
      </label>
    );
  },
);
MriTextarea.displayName = "MriTextarea";
