import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Crown,
  Plus,
  RefreshCw,
  Trash2,
  Power,
  Save,
  AlertCircle,
  CheckCircle2,
  Package,
  Gift,
  Ticket,
  Copy,
  Upload,
  Pencil,
  KeyRound,
  Search,
  ShieldAlert,
  Users,
  Briefcase,
  Send,
  Mail,
  Archive,
} from "lucide-react";
import { Nav } from "@/components/goatlanding/Nav";
import { MriTabs } from "@/components/ui/MriTabs";
import {
  api,
  PlanItem,
  ProductItem,
  UserProfile,
  CouponItem,
  AdminLicenseSearchResult,
  SystemOrderItem,
  SourcePackageItem,
  productLogoUrl,
} from "@/lib/goat-api";
import { useLanguage } from "@/i18n/LanguageContext";
import { formatDate } from "@/lib/format";
import { MriCard } from "@/components/ui/MriCard";
import { MriButton } from "@/components/ui/MriButton";
import { MriInput } from "@/components/ui/MriInput";

type Copy = {
  tabTitle: string;
  checkingAccess: string;
  pageTitle: string;
  pageSubtitle: string;
  tabs: {
    catalog: string;
    clients: string;
    coupons: string;
    orders: string;
  };
  newProduct: {
    heading: string;
    description: string;
    nameLabel: string;
    namePlaceholder: string;
    typeLabel: string;
    typeAnticheat: string;
    typeDownload: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    logoLabel: string;
    logoHint: string;
    protectionKeyLabel: string;
    protectionKeyHint: string;
    protectionKeyNone: string;
    submitIdle: string;
    submitBusy: string;
  };
  newPlan: {
    heading: string;
    productLabel: string;
    productEmptyOption: string;
    nameLabel: string;
    namePlaceholder: string;
    amountLabel: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    billingNoteLabel: string;
    billingNotePlaceholder: string;
    billingTypeLabel: string;
    billingTypeSubscription: string;
    billingTypePayment: string;
    intervalLabel: string;
    intervalMonth: string;
    intervalYear: string;
    intervalCountLabel: string;
    badgeLabel: string;
    badgePlaceholder: string;
    sortOrderLabel: string;
    featuresLabel: string;
    featuresPlaceholder: string;
    fileLabel: string;
    fileHint: string;
    submitIdle: string;
    submitBusy: string;
  };
  sourcePackages: {
    heading: string;
    description: string;
    productLabel: string;
    fileLabel: string;
    fileHint: string;
    submitIdle: string;
    submitBusy: string;
    listHeading: string;
    empty: string;
    colProduct: string;
    colFile: string;
    colUploadedAt: string;
    colUploadedBy: string;
  };
  grants: {
    heading: string;
    description: string;
    discordIdLabel: string;
    discordIdPlaceholder: string;
    planLabel: string;
    planEmptyOption: string;
    serverNameLabel: string;
    serverNamePlaceholder: string;
    submitIdle: string;
    submitBusy: string;
    resultHint: string;
    copyButton: string;
  };
  coupons: {
    heading: string;
    description: string;
    codeLabel: string;
    codePlaceholder: string;
    restrictPlanLabel: string;
    anyPlan: string;
    discountTypeLabel: string;
    discountTypePercent: string;
    discountTypeAmount: string;
    percentLabel: string;
    amountLabel: string;
    durationLabel: string;
    durationOnce: string;
    durationRepeating: string;
    durationForever: string;
    durationMonthsLabel: string;
    maxRedemptionsLabel: string;
    maxRedemptionsPlaceholder: string;
    expiresAtLabel: string;
    submitIdle: string;
    submitBusy: string;
    listHeading: string;
    disabledTag: string;
    percentOffSuffix: (n: number) => string;
    amountOffSuffix: (v: string) => string;
    durationOnceShort: string;
    durationForeverShort: string;
    durationMonthsShort: (n: number) => string;
    maxUsesSuffix: (n: number) => string;
    expiresSuffix: (date: string) => string;
    deactivate: string;
  };
  licenses: {
    heading: string;
    description: string;
    discordIdLabel: string;
    discordIdPlaceholder: string;
    licenseKeyLabel: string;
    licenseKeyPlaceholder: string;
    searchIdle: string;
    searchBusy: string;
    noResults: string;
    licensesHeading: string;
    statusLabel: string;
    planLabel: string;
    expiresLabel: string;
    setActive: string;
    setSuspended: string;
    setRevoked: string;
    serversHeading: string;
    serverIpLabel: string;
    authStatusLabel: string;
    authorizedIpsLabel: string;
    authorizedIpsPlaceholder: string;
    authorizedIpsHint: string;
    noAuthorizedIps: string;
    saveIps: string;
    savingIps: string;
    clearIps: string;
    deleteServer: string;
    deletingServer: string;
  };
  orders: {
    heading: string;
    description: string;
    empty: string;
    statusLabel: string;
    statuses: Record<SystemOrderItem["status"], string>;
    types: Record<SystemOrderItem["projectType"], string>;
    priceLabel: string;
    pricePlaceholder: string;
    savePrice: string;
    savingPrice: string;
    notesLabel: string;
    notesPlaceholder: string;
    saveNotes: string;
    messagesHeading: string;
    noMessages: string;
    fromClient: string;
    fromCeo: string;
    awaitingReply: string;
    replyLabel: string;
    replyPlaceholder: string;
    sendReply: string;
    sendingReply: string;
    sendingTo: (email: string) => string;
    noEmail: string;
  };
  catalog: {
    heading: string;
    refresh: string;
    noProducts: string;
    typeAnticheat: string;
    typeDownload: string;
    inactive: string;
    deactivateProduct: string;
    reactivateProduct: string;
    noPlans: string;
    archived: string;
    hasFile: string;
    billingInterval: (count: number, unit: "year" | "month") => string;
    oneTimePayment: string;
    priceIdLabel: (id: string) => string;
    newPricePlaceholder: string;
    updatePrice: string;
    deactivate: string;
    reactivate: string;
    closeEdit: string;
    editDetails: string;
    archive: string;
    currentFile: (name: string) => string;
    noFileYet: string;
    uploading: string;
    replaceFile: string;
    uploadFile: string;
    editNameLabel: string;
    editBillingNoteLabel: string;
    editDescriptionLabel: string;
    editBadgeLabel: string;
    editSortOrderLabel: string;
    editFeaturesLabel: string;
    saving: string;
    saveChanges: string;
  };
  messages: {
    loadDataError: string;
    fillProductName: string;
    logoTooBig: string;
    productCreated: string;
    createProductError: string;
    createPlanBeforeProduct: string;
    fillNameAndValidAmount: string;
    fileTooBig: string;
    planCreated: string;
    createPlanError: string;
    invalidPriceValue: string;
    priceUpdated: (code: string) => string;
    updatePriceError: string;
    updatePlanError: string;
    chooseFileFirst: string;
    fileUpdated: (code: string) => string;
    uploadFileError: string;
    planNameRequired: string;
    detailsUpdated: (code: string) => string;
    updateDetailsError: string;
    confirmArchive: (code: string) => string;
    planArchived: (code: string) => string;
    archivePlanError: string;
    updateProductError: string;
    discordIdRequired: string;
    selectPlan: string;
    grantError: string;
    couponCodeRequired: string;
    invalidPercent: string;
    invalidAmount: string;
    couponCreated: string;
    createCouponError: string;
    confirmDeactivateCoupon: (code: string) => string;
    deactivateCouponError: string;
    provideDiscordIdOrKey: string;
    searchLicenseError: string;
    ipsUpdated: string;
    updateIpsError: string;
    statusUpdated: (status: string) => string;
    updateStatusError: string;
    confirmStatusChange: (key: string, status: string) => string;
    confirmDeleteServer: (name: string) => string;
    serverDeleted: (name: string) => string;
    deleteServerError: string;
    loadOrdersError: string;
    orderUpdated: string;
    updateOrderError: string;
    replyMessageRequired: string;
    replySent: (email: string) => string;
    replyOrderError: string;
    selectProductFirstSp: string;
    chooseFileFirstSp: string;
    fileTooBigSp: string;
    packageUploaded: (product: string) => string;
    uploadPackageError: string;
  };
};

const pt: Copy = {
  tabTitle: "Área CEO — Goat Network",
  checkingAccess: "Verificando acesso...",
  pageTitle: "Área CEO",
  pageSubtitle: "Produtos e planos conectados direto com a Stripe.",
  tabs: {
    catalog: "Catálogo",
    clients: "Clientes",
    coupons: "Cupons",
    orders: "Encomendas",
  },
  newProduct: {
    heading: "Novo produto (resource)",
    description:
      "Cada resource vendido (anticheat, um resource novo, etc) é um produto — depois você cadastra os planos de cobrança dele (Monthly/Quarterly/Enterprise/o que quiser).",
    nameLabel: "Nome *",
    namePlaceholder: "Resource X",
    typeLabel: "Tipo",
    typeAnticheat: "Anticheat (gera licença + pede dados do servidor)",
    typeDownload: "Download (só libera o arquivo, sem pedir nada)",
    descriptionLabel: "Descrição",
    descriptionPlaceholder: "Descrição curta do produto",
    logoLabel: "Logo (opcional — PNG/JPG/WEBP/SVG, até 1MB)",
    logoHint: "Se não enviar, o produto usa a logo padrão da Goat Network (a mesma do favicon).",
    protectionKeyLabel: "Identificador de proteção (interno)",
    protectionKeyHint:
      "Não aparece no site nem pro cliente - só liga esse produto ao resource GOAT correspondente, pra proteção automática e entrega gerarem o build certo na compra.",
    protectionKeyNone: "Nenhum (produto sem proteção automática)",
    submitIdle: "Criar produto",
    submitBusy: "Criando...",
  },
  newPlan: {
    heading: "Novo plano",
    productLabel: "Produto *",
    productEmptyOption: "Crie um produto primeiro",
    nameLabel: "Nome do plano *",
    namePlaceholder: "Monthly",
    amountLabel: "Valor (R$) *",
    descriptionLabel: "Descrição",
    descriptionPlaceholder: "Descrição curta do plano",
    billingNoteLabel: "Nota de cobrança (exibida no checkout)",
    billingNotePlaceholder: "Cobrado a cada 6 meses.",
    billingTypeLabel: "Tipo de cobrança",
    billingTypeSubscription: "Assinatura recorrente",
    billingTypePayment: "Pagamento único",
    intervalLabel: "Intervalo",
    intervalMonth: "Mês(es)",
    intervalYear: "Ano(s)",
    intervalCountLabel: "A cada",
    badgeLabel: "Badge (opcional)",
    badgePlaceholder: "Recomendado",
    sortOrderLabel: "Ordem de exibição",
    featuresLabel: "Features (uma por linha)",
    featuresPlaceholder: "Até 1000 jogadores\nSuporte dedicado",
    fileLabel: "Arquivo do produto (.zip, até 5MB — opcional)",
    fileHint: 'Depois de comprado, esse arquivo aparece na aba "Downloads" do cliente.',
    submitIdle: "Criar plano",
    submitBusy: "Criando na Stripe...",
  },
  sourcePackages: {
    heading: "Fonte puro (proteção automática)",
    description:
      "Sobe o código-fonte ABERTO (sem proteção) de um resource GOAT. Um upload novo substitui o anterior do mesmo identificador - vendas já entregues não mudam retroativamente, só as próximas.",
    productLabel: "Resource *",
    fileLabel: "Arquivo do fonte (.zip, até 50MB)",
    fileHint: "Zipa a pasta do resource sem .git/node_modules/dist antes de subir.",
    submitIdle: "Subir fonte",
    submitBusy: "Enviando...",
    listHeading: "Fontes já cadastrados",
    empty: "Nenhum fonte cadastrado ainda.",
    colProduct: "Resource",
    colFile: "Arquivo",
    colUploadedAt: "Enviado em",
    colUploadedBy: "Enviado por",
  },
  grants: {
    heading: "Liberar de graça",
    description:
      "Dá acesso a um plano pra alguém sem passar pela Stripe — gera o pedido/licença igual a uma compra real, só que sem cobrança. O cliente precisa já ter feito login no site pelo menos uma vez.",
    discordIdLabel: "Discord ID do cliente *",
    discordIdPlaceholder: "123456789012345678",
    planLabel: "Plano *",
    planEmptyOption: "Nenhum plano cadastrado",
    serverNameLabel: "Nome do servidor (opcional — só usado se o plano pedir registro)",
    serverNamePlaceholder: "Meu Servidor FiveM",
    submitIdle: "Liberar de graça",
    submitBusy: "Liberando...",
    resultHint:
      "Manda esse link pro cliente. Se ele já tiver dados de servidor de outra compra, libera na hora sozinho — senão, pede pra preencher:",
    copyButton: "Copiar",
  },
  coupons: {
    heading: "Novo cupom",
    description:
      'O cliente digita o código na própria tela de pagamento da Stripe (link "Add promotion code"). Um cupom de 100% não pede cartão.',
    codeLabel: "Código *",
    codePlaceholder: "FREEMONTH",
    restrictPlanLabel: "Restringir a um plano (opcional)",
    anyPlan: "Qualquer plano",
    discountTypeLabel: "Tipo de desconto",
    discountTypePercent: "Percentual",
    discountTypeAmount: "Valor fixo (R$)",
    percentLabel: "Desconto (%) — 100 = grátis",
    amountLabel: "Desconto (R$)",
    durationLabel: "Duração",
    durationOnce: "Só na primeira cobrança",
    durationRepeating: "Por N meses",
    durationForever: "Pra sempre",
    durationMonthsLabel: "Por quantos meses",
    maxRedemptionsLabel: "Limite de usos (opcional)",
    maxRedemptionsPlaceholder: "Ilimitado",
    expiresAtLabel: "Expira em (opcional)",
    submitIdle: "Criar cupom",
    submitBusy: "Criando na Stripe...",
    listHeading: "Cupons",
    disabledTag: "Desativado",
    percentOffSuffix: (n) => `${n}% off`,
    amountOffSuffix: (v) => `R$ ${v} off`,
    durationOnceShort: "1ª cobrança",
    durationForeverShort: "pra sempre",
    durationMonthsShort: (n) => `${n} mês(es)`,
    maxUsesSuffix: (n) => ` · até ${n} uso(s)`,
    expiresSuffix: (date) => ` · expira ${date}`,
    deactivate: "Desativar",
  },
  licenses: {
    heading: "Gerenciamento de licenças",
    description:
      "Busca por Discord ID ou chave de licença pra ver as licenças e servidores de um cliente — útil pra desbloquear IP depois de troca de VPS, suspender licença por abuso ou reativar.",
    discordIdLabel: "Discord ID do cliente",
    discordIdPlaceholder: "123456789012345678",
    licenseKeyLabel: "ou chave de licença",
    licenseKeyPlaceholder: "GOAT-XXXX-XXXX-XXXX",
    searchIdle: "Buscar",
    searchBusy: "Buscando...",
    noResults: "Nenhum cliente encontrado com esses dados.",
    licensesHeading: "Licenças",
    statusLabel: "Status",
    planLabel: "Plano",
    expiresLabel: "Expira em",
    setActive: "Ativar",
    setSuspended: "Suspender",
    setRevoked: "Revogar",
    serversHeading: "Servidores",
    serverIpLabel: "IP atual observado",
    authStatusLabel: "Status de autenticação",
    authorizedIpsLabel: "IPs autorizados (allowlist de segurança)",
    authorizedIpsPlaceholder: "Um IP por linha - deixe vazio pra não travar por IP",
    authorizedIpsHint:
      "Se essa lista não tiver o IP atual do servidor, todo heartbeat/telemetria cai em 403 (ex: cliente trocou de VPS).",
    noAuthorizedIps: "Sem restrição de IP configurada.",
    saveIps: "Salvar IPs",
    savingIps: "Salvando...",
    clearIps: "Limpar (desbloquear IP)",
    deleteServer: "Excluir produto",
    deletingServer: "Excluindo...",
  },
  orders: {
    heading: "Encomendas de sistema",
    description:
      "Pedidos de sistemas, apps e sites sob encomenda. Toda resposta vai direto pro e-mail cadastrado na conta do cliente.",
    empty: "Nenhuma encomenda recebida ainda.",
    statusLabel: "Status",
    statuses: {
      pending: "Recebida",
      analyzing: "Em análise",
      quoted: "Orçamento enviado",
      accepted: "Aceita",
      rejected: "Recusada",
      in_progress: "Em desenvolvimento",
      completed: "Concluída",
    },
    types: {
      web_system: "Sistema web",
      mobile_app: "Aplicativo mobile",
      website: "Site institucional",
      ecommerce: "E-commerce",
      automation_bot: "Automação / bot",
      other: "Outro",
    },
    priceLabel: "Valor do orçamento (R$)",
    pricePlaceholder: "5000.00",
    savePrice: "Salvar",
    savingPrice: "Salvando...",
    notesLabel: "Notas internas (só o time vê)",
    notesPlaceholder: "Anotações internas sobre esse pedido...",
    saveNotes: "Salvar notas",
    messagesHeading: "Histórico de respostas",
    noMessages: "Ainda não respondemos esse cliente.",
    fromClient: "Cliente",
    fromCeo: "Você",
    awaitingReply: "Cliente respondeu — aguardando retorno",
    replyLabel: "Responder por e-mail",
    replyPlaceholder: "Escreva a resposta que vai pro e-mail do cliente...",
    sendReply: "Enviar resposta",
    sendingReply: "Enviando...",
    sendingTo: (email) => `Enviando pra: ${email}`,
    noEmail:
      "Esse cliente não tem e-mail cadastrado na conta — peça pra ele logar com Google ou atualizar o e-mail.",
  },
  catalog: {
    heading: "Catálogo",
    refresh: "Atualizar",
    noProducts: "Nenhum produto cadastrado ainda.",
    typeAnticheat: "Anticheat",
    typeDownload: "Download",
    inactive: "Inativo",
    deactivateProduct: "Desativar produto",
    reactivateProduct: "Reativar produto",
    noPlans: "Nenhum plano cadastrado pra esse produto ainda.",
    archived: "Arquivado",
    hasFile: "com arquivo",
    billingInterval: (count, unit) =>
      `Assinatura a cada ${count} ${unit === "year" ? "ano(s)" : "mês(es)"}`,
    oneTimePayment: "Pagamento único",
    priceIdLabel: (id) => `Price: ${id}`,
    newPricePlaceholder: "Novo valor (R$)",
    updatePrice: "Atualizar preço",
    deactivate: "Desativar",
    reactivate: "Reativar",
    closeEdit: "Fechar edição",
    editDetails: "Editar detalhes",
    archive: "Arquivar",
    currentFile: (name) => `Arquivo atual: ${name} — enviar um novo substitui esse.`,
    noFileYet: "Nenhum arquivo anexado ainda (produto até 5MB).",
    uploading: "Enviando...",
    replaceFile: "Substituir arquivo",
    uploadFile: "Enviar arquivo",
    editNameLabel: "Nome",
    editBillingNoteLabel: "Nota de cobrança",
    editDescriptionLabel: "Descrição",
    editBadgeLabel: "Badge (opcional)",
    editSortOrderLabel: "Ordem de exibição",
    editFeaturesLabel: "Features (uma por linha)",
    saving: "Salvando...",
    saveChanges: "Salvar alterações",
  },
  messages: {
    loadDataError: "Erro ao carregar dados.",
    fillProductName: "Preencha o nome do produto.",
    logoTooBig: "A logo precisa ter até 5MB.",
    productCreated: "Produto criado.",
    createProductError: "Erro ao criar produto.",
    createPlanBeforeProduct: "Crie um produto antes de adicionar planos.",
    fillNameAndValidAmount: "Preencha nome e um valor válido.",
    fileTooBig: "O arquivo do produto precisa ter até 5MB.",
    planCreated: "Plano criado na Stripe e no catálogo.",
    createPlanError: "Erro ao criar plano.",
    invalidPriceValue: "Informe um valor válido pra atualizar o preço.",
    priceUpdated: (code) => `Preço de '${code}' atualizado na Stripe.`,
    updatePriceError: "Erro ao atualizar preço.",
    updatePlanError: "Erro ao atualizar plano.",
    chooseFileFirst: "Escolha um arquivo .zip antes de enviar.",
    fileUpdated: (code) =>
      `Arquivo de '${code}' atualizado - já vale pra quem tiver licença ativa.`,
    uploadFileError: "Erro ao enviar arquivo.",
    planNameRequired: "O nome do plano não pode ficar vazio.",
    detailsUpdated: (code) => `Detalhes de '${code}' atualizados.`,
    updateDetailsError: "Erro ao atualizar detalhes do plano.",
    confirmArchive: (code) =>
      `Arquivar o plano '${code}'? Ele deixa de aparecer no site e o produto é desativado na Stripe.`,
    planArchived: (code) => `Plano '${code}' arquivado.`,
    archivePlanError: "Erro ao arquivar plano.",
    updateProductError: "Erro ao atualizar produto.",
    discordIdRequired: "Informe o Discord ID do cliente.",
    selectPlan: "Selecione um plano.",
    grantError: "Erro ao liberar produto.",
    couponCodeRequired: "Informe o código do cupom.",
    invalidPercent: "Percentual de desconto inválido (1-100).",
    invalidAmount: "Valor de desconto inválido.",
    couponCreated: "Cupom criado na Stripe.",
    createCouponError: "Erro ao criar cupom.",
    confirmDeactivateCoupon: (code) =>
      `Desativar o cupom '${code}'? Ele para de funcionar imediatamente.`,
    deactivateCouponError: "Erro ao desativar cupom.",
    provideDiscordIdOrKey: "Informe o Discord ID ou a chave de licença.",
    searchLicenseError: "Erro ao buscar cliente.",
    ipsUpdated: "IPs autorizados atualizados.",
    updateIpsError: "Erro ao atualizar IPs autorizados.",
    statusUpdated: (status) => `Licença atualizada para ${status}.`,
    updateStatusError: "Erro ao atualizar status da licença.",
    confirmStatusChange: (key, status) => `Alterar a licença '${key}' para '${status}'?`,
    confirmDeleteServer: (name) =>
      `Excluir o produto '${name}'? Ele some do dashboard do cliente e a licença vinculada é apagada permanentemente (a chave deixa de existir). Essa ação não pode ser desfeita.`,
    serverDeleted: (name) => `Produto '${name}' e a licença vinculada foram excluídos.`,
    deleteServerError: "Erro ao excluir o produto do cliente.",
    loadOrdersError: "Erro ao carregar encomendas.",
    orderUpdated: "Encomenda atualizada.",
    updateOrderError: "Erro ao atualizar encomenda.",
    replyMessageRequired: "Escreva uma mensagem antes de enviar.",
    replySent: (email) => `Resposta enviada pra ${email}.`,
    replyOrderError: "Erro ao enviar resposta por e-mail.",
    selectProductFirstSp: "Selecione o resource.",
    chooseFileFirstSp: "Escolha o arquivo .zip do fonte primeiro.",
    fileTooBigSp: "Arquivo maior que o limite de 50MB.",
    packageUploaded: (product) => `Fonte de "${product}" enviado e criptografado com sucesso.`,
    uploadPackageError: "Erro ao enviar o fonte.",
  },
};

const en: Copy = {
  tabTitle: "CEO Area — Goat Network",
  checkingAccess: "Checking access...",
  pageTitle: "CEO Area",
  pageSubtitle: "Products and plans connected directly to Stripe.",
  tabs: {
    catalog: "Catalog",
    clients: "Clients",
    coupons: "Coupons",
    orders: "Custom Orders",
  },
  newProduct: {
    heading: "New product (resource)",
    description:
      "Every resource you sell (anticheat, a new resource, etc) is a product — after creating it, you add its billing plans (Monthly/Quarterly/Enterprise/whatever you want).",
    nameLabel: "Name *",
    namePlaceholder: "Resource X",
    typeLabel: "Type",
    typeAnticheat: "Anticheat (generates a license + asks for server data)",
    typeDownload: "Download (just unlocks the file, no questions asked)",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Short product description",
    logoLabel: "Logo (optional — PNG/JPG/WEBP/SVG, up to 1MB)",
    logoHint:
      "If you don't upload one, the product uses the default Goat Network logo (same as the favicon).",
    protectionKeyLabel: "Protection identifier (internal)",
    protectionKeyHint:
      "Not shown on the site or to customers - just links this product to the matching GOAT resource, so automatic protection and delivery generate the right build on purchase.",
    protectionKeyNone: "None (product has no automatic protection)",
    submitIdle: "Create product",
    submitBusy: "Creating...",
  },
  newPlan: {
    heading: "New plan",
    productLabel: "Product *",
    productEmptyOption: "Create a product first",
    nameLabel: "Plan name *",
    namePlaceholder: "Monthly",
    amountLabel: "Amount (R$) *",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Short plan description",
    billingNoteLabel: "Billing note (shown at checkout)",
    billingNotePlaceholder: "Billed every 6 months.",
    billingTypeLabel: "Billing type",
    billingTypeSubscription: "Recurring subscription",
    billingTypePayment: "One-time payment",
    intervalLabel: "Interval",
    intervalMonth: "Month(s)",
    intervalYear: "Year(s)",
    intervalCountLabel: "Every",
    badgeLabel: "Badge (optional)",
    badgePlaceholder: "Recommended",
    sortOrderLabel: "Display order",
    featuresLabel: "Features (one per line)",
    featuresPlaceholder: "Up to 1000 players\nDedicated support",
    fileLabel: "Product file (.zip, up to 5MB — optional)",
    fileHint: 'Once purchased, this file shows up in the customer\'s "Downloads" tab.',
    submitIdle: "Create plan",
    submitBusy: "Creating on Stripe...",
  },
  sourcePackages: {
    heading: "Raw source (automatic protection)",
    description:
      "Uploads the OPEN (unprotected) source code of a GOAT resource. A new upload replaces the previous one for the same identifier - already-delivered sales aren't changed retroactively, only future ones.",
    productLabel: "Resource *",
    fileLabel: "Source file (.zip, up to 50MB)",
    fileHint: "Zip the resource folder without .git/node_modules/dist before uploading.",
    submitIdle: "Upload source",
    submitBusy: "Uploading...",
    listHeading: "Sources already on file",
    empty: "No source uploaded yet.",
    colProduct: "Resource",
    colFile: "File",
    colUploadedAt: "Uploaded at",
    colUploadedBy: "Uploaded by",
  },
  grants: {
    heading: "Grant for free",
    description:
      "Gives someone access to a plan without going through Stripe — generates the order/license just like a real purchase, but with no charge. The customer must have logged into the site at least once already.",
    discordIdLabel: "Customer's Discord ID *",
    discordIdPlaceholder: "123456789012345678",
    planLabel: "Plan *",
    planEmptyOption: "No plans registered",
    serverNameLabel: "Server name (optional — only used if the plan requires registration)",
    serverNamePlaceholder: "My FiveM Server",
    submitIdle: "Grant for free",
    submitBusy: "Granting...",
    resultHint:
      "Send this link to the customer. If they already have server data from another purchase, it unlocks instantly on its own — otherwise, it asks them to fill it in:",
    copyButton: "Copy",
  },
  coupons: {
    heading: "New coupon",
    description:
      'The customer types the code right on Stripe\'s own payment screen (the "Add promotion code" link). A 100% coupon skips the card entirely.',
    codeLabel: "Code *",
    codePlaceholder: "FREEMONTH",
    restrictPlanLabel: "Restrict to one plan (optional)",
    anyPlan: "Any plan",
    discountTypeLabel: "Discount type",
    discountTypePercent: "Percentage",
    discountTypeAmount: "Fixed amount (R$)",
    percentLabel: "Discount (%) — 100 = free",
    amountLabel: "Discount (R$)",
    durationLabel: "Duration",
    durationOnce: "First charge only",
    durationRepeating: "For N months",
    durationForever: "Forever",
    durationMonthsLabel: "For how many months",
    maxRedemptionsLabel: "Usage limit (optional)",
    maxRedemptionsPlaceholder: "Unlimited",
    expiresAtLabel: "Expires on (optional)",
    submitIdle: "Create coupon",
    submitBusy: "Creating on Stripe...",
    listHeading: "Coupons",
    disabledTag: "Disabled",
    percentOffSuffix: (n) => `${n}% off`,
    amountOffSuffix: (v) => `R$ ${v} off`,
    durationOnceShort: "1st charge",
    durationForeverShort: "forever",
    durationMonthsShort: (n) => `${n} month(s)`,
    maxUsesSuffix: (n) => ` · up to ${n} use(s)`,
    expiresSuffix: (date) => ` · expires ${date}`,
    deactivate: "Deactivate",
  },
  licenses: {
    heading: "License management",
    description:
      "Search by Discord ID or license key to see a customer's licenses and servers — useful for unlocking an IP after a VPS move, suspending a license for abuse, or reactivating one.",
    discordIdLabel: "Customer's Discord ID",
    discordIdPlaceholder: "123456789012345678",
    licenseKeyLabel: "or license key",
    licenseKeyPlaceholder: "GOAT-XXXX-XXXX-XXXX",
    searchIdle: "Search",
    searchBusy: "Searching...",
    noResults: "No customer found with that info.",
    licensesHeading: "Licenses",
    statusLabel: "Status",
    planLabel: "Plan",
    expiresLabel: "Expires on",
    setActive: "Activate",
    setSuspended: "Suspend",
    setRevoked: "Revoke",
    serversHeading: "Servers",
    serverIpLabel: "Current observed IP",
    authStatusLabel: "Auth status",
    authorizedIpsLabel: "Authorized IPs (security allowlist)",
    authorizedIpsPlaceholder: "One IP per line - leave empty to not lock by IP",
    authorizedIpsHint:
      "If this list doesn't include the server's current IP, every heartbeat/telemetry call gets a 403 (e.g. customer moved VPS).",
    noAuthorizedIps: "No IP restriction configured.",
    saveIps: "Save IPs",
    savingIps: "Saving...",
    clearIps: "Clear (unlock IP)",
    deleteServer: "Delete product",
    deletingServer: "Deleting...",
  },
  orders: {
    heading: "Custom system orders",
    description:
      "Requests for custom systems, apps and sites. Every reply goes straight to the customer's registered account email.",
    empty: "No orders received yet.",
    statusLabel: "Status",
    statuses: {
      pending: "Received",
      analyzing: "Under review",
      quoted: "Quote sent",
      accepted: "Accepted",
      rejected: "Declined",
      in_progress: "In progress",
      completed: "Completed",
    },
    types: {
      web_system: "Web system",
      mobile_app: "Mobile app",
      website: "Institutional site",
      ecommerce: "E-commerce",
      automation_bot: "Automation / bot",
      other: "Other",
    },
    priceLabel: "Quoted price (R$)",
    pricePlaceholder: "5000.00",
    savePrice: "Save",
    savingPrice: "Saving...",
    notesLabel: "Internal notes (team only)",
    notesPlaceholder: "Internal notes about this order...",
    saveNotes: "Save notes",
    messagesHeading: "Reply history",
    noMessages: "No reply sent to this customer yet.",
    fromClient: "Client",
    fromCeo: "You",
    awaitingReply: "Client replied — awaiting your response",
    replyLabel: "Reply by email",
    replyPlaceholder: "Write the reply that will be sent to the customer's email...",
    sendReply: "Send reply",
    sendingReply: "Sending...",
    sendingTo: (email) => `Sending to: ${email}`,
    noEmail:
      "This customer has no email on their account — ask them to sign in with Google or update their email.",
  },
  catalog: {
    heading: "Catalog",
    refresh: "Refresh",
    noProducts: "No products registered yet.",
    typeAnticheat: "Anticheat",
    typeDownload: "Download",
    inactive: "Inactive",
    deactivateProduct: "Deactivate product",
    reactivateProduct: "Reactivate product",
    noPlans: "No plans registered for this product yet.",
    archived: "Archived",
    hasFile: "has file",
    billingInterval: (count, unit) =>
      `Billed every ${count} ${
        unit === "year" ? (count === 1 ? "year" : "years") : count === 1 ? "month" : "months"
      }`,
    oneTimePayment: "One-time payment",
    priceIdLabel: (id) => `Price: ${id}`,
    newPricePlaceholder: "New amount (R$)",
    updatePrice: "Update price",
    deactivate: "Deactivate",
    reactivate: "Reactivate",
    closeEdit: "Close editor",
    editDetails: "Edit details",
    archive: "Archive",
    currentFile: (name) => `Current file: ${name} — uploading a new one replaces it.`,
    noFileYet: "No file attached yet (product up to 5MB).",
    uploading: "Uploading...",
    replaceFile: "Replace file",
    uploadFile: "Upload file",
    editNameLabel: "Name",
    editBillingNoteLabel: "Billing note",
    editDescriptionLabel: "Description",
    editBadgeLabel: "Badge (optional)",
    editSortOrderLabel: "Display order",
    editFeaturesLabel: "Features (one per line)",
    saving: "Saving...",
    saveChanges: "Save changes",
  },
  messages: {
    loadDataError: "Error loading data.",
    fillProductName: "Fill in the product name.",
    logoTooBig: "The logo needs to be under 5MB.",
    productCreated: "Product created.",
    createProductError: "Error creating product.",
    createPlanBeforeProduct: "Create a product before adding plans.",
    fillNameAndValidAmount: "Fill in a name and a valid amount.",
    fileTooBig: "The product file needs to be under 5MB.",
    planCreated: "Plan created on Stripe and in the catalog.",
    createPlanError: "Error creating plan.",
    invalidPriceValue: "Enter a valid amount to update the price.",
    priceUpdated: (code) => `Price for '${code}' updated on Stripe.`,
    updatePriceError: "Error updating price.",
    updatePlanError: "Error updating plan.",
    chooseFileFirst: "Choose a .zip file before uploading.",
    fileUpdated: (code) =>
      `File for '${code}' updated — already applies to anyone with an active license.`,
    uploadFileError: "Error uploading file.",
    planNameRequired: "The plan name can't be empty.",
    detailsUpdated: (code) => `Details for '${code}' updated.`,
    updateDetailsError: "Error updating plan details.",
    confirmArchive: (code) =>
      `Archive plan '${code}'? It will stop showing on the site and the product will be deactivated on Stripe.`,
    planArchived: (code) => `Plan '${code}' archived.`,
    archivePlanError: "Error archiving plan.",
    updateProductError: "Error updating product.",
    discordIdRequired: "Enter the customer's Discord ID.",
    selectPlan: "Select a plan.",
    grantError: "Error granting product.",
    couponCodeRequired: "Enter the coupon code.",
    invalidPercent: "Invalid discount percentage (1-100).",
    invalidAmount: "Invalid discount amount.",
    couponCreated: "Coupon created on Stripe.",
    createCouponError: "Error creating coupon.",
    confirmDeactivateCoupon: (code) => `Deactivate coupon '${code}'? It stops working immediately.`,
    deactivateCouponError: "Error deactivating coupon.",
    provideDiscordIdOrKey: "Enter the Discord ID or the license key.",
    searchLicenseError: "Error searching for customer.",
    ipsUpdated: "Authorized IPs updated.",
    updateIpsError: "Error updating authorized IPs.",
    statusUpdated: (status) => `License updated to ${status}.`,
    updateStatusError: "Error updating license status.",
    confirmStatusChange: (key, status) => `Change license '${key}' to '${status}'?`,
    confirmDeleteServer: (name) =>
      `Delete product '${name}'? It disappears from the customer's dashboard and the linked license is permanently deleted (the key stops existing). This cannot be undone.`,
    serverDeleted: (name) => `Product '${name}' and its linked license were deleted.`,
    deleteServerError: "Error deleting the customer's product.",
    loadOrdersError: "Error loading orders.",
    orderUpdated: "Order updated.",
    updateOrderError: "Error updating order.",
    replyMessageRequired: "Write a message before sending.",
    replySent: (email) => `Reply sent to ${email}.`,
    replyOrderError: "Error sending email reply.",
    selectProductFirstSp: "Select the resource.",
    chooseFileFirstSp: "Choose the source .zip file first.",
    fileTooBigSp: "File is bigger than the 50MB limit.",
    packageUploaded: (product) => `Source for "${product}" uploaded and encrypted successfully.`,
    uploadPackageError: "Error uploading the source.",
  },
};

const inputClass =
  "w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition-colors focus:border-foreground/40";

const emptyProductForm = {
  name: "",
  description: "",
  type: "anticheat" as "anticheat" | "download",
  sortOrder: "0",
  protectionKey: "" as "" | "legal" | "mdt" | "groups" | "anticheat",
};

const PROTECTABLE_RESOURCES = ["legal", "mdt", "groups", "anticheat"] as const;

const emptyPlanForm = {
  productSlug: "",
  name: "",
  description: "",
  amount: "",
  mode: "subscription" as "subscription" | "payment",
  intervalUnit: "month" as "month" | "year",
  intervalCount: "1",
  billingNote: "",
  badge: "",
  sortOrder: "0",
  features: "",
};

const emptyGrantForm = { discordId: "", plan: "", serverName: "" };

const emptyCouponForm = {
  code: "",
  discountType: "percent" as "percent" | "amount",
  percentOff: "100",
  amountOff: "",
  duration: "once" as "once" | "repeating" | "forever",
  durationInMonths: "1",
  maxRedemptions: "",
  expiresAt: "",
  planCode: "",
};

export default function CeoPage() {
  const { lang } = useLanguage();
  const t = lang === "pt" ? pt : en;
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"catalog" | "clients" | "coupons" | "orders">(
    "catalog",
  );
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const [creatingProduct, setCreatingProduct] = useState(false);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [productLogoFile, setProductLogoFile] = useState<File | null>(null);

  const [creatingPlan, setCreatingPlan] = useState(false);
  const [planForm, setPlanForm] = useState(emptyPlanForm);
  const [productFile, setProductFile] = useState<File | null>(null);

  const [sourcePackages, setSourcePackages] = useState<SourcePackageItem[]>([]);
  const [spProduct, setSpProduct] = useState<(typeof PROTECTABLE_RESOURCES)[number]>(
    PROTECTABLE_RESOURCES[0],
  );
  const [spFile, setSpFile] = useState<File | null>(null);
  const [uploadingSp, setUploadingSp] = useState(false);

  const [priceEdits, setPriceEdits] = useState<Record<string, string>>({});
  const [busyCode, setBusyCode] = useState<string | null>(null);
  const [planFileEdits, setPlanFileEdits] = useState<Record<string, File | null>>({});
  const [uploadingFileCode, setUploadingFileCode] = useState<string | null>(null);

  const [editingPlanCode, setEditingPlanCode] = useState<string | null>(null);
  const [planDetailsEdits, setPlanDetailsEdits] = useState<
    Record<
      string,
      {
        name: string;
        description: string;
        billingNote: string;
        badge: string;
        sortOrder: string;
        features: string;
      }
    >
  >({});
  const [savingDetailsCode, setSavingDetailsCode] = useState<string | null>(null);

  const [grantForm, setGrantForm] = useState(emptyGrantForm);
  const [grantingFree, setGrantingFree] = useState(false);
  const [grantResult, setGrantResult] = useState<{
    message: string;
    finalizeUrl: string | null;
  } | null>(null);

  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [couponForm, setCouponForm] = useState(emptyCouponForm);
  const [creatingCoupon, setCreatingCoupon] = useState(false);
  const [busyCouponCode, setBusyCouponCode] = useState<string | null>(null);

  const [licenseSearchDiscordId, setLicenseSearchDiscordId] = useState("");
  const [licenseSearchKey, setLicenseSearchKey] = useState("");
  const [searchingLicense, setSearchingLicense] = useState(false);
  const [licenseResult, setLicenseResult] = useState<AdminLicenseSearchResult | null>(null);
  const [licenseSearched, setLicenseSearched] = useState(false);
  const [ipEditsByServer, setIpEditsByServer] = useState<Record<string, string>>({});
  const [busyServerId, setBusyServerId] = useState<string | null>(null);
  const [busyLicenseId, setBusyLicenseId] = useState<string | null>(null);
  const [busyDeleteServerId, setBusyDeleteServerId] = useState<string | null>(null);

  const [systemOrders, setSystemOrders] = useState<SystemOrderItem[]>([]);
  const [orderPriceEdits, setOrderPriceEdits] = useState<Record<string, string>>({});
  const [orderNotesEdits, setOrderNotesEdits] = useState<Record<string, string>>({});
  const [orderReplyDrafts, setOrderReplyDrafts] = useState<Record<string, string>>({});
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);
  const [sendingReplyOrderId, setSendingReplyOrderId] = useState<string | null>(null);

  useEffect(() => {
    document.title = t.tabTitle;
  }, [lang, t.tabTitle]);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("goat_auth_token");
      if (!token) {
        navigate("/auth");
        return;
      }
      const me: UserProfile | null = await api.getMe();
      if (!me || !me.isCeo) {
        navigate("/");
        return;
      }
      setAuthorized(true);
      setChecking(false);
    })();
  }, [navigate]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [productsData, plansData, couponsData, systemOrdersData, sourcePackagesData] =
        await Promise.all([
          api.admin.products.getProducts(),
          api.admin.getPlans(),
          api.admin.coupons.list(),
          api.systemOrders.admin.list(),
          api.admin.sourcePackages.list(),
        ]);
      setProducts(productsData);
      setPlans(plansData);
      setCoupons(couponsData);
      setSystemOrders(systemOrdersData);
      setSourcePackages(sourcePackagesData);
      if (!planForm.productSlug && productsData.length > 0) {
        setPlanForm((f) => ({ ...f, productSlug: productsData[0].slug }));
      }
      if (!grantForm.plan && plansData.length > 0) {
        setGrantForm((f) => ({ ...f, plan: plansData[0].code }));
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || t.messages.loadDataError });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorized]);

  const readFileAsBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // Redimensiona/comprime a imagem no navegador antes de virar base64 - sem
  // isso, uma foto de câmera (vários MB) virava um payload maior ainda em
  // base64 (+33%) e estourava o limite de corpo de requisição do proxy na
  // frente do backend (Render/Cloudflare), que devolve 413 sem headers de
  // CORS - o navegador então mostra isso como um bloqueio de CORS confuso.
  // Ícone de produto não precisa de mais que ~256px, então sempre cabe.
  const compressImageToBase64 = (file: File, maxDimension = 256, quality = 0.85): Promise<string> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Não foi possível processar a imagem"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // PNG/GIF preservam transparência - JPEG não, mas é bem mais leve
        // pra fotos comuns (a maioria dos logos enviados).
        const preservaTransparencia = file.type === "image/png" || file.type === "image/gif";
        resolve(canvas.toDataURL(preservaTransparencia ? "image/png" : "image/jpeg", quality));
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Não foi possível ler a imagem"));
      };
      img.src = url;
    });

  // SVG é texto vetorial e já é pequeno - rasterizar perderia a nitidez à
  // toa, então passa direto. O resto (PNG/JPG/WEBP/GIF) sempre é comprimido.
  const prepareLogoBase64 = (file: File): Promise<string> =>
    file.type === "image/svg+xml" ? readFileAsBase64(file) : compressImageToBase64(file);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (!productForm.name.trim()) {
      setMsg({ type: "error", text: t.messages.fillProductName });
      return;
    }
    if (productLogoFile && productLogoFile.size > 5 * 1024 * 1024) {
      setMsg({ type: "error", text: t.messages.logoTooBig });
      return;
    }
    setCreatingProduct(true);
    try {
      const logoBase64 = productLogoFile ? await prepareLogoBase64(productLogoFile) : undefined;
      await api.admin.products.createProduct({
        name: productForm.name,
        description: productForm.description,
        type: productForm.type,
        sortOrder: Number(productForm.sortOrder) || 0,
        logoBase64,
        protectionKey: productForm.protectionKey || undefined,
      });
      setMsg({ type: "success", text: t.messages.productCreated });
      setProductForm(emptyProductForm);
      setProductLogoFile(null);
      await loadAll();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || t.messages.createProductError });
    } finally {
      setCreatingProduct(false);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const amount = Number(planForm.amount);
    if (!planForm.productSlug) {
      setMsg({ type: "error", text: t.messages.createPlanBeforeProduct });
      return;
    }
    if (!planForm.name.trim() || !Number.isFinite(amount) || amount <= 0) {
      setMsg({ type: "error", text: t.messages.fillNameAndValidAmount });
      return;
    }
    if (productFile && productFile.size > 5 * 1024 * 1024) {
      setMsg({ type: "error", text: t.messages.fileTooBig });
      return;
    }
    setCreatingPlan(true);
    try {
      const fileBase64 = productFile ? await readFileAsBase64(productFile) : undefined;
      await api.admin.createPlan({
        productSlug: planForm.productSlug,
        name: planForm.name,
        description: planForm.description,
        amount,
        mode: planForm.mode,
        intervalUnit: planForm.mode === "subscription" ? planForm.intervalUnit : undefined,
        intervalCount:
          planForm.mode === "subscription" ? Number(planForm.intervalCount) || 1 : undefined,
        billingNote: planForm.billingNote,
        badge: planForm.badge,
        sortOrder: Number(planForm.sortOrder) || 0,
        features: planForm.features
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean),
        fileBase64,
        fileName: productFile?.name,
      });
      setMsg({ type: "success", text: t.messages.planCreated });
      setPlanForm({ ...emptyPlanForm, productSlug: planForm.productSlug });
      setProductFile(null);
      await loadAll();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || t.messages.createPlanError });
    } finally {
      setCreatingPlan(false);
    }
  };

  const handleUploadSourcePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (!spProduct) {
      setMsg({ type: "error", text: t.messages.selectProductFirstSp });
      return;
    }
    if (!spFile) {
      setMsg({ type: "error", text: t.messages.chooseFileFirstSp });
      return;
    }
    if (spFile.size > 50 * 1024 * 1024) {
      setMsg({ type: "error", text: t.messages.fileTooBigSp });
      return;
    }
    setUploadingSp(true);
    try {
      const zipBase64 = await readFileAsBase64(spFile);
      await api.admin.sourcePackages.upload({
        product: spProduct,
        filename: spFile.name,
        zipBase64,
      });
      setMsg({ type: "success", text: t.messages.packageUploaded(spProduct) });
      setSpFile(null);
      await loadAll();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || t.messages.uploadPackageError });
    } finally {
      setUploadingSp(false);
    }
  };

  const handleUpdatePrice = async (plan: PlanItem) => {
    const raw = priceEdits[plan.code];
    const amount = Number(raw);
    if (!raw || !Number.isFinite(amount) || amount <= 0) {
      setMsg({ type: "error", text: t.messages.invalidPriceValue });
      return;
    }
    setBusyCode(plan.code);
    setMsg(null);
    try {
      await api.admin.updatePlanPrice(plan.productSlug, plan.key, amount);
      setMsg({ type: "success", text: t.messages.priceUpdated(plan.code) });
      setPriceEdits((prev) => ({ ...prev, [plan.code]: "" }));
      await loadAll();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || t.messages.updatePriceError });
    } finally {
      setBusyCode(null);
    }
  };

  const handleToggleActive = async (plan: PlanItem) => {
    setBusyCode(plan.code);
    setMsg(null);
    try {
      await api.admin.updatePlanDetails(plan.productSlug, plan.key, { active: !plan.active });
      await loadAll();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || t.messages.updatePlanError });
    } finally {
      setBusyCode(null);
    }
  };

  const handleUpdateFile = async (plan: PlanItem) => {
    const file = planFileEdits[plan.code];
    if (!file) {
      setMsg({ type: "error", text: t.messages.chooseFileFirst });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMsg({ type: "error", text: t.messages.fileTooBig });
      return;
    }
    setUploadingFileCode(plan.code);
    setMsg(null);
    try {
      const fileBase64 = await readFileAsBase64(file);
      await api.admin.updatePlanDetails(plan.productSlug, plan.key, {
        fileBase64,
        fileName: file.name,
      });
      setMsg({
        type: "success",
        text: t.messages.fileUpdated(plan.code),
      });
      setPlanFileEdits((prev) => ({ ...prev, [plan.code]: null }));
      await loadAll();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || t.messages.uploadFileError });
    } finally {
      setUploadingFileCode(null);
    }
  };

  const handleToggleEditDetails = (plan: PlanItem) => {
    if (editingPlanCode === plan.code) {
      setEditingPlanCode(null);
      return;
    }
    setPlanDetailsEdits((prev) => ({
      ...prev,
      [plan.code]: prev[plan.code] || {
        name: plan.name,
        description: plan.description,
        billingNote: plan.billingNote,
        badge: plan.badge || "",
        sortOrder: String(plan.sortOrder),
        features: plan.features.join("\n"),
      },
    }));
    setEditingPlanCode(plan.code);
  };

  const handleSaveDetails = async (plan: PlanItem) => {
    const edit = planDetailsEdits[plan.code];
    if (!edit || !edit.name.trim()) {
      setMsg({ type: "error", text: t.messages.planNameRequired });
      return;
    }
    setSavingDetailsCode(plan.code);
    setMsg(null);
    try {
      await api.admin.updatePlanDetails(plan.productSlug, plan.key, {
        name: edit.name,
        description: edit.description,
        billingNote: edit.billingNote,
        badge: edit.badge,
        sortOrder: Number(edit.sortOrder) || 0,
        features: edit.features
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean),
      });
      setMsg({ type: "success", text: t.messages.detailsUpdated(plan.code) });
      setEditingPlanCode(null);
      await loadAll();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || t.messages.updateDetailsError });
    } finally {
      setSavingDetailsCode(null);
    }
  };

  const handleArchive = async (plan: PlanItem) => {
    if (!window.confirm(t.messages.confirmArchive(plan.code))) return;
    setBusyCode(plan.code);
    setMsg(null);
    try {
      await api.admin.archivePlan(plan.productSlug, plan.key);
      setMsg({ type: "success", text: t.messages.planArchived(plan.code) });
      await loadAll();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || t.messages.archivePlanError });
    } finally {
      setBusyCode(null);
    }
  };

  const handleToggleProductActive = async (product: ProductItem) => {
    setBusyCode(product.slug);
    setMsg(null);
    try {
      await api.admin.products.updateProduct(product.slug, { active: !product.active });
      await loadAll();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || t.messages.updateProductError });
    } finally {
      setBusyCode(null);
    }
  };

  const handleCreateGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setGrantResult(null);
    if (!grantForm.discordId.trim()) {
      setMsg({ type: "error", text: t.messages.discordIdRequired });
      return;
    }
    if (!grantForm.plan) {
      setMsg({ type: "error", text: t.messages.selectPlan });
      return;
    }
    setGrantingFree(true);
    try {
      const res = await api.admin.grants.create({
        discordId: grantForm.discordId.trim(),
        plan: grantForm.plan,
        serverName: grantForm.serverName.trim() || undefined,
      });
      setMsg({ type: "success", text: res.message });
      setGrantResult({ message: res.message, finalizeUrl: res.finalizeUrl });
      setGrantForm((f) => ({ ...emptyGrantForm, plan: f.plan }));
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || t.messages.grantError });
    } finally {
      setGrantingFree(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (!couponForm.code.trim()) {
      setMsg({ type: "error", text: t.messages.couponCodeRequired });
      return;
    }
    const percentOff =
      couponForm.discountType === "percent" ? Number(couponForm.percentOff) : undefined;
    const amountOff =
      couponForm.discountType === "amount" ? Number(couponForm.amountOff) : undefined;
    if (
      couponForm.discountType === "percent" &&
      (!Number.isFinite(percentOff) || (percentOff as number) <= 0 || (percentOff as number) > 100)
    ) {
      setMsg({ type: "error", text: t.messages.invalidPercent });
      return;
    }
    if (
      couponForm.discountType === "amount" &&
      (!Number.isFinite(amountOff) || (amountOff as number) <= 0)
    ) {
      setMsg({ type: "error", text: t.messages.invalidAmount });
      return;
    }
    setCreatingCoupon(true);
    try {
      await api.admin.coupons.create({
        code: couponForm.code.trim(),
        percentOff,
        amountOff,
        duration: couponForm.duration,
        durationInMonths:
          couponForm.duration === "repeating"
            ? Number(couponForm.durationInMonths) || 1
            : undefined,
        maxRedemptions: couponForm.maxRedemptions ? Number(couponForm.maxRedemptions) : undefined,
        expiresAt: couponForm.expiresAt || undefined,
        planCode: couponForm.planCode || undefined,
      });
      setMsg({ type: "success", text: t.messages.couponCreated });
      setCouponForm(emptyCouponForm);
      await loadAll();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || t.messages.createCouponError });
    } finally {
      setCreatingCoupon(false);
    }
  };

  const handleDeactivateCoupon = async (coupon: CouponItem) => {
    if (!window.confirm(t.messages.confirmDeactivateCoupon(coupon.code))) return;
    setBusyCouponCode(coupon.code);
    setMsg(null);
    try {
      await api.admin.coupons.deactivate(coupon.code);
      await loadAll();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || t.messages.deactivateCouponError });
    } finally {
      setBusyCouponCode(null);
    }
  };

  const handleSearchLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (!licenseSearchDiscordId.trim() && !licenseSearchKey.trim()) {
      setMsg({ type: "error", text: t.messages.provideDiscordIdOrKey });
      return;
    }
    setSearchingLicense(true);
    setLicenseSearched(false);
    try {
      const result = await api.admin.licenses.search({
        discordId: licenseSearchDiscordId.trim() || undefined,
        licenseKey: licenseSearchKey.trim() || undefined,
      });
      setLicenseResult(result);
      setIpEditsByServer(
        Object.fromEntries(
          result.servers.map((s) => [s._id, (s.security.authorizedIps || []).join("\n")]),
        ),
      );
    } catch (err: any) {
      setLicenseResult(null);
      setMsg({ type: "error", text: err.message || t.messages.searchLicenseError });
    } finally {
      setSearchingLicense(false);
      setLicenseSearched(true);
    }
  };

  const handleSaveServerIps = async (serverId: string, raw: string) => {
    const ips = raw
      .split("\n")
      .map((ip) => ip.trim())
      .filter(Boolean);
    setBusyServerId(serverId);
    setMsg(null);
    try {
      const res = await api.admin.licenses.resetServerIps(serverId, ips);
      setMsg({ type: "success", text: t.messages.ipsUpdated });
      setLicenseResult((prev) =>
        prev
          ? {
              ...prev,
              servers: prev.servers.map((s) => (s._id === serverId ? { ...s, ...res.server } : s)),
            }
          : prev,
      );
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || t.messages.updateIpsError });
    } finally {
      setBusyServerId(null);
    }
  };

  const handleChangeLicenseStatus = async (
    license: { _id: string; key: string },
    status: "active" | "suspended" | "revoked",
  ) => {
    if (!window.confirm(t.messages.confirmStatusChange(license.key, status))) return;
    setBusyLicenseId(license._id);
    setMsg(null);
    try {
      await api.admin.licenses.updateStatus(license._id, status);
      setMsg({ type: "success", text: t.messages.statusUpdated(status) });
      setLicenseResult((prev) =>
        prev
          ? {
              ...prev,
              licenses: prev.licenses.map((l) => (l._id === license._id ? { ...l, status } : l)),
            }
          : prev,
      );
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || t.messages.updateStatusError });
    } finally {
      setBusyLicenseId(null);
    }
  };

  const handleDeleteServer = async (server: { _id: string; name: string; licenseId: string }) => {
    if (!window.confirm(t.messages.confirmDeleteServer(server.name))) return;
    setBusyDeleteServerId(server._id);
    setMsg(null);
    try {
      await api.admin.licenses.deleteServer(server._id);
      setMsg({ type: "success", text: t.messages.serverDeleted(server.name) });
      setLicenseResult((prev) =>
        prev
          ? {
              ...prev,
              servers: prev.servers.filter((s) => s._id !== server._id),
              licenses: prev.licenses.filter((l) => l._id !== server.licenseId),
            }
          : prev,
      );
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || t.messages.deleteServerError });
    } finally {
      setBusyDeleteServerId(null);
    }
  };

  const handleUpdateOrderStatus = async (
    order: SystemOrderItem,
    status: SystemOrderItem["status"],
  ) => {
    setBusyOrderId(order._id);
    setMsg(null);
    try {
      const res = await api.systemOrders.admin.update(order._id, { status });
      setSystemOrders((prev) => prev.map((o) => (o._id === order._id ? res.order : o)));
      setMsg({ type: "success", text: t.messages.orderUpdated });
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || t.messages.updateOrderError });
    } finally {
      setBusyOrderId(null);
    }
  };

  const handleSaveOrderPrice = async (order: SystemOrderItem) => {
    const raw = orderPriceEdits[order._id];
    const amount = Number(raw);
    if (!raw || !Number.isFinite(amount) || amount < 0) return;
    setBusyOrderId(order._id);
    setMsg(null);
    try {
      const res = await api.systemOrders.admin.update(order._id, { quotedPrice: amount });
      setSystemOrders((prev) => prev.map((o) => (o._id === order._id ? res.order : o)));
      setMsg({ type: "success", text: t.messages.orderUpdated });
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || t.messages.updateOrderError });
    } finally {
      setBusyOrderId(null);
    }
  };

  const handleSaveOrderNotes = async (order: SystemOrderItem) => {
    const notes = orderNotesEdits[order._id];
    if (notes === undefined) return;
    setBusyOrderId(order._id);
    setMsg(null);
    try {
      const res = await api.systemOrders.admin.update(order._id, { internalNotes: notes });
      setSystemOrders((prev) => prev.map((o) => (o._id === order._id ? res.order : o)));
      setMsg({ type: "success", text: t.messages.orderUpdated });
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || t.messages.updateOrderError });
    } finally {
      setBusyOrderId(null);
    }
  };

  const handleSendOrderReply = async (order: SystemOrderItem) => {
    const message = (orderReplyDrafts[order._id] || "").trim();
    if (!message) {
      setMsg({ type: "error", text: t.messages.replyMessageRequired });
      return;
    }
    setSendingReplyOrderId(order._id);
    setMsg(null);
    try {
      const res = await api.systemOrders.admin.reply(order._id, message);
      setSystemOrders((prev) => prev.map((o) => (o._id === order._id ? res.order : o)));
      setOrderReplyDrafts((prev) => ({ ...prev, [order._id]: "" }));
      setMsg({ type: "success", text: t.messages.replySent(res.sentTo) });
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || t.messages.replyOrderError });
    } finally {
      setSendingReplyOrderId(null);
    }
  };

  if (checking) {
    return (
      <main className="relative min-h-screen bg-background text-foreground">
        <Nav />
        <div className="pt-40 text-center text-sm text-muted-foreground">{t.checkingAccess}</div>
      </main>
    );
  }

  if (!authorized) return null;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground pb-24">
      <Nav />

      <div className="pt-32 pb-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-foreground text-background">
              <Crown className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {t.pageTitle}
              </h1>
              <p className="text-[12.5px] text-muted-foreground">{t.pageSubtitle}</p>
            </div>
          </div>

          {msg && (
            <div
              className={`mt-6 flex items-center gap-2.5 rounded-xl border p-4 text-xs font-medium ${msg.type === "error" ? "border-red-500/30 bg-red-500/10 text-red-400" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"}`}
            >
              {msg.type === "error" ? (
                <AlertCircle className="h-4 w-4 shrink-0" />
              ) : (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              )}
              {msg.text}
            </div>
          )}

          <MriTabs
            className="mt-8"
            tabs={[
              { id: "catalog", label: t.tabs.catalog, icon: Package },
              { id: "clients", label: t.tabs.clients, icon: Users },
              { id: "orders", label: t.tabs.orders, icon: Briefcase },
              { id: "coupons", label: t.tabs.coupons, icon: Ticket },
            ]}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as typeof activeTab)}
          />

          {/* Criar novo produto */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleCreateProduct}
            className={
              activeTab === "catalog"
                ? "mt-6 rounded-2xl border border-border/50 bg-card/40 p-8"
                : "hidden"
            }
          >
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Package className="h-4 w-4" /> {t.newProduct.heading}
            </h2>
            <p className="mt-1 text-[11.5px] text-muted-foreground">{t.newProduct.description}</p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={t.newProduct.nameLabel}>
                <MriInput
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className={inputClass}
                  placeholder={t.newProduct.namePlaceholder}
                />
              </Field>
              <Field label={t.newProduct.typeLabel}>
                <select
                  value={productForm.type}
                  onChange={(e) => setProductForm({ ...productForm, type: e.target.value as any })}
                  className={inputClass}
                >
                  <option value="anticheat">{t.newProduct.typeAnticheat}</option>
                  <option value="download">{t.newProduct.typeDownload}</option>
                </select>
              </Field>
              <Field label={t.newProduct.protectionKeyLabel}>
                <select
                  value={productForm.protectionKey}
                  onChange={(e) =>
                    setProductForm({ ...productForm, protectionKey: e.target.value as any })
                  }
                  className={inputClass}
                >
                  <option value="">{t.newProduct.protectionKeyNone}</option>
                  {PROTECTABLE_RESOURCES.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-[10.5px] text-muted-foreground/70">
                  {t.newProduct.protectionKeyHint}
                </p>
              </Field>
              <div className="sm:col-span-2">
                <Field label={t.newProduct.descriptionLabel}>
                  <MriInput
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({ ...productForm, description: e.target.value })
                    }
                    className={inputClass}
                    placeholder={t.newProduct.descriptionPlaceholder}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label={t.newProduct.logoLabel}>
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-background/50">
                      <img
                        src={
                          productLogoFile
                            ? URL.createObjectURL(productLogoFile)
                            : productLogoUrl({ logoUrl: undefined })
                        }
                        alt="Preview da logo"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                      onChange={(e) => setProductLogoFile(e.target.files?.[0] || null)}
                      className="w-full rounded-xl border border-dashed border-border bg-background/50 px-4 py-3 text-[12.5px] text-muted-foreground outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-[12px] file:font-medium file:text-foreground"
                    />
                  </div>
                  <p className="mt-1.5 text-[10.5px] text-muted-foreground/70">
                    {t.newProduct.logoHint}
                  </p>
                </Field>
              </div>
            </div>
            <MriButton
              variant="outline"
              type="submit"
              disabled={creatingProduct}
              className="mt-6 rounded-xl bg-background px-5 py-3 text-[13px] transition-transform hover:scale-[1.02] hover:bg-background hover:text-foreground active:scale-[0.98]"
            >
              {creatingProduct ? t.newProduct.submitBusy : t.newProduct.submitIdle}
            </MriButton>
          </motion.form>

          {/* Criar novo plano */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleCreatePlan}
            className={
              activeTab === "catalog"
                ? "mt-6 rounded-2xl border border-border/50 bg-card/40 p-8"
                : "hidden"
            }
          >
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Plus className="h-4 w-4" /> {t.newPlan.heading}
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={t.newPlan.productLabel}>
                <select
                  value={planForm.productSlug}
                  onChange={(e) => setPlanForm({ ...planForm, productSlug: e.target.value })}
                  className={inputClass}
                  disabled={products.length === 0}
                >
                  {products.length === 0 && (
                    <option value="">{t.newPlan.productEmptyOption}</option>
                  )}
                  {products.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t.newPlan.nameLabel}>
                <MriInput
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  className={inputClass}
                  placeholder={t.newPlan.namePlaceholder}
                />
              </Field>
              <Field label={t.newPlan.amountLabel}>
                <MriInput
                  value={planForm.amount}
                  onChange={(e) => setPlanForm({ ...planForm, amount: e.target.value })}
                  className={inputClass}
                  placeholder="49.00"
                  inputMode="decimal"
                />
              </Field>
              <Field label={t.newPlan.descriptionLabel}>
                <MriInput
                  value={planForm.description}
                  onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                  className={inputClass}
                  placeholder={t.newPlan.descriptionPlaceholder}
                />
              </Field>
              <Field label={t.newPlan.billingNoteLabel}>
                <MriInput
                  value={planForm.billingNote}
                  onChange={(e) => setPlanForm({ ...planForm, billingNote: e.target.value })}
                  className={inputClass}
                  placeholder={t.newPlan.billingNotePlaceholder}
                />
              </Field>
              <Field label={t.newPlan.billingTypeLabel}>
                <select
                  value={planForm.mode}
                  onChange={(e) => setPlanForm({ ...planForm, mode: e.target.value as any })}
                  className={inputClass}
                >
                  <option value="subscription">{t.newPlan.billingTypeSubscription}</option>
                  <option value="payment">{t.newPlan.billingTypePayment}</option>
                </select>
              </Field>
              {planForm.mode === "subscription" && (
                <div className="grid grid-cols-2 gap-3">
                  <Field label={t.newPlan.intervalLabel}>
                    <select
                      value={planForm.intervalUnit}
                      onChange={(e) =>
                        setPlanForm({ ...planForm, intervalUnit: e.target.value as any })
                      }
                      className={inputClass}
                    >
                      <option value="month">{t.newPlan.intervalMonth}</option>
                      <option value="year">{t.newPlan.intervalYear}</option>
                    </select>
                  </Field>
                  <Field label={t.newPlan.intervalCountLabel}>
                    <MriInput
                      value={planForm.intervalCount}
                      onChange={(e) => setPlanForm({ ...planForm, intervalCount: e.target.value })}
                      className={inputClass}
                      inputMode="numeric"
                    />
                  </Field>
                </div>
              )}
              <Field label={t.newPlan.badgeLabel}>
                <MriInput
                  value={planForm.badge}
                  onChange={(e) => setPlanForm({ ...planForm, badge: e.target.value })}
                  className={inputClass}
                  placeholder={t.newPlan.badgePlaceholder}
                />
              </Field>
              <Field label={t.newPlan.sortOrderLabel}>
                <MriInput
                  value={planForm.sortOrder}
                  onChange={(e) => setPlanForm({ ...planForm, sortOrder: e.target.value })}
                  className={inputClass}
                  inputMode="numeric"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label={t.newPlan.featuresLabel}>
                  <textarea
                    value={planForm.features}
                    onChange={(e) => setPlanForm({ ...planForm, features: e.target.value })}
                    className={`${inputClass} min-h-[90px]`}
                    placeholder={t.newPlan.featuresPlaceholder}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label={t.newPlan.fileLabel}>
                  <input
                    type="file"
                    accept=".zip"
                    onChange={(e) => setProductFile(e.target.files?.[0] || null)}
                    className="w-full rounded-xl border border-dashed border-border bg-background/50 px-4 py-3 text-[12.5px] text-muted-foreground outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-[12px] file:font-medium file:text-foreground"
                  />
                  {productFile && (
                    <p className="mt-1.5 text-[11px] text-muted-foreground">
                      {productFile.name} ({(productFile.size / 1024 / 1024).toFixed(2)}MB)
                    </p>
                  )}
                  <p className="mt-1.5 text-[10.5px] text-muted-foreground/70">
                    {t.newPlan.fileHint}
                  </p>
                </Field>
              </div>
            </div>
            <MriButton
              variant="ghost"
              type="submit"
              disabled={creatingPlan || products.length === 0}
              className="mt-6 rounded-xl bg-foreground px-5 py-3 text-[13px] text-background transition-transform hover:scale-[1.02] hover:bg-foreground active:scale-[0.98]"
            >
              {creatingPlan ? t.newPlan.submitBusy : t.newPlan.submitIdle}
            </MriButton>
          </motion.form>

          {/* Subir fonte puro (proteção automática) */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleUploadSourcePackage}
            className={
              activeTab === "catalog"
                ? "mt-6 rounded-2xl border border-border/50 bg-card/40 p-8"
                : "hidden"
            }
          >
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Archive className="h-4 w-4" /> {t.sourcePackages.heading}
            </h2>
            <p className="mt-1 text-[11.5px] text-muted-foreground">
              {t.sourcePackages.description}
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={t.sourcePackages.productLabel}>
                <select
                  value={spProduct}
                  onChange={(e) => setSpProduct(e.target.value as (typeof PROTECTABLE_RESOURCES)[number])}
                  className={inputClass}
                >
                  {PROTECTABLE_RESOURCES.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t.sourcePackages.fileLabel}>
                <input
                  type="file"
                  accept=".zip"
                  onChange={(e) => setSpFile(e.target.files?.[0] || null)}
                  className="w-full rounded-xl border border-dashed border-border bg-background/50 px-4 py-3 text-[12.5px] text-muted-foreground outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-[12px] file:font-medium file:text-foreground"
                />
                {spFile && (
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    {spFile.name} ({(spFile.size / 1024 / 1024).toFixed(2)}MB)
                  </p>
                )}
                <p className="mt-1.5 text-[10.5px] text-muted-foreground/70">
                  {t.sourcePackages.fileHint}
                </p>
              </Field>
            </div>
            <MriButton
              variant="ghost"
              type="submit"
              disabled={uploadingSp}
              className="mt-6 rounded-xl bg-foreground px-5 py-3 text-[13px] text-background transition-transform hover:scale-[1.02] hover:bg-foreground active:scale-[0.98]"
            >
              {uploadingSp ? t.sourcePackages.submitBusy : t.sourcePackages.submitIdle}
            </MriButton>

            <div className="mt-8 border-t border-border/50 pt-6">
              <h3 className="text-[12.5px] font-semibold text-foreground">
                {t.sourcePackages.listHeading}
              </h3>
              {sourcePackages.length === 0 ? (
                <p className="mt-2 text-[12px] text-muted-foreground">{t.sourcePackages.empty}</p>
              ) : (
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-left text-[12px]">
                    <thead>
                      <tr className="text-muted-foreground/70">
                        <th className="pb-2 pr-4 font-medium">{t.sourcePackages.colProduct}</th>
                        <th className="pb-2 pr-4 font-medium">{t.sourcePackages.colFile}</th>
                        <th className="pb-2 pr-4 font-medium">{t.sourcePackages.colUploadedAt}</th>
                        <th className="pb-2 font-medium">{t.sourcePackages.colUploadedBy}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sourcePackages.map((sp) => (
                        <tr key={sp.product} className="border-t border-border/30">
                          <td className="py-2 pr-4 font-medium text-foreground">{sp.product}</td>
                          <td className="py-2 pr-4 text-muted-foreground">{sp.filename}</td>
                          <td className="py-2 pr-4 text-muted-foreground">
                            {formatDate(sp.uploadedAt)}
                          </td>
                          <td className="py-2 text-muted-foreground">
                            {sp.uploadedByDiscordId || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.form>

          {/* Liberar produto de graça */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleCreateGrant}
            className={
              activeTab === "clients"
                ? "mt-6 rounded-2xl border border-border/50 bg-card/40 p-8"
                : "hidden"
            }
          >
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Gift className="h-4 w-4" /> {t.grants.heading}
            </h2>
            <p className="mt-1 text-[11.5px] text-muted-foreground">{t.grants.description}</p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={t.grants.discordIdLabel}>
                <MriInput
                  value={grantForm.discordId}
                  onChange={(e) => setGrantForm({ ...grantForm, discordId: e.target.value })}
                  className={inputClass}
                  placeholder={t.grants.discordIdPlaceholder}
                />
              </Field>
              <Field label={t.grants.planLabel}>
                <select
                  value={grantForm.plan}
                  onChange={(e) => setGrantForm({ ...grantForm, plan: e.target.value })}
                  className={inputClass}
                  disabled={plans.length === 0}
                >
                  {plans.length === 0 && <option value="">{t.grants.planEmptyOption}</option>}
                  {plans.map((p) => (
                    <option key={p.code} value={p.code}>
                      {products.find((prod) => prod.slug === p.productSlug)?.name || p.productSlug}{" "}
                      — {p.name}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label={t.grants.serverNameLabel}>
                  <MriInput
                    value={grantForm.serverName}
                    onChange={(e) => setGrantForm({ ...grantForm, serverName: e.target.value })}
                    className={inputClass}
                    placeholder={t.grants.serverNamePlaceholder}
                  />
                </Field>
              </div>
            </div>
            <MriButton
              variant="outline"
              type="submit"
              disabled={grantingFree || plans.length === 0}
              className="mt-6 rounded-xl bg-background px-5 py-3 text-[13px] transition-transform hover:scale-[1.02] hover:bg-background hover:text-foreground active:scale-[0.98]"
            >
              {grantingFree ? t.grants.submitBusy : t.grants.submitIdle}
            </MriButton>
            {grantResult?.finalizeUrl && (
              <MriCard className="mt-4 border-border/50 bg-background/50">
                <p className="text-[12px] text-muted-foreground">{t.grants.resultHint}</p>
                <div className="mt-2 flex items-center gap-2">
                  <MriInput
                    readOnly
                    value={grantResult.finalizeUrl}
                    className="rounded-lg bg-background px-3 py-2 text-[11.5px] text-foreground"
                  />
                  <MriButton
                    variant="outline"
                    type="button"
                    onClick={() => navigator.clipboard.writeText(grantResult.finalizeUrl!)}
                    className="shrink-0 rounded-lg bg-background px-3 py-2 text-[11.5px] hover:bg-elevated hover:text-foreground"
                  >
                    <Copy className="h-3.5 w-3.5" /> {t.grants.copyButton}
                  </MriButton>
                </div>
              </MriCard>
            )}
          </motion.form>

          {/* Gerenciamento de licenças */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSearchLicense}
            className={
              activeTab === "clients"
                ? "mt-6 rounded-2xl border border-border/50 bg-card/40 p-8"
                : "hidden"
            }
          >
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <KeyRound className="h-4 w-4" /> {t.licenses.heading}
            </h2>
            <p className="mt-1 text-[11.5px] text-muted-foreground">{t.licenses.description}</p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={t.licenses.discordIdLabel}>
                <MriInput
                  value={licenseSearchDiscordId}
                  onChange={(e) => setLicenseSearchDiscordId(e.target.value)}
                  className={inputClass}
                  placeholder={t.licenses.discordIdPlaceholder}
                />
              </Field>
              <Field label={t.licenses.licenseKeyLabel}>
                <MriInput
                  value={licenseSearchKey}
                  onChange={(e) => setLicenseSearchKey(e.target.value)}
                  className={`${inputClass} font-mono`}
                  placeholder={t.licenses.licenseKeyPlaceholder}
                />
              </Field>
            </div>
            <MriButton
              variant="outline"
              type="submit"
              disabled={searchingLicense}
              className="mt-6 rounded-xl bg-background px-5 py-3 text-[13px] transition-transform hover:scale-[1.02] hover:bg-background hover:text-foreground active:scale-[0.98]"
            >
              <Search className="h-3.5 w-3.5" />{" "}
              {searchingLicense ? t.licenses.searchBusy : t.licenses.searchIdle}
            </MriButton>

            {licenseSearched && !licenseResult && (
              <p className="mt-4 text-[12px] text-muted-foreground">{t.licenses.noResults}</p>
            )}

            {licenseResult && (
              <div className="mt-6 space-y-5 border-t border-border/40 pt-5">
                <div>
                  <h3 className="text-[13px] font-semibold text-foreground">
                    {t.licenses.licensesHeading}
                  </h3>
                  <div className="mt-3 space-y-2">
                    {licenseResult.licenses.map((l) => (
                      <MriCard
                        key={l._id}
                        className="flex flex-wrap items-center justify-between gap-3 border-border/40 bg-background/40 px-4 py-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[12.5px] font-semibold text-foreground">
                              {l.key}
                            </span>
                            <span
                              className={`rounded px-1.5 py-0.5 text-[10px] ${
                                l.status === "active"
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-red-500/10 text-red-400"
                              }`}
                            >
                              {l.status}
                            </span>
                          </div>
                          <p className="mt-1 text-[11.5px] text-muted-foreground">
                            {t.licenses.planLabel}: {l.plan || "—"} · {t.licenses.expiresLabel}:{" "}
                            {formatDate(l.expiresAt, lang)}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {l.status !== "active" && (
                            <MriButton
                              variant="outline"
                              size="sm"
                              disabled={busyLicenseId === l._id}
                              onClick={() => handleChangeLicenseStatus(l, "active")}
                              className="rounded-lg bg-background hover:bg-elevated hover:text-foreground"
                            >
                              {t.licenses.setActive}
                            </MriButton>
                          )}
                          {l.status !== "suspended" && (
                            <MriButton
                              variant="outline"
                              size="sm"
                              disabled={busyLicenseId === l._id}
                              onClick={() => handleChangeLicenseStatus(l, "suspended")}
                              className="rounded-lg bg-background hover:bg-elevated hover:text-foreground"
                            >
                              {t.licenses.setSuspended}
                            </MriButton>
                          )}
                          {l.status !== "revoked" && (
                            <MriButton
                              variant="danger-outline"
                              size="sm"
                              disabled={busyLicenseId === l._id}
                              onClick={() => handleChangeLicenseStatus(l, "revoked")}
                              className="rounded-lg border-red-500/30 bg-red-500/5 hover:bg-red-500/10"
                            >
                              <ShieldAlert className="h-3.5 w-3.5" /> {t.licenses.setRevoked}
                            </MriButton>
                          )}
                        </div>
                      </MriCard>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[13px] font-semibold text-foreground">
                    {t.licenses.serversHeading}
                  </h3>
                  <div className="mt-3 space-y-3">
                    {licenseResult.servers.map((s) => (
                      <MriCard key={s._id} className="border-border/40 bg-background/40 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="text-[13px] font-semibold text-foreground">
                              {s.name}
                            </span>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                              {t.licenses.serverIpLabel}: <span className="font-mono">{s.ip}</span>
                              {" · "}
                              {t.licenses.authStatusLabel}:{" "}
                              <span
                                className={
                                  s.authStatus === "AUTHORIZED"
                                    ? "text-emerald-400"
                                    : "text-red-400"
                                }
                              >
                                {s.authStatus}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Field label={t.licenses.authorizedIpsLabel}>
                            <textarea
                              value={ipEditsByServer[s._id] ?? ""}
                              onChange={(e) =>
                                setIpEditsByServer((prev) => ({ ...prev, [s._id]: e.target.value }))
                              }
                              className={`${inputClass} min-h-[70px] font-mono`}
                              placeholder={t.licenses.authorizedIpsPlaceholder}
                            />
                          </Field>
                          <p className="mt-1.5 text-[10.5px] text-muted-foreground/70">
                            {t.licenses.authorizedIpsHint}
                          </p>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <MriButton
                            variant="outline"
                            size="sm"
                            disabled={busyServerId === s._id}
                            onClick={() => handleSaveServerIps(s._id, ipEditsByServer[s._id] ?? "")}
                            className="rounded-lg bg-background hover:bg-elevated hover:text-foreground"
                          >
                            <Save className="h-3.5 w-3.5" />{" "}
                            {busyServerId === s._id ? t.licenses.savingIps : t.licenses.saveIps}
                          </MriButton>
                          <MriButton
                            variant="ghost"
                            size="sm"
                            disabled={busyServerId === s._id}
                            onClick={() => handleSaveServerIps(s._id, "")}
                            className="rounded-lg"
                          >
                            {t.licenses.clearIps}
                          </MriButton>
                          <MriButton
                            variant="danger-outline"
                            size="sm"
                            disabled={busyDeleteServerId === s._id}
                            onClick={() => handleDeleteServer(s)}
                            className="ml-auto rounded-lg border-red-500/30 bg-red-500/5 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />{" "}
                            {busyDeleteServerId === s._id
                              ? t.licenses.deletingServer
                              : t.licenses.deleteServer}
                          </MriButton>
                        </div>
                      </MriCard>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.form>

          {/* Cupons */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleCreateCoupon}
            className={
              activeTab === "coupons"
                ? "mt-6 rounded-2xl border border-border/50 bg-card/40 p-8"
                : "hidden"
            }
          >
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Ticket className="h-4 w-4" /> {t.coupons.heading}
            </h2>
            <p className="mt-1 text-[11.5px] text-muted-foreground">{t.coupons.description}</p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={t.coupons.codeLabel}>
                <MriInput
                  value={couponForm.code}
                  onChange={(e) =>
                    setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })
                  }
                  className={`${inputClass} font-mono uppercase`}
                  placeholder={t.coupons.codePlaceholder}
                />
              </Field>
              <Field label={t.coupons.restrictPlanLabel}>
                <select
                  value={couponForm.planCode}
                  onChange={(e) => setCouponForm({ ...couponForm, planCode: e.target.value })}
                  className={inputClass}
                >
                  <option value="">{t.coupons.anyPlan}</option>
                  {plans.map((p) => (
                    <option key={p.code} value={p.code}>
                      {products.find((prod) => prod.slug === p.productSlug)?.name || p.productSlug}{" "}
                      — {p.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t.coupons.discountTypeLabel}>
                <select
                  value={couponForm.discountType}
                  onChange={(e) =>
                    setCouponForm({ ...couponForm, discountType: e.target.value as any })
                  }
                  className={inputClass}
                >
                  <option value="percent">{t.coupons.discountTypePercent}</option>
                  <option value="amount">{t.coupons.discountTypeAmount}</option>
                </select>
              </Field>
              {couponForm.discountType === "percent" ? (
                <Field label={t.coupons.percentLabel}>
                  <MriInput
                    value={couponForm.percentOff}
                    onChange={(e) => setCouponForm({ ...couponForm, percentOff: e.target.value })}
                    className={inputClass}
                    inputMode="numeric"
                    placeholder="100"
                  />
                </Field>
              ) : (
                <Field label={t.coupons.amountLabel}>
                  <MriInput
                    value={couponForm.amountOff}
                    onChange={(e) => setCouponForm({ ...couponForm, amountOff: e.target.value })}
                    className={inputClass}
                    inputMode="decimal"
                    placeholder="49.00"
                  />
                </Field>
              )}
              <Field label={t.coupons.durationLabel}>
                <select
                  value={couponForm.duration}
                  onChange={(e) =>
                    setCouponForm({ ...couponForm, duration: e.target.value as any })
                  }
                  className={inputClass}
                >
                  <option value="once">{t.coupons.durationOnce}</option>
                  <option value="repeating">{t.coupons.durationRepeating}</option>
                  <option value="forever">{t.coupons.durationForever}</option>
                </select>
              </Field>
              {couponForm.duration === "repeating" && (
                <Field label={t.coupons.durationMonthsLabel}>
                  <MriInput
                    value={couponForm.durationInMonths}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, durationInMonths: e.target.value })
                    }
                    className={inputClass}
                    inputMode="numeric"
                  />
                </Field>
              )}
              <Field label={t.coupons.maxRedemptionsLabel}>
                <MriInput
                  value={couponForm.maxRedemptions}
                  onChange={(e) => setCouponForm({ ...couponForm, maxRedemptions: e.target.value })}
                  className={inputClass}
                  inputMode="numeric"
                  placeholder={t.coupons.maxRedemptionsPlaceholder}
                />
              </Field>
              <Field label={t.coupons.expiresAtLabel}>
                <MriInput
                  type="date"
                  value={couponForm.expiresAt}
                  onChange={(e) => setCouponForm({ ...couponForm, expiresAt: e.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>
            <MriButton
              variant="ghost"
              type="submit"
              disabled={creatingCoupon}
              className="mt-6 rounded-xl bg-foreground px-5 py-3 text-[13px] text-background transition-transform hover:scale-[1.02] hover:bg-foreground active:scale-[0.98]"
            >
              {creatingCoupon ? t.coupons.submitBusy : t.coupons.submitIdle}
            </MriButton>
          </motion.form>

          {coupons.length > 0 && activeTab === "coupons" && (
            <MriCard className="mt-6 border-border/50 bg-card/40 p-8">
              <h3 className="text-[14px] font-semibold text-foreground">{t.coupons.listHeading}</h3>
              <div className="mt-4 space-y-2">
                {coupons.map((c) => (
                  <MriCard
                    key={c.code}
                    className={`flex flex-wrap items-center justify-between gap-3 px-4 py-3 ${c.active ? "border-border/40 bg-background/40" : "border-border/20 bg-background/20 opacity-60"}`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[13px] font-semibold text-foreground">
                          {c.code}
                        </span>
                        {!c.active && (
                          <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] text-red-400">
                            {t.coupons.disabledTag}
                          </span>
                        )}
                        {c.planCode && (
                          <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                            {c.planCode}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[11.5px] text-muted-foreground">
                        {c.percentOff
                          ? t.coupons.percentOffSuffix(c.percentOff)
                          : t.coupons.amountOffSuffix(
                              (c.amountOff || 0).toFixed(2).replace(".", ","),
                            )}
                        {" · "}
                        {c.duration === "once"
                          ? t.coupons.durationOnceShort
                          : c.duration === "forever"
                            ? t.coupons.durationForeverShort
                            : t.coupons.durationMonthsShort(c.durationInMonths || 1)}
                        {c.maxRedemptions ? t.coupons.maxUsesSuffix(c.maxRedemptions) : ""}
                        {c.expiresAt ? t.coupons.expiresSuffix(formatDate(c.expiresAt, lang)) : ""}
                      </p>
                    </div>
                    {c.active && (
                      <MriButton
                        variant="danger-outline"
                        onClick={() => handleDeactivateCoupon(c)}
                        disabled={busyCouponCode === c.code}
                        className="border-red-500/30 bg-red-500/5 hover:bg-red-500/10"
                      >
                        <Power className="h-3.5 w-3.5" /> {t.coupons.deactivate}
                      </MriButton>
                    )}
                  </MriCard>
                ))}
              </div>
            </MriCard>
          )}

          {/* Encomendas de sistema */}
          <div className={activeTab === "orders" ? "mt-6" : "hidden"}>
            <div className="rounded-2xl border border-border/50 bg-card/40 p-8">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> {t.orders.heading}
              </h2>
              <p className="mt-1 text-[11.5px] text-muted-foreground">{t.orders.description}</p>

              {systemOrders.length === 0 ? (
                <p className="mt-8 text-center text-[13px] text-muted-foreground">
                  {t.orders.empty}
                </p>
              ) : (
                <div className="mt-6 space-y-4">
                  {systemOrders.map((order) => {
                    const requester = typeof order.userId === "object" ? order.userId : null;
                    const email = requester?.email;
                    const busy = busyOrderId === order._id;
                    return (
                      <MriCard key={order._id} className="border-border/40 bg-background/40 p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-[13.5px] font-semibold text-foreground">
                              {order.name}
                              {order.company ? ` · ${order.company}` : ""}
                            </p>
                            <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                              {t.orders.types[order.projectType]}
                              {order.phone ? ` · ${order.phone}` : ""}
                              {order.budgetRange ? ` · ${order.budgetRange}` : ""}
                              {order.timeline ? ` · ${order.timeline}` : ""}
                            </p>
                            <p className="mt-0.5 font-mono text-[10.5px] text-muted-foreground/70">
                              {order.requestId}
                            </p>
                          </div>
                          <select
                            value={order.status}
                            disabled={busy}
                            onChange={(e) =>
                              handleUpdateOrderStatus(
                                order,
                                e.target.value as SystemOrderItem["status"],
                              )
                            }
                            className={`${inputClass} w-auto shrink-0 px-3 py-2 text-[12px]`}
                          >
                            {(Object.keys(t.orders.statuses) as SystemOrderItem["status"][]).map(
                              (s) => (
                                <option key={s} value={s}>
                                  {t.orders.statuses[s]}
                                </option>
                              ),
                            )}
                          </select>
                        </div>

                        <p className="mt-3 whitespace-pre-wrap rounded-lg bg-elevated/50 p-3 text-[12.5px] leading-relaxed text-muted-foreground">
                          {order.description}
                        </p>

                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[200px_1fr]">
                          <Field label={t.orders.priceLabel}>
                            <div className="flex items-center gap-2">
                              <MriInput
                                value={
                                  orderPriceEdits[order._id] ??
                                  (order.quotedPrice?.toString() || "")
                                }
                                onChange={(e) =>
                                  setOrderPriceEdits((prev) => ({
                                    ...prev,
                                    [order._id]: e.target.value,
                                  }))
                                }
                                className={inputClass}
                                inputMode="decimal"
                                placeholder={t.orders.pricePlaceholder}
                              />
                              <MriButton
                                variant="outline"
                                type="button"
                                disabled={busy}
                                onClick={() => handleSaveOrderPrice(order)}
                                className="shrink-0 rounded-lg bg-background px-3 py-2 text-[11.5px] hover:bg-elevated hover:text-foreground"
                              >
                                <Save className="h-3.5 w-3.5" />
                              </MriButton>
                            </div>
                          </Field>
                          <Field label={t.orders.notesLabel}>
                            <div className="flex items-center gap-2">
                              <MriInput
                                value={orderNotesEdits[order._id] ?? (order.internalNotes || "")}
                                onChange={(e) =>
                                  setOrderNotesEdits((prev) => ({
                                    ...prev,
                                    [order._id]: e.target.value,
                                  }))
                                }
                                className={inputClass}
                                placeholder={t.orders.notesPlaceholder}
                              />
                              <MriButton
                                variant="outline"
                                type="button"
                                disabled={busy}
                                onClick={() => handleSaveOrderNotes(order)}
                                className="shrink-0 rounded-lg bg-background px-3 py-2 text-[11.5px] hover:bg-elevated hover:text-foreground"
                              >
                                <Save className="h-3.5 w-3.5" />
                              </MriButton>
                            </div>
                          </Field>
                        </div>

                        <div className="mt-4 border-t border-border/40 pt-4">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                              {t.orders.messagesHeading}
                            </p>
                            {order.messages.length > 0 &&
                              order.messages[order.messages.length - 1].from === "client" && (
                                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10.5px] font-medium text-amber-400">
                                  {t.orders.awaitingReply}
                                </span>
                              )}
                          </div>
                          {order.messages.length === 0 ? (
                            <p className="mt-2 text-[12px] text-muted-foreground">
                              {t.orders.noMessages}
                            </p>
                          ) : (
                            <div className="mt-2 space-y-2">
                              {order.messages.map((m, idx) => (
                                <div
                                  key={idx}
                                  className={
                                    m.from === "client"
                                      ? "rounded-lg border border-amber-500/20 bg-amber-500/[0.06] p-3"
                                      : "rounded-lg bg-elevated/60 p-3"
                                  }
                                >
                                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    {m.from === "client" ? t.orders.fromClient : t.orders.fromCeo}
                                  </p>
                                  <p className="mt-1 whitespace-pre-wrap text-[12.5px] text-foreground/90">
                                    {m.body}
                                  </p>
                                  <p className="mt-1 text-[10.5px] text-muted-foreground">
                                    {formatDate(m.sentAt, lang)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="mt-3">
                            <Field label={t.orders.replyLabel}>
                              <textarea
                                value={orderReplyDrafts[order._id] || ""}
                                onChange={(e) =>
                                  setOrderReplyDrafts((prev) => ({
                                    ...prev,
                                    [order._id]: e.target.value,
                                  }))
                                }
                                className={`${inputClass} min-h-[80px]`}
                                placeholder={t.orders.replyPlaceholder}
                              />
                            </Field>
                            {email ? (
                              <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                <Mail className="h-3 w-3" /> {t.orders.sendingTo(email)}
                              </p>
                            ) : (
                              <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-red-400">
                                <AlertCircle className="h-3 w-3" /> {t.orders.noEmail}
                              </p>
                            )}
                            <MriButton
                              variant="outline"
                              type="button"
                              disabled={!email || sendingReplyOrderId === order._id}
                              onClick={() => handleSendOrderReply(order)}
                              className="mt-2 rounded-lg bg-background px-4 py-2 text-[12px] hover:bg-elevated hover:text-foreground"
                            >
                              <Send className="h-3.5 w-3.5" />{" "}
                              {sendingReplyOrderId === order._id
                                ? t.orders.sendingReply
                                : t.orders.sendReply}
                            </MriButton>
                          </div>
                        </div>
                      </MriCard>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Lista de produtos + planos */}
          <div className={activeTab === "catalog" ? "" : "hidden"}>
            <div className="mt-10 flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">{t.catalog.heading}</h2>
              <button
                onClick={loadAll}
                className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />{" "}
                {t.catalog.refresh}
              </button>
            </div>

            <div className="mt-4 space-y-8">
              {products.length === 0 && !loading && (
                <p className="text-sm text-muted-foreground">{t.catalog.noProducts}</p>
              )}
              {products.map((product) => (
                <div key={product.slug}>
                  <div className="flex flex-wrap items-center justify-between gap-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <img
                        src={productLogoUrl(product)}
                        alt={product.name}
                        className="h-6 w-6 rounded-md border border-border object-cover"
                      />
                      <h3 className="text-[14px] font-semibold text-foreground">{product.name}</h3>
                      <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                        {product.slug}
                      </span>
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {product.type === "anticheat"
                          ? t.catalog.typeAnticheat
                          : t.catalog.typeDownload}
                      </span>
                      {!product.active && (
                        <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] text-red-400">
                          {t.catalog.inactive}
                        </span>
                      )}
                    </div>
                    <MriButton
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleProductActive(product)}
                      disabled={busyCode === product.slug}
                      className="rounded-lg bg-background hover:bg-elevated hover:text-foreground"
                    >
                      <Power className="h-3.5 w-3.5" />{" "}
                      {product.active ? t.catalog.deactivateProduct : t.catalog.reactivateProduct}
                    </MriButton>
                  </div>

                  <div className="mt-3 space-y-3">
                    {plans.filter((pl) => pl.productSlug === product.slug).length === 0 && (
                      <p className="text-[12px] text-muted-foreground">{t.catalog.noPlans}</p>
                    )}
                    {plans
                      .filter((pl) => pl.productSlug === product.slug)
                      .map((plan) => (
                        <MriCard
                          key={plan.code}
                          className={`p-6 ${plan.active ? "border-border/50 bg-card/40" : "border-border/30 bg-card/10 opacity-60"}`}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-[15px] font-semibold text-foreground">
                                  {plan.name}
                                </h4>
                                <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                                  {plan.code}
                                </span>
                                {!plan.active && (
                                  <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] text-red-400">
                                    {t.catalog.archived}
                                  </span>
                                )}
                                {plan.hasDownload && (
                                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-400">
                                    {plan.downloadFileName || t.catalog.hasFile}
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-[12.5px] text-muted-foreground max-w-lg">
                                {plan.description}
                              </p>
                              <p className="mt-1 text-[11px] text-muted-foreground/70">
                                {plan.mode === "subscription"
                                  ? t.catalog.billingInterval(
                                      plan.intervalCount,
                                      (plan.intervalUnit as "year" | "month") ?? "month",
                                    )
                                  : t.catalog.oneTimePayment}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-foreground">
                                R$ {plan.amount.toFixed(2).replace(".", ",")}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {t.catalog.priceIdLabel(plan.stripePriceId || "—")}
                              </p>
                            </div>
                          </div>

                          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/40 pt-5">
                            <MriInput
                              value={priceEdits[plan.code] || ""}
                              onChange={(e) =>
                                setPriceEdits((prev) => ({ ...prev, [plan.code]: e.target.value }))
                              }
                              placeholder={t.catalog.newPricePlaceholder}
                              inputMode="decimal"
                              className="w-40 rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition-colors focus:border-foreground/40"
                            />
                            <MriButton
                              variant="outline"
                              onClick={() => handleUpdatePrice(plan)}
                              disabled={busyCode === plan.code}
                              className="rounded-lg bg-background hover:bg-elevated hover:text-foreground"
                            >
                              <Save className="h-3.5 w-3.5" /> {t.catalog.updatePrice}
                            </MriButton>
                            <MriButton
                              variant="outline"
                              onClick={() => handleToggleActive(plan)}
                              disabled={busyCode === plan.code}
                              className="rounded-lg bg-background hover:bg-elevated hover:text-foreground"
                            >
                              <Power className="h-3.5 w-3.5" />{" "}
                              {plan.active ? t.catalog.deactivate : t.catalog.reactivate}
                            </MriButton>
                            <MriButton
                              variant="outline"
                              onClick={() => handleToggleEditDetails(plan)}
                              className="rounded-lg bg-background hover:bg-elevated hover:text-foreground"
                            >
                              <Pencil className="h-3.5 w-3.5" />{" "}
                              {editingPlanCode === plan.code
                                ? t.catalog.closeEdit
                                : t.catalog.editDetails}
                            </MriButton>
                            <MriButton
                              variant="danger-outline"
                              onClick={() => handleArchive(plan)}
                              disabled={busyCode === plan.code}
                              className="bg-red-500/5 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> {t.catalog.archive}
                            </MriButton>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/40 pt-3">
                            <p className="w-full text-[11px] text-muted-foreground">
                              {plan.hasDownload
                                ? t.catalog.currentFile(plan.downloadFileName || "produto.zip")
                                : t.catalog.noFileYet}
                            </p>
                            <input
                              type="file"
                              accept=".zip"
                              onChange={(e) =>
                                setPlanFileEdits((prev) => ({
                                  ...prev,
                                  [plan.code]: e.target.files?.[0] || null,
                                }))
                              }
                              className="max-w-full rounded-xl border border-dashed border-border bg-background/50 px-3 py-2 text-[11.5px] text-muted-foreground outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-[12px] file:font-medium file:text-foreground"
                            />
                            <MriButton
                              variant="outline"
                              onClick={() => handleUpdateFile(plan)}
                              disabled={
                                uploadingFileCode === plan.code || !planFileEdits[plan.code]
                              }
                              className="rounded-lg bg-background hover:bg-elevated hover:text-foreground"
                            >
                              <Upload className="h-3.5 w-3.5" />{" "}
                              {uploadingFileCode === plan.code
                                ? t.catalog.uploading
                                : plan.hasDownload
                                  ? t.catalog.replaceFile
                                  : t.catalog.uploadFile}
                            </MriButton>
                          </div>

                          {editingPlanCode === plan.code && planDetailsEdits[plan.code] && (
                            <div className="mt-3 border-t border-border/40 pt-4">
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <Field label={t.catalog.editNameLabel}>
                                  <MriInput
                                    value={planDetailsEdits[plan.code].name}
                                    onChange={(e) =>
                                      setPlanDetailsEdits((prev) => ({
                                        ...prev,
                                        [plan.code]: { ...prev[plan.code], name: e.target.value },
                                      }))
                                    }
                                    className={inputClass}
                                  />
                                </Field>
                                <Field label={t.catalog.editBillingNoteLabel}>
                                  <MriInput
                                    value={planDetailsEdits[plan.code].billingNote}
                                    onChange={(e) =>
                                      setPlanDetailsEdits((prev) => ({
                                        ...prev,
                                        [plan.code]: {
                                          ...prev[plan.code],
                                          billingNote: e.target.value,
                                        },
                                      }))
                                    }
                                    className={inputClass}
                                  />
                                </Field>
                                <div className="sm:col-span-2">
                                  <Field label={t.catalog.editDescriptionLabel}>
                                    <MriInput
                                      value={planDetailsEdits[plan.code].description}
                                      onChange={(e) =>
                                        setPlanDetailsEdits((prev) => ({
                                          ...prev,
                                          [plan.code]: {
                                            ...prev[plan.code],
                                            description: e.target.value,
                                          },
                                        }))
                                      }
                                      className={inputClass}
                                    />
                                  </Field>
                                </div>
                                <Field label={t.catalog.editBadgeLabel}>
                                  <MriInput
                                    value={planDetailsEdits[plan.code].badge}
                                    onChange={(e) =>
                                      setPlanDetailsEdits((prev) => ({
                                        ...prev,
                                        [plan.code]: { ...prev[plan.code], badge: e.target.value },
                                      }))
                                    }
                                    className={inputClass}
                                    placeholder={t.newPlan.badgePlaceholder}
                                  />
                                </Field>
                                <Field label={t.catalog.editSortOrderLabel}>
                                  <MriInput
                                    value={planDetailsEdits[plan.code].sortOrder}
                                    onChange={(e) =>
                                      setPlanDetailsEdits((prev) => ({
                                        ...prev,
                                        [plan.code]: {
                                          ...prev[plan.code],
                                          sortOrder: e.target.value,
                                        },
                                      }))
                                    }
                                    className={inputClass}
                                    inputMode="numeric"
                                  />
                                </Field>
                                <div className="sm:col-span-2">
                                  <Field label={t.catalog.editFeaturesLabel}>
                                    <textarea
                                      value={planDetailsEdits[plan.code].features}
                                      onChange={(e) =>
                                        setPlanDetailsEdits((prev) => ({
                                          ...prev,
                                          [plan.code]: {
                                            ...prev[plan.code],
                                            features: e.target.value,
                                          },
                                        }))
                                      }
                                      className={`${inputClass} min-h-[90px]`}
                                    />
                                  </Field>
                                </div>
                              </div>
                              <MriButton
                                variant="ghost"
                                onClick={() => handleSaveDetails(plan)}
                                disabled={savingDetailsCode === plan.code}
                                className="mt-4 rounded-lg bg-foreground px-4 py-2.5 text-[12px] text-background hover:bg-foreground hover:opacity-90"
                              >
                                <Save className="h-3.5 w-3.5" />{" "}
                                {savingDetailsCode === plan.code
                                  ? t.catalog.saving
                                  : t.catalog.saveChanges}
                              </MriButton>
                            </div>
                          )}
                        </MriCard>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}
