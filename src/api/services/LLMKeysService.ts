// ============================================================================
// FILE: src/api/services/LLMKeysService.ts
// ============================================================================

import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../endpoints';
import {
  LLMAPIKeyCreate,
  LLMAPIKeyUpdate,
  LLMAPIKeyResponse,
  ApiResponse,
} from '../../types/llmProvider.types';

class LLMKeysService {
  /**
   * Add API key to provider
   */
  async addKey(
    providerId: string,
    data: LLMAPIKeyCreate
  ): Promise<ApiResponse<LLMAPIKeyResponse>> {
    try {
      const url = API_ENDPOINTS.LLM_KEYS.ADD.replace(
        '{provider_id}',
        providerId
      );

      const response = await axiosInstance.post<LLMAPIKeyResponse>(url, data);

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
   * List API keys for provider
   */
  async listKeys(
    providerId: string
  ): Promise<ApiResponse<LLMAPIKeyResponse[]>> {
    try {
      const url = API_ENDPOINTS.LLM_KEYS.LIST.replace(
        '{provider_id}',
        providerId
      );

      const response = await axiosInstance.get<LLMAPIKeyResponse[]>(url);

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
   * Update API key
   */
  async updateKey(
    providerId: string,
    keyId: string,
    data: LLMAPIKeyUpdate
  ): Promise<ApiResponse<LLMAPIKeyResponse>> {
    try {
      const url = API_ENDPOINTS.LLM_KEYS.UPDATE.replace(
        '{provider_id}',
        providerId
      ).replace('{key_id}', keyId);

      const response = await axiosInstance.patch<LLMAPIKeyResponse>(url, data);

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
   * Delete API key
   */
  async deleteKey(
    providerId: string,
    keyId: string
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const url = API_ENDPOINTS.LLM_KEYS.DELETE.replace(
        '{provider_id}',
        providerId
      ).replace('{key_id}', keyId);

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
   * Toggle key active status
   */
  async toggleKeyStatus(
    providerId: string,
    keyId: string,
    isActive: boolean
  ): Promise<ApiResponse<LLMAPIKeyResponse>> {
    return this.updateKey(providerId, keyId, { is_active: isActive });
  }

  /**
   * Set key as primary
   */
  async setPrimaryKey(
    providerId: string,
    keyId: string
  ): Promise<ApiResponse<LLMAPIKeyResponse>> {
    return this.updateKey(providerId, keyId, { is_primary: true });
  }

  /**
   * Error handler
   */
  private handleError(error: any): ApiResponse<any> {
    console.error('LLMKeysService error:', error);

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

export const llmKeysService = new LLMKeysService();
export default LLMKeysService;