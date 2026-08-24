import { useEffect } from "react";
import { Nav } from "@/components/goatlanding/Nav";
import { Pricing } from "@/components/goatlanding/Pricing";
import { FAQ, Footer } from "@/components/goatlanding/Sections";
import { useLanguage } from "@/i18n/LanguageContext";

type Copy = {
  title: string;
};

const pt: Copy = {
  title: "Produtos — Goat Network",
};

const en: Copy = {
  title: "Products — Goat Network",
};

export default function ProductsPage() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;

  useEffect(() => {
    document.title = t.title;
  }, [lang]);

  return (
    <main className="relative min-h-screen bg-background font-sans text-foreground">
      <Nav />
      <div className="pt-24 pb-12">
        <Pricing />
      </div>
      <FAQ />
      <Footer />
    </main>
  );
}
