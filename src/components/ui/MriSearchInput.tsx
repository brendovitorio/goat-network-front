import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MriSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const MriSearchInput = React.forwardRef<HTMLInputElement, MriSearchInputProps>(
  ({ value, onChange, placeholder, className }, ref) => (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-card/40 py-2.5 pl-9 pr-3 text-[12.5px] outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/40"
      />
    </div>
  ),
);
MriSearchInput.displayName = "MriSearchInput";
