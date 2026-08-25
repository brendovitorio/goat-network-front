import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MriTabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
}

export interface MriTabsProps {
  tabs: MriTabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

// Mesma barra de abas usada em SettingsTabs.tsx (~linha 412) — botões
// simples com estado ativo, sem Radix, pra manter o comportamento
// (state local + render condicional) idêntico ao original.
export function MriTabs({ tabs, activeTab, onChange, className }: MriTabsProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3 border-b border-hairline pb-2", className)}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 border px-3 py-2 text-[12.5px] font-medium transition-colors",
              isActive
                ? "border-hairline bg-elevated text-foreground"
                : "border-transparent text-muted-foreground hover:border-hairline hover:bg-elevated/60 hover:text-foreground/75",
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
