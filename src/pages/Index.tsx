import { useEffect } from "react";
import { Nav } from "@/components/goatlanding/Nav";
import { Hero } from "@/components/goatlanding/Hero";
import { Services } from "@/components/goatlanding/Services";
import { LiveDemo } from "@/components/goatlanding/LiveDemo";
import { Features } from "@/components/goatlanding/Features";
import { HowItWorks } from "@/components/goatlanding/HowItWorks";
import { Pricing } from "@/components/goatlanding/Pricing";
import { FAQ, CTA, Footer } from "@/components/goatlanding/Sections";
import { useLanguage } from "@/i18n/LanguageContext";

type Copy = {
  title: string;
};

const pt: Copy = {
  title: "Goat Network — Sistemas, apps e o Anticheat que sua cidade confia",
};

const en: Copy = {
  title: "Goat Network — Systems, apps and the Anticheat your city trusts",
};

export default function Index() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;

  useEffect(() => {
    document.title = t.title;
  }, [lang]);

  return (
    <main className="relative min-h-screen bg-background font-sans text-foreground">
      <Nav />
      <Hero />
      <Services />
      <LiveDemo />
      <Pricing />
      <Features />
      <HowItWorks />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
