import * as React from "react";

export interface MriTableProps {
  head: string[];
  rows: React.ReactNode[][];
  cols: string;
}

export function MriTable({ head, rows, cols }: MriTableProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px]">
        <div
          className="grid gap-3 border-b border-border pb-3 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground/70"
          style={{ gridTemplateColumns: cols }}
        >
          {head.map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>
        {rows.map((r, i) => (
          <div
            key={i}
            className="grid items-center gap-3 border-b border-border/60 py-3 text-[12.5px] transition-colors hover:bg-accent/30"
            style={{ gridTemplateColumns: cols }}
          >
            {r.map((c, j) => (
              <span key={j} className="truncate">
                {c}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
