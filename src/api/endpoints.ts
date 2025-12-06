// ============================================================================
// FILE: src/endpoints.ts (UPDATED - Referral System Section)
// ============================================================================

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login/",
    REGISTER: "/auth/register/",
    LOGOUT: "/auth/logout/",
    PROFILE: "/auth/profile/",
  },

  // Users
  USERS: {
    ME: "/users/me/",
    UPDATE: "/users/me/",
  },

  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    SYSTEM_HEALTH: "/admin/system/health",

    // User Management
    USERS_LIST: "/admin/users",
    USER_DETAIL: "/admin/users/{user_id}",
    USER_UPDATE: "/admin/users/{user_id}",
    USER_DEACTIVATE: "/admin/users/{user_id}",
    USERS_BULK_ACTION: "/admin/users/bulk-action",

    // Trade Monitoring
    TRADES_LIST: "/admin/trades",
    TRADE_FORCE_CLOSE: "/admin/trades/{trade_id}/close",

    // Subscription Management
    SUBSCRIPTION_STATS: "/admin/subscriptions/stats",
    SUBSCRIPTIONS_EXPIRING: "/admin/subscriptions/expiring",
    SUBSCRIPTIONS_MANUAL_UPDATE: "/admin/subscriptions/manual-update",

    // Affiliate Management
    AFFILIATE_OVERVIEW: "/admin/affiliates/overview",
    AFFILIATE_APPLICATIONS: "/affiliates/admin/applications",
    AFFILIATE_APPLICATION_REVIEW:
      "/affiliates/admin/applications/{application_id}/review",
    AFFILIATE_COMMISSION_APPROVE:
      "/affiliates/admin/commissions/{commission_id}/approve",
    AFFILIATE_COMMISSION_PAY:
      "/affiliates/admin/commissions/{commission_id}/pay",
    AFFILIATE_COMMISSIONS_BULK_APPROVE: "/admin/commissions/bulk-approve",

    // Referral Management
    REFERRAL_STATS: "/admin/referrals/stats",

    // Signal Management
    SIGNAL_STATS: "/admin/signals/stats",

    // Portfolio Analytics
    PORTFOLIO_OVERVIEW: "/admin/portfolios/overview",

    // API Key Management
    API_KEYS_OVERVIEW: "/admin/api-keys/overview",
    API_KEY_REVOKE: "/admin/api-keys/{key_id}/revoke",

    // Platform Analytics
    PLATFORM_ANALYTICS: "/admin/analytics/platform",

    // Webhooks & Tests
    SUBSCRIPTION_MANUAL_PROCESS:
      "/webhooks/admin/subscription/manual-process",
    REFERRAL_TEST: "/webhooks/test/user-referral/{user_id}",
  },


  // Signals
  SIGNALS: {
    LIST: '/signals',
    GET: '/signals/{signal_id}',
    STATS: '/signals/stats/summary',
    UPDATE_STATUS: '/signals/{signal_id}/status',
    DELETE: '/signals/{signal_id}',
    CLEANUP_EXPIRED: '/signals/cleanup-expired',
  },

  // Dynamic Analysis
    DYNAMIC_ANALYSIS: {
        CUSTOM: "/analysis/custom",
        LIST_REQUESTS: "/analysis/requests",
        GET_REQUEST: "/analysis/requests/{request_id}",
        QUICK_ANALYSIS: "/analysis/quick-analysis",
        CANCEL_REQUEST: "/analysis/requests/{request_id}",
    },

    // =========================================================================
  // Admin Analysis Endpoints
  // =========================================================================
  ADMIN_ANALYSIS: {
    /** Trigger analysis for specified symbols (queued background task) */
    TRIGGER: "/admin/analysis/trigger",
    /** Trigger synchronous analysis for a single symbol */
    TRIGGER_SYNC: "/admin/analysis/trigger-sync",
    /** Get analysis request history */
    REQUESTS: "/admin/analysis/requests",
    /** Get a specific analysis request details */
    REQUEST_BY_ID: (requestId: string) => `/admin/analysis/requests/${requestId}`,
    /** Get current admin settings */
    GET_SETTINGS: "/admin/analysis/settings",
    /** Update admin settings */
    UPDATE_SETTINGS: "/admin/analysis/settings",
    /** Toggle auto analysis on/off */
    AUTO_ANALYSIS_TOGGLE: "/admin/analysis/auto-analysis/toggle",
    /** Configure auto analysis parameters */
    AUTO_ANALYSIS_CONFIGURE: "/admin/analysis/auto-analysis/configure",
    /** Get auto analysis status & config */
    AUTO_ANALYSIS_STATUS: "/admin/analysis/auto-analysis/status",
    /** Configure active LLM providers */
    CONFIGURE_LLM_PROVIDERS: "/admin/analysis/llm-providers/configure",
    /** List available LLM providers */
    AVAILABLE_LLM_PROVIDERS: "/admin/analysis/llm-providers/available",
  },

  // =========================================================================
  // User Signal Endpoints
  // =========================================================================
  USER_SIGNALS: {
    /** Get trading signals with filters */
    LIST: "/signals/",
    /** Get active (non-expired, actionable) signals */
    ACTIVE: "/signals/active",
    /** Get signal statistics */
    STATS: "/signals/stats",
    /** Get list of all symbols with signals */
    SYMBOLS: "/signals/symbols",
    /** Leverage recommendations for high-quality signals */
    LEVERAGE_RECOMMENDATIONS: "/signals/leverage-recommendations",
    /** Get details of a specific signal */
    BY_ID: (signalId: string) => `/signals/${signalId}`,
    /** Update signal status (user can only update own signals) */
    UPDATE_STATUS: (signalId: string) => `/signals/${signalId}/status`,
  },

  // =========================================================================
  // Admin Signal Endpoints
  // =========================================================================
  ADMIN_SIGNALS: {
    /** Admin — list all signals */
    LIST_ALL: "/signals/admin/all",
    /** Admin — advanced statistics */
    STATS: "/signals/admin/stats",
    /** Admin — create a signal manually */
    CREATE: "/signals/admin/create",
    /** Admin — update any field on any signal */
    UPDATE: (signalId: string) => `/signals/admin/${signalId}`,
    /** Admin — delete a signal */
    DELETE: (signalId: string) => `/signals/admin/${signalId}`,
    /** Admin — bulk delete signals */
    BULK_DELETE: "/signals/admin/bulk",
    /** Admin — mark expired signals */
    CLEANUP_EXPIRED: "/signals/admin/cleanup-expired",
  },

    // LLM Providers and Keys Management
    LLM_PROVIDERS: {
        CREATE: "/admin/llm/providers",
        LIST: "/admin/llm/providers",
        GET: "/admin/llm/providers/{provider_id}",
        UPDATE: "/admin/llm/providers/{provider_id}",
        DELETE: "/admin/llm/providers/{provider_id}",
    },

    // LLM Provider Keys Management
    LLM_KEYS: {
        ADD: "/admin/llm/providers/{provider_id}/keys",
        LIST: "/admin/llm/providers/{provider_id}/keys",
        UPDATE: "/admin/llm/providers/{provider_id}/keys/{key_id}",
        DELETE: "/admin/llm/providers/{provider_id}/keys/{key_id}",
    },

    // LLM Prompt Templates Management
    LLM_PROMPTS: {
        CREATE: "/admin/llm/prompts",
        LIST: "/admin/llm/prompts",
        UPDATE: "/admin/llm/prompts/{template_id}",
        DELETE: "/admin/llm/prompts/{template_id}",
    },

  // Root and Health
  ROOT: "/",
  HEALTH: "/health",
  METRICS: "/metrics",
} as const;



// Helper to build query string from params
export const buildQueryString = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};
