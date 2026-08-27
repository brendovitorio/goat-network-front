import { getApiLang } from "@/i18n/LanguageContext";

export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://api.goatnetwork.dev/api"

export type ServerItem = {
  _id: string;
  userId: string;
  userUuid: string;
  licenseId?: any;
  licenseKey: string;
  name: string;
  ip: string;
  cfxCode?: string;
  logo?: string;
  description?: string;
  port: number;
  plan: string;
  productType?: "anticheat" | "download";
  productSlug?: string | null;
  status: "online" | "offline" | "maintenance" | "suspended";
  onlinePlayers: number;
  maxPlayers: number;
  version?: string;
  protocolVersion?: string;
  watchdogStatus?: string;
  createdAt: string;
  lastHeartbeat?: string;
  onlineSince?: string;
  notifications?: {
    discordWebhook?: string;
    alerts?: {
      detections?: boolean;
      bans?: boolean;
      critical?: boolean;
      offline?: boolean;
    };
  };
  staff?: any[];
  security?: {
    authorizedIps?: string[];
    accessLogs?: any[];
    twoFactorEnabled?: boolean;
  };
  anticheatConfig?: any;
};

export type ProductItem = {
  _id?: string;
  slug: string;
  name: string;
  description: string;
  type: "anticheat" | "download";
  logoUrl?: string;
  sortOrder: number;
  active?: boolean;
  plans?: PlanItem[];
  createdAt?: string;
  updatedAt?: string;
};

export const DEFAULT_PRODUCT_LOGO = "/favicon.png";

export type FounderItem = {
  discordId: string;
  name: string;
  role: string;
  avatarUrl: string | null;
  profileUrl: string;
};

export const productLogoUrl = (product: Pick<ProductItem, "logoUrl">): string =>
  product.logoUrl || DEFAULT_PRODUCT_LOGO;

export type PlanItem = {
  _id?: string;
  productSlug: string;
  code: string;
  key: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  mode: "payment" | "subscription";
  intervalUnit: "month" | "year" | null;
  intervalCount: number;
  billingNote: string;
  features: string[];
  badge?: string;
  sortOrder: number;
  active?: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
  hasDownload?: boolean;
  downloadFileName?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type DownloadableProduct = { code: string; name: string; downloadFileName: string };

export type CouponItem = {
  _id?: string;
  code: string;
  percentOff: number | null;
  amountOff: number | null;
  duration: "once" | "repeating" | "forever";
  durationInMonths: number | null;
  maxRedemptions: number | null;
  expiresAt: string | null;
  productSlug: string | null;
  planCode: string | null;
  active: boolean;
  createdAt?: string;
};

export type OrderItem = {
  _id: string;
  orderId: string;
  userId: string;
  userUuid: string;
  plan: string;
  amount: number;
  serverName: string;
  status: "pending" | "approved" | "failed" | "cancelled";
  licenseId?: any;
  serverId?: any;
  createdAt: string;
};

export type LicenseItem = {
  _id: string;
  key: string;
  userId: string;
  userUuid: string;
  serverId?: string;
  serverName?: string;
  plan: string;
  status: "active" | "suspended" | "expired";
  expiresAt: string;
  createdAt: string;
};

export type ServerStatus = {
  name: string;
  status: "online" | "degraded" | "offline";
  players: number;
  capacity: number;
  uptime: string;
  version: string;
  region: string;
  tickRate: string;
  build: string;
  lastRestart: string;
};

export type Player = {
  id: number;
  name: string;
  acid: string;
  ping: number;
  steam: string;
  health: number;
  armor: number;
  status: "Limpo" | "Suspeito" | "Sob análise";
};

export type Detection = {
  id: string;
  player?: string;
  reason?: string;
  time: string;
  evidence: number;
  confidence: number;
  punishment: string;
};

export type Ban = {
  id: string;
  player: string;
  acid: string;
  reason: string;
  scope: "Local" | "Global";
  by: string;
  date: string;
  expires: string;
};

export type Protection = {
  name: string;
  group: string;
  enabled: boolean;
  action: string;
  triggers: number;
};

export type UserProfile = {
  _id?: string;
  id?: string;
  uuid: string;
  discordId: string;
  username: string;
  discriminator?: string;
  avatar?: string;
  email?: string;
  role: "user" | "admin" | "staff";
  activePlan: string;
  status?: "active" | "suspended" | "banned";
  isCeo?: boolean;
  createdAt?: string;
};

export const discordAvatarUrl = (discordId?: string, avatar?: string): string | null => {
  if (!discordId || !avatar) return null;
  const ext = avatar.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${discordId}/${avatar}.${ext}`;
};

export type ChangelogEntry = {
  id: string;
  author: string | null;
  avatarUrl: string | null;
  content: string;
  timestamp: string;
};

export type AiConfig = {
  enabled: boolean;
  mode: "shadow" | "development";
  minScoreToAnalyze: number;
  analysisCooldownSec: number;
  confidenceThreshold: number;
  autoFlagThreshold: number;
  autoKickThreshold: number;
  autoBanThreshold: number;
  maxRequestsPerMinute: number;
  weights: { traditional: number; ai: number; evidence: number; history: number };
};

export type AiAnalysis = {
  _id: string;
  playerAcId: string;
  provider: string;
  model: string;
  status: "COMPLETED" | "INVALID" | "ERROR";
  riskLevel?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidence?: number;
  recommendedAction?: "IGNORE" | "FLAG" | "KICK" | "BAN" | "REVIEW";
  reasonCodes?: string[];
  evidenceAssessment?: { detectionId: string; weight: number; assessment: string }[];
  summary?: string;
  falsePositiveRisk?: number;
  latencyMs?: number;
  errorMessage?: string;
  createdAt: string;
};

export type AiDecision = {
  _id: string;
  playerAcId: string;
  analysisId: string;
  decision: "IGNORE" | "REVIEW" | "FLAG";
  reason: string;
  traditionalScore: number;
  aiConfidence?: number;
  finalScore: number;
  executed: boolean;
  createdAt: string;
};

export type StaffMember = {
  name: string;
  role: string;
  status: "Online" | "Ausente" | "Offline";
  actions: number;
  lastSeen: string;
};

export const resolveLicenseForServer = (
  server: ServerItem | null,
  licenses: LicenseItem[],
): LicenseItem | null => {
  if (!server) return null;
  const licId =
    typeof server.licenseId === "object" ? (server.licenseId as any)?._id : server.licenseId;
  return (
    licenses.find(
      (item) =>
        item.key === server.licenseKey ||
        item._id === licId ||
        (item.serverId && String(item.serverId) === String(server._id)),
    ) || (typeof server.licenseId === "object" ? (server.licenseId as any) : null)
  );
};

const safeFetchJson = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);
  const text = await res.text();
  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    const lang = getApiLang();
    throw new Error(
      res.status === 401 || res.status === 403
        ? lang === "en"
          ? "Session expired. Please log in again to continue."
          : "Sessão expirada. Faça login novamente para prosseguir."
        : lang === "en"
          ? "The API server did not return a valid response. Check if the backend is online."
          : "O servidor de API não retornou uma resposta válida. Verifique se o backend está ativo.",
    );
  }
  if (!res.ok) {
    const lang = getApiLang();
    const err = new Error(
      data.error ||
        (lang === "en"
          ? `Error ${res.status}: Could not process the request.`
          : `Erro ${res.status}: Não foi possível processar a requisição.`),
    );
    // Preserva campos extras do corpo do erro (ex: needsRegistration) pra
    // quem chamou poder tratar casos específicos sem depender só da mensagem.
    Object.assign(err, data);
    throw err;
  }
  return data;
};

const getHeaders = () => {
  const token = localStorage.getItem("goat_auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  getServers: async (): Promise<ServerItem[]> => {
    try {
      const res = await fetch(`${BACKEND_URL}/servers`, { headers: getHeaders() });
      if (!res.ok) return [];
      const data = await res.json();
      return data.servers || [];
    } catch {
      return [];
    }
  },

  getServerById: async (serverId: string): Promise<ServerItem | null> => {
    try {
      const res = await fetch(`${BACKEND_URL}/servers/${serverId}`, { headers: getHeaders() });
      if (!res.ok) return null;
      const data = await res.json();
      return data.server || null;
    } catch {
      return null;
    }
  },

  getCfxServerData: async (code: string): Promise<any> => {
    try {
      const res = await fetch(`${BACKEND_URL}/servers/cfx/${code}`, { headers: getHeaders() });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  getServerPlayers: async (serverId: string): Promise<any[]> => {
    try {
      const res = await fetch(`${BACKEND_URL}/servers/${serverId}/players`, {
        headers: getHeaders(),
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.players || [];
    } catch {
      return [];
    }
  },

  getServerAcIds: async (serverId: string): Promise<any[]> => {
    try {
      const res = await fetch(`${BACKEND_URL}/servers/${serverId}/acids`, {
        headers: getHeaders(),
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.acids || [];
    } catch {
      return [];
    }
  },

  getServerDetections: async (serverId: string): Promise<any[]> => {
    try {
      const res = await fetch(`${BACKEND_URL}/servers/${serverId}/detections`, {
        headers: getHeaders(),
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.detections.map((d: any) => ({
        id: d._id,
        player: d.playerName || d.player || undefined,
        reason: d.module || undefined,
        time: d.createdAt,
        evidence: Object.keys(d.evidence || {}).length || 0,
        confidence: d.confidence || 100,
        punishment: d.actionTaken || "BAN",
        evidenceImage: d.evidenceImage || null,
      }));
    } catch {
      return [];
    }
  },

  updateServerConfig: async (id: string, anticheatConfig: any) => {
    const res = await safeFetchJson(`${BACKEND_URL}/servers/${id}/config`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ anticheatConfig }),
    });
    return res;
  },

  async updateServerGeneral(id: string, data: any) {
    return await safeFetchJson(`${BACKEND_URL}/servers/${id}/settings/general`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },

  async updateServerNotifications(id: string, data: any) {
    return await safeFetchJson(`${BACKEND_URL}/servers/${id}/settings/notifications`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },

  async updateServerSecurity(id: string, data: { authorizedIps: string[] }) {
    return await safeFetchJson(`${BACKEND_URL}/servers/${id}/settings/security`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },

  getLicenses: async (): Promise<LicenseItem[]> => {
    try {
      const res = await fetch(`${BACKEND_URL}/licenses`, { headers: getHeaders() });
      if (!res.ok) return [];
      const data = await res.json();
      return data.licenses || [];
    } catch {
      return [];
    }
  },

  getProducts: async (): Promise<ProductItem[]> => {
    try {
      const res = await fetch(`${BACKEND_URL}/products`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.products || [];
    } catch {
      return [];
    }
  },

  getFounders: async (): Promise<FounderItem[]> => {
    try {
      const res = await fetch(`${BACKEND_URL}/users/founders`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.founders || [];
    } catch {
      return [];
    }
  },

  getPlans: async (): Promise<PlanItem[]> => {
    try {
      const res = await fetch(`${BACKEND_URL}/plans`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.plans || [];
    } catch {
      return [];
    }
  },

  getChangelog: async (): Promise<ChangelogEntry[]> => {
    try {
      const res = await fetch(`${BACKEND_URL}/changelog`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.entries || [];
    } catch {
      return [];
    }
  },

  admin: {
    products: {
      getProducts: async (): Promise<ProductItem[]> => {
        const data = await safeFetchJson(`${BACKEND_URL}/products/admin`, {
          headers: getHeaders(),
        });
        return data.products || [];
      },
      createProduct: async (payload: {
        name: string;
        description?: string;
        type: "anticheat" | "download";
        slug?: string;
        sortOrder?: number;
        logoBase64?: string;
      }): Promise<{ success: boolean; product: ProductItem }> => {
        return safeFetchJson(`${BACKEND_URL}/products/admin`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(payload),
        });
      },
      updateProduct: async (
        slug: string,
        payload: Partial<Pick<ProductItem, "name" | "description" | "sortOrder" | "active">>,
      ): Promise<{ success: boolean; product: ProductItem }> => {
        return safeFetchJson(`${BACKEND_URL}/products/admin/${slug}`, {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify(payload),
        });
      },
    },
    getPlans: async (): Promise<PlanItem[]> => {
      const data = await safeFetchJson(`${BACKEND_URL}/plans/admin`, { headers: getHeaders() });
      return data.plans || [];
    },
    createPlan: async (payload: {
      productSlug: string;
      name: string;
      description?: string;
      amount: number;
      mode: "payment" | "subscription";
      intervalUnit?: "month" | "year";
      intervalCount?: number;
      billingNote?: string;
      badge?: string;
      features?: string[];
      sortOrder?: number;
      key?: string;
      fileBase64?: string;
      fileName?: string;
    }): Promise<{ success: boolean; plan: PlanItem }> => {
      return safeFetchJson(`${BACKEND_URL}/plans/admin`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
    },
    updatePlanPrice: async (
      productSlug: string,
      key: string,
      amount: number,
    ): Promise<{ success: boolean; plan: PlanItem }> => {
      return safeFetchJson(`${BACKEND_URL}/plans/admin/${productSlug}/${key}/price`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ amount }),
      });
    },
    updatePlanDetails: async (
      productSlug: string,
      key: string,
      payload: Partial<
        Pick<
          PlanItem,
          "name" | "description" | "billingNote" | "badge" | "sortOrder" | "features" | "active"
        >
      > & { fileBase64?: string; fileName?: string },
    ): Promise<{ success: boolean; plan: PlanItem }> => {
      return safeFetchJson(`${BACKEND_URL}/plans/admin/${productSlug}/${key}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
    },
    archivePlan: async (
      productSlug: string,
      key: string,
    ): Promise<{ success: boolean; plan: PlanItem }> => {
      return safeFetchJson(`${BACKEND_URL}/plans/admin/${productSlug}/${key}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
    },
    grants: {
      create: (payload: {
        discordId: string;
        plan: string;
        serverName?: string;
      }): Promise<{
        success: boolean;
        message: string;
        order: OrderItem;
        finalizeUrl: string;
      }> => {
        return safeFetchJson(`${BACKEND_URL}/orders/admin/grant`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(payload),
        });
      },
    },
    coupons: {
      list: async (): Promise<CouponItem[]> => {
        const data = await safeFetchJson(`${BACKEND_URL}/coupons/admin`, { headers: getHeaders() });
        return data.coupons || [];
      },
      create: (payload: {
        code: string;
        percentOff?: number;
        amountOff?: number;
        duration: "once" | "repeating" | "forever";
        durationInMonths?: number;
        maxRedemptions?: number;
        expiresAt?: string;
        planCode?: string;
      }): Promise<{ success: boolean; coupon: CouponItem }> => {
        return safeFetchJson(`${BACKEND_URL}/coupons/admin`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(payload),
        });
      },
      deactivate: (code: string): Promise<{ success: boolean; coupon: CouponItem }> => {
        return safeFetchJson(
          `${BACKEND_URL}/coupons/admin/${encodeURIComponent(code)}/deactivate`,
          {
            method: "PATCH",
            headers: getHeaders(),
          },
        );
      },
    },
  },

  getMyDownloads: async (): Promise<DownloadableProduct[]> => {
    try {
      const res = await fetch(`${BACKEND_URL}/plans/my-downloads`, { headers: getHeaders() });
      if (!res.ok) return [];
      const data = await res.json();
      return data.downloads || [];
    } catch {
      return [];
    }
  },

  downloadProductFile: async (code: string, filename: string) => {
    const res = await fetch(`${BACKEND_URL}/plans/download?code=${encodeURIComponent(code)}`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Erro ao baixar arquivo.");
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "produto.zip";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },

  getUserOrders: async (): Promise<OrderItem[]> => {
    try {
      const res = await fetch(`${BACKEND_URL}/orders/my-orders`, { headers: getHeaders() });
      if (!res.ok) return [];
      const data = await res.json();
      return data.orders || [];
    } catch {
      return [];
    }
  },

  createOrder: async (
    plan: string,
    serverName: string,
  ): Promise<{ success: boolean; order: OrderItem; checkoutUrl: string }> => {
    return safeFetchJson(`${BACKEND_URL}/orders/create`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ plan, serverName }),
    });
  },

  getOrderStatus: async (orderId: string): Promise<{ order: OrderItem }> => {
    return safeFetchJson(`${BACKEND_URL}/orders/${orderId}`, { headers: getHeaders() });
  },

  finalizeOrder: async (
    orderId: string,
    payload?: { serverName?: string; logo?: string; cfxCode?: string; ip?: string },
  ): Promise<{ success: boolean; order: OrderItem; license: LicenseItem; server: ServerItem }> => {
    return safeFetchJson(`${BACKEND_URL}/orders/${orderId}/finalize`, {
      method: "POST",
      headers: getHeaders(),
      body: payload ? JSON.stringify(payload) : undefined,
    });
  },

  getServerStatus: async (serverId?: string): Promise<ServerStatus> => {
    const lang = getApiLang();
    const defaultStatus: ServerStatus = {
      name: lang === "en" ? "Server" : "Servidor",
      status: "offline",
      players: 0,
      capacity: 64,
      uptime: "0h 0m",
      build: "1.0.0",
      version: "GOAT AC 1.0.0",
      region: "BR",
      tickRate: "0",
      lastRestart: lang === "en" ? "Unknown" : "Desconhecido",
    };

    try {
      if (serverId) {
        const s = await api.getServerById(serverId);
        if (s) {
          return {
            ...defaultStatus,
            name: s.name,
            status: s.status === "online" ? "online" : "offline",
            players: s.onlinePlayers || 0,
            capacity: s.maxPlayers || 64,
          };
        }
      }
      return defaultStatus;
    } catch {
      return defaultStatus;
    }
  },

  getServerAuditLogs: async (serverId: string): Promise<any[]> => {
    try {
      const res = await safeFetchJson(`${BACKEND_URL}/servers/${serverId}/audit`, {
        headers: getHeaders(),
      });
      return res.logs || [];
    } catch {
      return [];
    }
  },

  getServerWallNotes: async (serverId: string): Promise<any[]> => {
    try {
      const res = await safeFetchJson(`${BACKEND_URL}/servers/${serverId}/wall`, {
        headers: getHeaders(),
      });
      return res.notes || [];
    } catch {
      return [];
    }
  },

  getServerStats: async (serverId: string): Promise<any> => {
    try {
      const res = await safeFetchJson(`${BACKEND_URL}/servers/${serverId}/stats`, {
        headers: getHeaders(),
      });
      return (
        res.stats || { totalAcIds: 0, linkedAccounts: 0, blockedAcIds: 0, triggersByModule: {} }
      );
    } catch {
      return { totalAcIds: 0, linkedAccounts: 0, blockedAcIds: 0, triggersByModule: {} };
    }
  },

  getServerBans: async (serverId?: string): Promise<any[]> => {
    try {
      const url = serverId
        ? `${BACKEND_URL}/global-bans?serverId=${serverId}`
        : `${BACKEND_URL}/global-bans`;
      const res = await safeFetchJson(url, { headers: getHeaders() });
      return res.bans || [];
    } catch {
      return [];
    }
  },

  createBan: async (payload: { identifier: string; reason: string; evidence?: any }) => {
    return safeFetchJson(`${BACKEND_URL}/global-bans`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
  },

  revokeBan: async (banId: string) => {
    return safeFetchJson(`${BACKEND_URL}/global-bans/${banId}/revoke`, {
      method: "PATCH",
      headers: getHeaders(),
    });
  },

  getServerEvents: async (serverId: string): Promise<any[]> => {
    try {
      const res = await safeFetchJson(`${BACKEND_URL}/servers/${serverId}/events`, {
        headers: getHeaders(),
      });
      return res.events || [];
    } catch {
      return [];
    }
  },

  getServerStaff: async (serverId: string): Promise<any[]> => {
    try {
      const res = await safeFetchJson(`${BACKEND_URL}/servers/${serverId}/staff`, {
        headers: getHeaders(),
      });
      return res.staff || [];
    } catch {
      return [];
    }
  },

  addServerStaff: async (
    serverId: string,
    data: { username: string; role: string; permissions?: string[] },
  ) => {
    return safeFetchJson(`${BACKEND_URL}/servers/${serverId}/staff`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },

  removeServerStaff: async (serverId: string, staffId: string) => {
    return safeFetchJson(`${BACKEND_URL}/servers/${serverId}/staff/${staffId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
  },

  createWallNote: async (serverId: string, data: { title: string; content: string }) => {
    return safeFetchJson(`${BACKEND_URL}/servers/${serverId}/wall`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },

  deleteWallNote: async (serverId: string, noteId: string) => {
    return safeFetchJson(`${BACKEND_URL}/servers/${serverId}/wall/${noteId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
  },

  createSpawnCommand: async (
    serverId: string,
    data: {
      type: "vehicle" | "item";
      targetPassport: number;
      model?: string;
      item?: string;
      quantity?: number;
      reason?: string;
    },
  ) => {
    return safeFetchJson(`${BACKEND_URL}/servers/${serverId}/spawn`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },

  getSpawnHistory: async (serverId: string): Promise<any[]> => {
    try {
      const res = await safeFetchJson(`${BACKEND_URL}/servers/${serverId}/spawn/history`, {
        headers: getHeaders(),
      });
      return res.commands || [];
    } catch {
      return [];
    }
  },

  wipeDetectionsCache: async (serverId: string) => {
    return safeFetchJson(`${BACKEND_URL}/servers/${serverId}/wipe/detections-cache`, {
      method: "POST",
      headers: getHeaders(),
    });
  },

  requestEvidenceWipe: async (serverId: string) => {
    return safeFetchJson(`${BACKEND_URL}/servers/${serverId}/wipe/evidence/request`, {
      method: "POST",
      headers: getHeaders(),
    });
  },

  getPendingEvidenceWipes: async (serverId: string): Promise<any[]> => {
    try {
      const res = await safeFetchJson(`${BACKEND_URL}/servers/${serverId}/wipe/evidence/pending`, {
        headers: getHeaders(),
      });
      return res.requests || [];
    } catch {
      return [];
    }
  },

  approveEvidenceWipe: async (serverId: string, requestId: string) => {
    return safeFetchJson(`${BACKEND_URL}/servers/${serverId}/wipe/evidence/${requestId}/approve`, {
      method: "POST",
      headers: getHeaders(),
    });
  },

  requestMaintenanceOperation: async (
    serverId: string,
    type: "orphan_cleanup" | "session_reset",
  ) => {
    return safeFetchJson(`${BACKEND_URL}/servers/${serverId}/maintenance`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ type }),
    });
  },

  getMaintenanceHistory: async (serverId: string): Promise<any[]> => {
    try {
      const res = await safeFetchJson(`${BACKEND_URL}/servers/${serverId}/maintenance`, {
        headers: getHeaders(),
      });
      return res.commands || [];
    } catch {
      return [];
    }
  },

  getDiscordLoginUrl: async (): Promise<string> => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/discord/url`);
      const data = await res.json();
      return data.url;
    } catch {
      return `https://discord.com/oauth2/authorize`;
    }
  },

  handleDiscordCallback: async (code: string) => {
    const data = await safeFetchJson(`${BACKEND_URL}/auth/discord/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (data.token) {
      localStorage.setItem("goat_auth_token", data.token);
    }
    return data;
  },

  getMe: async (): Promise<UserProfile | null> => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/me`, { headers: getHeaders() });
      if (!res.ok) return null;
      const data = await res.json();
      return data.user ? { ...data.user, isCeo: Boolean(data.isCeo) } : null;
    } catch {
      return null;
    }
  },

  getAiConfig: async (serverId: string): Promise<AiConfig> => {
    const data = await safeFetchJson(`${BACKEND_URL}/servers/${serverId}/ai/config`, { headers: getHeaders() });
    return data.aiConfig;
  },

  updateAiConfig: async (serverId: string, payload: Partial<AiConfig>): Promise<AiConfig> => {
    const data = await safeFetchJson(`${BACKEND_URL}/servers/${serverId}/ai/config`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return data.aiConfig;
  },

  getAiAnalyses: async (serverId: string): Promise<AiAnalysis[]> => {
    try {
      const data = await safeFetchJson(`${BACKEND_URL}/servers/${serverId}/ai/analyses`, { headers: getHeaders() });
      return data.analyses || [];
    } catch {
      return [];
    }
  },

  getAiDecisions: async (serverId: string): Promise<AiDecision[]> => {
    try {
      const data = await safeFetchJson(`${BACKEND_URL}/servers/${serverId}/ai/decisions`, { headers: getHeaders() });
      return data.decisions || [];
    } catch {
      return [];
    }
  },

};
