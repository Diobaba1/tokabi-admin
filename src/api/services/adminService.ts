// src/api/services/adminService.ts

import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../endpoints';
import {
  AdminDashboardStats,
  SystemHealthResponse,
  UserManagementResponse,
  UserUpdateRequest,
  BulkUserAction,
  TradeMonitoringResponse,
  SubscriptionStats,
  SubscriptionManualUpdate,
  ReferralManagementStats,
  PortfolioOverview,
  APIKeyOverview,
  AffiliateManagementResponse,
  PlatformAnalytics,
  SignalStats,
} from '../../types/admin.types';

export const adminService = {
  // Dashboard
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.DASHBOARD);
    return response.data;
  },

  async getSystemHealth(): Promise<SystemHealthResponse> {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.SYSTEM_HEALTH);
    return response.data;
  },

  // User Management
  async getUsers(params?: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<UserManagementResponse[]> {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.USERS_LIST, { params });
    return response.data;
  },

  async getUserDetail(userId: string): Promise<UserManagementResponse> {
    const url = API_ENDPOINTS.ADMIN.USER_DETAIL.replace('{user_id}', userId);
    const response = await axiosInstance.get(url);
    return response.data;
  },

  async updateUser(userId: string, data: UserUpdateRequest): Promise<{ message: string; user_id: string }> {
    const url = API_ENDPOINTS.ADMIN.USER_UPDATE.replace('{user_id}', userId);
    const response = await axiosInstance.put(url, data);
    return response.data;
  },

  async deleteUser(userId: string): Promise<{ message: string; user_id: string }> {
    const url = API_ENDPOINTS.ADMIN.USER_DEACTIVATE.replace('{user_id}', userId);
    const response = await axiosInstance.delete(url);
    return response.data;
  },

  async bulkUserAction(data: BulkUserAction): Promise<{ message: string; action: string; affected_users: number }> {
    const response = await axiosInstance.post(API_ENDPOINTS.ADMIN.USERS_BULK_ACTION, data);
    return response.data;
  },

  // Trade Monitoring
  async getTrades(params?: {
    status?: string;
    symbol?: string;
    user_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<TradeMonitoringResponse[]> {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.TRADES_LIST, { params });
    return response.data;
  },

  async forceCloseTrade(tradeId: string): Promise<{ message: string; trade_id: string }> {
    const url = API_ENDPOINTS.ADMIN.TRADE_FORCE_CLOSE.replace('{trade_id}', tradeId);
    const response = await axiosInstance.post(url);
    return response.data;
  },

  // Subscription Management
  async getSubscriptionStats(): Promise<SubscriptionStats> {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.SUBSCRIPTION_STATS);
    return response.data;
  },

  async getExpiringSubscriptions(days?: number | null): Promise<{ count: number; users: any[] }> {
    // Only include params if days is provided
    const params = days ? { days } : undefined;
    
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.SUBSCRIPTIONS_EXPIRING, {
      params,
    });
    return response.data;
  },

  async manualSubscriptionUpdate(data: {
    user_id: string;
    subscription_months: number;
    reason: string;
  }) {
    const response = await axiosInstance.post(
      API_ENDPOINTS.ADMIN.SUBSCRIPTIONS_MANUAL_UPDATE,
      data
    );
    return response.data;
  },



  // Referral Management
  async getReferralStats(): Promise<ReferralManagementStats> {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.REFERRAL_STATS);
    return response.data;
  },

  // Portfolio Analytics
  async getPortfolioOverview(): Promise<PortfolioOverview> {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.PORTFOLIO_OVERVIEW);
    return response.data;
  },

  // API Key Management
  async getAPIKeysOverview(params?: { limit?: number; offset?: number }): Promise<APIKeyOverview> {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.API_KEYS_OVERVIEW, { params });
    return response.data;
  },

  async revokeAPIKey(keyId: string): Promise<{ message: string; key_id: string }> {
    const url = API_ENDPOINTS.ADMIN.API_KEY_REVOKE.replace('{key_id}', keyId);
    const response = await axiosInstance.post(url);
    return response.data;
  },

  // Affiliate Management
  async getAffiliateOverview(): Promise<AffiliateManagementResponse> {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.AFFILIATE_OVERVIEW);
    return response.data;
  },

  // Platform Analytics
  async getPlatformAnalytics(timeframe: '7d' | '30d' | '90d' = '30d'): Promise<PlatformAnalytics> {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.PLATFORM_ANALYTICS, {
      params: { timeframe },
    });
    return response.data;
  },

  // Signal Management
  async getSignalStats(days: number = 7): Promise<SignalStats> {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.SIGNAL_STATS, {
      params: { days },
    });
    return response.data;
  },
};