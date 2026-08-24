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
  s1: { title: string; items: { label: string; body: string }[] };
  s2: { title: string; items: string[] };
  s3: { title: string; intro: string; items: { label: string; body: string }[] };
  s4: { title: string; body: string };
  s5: { title: string; body: string };
  s6: { title: string; intro: string; items: string[]; outro: string };
  s7: { title: string; body: string };
  s8: { title: string; body: string };
  s9: { title: string; body: string };
  s10: { title: string; body: string };
};

const pt: Copy = {
  eyebrow: "Legal",
  title: "Política de Privacidade",
  lastUpdated: "Última atualização: 20 de agosto de 2026.",
  s1: {
    title: "1. Quais dados coletamos",
    items: [
      {
        label: "Conta:",
        body: "o login é feito exclusivamente via Discord (OAuth). Recebemos seu ID, nome de usuário, avatar e e-mail associado à sua conta do Discord.",
      },
      {
        label: "Pagamento:",
        body: "processado inteiramente pela Stripe. Recebemos apenas a confirmação do pagamento e um identificador de cliente — nunca o número do cartão.",
      },
      {
        label: "Dados de servidor:",
        body: "nome, código CFX, IP e logo do servidor que você registra ao ativar uma licença.",
      },
      {
        label: "Uso do produto:",
        body: "dados operacionais enviados pelos nossos resources (ex: detecções, banimentos, heartbeat de status) quando aplicável ao produto.",
      },
    ],
  },
  s2: {
    title: "2. Para que usamos esses dados",
    items: [
      "Autenticar sua conta e vincular suas licenças/compras a ela;",
      "Processar pagamentos e emitir confirmações;",
      "Validar licenças e liberar acesso aos produtos comprados;",
      "Dar suporte técnico e responder solicitações;",
      "Enviar notificações operacionais relevantes (ex: falha de pagamento, licença expirando).",
    ],
  },
  s3: {
    title: "3. Com quem compartilhamos",
    intro: "Não vendemos seus dados. Usamos os seguintes prestadores de serviço (sub-processadores) para operar o negócio:",
    items: [
      { label: "Stripe", body: "— processamento de pagamentos;" },
      { label: "Discord", body: "— autenticação (OAuth) e notificações." },
    ],
  },
  s4: {
    title: "4. Armazenamento local (localStorage)",
    body: "O site guarda seu token de sessão no armazenamento local do navegador pra manter você conectado. Ele é usado só nesse navegador/dispositivo e é removido ao sair da conta.",
  },
  s5: {
    title: "5. Retenção",
    body: "Mantemos os dados enquanto sua conta estiver ativa e pelo tempo necessário para cumprir obrigações legais e fiscais relacionadas a pagamentos. Dados de servidor associados a licenças revogadas podem ser mantidos por um período pra fins de suporte e histórico.",
  },
  s6: {
    title: "6. Seus direitos (LGPD)",
    intro: "Conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018), você pode solicitar a qualquer momento:",
    items: [
      "Confirmação e acesso aos dados que temos sobre você;",
      "Correção de dados incompletos ou desatualizados;",
      "Exclusão dos seus dados, ressalvadas obrigações legais de retenção (ex: fiscais);",
      "Informação sobre com quem seus dados são compartilhados.",
    ],
    outro: "Solicitações podem ser feitas pelo nosso Discord.",
  },
  s7: {
    title: "7. Segurança",
    body: "Adotamos medidas técnicas razoáveis para proteger seus dados (conexões criptografadas, controle de acesso, nunca armazenamento de dados de cartão). Nenhum sistema é 100% livre de risco — se identificarmos um incidente relevante, avisaremos os usuários afetados.",
  },
  s8: {
    title: "8. Alterações",
    body: "Esta política pode ser atualizada periodicamente. Mudanças relevantes serão comunicadas pelo Discord.",
  },
  s9: {
    title: "9. Contato",
    body: "Dúvidas sobre privacidade ou solicitações relacionadas aos seus dados podem ser enviadas pelo nosso Discord.",
  },
  s10: {
    title: "10. Idioma prevalecente",
    body: "Esta política foi redigida originalmente em português. Em caso de conflito entre esta versão e a versão em português, a versão em português prevalece.",
  },
};

const en: Copy = {
  eyebrow: "Legal",
  title: "Privacy Policy",
  lastUpdated: "Last updated: August 20, 2026.",
  s1: {
    title: "1. What data we collect",
    items: [
      {
        label: "Account:",
        body: "login is done exclusively via Discord (OAuth). We receive your ID, username, avatar, and the email address associated with your Discord account.",
      },
      {
        label: "Payment:",
        body: "processed entirely by Stripe. We only receive payment confirmation and a customer identifier — never your card number.",
      },
      {
        label: "Server data:",
        body: "the name, CFX code, IP address, and logo of the server you register when activating a license.",
      },
      {
        label: "Product usage:",
        body: "operational data sent by our resources (e.g., detections, bans, status heartbeat) when applicable to the product.",
      },
    ],
  },
  s2: {
    title: "2. What we use this data for",
    items: [
      "Authenticate your account and link your licenses/purchases to it;",
      "Process payments and issue confirmations;",
      "Validate licenses and grant access to purchased products;",
      "Provide technical support and respond to requests;",
      "Send relevant operational notifications (e.g., payment failure, license expiring).",
    ],
  },
  s3: {
    title: "3. Who we share data with",
    intro: "We do not sell your data. We use the following service providers (sub-processors) to operate the business:",
    items: [
      { label: "Stripe", body: "— payment processing;" },
      { label: "Discord", body: "— authentication (OAuth) and notifications." },
    ],
  },
  s4: {
    title: "4. Local storage (localStorage)",
    body: "The site stores your session token in the browser's local storage to keep you logged in. It is used only on that browser/device and is removed when you log out.",
  },
  s5: {
    title: "5. Retention",
    body: "We retain data for as long as your account is active and for as long as necessary to comply with legal and tax obligations related to payments. Server data associated with revoked licenses may be retained for a period for support and record-keeping purposes.",
  },
  s6: {
    title: "6. Your rights (LGPD)",
    intro: "Under Brazil's General Data Protection Law (Lei Geral de Proteção de Dados — LGPD, Law No. 13,709/2018), you may request at any time:",
    items: [
      "Confirmation and access to the data we hold about you;",
      "Correction of incomplete or outdated data;",
      "Deletion of your data, subject to legal retention obligations (e.g., tax-related);",
      "Information about who your data is shared with.",
    ],
    outro: "Requests can be made through our Discord.",
  },
  s7: {
    title: "7. Security",
    body: "We adopt reasonable technical measures to protect your data (encrypted connections, access control, never storing card data). No system is 100% risk-free — if we identify a significant incident, we will notify affected users.",
  },
  s8: {
    title: "8. Changes",
    body: "This policy may be updated periodically. Material changes will be communicated via Discord.",
  },
  s9: {
    title: "9. Contact",
    body: "Questions about privacy or requests related to your data may be sent through our Discord.",
  },
  s10: {
    title: "10. Governing language",
    body: "This policy was originally drafted in Portuguese. In case of any conflict between this version and the Portuguese version, the Portuguese version shall prevail.",
  },
};

export default function PrivacyPage() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;

  useEffect(() => {
    document.title = lang === "pt" ? "Política de Privacidade — Goat Network" : "Privacy Policy — Goat Network";
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
            <ul className="list-disc space-y-2 pl-5">
              {t.s1.items.map((item) => (
                <li key={item.label}>
                  <strong className="text-foreground/90">{item.label}</strong> {item.body}
                </li>
              ))}
            </ul>
          </Section>

          <Section title={t.s2.title}>
            <ul className="list-disc space-y-2 pl-5">
              {t.s2.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title={t.s3.title}>
            <p>{t.s3.intro}</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              {t.s3.items.map((item) => (
                <li key={item.label}>
                  <strong className="text-foreground/90">{item.label}</strong> {item.body}
                </li>
              ))}
            </ul>
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
            <p className="mt-3">{t.s6.outro}</p>
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
        </div>
      </section>

      <Footer />
    </main>
  );
}
