// Metadados dos campos "avançados" de cada módulo de proteção - copiados
// 1:1 de goat_ac/server/modules_metadata.lua (mesma curadoria: só os
// campos que valem a pena o cliente ajustar, não a config Lua inteira),
// pra web e painel in-game mostrarem exatamente os mesmos campos.
//
// A chave aqui é o mesmo LuaModuleKey usado em PROTECTION_MODULE_KEYS
// (sections.tsx). Só módulos com campo editável aparecem neste mapa.

export type ProtectionField = {
  key: string;
  label: string;
  help: string;
};

export const PROTECTION_MODULE_FIELDS: Record<string, ProtectionField[]> = {
  AntiAimbot: [
    { key: "aimScoreThreshold", label: "Pontuação de suspeita", help: "Acima disso (0-100) o comportamento de mira é considerado aimbot." },
    { key: "maxSnapAngleDeg", label: 'Ângulo máximo de "snap" (graus)', help: "Quanto a mira pode virar de uma vez sem ser suspeito." },
  ],
  AntiSilentAim: [
    { key: "maxMuzzleDiscrepancyMeters", label: "Discrepância máxima (metros)", help: "Distância entre onde a arma aponta e onde o tiro realmente foi, antes de considerar suspeito." },
  ],
  AntiExplosion: [
    { key: "maxExplosionsPerSec", label: "Máximo de explosões por segundo", help: "Acima disso já é considerado spam suspeito." },
  ],
  AntiHeadshotAbuse: [
    { key: "maxHSRatioPercent", label: "% máximo de headshot", help: "Acima disso já é considerado estatisticamente suspeito." },
    { key: "minKillsEvaluated", label: "Mínimo de abates avaliados", help: "Não julga com poucos dados - espera pelo menos essa quantidade de abates antes de avaliar a proporção." },
  ],
  AntiDamage: [
    { key: "maxDamagePerHit", label: "Dano máximo por tiro", help: "Nenhuma arma padrão deveria causar mais que isso num único hit." },
  ],
  AntiTaser: [
    { key: "minIntervalMs", label: "Intervalo mínimo (ms)", help: "Menor que isso entre dois usos já é suspeito." },
  ],
  AntiFire: [
    { key: "minIntervalMs", label: "Intervalo mínimo entre tiros (ms)", help: "Menor que isso entre dois disparos já é suspeito." },
  ],
  AntiRemoveWeapon: [
    { key: "verifyDelayMs", label: "Atraso de verificação (ms)", help: "Quanto tempo esperar antes de confirmar que a arma realmente sumiu de forma suspeita." },
  ],
  AntiReload: [
    { key: "minIntervalMs", label: "Intervalo mínimo de recarga (ms)", help: "Menor que isso já é suspeito." },
  ],
  AntiNoRecoilScript: [
    { key: "minBurstSamples", label: "Amostras mínimas por rajada", help: "Quantos tiros seguidos avaliar antes de julgar o padrão." },
  ],
  AntiGodMode: [
    { key: "threshold", label: "Tolerância (golpes seguidos)", help: 'Quantas vezes seguidas o dano precisa "não bater" até confirmar a detecção. Menor = detecta mais rápido, maior risco de falso positivo com lag.' },
    { key: "cooldown", label: "Cooldown (ms)", help: "Tempo mínimo entre uma verificação e a próxima." },
  ],
  AntiHeal: [
    { key: "minSuspiciousDelta", label: "Delta mínimo suspeito", help: "Quantos pontos de vida a mais, de uma vez, já é considerado suspeito." },
    { key: "cooldown", label: "Cooldown (ms)", help: "Tempo mínimo entre uma verificação e a próxima." },
  ],
  AntiArmor: [
    { key: "minSuspiciousDelta", label: "Delta mínimo suspeito", help: "Quantos pontos de armadura a mais, de uma vez, já é considerado suspeito." },
    { key: "cooldown", label: "Cooldown (ms)", help: "Tempo mínimo entre uma verificação e a próxima." },
  ],
  AntiFreecam: [
    { key: "maxCameraDistance", label: "Distância máxima da câmera", help: "Quão longe do personagem a câmera pode ficar antes de ser considerada freecam." },
  ],
  AntiFallDamageImmunity: [
    { key: "minFallDistance", label: "Distância mínima de queda considerada", help: "Quedas menores que isso não entram na verificação (evita falso positivo em desníveis pequenos)." },
  ],
  AntiSpeed: [
    { key: "maxFootSpeed", label: "Velocidade máxima a pé", help: "Acima disso (unidades do jogo) já é suspeito. Cuidado: valores muito baixos banem corrida normal com sprint boost de item/veneno." },
    { key: "maxVehicleMultiplier", label: "Multiplicador máximo em veículo", help: "Quanto mais rápido que a velocidade máxima real do veículo ainda é tolerado." },
  ],
  AntiSuperJump: [
    { key: "maxJumpHeight", label: "Altura máxima de pulo", help: "Acima disso já é suspeito." },
  ],
  AntiInfiniteStamina: [
    { key: "maxSprintTimeSec", label: "Tempo máximo de corrida contínua (s)", help: "Um jogador normal cansa antes disso." },
  ],
  AntiPedTeleport: [
    { key: "maxTeleportDistance", label: "Distância máxima sem aviso", help: "Mudanças de posição menores que isso não disparam a detecção (evita falso positivo com pequenos ajustes de física)." },
  ],
  AntiOOBExploit: [
    { key: "minZ", label: "Altura mínima (Z)", help: "Abaixo dessa altura já é considerado fora dos limites do mapa." },
  ],
  AntiVehicle: [
    { key: "expectedSpawnWindowMs", label: "Janela de spawn esperado (ms)", help: 'Depois de MarkExpectedVehicle, quanto tempo o próximo veículo criado ainda é considerado "esperado".' },
  ],
  AntiVehicleTeleport: [
    { key: "minTeleportDistance", label: "Distância mínima considerada", help: "Deslocamentos menores que isso não entram na verificação." },
  ],
  AntiNitro: [
    { key: "boostModifierThreshold", label: "Limite do modificador de boost", help: "Acima disso já é considerado suspeito." },
  ],
  AntiVehicleGodmode: [
    { key: "maxHealthPerSec", label: "Vida máxima recuperada por segundo", help: "Reparo mais rápido que isso, sem autorização, é considerado suspeito." },
  ],
  AntiVehicleFlyHack: [
    { key: "minAirborneHeight", label: "Altura mínima no ar", help: "Acima dessa altura, por tempo demais, sem ser um voador de verdade, já é suspeito." },
    { key: "sustainedAirborneMs", label: "Tempo sustentado no ar (ms)", help: "Quanto tempo seguido no ar até confirmar a detecção." },
  ],
  AntiVehicleSpawnSpam: [
    { key: "windowMs", label: "Janela de tempo (ms)", help: "Período em que os spawns são contados." },
    { key: "maxAliveInWindow", label: "Máximo de veículos na janela", help: "Quantos veículos ainda são tolerados dentro dessa janela de tempo." },
  ],
  AntiVehicleDeleteEvasion: [
    { key: "recentCombatWindowMs", label: "Janela de combate recente (ms)", help: "Se o veículo foi deletado dentro desse tempo após um combate, é sinalizado." },
  ],
  AntiEntity: [
    { key: "maxEntitiesPerSec", label: "Máximo de entidades por segundo", help: "Acima disso já é considerado excesso." },
  ],
  AntiNuker: [
    { key: "adaptiveLimitThreshold", label: "Limite adaptativo", help: "Quantidade de destruições simultâneas que já é considerada um nuke." },
  ],
  AntiEconomyDupe: [
    { key: "duplicateWindowMs", label: "Janela de duplicação (ms)", help: "Tempo em que a mesma operação repetida é bloqueada." },
  ],
  AntiBankTransferFlood: [
    { key: "windowMs", label: "Janela de tempo (ms)", help: "Período em que as transferências são contadas." },
    { key: "maxCount", label: "Máximo de transferências na janela", help: "Quantas transferências ainda são normais dentro dessa janela." },
  ],
  AntiPriceManipulation: [
    { key: "tolerance", label: "Tolerância de diferença", help: "0 = preço tem que bater exatamente. Só aumente se seu sistema de desconto/imposto calcular no cliente (não recomendado)." },
  ],
  AntiATMLimitBypass: [
    { key: "windowMs", label: "Janela de tempo (ms)", help: "Período em que os saques são somados." },
  ],
  AntiMultiClienting: [
    { key: "maxConcurrentSessions", label: "Sessões simultâneas permitidas", help: "Normalmente 1. Aumente só se seu servidor permite isso de propósito." },
  ],
  AntiInteractionRangeAbuse: [
    { key: "defaultMaxDistance", label: "Distância máxima padrão (metros)", help: "Usada quando o script que chamou CheckInteractionDistance não especificar a própria distância." },
  ],
  AntiPropGriefBlock: [
    { key: "maxClusteredObjects", label: "Máximo de objetos agrupados", help: "Quantos props numa área pequena já é considerado um bloqueio proposital." },
    { key: "clusterRadius", label: "Raio do agrupamento (metros)", help: 'Área considerada "a mesma região" pra contar os props.' },
  ],
  AntiMacroFarm: [
    { key: "minMeanIntervalMs", label: "Intervalo médio mínimo (ms)", help: "Ações mais rápidas que isso, em média, entram na análise." },
  ],
  AntiDoorLockBypass: [
    { key: "tightRadius", label: "Raio de proximidade (metros)", help: "Distância máxima da porta pra considerar a interação válida." },
  ],
};
