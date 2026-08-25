export interface MriStatProps {
  label: string;
  value: string;
  hint?: string;
}

export function MriStat({ label, value, hint }: MriStatProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/20">
      <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
        <span className="h-[3px] w-[3px] rounded-[1px] bg-gold/70" />
        {label}
      </p>
      <p className="mt-3 text-[26px] font-semibold leading-none tracking-[-0.03em] tabular-nums">
        {value}
      </p>
      {hint && <p className="mt-2 text-[11.5px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
