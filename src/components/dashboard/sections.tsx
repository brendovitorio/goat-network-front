import { useState, useEffect } from "react";
import type React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Check,
  ChevronDown,
  Download,
  Search,
  Shield,
  X,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  CircleDollarSign,
  Sparkles,
  Users,
  Bug,
  Activity,
  Server,
  ShieldCheck,
  Zap,
  AlertTriangle,
  Database,
  Trash2,
  Plus,
} from "lucide-react";
import { Panel, Stat, Table, Tag, TAG_TONE_CLASS } from "./shell";
import type { TagTone } from "./shell";
import { PROTECTION_MODULE_FIELDS } from "@/lib/protectionFields";
import { CORE_FIELD_GROUPS, PUNISHMENT_FIELDS, STAFF_BYPASS_LEVELS } from "@/lib/coreAndPunishmentFields";
import { MriButton } from "@/components/ui/MriButton";
import { MriCard } from "@/components/ui/MriCard";
import { MriSearchInput } from "@/components/ui/MriSearchInput";
import { MriInput, MriTextarea } from "@/components/ui/MriInput";
import { MriToggle } from "@/components/ui/MriToggle";
import { MriPunishmentSelect } from "@/components/ui/MriPunishmentSelect";
import { toneForAction } from "@/components/ui/mri-badge-variants";
import { api, ServerStatus, LicenseItem, resolveLicenseForServer } from "@/lib/goat-api";
import type { AiConfig as AiConfigType, AiAnalysis as AiAnalysisType, AiDecision as AiDecisionType } from "@/lib/goat-api";
import { cn } from "@/lib/utils";
import { VolumeChart } from "@/goatdash/VolumeChart";
import { useDialog } from "./Dialog";
import { downloadStyledExcel, severityFillColor, EXCEL_COLORS } from "@/lib/exportCsv";
import { SecurityReportModal } from "./SecurityReportModal";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Lang } from "@/i18n/LanguageContext";
import { formatDate, formatDateTime } from "@/lib/format";
import { statusLabel } from "@/lib/status-labels";

type Copy = {
  common: {
    exportUnavailable: string;
    generatingSheet: string;
    exportExcel: string;
  };
  home: {
    kicker: string;
    title: string;
    subtitle: string;
    generateReport: string;
    loading: string;
    noServer: string;
    statPlayersOnline: string;
    realtimeUpdated: string;
    disconnected: string;
    statDetections: string;
    interceptedActionsSuffix: string;
    statActiveBans: string;
    registeredOnServerSuffix: string;
    statHealth: string;
    healthOk: string;
    healthDisconnected: string;
    eventsTitle: string;
    eventsDesc: string;
    openLogs: string;
    rangeTooltip: string;
    last24h: string;
    latestDetectionsTitle: string;
    latestDetectionsDesc: string;
    viewAll: string;
    noRecentDetections: string;
    moduleStatusTitle: string;
    moduleStatusDesc: string;
    settingsLink: string;
    active: string;
    inactive: string;
    unknownPlayer: string;
    unknownReason: string;
    modules: { name: string; desc: string }[];
  };
  players: {
    panelTitle: string;
    panelDesc: (n: number) => string;
    searchPlaceholder: string;
    banDialogTitle: string;
    banDialogLabel: (name: string) => string;
    banDialogPlaceholder: string;
    banConfirm: string;
    banErrorFallback: string;
    exportTitle: string;
    unknownName: string;
    invalidMethod: string;
    colId: string;
    colName: string;
    colAcId: string;
    colPing: string;
    colSteam: string;
    colDiscord: string;
    colHealth: string;
    colArmor: string;
    colStatus: string;
    colAction: string;
    banButton: string;
  };
  detections: {
    panelTitle: string;
    panelDesc: string;
    searchPlaceholder: string;
    unknownPlayer: string;
    unknownReason: string;
    exportTitle: string;
    colId: string;
    colPlayer: string;
    colReason: string;
    colTime: string;
    colEvidence: string;
    colConfidence: string;
    colPunishment: string;
    filesCountSuffix: (n: number) => string;
    kpiTotal: string;
    kpiBans: string;
    kpiKicks: string;
    kpiFlags: string;
    breakdownTitle: string;
  };
  evidence: {
    statRecords: string;
    statRecordsHint: string;
    statScreenshots: string;
    statScreenshotsHint: string;
    statReplays: string;
    statReplaysHint: string;
    panelTitle: string;
    panelDesc: string;
    searchPlaceholder: string;
    evidenceAlt: string;
    unknownReason: string;
    unknownPlayer: string;
    noScreenshot: string;
    filesCountSuffix: (n: number) => string;
    open: string;
    noImage: string;
  };
  bans: {
    errorRevokeFallback: string;
    newBanTitle: string;
    identifierLabel: string;
    identifierPlaceholder: string;
    reasonLabel: string;
    reasonPlaceholder: string;
    reasonDefault: string;
    confirmBan: string;
    errorCreateFallback: string;
    titleGlobal: string;
    titleLocal: string;
    descGlobal: string;
    descLocal: string;
    banIdentifierButton: string;
    searchPlaceholder: string;
    colIdentifier: string;
    colReason: string;
    colBy: string;
    colDate: string;
    colAction: string;
    revoke: string;
    exportTitleGlobal: string;
    exportTitleLocal: string;
  };
  protections: {
    panelTitle: string;
    panelDesc: string;
    searchPlaceholder: string;
    toggleAria: (name: string) => string;
    triggersSuffix: (n: number) => string;
    groups: Record<string, string>;
  };
  events: {
    panelTitle: string;
    panelDesc: string;
    searchPlaceholder: string;
    empty: string;
    exportTitle: string;
    colDate: string;
    colType: string;
    colSeverity: string;
    colMessage: string;
  };
  acId: {
    statRegistered: string;
    statRegisteredHint: string;
    statLinkedAccounts: string;
    statBlocked: string;
    panelTitle: string;
    panelDesc: string;
    searchPlaceholder: string;
    empty: string;
    colAcId: string;
    colPlayer: string;
    colSessions: string;
    colAlerts: string;
    colStatus: string;
    unknownPlayer: string;
    exportTitle: string;
  };
  wall: {
    errorPublishFallback: string;
    newNoteTitle: string;
    fieldTitleLabel: string;
    fieldTitlePlaceholder: string;
    fieldContentLabel: string;
    fieldContentPlaceholder: string;
    publish: string;
    panelTitle: string;
    panelDesc: string;
    newNoteButton: string;
    empty: string;
    delete: string;
  };
  wipe: {
    maintStatusPending: string;
    maintStatusDelivered: string;
    maintStatusExecuted: string;
    maintStatusFailed: string;
    opOrphanTitle: string;
    opOrphanDesc: string;
    opSessionTitle: string;
    opSessionDesc: string;
    errorMaintenanceFallback: string;
    confirmWipeCacheTitle: string;
    confirmWipeCacheDesc: string;
    confirmWipeCacheLabel: string;
    errorWipeCacheFallback: string;
    errorRequestEvidenceFallback: string;
    confirmApproveTitle: string;
    confirmApproveDesc: string;
    confirmApproveLabel: string;
    errorApproveFallback: string;
    panelTitle: string;
    panelDesc: string;
    cacheCardTitle: string;
    cacheCardDesc: string;
    cacheCardLastRun: (n: number) => string;
    run: string;
    running: string;
    totalWipeTitle: string;
    irreversible: string;
    totalWipeDesc: string;
    pendingNotice: string;
    pending: string;
    requestWipe: string;
    pendingApprovalsTitle: string;
    pendingApprovalsDesc: string;
    requestedBy: (name: string) => string;
    approve: string;
  };
  staff: {
    addMemberTitle: string;
    usernameLabel: string;
    roleLabel: string;
    rolePlaceholder: string;
    roleDefault: string;
    addConfirm: string;
    errorAddFallback: string;
    removeTitle: string;
    removeDesc: string;
    removeConfirm: string;
    errorRemoveFallback: string;
    panelTitle: string;
    panelDesc: string;
    addMemberButton: string;
    searchPlaceholder: string;
    empty: string;
    colName: string;
    colRole: string;
    colSince: string;
    colAction: string;
    remove: string;
  };
  permissions: {
    panelTitle: string;
    panelDesc: string;
    permsList: string[];
    roleHeadOfStaff: string;
    roleAdmin: string;
    roleModerator: string;
    roleSupport: string;
    colRole: string;
  };
  notifications: {
    loading: string;
    noServer: string;
    toggleDetectionsLabel: string;
    toggleDetectionsDesc: string;
    toggleBansLabel: string;
    toggleBansDesc: string;
    toggleCriticalLabel: string;
    toggleCriticalDesc: string;
    toggleOfflineLabel: string;
    toggleOfflineDesc: string;
    panelAlertsTitle: string;
    panelAlertsDesc: string;
    toggleAria: (label: string) => string;
    panelIntegrationsTitle: string;
    panelIntegrationsDesc: string;
    discordWebhook: string;
    connected: string;
    notConfigured: string;
    email: string;
    emailUnavailable: string;
    apiGoat: string;
    apiActive: string;
    apiNoKey: string;
  };
  system: {
    loading: string;
    noServer: string;
    statVersion: string;
    protocolHint: (v: string) => string;
    statHealth: string;
    allModulesResponding: string;
    serverDisconnected: string;
    statApiLatency: string;
    apiLatencyHint: string;
    statUptime: string;
    offline: string;
    panelTitle: string;
    panelDesc: string;
    rowBackendConn: string;
    stable: string;
    disconnected: string;
    rowBanSync: string;
    noBanSynced: string;
    rowFileSignature: string;
    fileSignatureValue: string;
    rowEvidenceDb: string;
    operational: string;
    unavailable: string;
    rowQueue: string;
    pendingSuffix: (n: number) => string;
  };
  license: {
    loading: string;
    noServer: string;
    panelActiveTitle: string;
    validUntil: (date: string) => string;
    activeNoExpiry: string;
    active: string;
    infoKey: string;
    infoActivatedOn: string;
    infoValidity: string;
    infoLinkedServer: string;
    lifetime: string;
    panelPlansTitle: string;
    panelPlansDesc: string;
    plans: { name: string; price: string }[];
  };
  docs: {
    items: { title: string; desc: string }[];
    readDocs: string;
  };
};

const pt: Copy = {
  common: {
    exportUnavailable: "Exportação indisponível para esta tabela ainda",
    generatingSheet: "Gerando planilha…",
    exportExcel: "Exportar Excel",
  },
  home: {
    kicker: "Sistemas operacionais",
    title: "Visão Geral",
    subtitle: "Monitoramento em tempo real, detecções e saúde da infraestrutura do seu servidor.",
    generateReport: "Gerar relatório de segurança",
    loading: "Carregando métricas do servidor...",
    noServer: "Nenhum servidor selecionado.",
    statPlayersOnline: "Jogadores Online",
    realtimeUpdated: "Atualizado em tempo real",
    disconnected: "Desconectado",
    statDetections: "Detecções",
    interceptedActionsSuffix: "ações interceptadas",
    statActiveBans: "Banimentos Ativos",
    registeredOnServerSuffix: "registrados neste servidor",
    statHealth: "Saúde (Watchdog)",
    healthOk: "Infraestrutura OK",
    healthDisconnected: "Servidor Desconectado",
    eventsTitle: "Análise de Eventos e Telemetria",
    eventsDesc: "Volume de requisições monitoradas e ações bloqueadas pelo motor do GOAT.",
    openLogs: "Abrir Logs",
    rangeTooltip: "Recorte de período chega quando a série histórica de eventos existir no backend",
    last24h: "Últimas 24 horas",
    latestDetectionsTitle: "Últimas Detecções",
    latestDetectionsDesc: "Monitoramento em tempo real das ações bloqueadas.",
    viewAll: "Ver todas",
    noRecentDetections: "Nenhuma detecção registrada recentemente.",
    moduleStatusTitle: "Status dos Módulos",
    moduleStatusDesc: "Estado atual da infraestrutura de proteção no seu servidor.",
    settingsLink: "Configurações",
    active: "Ativo",
    inactive: "Desativado",
    unknownPlayer: "Desconhecido",
    unknownReason: "Segurança",
    modules: [
      { name: "Motor Anti-Aimbot", desc: "Monitoramento de puxadas e assistência de mira." },
      { name: "Anti-Nuker (Blindagem)", desc: "Proteção contra explosões, clones e crashes." },
      { name: "Scanner de Memória (AC-ID)", desc: "Varredura contínua de executores e injetores." },
      { name: "Infraestrutura Anti-Stopper", desc: "Autodefesa contra desligamentos forçados." },
    ],
  },
  players: {
    panelTitle: "Jogadores conectados",
    panelDesc: (n) => `${n} sessões ativas monitoradas em tempo real.`,
    searchPlaceholder: "Buscar por nome, ID, AC-ID, Steam ou Discord",
    banDialogTitle: "Banir jogador",
    banDialogLabel: (name) => `Motivo do banimento de ${name}`,
    banDialogPlaceholder: "Ex: Speedhack detectado pelo GOAT",
    banConfirm: "Banir",
    banErrorFallback: "Falha ao banir jogador.",
    exportTitle: "GOAT — Jogadores conectados",
    unknownName: "Desconhecido",
    invalidMethod: "Método inválido",
    colId: "ID",
    colName: "Nome",
    colAcId: "AC-ID",
    colPing: "Ping",
    colSteam: "Steam",
    colDiscord: "Discord",
    colHealth: "Vida",
    colArmor: "Colete",
    colStatus: "Status",
    colAction: "Ação",
    banButton: "Banir",
  },
  detections: {
    panelTitle: "Detecções",
    panelDesc: "Cada detecção guarda snapshot, log e replay do momento exato.",
    searchPlaceholder: "Buscar por jogador, motivo ou ID de detecção",
    unknownPlayer: "Desconhecido",
    unknownReason: "Segurança",
    exportTitle: "GOAT — Detecções",
    colId: "ID",
    colPlayer: "Jogador",
    colReason: "Motivo",
    colTime: "Horário",
    colEvidence: "Evidências",
    colConfidence: "Confiança",
    colPunishment: "Punição",
    filesCountSuffix: (n) => `${n} arquivos`,
    kpiTotal: "Total de detecções",
    kpiBans: "Banimentos",
    kpiKicks: "Kicks",
    kpiFlags: "Alertas (flag)",
    breakdownTitle: "Detecções por módulo",
  },
  evidence: {
    statRecords: "Registros",
    statRecordsHint: "Retenção de 90 dias",
    statScreenshots: "Screenshots",
    statScreenshotsHint: "Capturadas via revolt_screenshot em BAN/KICK",
    statReplays: "Replays",
    statReplaysHint: "Não disponível — sem infraestrutura de replay",
    panelTitle: "Evidências coletadas",
    panelDesc: "Visualize snapshots e logs vinculados a cada detecção.",
    searchPlaceholder: "Buscar evidência por ID, jogador ou detecção",
    evidenceAlt: "Evidência",
    unknownReason: "Segurança",
    unknownPlayer: "Desconhecido",
    noScreenshot: "Sem screenshot",
    filesCountSuffix: (n) => `${n} arquivos`,
    open: "Abrir",
    noImage: "Sem imagem",
  },
  bans: {
    errorRevokeFallback: "Falha ao revogar banimento.",
    newBanTitle: "Novo banimento",
    identifierLabel: "Identifier",
    identifierPlaceholder: "steam:1100001 ou discord:12345",
    reasonLabel: "Motivo",
    reasonPlaceholder: "Motivo do banimento",
    reasonDefault: "Banido via painel GOAT",
    confirmBan: "Banir",
    errorCreateFallback: "Falha ao criar banimento.",
    titleGlobal: "Global Ban",
    titleLocal: "Banimentos",
    descGlobal: "Banimentos compartilhados com toda a rede GOAT — sincronizados em tempo real.",
    descLocal: "Gerencie os banimentos deste servidor.",
    banIdentifierButton: "Banir identifier",
    searchPlaceholder: "Buscar por identifier ou motivo",
    colIdentifier: "Identifier",
    colReason: "Motivo",
    colBy: "Por",
    colDate: "Data",
    colAction: "Ação",
    revoke: "Revogar",
    exportTitleGlobal: "GOAT — Global Ban",
    exportTitleLocal: "GOAT — Banimentos",
  },
  protections: {
    panelTitle: "Módulos de proteção",
    panelDesc:
      "Ative, desative e defina a punição de cada módulo do GOAT. Sincronizado ao vivo com o MongoDB e Anti-Cheat.",
    searchPlaceholder: "Buscar módulo ou categoria",
    toggleAria: (name) => `Alternar ${name}`,
    triggersSuffix: (n) => `${n} disparos`,
    groups: {
      Combate: "Combate",
      Integridade: "Integridade",
      Movimento: "Movimento",
      Veículos: "Veículos",
      Sistema: "Sistema",
    },
  },
  events: {
    panelTitle: "Eventos",
    panelDesc: "Linha do tempo completa de sistema, staff e detecções.",
    searchPlaceholder: "Buscar evento",
    empty: "Nenhum evento registrado ainda.",
    exportTitle: "GOAT — Eventos",
    colDate: "Data",
    colType: "Tipo",
    colSeverity: "Severidade",
    colMessage: "Mensagem",
  },
  acId: {
    statRegistered: "AC-IDs registrados",
    statRegisteredHint: "Identidade única por hardware",
    statLinkedAccounts: "Contas vinculadas",
    statBlocked: "AC-IDs bloqueados",
    panelTitle: "Consulta de AC-ID",
    panelDesc: "Cada jogador recebe um identificador imutável registrado no banco de dados do GOAT.",
    searchPlaceholder: "Buscar AC-ID, Steam ou nome",
    empty: "Nenhum AC-ID registrado ainda — aparece aqui assim que um jogador conectar no servidor.",
    colAcId: "AC-ID",
    colPlayer: "Jogador",
    colSessions: "Sessões",
    colAlerts: "Alertas",
    colStatus: "Status",
    unknownPlayer: "Desconhecido",
    exportTitle: "GOAT — Consulta de AC-ID",
  },
  wall: {
    errorPublishFallback: "Falha ao publicar nota.",
    newNoteTitle: "Nova nota no mural",
    fieldTitleLabel: "Título",
    fieldTitlePlaceholder: "Ex: Alvo monitorado",
    fieldContentLabel: "Conteúdo",
    fieldContentPlaceholder: "Detalhes do aviso para a staff",
    publish: "Publicar",
    panelTitle: "Wall",
    panelDesc: "Mural interno da staff: avisos, alvos monitorados e notas de operação.",
    newNoteButton: "Nova nota",
    empty: "Nenhum aviso no mural.",
    delete: "Apagar",
  },
  wipe: {
    maintStatusPending: "Aguardando o servidor buscar o comando…",
    maintStatusDelivered: "Entregue ao servidor, executando…",
    maintStatusExecuted: "Executado",
    maintStatusFailed: "Falhou",
    opOrphanTitle: "Limpar entidades órfãs",
    opOrphanDesc: "Remove props e veículos sem dono ativo no servidor.",
    opSessionTitle: "Resetar sessões",
    opSessionDesc: "Encerra sessões travadas do anti-cheat para jogadores já desconectados.",
    errorMaintenanceFallback: "Falha ao solicitar operação de manutenção.",
    confirmWipeCacheTitle: "Limpar cache de detecções",
    confirmWipeCacheDesc:
      "Remove permanentemente detecções com mais de 90 dias. Essa ação não pode ser desfeita.",
    confirmWipeCacheLabel: "Limpar cache",
    errorWipeCacheFallback: "Falha ao limpar cache de detecções",
    errorRequestEvidenceFallback: "Falha ao solicitar wipe de evidências",
    confirmApproveTitle: "Aprovar wipe total de evidências",
    confirmApproveDesc:
      "Essa ação apaga permanentemente todas as evidências deste servidor. Não pode ser desfeita.",
    confirmApproveLabel: "Aprovar e apagar",
    errorApproveFallback: "Falha ao aprovar wipe de evidências",
    panelTitle: "Wipe",
    panelDesc: "Operações destrutivas ficam registradas para auditoria.",
    cacheCardTitle: "Limpar cache de detecções",
    cacheCardDesc: "Apaga detecções com mais de 90 dias.",
    cacheCardLastRun: (n) => ` Última execução: ${n} removidas.`,
    run: "Executar",
    running: "Executando…",
    totalWipeTitle: "Wipe total de evidências",
    irreversible: "Irreversível",
    totalWipeDesc: "Requer aprovação de um admin/staff diferente de quem solicita.",
    pendingNotice: "Sua solicitação está pendente — aguardando aprovação de outro admin.",
    pending: "Pendente",
    requestWipe: "Solicitar wipe",
    pendingApprovalsTitle: "Aprovações pendentes",
    pendingApprovalsDesc: "Solicitações de wipe total de evidências feitas por outros administradores.",
    requestedBy: (name) => `Solicitado por ${name}`,
    approve: "Aprovar",
  },
  staff: {
    addMemberTitle: "Adicionar membro da staff",
    usernameLabel: "Nome de usuário",
    roleLabel: "Cargo",
    rolePlaceholder: "Admin, Mod ou Support",
    roleDefault: "Mod",
    addConfirm: "Adicionar",
    errorAddFallback: "Falha ao adicionar membro da staff.",
    removeTitle: "Remover membro da staff",
    removeDesc: "Esse membro perde acesso ao painel imediatamente.",
    removeConfirm: "Remover",
    errorRemoveFallback: "Falha ao remover membro da staff.",
    panelTitle: "Equipe",
    panelDesc: "Membros com acesso ao painel e ao histórico de ações.",
    addMemberButton: "Adicionar membro",
    searchPlaceholder: "Buscar membro da staff",
    empty: "Nenhum membro cadastrado ainda.",
    colName: "Nome",
    colRole: "Cargo",
    colSince: "Desde",
    colAction: "Ação",
    remove: "Remover",
  },
  permissions: {
    panelTitle: "Permissões",
    panelDesc: "Defina o que cada nível de acesso pode executar no GOAT.",
    permsList: ["Ver painel", "Banir", "Revisar evidências", "Editar proteções", "Wipe"],
    roleHeadOfStaff: "Head de Staff",
    roleAdmin: "Administrador",
    roleModerator: "Moderador",
    roleSupport: "Suporte",
    colRole: "Cargo",
  },
  notifications: {
    loading: "Carregando alertas...",
    noServer: "Nenhum servidor selecionado.",
    toggleDetectionsLabel: "Nova detecção",
    toggleDetectionsDesc: "Qualquer detecção registrada pelo motor anti-cheat.",
    toggleBansLabel: "Banimento global",
    toggleBansDesc: "Sempre que a rede GOAT sincronizar um ban.",
    toggleCriticalLabel: "Detecção crítica",
    toggleCriticalDesc: "Confiança acima de 90% ou punição automática.",
    toggleOfflineLabel: "Servidor offline",
    toggleOfflineDesc: "Heartbeat perdido por mais de 35 segundos.",
    panelAlertsTitle: "Alertas",
    panelAlertsDesc: "Escolha quais eventos disparam notificação para a staff. Sincronizado com o backend.",
    toggleAria: (label) => `Alternar ${label}`,
    panelIntegrationsTitle: "Integrações",
    panelIntegrationsDesc: "Envie alertas para onde a sua equipe já está.",
    discordWebhook: "Discord Webhook",
    connected: "Conectado",
    notConfigured: "Não configurado",
    email: "E-mail",
    emailUnavailable: "Indisponível — sem provedor de e-mail configurado no backend",
    apiGoat: "API GOAT",
    apiActive: "Ativa",
    apiNoKey: "Sem chave",
  },
  system: {
    loading: "Carregando diagnóstico...",
    noServer: "Nenhum servidor selecionado.",
    statVersion: "Versão",
    protocolHint: (v) => `Protocolo ${v}`,
    statHealth: "Saúde",
    allModulesResponding: "Todos os módulos respondendo",
    serverDisconnected: "Servidor desconectado",
    statApiLatency: "Latência da API",
    apiLatencyHint: "GOAT BACKEND",
    statUptime: "Uptime",
    offline: "Offline",
    panelTitle: "Diagnóstico",
    panelDesc: "Conexão, sincronização e integridade do núcleo.",
    rowBackendConn: "Conexão com GOAT BACKEND",
    stable: "Estável",
    disconnected: "Desconectado",
    rowBanSync: "Sincronização de bans",
    noBanSynced: "Nenhum ban sincronizado ainda",
    rowFileSignature: "Assinatura de arquivos",
    fileSignatureValue: "Verificação client-side — não reportada ao backend",
    rowEvidenceDb: "Banco de evidências",
    operational: "Operacional",
    unavailable: "Indisponível",
    rowQueue: "Fila de processamento",
    pendingSuffix: (n) => `${n} pendência${n === 1 ? "" : "s"}`,
  },
  license: {
    loading: "Carregando licença...",
    noServer: "Nenhum servidor cadastrado.",
    panelActiveTitle: "Licença ativa",
    validUntil: (date) => `Válida até ${date}`,
    activeNoExpiry: "Acesso ativo · sem prazo de expiração registrado",
    active: "Ativa",
    infoKey: "Chave",
    infoActivatedOn: "Ativada em",
    infoValidity: "Validade",
    infoLinkedServer: "Servidor vinculado",
    lifetime: "Vitalícia",
    panelPlansTitle: "Planos disponíveis",
    panelPlansDesc: "Compare e faça upgrade a qualquer momento.",
    plans: [
      { name: "GOAT Monthly", price: "R$ 49,00 / mês" },
      { name: "GOAT Quarterly", price: "R$ 99,00 / 3 meses" },
      { name: "GOAT Enterprise", price: "R$ 299,00 (pagamento único)" },
    ],
  },
  docs: {
    items: [
      { title: "Instalação", desc: "Suba o GOAT no seu servidor FiveM em menos de 10 minutos." },
      { title: "Configuração", desc: "Entenda cada parâmetro do config e a punição de cada módulo." },
      { title: "Proteções", desc: "Referência completa das 22+ proteções e seus gatilhos." },
      { title: "AC-ID", desc: "Como funciona a identidade única e o banimento por hardware." },
      { title: "Global Ban", desc: "Integração com a rede compartilhada de banimentos." },
      { title: "API GOAT BACKEND", desc: "Endpoints, autenticação e webhooks para integrações." },
    ],
    readDocs: "Ler documentação",
  },
};

const en: Copy = {
  common: {
    exportUnavailable: "Export unavailable for this table yet",
    generatingSheet: "Generating spreadsheet…",
    exportExcel: "Export to Excel",
  },
  home: {
    kicker: "Operational systems",
    title: "Overview",
    subtitle: "Real-time monitoring, detections, and infrastructure health for your server.",
    generateReport: "Generate security report",
    loading: "Loading server metrics...",
    noServer: "No server selected.",
    statPlayersOnline: "Players Online",
    realtimeUpdated: "Updated in real time",
    disconnected: "Disconnected",
    statDetections: "Detections",
    interceptedActionsSuffix: "intercepted actions",
    statActiveBans: "Active Bans",
    registeredOnServerSuffix: "registered on this server",
    statHealth: "Health (Watchdog)",
    healthOk: "Infrastructure OK",
    healthDisconnected: "Server Disconnected",
    eventsTitle: "Event & Telemetry Analysis",
    eventsDesc: "Volume of monitored requests and actions blocked by the GOAT engine.",
    openLogs: "Open Logs",
    rangeTooltip: "Date-range filtering arrives once the historical event series exists on the backend",
    last24h: "Last 24 hours",
    latestDetectionsTitle: "Latest Detections",
    latestDetectionsDesc: "Real-time monitoring of blocked actions.",
    viewAll: "View all",
    noRecentDetections: "No detections recorded recently.",
    moduleStatusTitle: "Module Status",
    moduleStatusDesc: "Current state of your server's protection infrastructure.",
    settingsLink: "Settings",
    active: "Active",
    inactive: "Disabled",
    unknownPlayer: "Unknown",
    unknownReason: "Security",
    modules: [
      { name: "Anti-Aimbot Engine", desc: "Monitoring of aim-snapping and aim assistance." },
      { name: "Anti-Nuker (Shielding)", desc: "Protection against explosions, clones, and crashes." },
      { name: "Memory Scanner (AC-ID)", desc: "Continuous scanning for executors and injectors." },
      { name: "Anti-Stopper Infrastructure", desc: "Self-defense against forced shutdowns." },
    ],
  },
  players: {
    panelTitle: "Connected players",
    panelDesc: (n) => `${n} active sessions monitored in real time.`,
    searchPlaceholder: "Search by name, ID, AC-ID, Steam, or Discord",
    banDialogTitle: "Ban player",
    banDialogLabel: (name) => `Reason for banning ${name}`,
    banDialogPlaceholder: "E.g.: Speedhack detected by GOAT",
    banConfirm: "Ban",
    banErrorFallback: "Failed to ban player.",
    exportTitle: "GOAT — Connected players",
    unknownName: "Unknown",
    invalidMethod: "Invalid method",
    colId: "ID",
    colName: "Name",
    colAcId: "AC-ID",
    colPing: "Ping",
    colSteam: "Steam",
    colDiscord: "Discord",
    colHealth: "Health",
    colArmor: "Armor",
    colStatus: "Status",
    colAction: "Action",
    banButton: "Ban",
  },
  detections: {
    panelTitle: "Detections",
    panelDesc: "Each detection stores a snapshot, log, and replay of the exact moment.",
    searchPlaceholder: "Search by player, reason, or detection ID",
    unknownPlayer: "Unknown",
    unknownReason: "Security",
    exportTitle: "GOAT — Detections",
    colId: "ID",
    colPlayer: "Player",
    colReason: "Reason",
    colTime: "Time",
    colEvidence: "Evidence",
    colConfidence: "Confidence",
    colPunishment: "Punishment",
    filesCountSuffix: (n) => `${n} files`,
    kpiTotal: "Total detections",
    kpiBans: "Bans",
    kpiKicks: "Kicks",
    kpiFlags: "Alerts (flag)",
    breakdownTitle: "Detections by module",
  },
  evidence: {
    statRecords: "Records",
    statRecordsHint: "90-day retention",
    statScreenshots: "Screenshots",
    statScreenshotsHint: "Captured via revolt_screenshot on BAN/KICK",
    statReplays: "Replays",
    statReplaysHint: "Not available — no replay infrastructure",
    panelTitle: "Collected evidence",
    panelDesc: "View snapshots and logs linked to each detection.",
    searchPlaceholder: "Search evidence by ID, player, or detection",
    evidenceAlt: "Evidence",
    unknownReason: "Security",
    unknownPlayer: "Unknown",
    noScreenshot: "No screenshot",
    filesCountSuffix: (n) => `${n} files`,
    open: "Open",
    noImage: "No image",
  },
  bans: {
    errorRevokeFallback: "Failed to revoke ban.",
    newBanTitle: "New ban",
    identifierLabel: "Identifier",
    identifierPlaceholder: "steam:1100001 or discord:12345",
    reasonLabel: "Reason",
    reasonPlaceholder: "Ban reason",
    reasonDefault: "Banned via GOAT panel",
    confirmBan: "Ban",
    errorCreateFallback: "Failed to create ban.",
    titleGlobal: "Global Ban",
    titleLocal: "Bans",
    descGlobal: "Bans shared across the entire GOAT network — synced in real time.",
    descLocal: "Manage this server's bans.",
    banIdentifierButton: "Ban identifier",
    searchPlaceholder: "Search by identifier or reason",
    colIdentifier: "Identifier",
    colReason: "Reason",
    colBy: "By",
    colDate: "Date",
    colAction: "Action",
    revoke: "Revoke",
    exportTitleGlobal: "GOAT — Global Ban",
    exportTitleLocal: "GOAT — Bans",
  },
  protections: {
    panelTitle: "Protection modules",
    panelDesc:
      "Enable, disable, and set the punishment for each GOAT module. Synced live with MongoDB and Anti-Cheat.",
    searchPlaceholder: "Search module or category",
    toggleAria: (name) => `Toggle ${name}`,
    triggersSuffix: (n) => `${n} triggers`,
    groups: {
      Combate: "Combat",
      Integridade: "Integrity",
      Movimento: "Movement",
      Veículos: "Vehicles",
      Sistema: "System",
    },
  },
  events: {
    panelTitle: "Events",
    panelDesc: "Full timeline of system, staff, and detection events.",
    searchPlaceholder: "Search event",
    empty: "No events recorded yet.",
    exportTitle: "GOAT — Events",
    colDate: "Date",
    colType: "Type",
    colSeverity: "Severity",
    colMessage: "Message",
  },
  acId: {
    statRegistered: "Registered AC-IDs",
    statRegisteredHint: "Unique identity per hardware",
    statLinkedAccounts: "Linked accounts",
    statBlocked: "Blocked AC-IDs",
    panelTitle: "AC-ID lookup",
    panelDesc: "Each player receives an immutable identifier recorded in the GOAT database.",
    searchPlaceholder: "Search AC-ID, Steam, or name",
    empty: "No AC-ID registered yet — it appears here as soon as a player connects to the server.",
    colAcId: "AC-ID",
    colPlayer: "Player",
    colSessions: "Sessions",
    colAlerts: "Alerts",
    colStatus: "Status",
    unknownPlayer: "Unknown",
    exportTitle: "GOAT — AC-ID lookup",
  },
  wall: {
    errorPublishFallback: "Failed to publish note.",
    newNoteTitle: "New wall note",
    fieldTitleLabel: "Title",
    fieldTitlePlaceholder: "E.g.: Monitored target",
    fieldContentLabel: "Content",
    fieldContentPlaceholder: "Details of the notice for staff",
    publish: "Publish",
    panelTitle: "Wall",
    panelDesc: "Internal staff wall: notices, monitored targets, and operational notes.",
    newNoteButton: "New note",
    empty: "No notices on the wall.",
    delete: "Delete",
  },
  wipe: {
    maintStatusPending: "Waiting for the server to fetch the command…",
    maintStatusDelivered: "Delivered to server, executing…",
    maintStatusExecuted: "Executed",
    maintStatusFailed: "Failed",
    opOrphanTitle: "Clean up orphaned entities",
    opOrphanDesc: "Removes props and vehicles with no active owner on the server.",
    opSessionTitle: "Reset sessions",
    opSessionDesc: "Ends stuck anti-cheat sessions for players who already disconnected.",
    errorMaintenanceFallback: "Failed to request maintenance operation.",
    confirmWipeCacheTitle: "Clear detections cache",
    confirmWipeCacheDesc:
      "Permanently removes detections older than 90 days. This action cannot be undone.",
    confirmWipeCacheLabel: "Clear cache",
    errorWipeCacheFallback: "Failed to clear detections cache",
    errorRequestEvidenceFallback: "Failed to request evidence wipe",
    confirmApproveTitle: "Approve full evidence wipe",
    confirmApproveDesc:
      "This action permanently deletes all evidence for this server. It cannot be undone.",
    confirmApproveLabel: "Approve and delete",
    errorApproveFallback: "Failed to approve evidence wipe",
    panelTitle: "Wipe",
    panelDesc: "Destructive operations are logged for auditing.",
    cacheCardTitle: "Clear detections cache",
    cacheCardDesc: "Deletes detections older than 90 days.",
    cacheCardLastRun: (n) => ` Last run: ${n} removed.`,
    run: "Run",
    running: "Running…",
    totalWipeTitle: "Full evidence wipe",
    irreversible: "Irreversible",
    totalWipeDesc: "Requires approval from an admin/staff member different from the requester.",
    pendingNotice: "Your request is pending — awaiting approval from another admin.",
    pending: "Pending",
    requestWipe: "Request wipe",
    pendingApprovalsTitle: "Pending approvals",
    pendingApprovalsDesc: "Full evidence wipe requests made by other administrators.",
    requestedBy: (name) => `Requested by ${name}`,
    approve: "Approve",
  },
  staff: {
    addMemberTitle: "Add staff member",
    usernameLabel: "Username",
    roleLabel: "Role",
    rolePlaceholder: "Admin, Mod, or Support",
    roleDefault: "Mod",
    addConfirm: "Add",
    errorAddFallback: "Failed to add staff member.",
    removeTitle: "Remove staff member",
    removeDesc: "This member immediately loses access to the panel.",
    removeConfirm: "Remove",
    errorRemoveFallback: "Failed to remove staff member.",
    panelTitle: "Team",
    panelDesc: "Members with access to the panel and action history.",
    addMemberButton: "Add member",
    searchPlaceholder: "Search staff member",
    empty: "No members registered yet.",
    colName: "Name",
    colRole: "Role",
    colSince: "Since",
    colAction: "Action",
    remove: "Remove",
  },
  permissions: {
    panelTitle: "Permissions",
    panelDesc: "Define what each access level can do in GOAT.",
    permsList: ["View panel", "Ban", "Review evidence", "Edit protections", "Wipe"],
    roleHeadOfStaff: "Head of Staff",
    roleAdmin: "Administrator",
    roleModerator: "Moderator",
    roleSupport: "Support",
    colRole: "Role",
  },
  notifications: {
    loading: "Loading alerts...",
    noServer: "No server selected.",
    toggleDetectionsLabel: "New detection",
    toggleDetectionsDesc: "Any detection recorded by the anti-cheat engine.",
    toggleBansLabel: "Global ban",
    toggleBansDesc: "Whenever the GOAT network syncs a ban.",
    toggleCriticalLabel: "Critical detection",
    toggleCriticalDesc: "Confidence above 90% or automatic punishment.",
    toggleOfflineLabel: "Server offline",
    toggleOfflineDesc: "Heartbeat lost for more than 35 seconds.",
    panelAlertsTitle: "Alerts",
    panelAlertsDesc: "Choose which events trigger a notification for staff. Synced with the backend.",
    toggleAria: (label) => `Toggle ${label}`,
    panelIntegrationsTitle: "Integrations",
    panelIntegrationsDesc: "Send alerts to where your team already is.",
    discordWebhook: "Discord Webhook",
    connected: "Connected",
    notConfigured: "Not configured",
    email: "Email",
    emailUnavailable: "Unavailable — no email provider configured on the backend",
    apiGoat: "API GOAT",
    apiActive: "Active",
    apiNoKey: "No key",
  },
  system: {
    loading: "Loading diagnostics...",
    noServer: "No server selected.",
    statVersion: "Version",
    protocolHint: (v) => `Protocol ${v}`,
    statHealth: "Health",
    allModulesResponding: "All modules responding",
    serverDisconnected: "Server disconnected",
    statApiLatency: "API latency",
    apiLatencyHint: "GOAT BACKEND",
    statUptime: "Uptime",
    offline: "Offline",
    panelTitle: "Diagnostics",
    panelDesc: "Core connection, synchronization, and integrity.",
    rowBackendConn: "Connection to GOAT BACKEND",
    stable: "Stable",
    disconnected: "Disconnected",
    rowBanSync: "Ban synchronization",
    noBanSynced: "No ban synced yet",
    rowFileSignature: "File signature",
    fileSignatureValue: "Client-side verification — not reported to the backend",
    rowEvidenceDb: "Evidence database",
    operational: "Operational",
    unavailable: "Unavailable",
    rowQueue: "Processing queue",
    pendingSuffix: (n) => `${n} pending item${n === 1 ? "" : "s"}`,
  },
  license: {
    loading: "Loading license...",
    noServer: "No server registered.",
    panelActiveTitle: "Active license",
    validUntil: (date) => `Valid until ${date}`,
    activeNoExpiry: "Active access · no expiration date recorded",
    active: "Active",
    infoKey: "Key",
    infoActivatedOn: "Activated on",
    infoValidity: "Validity",
    infoLinkedServer: "Linked server",
    lifetime: "Lifetime",
    panelPlansTitle: "Available plans",
    panelPlansDesc: "Compare and upgrade at any time.",
    plans: [
      { name: "GOAT Monthly", price: "R$ 49,00 / month" },
      { name: "GOAT Quarterly", price: "R$ 99,00 / 3 months" },
      { name: "GOAT Enterprise", price: "R$ 299,00 (one-time payment)" },
    ],
  },
  docs: {
    items: [
      { title: "Installation", desc: "Get GOAT running on your FiveM server in under 10 minutes." },
      { title: "Configuration", desc: "Understand every config parameter and each module's punishment." },
      { title: "Protections", desc: "Full reference of the 22+ protections and their triggers." },
      { title: "AC-ID", desc: "How the unique identity and hardware-based banning work." },
      { title: "Global Ban", desc: "Integration with the shared ban network." },
      { title: "API GOAT BACKEND", desc: "Endpoints, authentication, and webhooks for integrations." },
    ],
    readDocs: "Read documentation",
  },
};

function Toolbar({
  placeholder,
  value = "",
  onChange,
  onExport,
}: {
  placeholder: string;
  value?: string;
  onChange?: (val: string) => void;
  onExport?: () => void | Promise<void>;
}) {
  const [exporting, setExporting] = useState(false);
  const { lang } = useLanguage();
  const t = (lang === "pt" ? pt : en).common;

  const handleExportClick = async () => {
    if (!onExport || exporting) return;
    setExporting(true);
    try {
      await onExport();
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      <MriSearchInput
        value={value}
        onChange={(val) => onChange && onChange(val)}
        placeholder={placeholder}
        className="min-w-[240px] flex-1"
      />
      <MriButton
        variant="outline"
        onClick={handleExportClick}
        disabled={!onExport || exporting}
        title={onExport ? undefined : t.exportUnavailable}
        className="rounded-xl"
      >
        <Download className={cn("h-3.5 w-3.5", exporting && "animate-pulse")} />
        {exporting ? t.generatingSheet : t.exportExcel}
      </MriButton>
    </div>
  );
}

// punishmentTone/moduleActionTone agora vivem no kit (toneForAction em
// components/ui/mri-badge-variants.ts) - mantidos aqui como alias pra não
// exigir troca de nome em cada call site deste arquivo.
const punishmentTone = toneForAction;
const moduleActionTone = toneForAction;

// Movido pro kit compartilhado (components/ui/MriPunishmentSelect.tsx).
const PunishmentSelect = MriPunishmentSelect;

function formatDuration(ms: number, lang: Lang): string {
  if (ms <= 0) return "0h 0m";
  const totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  // Hour/day/minute abbreviations (h/d/m) are identical in pt-BR and en-US.
  void lang;
  return days > 0 ? `${days}d ${hours}h ${minutes}m` : `${hours}h ${minutes}m`;
}

function formatRelativeTime(date: string | null | undefined, lang: Lang): string {
  if (!date) return "—";
  const diffMs = Date.now() - new Date(date).getTime();
  if (diffMs < 0) return lang === "pt" ? "agora" : "now";
  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return lang === "pt" ? `há ${seconds}s` : `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return lang === "pt" ? `há ${minutes}min` : `${minutes}min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return lang === "pt" ? `há ${hours}h` : `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return lang === "pt" ? `há ${days}d` : `${days}d ago`;
}

function confidenceColor(value: number): string {
  if (value >= 85) return "bg-red-500";
  if (value >= 75) return "bg-red-400";
  if (value >= 60) return "bg-amber-400";
  return "bg-gold";
}

function Bar({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-2">
      <span className="h-1 w-16 overflow-hidden rounded-full bg-accent">
        <motion.span
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={cn("block h-full", confidenceColor(value))}
        />
      </span>
      <span className="text-muted-foreground tabular-nums">{value}%</span>
    </span>
  );
}

import { ServerItem } from "@/lib/goat-api";

import { useSocket } from "@/lib/SocketContext";

export function Home() {
  const [server, setServer] = useState<ServerItem | null>(null);
  const [realPlayers, setRealPlayers] = useState(0);
  const [realDetections, setRealDetections] = useState<any[]>([]);
  const [realBans, setRealBans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());
  const { socket, connected } = useSocket();
  const { lang } = useLanguage();
  const t = (lang === "pt" ? pt : en).home;

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const activeId = localStorage.getItem("goat_active_server_id");
    if (!activeId) {
      setLoading(false);
      return;
    }

    api.getServerById(activeId).then((s) => {
      if (s) {
        setServer(s);
        setRealPlayers(s.status === "online" ? s.onlinePlayers || 0 : 0);
      }
      setLoading(false);
    });

    api.getServerDetections(activeId).then((d) => setRealDetections(d));
    api.getServerBans(activeId).then((b) => setRealBans(b));
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("telemetry_update", (data) => {
        if (data.stats) {
          if (data.stats.online !== undefined) {
            setRealPlayers(data.stats.online);
          }
          if (data.stats.lastHeartbeat) {
            setServer((prev) =>
              prev
                ? {
                    ...prev,
                    status: data.stats.status || "online",
                    lastHeartbeat: data.stats.lastHeartbeat,
                    onlinePlayers: data.stats.online,
                  }
                : null,
            );
          }
        }
      });
      socket.on("new_detection", (det) => {
        setRealDetections((prev) => [det, ...prev]);
      });
    }
    return () => {
      if (socket) {
        socket.off("telemetry_update");
        socket.off("new_detection");
      }
    };
  }, [socket]);

  const hbAge = server?.lastHeartbeat ? now - new Date(server.lastHeartbeat).getTime() : Infinity;
  const isOnline = server?.status === "online" && hbAge < 35000;
  const players = isOnline ? realPlayers : 0;
  const detectionsCount = realDetections.length;
  const healthText = isOnline ? "100%" : "0%";
  const healthDesc = isOnline ? t.healthOk : t.healthDisconnected;
  const healthColor = isOnline ? "text-emerald-400" : "text-muted-foreground";
  const pulseColor = isOnline
    ? "bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.6)] animate-pulse"
    : "bg-red-500";
  const pulseText = isOnline ? t.realtimeUpdated : t.disconnected;

  const [reportOpen, setReportOpen] = useState(false);

  if (loading) return <div className="p-8 text-muted-foreground">{t.loading}</div>;
  if (!server) return <div className="p-8 text-muted-foreground">{t.noServer}</div>;
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase">
            {t.kicker}
            {isOnline ? (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            )}
          </p>
          <h1 className="mt-1 text-[26px] font-semibold tracking-tight text-foreground">
            {t.title}
          </h1>
          <p className="mt-2 text-[13px] text-muted-foreground">{t.subtitle}</p>
        </div>
        <MriButton
          variant="primary"
          onClick={() => setReportOpen(true)}
          className="rounded-full border-gold/25 px-4 py-2 text-[12px] hover:border-gold/40"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {t.generateReport}
        </MriButton>
      </div>

      <SecurityReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        data={{
          serverName: server.name,
          isOnline,
          players,
          detectionsCount,
          bansCount: realBans.length,
          healthText,
          healthDesc,
          detections: realDetections,
        }}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MriCard className="bg-card p-5 hover:border-foreground/20">
          <div className="flex items-start justify-between">
            <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
              <span className="h-[3px] w-[3px] rounded-[1px] bg-gold/70" />
              {t.statPlayersOnline}
            </p>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[6px] border border-hairline text-foreground/70">
              <Users className="h-3.5 w-3.5" />
            </span>
          </div>
          <p className="mt-4 text-[26px] font-semibold leading-none tracking-tight tabular-nums">
            {players}
          </p>
          <p className={"mt-2 text-[11px] flex items-center gap-1 " + healthColor}>
            <span className={"h-1.5 w-1.5 rounded-full " + pulseColor} /> {pulseText}
          </p>
        </MriCard>

        <MriCard className="bg-card p-5 hover:border-foreground/20">
          <div className="flex items-start justify-between">
            <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
              <span className="h-[3px] w-[3px] rounded-[1px] bg-gold/70" />
              {t.statDetections}
            </p>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[6px] border border-hairline text-foreground/70">
              <Bug className="h-3.5 w-3.5" />
            </span>
          </div>
          <p className="mt-4 text-[26px] font-semibold leading-none tracking-tight tabular-nums">
            {detectionsCount}
          </p>
          <p className="mt-2 text-[11px] text-muted-foreground">
            <span className="text-foreground font-medium tabular-nums">{detectionsCount}</span>{" "}
            {t.interceptedActionsSuffix}
          </p>
        </MriCard>

        <MriCard className="bg-card p-5 hover:border-foreground/20">
          <div className="flex items-start justify-between">
            <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
              <span className="h-[3px] w-[3px] rounded-[1px] bg-gold/70" />
              {t.statActiveBans}
            </p>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[6px] border border-hairline text-foreground/70">
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
          </div>
          <p className="mt-4 text-[26px] font-semibold leading-none tracking-tight tabular-nums">
            {realBans.length}
          </p>
          <p className="mt-2 text-[11px] text-muted-foreground">
            <span className="text-foreground font-medium tabular-nums">{realBans.length}</span>{" "}
            {t.registeredOnServerSuffix}
          </p>
        </MriCard>

        <MriCard className="bg-card p-5 hover:border-foreground/20">
          <div className="flex items-start justify-between">
            <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
              <span className="h-[3px] w-[3px] rounded-[1px] bg-gold/70" />
              {t.statHealth}
            </p>
            <span
              className={cn(
                "grid h-7 w-7 shrink-0 place-items-center rounded-[6px] border border-hairline",
                healthColor,
              )}
            >
              <Activity className="h-3.5 w-3.5" />
            </span>
          </div>
          <p
            className={
              "mt-4 text-[26px] font-semibold leading-none tracking-tight tabular-nums " +
              healthColor
            }
          >
            {healthText}
          </p>
          <p className="mt-2 text-[11px] text-muted-foreground">{healthDesc}</p>
        </MriCard>
      </div>

      <Panel
        title={t.eventsTitle}
        desc={t.eventsDesc}
        action={
          <div className="flex items-center gap-4 text-[12px]">
            <Link
              to="/dashboard/eventos"
              className="font-medium hover:text-foreground transition-colors text-muted-foreground"
            >
              {t.openLogs} &rarr;
            </Link>
            <span
              title={t.rangeTooltip}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card/40 px-3 py-1.5 font-medium text-muted-foreground/60"
            >
              {t.last24h}
            </span>
          </div>
        }
      >
        <VolumeChart />
      </Panel>

      <div className="grid gap-5 md:grid-cols-2">
        <Panel
          title={t.latestDetectionsTitle}
          desc={t.latestDetectionsDesc}
          action={
            <Link
              to="/dashboard/deteccoes"
              className="text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.viewAll} &rarr;
            </Link>
          }
        >
          <div className="mt-2 space-y-4">
            {realDetections.length === 0 ? (
              <div className="flex items-center justify-center py-6">
                <p className="text-[12px] text-muted-foreground">{t.noRecentDetections}</p>
              </div>
            ) : (
              realDetections.slice(0, 3).map((d: any) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-[13px] font-medium flex items-center gap-2 text-foreground">
                      {d.player || t.unknownPlayer}
                    </p>
                    <p className="text-[11.5px] text-muted-foreground mt-0.5">
                      {d.reason || t.unknownReason}
                    </p>
                  </div>
                  <div className="text-right">
                    <Tag tone={punishmentTone(d.punishment)}>{d.punishment}</Tag>
                    <p className="text-[10px] text-muted-foreground mt-1.5">
                      {formatDateTime(d.time, lang)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>

        <Panel
          title={t.moduleStatusTitle}
          desc={t.moduleStatusDesc}
          action={
            <a
              href="/dashboard/protecoes"
              className="text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.settingsLink} &rarr;
            </a>
          }
        >
          <div className="mt-2 space-y-4">
            {[
              { name: t.modules[0].name, key: "antiAimbot", desc: t.modules[0].desc },
              { name: t.modules[1].name, key: "antiCrash", desc: t.modules[1].desc },
              { name: t.modules[2].name, key: "antiInjection", desc: t.modules[2].desc },
              { name: t.modules[3].name, key: "watchdog", desc: t.modules[3].desc },
            ].map((m, i) => {
              const enabled = server?.anticheatConfig?.[m.key] ?? true;
              return (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-[13px] font-medium flex items-center gap-2">{m.name}</p>
                    <p className="text-[11.5px] text-muted-foreground max-w-[240px] truncate">
                      {m.desc}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-medium",
                      enabled
                        ? "border-border/50 bg-foreground/5 text-foreground"
                        : "border-border/50 text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        enabled ? "bg-foreground" : "bg-muted-foreground",
                      )}
                    />
                    {enabled ? t.active : t.inactive}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}

export function Players() {
  const [realPlayers, setRealPlayers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { socket } = useSocket();
  const dialog = useDialog();
  const { lang } = useLanguage();
  const t = (lang === "pt" ? pt : en).players;

  useEffect(() => {
    const activeId = localStorage.getItem("goat_active_server_id");
    if (activeId) {
      api.getServerPlayers(activeId).then((p) => setRealPlayers(p));
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("telemetry_update", (data) => {
        if (data.players) {
          setRealPlayers(data.players);
        }
      });
    }
    return () => {
      if (socket) socket.off("telemetry_update");
    };
  }, [socket]);

  const filtered = realPlayers.filter((p: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.name && String(p.name).toLowerCase().includes(q)) ||
      (p.acid && String(p.acid).toLowerCase().includes(q)) ||
      (p.steam && String(p.steam).toLowerCase().includes(q)) ||
      (p.discord && String(p.discord).toLowerCase().includes(q)) ||
      (p.id && String(p.id).includes(q))
    );
  });

  const isValidIdentifier = (value: string | undefined, prefix: string) =>
    !!value && value !== `${prefix}:N/A`;

  const handleBan = async (p: any) => {
    const identifier =
      (isValidIdentifier(p.steam, "steam") && p.steam) || (p.discord && p.discord) || p.acid;
    if (!identifier) return;
    const reason = await dialog.prompt({
      title: t.banDialogTitle,
      label: t.banDialogLabel(p.name || identifier),
      placeholder: t.banDialogPlaceholder,
      confirmLabel: t.banConfirm,
      danger: true,
    });
    if (!reason) return;
    try {
      await api.createBan({ identifier, reason });
    } catch (err) {
      console.error("Failed to ban player:", err);
      await dialog.notify({
        description: err instanceof Error ? err.message : t.banErrorFallback,
        tone: "error",
      });
    }
  };

  const handleExport = async () => {
    await downloadStyledExcel(
      `goat-jogadores-${Date.now()}.xlsx`,
      [
        t.colId,
        t.colName,
        t.colAcId,
        t.colPing,
        t.colSteam,
        t.colDiscord,
        t.colHealth,
        t.colArmor,
        t.colStatus,
      ],
      filtered.map((p: any, idx: number) => [
        p.id ?? idx + 1,
        p.name || t.unknownName,
        p.acid || "NO_ACID",
        p.ping || 0,
        isValidIdentifier(p.steam, "steam") ? p.steam : t.invalidMethod,
        p.discord || "—",
        p.health ?? 200,
        p.armor ?? 0,
        p.status || "Limpo",
      ]),
      { title: t.exportTitle, colorColumn: 8, colorFn: severityFillColor },
    );
  };

  return (
    <Panel title={t.panelTitle} desc={t.panelDesc(realPlayers.length)}>
      <Toolbar
        placeholder={t.searchPlaceholder}
        value={searchQuery}
        onChange={setSearchQuery}
        onExport={handleExport}
      />
      <Table
        cols=".5fr 1.1fr 1fr .5fr 1.1fr 1.2fr .5fr .5fr .7fr .5fr"
        head={[
          t.colId,
          t.colName,
          t.colAcId,
          t.colPing,
          t.colSteam,
          t.colDiscord,
          t.colHealth,
          t.colArmor,
          t.colStatus,
          t.colAction,
        ]}
        rows={filtered.map((p: any, idx: number) => [
          <span className="text-muted-foreground" key={`id-${idx}`}>
            #{p.id ?? idx + 1}
          </span>,
          p.name || t.unknownName,
          <span className="font-mono text-[11.5px] text-muted-foreground" key={`acid-${idx}`}>
            {p.acid || "NO_ACID"}
          </span>,
          `${p.ping || 0}ms`,
          <span className="font-mono text-[11.5px] text-muted-foreground" key={`steam-${idx}`}>
            {isValidIdentifier(p.steam, "steam") ? p.steam : t.invalidMethod}
          </span>,
          <span className="font-mono text-[11.5px] text-muted-foreground" key={`discord-${idx}`}>
            {p.discord || "—"}
          </span>,
          `${p.health ?? 200}`,
          `${p.armor ?? 0}`,
          <Tag
            tone={p.status && p.status !== "Limpo" ? "warning" : "success"}
            key={`status-${idx}`}
          >
            {statusLabel(p.status || "Limpo", lang)}
          </Tag>,
          <button
            key={`ban-${idx}`}
            onClick={() => handleBan(p)}
            className="text-[11.5px] text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.banButton}
          </button>,
        ])}
      />
    </Panel>
  );
}

export function Detections() {
  const [realDetections, setRealDetections] = useState<any[]>([]);
  const { socket } = useSocket();
  const { lang } = useLanguage();
  const t = (lang === "pt" ? pt : en).detections;

  useEffect(() => {
    const activeId = localStorage.getItem("goat_active_server_id");
    if (activeId) {
      api.getServerDetections(activeId).then((d) => setRealDetections(d));
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("new_detection", (det) => {
        setRealDetections((prev) => [det, ...prev]);
      });
    }
    return () => {
      if (socket) socket.off("new_detection");
    };
  }, [socket]);

  const handleExport = async () => {
    const banCount = realDetections.filter(
      (d: any) => punishmentTone(d.punishment) === "critical",
    ).length;
    const kickCount = realDetections.filter(
      (d: any) => punishmentTone(d.punishment) === "warning",
    ).length;
    const flagCount = realDetections.filter(
      (d: any) => punishmentTone(d.punishment) === "gold",
    ).length;

    const moduleCounts = new Map<string, number>();
    realDetections.forEach((d: any) => {
      const key = d.reason || t.unknownReason;
      moduleCounts.set(key, (moduleCounts.get(key) || 0) + 1);
    });
    const breakdown = Array.from(moduleCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([label, count]) => ({ label, count }));

    await downloadStyledExcel(
      `goat-deteccoes-${Date.now()}.xlsx`,
      [t.colId, t.colPlayer, t.colReason, t.colTime, t.colEvidence, t.colConfidence, t.colPunishment],
      realDetections.map((d: any) => [
        d.id,
        d.player || t.unknownPlayer,
        d.reason || t.unknownReason,
        formatDateTime(d.time, lang),
        d.evidence,
        d.confidence,
        d.punishment,
      ]),
      {
        title: t.exportTitle,
        colorColumn: 6,
        colorFn: severityFillColor,
        dataBarColumn: 5,
        summary: {
          kpis: [
            { label: t.kpiTotal, value: realDetections.length },
            { label: t.kpiBans, value: banCount, color: EXCEL_COLORS.red },
            { label: t.kpiKicks, value: kickCount, color: EXCEL_COLORS.amber },
            { label: t.kpiFlags, value: flagCount, color: EXCEL_COLORS.gold },
          ],
          breakdownTitle: t.breakdownTitle,
          breakdown,
        },
      },
    );
  };

  return (
    <Panel title={t.panelTitle} desc={t.panelDesc}>
      <Toolbar placeholder={t.searchPlaceholder} onExport={handleExport} />
      <Table
        cols=".7fr 1.2fr 1.1fr .7fr .7fr .9fr .9fr"
        head={[t.colId, t.colPlayer, t.colReason, t.colTime, t.colEvidence, t.colConfidence, t.colPunishment]}
        rows={realDetections.map((d: any) => [
          <span className="font-mono text-[11.5px] text-muted-foreground" key="id">
            {d.id.slice(-6)}
          </span>,
          d.player || t.unknownPlayer,
          d.reason || t.unknownReason,
          <span className="text-muted-foreground" key="time">
            {formatDateTime(d.time, lang)}
          </span>,
          t.filesCountSuffix(d.evidence),
          <Bar value={d.confidence} key="bar" />,
          <Tag tone={punishmentTone(d.punishment)} key="tag">
            {d.punishment}
          </Tag>,
        ])}
      />
    </Panel>
  );
}

export function Evidence() {
  const [realDetections, setRealDetections] = useState<any[]>([]);
  const { lang } = useLanguage();
  const t = (lang === "pt" ? pt : en).evidence;

  useEffect(() => {
    const activeId = localStorage.getItem("goat_active_server_id");
    if (activeId) {
      api.getServerDetections(activeId).then((d) => setRealDetections(d));
    }
  }, []);

  const screenshotCount = realDetections.filter((d: any) => d.evidenceImage).length;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          label={t.statRecords}
          value={realDetections.length.toString()}
          hint={t.statRecordsHint}
        />
        <Stat
          label={t.statScreenshots}
          value={screenshotCount.toString()}
          hint={t.statScreenshotsHint}
        />
        <Stat label={t.statReplays} value="0" hint={t.statReplaysHint} />
      </div>
      <Panel title={t.panelTitle} desc={t.panelDesc}>
        <Toolbar placeholder={t.searchPlaceholder} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {realDetections.map((d: any) => (
            <MriCard key={d.id} interactive className="group">
              <div className="grain relative mb-4 h-28 overflow-hidden rounded-lg border border-border bg-background">
                {d.evidenceImage ? (
                  <img
                    src={d.evidenceImage}
                    alt={`${t.evidenceAlt} — ${d.reason || t.unknownReason}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <>
                    <div className="bars-soft absolute inset-0 opacity-20" />
                    <span className="absolute bottom-2 left-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {t.noScreenshot}
                    </span>
                  </>
                )}
              </div>
              <p className="text-[12.5px] font-medium">{d.player || t.unknownPlayer}</p>
              <p className="mt-1 text-[11.5px] text-muted-foreground">
                {d.reason || t.unknownReason} · {formatDateTime(d.time, lang)}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <Tag>{t.filesCountSuffix(d.evidence)}</Tag>
                {d.evidenceImage ? (
                  <a
                    href={d.evidenceImage}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11.5px] text-muted-foreground transition-colors group-hover:text-foreground"
                  >
                    {t.open}
                  </a>
                ) : (
                  <span className="text-[11.5px] text-muted-foreground/50">{t.noImage}</span>
                )}
              </div>
            </MriCard>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export function Bans({ globalOnly }: { globalOnly?: boolean }) {
  const [realBans, setRealBans] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const activeId = localStorage.getItem("goat_active_server_id") || undefined;
  const dialog = useDialog();
  const { lang } = useLanguage();
  const t = (lang === "pt" ? pt : en).bans;

  const load = () => {
    api.getServerBans(globalOnly ? undefined : activeId).then((b) => setRealBans(b));
  };

  useEffect(() => {
    load();
  }, [globalOnly]);

  const handleRevoke = async (banId: string) => {
    setBusy(true);
    try {
      await api.revokeBan(banId);
      load();
    } catch (err) {
      console.error("Failed to revoke ban:", err);
      await dialog.notify({
        description: err instanceof Error ? err.message : t.errorRevokeFallback,
        tone: "error",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleNewBan = async () => {
    const result = await dialog.form({
      title: t.newBanTitle,
      fields: [
        { key: "identifier", label: t.identifierLabel, placeholder: t.identifierPlaceholder },
        {
          key: "reason",
          label: t.reasonLabel,
          placeholder: t.reasonPlaceholder,
          defaultValue: t.reasonDefault,
        },
      ],
      confirmLabel: t.confirmBan,
      danger: true,
    });
    if (!result || !result.identifier) return;
    setBusy(true);
    try {
      await api.createBan({ identifier: result.identifier, reason: result.reason });
      load();
    } catch (err) {
      console.error("Failed to create ban:", err);
      await dialog.notify({
        description: err instanceof Error ? err.message : t.errorCreateFallback,
        tone: "error",
      });
    } finally {
      setBusy(false);
    }
  };

  const rows = realBans.filter((b: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (b.identifier && String(b.identifier).toLowerCase().includes(q)) ||
      (b.reason && String(b.reason).toLowerCase().includes(q))
    );
  });

  const handleExport = async () => {
    await downloadStyledExcel(
      `goat-banimentos-${Date.now()}.xlsx`,
      [t.colIdentifier, t.colReason, t.colBy, t.colDate],
      rows.map((b: any) => [b.identifier, b.reason, b.issuedBy, formatDate(b.createdAt, lang)]),
      { title: globalOnly ? t.exportTitleGlobal : t.exportTitleLocal },
    );
  };

  return (
    <Panel
      title={globalOnly ? t.titleGlobal : t.titleLocal}
      desc={globalOnly ? t.descGlobal : t.descLocal}
      action={
        <MriButton variant="danger-outline" size="sm" onClick={handleNewBan} disabled={busy}>
          {t.banIdentifierButton}
        </MriButton>
      }
    >
      <Toolbar
        placeholder={t.searchPlaceholder}
        value={searchQuery}
        onChange={setSearchQuery}
        onExport={handleExport}
      />
      <Table
        cols="1.4fr 1.6fr .9fr .9fr .6fr"
        head={[t.colIdentifier, t.colReason, t.colBy, t.colDate, t.colAction]}
        rows={rows.map((b: any) => [
          <span className="font-mono text-[11.5px] text-muted-foreground" key="identifier">
            {b.identifier}
          </span>,
          b.reason,
          <span className="text-muted-foreground" key="by">
            {b.issuedBy}
          </span>,
          <span className="text-muted-foreground" key="date">
            {formatDate(b.createdAt, lang)}
          </span>,
          <button
            key="revoke"
            onClick={() => handleRevoke(b._id)}
            disabled={busy}
            className="text-[11.5px] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            {t.revoke}
          </button>,
        ])}
      />
    </Panel>
  );
}

const PROTECTION_CONFIG_KEYS: Record<string, string> = {
  "Anti-Aimbot": "antiAimbot",
  "Anti Silent Aim": "antiSilentAim",
  "Anti-Hitbox": "antiHitbox",
  "Anti-Explosion": "antiExplosion",
  "Anti-NoHS": "antiNoHS",
  "Anti-Weapon": "antiWeapon",
  "Anti-Headshot-Abuse": "antiHeadshotAbuse",
  "Anti-Damage": "antiDamage",
  "Anti-Taser": "antiTaser",
  "Anti-Fire": "antiFire",
  "Anti-RemoveWeapon": "antiRemoveWeapon",
  "Anti-Reload": "antiReload",
  "Anti-Ragdoll": "antiRagdoll",
  "Anti-Godmode": "antiGodmode",
  "Anti-Heal": "antiHeal",
  "Anti-Revive": "antiRevive",
  "Anti-Armor": "antiArmor",
  "Anti-Invisibility": "antiInvisibility",
  "Anti-Thermal": "antiThermal",
  "Anti-NightVision": "antiNightVision",
  "Anti-Resource": "antiResource",
  "Anti-Spectate": "antiSpectate",
  "Anti-Freecam": "antiFreecam",
  "Anti-NoClip": "antiNoClip",
  "Anti-Speed": "antiSpeed",
  "Anti-SuperJump": "antiSuperJump",
  "Anti-InfiniteStamina": "antiInfiniteStamina",
  "Anti-Vehicle": "antiVehicle",
  "Anti-VehicleTeleport": "antiVehicleTeleport",
  "Anti-Nitro": "antiNitro",
  "Anti-Entity": "antiEntity",
  "Anti-Crash / Nuker": "antiCrash",
  "Anti-Injection": "antiInjection",
  "Anti-Trigger": "antiTrigger",
  Watchdog: "watchdog",
  "Anti-TrollEntity": "antiTrollEntity",
  "Anti-Event": "antiEvent",
  "Anti-Stopper": "antiStopper",
  "Anti-SoloSession": "antiSoloSession",
  "Anti-PedTeleport": "antiPedTeleport",
  "Anti-WeaponFireRate": "antiWeaponFireRate",
  "Anti-VehicleGodmode": "antiVehicleGodmode",
  "Anti-EconomyDupe": "antiEconomyDupe",
  "Anti-ModelSwap": "antiModelSwap",
  "Anti-OOBExploit": "antiOOBExploit",
  "Anti-InfiniteAmmo": "antiInfiniteAmmo",
  "Anti-VehicleAlpha": "antiVehicleAlpha",
  "Anti-RagdollClipExploit": "antiRagdollClipExploit",
  "Anti-VehicleFlyHack": "antiVehicleFlyHack",
  "Anti-FallDamageImmunity": "antiFallDamageImmunity",
  "Anti-NoRecoilScript": "antiNoRecoilScript",
  "Anti-VehicleSpawnSpam": "antiVehicleSpawnSpam",
  "Anti-WeaponComponent": "antiWeaponComponent",
  "Anti-BankTransferFlood": "antiBankTransferFlood",
  "Anti-PriceManipulation": "antiPriceManipulation",
  "Anti-ATMLimitBypass": "antiATMLimitBypass",
  "Anti-MultiClienting": "antiMultiClienting",
  "Anti-InteractionRangeAbuse": "antiInteractionRangeAbuse",
  "Anti-VehicleDeleteEvasion": "antiVehicleDeleteEvasion",
  "Anti-PropGriefBlock": "antiPropGriefBlock",
  "Anti-MacroFarm": "antiMacroFarm",
  "Anti-DoorLockBypass": "antiDoorLockBypass",
};

const PROTECTION_MODULE_KEYS: Record<string, string> = {
  "Anti-Aimbot": "AntiAimbot",
  "Anti Silent Aim": "AntiSilentAim",
  "Anti-Hitbox": "AntiHitbox",
  "Anti-Explosion": "AntiExplosion",
  "Anti-NoHS": "AntiNoHS",
  "Anti-Weapon": "AntiWeapon",
  "Anti-Headshot-Abuse": "AntiHeadshotAbuse",
  "Anti-Damage": "AntiDamage",
  "Anti-Taser": "AntiTaser",
  "Anti-Fire": "AntiFire",
  "Anti-RemoveWeapon": "AntiRemoveWeapon",
  "Anti-Reload": "AntiReload",
  "Anti-Ragdoll": "AntiRagdoll",
  "Anti-Godmode": "AntiGodMode",
  "Anti-Heal": "AntiHeal",
  "Anti-Revive": "AntiRevive",
  "Anti-Armor": "AntiArmor",
  "Anti-Invisibility": "AntiInvisibility",
  "Anti-Thermal": "AntiThermal",
  "Anti-NightVision": "AntiNightVision",
  "Anti-Resource": "AntiResource",
  "Anti-Spectate": "AntiSpectate",
  "Anti-Freecam": "AntiFreecam",
  "Anti-NoClip": "AntiNoClip",
  "Anti-Speed": "AntiSpeed",
  "Anti-SuperJump": "AntiSuperJump",
  "Anti-InfiniteStamina": "AntiInfiniteStamina",
  "Anti-Vehicle": "AntiVehicle",
  "Anti-VehicleTeleport": "AntiVehicleTeleport",
  "Anti-Nitro": "AntiNitro",
  "Anti-Entity": "AntiEntity",
  "Anti-Crash / Nuker": "AntiCrash",
  "Anti-Injection": "AntiInjection",
  "Anti-Trigger": "AntiTrigger",
  Watchdog: "Watchdog",
  "Anti-TrollEntity": "AntiTrollEntity",
  "Anti-Event": "AntiEvent",
  "Anti-Stopper": "AntiStopper",
  "Anti-SoloSession": "AntiSoloSession",
  "Anti-PedTeleport": "AntiPedTeleport",
  "Anti-WeaponFireRate": "AntiWeaponFireRate",
  "Anti-VehicleGodmode": "AntiVehicleGodmode",
  "Anti-EconomyDupe": "AntiEconomyDupe",
  "Anti-ModelSwap": "AntiModelSwap",
  "Anti-OOBExploit": "AntiOOBExploit",
  "Anti-InfiniteAmmo": "AntiInfiniteAmmo",
  "Anti-VehicleAlpha": "AntiVehicleAlpha",
  "Anti-RagdollClipExploit": "AntiRagdollClipExploit",
  "Anti-VehicleFlyHack": "AntiVehicleFlyHack",
  "Anti-FallDamageImmunity": "AntiFallDamageImmunity",
  "Anti-NoRecoilScript": "AntiNoRecoilScript",
  "Anti-VehicleSpawnSpam": "AntiVehicleSpawnSpam",
  "Anti-WeaponComponent": "AntiWeaponComponent",
  "Anti-BankTransferFlood": "AntiBankTransferFlood",
  "Anti-PriceManipulation": "AntiPriceManipulation",
  "Anti-ATMLimitBypass": "AntiATMLimitBypass",
  "Anti-MultiClienting": "AntiMultiClienting",
  "Anti-InteractionRangeAbuse": "AntiInteractionRangeAbuse",
  "Anti-VehicleDeleteEvasion": "AntiVehicleDeleteEvasion",
  "Anti-PropGriefBlock": "AntiPropGriefBlock",
  "Anti-MacroFarm": "AntiMacroFarm",
  "Anti-DoorLockBypass": "AntiDoorLockBypass",
};

const PUNISHMENT_TIERS = ["FLAG", "KICK", "BAN"] as const;

export function Protections() {
  const [list, setList] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const { lang } = useLanguage();
  const t = (lang === "pt" ? pt : en).protections;

  useEffect(() => {
    const activeId = localStorage.getItem("goat_active_server_id");
    if (activeId) {
      Promise.all([api.getServerById(activeId), api.getServerStats(activeId)]).then(
        ([server, stats]) => {
          if (server && server.anticheatConfig) {
            const c = server.anticheatConfig;
            const triggers = stats?.triggersByModule || {};
            const triggersFor = (name: string) => triggers[PROTECTION_MODULE_KEYS[name]] || 0;
            const overrides = c.punishmentActions || {};
            const rawList = [
              {
                name: "Anti-Aimbot",
                group: "Combate",
                enabled: c.antiAimbot ?? true,
                action: "BAN",
                triggers: triggersFor("Anti-Aimbot"),
              },
              {
                name: "Anti Silent Aim",
                group: "Combate",
                enabled: c.antiSilentAim ?? true,
                action: "BAN",
                triggers: triggersFor("Anti Silent Aim"),
              },
              {
                name: "Anti-Hitbox",
                group: "Combate",
                enabled: c.antiHitbox ?? true,
                action: "BAN",
                triggers: triggersFor("Anti-Hitbox"),
              },
              {
                name: "Anti-Explosion",
                group: "Combate",
                enabled: c.antiExplosion ?? true,
                action: "BAN",
                triggers: triggersFor("Anti-Explosion"),
              },
              {
                name: "Anti-NoHS",
                group: "Combate",
                enabled: c.antiNoHS ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-NoHS"),
              },
              {
                name: "Anti-Weapon",
                group: "Combate",
                enabled: c.antiWeapon ?? true,
                action: "BAN",
                triggers: triggersFor("Anti-Weapon"),
              },
              {
                name: "Anti-Headshot-Abuse",
                group: "Combate",
                enabled: c.antiHeadshotAbuse ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-Headshot-Abuse"),
              },
              {
                name: "Anti-Damage",
                group: "Combate",
                enabled: c.antiDamage ?? true,
                action: "BAN",
                triggers: triggersFor("Anti-Damage"),
              },
              {
                name: "Anti-Taser",
                group: "Combate",
                enabled: c.antiTaser ?? true,
                action: "KICK",
                triggers: triggersFor("Anti-Taser"),
              },
              {
                name: "Anti-Fire",
                group: "Combate",
                enabled: c.antiFire ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-Fire"),
              },
              {
                name: "Anti-RemoveWeapon",
                group: "Combate",
                enabled: c.antiRemoveWeapon ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-RemoveWeapon"),
              },
              {
                name: "Anti-Reload",
                group: "Combate",
                enabled: c.antiReload ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-Reload"),
              },
              {
                name: "Anti-Ragdoll",
                group: "Combate",
                enabled: c.antiRagdoll ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-Ragdoll"),
              },
              {
                name: "Anti-Godmode",
                group: "Integridade",
                enabled: c.antiGodmode ?? true,
                action: "BAN",
                triggers: triggersFor("Anti-Godmode"),
              },
              {
                name: "Anti-Heal",
                group: "Integridade",
                enabled: c.antiHeal ?? true,
                action: "KICK",
                triggers: triggersFor("Anti-Heal"),
              },
              {
                name: "Anti-Revive",
                group: "Integridade",
                enabled: c.antiRevive ?? true,
                action: "BAN",
                triggers: triggersFor("Anti-Revive"),
              },
              {
                name: "Anti-Armor",
                group: "Integridade",
                enabled: c.antiArmor ?? true,
                action: "KICK",
                triggers: triggersFor("Anti-Armor"),
              },
              {
                name: "Anti-Invisibility",
                group: "Integridade",
                enabled: c.antiInvisibility ?? true,
                action: "KICK",
                triggers: triggersFor("Anti-Invisibility"),
              },
              {
                name: "Anti-Thermal",
                group: "Integridade",
                enabled: c.antiThermal ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-Thermal"),
              },
              {
                name: "Anti-NightVision",
                group: "Integridade",
                enabled: c.antiNightVision ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-NightVision"),
              },
              {
                name: "Anti-Resource",
                group: "Integridade",
                enabled: c.antiResource ?? true,
                action: "BAN",
                triggers: triggersFor("Anti-Resource"),
              },
              {
                name: "Anti-Spectate",
                group: "Integridade",
                enabled: c.antiSpectate ?? true,
                action: "BAN",
                triggers: triggersFor("Anti-Spectate"),
              },
              {
                name: "Anti-Freecam",
                group: "Integridade",
                enabled: c.antiFreecam ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-Freecam"),
              },
              {
                name: "Anti-NoClip",
                group: "Movimento",
                enabled: c.antiNoClip ?? true,
                action: "KICK",
                triggers: triggersFor("Anti-NoClip"),
              },
              {
                name: "Anti-Speed",
                group: "Movimento",
                enabled: c.antiSpeed ?? true,
                action: "KICK",
                triggers: triggersFor("Anti-Speed"),
              },
              {
                name: "Anti-SuperJump",
                group: "Movimento",
                enabled: c.antiSuperJump ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-SuperJump"),
              },
              {
                name: "Anti-InfiniteStamina",
                group: "Movimento",
                enabled: c.antiInfiniteStamina ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-InfiniteStamina"),
              },
              {
                name: "Anti-PedTeleport",
                group: "Movimento",
                enabled: c.antiPedTeleport ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-PedTeleport"),
              },
              {
                name: "Anti-WeaponFireRate",
                group: "Combate",
                enabled: c.antiWeaponFireRate ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-WeaponFireRate"),
              },
              {
                name: "Anti-Vehicle",
                group: "Veículos",
                enabled: c.antiVehicle ?? true,
                action: "KICK",
                triggers: triggersFor("Anti-Vehicle"),
              },
              {
                name: "Anti-VehicleTeleport",
                group: "Veículos",
                enabled: c.antiVehicleTeleport ?? true,
                action: "KICK",
                triggers: triggersFor("Anti-VehicleTeleport"),
              },
              {
                name: "Anti-Nitro",
                group: "Veículos",
                enabled: c.antiNitro ?? true,
                action: "BAN",
                triggers: triggersFor("Anti-Nitro"),
              },
              {
                name: "Anti-VehicleGodmode",
                group: "Veículos",
                enabled: c.antiVehicleGodmode ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-VehicleGodmode"),
              },
              {
                name: "Anti-Entity",
                group: "Sistema",
                enabled: c.antiEntity ?? true,
                action: "BAN",
                triggers: triggersFor("Anti-Entity"),
              },
              {
                name: "Anti-Crash / Nuker",
                group: "Sistema",
                enabled: c.antiCrash ?? true,
                action: "BAN",
                triggers: triggersFor("Anti-Crash / Nuker"),
              },
              {
                name: "Anti-Injection",
                group: "Sistema",
                enabled: c.antiInjection ?? true,
                action: "BAN",
                triggers: triggersFor("Anti-Injection"),
              },
              {
                name: "Anti-Trigger",
                group: "Sistema",
                enabled: c.antiTrigger ?? true,
                action: "BAN",
                triggers: triggersFor("Anti-Trigger"),
              },
              {
                name: "Watchdog",
                group: "Sistema",
                enabled: c.watchdog ?? true,
                action: "KICK",
                triggers: triggersFor("Watchdog"),
              },
              {
                name: "Anti-TrollEntity",
                group: "Sistema",
                enabled: c.antiTrollEntity ?? true,
                action: "BAN",
                triggers: triggersFor("Anti-TrollEntity"),
              },
              {
                name: "Anti-Event",
                group: "Sistema",
                enabled: c.antiEvent ?? true,
                action: "BAN",
                triggers: triggersFor("Anti-Event"),
              },
              {
                name: "Anti-Stopper",
                group: "Sistema",
                enabled: c.antiStopper ?? true,
                action: "BAN",
                triggers: triggersFor("Anti-Stopper"),
              },
              {
                name: "Anti-SoloSession",
                group: "Sistema",
                enabled: c.antiSoloSession ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-SoloSession"),
              },
              {
                name: "Anti-EconomyDupe",
                group: "Sistema",
                enabled: c.antiEconomyDupe ?? true,
                action: "BAN",
                triggers: triggersFor("Anti-EconomyDupe"),
              },
              {
                name: "Anti-InfiniteAmmo",
                group: "Combate",
                enabled: c.antiInfiniteAmmo ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-InfiniteAmmo"),
              },
              {
                name: "Anti-NoRecoilScript",
                group: "Combate",
                enabled: c.antiNoRecoilScript ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-NoRecoilScript"),
              },
              {
                name: "Anti-WeaponComponent",
                group: "Combate",
                enabled: c.antiWeaponComponent ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-WeaponComponent"),
              },
              {
                name: "Anti-ModelSwap",
                group: "Integridade",
                enabled: c.antiModelSwap ?? true,
                action: "KICK",
                triggers: triggersFor("Anti-ModelSwap"),
              },
              {
                name: "Anti-FallDamageImmunity",
                group: "Integridade",
                enabled: c.antiFallDamageImmunity ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-FallDamageImmunity"),
              },
              {
                name: "Anti-OOBExploit",
                group: "Movimento",
                enabled: c.antiOOBExploit ?? true,
                action: "KICK",
                triggers: triggersFor("Anti-OOBExploit"),
              },
              {
                name: "Anti-RagdollClipExploit",
                group: "Movimento",
                enabled: c.antiRagdollClipExploit ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-RagdollClipExploit"),
              },
              {
                name: "Anti-VehicleAlpha",
                group: "Veículos",
                enabled: c.antiVehicleAlpha ?? true,
                action: "BAN",
                triggers: triggersFor("Anti-VehicleAlpha"),
              },
              {
                name: "Anti-VehicleFlyHack",
                group: "Veículos",
                enabled: c.antiVehicleFlyHack ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-VehicleFlyHack"),
              },
              {
                name: "Anti-VehicleSpawnSpam",
                group: "Veículos",
                enabled: c.antiVehicleSpawnSpam ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-VehicleSpawnSpam"),
              },
              {
                name: "Anti-VehicleDeleteEvasion",
                group: "Veículos",
                enabled: c.antiVehicleDeleteEvasion ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-VehicleDeleteEvasion"),
              },
              {
                name: "Anti-BankTransferFlood",
                group: "Sistema",
                enabled: c.antiBankTransferFlood ?? true,
                action: "KICK",
                triggers: triggersFor("Anti-BankTransferFlood"),
              },
              {
                name: "Anti-PriceManipulation",
                group: "Sistema",
                enabled: c.antiPriceManipulation ?? true,
                action: "BAN",
                triggers: triggersFor("Anti-PriceManipulation"),
              },
              {
                name: "Anti-ATMLimitBypass",
                group: "Sistema",
                enabled: c.antiATMLimitBypass ?? true,
                action: "KICK",
                triggers: triggersFor("Anti-ATMLimitBypass"),
              },
              {
                name: "Anti-MultiClienting",
                group: "Sistema",
                enabled: c.antiMultiClienting ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-MultiClienting"),
              },
              {
                name: "Anti-InteractionRangeAbuse",
                group: "Sistema",
                enabled: c.antiInteractionRangeAbuse ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-InteractionRangeAbuse"),
              },
              {
                name: "Anti-PropGriefBlock",
                group: "Sistema",
                enabled: c.antiPropGriefBlock ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-PropGriefBlock"),
              },
              {
                name: "Anti-MacroFarm",
                group: "Sistema",
                enabled: c.antiMacroFarm ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-MacroFarm"),
              },
              {
                name: "Anti-DoorLockBypass",
                group: "Sistema",
                enabled: c.antiDoorLockBypass ?? true,
                action: "FLAG",
                triggers: triggersFor("Anti-DoorLockBypass"),
              },
            ];
            const fieldOverridesByModule = c.fieldOverrides || {};
            setList(
              rawList.map((m) => {
                const key = PROTECTION_CONFIG_KEYS[m.name];
                const luaKey = PROTECTION_MODULE_KEYS[m.name];
                const override = key ? overrides[key] : undefined;
                const withAction =
                  override && PUNISHMENT_TIERS.includes(override) ? { ...m, action: override } : m;
                return { ...withAction, fieldOverrides: (luaKey && fieldOverridesByModule[luaKey]) || {} };
              }),
            );
          }
        },
      );
    }
  }, []);

  const persist = async (updated: any[]) => {
    const activeServerId = localStorage.getItem("goat_active_server_id");
    if (activeServerId) {
      setSaving(true);
      try {
        const configObj: Record<string, any> = {};
        const punishmentActions: Record<string, string> = {};
        const fieldOverrides: Record<string, Record<string, string>> = {};
        updated.forEach((p: any) => {
          const key = PROTECTION_CONFIG_KEYS[p.name];
          const luaKey = PROTECTION_MODULE_KEYS[p.name];
          if (key) {
            configObj[key] = p.enabled;
            punishmentActions[key] = p.action;
          }
          if (luaKey && p.fieldOverrides && Object.keys(p.fieldOverrides).length > 0) {
            fieldOverrides[luaKey] = p.fieldOverrides;
          }
        });
        configObj.punishmentActions = punishmentActions;
        // Sempre manda o mapa inteiro (não só o módulo que mudou) - o
        // backend faz merge raso desse objeto, então mandar só o diff
        // apagaria os valores salvos de outros módulos.
        configObj.fieldOverrides = fieldOverrides;
        await api.updateServerConfig(activeServerId, configObj);
      } catch (err) {
        console.error("Failed to sync protection config:", err);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleToggle = async (idx: number) => {
    const updated = list.map((m: any, i: number) =>
      i === idx ? { ...m, enabled: !m.enabled } : m,
    );
    setList(updated);
    await persist(updated);
  };

  const handlePunishmentChange = async (idx: number, tier: string) => {
    const updated = list.map((m: any, i: number) => (i === idx ? { ...m, action: tier } : m));
    setList(updated);
    await persist(updated);
  };

  const handleFieldChange = async (idx: number, fieldKey: string, value: string) => {
    const updated = list.map((m: any, i: number) =>
      i === idx ? { ...m, fieldOverrides: { ...m.fieldOverrides, [fieldKey]: value } } : m,
    );
    setList(updated);
    await persist(updated);
  };

  const filteredList = list.filter((p: any) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.group.toLowerCase().includes(q);
  });

  return (
    <Panel title={t.panelTitle} desc={t.panelDesc}>
      <MriSearchInput
        value={search}
        onChange={setSearch}
        placeholder={t.searchPlaceholder}
        className="mb-5 max-w-sm"
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredList.map((p: any) => {
          const idx = list.indexOf(p);
          return (
            <MriCard key={p.name} interactive active={p.enabled}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium">{p.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                    <span className="h-[3px] w-[3px] rounded-[1px] bg-gold/70" />
                    {t.groups[p.group] ?? p.group}
                  </p>
                </div>
                <MriToggle
                  checked={p.enabled}
                  onChange={() => handleToggle(idx)}
                  ariaLabel={t.toggleAria(p.name)}
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <PunishmentSelect
                  value={p.action}
                  onChange={(tier) => handlePunishmentChange(idx, tier)}
                />
                <span
                  className={cn(
                    "text-[11px] tabular-nums",
                    p.triggers > 0 ? "font-medium text-foreground" : "text-muted-foreground",
                  )}
                >
                  {t.triggersSuffix(p.triggers)}
                </span>
              </div>

              {(() => {
                const luaKey = PROTECTION_MODULE_KEYS[p.name];
                const camposDisponiveis = luaKey ? PROTECTION_MODULE_FIELDS[luaKey] : undefined;
                if (!camposDisponiveis || camposDisponiveis.length === 0) return null;
                return (
                  <AvancadoModulo
                    campos={camposDisponiveis}
                    valores={p.fieldOverrides || {}}
                    onSalvar={(fieldKey, valor) => handleFieldChange(idx, fieldKey, valor)}
                  />
                );
              })()}
            </MriCard>
          );
        })}
      </div>
    </Panel>
  );
}

function AvancadoModulo({
  campos,
  valores,
  onSalvar,
}: {
  campos: { key: string; label: string; help: string }[];
  valores: Record<string, string>;
  onSalvar: (fieldKey: string, valor: string) => void;
}) {
  const [aberto, setAberto] = useState(false);
  return (
    <div className="mt-3 border-t border-hairline pt-3">
      <button
        onClick={() => setAberto((v) => !v)}
        className="flex w-full items-center justify-between text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <span>Avançado ({campos.length})</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", aberto && "rotate-180")} />
      </button>
      {aberto && (
        <div className="mt-2 flex flex-col gap-2 rounded-lg bg-elevated p-2.5">
          {campos.map((campo) => (
            <CampoAvancadoWeb
              key={campo.key}
              campo={campo}
              valorSalvo={valores[campo.key]}
              onSalvar={onSalvar}
            />
          ))}
          <p className="text-[10.5px] italic text-muted-foreground">
            Aplica no próximo heartbeat do servidor (poucos segundos), sem precisar reiniciar.
          </p>
        </div>
      )}
    </div>
  );
}

function CampoAvancadoWeb({
  campo,
  valorSalvo,
  onSalvar,
}: {
  campo: { key: string; label: string; help: string; type?: string; options?: string[] };
  valorSalvo?: string;
  onSalvar: (fieldKey: string, valor: string) => void;
}) {
  const ehBooleano = campo.type === "boolean";
  const [valor, setValor] = useState(ehBooleano ? String(valorSalvo === "true") : (valorSalvo ?? ""));
  const sujo = valor !== (ehBooleano ? String(valorSalvo === "true") : (valorSalvo ?? ""));

  if (ehBooleano) {
    return (
      <div className="flex items-center justify-between gap-3 text-[11px]">
        <div className="min-w-0 flex-1">
          <div className="text-foreground">{campo.label}</div>
          <div className="mt-0.5 text-[10.5px] text-muted-foreground">{campo.help}</div>
        </div>
        <MriToggle
          checked={valor === "true"}
          ariaLabel={campo.label}
          onChange={() => {
            const novo = String(valor !== "true");
            setValor(novo);
            onSalvar(campo.key, novo);
          }}
        />
      </div>
    );
  }

  if (campo.type === "select") {
    return (
      <div className="flex items-start justify-between gap-3 text-[11px]">
        <div className="min-w-0 flex-1">
          <div className="text-foreground">{campo.label}</div>
          <div className="mt-0.5 text-[10.5px] text-muted-foreground">{campo.help}</div>
        </div>
        <select
          value={valor}
          onChange={(e) => {
            setValor(e.target.value);
            onSalvar(campo.key, e.target.value);
          }}
          className="shrink-0 rounded-md border border-border bg-card/60 px-2 py-1 text-[10.5px] text-foreground outline-none focus:border-gold/50"
        >
          {(campo.options || []).map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (campo.type === "text") {
    return (
      <div className="flex flex-col gap-1.5 text-[11px]">
        <div>
          <div className="text-foreground">{campo.label}</div>
          <div className="mt-0.5 text-[10.5px] text-muted-foreground">{campo.help}</div>
        </div>
        <div className="flex items-start gap-1.5">
          <MriTextarea
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            rows={2}
            className="text-[11px]"
          />
          {sujo && (
            <MriButton
              variant="ghost"
              size="icon"
              onClick={() => onSalvar(campo.key, valor)}
              className="h-8 w-8 shrink-0 text-gold hover:bg-gold/10"
            >
              <Check className="h-3 w-3" />
            </MriButton>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between gap-3 text-[11px]">
      <div className="min-w-0 flex-1">
        <div className="text-foreground">{campo.label}</div>
        <div className="mt-0.5 text-[10.5px] text-muted-foreground">{campo.help}</div>
        {valorSalvo === undefined && (
          <div className="mt-0.5 text-[10.5px] text-muted-foreground/70">Ainda não ajustado - usando o padrão do sistema.</div>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <MriInput
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sujo && onSalvar(campo.key, valor)}
          placeholder="valor"
          className="w-20 rounded-md px-2 py-1 text-right text-[10.5px]"
        />
        {sujo && (
          <MriButton
            variant="ghost"
            size="icon"
            onClick={() => onSalvar(campo.key, valor)}
            className="h-6 w-6 shrink-0 text-gold hover:bg-gold/10"
          >
            <Check className="h-3 w-3" />
          </MriButton>
        )}
      </div>
    </div>
  );
}

export function Nucleo() {
  const [allFieldOverrides, setAllFieldOverrides] = useState<Record<string, Record<string, string>> | null>(null);

  useEffect(() => {
    const activeId = localStorage.getItem("goat_active_server_id");
    if (!activeId) {
      setAllFieldOverrides({});
      return;
    }
    api.getServerById(activeId).then((server: any) => {
      setAllFieldOverrides(server?.anticheatConfig?.fieldOverrides || {});
    });
  }, []);

  const persist = async (updated: Record<string, Record<string, string>>) => {
    const activeServerId = localStorage.getItem("goat_active_server_id");
    if (!activeServerId) return;
    await api.updateServerConfig(activeServerId, { fieldOverrides: updated });
  };

  if (allFieldOverrides === null) {
    return (
      <Panel title="Núcleo" desc="Comportamento geral do sistema.">
        <p className="py-8 text-center text-[12px] text-muted-foreground">Carregando...</p>
      </Panel>
    );
  }

  const coreOverrides = allFieldOverrides.Core || {};

  const handleFieldChange = (fieldKey: string, valor: string) => {
    const updated = { ...allFieldOverrides, Core: { ...coreOverrides, [fieldKey]: valor } };
    setAllFieldOverrides(updated);
    persist(updated);
  };

  return (
    <Panel
      title="Núcleo"
      desc="Comportamento geral do sistema (heartbeat, watchdog, tolerância a falso positivo). Aplica no próximo heartbeat do servidor, sem precisar reiniciar."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {CORE_FIELD_GROUPS.map((g) => (
          <MriCard key={g.key} className="flex flex-col gap-3 p-4">
            <p className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">{g.label}</p>
            <div className="flex flex-col gap-2.5">
              {g.fields.map((f) => (
                <CampoAvancadoWeb key={f.key} campo={f} valorSalvo={coreOverrides[f.key]} onSalvar={handleFieldChange} />
              ))}
            </div>
          </MriCard>
        ))}
      </div>
    </Panel>
  );
}

export function Punicoes() {
  const [allFieldOverrides, setAllFieldOverrides] = useState<Record<string, Record<string, string>> | null>(null);
  const [novoCargo, setNovoCargo] = useState("");
  const [novoNivel, setNovoNivel] = useState(1);

  useEffect(() => {
    const activeId = localStorage.getItem("goat_active_server_id");
    if (!activeId) {
      setAllFieldOverrides({});
      return;
    }
    api.getServerById(activeId).then((server: any) => {
      setAllFieldOverrides(server?.anticheatConfig?.fieldOverrides || {});
    });
  }, []);

  const persist = async (updated: Record<string, Record<string, string>>) => {
    const activeServerId = localStorage.getItem("goat_active_server_id");
    if (!activeServerId) return;
    await api.updateServerConfig(activeServerId, { fieldOverrides: updated });
  };

  if (allFieldOverrides === null) {
    return (
      <Panel title="Punições" desc="Como o GOAT pune um jogador.">
        <p className="py-8 text-center text-[12px] text-muted-foreground">Carregando...</p>
      </Panel>
    );
  }

  const punishmentOverrides = allFieldOverrides.Punishment || {};

  const handleFieldChange = (fieldKey: string, valor: string) => {
    const updated = { ...allFieldOverrides, Punishment: { ...punishmentOverrides, [fieldKey]: valor } };
    setAllFieldOverrides(updated);
    persist(updated);
  };

  let roles: { role: string; level: number }[] = [];
  try {
    const raw = punishmentOverrides["StaffBypass.Roles"];
    if (raw) {
      const mapa = JSON.parse(raw) as Record<string, number>;
      roles = Object.entries(mapa).map(([role, level]) => ({ role, level }));
    }
  } catch {
    roles = [];
  }
  roles.sort((a, b) => a.role.localeCompare(b.role));

  let ignoredModules: string[] = [];
  try {
    const raw = punishmentOverrides["StaffBypass.IgnoredModulesForMods"];
    if (raw) ignoredModules = JSON.parse(raw) as string[];
  } catch {
    ignoredModules = [];
  }

  const saveRoles = (novasRoles: { role: string; level: number }[]) => {
    const mapa: Record<string, number> = {};
    novasRoles.forEach((r) => {
      mapa[r.role] = r.level;
    });
    handleFieldChange("StaffBypass.Roles", JSON.stringify(mapa));
  };

  const adicionarCargo = () => {
    const cargo = novoCargo.trim();
    if (!cargo || roles.some((r) => r.role === cargo)) return;
    saveRoles([...roles, { role: cargo, level: novoNivel }]);
    setNovoCargo("");
  };

  const removerCargo = (cargo: string) => saveRoles(roles.filter((r) => r.role !== cargo));

  const mudarNivelCargo = (cargo: string, nivel: number) =>
    saveRoles(roles.map((r) => (r.role === cargo ? { ...r, level: nivel } : r)));

  const alternarModuloIgnorado = (moduleKey: string) => {
    const nova = ignoredModules.includes(moduleKey)
      ? ignoredModules.filter((m) => m !== moduleKey)
      : [...ignoredModules, moduleKey];
    handleFieldChange("StaffBypass.IgnoredModulesForMods", JSON.stringify(nova));
  };

  const availableModules = Object.entries(PROTECTION_MODULE_KEYS).map(([label, key]) => ({ key, label }));

  return (
    <div className="flex flex-col gap-4">
      <Panel
        title="Punições"
        desc="Como o GOAT pune um jogador - mensagens, duração padrão e ação de fallback. Aplica no próximo heartbeat do servidor, sem precisar reiniciar."
      >
        <MriCard className="flex flex-col gap-2.5 p-4">
          {PUNISHMENT_FIELDS.map((f) => (
            <CampoAvancadoWeb key={f.key} campo={f} valorSalvo={punishmentOverrides[f.key]} onSalvar={handleFieldChange} />
          ))}
        </MriCard>
      </Panel>

      <Panel
        title="Bypass de staff"
        desc="Cargos que ficam total ou parcialmente imunes ao anticheat (ex: staff usando noclip em serviço)."
      >
        <MriCard className="flex flex-col gap-3 p-4">
          <div className="flex flex-col gap-2">
            {roles.length === 0 && <p className="text-[11px] text-muted-foreground">Nenhum cargo configurado ainda.</p>}
            {roles.map((r) => (
              <div key={r.role} className="flex items-center justify-between gap-2 text-[11px]">
                <span className="font-mono">{r.role}</span>
                <div className="flex items-center gap-1.5">
                  <select
                    value={r.level}
                    onChange={(e) => mudarNivelCargo(r.role, Number(e.target.value))}
                    className="rounded-md border border-border bg-card/60 px-1.5 py-1 text-[10.5px] text-foreground outline-none focus:border-gold/50"
                  >
                    {STAFF_BYPASS_LEVELS.map((n) => (
                      <option key={n.value} value={n.value}>
                        {n.label}
                      </option>
                    ))}
                  </select>
                  <MriButton variant="ghost" size="icon" className="h-6 w-6" onClick={() => removerCargo(r.role)}>
                    <Trash2 className="h-3 w-3" />
                  </MriButton>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 border-t border-hairline pt-3">
            <MriInput
              value={novoCargo}
              onChange={(e) => setNovoCargo(e.target.value)}
              placeholder="nome do cargo (ex: mod)"
              className="text-[11px]"
            />
            <select
              value={novoNivel}
              onChange={(e) => setNovoNivel(Number(e.target.value))}
              className="shrink-0 rounded-md border border-border bg-card/60 px-1.5 py-1.5 text-[10.5px] text-foreground outline-none focus:border-gold/50"
            >
              {STAFF_BYPASS_LEVELS.map((n) => (
                <option key={n.value} value={n.value}>
                  {n.label}
                </option>
              ))}
            </select>
            <MriButton variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={adicionarCargo}>
              <Plus className="h-3.5 w-3.5" />
            </MriButton>
          </div>
        </MriCard>
      </Panel>

      <Panel title="Módulos ignorados pra cargos parciais" desc='Módulos que cargos com nível "Ignora selecionados" não sofrem detecção.'>
        <div className="flex flex-wrap gap-2">
          {availableModules.map((m) => {
            const ativo = ignoredModules.includes(m.key);
            return (
              <button
                key={m.key}
                onClick={() => alternarModuloIgnorado(m.key)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[11px] transition-colors",
                  ativo
                    ? "border-gold/40 bg-gold/10 text-gold"
                    : "border-border bg-card/60 text-muted-foreground hover:text-foreground",
                )}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

export function Events() {
  const [realEvents, setRealEvents] = useState<any[]>([]);
  const { lang } = useLanguage();
  const t = (lang === "pt" ? pt : en).events;

  useEffect(() => {
    const activeId = localStorage.getItem("goat_active_server_id");
    if (activeId) {
      api.getServerEvents(activeId).then((e) => setRealEvents(e));
    }
  }, []);

  const handleExport = async () => {
    await downloadStyledExcel(
      `goat-eventos-${Date.now()}.xlsx`,
      [t.colDate, t.colType, t.colSeverity, t.colMessage],
      realEvents.map((e: any) => [
        formatDateTime(e.createdAt, lang),
        e.type,
        e.severity,
        e.message,
      ]),
      { title: t.exportTitle, colorColumn: 2, colorFn: severityFillColor },
    );
  };

  return (
    <Panel title={t.panelTitle} desc={t.panelDesc}>
      <Toolbar placeholder={t.searchPlaceholder} onExport={handleExport} />
      {realEvents.length === 0 ? (
        <p className="py-6 text-center text-[12px] text-muted-foreground">{t.empty}</p>
      ) : (
        <ol className="relative border-l border-border pl-6">
          {realEvents.map((e: any, i: number) => (
            <li key={e._id || i} className="relative pb-6 last:pb-0">
              <span
                className={cn(
                  "absolute -left-[27px] top-1.5 h-1.5 w-1.5 rounded-full",
                  e.severity === "critical"
                    ? "bg-red-500"
                    : e.severity === "warning"
                      ? "bg-amber-400"
                      : "bg-gold",
                )}
              />
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11.5px] text-muted-foreground" key="time">
                  {formatDateTime(e.createdAt, lang)}
                </span>
                <Tag
                  tone={
                    e.severity === "critical"
                      ? "critical"
                      : e.severity === "warning"
                        ? "warning"
                        : "neutral"
                  }
                  key="tag"
                >
                  {e.type}
                </Tag>
              </div>
              <p className="mt-1.5 text-[13px]">{e.message}</p>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  );
}

export function AcId() {
  const [realAcIds, setRealAcIds] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalAcIds: 0, linkedAccounts: 0, blockedAcIds: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const { lang } = useLanguage();
  const t = (lang === "pt" ? pt : en).acId;

  useEffect(() => {
    const activeId = localStorage.getItem("goat_active_server_id");
    if (activeId) {
      api.getServerAcIds(activeId).then((acList) => setRealAcIds(acList));
      api.getServerStats(activeId).then((s) => setStats(s));
    }
  }, []);

  const filtered = realAcIds.filter((ac: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (ac.acid && String(ac.acid).toLowerCase().includes(q)) ||
      (ac.name && String(ac.name).toLowerCase().includes(q)) ||
      (ac.steam && String(ac.steam).toLowerCase().includes(q))
    );
  });

  const handleExport = async () => {
    await downloadStyledExcel(
      `goat-acids-${Date.now()}.xlsx`,
      [t.colAcId, t.colPlayer, t.colSessions, t.colAlerts, t.colStatus],
      filtered.map((ac: any) => [
        ac.acid,
        ac.name || t.unknownPlayer,
        ac.sessionsCount || 1,
        ac.alertsCount || 0,
        ac.status || "Limpo",
      ]),
      { title: t.exportTitle, colorColumn: 4, colorFn: severityFillColor },
    );
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          label={t.statRegistered}
          value={(stats.totalAcIds || realAcIds.length).toString()}
          hint={t.statRegisteredHint}
        />
        <Stat
          label={t.statLinkedAccounts}
          value={(stats.linkedAccounts || realAcIds.length).toString()}
        />
        <Stat
          label={t.statBlocked}
          value={(
            stats.blockedAcIds || realAcIds.filter((a: any) => a.isBlocked).length
          ).toString()}
        />
      </div>
      <Panel title={t.panelTitle} desc={t.panelDesc}>
        <Toolbar
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={setSearchQuery}
          onExport={handleExport}
        />
        {filtered.length === 0 ? (
          <p className="py-6 text-center text-[12px] text-muted-foreground">{t.empty}</p>
        ) : (
          <Table
            cols="1fr 1.2fr .8fr .8fr .8fr"
            head={[t.colAcId, t.colPlayer, t.colSessions, t.colAlerts, t.colStatus]}
            rows={filtered.map((ac: any, idx: number) => [
              <span className="font-mono text-[11.5px]" key={`acid-${idx}`}>
                {ac.acid}
              </span>,
              ac.name || t.unknownPlayer,
              `${ac.sessionsCount || 1}`,
              `${ac.alertsCount || 0}`,
              <Tag
                tone={ac.status && ac.status !== "Limpo" ? "warning" : "success"}
                key={`tag-${idx}`}
              >
                {statusLabel(ac.status || "Limpo", lang)}
              </Tag>,
            ])}
          />
        )}
      </Panel>
    </div>
  );
}

const AI_MODE_LABELS: Record<string, string> = {
  shadow: "Sombra (só registra)",
  development: "Desenvolvimento (teste)",
};

const AI_RISK_TONE: Record<string, TagTone> = { LOW: "success", MEDIUM: "warning", HIGH: "warning", CRITICAL: "critical" };
const AI_DECISION_TONE: Record<string, TagTone> = { IGNORE: "neutral", REVIEW: "warning", FLAG: "critical" };

export function GoatAi() {
  const [aiConfig, setAiConfig] = useState<AiConfigType | null>(null);
  const [form, setForm] = useState<AiConfigType | null>(null);
  const [decisions, setDecisions] = useState<AiDecisionType[]>([]);
  const [analysesById, setAnalysesById] = useState<Record<string, AiAnalysisType>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const activeId = localStorage.getItem("goat_active_server_id");
    if (!activeId) {
      setLoading(false);
      return;
    }
    Promise.all([api.getAiConfig(activeId), api.getAiDecisions(activeId), api.getAiAnalyses(activeId)])
      .then(([configRes, decisionsList, analysesList]) => {
        setAiConfig(configRes);
        setForm(configRes);
        setDecisions(decisionsList);
        const map: Record<string, AiAnalysisType> = {};
        analysesList.forEach((a) => {
          map[a._id] = a;
        });
        setAnalysesById(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const salvarConfig = async () => {
    const activeId = localStorage.getItem("goat_active_server_id");
    if (!activeId || !form) return;
    setSaving(true);
    try {
      const atualizado = await api.updateAiConfig(activeId, form);
      setAiConfig(atualizado);
      setForm(atualizado);
    } catch {
      // erro já vira mensagem genérica pelo safeFetchJson - sem toast dedicado aqui ainda
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Panel title="GOAT AI" desc="Camada de análise por IA sobre as detecções tradicionais.">
        <p className="py-8 text-center text-[12px] text-muted-foreground">Carregando...</p>
      </Panel>
    );
  }

  if (!aiConfig || !form) {
    return (
      <Panel title="GOAT AI" desc="Camada de análise por IA sobre as detecções tradicionais.">
        <p className="py-8 text-center text-[12px] text-muted-foreground">Selecione um servidor pra ver o GOAT AI.</p>
      </Panel>
    );
  }

  const confiancas = decisions.map((d) => d.aiConfidence).filter((c): c is number => typeof c === "number");
  const confiancaMedia = confiancas.length ? Math.round((confiancas.reduce((a, b) => a + b, 0) / confiancas.length) * 100) : null;
  const altoRisco = decisions.filter((d) => {
    const a = analysesById[d.analysisId];
    return a?.riskLevel === "HIGH" || a?.riskLevel === "CRITICAL";
  }).length;

  const decisaoExpandida = expandedId ? decisions.find((d) => d._id === expandedId) : null;
  const analiseExpandida = decisaoExpandida ? analysesById[decisaoExpandida.analysisId] : null;

  return (
    <div className="flex flex-col gap-4">
      <Panel
        title="GOAT AI"
        desc="Camada de análise por IA sobre as detecções tradicionais - só recomenda, quem decide é o motor de risco determinístico. Hoje roda em modo sombra: nunca executa punição sozinha."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Status" value={aiConfig.enabled ? "Ativo" : "Desligado"} hint={AI_MODE_LABELS[aiConfig.mode]} />
          <Stat label="Decisões registradas" value={String(decisions.length)} />
          <Stat label="Alto risco (HIGH/CRITICAL)" value={String(altoRisco)} />
          <Stat label="Confiança média da IA" value={confiancaMedia !== null ? `${confiancaMedia}%` : "—"} />
        </div>
      </Panel>

      <Panel title="Configuração" desc="Liga/desliga a análise por IA pra este servidor e ajusta os pesos do motor de risco.">
        <MriCard className="flex flex-col gap-4 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[13px] font-medium">GOAT AI ativado</p>
              <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                Sem isso, nenhuma detecção é analisada pela IA - o anticheat tradicional continua igual de qualquer forma.
              </p>
            </div>
            <MriToggle checked={form.enabled} onChange={() => setForm({ ...form, enabled: !form.enabled })} ariaLabel="GOAT AI ativado" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Modo</span>
              <select
                value={form.mode}
                onChange={(e) => setForm({ ...form, mode: e.target.value as AiConfigType["mode"] })}
                className="w-full rounded-lg border border-border bg-card/60 px-3 py-2 text-[13px] text-foreground outline-none focus:border-gold/50"
              >
                <option value="shadow">Sombra (só registra)</option>
                <option value="development">Desenvolvimento (teste)</option>
              </select>
            </label>
            <MriInput
              label="Score mínimo pra analisar"
              type="number"
              value={form.minScoreToAnalyze}
              onChange={(e) => setForm({ ...form, minScoreToAnalyze: Number(e.target.value) })}
            />
            <MriInput
              label="Cooldown entre análises (segundos)"
              type="number"
              value={form.analysisCooldownSec}
              onChange={(e) => setForm({ ...form, analysisCooldownSec: Number(e.target.value) })}
            />
            <MriInput
              label="Limite de requisições/minuto"
              type="number"
              value={form.maxRequestsPerMinute}
              onChange={(e) => setForm({ ...form, maxRequestsPerMinute: Number(e.target.value) })}
            />
          </div>

          <div className="border-t border-hairline pt-3">
            <p className="mb-2 text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">Pesos do motor de risco</p>
            <div className="grid gap-3 sm:grid-cols-4">
              <MriInput
                label="Tradicional"
                type="number"
                step="0.05"
                value={form.weights.traditional}
                onChange={(e) => setForm({ ...form, weights: { ...form.weights, traditional: Number(e.target.value) } })}
              />
              <MriInput
                label="IA"
                type="number"
                step="0.05"
                value={form.weights.ai}
                onChange={(e) => setForm({ ...form, weights: { ...form.weights, ai: Number(e.target.value) } })}
              />
              <MriInput
                label="Evidência"
                type="number"
                step="0.05"
                value={form.weights.evidence}
                onChange={(e) => setForm({ ...form, weights: { ...form.weights, evidence: Number(e.target.value) } })}
              />
              <MriInput
                label="Histórico"
                type="number"
                step="0.05"
                value={form.weights.history}
                onChange={(e) => setForm({ ...form, weights: { ...form.weights, history: Number(e.target.value) } })}
              />
            </div>
          </div>

          <div className="border-t border-hairline pt-3">
            <p className="mb-2 text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Limiares de ação automática{" "}
              <span className="normal-case text-muted-foreground/70">(ainda sem efeito - a IA nunca executa punição sozinha nesta versão)</span>
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <MriInput
                label="Auto-flag"
                type="number"
                step="0.05"
                value={form.autoFlagThreshold}
                onChange={(e) => setForm({ ...form, autoFlagThreshold: Number(e.target.value) })}
              />
              <MriInput
                label="Auto-kick"
                type="number"
                step="0.05"
                value={form.autoKickThreshold}
                onChange={(e) => setForm({ ...form, autoKickThreshold: Number(e.target.value) })}
              />
              <MriInput
                label="Auto-ban"
                type="number"
                step="0.05"
                value={form.autoBanThreshold}
                onChange={(e) => setForm({ ...form, autoBanThreshold: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <MriButton onClick={salvarConfig} disabled={saving}>
              {saving ? "Salvando..." : "Salvar configuração"}
            </MriButton>
          </div>
        </MriCard>
      </Panel>

      <Panel title="Decisões recentes" desc="Cada linha combina o score tradicional com a recomendação da IA - clique na data pra ver os detalhes da análise.">
        {decisions.length === 0 ? (
          <p className="py-8 text-center text-[12px] text-muted-foreground">Nenhuma decisão registrada ainda.</p>
        ) : (
          <Table
            cols="1fr .8fr .8fr .8fr .8fr 1fr"
            head={["Jogador", "Decisão", "Score Final", "Confiança IA", "Score Tradicional", "Quando"]}
            rows={decisions.map((d) => [
              <span className="font-mono text-[11.5px] text-muted-foreground" key={`acid-${d._id}`}>
                {d.playerAcId}
              </span>,
              <Tag tone={AI_DECISION_TONE[d.decision] || "neutral"} key={`decision-${d._id}`}>
                {d.decision}
              </Tag>,
              d.finalScore.toFixed(1),
              typeof d.aiConfidence === "number" ? `${Math.round(d.aiConfidence * 100)}%` : "—",
              d.traditionalScore.toFixed(1),
              <button
                key={`open-${d._id}`}
                onClick={() => setExpandedId(expandedId === d._id ? null : d._id)}
                className="text-[11.5px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {formatDateTime(d.createdAt)}
              </button>,
            ])}
          />
        )}

        {decisaoExpandida && analiseExpandida && (
          <MriCard className="mt-4 flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[13px] font-medium">Análise de {decisaoExpandida.playerAcId}</p>
              {analiseExpandida.riskLevel && <Tag tone={AI_RISK_TONE[analiseExpandida.riskLevel] || "neutral"}>{analiseExpandida.riskLevel}</Tag>}
            </div>
            {analiseExpandida.status !== "COMPLETED" ? (
              <p className="text-[12px] text-muted-foreground">
                Análise não concluída ({analiseExpandida.status}) — {analiseExpandida.errorMessage || "sem detalhes adicionais"}.
              </p>
            ) : (
              <>
                <p className="text-[12.5px] leading-relaxed text-foreground/80">{analiseExpandida.summary}</p>
                {analiseExpandida.reasonCodes && analiseExpandida.reasonCodes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {analiseExpandida.reasonCodes.map((code) => (
                      <span key={code} className="rounded-full border border-border bg-card/60 px-2.5 py-1 font-mono text-[10.5px] text-muted-foreground">
                        {code}
                      </span>
                    ))}
                  </div>
                )}
                {analiseExpandida.evidenceAssessment && analiseExpandida.evidenceAssessment.length > 0 && (
                  <div className="flex flex-col gap-1.5 border-t border-hairline pt-3">
                    {analiseExpandida.evidenceAssessment.map((ev, i) => (
                      <div key={i} className="flex items-start justify-between gap-3 text-[11.5px]">
                        <span className="text-foreground/80">{ev.assessment}</span>
                        <span className="shrink-0 font-mono text-muted-foreground">{Math.round(ev.weight * 100)}%</span>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-[10.5px] text-muted-foreground">
                  Modelo: {analiseExpandida.model} · Risco de falso positivo:{" "}
                  {typeof analiseExpandida.falsePositiveRisk === "number" ? `${Math.round(analiseExpandida.falsePositiveRisk * 100)}%` : "—"} ·{" "}
                  {formatDateTime(analiseExpandida.createdAt)}
                </p>
              </>
            )}
          </MriCard>
        )}
      </Panel>
    </div>
  );
}

export function Wall() {
  const [notes, setNotes] = useState<any[]>([]);
  const activeId = localStorage.getItem("goat_active_server_id") || undefined;
  const dialog = useDialog();
  const { lang } = useLanguage();
  const t = (lang === "pt" ? pt : en).wall;

  const load = () => {
    if (activeId) api.getServerWallNotes(activeId).then((n) => setNotes(n));
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async () => {
    if (!activeId) return;
    const result = await dialog.form({
      title: t.newNoteTitle,
      fields: [
        { key: "title", label: t.fieldTitleLabel, placeholder: t.fieldTitlePlaceholder },
        {
          key: "content",
          label: t.fieldContentLabel,
          placeholder: t.fieldContentPlaceholder,
          multiline: true,
        },
      ],
      confirmLabel: t.publish,
    });
    if (!result || !result.title || !result.content) return;
    try {
      await api.createWallNote(activeId, { title: result.title, content: result.content });
      load();
    } catch (err) {
      console.error("Failed to create wall note:", err);
      await dialog.notify({
        description: err instanceof Error ? err.message : t.errorPublishFallback,
        tone: "error",
      });
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!activeId) return;
    try {
      await api.deleteWallNote(activeId, noteId);
      load();
    } catch (err) {
      console.error("Failed to delete wall note:", err);
    }
  };

  return (
    <Panel
      title={t.panelTitle}
      desc={t.panelDesc}
      action={
        <MriButton variant="primary" size="sm" onClick={handleAdd}>
          {t.newNoteButton}
        </MriButton>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        {notes.length === 0 && (
          <p className="col-span-3 text-[12px] text-muted-foreground text-center py-8">
            {t.empty}
          </p>
        )}
        {notes.map((note: any) => (
          <MriCard key={note._id || note.title} className="p-5 hover:bg-elevated">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {note.title}
              </p>
              <button
                onClick={() => handleDelete(note._id)}
                className="shrink-0 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {t.delete}
              </button>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed">{note.content}</p>
          </MriCard>
        ))}
      </div>
    </Panel>
  );
}

export function Wipe() {
  const [busy, setBusy] = useState<string | null>(null);
  const [deletedCount, setDeletedCount] = useState<number | null>(null);
  const [pendingWipes, setPendingWipes] = useState<any[]>([]);
  const [maintenanceHistory, setMaintenanceHistory] = useState<any[]>([]);
  const activeId = localStorage.getItem("goat_active_server_id") || undefined;
  const dialog = useDialog();
  const { lang } = useLanguage();
  const t = (lang === "pt" ? pt : en).wipe;
  const MAINTENANCE_STATUS_LABEL: Record<string, string> = {
    pending: t.maintStatusPending,
    delivered: t.maintStatusDelivered,
    executed: t.maintStatusExecuted,
    failed: t.maintStatusFailed,
  };
  const MAINTENANCE_OPS = [
    { type: "orphan_cleanup" as const, title: t.opOrphanTitle, desc: t.opOrphanDesc },
    { type: "session_reset" as const, title: t.opSessionTitle, desc: t.opSessionDesc },
  ];
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("goat_user") || "{}");
    } catch {
      return {};
    }
  })();

  const loadPending = () => {
    if (activeId) api.getPendingEvidenceWipes(activeId).then((r) => setPendingWipes(r));
  };

  const loadMaintenanceHistory = () => {
    if (activeId) api.getMaintenanceHistory(activeId).then((r) => setMaintenanceHistory(r));
  };

  useEffect(() => {
    loadPending();
    loadMaintenanceHistory();
  }, []);

  useEffect(() => {
    const hasActive = maintenanceHistory.some(
      (c: any) => c.status === "pending" || c.status === "delivered",
    );
    if (!hasActive) return;
    const timer = setInterval(loadMaintenanceHistory, 5000);
    return () => clearInterval(timer);
  }, [maintenanceHistory]);

  const latestMaintenance = (type: string) => maintenanceHistory.find((c: any) => c.type === type);

  const handleMaintenanceOp = async (type: "orphan_cleanup" | "session_reset") => {
    if (!activeId) return;
    setBusy(type);
    try {
      await api.requestMaintenanceOperation(activeId, type);
      loadMaintenanceHistory();
    } catch (err) {
      console.error(`Failed to request maintenance op ${type}:`, err);
      await dialog.notify({
        description: err instanceof Error ? err.message : t.errorMaintenanceFallback,
        tone: "error",
      });
    } finally {
      setBusy(null);
    }
  };

  const handleWipeDetectionsCache = async () => {
    if (!activeId) return;
    const ok = await dialog.confirm({
      title: t.confirmWipeCacheTitle,
      description: t.confirmWipeCacheDesc,
      confirmLabel: t.confirmWipeCacheLabel,
      danger: true,
    });
    if (!ok) return;
    setBusy("cache");
    try {
      const res = await api.wipeDetectionsCache(activeId);
      setDeletedCount(res.deletedCount ?? 0);
    } catch (err) {
      console.error("Failed to wipe detections cache:", err);
      await dialog.notify({
        description: err instanceof Error ? err.message : t.errorWipeCacheFallback,
        tone: "error",
      });
    } finally {
      setBusy(null);
    }
  };

  const handleRequestEvidenceWipe = async () => {
    if (!activeId) return;
    setBusy("evidence-request");
    try {
      await api.requestEvidenceWipe(activeId);
      loadPending();
    } catch (err) {
      console.error("Failed to request evidence wipe:", err);
      await dialog.notify({
        description: err instanceof Error ? err.message : t.errorRequestEvidenceFallback,
        tone: "error",
      });
    } finally {
      setBusy(null);
    }
  };

  const handleApproveEvidenceWipe = async (requestId: string) => {
    if (!activeId) return;
    const ok = await dialog.confirm({
      title: t.confirmApproveTitle,
      description: t.confirmApproveDesc,
      confirmLabel: t.confirmApproveLabel,
      danger: true,
    });
    if (!ok) return;
    setBusy(requestId);
    try {
      await api.approveEvidenceWipe(activeId, requestId);
      loadPending();
    } catch (err) {
      console.error("Failed to approve evidence wipe:", err);
      await dialog.notify({
        description: err instanceof Error ? err.message : t.errorApproveFallback,
        tone: "error",
      });
    } finally {
      setBusy(null);
    }
  };

  const myPendingRequest = pendingWipes.find((r: any) => r.requestedBy?.userId === currentUser.id);
  const othersPendingRequests = pendingWipes.filter(
    (r: any) => r.requestedBy?.userId !== currentUser.id,
  );

  return (
    <div className="space-y-5">
      <Panel title={t.panelTitle} desc={t.panelDesc}>
        <div className="grid gap-3 md:grid-cols-2">
          <MriCard className="flex items-center gap-4 p-5 hover:bg-elevated">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] border border-hairline text-foreground/70">
              <Database className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium">{t.cacheCardTitle}</p>
              <p className="mt-1 text-[12px] text-muted-foreground">
                {t.cacheCardDesc}
                {deletedCount !== null && t.cacheCardLastRun(deletedCount)}
              </p>
            </div>
            <MriButton variant="outline" onClick={handleWipeDetectionsCache} disabled={busy === "cache"}>
              {t.run}
            </MriButton>
          </MriCard>

          {MAINTENANCE_OPS.map(({ type, title, desc }) => {
            const latest = latestMaintenance(type);
            const status = latest?.status;
            const isRunning = status === "pending" || status === "delivered";
            const resultDetail =
              status === "executed" && latest?.result && typeof latest.result === "object"
                ? Object.entries(latest.result)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(", ")
                : null;
            return (
              <MriCard key={type} className="flex items-center gap-4 p-5 hover:bg-elevated">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] border border-hairline text-foreground/70">
                  <Database className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium">{title}</p>
                  <p className="mt-1 text-[12px] text-muted-foreground">
                    {desc}
                    {status && (
                      <span className="text-foreground/70">
                        {" "}
                        {MAINTENANCE_STATUS_LABEL[status]}
                      </span>
                    )}
                    {resultDetail && ` (${resultDetail})`}
                    {status === "failed" && latest?.failReason && ` — ${latest.failReason}`}
                  </p>
                </div>
                <MriButton
                  variant="outline"
                  onClick={() => handleMaintenanceOp(type)}
                  disabled={busy === type || isRunning}
                >
                  {isRunning ? t.running : t.run}
                </MriButton>
              </MriCard>
            );
          })}

          <MriCard className="flex items-center gap-4 border-red-500/20 bg-red-500/[0.03] p-5 hover:bg-red-500/[0.06]">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] border border-red-500/30 bg-red-500/10 text-red-400">
              <Trash2 className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-medium">{t.totalWipeTitle}</p>
                <Tag tone="critical">{t.irreversible}</Tag>
              </div>
              <p className="mt-1 text-[12px] text-muted-foreground">{t.totalWipeDesc}</p>
              {myPendingRequest && (
                <p className="mt-1 text-[11.5px] text-muted-foreground/80">{t.pendingNotice}</p>
              )}
            </div>
            <MriButton
              variant="danger-outline"
              onClick={handleRequestEvidenceWipe}
              disabled={busy === "evidence-request" || !!myPendingRequest}
            >
              {myPendingRequest ? t.pending : t.requestWipe}
            </MriButton>
          </MriCard>
        </div>
      </Panel>

      {othersPendingRequests.length > 0 && (
        <Panel title={t.pendingApprovalsTitle} desc={t.pendingApprovalsDesc}>
          <div className="space-y-3">
            {othersPendingRequests.map((r: any) => (
              <MriCard
                key={r._id}
                className="flex items-center justify-between gap-4 border-red-500/20 bg-red-500/[0.03] p-4"
              >
                <div>
                  <p className="text-[12.5px] font-medium">
                    {t.requestedBy(r.requestedBy?.username)}
                  </p>
                  <p className="mt-1 text-[11.5px] text-muted-foreground">
                    {formatDateTime(r.requestedAt, lang)}
                  </p>
                </div>
                <MriButton
                  variant="danger-outline"
                  onClick={() => handleApproveEvidenceWipe(r._id)}
                  disabled={busy === r._id}
                >
                  {t.approve}
                </MriButton>
              </MriCard>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}

export function Staff() {
  const [realStaff, setRealStaff] = useState<any[]>([]);
  const activeId = localStorage.getItem("goat_active_server_id") || undefined;
  const dialog = useDialog();
  const { lang } = useLanguage();
  const t = (lang === "pt" ? pt : en).staff;

  const load = () => {
    if (activeId) api.getServerStaff(activeId).then((s) => setRealStaff(s));
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async () => {
    if (!activeId) return;
    const result = await dialog.form({
      title: t.addMemberTitle,
      fields: [
        { key: "username", label: t.usernameLabel },
        { key: "role", label: t.roleLabel, placeholder: t.rolePlaceholder, defaultValue: t.roleDefault },
      ],
      confirmLabel: t.addConfirm,
    });
    if (!result || !result.username) return;
    try {
      await api.addServerStaff(activeId, {
        username: result.username,
        role: result.role || t.roleDefault,
      });
      load();
    } catch (err) {
      console.error("Failed to add staff member:", err);
      await dialog.notify({
        description: err instanceof Error ? err.message : t.errorAddFallback,
        tone: "error",
      });
    }
  };

  const handleRemove = async (staffId: string) => {
    if (!activeId) return;
    const ok = await dialog.confirm({
      title: t.removeTitle,
      description: t.removeDesc,
      confirmLabel: t.removeConfirm,
      danger: true,
    });
    if (!ok) return;
    try {
      await api.removeServerStaff(activeId, staffId);
      load();
    } catch (err) {
      console.error("Failed to remove staff member:", err);
      await dialog.notify({
        description: err instanceof Error ? err.message : t.errorRemoveFallback,
        tone: "error",
      });
    }
  };

  return (
    <Panel
      title={t.panelTitle}
      desc={t.panelDesc}
      action={
        <MriButton variant="primary" size="sm" onClick={handleAdd}>
          {t.addMemberButton}
        </MriButton>
      }
    >
      <Toolbar placeholder={t.searchPlaceholder} />
      {realStaff.length === 0 ? (
        <p className="py-6 text-center text-[12px] text-muted-foreground">{t.empty}</p>
      ) : (
        <Table
          cols="1.2fr 1fr 1fr .6fr"
          head={[t.colName, t.colRole, t.colSince, t.colAction]}
          rows={realStaff.map((s: any) => [
            s.username,
            <span className="text-muted-foreground" key="role">
              {s.role}
            </span>,
            <span className="text-muted-foreground" key="joined">
              {formatDate(s.joinedAt, lang)}
            </span>,
            <button
              key="remove"
              onClick={() => handleRemove(s._id)}
              className="text-[11.5px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.remove}
            </button>,
          ])}
        />
      )}
    </Panel>
  );
}

export function Permissions() {
  const [roles, setRoles] = useState<any[]>([]);
  const { lang } = useLanguage();
  const t = (lang === "pt" ? pt : en).permissions;
  const PERMS = t.permsList;

  useEffect(() => {
    const ROLES = [
      { role: t.roleHeadOfStaff, grants: [true, true, true, true, true] },
      { role: t.roleAdmin, grants: [true, true, true, true, false] },
      { role: t.roleModerator, grants: [true, true, true, false, false] },
      { role: t.roleSupport, grants: [true, false, true, false, false] },
    ];
    setRoles(ROLES);
  }, [lang]);

  return (
    <Panel title={t.panelTitle} desc={t.panelDesc}>
      <Table
        cols={`1.2fr repeat(${PERMS.length}, .8fr)`}
        head={[t.colRole, ...PERMS]}
        rows={roles.map((r, index) => [
          <span className="font-medium" key="role">
            {r.role}
          </span>,
          ...r.grants.map((g: boolean, i: number) =>
            g ? (
              <Check className="h-4 w-4" key={`check-${index}-${i}`} />
            ) : (
              <X className="h-4 w-4 text-muted-foreground/60" key={`cross-${index}-${i}`} />
            ),
          ),
        ])}
      />
    </Panel>
  );
}

export function Notifications() {
  const [server, setServer] = useState<ServerItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { lang } = useLanguage();
  const t = (lang === "pt" ? pt : en).notifications;
  const ALERT_TOGGLES: {
    key: "detections" | "bans" | "critical" | "offline";
    label: string;
    desc: string;
  }[] = [
    { key: "detections", label: t.toggleDetectionsLabel, desc: t.toggleDetectionsDesc },
    { key: "bans", label: t.toggleBansLabel, desc: t.toggleBansDesc },
    { key: "critical", label: t.toggleCriticalLabel, desc: t.toggleCriticalDesc },
    { key: "offline", label: t.toggleOfflineLabel, desc: t.toggleOfflineDesc },
  ];

  useEffect(() => {
    const activeId = localStorage.getItem("goat_active_server_id");
    if (!activeId) {
      setLoading(false);
      return;
    }
    api.getServerById(activeId).then((s) => {
      setServer(s);
      setLoading(false);
    });
  }, []);

  const handleToggle = async (key: string) => {
    if (!server) return;
    const currentAlerts = server.notifications?.alerts || {};
    const nextAlerts = {
      ...currentAlerts,
      [key]: !currentAlerts[key as keyof typeof currentAlerts],
    };
    setServer({
      ...server,
      notifications: { ...(server.notifications || {}), alerts: nextAlerts },
    });
    setSaving(key);
    try {
      await api.updateServerNotifications(server._id, {
        discordWebhook: server.notifications?.discordWebhook || "",
        alerts: nextAlerts,
      });
    } catch (err) {
      console.error("Failed to update notification alert:", err);
    } finally {
      setSaving(null);
    }
  };

  if (loading)
    return <div className="p-8 text-muted-foreground text-[13px]">{t.loading}</div>;
  if (!server)
    return <div className="p-8 text-muted-foreground text-[13px]">{t.noServer}</div>;

  const alerts = server.notifications?.alerts || {};
  const hasWebhook = !!server.notifications?.discordWebhook;

  return (
    <div className="space-y-5">
      <Panel title={t.panelAlertsTitle} desc={t.panelAlertsDesc}>
        <div className="space-y-3">
          {ALERT_TOGGLES.map((a) => {
            const enabled = alerts[a.key] ?? true;
            return (
              <MriCard key={a.key} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[13px] font-medium">{a.label}</p>
                  <p className="mt-1 text-[12px] text-muted-foreground">{a.desc}</p>
                </div>
                <MriToggle
                  checked={enabled}
                  onChange={() => handleToggle(a.key)}
                  disabled={saving === a.key}
                  ariaLabel={t.toggleAria(a.label)}
                  offTone="neutral"
                />
              </MriCard>
            );
          })}
        </div>
      </Panel>
      <Panel title={t.panelIntegrationsTitle} desc={t.panelIntegrationsDesc}>
        <div className="grid gap-3 sm:grid-cols-3">
          <MriCard>
            <p className="text-[13px] font-medium">{t.discordWebhook}</p>
            <p className="mt-1 text-[11.5px] text-muted-foreground">
              {hasWebhook ? t.connected : t.notConfigured}
            </p>
          </MriCard>
          <MriCard className="opacity-60">
            <p className="text-[13px] font-medium">{t.email}</p>
            <p className="mt-1 text-[11.5px] text-muted-foreground">{t.emailUnavailable}</p>
          </MriCard>
          <MriCard>
            <p className="text-[13px] font-medium">{t.apiGoat}</p>
            <p className="mt-1 text-[11.5px] text-muted-foreground">
              {server.licenseKey ? t.apiActive : t.apiNoKey}
            </p>
          </MriCard>
        </div>
      </Panel>
    </div>
  );
}

import { SettingsTabs } from "./SettingsTabs";

export function Settings() {
  return <SettingsTabs />;
}

export function System() {
  const [server, setServer] = useState<ServerItem | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [pendingSpawns, setPendingSpawns] = useState(0);
  const [lastBanSync, setLastBanSync] = useState<string | null>(null);
  const [evidenceDbOk, setEvidenceDbOk] = useState(true);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());
  const { connected } = useSocket();
  const { lang } = useLanguage();
  const t = (lang === "pt" ? pt : en).system;

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const activeId = localStorage.getItem("goat_active_server_id");
    if (!activeId) {
      setLoading(false);
      return;
    }

    const start = performance.now();
    api.getServerById(activeId).then((s) => {
      setLatency(Math.round(performance.now() - start));
      setServer(s);
      setLoading(false);
    });

    api.getSpawnHistory(activeId).then((history) => {
      setPendingSpawns(history.filter((c: any) => c.status === "pending").length);
    });

    api
      .getServerBans(activeId)
      .then((bans) => {
        setEvidenceDbOk(true);
        if (bans.length > 0) {
          const latest = bans.reduce((acc: any, b: any) =>
            new Date(b.createdAt) > new Date(acc.createdAt) ? b : acc,
          );
          setLastBanSync(latest.createdAt);
        }
      })
      .catch(() => setEvidenceDbOk(false));
  }, []);

  if (loading) return <div className="p-8 text-muted-foreground text-[13px]">{t.loading}</div>;
  if (!server) return <div className="p-8 text-muted-foreground text-[13px]">{t.noServer}</div>;

  const hbAge = server.lastHeartbeat ? now - new Date(server.lastHeartbeat).getTime() : Infinity;
  const isOnline = server.status === "online" && hbAge < 35000;
  const uptimeMs =
    isOnline && server.onlineSince ? now - new Date(server.onlineSince).getTime() : 0;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label={t.statVersion}
          value={server.version || "GOAT AC 1.0.0"}
          hint={server.protocolVersion ? t.protocolHint(server.protocolVersion) : undefined}
        />
        <Stat
          label={t.statHealth}
          value={isOnline ? "100%" : "0%"}
          hint={
            isOnline
              ? server.watchdogStatus === "HEALTHY"
                ? t.allModulesResponding
                : server.watchdogStatus
              : t.serverDisconnected
          }
        />
        <Stat
          label={t.statApiLatency}
          value={latency !== null ? `${latency}ms` : "—"}
          hint={t.apiLatencyHint}
        />
        <Stat label={t.statUptime} value={isOnline ? formatDuration(uptimeMs, lang) : t.offline} />
      </div>
      <Panel title={t.panelTitle} desc={t.panelDesc}>
        <div className="space-y-3 text-[12.5px]">
          {[
            [t.rowBackendConn, connected ? t.stable : t.disconnected],
            [t.rowBanSync, lastBanSync ? formatRelativeTime(lastBanSync, lang) : t.noBanSynced],
            [t.rowFileSignature, t.fileSignatureValue],
            [t.rowEvidenceDb, evidenceDbOk ? t.operational : t.unavailable],
            [t.rowQueue, t.pendingSuffix(pendingSpawns)],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex items-center justify-between border-b border-border/60 pb-3 last:border-0"
            >
              <span className="text-muted-foreground">{k}</span>
              <span className="font-medium">{v}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export function License() {
  const [server, setServer] = useState<ServerItem | null>(null);
  const [license, setLicense] = useState<LicenseItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();
  const t = (lang === "pt" ? pt : en).license;

  useEffect(() => {
    Promise.all([api.getServers(), api.getLicenses()]).then(([servers, licenses]) => {
      const activeId = localStorage.getItem("goat_active_server_id");
      const selected = servers.find((s) => s._id === activeId) || servers[0] || null;
      setServer(selected);
      setLicense(resolveLicenseForServer(selected, licenses));
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-muted-foreground text-[13px]">{t.loading}</div>;
  if (!server) return <div className="p-8 text-muted-foreground text-[13px]">{t.noServer}</div>;

  const planLabel = (license?.plan || server.plan || "pro").toUpperCase();
  const isActive = (license?.status || "active") === "active";

  return (
    <div className="space-y-5">
      <Panel title={t.panelActiveTitle}>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <p className="text-[18px] font-semibold tracking-tight">{planLabel} GOAT</p>
            </div>
            <p className="mt-2 text-[12.5px] text-muted-foreground">
              {license?.expiresAt
                ? t.validUntil(formatDate(license.expiresAt, lang))
                : t.activeNoExpiry}
            </p>
          </div>
          <Tag solid={isActive}>{isActive ? t.active : license?.status || t.active}</Tag>
        </div>
        <div className="hairline-x my-6" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [t.infoKey, license?.key || server.licenseKey || "—"],
            [t.infoActivatedOn, formatDate(license?.createdAt || server.createdAt, lang)],
            [t.infoValidity, license?.expiresAt ? formatDate(license.expiresAt, lang) : t.lifetime],
            [t.infoLinkedServer, server.name],
          ].map(([k, v]) => (
            <div key={k} className="min-w-0 border-l border-border pl-4">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{k}</p>
              <p className="mt-1.5 text-[13px] font-medium break-all">{v}</p>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title={t.panelPlansTitle} desc={t.panelPlansDesc}>
        <div className="grid gap-3 sm:grid-cols-3">
          {t.plans.map((plan) => (
            <a
              key={plan.name}
              href="/products"
              className="rounded-xl border border-border p-4 transition-colors hover:bg-elevated"
            >
              <p className="text-[13px] font-medium">{plan.name}</p>
              <p className="mt-1 text-[12px] text-muted-foreground">{plan.price}</p>
            </a>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export function Docs() {
  const { lang } = useLanguage();
  const t = (lang === "pt" ? pt : en).docs;
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {t.items.map((item) => (
        <a
          key={item.title}
          href="/dashboard/documentacao"
          className="group rounded-2xl border border-border bg-card/30 p-5 transition-colors hover:border-foreground/30 hover:bg-elevated"
        >
          <p className="text-[13.5px] font-semibold tracking-tight">{item.title}</p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">{item.desc}</p>
          <span className="mt-4 inline-block text-[12px] text-muted-foreground transition-colors group-hover:text-foreground">
            {t.readDocs} →
          </span>
        </a>
      ))}
    </div>
  );
}

export const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  jogadores: Players,
  deteccoes: Detections,
  evidencias: Evidence,
  banimentos: () => <Bans />,
  protecoes: Protections,
  nucleo: Nucleo,
  punicoes: Punicoes,
  "goat-ai": GoatAi,
  eventos: Events,
  "global-ban": () => <Bans globalOnly />,
  "ac-id": AcId,
  wall: Wall,
  wipe: Wipe,
  staff: Staff,
  permissoes: Permissions,
  notificacoes: Notifications,
  configuracoes: Settings,
  sistema: System,
  licenca: License,
  documentacao: Docs,
};
