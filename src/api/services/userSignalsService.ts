// =============================================================================
// FILE: src/api/services/userSignalsService.ts
// =============================================================================
// User Signals API Service - For authenticated users
// =============================================================================

import axiosInstance, { extractErrorMessage } from "../axiosConfig";
import { API_ENDPOINTS, buildQueryString } from "../endpoints";
import type {
  Signal,
  SignalDetail,
  SignalStats,
  SignalFilterParams,
  LeverageRecommendation,
  SignalStatus,
} from "../../types";

/**
 * User Signals Service
 * Handles all signal-related API calls for regular users
 */
export const userSignalsService = {
  /**
   * Get signals with optional filters
   */
  async getSignals(filters?: SignalFilterParams): Promise<Signal[]> {
    try {
      const queryString = filters ? buildQueryString(filters as Record<string, unknown>) : "";
      const response = await axiosInstance.get<Signal[]>(
        `${API_ENDPOINTS.USER_SIGNALS.LIST}${queryString}`
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Get active signals (non-expired, non-hold)
   */
  async getActiveSignals(symbol?: string, limit?: number): Promise<Signal[]> {
    try {
      const params: Record<string, unknown> = {};
      if (symbol) params.symbol = symbol;
      if (limit) params.limit = limit;
      
      const queryString = buildQueryString(params);
      const response = await axiosInstance.get<Signal[]>(
        `${API_ENDPOINTS.USER_SIGNALS.ACTIVE}${queryString}`
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Get signal statistics
   */
  async getStats(timeframe: "1h" | "24h" | "7d" | "30d" | "all" = "24h"): Promise<SignalStats> {
    try {
      const response = await axiosInstance.get<SignalStats>(
        `${API_ENDPOINTS.USER_SIGNALS.STATS}?timeframe=${timeframe}`
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Get available symbols
   */
  async getSymbols(): Promise<string[]> {
    try {
      const response = await axiosInstance.get<string[]>(API_ENDPOINTS.USER_SIGNALS.SYMBOLS);
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Get leverage recommendations
   */
  async getLeverageRecommendations(
    symbol?: string,
    minConsensus?: number,
    limit?: number
  ): Promise<LeverageRecommendation[]> {
    try {
      const params: Record<string, unknown> = {};
      if (symbol) params.symbol = symbol;
      if (minConsensus) params.min_consensus = minConsensus;
      if (limit) params.limit = limit;
      
      const queryString = buildQueryString(params);
      const response = await axiosInstance.get<LeverageRecommendation[]>(
        `${API_ENDPOINTS.USER_SIGNALS.LEVERAGE_RECOMMENDATIONS}${queryString}`
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Get signal details by ID
   */
  async getSignalById(signalId: string): Promise<SignalDetail> {
    try {
      const response = await axiosInstance.get<SignalDetail>(
        API_ENDPOINTS.USER_SIGNALS.BY_ID(signalId)
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Update signal status (users can only update own signals)
   */
  async updateSignalStatus(
    signalId: string,
    newStatus: SignalStatus
  ): Promise<{ message: string; signal: Signal }> {
    try {
      const response = await axiosInstance.patch<{ message: string; signal: Signal }>(
        `${API_ENDPOINTS.USER_SIGNALS.UPDATE_STATUS(signalId)}?new_status=${newStatus}`
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};

export default userSignalsService;