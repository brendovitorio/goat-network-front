import { useEffect, useState } from "react";
import { Nav } from "@/components/goatlanding/Nav";
import { Footer } from "@/components/goatlanding/Sections";
import { useLanguage } from "@/i18n/LanguageContext";
import { api, type ChangelogEntry } from "@/lib/goat-api";

type Copy = {
  tabTitle: string;
  eyebrow: string;
  heroTitle: string;
  heroBody: string;
  loading: string;
  empty: string;
};

const pt: Copy = {
  tabTitle: "Changelog — Goat Network",
  eyebrow: "Changelog",
  heroTitle: "O que muda na Goat Network, quando muda.",
  heroBody:
    "Puxado direto do canal de atualizações do nosso Discord — sem histórico inventado.",
  loading: "Carregando atualizações...",
  empty: "Nenhuma atualização publicada ainda.",
};

const en: Copy = {
  tabTitle: "Changelog — Goat Network",
  eyebrow: "Changelog",
  heroTitle: "What changes at Goat Network, when it changes.",
  heroBody: "Pulled straight from our Discord updates channel — no invented history.",
  loading: "Loading updates...",
  empty: "No updates published yet.",
};

export default function Changelog() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = t.tabTitle;
  }, [lang, t.tabTitle]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.getChangelog().then((data) => {
      if (!cancelled) {
        setEntries(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === "pt" ? "pt-BR" : "en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <main className="relative min-h-screen bg-background font-sans text-foreground">
      <Nav />
      <section className="border-b border-hairline pt-32 pb-16">
        <div className="mx-auto w-full max-w-[720px] px-5">
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" /> {t.eyebrow}
          </span>
          <h1 className="mt-4 text-[38px] leading-[1.08] font-semibold tracking-[-0.03em] text-balance sm:text-[46px]">
            {t.heroTitle}
          </h1>
          <p className="mt-4 max-w-[520px] text-[14.5px] leading-[1.6] text-muted-foreground">
            {t.heroBody}
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-10 px-5 pt-16">
          {loading ? (
            <p className="text-[13.5px] text-muted-foreground">{t.loading}</p>
          ) : entries.length === 0 ? (
            <p className="text-[13.5px] text-muted-foreground">{t.empty}</p>
          ) : (
            entries.map((e) => (
              <div key={e.id} className="flex gap-6 border-b border-hairline pb-10 last:border-b-0">
                <div className="w-[110px] shrink-0 pt-1 font-mono text-[11px] tracking-wide text-muted-foreground">
                  {formatDate(e.timestamp)}
                </div>
                <div className="min-w-0 flex-1">
                  {e.author && (
                    <div className="mb-2 flex items-center gap-2">
                      {e.avatarUrl && (
                        <img
                          src={e.avatarUrl}
                          alt=""
                          className="h-5 w-5 rounded-full"
                        />
                      )}
                      <span className="font-mono text-[10.5px] text-muted-foreground uppercase tracking-wide">
                        {e.author}
                      </span>
                    </div>
                  )}
                  <p className="whitespace-pre-line text-[13.5px] leading-[1.6] text-foreground/80">
                    {e.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
