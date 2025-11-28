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

  // Root and Health
  ROOT: "/",
  HEALTH: "/health",
  METRICS: "/metrics",
} as const;
