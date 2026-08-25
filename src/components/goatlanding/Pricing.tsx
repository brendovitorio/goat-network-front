import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Repeat, Infinity as InfinityIcon, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp } from "./animations";
import { api, ProductItem, PlanItem, productLogoUrl } from "@/lib/goat-api";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTilt } from "@/animations/useTilt";
import { cn } from "@/lib/utils";
import { MriButton } from "@/components/ui/MriButton";

const formatBRL = (amount: number) => `R$ ${amount.toFixed(2).replace(".", ",")}`;

type Copy = {
  heading: string;
  headingSub: string;
  allProducts: string;
  learnMore: string;
  loading: string;
  noProducts: string;
  startingAt: (price: string) => string;
  comingSoon: string;
  billingInterval: (count: number, unit: "year" | "month") => string;
  oneTimePayment: string;
  cadenceSuffix: (count: number, unit: "year" | "month") => string;
  subscribeNow: string;
  buyNow: string;
};

const pt: Copy = {
  heading: "Escolha o produto ideal pro seu servidor",
  headingSub: "Cada produto tem seus próprios planos de cobrança — escolha um pra ver as opções.",
  allProducts: "Todos os produtos",
  learnMore: "Saiba mais sobre esse produto",
  loading: "Carregando...",
  noProducts: "Nenhum produto disponível no momento.",
  startingAt: (price) => `A partir de ${price}`,
  comingSoon: "Em breve",
  billingInterval: (count, unit) =>
    `Assinatura a cada ${count} ${unit === "year" ? "ano(s)" : "mês(es)"}`,
  oneTimePayment: "Pagamento único",
  cadenceSuffix: (count, unit) => {
    if (count <= 1) return unit === "year" ? "/ano" : "/mês";
    return `/${count} ${unit === "year" ? "anos" : "meses"}`;
  },
  subscribeNow: "Assinar agora",
  buyNow: "Comprar agora",
};

const en: Copy = {
  heading: "Choose the right product for your server",
  headingSub: "Each product has its own billing plans — pick one to see the options.",
  allProducts: "All products",
  learnMore: "Learn more about this product",
  loading: "Loading...",
  noProducts: "No products available right now.",
  startingAt: (price) => `From ${price}`,
  comingSoon: "Coming soon",
  billingInterval: (count, unit) =>
    `Billed every ${count} ${
      unit === "year" ? (count === 1 ? "year" : "years") : count === 1 ? "month" : "months"
    }`,
  oneTimePayment: "One-time payment",
  cadenceSuffix: (count, unit) => {
    if (count <= 1) return unit === "year" ? "/year" : "/month";
    return `/${count} ${unit === "year" ? "years" : "months"}`;
  },
  subscribeNow: "Subscribe now",
  buyNow: "Buy now",
};

const billingLabel = (plan: PlanItem, t: Copy) =>
  plan.billingNote ||
  (plan.mode === "subscription"
    ? t.billingInterval(plan.intervalCount, (plan.intervalUnit as "year" | "month") ?? "month")
    : t.oneTimePayment);

const cadenceSuffix = (plan: PlanItem, t: Copy) => {
  if (plan.mode !== "subscription") return "";
  return t.cadenceSuffix(plan.intervalCount, (plan.intervalUnit as "year" | "month") ?? "month");
};

const swapTransition = { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const };

function ProductCard({
  product,
  disabled,
  priceLabel,
  onSelect,
}: {
  product: ProductItem;
  disabled: boolean;
  priceLabel: string;
  onSelect: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  useTilt(ref, 3.5);

  return (
    <button
      ref={ref}
      onClick={onSelect}
      disabled={disabled}
      className="spotlight neon-border flex aspect-square w-full flex-col items-center justify-center gap-2.5 rounded-2xl border border-hairline bg-surface-2/40 p-5 text-center transition-colors duration-300 hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-surface-2/40"
    >
      <img
        src={productLogoUrl(product)}
        alt={product.name}
        className="h-11 w-11 rounded-xl border border-hairline object-cover"
      />
      <h3 className="text-[14.5px] font-semibold tracking-tight">{product.name}</h3>
      <p className="line-clamp-2 text-[11.5px] leading-[1.45] text-muted-foreground">
        {product.description}
      </p>
      <span className="mt-1 text-[11.5px] font-medium text-foreground">{priceLabel}</span>
    </button>
  );
}

function PlanCard({ plan, idx, t }: { plan: PlanItem; idx: number; t: Copy }) {
  const ref = useRef<HTMLDivElement>(null);
  useTilt(ref, 3.5);
  const Icon = plan.mode === "subscription" ? Repeat : InfinityIcon;
  const suffix = cadenceSuffix(plan, t);

  return (
    <FadeUp delay={idx * 0.1} className="h-full">
      <div className={cn("h-full", plan.badge && "md:-translate-y-3")}>
        <div
          ref={ref}
          className={cn(
            "spotlight relative flex h-full flex-col rounded-2xl p-8 transition-colors duration-300",
            plan.badge
              ? "neon-border border border-gold/25 bg-surface shadow-[0_0_90px_-24px_oklch(0.94_0.012_240/0.45)]"
              : "border border-hairline bg-surface-2/40 hover:border-foreground/20",
          )}
        >
          {plan.badge && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 font-mono text-[10px] font-semibold tracking-[0.12em] whitespace-nowrap text-primary-foreground uppercase">
              {plan.badge}
            </span>
          )}

          <span
            className={cn(
              "grid h-10 w-10 place-items-center rounded-xl border",
              plan.badge ? "border-gold/30 bg-gold/10" : "border-hairline bg-background/40",
            )}
          >
            <Icon
              className={cn("h-4 w-4", plan.badge ? "text-gold" : "text-muted-foreground")}
              strokeWidth={1.75}
            />
          </span>

          <h3 className="mt-5 text-[19px] font-semibold tracking-tight">{plan.name}</h3>
          <p className="mt-2.5 text-[13px] leading-[1.55] text-muted-foreground">
            {plan.description}
          </p>

          <div className="mt-7 flex items-end gap-1.5">
            <span className="text-[38px] leading-none font-semibold tracking-tight">
              {formatBRL(plan.amount)}
            </span>
            {suffix && <span className="mb-1 text-[12.5px] text-muted-foreground">{suffix}</span>}
          </div>
          <p className="mt-1.5 text-[11px] leading-[1.5] text-muted-foreground">
            {billingLabel(plan, t)}
          </p>

          <MriButton
            asChild
            variant={plan.badge ? "solid" : "outline"}
            className={cn(
              "mt-7 rounded-lg px-4 py-3 text-[13px] transition-transform hover:scale-[1.02] hover:opacity-90 hover:brightness-100",
              !plan.badge && "border-hairline bg-surface-2 text-foreground hover:bg-surface-2 hover:text-foreground",
            )}
          >
            <a href={`/checkout?plan=${plan.code}`}>
              {plan.mode === "subscription" ? t.subscribeNow : t.buyNow}{" "}
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </MriButton>

          {plan.features.length > 0 && (
            <ul className="mt-7 space-y-3 border-t border-hairline pt-6">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 text-[12.5px] text-muted-foreground"
                >
                  <span className="mt-[1px] grid h-4 w-4 shrink-0 place-items-center rounded-full bg-gold/15">
                    <Check className="h-2.5 w-2.5 text-gold" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </FadeUp>
  );
}

// Cada produto (anticheat, resources futuros, etc) tem seus próprios planos
// de cobrança - por isso essa seção agora é um seletor em dois passos
// (escolhe o produto, depois escolhe o plano) em vez de uma lista fixa de
// 3 planos de um produto só.
export function Pricing() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
      setLoading(false);
    })();
  }, []);

  const selectedProduct = products.find((p) => p.slug === selectedSlug) || null;

  return (
    <section className="border-b border-hairline">
      <div className="rails mx-auto w-full max-w-[1200px]">
        <FadeUp className="px-5 py-16 text-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selectedProduct ? selectedProduct.slug : "all"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={swapTransition}
            >
              <h2 className="mx-auto max-w-[560px] text-[30px] leading-[1.1] font-semibold tracking-[-0.02em] text-balance sm:text-[36px]">
                {selectedProduct ? selectedProduct.name : t.heading}
              </h2>
              <p className="mx-auto mt-4 max-w-[480px] text-[13.5px] leading-[1.6] text-muted-foreground">
                {selectedProduct ? selectedProduct.description : t.headingSub}
              </p>
            </motion.div>
          </AnimatePresence>
          {selectedProduct && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <MriButton
                variant="outline"
                size="sm"
                onClick={() => setSelectedSlug(null)}
                className="rounded-lg border-hairline bg-surface-2 hover:bg-surface-2 hover:text-foreground"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> {t.allProducts}
              </MriButton>
              {selectedProduct.slug === "goat-anticheat" && (
                <a
                  href="/produtos/goat-anticheat"
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium text-gold transition-colors hover:text-foreground"
                >
                  {t.learnMore} <ArrowRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          )}
        </FadeUp>

        <motion.div layout transition={{ layout: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}>
          <AnimatePresence mode="wait" initial={false}>
            {loading ? (
              <motion.p
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={swapTransition}
                className="border-t border-hairline py-16 text-center text-[13px] text-muted-foreground"
              >
                {t.loading}
              </motion.p>
            ) : products.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={swapTransition}
                className="border-t border-hairline py-16 text-center text-[13px] text-muted-foreground"
              >
                {t.noProducts}
              </motion.p>
            ) : !selectedProduct ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={swapTransition}
                className="border-t border-hairline px-5 pt-10 pb-14"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {products.map((product) => {
                    const activePlans = (product.plans || []).filter((pl) => pl.active !== false);
                    const cheapest = activePlans.reduce<number | null>(
                      (min, pl) => (min === null || pl.amount < min ? pl.amount : min),
                      null,
                    );
                    return (
                      <ProductCard
                        key={product.slug}
                        product={product}
                        disabled={activePlans.length === 0}
                        priceLabel={
                          activePlans.length > 0 ? t.startingAt(formatBRL(cheapest!)) : t.comingSoon
                        }
                        onSelect={() => setSelectedSlug(product.slug)}
                      />
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={selectedProduct.slug}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={swapTransition}
                className="border-t border-hairline px-5 py-14"
              >
                <div className="mx-auto grid max-w-[1020px] gap-5 md:grid-cols-3 md:items-stretch">
                  {(selectedProduct.plans || [])
                    .filter((pl) => pl.active !== false)
                    .map((p, idx) => (
                      <PlanCard key={p.code} plan={p} idx={idx} t={t} />
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
