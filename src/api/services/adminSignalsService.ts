// =============================================================================
// FILE: src/api/services/adminSignalsService.ts
// =============================================================================
// Admin Signals API Service - For admin users only
// =============================================================================

import axiosInstance, { extractErrorMessage
} from "../axiosConfig";
import { API_ENDPOINTS, buildQueryString } from "../endpoints";
import type {
  Signal,
  SignalDetail,
  SignalStats,
  SignalFilterParams,
  SignalCreateRequest,
  SignalUpdateRequest,
  MessageResponse,
} from "../../types";

/**
 * Admin Signals Service
 * Handles all admin-only signal operations
 */
export const adminSignalsService = {
  /**
   * Get all signals with admin-level filters
   */
  async getAllSignals(filters?: SignalFilterParams): Promise<Signal[]> {
    try {
      const queryString = filters ? buildQueryString(filters as Record<string, unknown>) : "";
      const response = await axiosInstance.get<Signal[]>(
        `${API_ENDPOINTS.ADMIN_SIGNALS.LIST_ALL}${queryString}`
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Get admin-level statistics
   */
  async getStats(timeframe: "1h" | "24h" | "7d" | "30d" | "all" = "24h"): Promise<SignalStats> {
    try {
      const response = await axiosInstance.get<SignalStats>(
        `${API_ENDPOINTS.ADMIN_SIGNALS.STATS}?timeframe=${timeframe}`
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Create a new signal manually
   */
  async createSignal(data: SignalCreateRequest): Promise<SignalDetail> {
    try {
      const response = await axiosInstance.post<SignalDetail>(
        API_ENDPOINTS.ADMIN_SIGNALS.CREATE,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Update any signal field
   */
  async updateSignal(signalId: string, data: SignalUpdateRequest): Promise<SignalDetail> {
    try {
      const response = await axiosInstance.put<SignalDetail>(
        API_ENDPOINTS.ADMIN_SIGNALS.UPDATE(signalId),
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Delete a signal
   */
  async deleteSignal(signalId: string): Promise<MessageResponse> {
    try {
      const response = await axiosInstance.delete<MessageResponse>(
        API_ENDPOINTS.ADMIN_SIGNALS.DELETE(signalId)
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Bulk delete signals
   */
  async bulkDeleteSignals(signalIds: string[]): Promise<MessageResponse> {
    try {
      const response = await axiosInstance.delete<MessageResponse>(
        API_ENDPOINTS.ADMIN_SIGNALS.BULK_DELETE,
        { data: signalIds }
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Cleanup expired signals
   */
  async cleanupExpiredSignals(): Promise<MessageResponse> {
    try {
      const response = await axiosInstance.post<MessageResponse>(
        API_ENDPOINTS.ADMIN_SIGNALS.CLEANUP_EXPIRED
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};

export default adminSignalsService;