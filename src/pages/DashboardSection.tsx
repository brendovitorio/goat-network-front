import { useParams } from "react-router-dom";
import { SECTION_COMPONENTS } from "@/components/dashboard/sections";
import { useLanguage } from "@/i18n/LanguageContext";
import { MriCard } from "@/components/ui/MriCard";

const pt = {
  title: "Área não encontrada",
  body: "Essa seção do painel não existe ou ainda não foi liberada para o seu plano.",
};

const en: typeof pt = {
  title: "Section not found",
  body: "This dashboard section doesn't exist or hasn't been unlocked for your plan yet.",
};

export default function DashboardSection() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  const { section } = useParams<{ section: string }>();

  if (!section) return null;

  const Component = SECTION_COMPONENTS[section];

  if (!Component) {
    return (
      <MriCard className="rounded-2xl bg-card/30 p-10 text-center">
        <p className="text-[15px] font-semibold tracking-tight">{t.title}</p>
        <p className="mt-2 text-[13px] text-muted-foreground">{t.body}</p>
      </MriCard>
    );
  }
  return <Component />;
}
