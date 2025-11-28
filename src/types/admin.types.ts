// src/types/admin.types.ts

export interface AdminDashboardStats {
  // User metrics
  total_users: number;
  active_users: number;
  subscribed_users: number;
  new_users_24h: number;
  new_users_7d: number;
  subscription_rate: number;
  
  // Trade metrics
  total_trades: number;
  open_trades: number;
  closed_trades_24h: number;
  total_pnl_usd: number;
  pnl_24h_usd: number;
  
  // Signal metrics
  total_signals: number;
  signals_24h: number;
  
  // Referral metrics
  total_referrals: number;
  completed_referrals: number;
  referral_conversion_rate: number;
  
  // Affiliate metrics
  total_affiliates: number;
  active_affiliates: number;
  pending_affiliate_applications: number;
  total_commissions_paid: number;
  pending_commissions: number;
  
  // Revenue
  estimated_revenue_30d: number;
  
  timestamp: string;
}

export interface SystemHealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  components: Record<string, {
    status: string;
    [key: string]: any;
  }>;
}

export interface UserManagementResponse {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_verified: boolean;
  is_subscribed: boolean;
  is_admin: boolean;
  subscription_start?: string;
  subscription_end?: string;
  created_at: string;
  last_login?: string;
  
  // Additional stats
  total_trades: number;
  open_trades: number;
  portfolio_balance: number;
  referrals_made: number;
  is_affiliate: boolean;
}

export interface UserUpdateRequest {
  is_active?: boolean;
  is_verified?: boolean;
  is_subscribed?: boolean;
  subscription_end?: string;
  is_admin?: boolean;
}

export interface BulkUserAction {
  user_ids: string[];
  action: 'activate' | 'deactivate' | 'subscribe' | 'unsubscribe';
}

export interface TradeMonitoringResponse {
  id: string;
  user_id: string;
  user_email: string;
  symbol: string;
  side: string;
  entry_price: number;
  quantity: number;
  leverage: number;
  position_size_usd: number;
  unrealized_pnl_usd: number;
  realized_pnl_usd?: number;
  status: string;
  created_at: string;
  opened_at?: string;
  closed_at?: string;
}

export interface SubscriptionStats {
  total_subscriptions: number;
  active_subscriptions: number;
  expired_subscriptions: number;
  expiring_soon: number;
  monthly_recurring_revenue: number;
  churn_rate: number;
  avg_subscription_length_days: number;
}

export interface SubscriptionManualUpdate {
  user_id: string;
  subscription_months: number;
  reason: string;
}

export interface ReferralManagementStats {
  total_referral_codes: number;
  active_referral_codes: number;
  total_referrals: number;
  pending_referrals: number;
  completed_referrals: number;
  conversion_rate: number;
  avg_time_to_conversion_days: number;
  top_referrers: Array<{
    user_id: string;
    email: string;
    referral_count: number;
  }>;
}

export interface PortfolioOverview {
  total_portfolios: number;
  total_balance_usd: number;
  total_unrealized_pnl_usd: number;
  avg_portfolio_balance_usd: number;
  total_open_positions: number;
  most_held_assets: Array<{ symbol: string; count: number }>;
}

export interface APIKeyOverview {
  total_users_with_keys: number;
  api_keys: Array<{
    user_id: string;
    user_email: string;
    total_api_keys: number;
    active_keys: number;
    inactive_keys: number;
    last_validated?: string;
  }>;
}

export interface AffiliateManagementResponse {
  total_affiliates: number;
  active_affiliates: number;
  pending_applications: number;
  total_commissions_paid: number;
  pending_commissions: number;
  total_referrals: number;
  completed_referrals: number;
  conversion_rate: number;
}

export interface PlatformAnalytics {
  timeframe: string;
  user_growth: {
    new_users: number;
    new_subscriptions: number;
  };
  trading_volume: {
    total_volume_usd: number;
    total_trades: number;
  };
  revenue_metrics: {
    estimated_revenue: number;
  };
  engagement_metrics: {
    active_traders: number;
  };
}

export interface SignalStats {
  timeframe_days: number;
  total_signals: number;
  decisions: {
    long: number;
    short: number;
    hold: number;
  };
  avg_consensus_strength: number;
  most_active_symbols: Array<{
    symbol: string;
    count: number;
  }>;
}