// Metadados dos campos de Núcleo (GOAT.Config.Core) e Punições
// (GOAT.Config.Punishment) - copiados 1:1 de
// goat_ac/server/modules_metadata.lua (GOAT_AC_METADATA.core/.punishment),
// pra web e painel in-game mostrarem exatamente os mesmos campos.
// `Security.*` fica de fora de propósito - proteção interna do próprio
// anticheat contra manipulação, nunca editável por nenhum dashboard.

export type ConfigFieldType = "boolean" | "number" | "select" | "text";

export type ConfigField = {
  key: string;
  label: string;
  help: string;
  type: ConfigFieldType;
  options?: string[];
};

export type ConfigFieldGroup = {
  key: string;
  label: string;
  fields: ConfigField[];
};

export const CORE_FIELD_GROUPS: ConfigFieldGroup[] = [
  {
    key: "geral",
    label: "Geral",
    fields: [
      {
        key: "GlobalBan",
        type: "boolean",
        label: "Banimento global",
        help: "Quando ativo, um ban por trapaça neste servidor também bane em todos os servidores que usam o GOAT AntiCheat. O ban local sempre acontece de qualquer forma.",
      },
    ],
  },
  {
    key: "heartbeat",
    label: "Heartbeat",
    fields: [
      {
        key: "Heartbeat.BaseIntervalMs",
        type: "number",
        label: "Intervalo do heartbeat (ms)",
        help: "De quanto em quanto tempo o servidor confirma que está online e sincroniza config com o backend.",
      },
      {
        key: "Heartbeat.JitterMaxMs",
        type: "number",
        label: "Variação aleatória (ms)",
        help: "Pequena variação no intervalo pra não sobrecarregar o backend com todos os servidores mandando ao mesmo tempo.",
      },
      {
        key: "Heartbeat.MaxMissedBeats",
        type: "number",
        label: "Heartbeats perdidos até alertar",
        help: "Quantos heartbeats seguidos podem falhar antes de considerar que há um problema.",
      },
      {
        key: "Heartbeat.GracePeriodMs",
        type: "number",
        label: "Período de tolerância (ms)",
        help: "Tempo de espera antes de agir sobre um heartbeat perdido.",
      },
      {
        key: "Heartbeat.MaxLatencyMs",
        type: "number",
        label: "Latência máxima (ms)",
        help: "Acima disso a conexão com o backend é considerada lenta/instável.",
      },
    ],
  },
  {
    key: "watchdog",
    label: "Watchdog",
    fields: [
      {
        key: "Watchdog.Enabled",
        type: "boolean",
        label: "Watchdog ativo",
        help: "Monitora se os próprios módulos do anticheat estão saudáveis (travados, consumindo CPU demais etc).",
      },
      {
        key: "Watchdog.MaxModuleExecutionMs",
        type: "number",
        label: "Tempo máximo de execução de um módulo (ms)",
        help: "Acima disso, um módulo é considerado travado.",
      },
      {
        key: "Watchdog.CPUThresholdPercent",
        type: "number",
        label: "Limite de uso de CPU (%)",
        help: "Uso de CPU do processo considerado crítico.",
      },
      {
        key: "Watchdog.AutoMitigate",
        type: "boolean",
        label: "Auto-correção",
        help: "Quando ativo, o watchdog tenta se corrigir sozinho ao detectar um módulo travado.",
      },
      {
        key: "Watchdog.HealthCheckIntervalMs",
        type: "number",
        label: "Intervalo de checagem de saúde (ms)",
        help: "De quanto em quanto tempo o watchdog verifica a saúde dos módulos.",
      },
    ],
  },
  {
    key: "falsos_positivos",
    label: "Falsos Positivos",
    fields: [
      {
        key: "FalsePositiveMitigation.Enabled",
        type: "boolean",
        label: "Mitigação de falso positivo ativa",
        help: "Ajuda a evitar punir jogador injustamente por ping alto, perda de pacote ou FPS baixo.",
      },
      {
        key: "FalsePositiveMitigation.HighPingThreshold",
        type: "number",
        label: "Ping considerado alto (ms)",
        help: "Acima disso o jogador recebe mais tolerância nas detecções.",
      },
      {
        key: "FalsePositiveMitigation.PacketLossTolerancePercent",
        type: "number",
        label: "Perda de pacote tolerada (%)",
        help: "Percentual de perda de pacote considerado normal (internet instável, não trapaça).",
      },
      {
        key: "FalsePositiveMitigation.LowFPSThreshold",
        type: "number",
        label: "FPS considerado baixo",
        help: "Abaixo disso o jogador recebe mais tolerância nas detecções.",
      },
    ],
  },
];

export const PUNISHMENT_FIELDS: ConfigField[] = [
  {
    key: "DefaultAction",
    type: "select",
    options: ["FLAG", "KICK", "BAN"],
    label: "Ação padrão",
    help: "Punição usada quando um módulo não define a própria (raro).",
  },
  {
    key: "DefaultBanDurationDays",
    type: "number",
    label: "Duração padrão de ban temporário (dias)",
    help: "Usado só em banimentos temporários - não afeta banimento permanente.",
  },
  {
    key: "BanMessages.BAN",
    type: "text",
    label: "Mensagem: ban permanente",
    help: "Mostrada ao jogador banido permanentemente. %s vira o ID da detecção.",
  },
  {
    key: "BanMessages.TEMPBAN",
    type: "text",
    label: "Mensagem: ban temporário",
    help: "Mostrada ao jogador banido temporariamente. %d vira os dias, %s o ID da detecção.",
  },
  {
    key: "BanMessages.KICK",
    type: "text",
    label: "Mensagem: kick",
    help: "Mostrada ao jogador desconectado por inconsistência de integridade. %s vira o ID.",
  },
  {
    key: "BanMessages.GLOBAL_BAN",
    type: "text",
    label: "Mensagem: ban global",
    help: "Mostrada quando o banimento é global (rede de servidores GOAT). %s vira o ID da detecção.",
  },
];

export const STAFF_BYPASS_LEVELS = [
  { value: 0, label: "Nenhum" },
  { value: 1, label: "Só monitora" },
  { value: 2, label: "Ignora selecionados" },
  { value: 3, label: "Bypass total" },
];
