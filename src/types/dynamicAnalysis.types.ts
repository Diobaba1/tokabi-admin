// ============================================================================
// FILE: src/types/dynamicAnalysis.types.ts
// ============================================================================

export interface AnalysisRequest {
  symbols: string[];
  timeframes?: string[];
  custom_context?: string;
  prompt_template_id?: string;
  selected_providers?: string[];
  msg?: string;
}

export interface AnalysisRequestResponse {
  id: string;
  symbols: string[];
  timeframes?: string[];
  custom_context?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  signals_generated: number;
  execution_time_ms?: number;
  error_message?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  msg?: string;
}

export interface QuickAnalysisRequest {
  timeframes?: string[];
  custom_context?: string;
  msg?: string;
}

export interface QuickAnalysisResponse {
  status: 'success' | 'error';
  symbol: string;
  decision?: 'long' | 'short' | 'hold';
  consensus_strength?: number;
  signal_id?: string;
  risk_metrics?: RiskMetrics;
  error?: string;
  msg?: string;
}

export interface RiskMetrics {
  entry_price?: number;
  stop_loss_price?: number;
  take_profit_price?: number;
  estimated_sl_percent?: number;
  estimated_tp_percent?: number;
  risk_reward_ratio?: number;
  suggested_leverage?: number;
}

export interface AnalysisResult {
  status: 'success' | 'error';
  symbol: string;
  decision?: string;
  consensus_strength?: number;
  signal_id?: string;
  risk_metrics?: RiskMetrics;
  error?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  status: number;
}