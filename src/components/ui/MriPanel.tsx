import * as React from "react";
import { cn } from "@/lib/utils";

export interface MriPanelProps {
  title?: string;
  desc?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

// Mesma estrutura do Panel original em dashboard/shell.tsx — extraído pro
// kit pra virar a base compartilhada entre o dashboard web e o painel
// in-game (goat_ac).
export function MriPanel({ title, desc, action, children, className }: MriPanelProps) {
  return (
    <section className={cn("rounded-xl border border-border bg-card transition-colors", className)}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="text-[13.5px] font-semibold tracking-tight">{title}</h2>}
            {desc && <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{desc}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={cn(title ? "border-t border-border" : "", "p-5")}>{children}</div>
    </section>
  );
}
