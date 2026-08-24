import { useEffect } from "react";
import { Nav } from "@/components/goatlanding/Nav";
import { Footer } from "@/components/goatlanding/Sections";
import { FadeUp } from "@/components/goatlanding/animations";
import { LegalSection as Section } from "@/components/goatlanding/LegalSection";
import { useLanguage } from "@/i18n/LanguageContext";

type Copy = {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  s1: { title: string; body: string };
  s2: { title: string; body: string };
  s3: { title: string; body: string };
  s4: { title: string; body: string };
  s5: { title: string; body: string };
  s6: { title: string; intro: string; items: string[] };
  s7: { title: string; body: string };
  s8: { title: string; body: string };
  s9: { title: string; body: string };
  s10: { title: string; body: string };
  s11: { title: string; body: string };
};

const pt: Copy = {
  eyebrow: "Legal",
  title: "Termos de Uso",
  lastUpdated: "Última atualização: 20 de agosto de 2026.",
  s1: {
    title: "1. Quem somos",
    body: 'A Goat Network ("nós", "nossa") desenvolve e vende recursos digitais (resources) para servidores FiveM, incluindo o produto GOAT Anticheat e outros produtos que venham a ser adicionados ao catálogo. Estes Termos de Uso regem o acesso e uso do nosso site, painel de cliente e produtos.',
  },
  s2: {
    title: "2. Conta e acesso",
    body: "O acesso à conta é feito via login com Discord (OAuth). Você é responsável por manter sua conta Discord em segurança e por toda atividade realizada na sua conta na Goat Network. Cada licença gerada é vinculada exclusivamente à conta que efetuou a compra.",
  },
  s3: {
    title: "3. Compras e pagamento",
    body: "Todos os pagamentos são processados pela Stripe. A Goat Network não tem acesso e não armazena dados do seu cartão de crédito. Os preços são exibidos em Reais (BRL) na página de Produtos antes da confirmação da compra. Planos recorrentes (assinaturas) são cobrados automaticamente no ciclo indicado (mensal, trimestral, etc.) até serem cancelados; planos de pagamento único não geram cobranças futuras.",
  },
  s4: {
    title: "4. Licenças",
    body: "Cada compra gera uma licença única, pessoal e intransferível, válida para uso em um servidor por vez. É proibido revender, compartilhar, sublicenciar ou distribuir sua licença ou qualquer arquivo obtido através dela. O uso da licença fora dos limites contratados (ex: em múltiplos servidores sem plano compatível) pode resultar em suspensão.",
  },
  s5: {
    title: "5. Cancelamento e reembolso",
    body: "Assinaturas recorrentes podem ser canceladas a qualquer momento; o acesso permanece ativo até o fim do período já pago, sem cobranças futuras. Conforme o Art. 49 do Código de Defesa do Consumidor, você tem até 7 (sete) dias corridos após a compra para solicitar reembolso integral, desde que a licença ainda não tenha sido ativada/utilizada em um servidor. Após a ativação, o reembolso fica sujeito a análise caso a caso — entre em contato pelo Discord.",
  },
  s6: {
    title: "6. Uso proibido",
    intro: "Além do item 4, é proibido:",
    items: [
      "Tentar contornar, desativar ou manipular qualquer produto de proteção que você tenha adquirido;",
      "Utilizar engenharia reversa, descompilar ou modificar os arquivos entregues;",
      "Usar os produtos para fins ilegais ou para prejudicar terceiros;",
      "Realizar chargeback de uma cobrança legítima sem antes buscar suporte.",
    ],
  },
  s7: {
    title: "7. Suspensão e revogação",
    body: "Podemos suspender ou revogar uma licença em caso de não-pagamento, chargeback, violação destes Termos, ou uso indevido identificado pelos nossos sistemas. Sempre que possível, avisaremos pelo Discord antes de uma revogação definitiva.",
  },
  s8: {
    title: "8. Garantias e responsabilidade",
    body: 'Os produtos são fornecidos "como estão". Nos esforçamos para manter alta disponibilidade e qualidade, mas não garantimos operação livre de interrupções. Na extensão permitida por lei, a Goat Network não se responsabiliza por danos indiretos decorrentes do uso ou indisponibilidade dos produtos.',
  },
  s9: {
    title: "9. Alterações",
    body: "Podemos atualizar estes Termos periodicamente. Mudanças relevantes serão comunicadas pelo Discord. O uso continuado dos produtos após uma atualização representa aceitação dos novos termos.",
  },
  s10: {
    title: "10. Contato",
    body: "Dúvidas sobre estes Termos podem ser enviadas pelo nosso Discord.",
  },
  s11: {
    title: "11. Idioma prevalecente",
    body: "Estes Termos foram redigidos originalmente em português. Em caso de conflito entre esta versão e a versão em português, a versão em português prevalece.",
  },
};

const en: Copy = {
  eyebrow: "Legal",
  title: "Terms of Use",
  lastUpdated: "Last updated: August 20, 2026.",
  s1: {
    title: "1. Who we are",
    body: 'Goat Network ("we", "our") develops and sells digital resources for FiveM servers, including the GOAT Anticheat product and any other products that may be added to the catalog in the future. These Terms of Use govern access to and use of our website, customer dashboard, and products.',
  },
  s2: {
    title: "2. Account and access",
    body: "Account access is provided via Discord login (OAuth). You are responsible for keeping your Discord account secure and for all activity carried out under your Goat Network account. Each license generated is tied exclusively to the account that made the purchase.",
  },
  s3: {
    title: "3. Purchases and payment",
    body: "All payments are processed by Stripe. Goat Network does not have access to, and does not store, your credit card data. Prices are displayed in Brazilian Reais (BRL) on the Products page before your purchase is confirmed. Recurring plans (subscriptions) are billed automatically on the indicated cycle (monthly, quarterly, etc.) until canceled; one-time payment plans do not generate future charges.",
  },
  s4: {
    title: "4. Licenses",
    body: "Each purchase generates a unique, personal, non-transferable license, valid for use on one server at a time. Reselling, sharing, sublicensing, or distributing your license or any file obtained through it is prohibited. Using the license outside the contracted limits (e.g., on multiple servers without a compatible plan) may result in suspension.",
  },
  s5: {
    title: "5. Cancellation and refunds",
    body: "Recurring subscriptions may be canceled at any time; access remains active until the end of the period already paid for, with no future charges. Under Art. 49 of the Consumer Protection Code (Código de Defesa do Consumidor — CDC), you have up to 7 (seven) calendar days after the purchase to request a full refund, provided the license has not yet been activated/used on a server. After activation, refunds are subject to case-by-case review — please contact us via Discord.",
  },
  s6: {
    title: "6. Prohibited use",
    intro: "In addition to item 4, it is prohibited to:",
    items: [
      "Attempt to bypass, disable, or tamper with any protection product you have purchased;",
      "Reverse engineer, decompile, or modify the delivered files;",
      "Use the products for illegal purposes or to harm third parties;",
      "File a chargeback for a legitimate charge without first seeking support.",
    ],
  },
  s7: {
    title: "7. Suspension and revocation",
    body: "We may suspend or revoke a license in the event of non-payment, chargeback, violation of these Terms, or misuse identified by our systems. Whenever possible, we will notify you via Discord before a final revocation.",
  },
  s8: {
    title: "8. Warranties and liability",
    body: 'The products are provided "as is". We strive to maintain high availability and quality, but we do not guarantee uninterrupted operation. To the extent permitted by law, Goat Network is not liable for indirect damages arising from the use or unavailability of the products.',
  },
  s9: {
    title: "9. Changes",
    body: "We may update these Terms periodically. Material changes will be communicated via Discord. Continued use of the products after an update constitutes acceptance of the new terms.",
  },
  s10: {
    title: "10. Contact",
    body: "Questions about these Terms may be sent through our Discord.",
  },
  s11: {
    title: "11. Governing language",
    body: "These Terms were originally drafted in Portuguese. In case of any conflict between this version and the Portuguese version, the Portuguese version shall prevail.",
  },
};

export default function TermsPage() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;

  useEffect(() => {
    document.title = lang === "pt" ? "Termos de Uso — Goat Network" : "Terms of Use — Goat Network";
  }, [lang]);

  return (
    <main className="relative min-h-screen bg-background font-sans text-foreground">
      <Nav />
      <section className="border-b border-hairline pt-32 pb-16">
        <div className="mx-auto w-full max-w-[760px] px-5">
          <FadeUp>
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" /> {t.eyebrow}
            </span>
            <h1 className="mt-4 text-[34px] leading-[1.1] font-semibold tracking-[-0.03em] text-balance sm:text-[42px]">
              {t.title}
            </h1>
            <p className="mt-4 text-[13px] text-muted-foreground">{t.lastUpdated}</p>
          </FadeUp>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto w-full max-w-[760px] space-y-10 px-5 pt-14 text-[14px] leading-[1.75] text-muted-foreground">
          <Section title={t.s1.title}>
            <p>{t.s1.body}</p>
          </Section>

          <Section title={t.s2.title}>
            <p>{t.s2.body}</p>
          </Section>

          <Section title={t.s3.title}>
            <p>{t.s3.body}</p>
          </Section>

          <Section title={t.s4.title}>
            <p>{t.s4.body}</p>
          </Section>

          <Section title={t.s5.title}>
            <p>{t.s5.body}</p>
          </Section>

          <Section title={t.s6.title}>
            <p>{t.s6.intro}</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              {t.s6.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title={t.s7.title}>
            <p>{t.s7.body}</p>
          </Section>

          <Section title={t.s8.title}>
            <p>{t.s8.body}</p>
          </Section>

          <Section title={t.s9.title}>
            <p>{t.s9.body}</p>
          </Section>

          <Section title={t.s10.title}>
            <p>{t.s10.body}</p>
          </Section>

          <Section title={t.s11.title}>
            <p>{t.s11.body}</p>
          </Section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
