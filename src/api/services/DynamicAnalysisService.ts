// ============================================================================
// FILE: src/api/services/DynamicAnalysisService.ts
// ============================================================================

import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../endpoints';
import {
  AnalysisRequest,
  AnalysisRequestResponse,
  QuickAnalysisRequest,
  QuickAnalysisResponse,
  ApiResponse,
} from '../../types/dynamicAnalysis.types';

class DynamicAnalysisService {
  /**
   * Create custom analysis request for multiple symbols
   */
  async createAnalysisRequest(
    data: AnalysisRequest
  ): Promise<ApiResponse<AnalysisRequestResponse>> {
    try {
      const response = await axiosInstance.post<AnalysisRequestResponse>(
        API_ENDPOINTS.DYNAMIC_ANALYSIS.CUSTOM,
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
   * Get list of user's analysis requests
   */
  async listAnalysisRequests(
    limit: number = 20,
    offset: number = 0
  ): Promise<ApiResponse<AnalysisRequestResponse[]>> {
    try {
      const response = await axiosInstance.get<AnalysisRequestResponse[]>(
        API_ENDPOINTS.DYNAMIC_ANALYSIS.LIST_REQUESTS,
        {
          params: { limit, offset },
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
   * Get specific analysis request details
   */
  async getAnalysisRequest(
    requestId: string
  ): Promise<ApiResponse<AnalysisRequestResponse>> {
    try {
      const url = API_ENDPOINTS.DYNAMIC_ANALYSIS.GET_REQUEST.replace(
        '{request_id}',
        requestId
      );

      const response = await axiosInstance.get<AnalysisRequestResponse>(url);

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
   * Quick analysis for single symbol (synchronous)
   */
  async quickAnalysis(
    symbol: string,
    options?: QuickAnalysisRequest
  ): Promise<ApiResponse<QuickAnalysisResponse>> {
    try {
      const response = await axiosInstance.post<QuickAnalysisResponse>(
        API_ENDPOINTS.DYNAMIC_ANALYSIS.QUICK_ANALYSIS,
        options || {},
        {
          params: { symbol },
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
   * Cancel pending analysis request
   */
  async cancelAnalysisRequest(
    requestId: string
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const url = API_ENDPOINTS.DYNAMIC_ANALYSIS.CANCEL_REQUEST.replace(
        '{request_id}',
        requestId
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
   * Poll analysis request status
   */
  async pollAnalysisStatus(
    requestId: string,
    maxAttempts: number = 60,
    intervalMs: number = 2000
  ): Promise<ApiResponse<AnalysisRequestResponse>> {
    for (let i = 0; i < maxAttempts; i++) {
      const result = await this.getAnalysisRequest(requestId);

      if (!result.success) {
        return result;
      }

      if (
        result.data?.status === 'completed' ||
        result.data?.status === 'failed' ||
        result.data?.status === 'cancelled'
      ) {
        return result;
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    return {
      success: false,
      error: {
        code: 'TIMEOUT',
        message: 'Analysis request timed out',
      },
      status: 408,
    };
  }

  /**
   * Error handler
   */
  private handleError(error: any): ApiResponse<any> {
    console.error('DynamicAnalysisService error:', error);

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

export const dynamicAnalysisService = new DynamicAnalysisService();
export default DynamicAnalysisService;