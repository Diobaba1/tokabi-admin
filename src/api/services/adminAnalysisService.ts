// =============================================================================
// FILE: src/api/services/adminAnalysisService.ts
// =============================================================================
// Admin Analysis API Service - Analysis triggers and settings
// =============================================================================

import axiosInstance, { extractErrorMessage } from "../axiosConfig";
import { API_ENDPOINTS, buildQueryString } from "../endpoints";
import type {
  AdminSettings,
  AdminSettingsUpdate,
  AnalysisRequest,
  AnalysisResponse,
  AnalysisTriggerRequest,
  AutoAnalysisConfig,
  AvailableLLMProviders,
  ToggleResponse,
  ConfigureResponse,
  LLMProvidersConfigureResponse,
} from "../../types";

/**
 * Admin Analysis Service
 * Handles analysis triggers, settings, and LLM provider configuration
 */
export const adminAnalysisService = {
  // ===========================================================================
  // Analysis Trigger Endpoints
  // ===========================================================================

  /**
   * Trigger analysis for multiple symbols (background task)
   */
  async triggerAnalysis(data: AnalysisTriggerRequest): Promise<AnalysisResponse> {
    try {
      const response = await axiosInstance.post<AnalysisResponse>(
        API_ENDPOINTS.ADMIN_ANALYSIS.TRIGGER,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Trigger synchronous analysis for a single symbol
   */
  async triggerSyncAnalysis(data: AnalysisTriggerRequest): Promise<AnalysisResponse> {
    try {
      const response = await axiosInstance.post<AnalysisResponse>(
        API_ENDPOINTS.ADMIN_ANALYSIS.TRIGGER_SYNC,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Get analysis request history
   */
  async getAnalysisRequests(
    statusFilter?: string,
    limit?: number,
    offset?: number
  ): Promise<AnalysisRequest[]> {
    try {
      const params: Record<string, unknown> = {};
      if (statusFilter) params.status_filter = statusFilter;
      if (limit) params.limit = limit;
      if (offset) params.offset = offset;
      
      const queryString = buildQueryString(params);
      const response = await axiosInstance.get<AnalysisRequest[]>(
        `${API_ENDPOINTS.ADMIN_ANALYSIS.REQUESTS}${queryString}`
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Get specific analysis request details
   */
  async getAnalysisRequestById(requestId: string): Promise<AnalysisRequest> {
    try {
      const response = await axiosInstance.get<AnalysisRequest>(
        API_ENDPOINTS.ADMIN_ANALYSIS.REQUEST_BY_ID(requestId)
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  // ===========================================================================
  // Admin Settings Endpoints
  // ===========================================================================

  /**
   * Get current admin settings
   */
  async getSettings(): Promise<AdminSettings> {
    try {
      const response = await axiosInstance.get<AdminSettings>(
        API_ENDPOINTS.ADMIN_ANALYSIS.GET_SETTINGS
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Update admin settings
   */
  async updateSettings(data: AdminSettingsUpdate): Promise<AdminSettings> {
    try {
      const response = await axiosInstance.put<AdminSettings>(
        API_ENDPOINTS.ADMIN_ANALYSIS.UPDATE_SETTINGS,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  // ===========================================================================
  // Auto Analysis Endpoints
  // ===========================================================================

  /**
   * Toggle auto analysis on/off
   */
  async toggleAutoAnalysis(enabled: boolean): Promise<ToggleResponse> {
    try {
      const response = await axiosInstance.post<ToggleResponse>(
        `${API_ENDPOINTS.ADMIN_ANALYSIS.AUTO_ANALYSIS_TOGGLE}?enabled=${enabled}`
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Configure auto analysis parameters
   */
  async configureAutoAnalysis(config: {
    symbols?: string[];
    timeframes?: string[];
    interval_minutes?: number;
    admin_id?: string;
  }): Promise<ConfigureResponse> {
    try {
      const response = await axiosInstance.post<ConfigureResponse>(
        API_ENDPOINTS.ADMIN_ANALYSIS.AUTO_ANALYSIS_CONFIGURE,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Get auto analysis status
   */
  async getAutoAnalysisStatus(): Promise<AutoAnalysisConfig> {
    try {
      const response = await axiosInstance.get<AutoAnalysisConfig>(
        API_ENDPOINTS.ADMIN_ANALYSIS.AUTO_ANALYSIS_STATUS
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  // ===========================================================================
  // LLM Provider Endpoints
  // ===========================================================================

  /**
   * Configure active LLM providers
   */
  async configureLLMProviders(providers: string[]): Promise<LLMProvidersConfigureResponse> {
    try {
      const response = await axiosInstance.post<LLMProvidersConfigureResponse>(
        API_ENDPOINTS.ADMIN_ANALYSIS.CONFIGURE_LLM_PROVIDERS,
        providers
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Get available LLM providers
   */
  async getAvailableLLMProviders(): Promise<AvailableLLMProviders> {
    try {
      const response = await axiosInstance.get<AvailableLLMProviders>(
        API_ENDPOINTS.ADMIN_ANALYSIS.AVAILABLE_LLM_PROVIDERS
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};

export default adminAnalysisService;