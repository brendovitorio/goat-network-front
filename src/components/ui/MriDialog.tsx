import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Modal declarativo (Radix) com a mesma casca visual do Dialog.tsx
// imperativo (useDialog/DialogProvider). Para confirm/prompt/notify use
// useDialog() — esse componente é pra modais novos que precisam de estado
// aberto/fechado controlado de fora (ex: relatório, preview).
export const MriDialog = DialogPrimitive.Root;
export const MriDialogTrigger = DialogPrimitive.Trigger;

export function MriDialogContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-background/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-[100] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-popover shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function MriDialogHeader({
  title,
  description,
  onCloseAria = "Fechar",
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  onCloseAria?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
      <div className="min-w-0">
        <DialogPrimitive.Title className="text-[14px] font-semibold text-foreground">
          {title}
        </DialogPrimitive.Title>
        {description && (
          <DialogPrimitive.Description className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
            {description}
          </DialogPrimitive.Description>
        )}
      </div>
      <DialogPrimitive.Close
        aria-label={onCloseAria}
        className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </DialogPrimitive.Close>
    </div>
  );
}

export const MriDialogClose = DialogPrimitive.Close;
