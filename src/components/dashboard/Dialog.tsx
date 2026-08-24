import { createContext, useContext, useEffect, useRef, useState } from "react";
import type React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";

type Copy = {
  confirmLabel: string;
  cancelLabel: string;
  notifyErrorTitle: string;
  notifyInfoTitle: string;
  closeAria: string;
  gotIt: string;
};

const pt: Copy = {
  confirmLabel: "Confirmar",
  cancelLabel: "Cancelar",
  notifyErrorTitle: "Algo deu errado",
  notifyInfoTitle: "Aviso",
  closeAria: "Fechar",
  gotIt: "Entendi",
};

const en: Copy = {
  confirmLabel: "Confirm",
  cancelLabel: "Cancel",
  notifyErrorTitle: "Something went wrong",
  notifyInfoTitle: "Notice",
  closeAria: "Close",
  gotIt: "Got it",
};

type DialogField = {
  key: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  multiline?: boolean;
};

type FormRequest = {
  kind: "form";
  title: string;
  description?: string;
  fields: DialogField[];
  confirmLabel: string;
  cancelLabel: string;
  danger?: boolean;
  resolve: (value: Record<string, string> | null) => void;
};

type ConfirmRequest = {
  kind: "confirm";
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel: string;
  danger?: boolean;
  resolve: (value: boolean) => void;
};

type NotifyRequest = {
  kind: "notify";
  title: string;
  description: string;
  tone: "error" | "success" | "info";
  resolve: () => void;
};

type Request = FormRequest | ConfirmRequest | NotifyRequest;

interface DialogContextValue {
  form: (opts: {
    title: string;
    description?: string;
    fields: DialogField[];
    confirmLabel?: string;
    cancelLabel?: string;
    danger?: boolean;
  }) => Promise<Record<string, string> | null>;
  prompt: (opts: {
    title: string;
    label?: string;
    description?: string;
    placeholder?: string;
    defaultValue?: string;
    multiline?: boolean;
    confirmLabel?: string;
    cancelLabel?: string;
    danger?: boolean;
  }) => Promise<string | null>;
  confirm: (opts: {
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    danger?: boolean;
  }) => Promise<boolean>;
  notify: (opts: {
    title?: string;
    description: string;
    tone?: "error" | "success" | "info";
  }) => Promise<void>;
}

const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialog must be used within a DialogProvider");
  return ctx;
}

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  const [request, setRequest] = useState<Request | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  const form: DialogContextValue["form"] = (opts) => {
    return new Promise((resolve) => {
      const initial: Record<string, string> = {};
      opts.fields.forEach((f) => {
        initial[f.key] = f.defaultValue ?? "";
      });
      setValues(initial);
      setRequest({
        kind: "form",
        title: opts.title,
        description: opts.description,
        fields: opts.fields,
        confirmLabel: opts.confirmLabel ?? t.confirmLabel,
        cancelLabel: opts.cancelLabel ?? t.cancelLabel,
        danger: opts.danger,
        resolve,
      });
    });
  };

  const prompt: DialogContextValue["prompt"] = async (opts) => {
    const result = await form({
      title: opts.title,
      description: opts.description,
      fields: [
        {
          key: "value",
          label: opts.label ?? "",
          placeholder: opts.placeholder,
          defaultValue: opts.defaultValue,
          multiline: opts.multiline,
        },
      ],
      confirmLabel: opts.confirmLabel,
      cancelLabel: opts.cancelLabel,
      danger: opts.danger,
    });
    return result ? result.value : null;
  };

  const confirm: DialogContextValue["confirm"] = (opts) => {
    return new Promise((resolve) => {
      setRequest({
        kind: "confirm",
        title: opts.title,
        description: opts.description,
        confirmLabel: opts.confirmLabel ?? t.confirmLabel,
        cancelLabel: opts.cancelLabel ?? t.cancelLabel,
        danger: opts.danger,
        resolve,
      });
    });
  };

  const notify: DialogContextValue["notify"] = (opts) => {
    return new Promise((resolve) => {
      setRequest({
        kind: "notify",
        title: opts.title ?? (opts.tone === "error" ? t.notifyErrorTitle : t.notifyInfoTitle),
        description: opts.description,
        tone: opts.tone ?? "info",
        resolve,
      });
    });
  };

  const close = () => setRequest(null);

  const handleCancel = () => {
    if (!request) return;
    if (request.kind === "form") request.resolve(null);
    else if (request.kind === "confirm") request.resolve(false);
    else request.resolve();
    close();
  };

  const handleConfirm = () => {
    if (!request) return;
    if (request.kind === "form") request.resolve({ ...values });
    else if (request.kind === "confirm") request.resolve(true);
    else request.resolve();
    close();
  };

  return (
    <DialogContext.Provider value={{ form, prompt, confirm, notify }}>
      {children}
      <AnimatePresence>
        {request && (
          <DialogModal
            request={request}
            values={values}
            setValues={setValues}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
          />
        )}
      </AnimatePresence>
    </DialogContext.Provider>
  );
}

function DialogModal({
  request,
  values,
  setValues,
  onCancel,
  onConfirm,
}: {
  request: Request;
  values: Record<string, string>;
  setValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  const firstFieldRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    firstFieldRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const danger = request.kind === "notify" ? request.tone === "error" : !!request.danger;

  const hasEmptyRequired =
    request.kind === "form" &&
    request.fields.some((f) => !f.defaultValue && !(values[f.key] ?? "").trim());

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onCancel}
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="goat-dialog-title"
        className="relative w-full max-w-sm rounded-xl border border-border bg-popover shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <h2 id="goat-dialog-title" className="text-[14px] font-semibold text-foreground">
              {request.title}
            </h2>
            {request.description && (
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                {request.description}
              </p>
            )}
          </div>
          <button
            onClick={onCancel}
            aria-label={t.closeAria}
            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          {request.kind === "form" &&
            request.fields.map((f, i) => (
              <label key={f.key} className="block">
                {f.label && (
                  <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                    {f.label}
                  </span>
                )}
                {f.multiline ? (
                  <textarea
                    ref={
                      i === 0 ? (firstFieldRef as React.RefObject<HTMLTextAreaElement>) : undefined
                    }
                    value={values[f.key] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    rows={3}
                    className="w-full resize-none rounded-lg border border-border bg-card/60 px-3 py-2 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold/50"
                  />
                ) : (
                  <input
                    ref={i === 0 ? (firstFieldRef as React.RefObject<HTMLInputElement>) : undefined}
                    value={values[f.key] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !hasEmptyRequired) onConfirm();
                    }}
                    placeholder={f.placeholder}
                    className="w-full rounded-lg border border-border bg-card/60 px-3 py-2 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold/50"
                  />
                )}
              </label>
            ))}

          {request.kind === "notify" && (
            <p
              className={cn(
                "text-[13px] leading-relaxed",
                danger ? "text-destructive" : "text-foreground",
              )}
            >
              {request.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
          {request.kind !== "notify" && (
            <button
              onClick={onCancel}
              className="rounded-lg px-3.5 py-2 text-[12.5px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {request.cancelLabel}
            </button>
          )}
          <button
            onClick={onConfirm}
            disabled={hasEmptyRequired}
            className={cn(
              "rounded-lg px-3.5 py-2 text-[12.5px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
              danger
                ? "bg-destructive text-destructive-foreground hover:brightness-110"
                : "bg-gold text-primary-foreground hover:brightness-110",
            )}
          >
            {request.kind === "notify" ? t.gotIt : request.confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
