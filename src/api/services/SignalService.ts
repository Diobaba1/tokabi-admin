// ============================================================================
// FILE: src/api/services/SignalsService.ts
// ============================================================================

import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../endpoints';

interface Signal {
  id: string;
  symbol: string;
  decision: 'long' | 'short' | 'hold';
  consensus_strength: number;
  avg_confidence: number;
  entry_price?: number;
  stop_loss?: number;
  take_profit?: number;
  risk_reward_ratio?: number;
  suggested_leverage?: number;
  stop_loss_percent?: number;
  take_profit_percent?: number;
  provider_decisions: Record<string, string>;
  reasoning_summary?: string;
  active_providers: number;
  timeframes_analyzed?: string[];
  status: 'active' | 'expired' | 'executed';
  created_at: string;
  expires_at?: string;
}

interface SignalFilters {
  symbol?: string;
  decision?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

interface SignalStats {
  total_signals: number;
  by_decision: Record<string, number>;
  avg_consensus: number;
  avg_confidence: number;
  period_days: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  status: number;
}

class SignalsService {
  /**
   * Get signals with filters
   */
  async getSignals(filters?: SignalFilters): Promise<ApiResponse<Signal[]>> {
    try {
      const response = await axiosInstance.get<Signal[]>(API_ENDPOINTS.SIGNALS.LIST, {
        params: filters,
      });

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
   * Get single signal by ID
   */
  async getSignal(signalId: string): Promise<ApiResponse<Signal>> {
    try {
      const url = API_ENDPOINTS.SIGNALS.GET.replace('{signal_id}', signalId);
      const response = await axiosInstance.get<Signal>(url);

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
   * Get signal statistics
   */
  async getSignalStats(days: number = 7): Promise<ApiResponse<SignalStats>> {
    try {
      const response = await axiosInstance.get<SignalStats>(
        API_ENDPOINTS.SIGNALS.STATS,
        {
          params: { days },
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
   * Update signal status
   */
  async updateSignalStatus(
    signalId: string,
    newStatus: string
  ): Promise<ApiResponse<Signal>> {
    try {
      const url = API_ENDPOINTS.SIGNALS.UPDATE_STATUS.replace(
        '{signal_id}',
        signalId
      );
      const response = await axiosInstance.patch<Signal>(url, null, {
        params: { new_status: newStatus },
      });

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
   * Delete signal
   */
  async deleteSignal(signalId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const url = API_ENDPOINTS.SIGNALS.DELETE.replace('{signal_id}', signalId);
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
   * Cleanup expired signals
   */
  async cleanupExpiredSignals(): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await axiosInstance.post<{ message: string }>(
        API_ENDPOINTS.SIGNALS.CLEANUP_EXPIRED
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
   * Error handler
   */
  private handleError(error: any): ApiResponse<any> {
    console.error('SignalsService error:', error);

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

export const signalsService = new SignalsService();
export default SignalsService;