// ============================================================================
// FILE: src/api/services/LLMProvidersService.ts
// ============================================================================

import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../endpoints';
import {
  LLMProviderCreate,
  LLMProviderUpdate,
  LLMProviderResponse,
  ApiResponse,
} from '../../types/llmProvider.types';

class LLMProvidersService {
  /**
   * Create new LLM provider
   */
  async createProvider(
    data: LLMProviderCreate
  ): Promise<ApiResponse<LLMProviderResponse>> {
    try {
      const response = await axiosInstance.post<LLMProviderResponse>(
        API_ENDPOINTS.LLM_PROVIDERS.CREATE,
        data
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  /**
   * List all LLM providers
   */
  async listProviders(
    includeInactive: boolean = false
  ): Promise<ApiResponse<LLMProviderResponse[]>> {
    try {
      const response = await axiosInstance.get<LLMProviderResponse[]>(
        API_ENDPOINTS.LLM_PROVIDERS.LIST,
        {
          params: { include_inactive: includeInactive },
        }
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  /**
   * Get provider details
   */
  async getProvider(
    providerId: string
  ): Promise<ApiResponse<LLMProviderResponse>> {
    try {
      const url = API_ENDPOINTS.LLM_PROVIDERS.GET.replace(
        '{provider_id}',
        providerId
      );

      const response = await axiosInstance.get<LLMProviderResponse>(url);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  /**
   * Update provider
   */
  async updateProvider(
    providerId: string,
    data: LLMProviderUpdate
  ): Promise<ApiResponse<LLMProviderResponse>> {
    try {
      const url = API_ENDPOINTS.LLM_PROVIDERS.UPDATE.replace(
        '{provider_id}',
        providerId
      );

      const response = await axiosInstance.patch<LLMProviderResponse>(
        url,
        data
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  /**
   * Delete provider
   */
  async deleteProvider(
    providerId: string
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const url = API_ENDPOINTS.LLM_PROVIDERS.DELETE.replace(
        '{provider_id}',
        providerId
      );

      const response = await axiosInstance.delete<{ message: string }>(url);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  /**
   * Toggle provider active status
   */
  async toggleProviderStatus(
    providerId: string,
    isActive: boolean
  ): Promise<ApiResponse<LLMProviderResponse>> {
    return this.updateProvider(providerId, { is_active: isActive });
  }

  /**
   * Update provider priority
   */
  async updateProviderPriority(
    providerId: string,
    priority: number
  ): Promise<ApiResponse<LLMProviderResponse>> {
    return this.updateProvider(providerId, { priority });
  }

  /**
   * Error handler
   */
  private handleError(error: any): ApiResponse<any> {
    console.error('LLMProvidersService error:', error);

    if (error.response) {
      return {
        success: false,
        error: {
          code: error.response.data?.code || 'API_ERROR',
          message: error.response.data?.detail || error.message,
        },
        status: error.response.status,
      };
    }

    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection.',
      },
      status: 0,
    };
  }
}

export const llmProvidersService = new LLMProvidersService();
export default LLMProvidersService;