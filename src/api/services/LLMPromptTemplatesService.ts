// ============================================================================
// FILE: src/api/services/LLMPromptTemplatesService.ts
// ============================================================================

import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../endpoints';
import {
  PromptTemplateCreate,
  PromptTemplateUpdate,
  PromptTemplateResponse,
  ApiResponse,
} from '../../types/llmProvider.types';

class LLMPromptTemplatesService {
  /**
   * Create prompt template
   */
  async createTemplate(
    data: PromptTemplateCreate
  ): Promise<ApiResponse<PromptTemplateResponse>> {
    try {
      const response = await axiosInstance.post<PromptTemplateResponse>(
        API_ENDPOINTS.LLM_PROMPTS.CREATE,
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
   * List prompt templates
   */
  async listTemplates(
    includeInactive: boolean = false
  ): Promise<ApiResponse<PromptTemplateResponse[]>> {
    try {
      const response = await axiosInstance.get<PromptTemplateResponse[]>(
        API_ENDPOINTS.LLM_PROMPTS.LIST,
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
   * Update prompt template
   */
  async updateTemplate(
    templateId: string,
    data: PromptTemplateUpdate
  ): Promise<ApiResponse<PromptTemplateResponse>> {
    try {
      const url = API_ENDPOINTS.LLM_PROMPTS.UPDATE.replace(
        '{template_id}',
        templateId
      );

      const response = await axiosInstance.patch<PromptTemplateResponse>(
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
   * Delete prompt template
   */
  async deleteTemplate(
    templateId: string
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const url = API_ENDPOINTS.LLM_PROMPTS.DELETE.replace(
        '{template_id}',
        templateId
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
   * Toggle template active status
   */
  async toggleTemplateStatus(
    templateId: string,
    isActive: boolean
  ): Promise<ApiResponse<PromptTemplateResponse>> {
    return this.updateTemplate(templateId, { is_active: isActive });
  }

  /**
   * Set template as default
   */
  async setDefaultTemplate(
    templateId: string
  ): Promise<ApiResponse<PromptTemplateResponse>> {
    return this.updateTemplate(templateId, { is_default: true });
  }

  /**
   * Error handler
   */
  private handleError(error: any): ApiResponse<any> {
    console.error('LLMPromptTemplatesService error:', error);

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

export const llmPromptTemplatesService = new LLMPromptTemplatesService();
export default LLMPromptTemplatesService;