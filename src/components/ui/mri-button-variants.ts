import { cva, type VariantProps } from "class-variance-authority";

export const mriButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent focus-visible:outline-none",
  {
    variants: {
      variant: {
        // CTA dourado usado em quase toda ação primária do dashboard hoje
        // (ex: sections.tsx:3036, 3176, 3570) — não é o bg-gold sólido, é o
        // tom translúcido que já é o "primary" real do produto.
        primary:
          "border border-gold/30 bg-gold/10 text-gold hover:border-gold/50 hover:bg-gold/15",
        // Gold sólido (ex: botão de confirmar do Dialog.tsx, toggle ligado).
        solid: "bg-gold text-primary-foreground hover:brightness-110",
        outline:
          "border border-border text-muted-foreground hover:bg-accent hover:text-foreground",
        ghost: "text-muted-foreground hover:bg-secondary hover:text-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:brightness-110",
        // Vermelho translúcido usado em ações destrutivas de menor peso
        // (pedir/aprovar wipe em sections.tsx) — mesmo espírito do "primary"
        // dourado, só que na tonalidade de perigo.
        "danger-outline":
          "border border-red-500/30 bg-red-500/10 font-medium text-red-400 hover:border-red-500/50 hover:bg-red-500/15",
      },
      size: {
        default: "px-3.5 py-2 text-[12.5px]",
        sm: "px-3 py-1.5 text-[12px]",
        icon: "h-8 w-8 shrink-0 p-0 text-[12.5px]",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
    },
  },
);

export type MriButtonVariant = VariantProps<typeof mriButtonVariants>["variant"];
export type MriButtonSize = VariantProps<typeof mriButtonVariants>["size"];
