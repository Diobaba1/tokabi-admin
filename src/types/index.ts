import { int } from 'zod';

// src/types/index.ts
export type {
  LoginRequest,
  RegisterRequest,
  UserResponse,
  TokenResponse,
  LoginResponse,
  ChangePasswordRequest,
  AuthError,
} from './auth.types';



// Stub for TokenPrice
export interface TokenPrice {
  symbol: string;
  price: number;
  change_24h?: number;
}




// =============================================================================
// FILE: src/types/index.ts
// =============================================================================
// Comprehensive TypeScript types for the Trading Bot Frontend
// =============================================================================

// =============================================================================
// Enums
// =============================================================================

export enum SignalDecision {
  LONG = "long",
  SHORT = "short",
  HOLD = "hold",
}

export enum SignalStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  EXECUTED = "executed",
  CANCELLED = "cancelled",
  PARTIAL = "partial",
}

export enum SignalSource {
  AUTO_ANALYSIS = "auto_analysis",
  ADMIN_TRIGGERED = "admin_triggered",
  USER_REQUEST = "user_request",
  MANUAL = "manual",
}

export enum AnalysisRequestStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

// =============================================================================
// Provider Types
// =============================================================================

export interface ProviderDecision {
  decision: SignalDecision | null;
  confidence: number | null;
  reasoning: string | null;
}

export interface LLMProviderInfo {
  name: string;
  configured: boolean;
  model: string;
}

export interface AvailableLLMProviders {
  providers: Record<string, LLMProviderInfo>;
  configured_count: number;
}

// =============================================================================
// Signal Types
// =============================================================================

export interface Signal {
  id: string;
  symbol: string;
  decision: SignalDecision;
  source: SignalSource;
  consensus_strength: number;
  avg_confidence: number;
  entry_price: number | null;
  stop_loss_price: number | null;
  take_profit_price: number | null;
  risk_reward_ratio: number | null;
  suggested_leverage: number | null;
  stop_loss_percent: number | null;
  take_profit_percent: number | null;
  current_price: number | null;
  active_providers: number | null;
  status: SignalStatus;
  created_at: string;
  expires_at: string | null;
}

export interface SignalDetail extends Signal {
  provider_decisions: Record<string, string> | null;
  reasoning_summary: string | null;
  high_confidence_votes: number | null;
  timeframes_analyzed: string[] | null;
  decision_method: string | null;
  custom_context: string | null;
  admin_notes: string | null;
  analysis_duration_ms: number | null;
  updated_at: string | null;
  executed_at: string | null;
  is_executed: boolean | null;
  user_id: string | null;
  created_by_admin_id: string | null;
  market_data: Record<string, unknown> | null;
  indicators: Record<string, unknown> | null;
  providers: Record<string, ProviderDecision> | null;
}

export interface SignalStats {
  timeframe: string;
  total_signals: number;
  decisions: Record<string, number>;
  avg_consensus_strength: number;
  avg_leverage: number | null;
  most_active_symbols: Array<{ symbol: string; count: number }>;
  success_rate: number | null;
  by_source?: Record<string, number>;
}

export interface LeverageRecommendation {
  symbol: string;
  decision: string;
  consensus_strength: number;
  suggested_leverage: number;
  rationale: string;
}

// =============================================================================
// Request Types
// =============================================================================

export interface SignalFilterParams {
  symbol?: string;
  decision?: SignalDecision;
  status?: SignalStatus;
  source?: SignalSource;
  min_consensus?: number;
  max_consensus?: number;
  min_leverage?: number;
  max_leverage?: number;
  start_date?: string;
  end_date?: string;
  include_hold?: boolean;
  user_id?: string;
  limit?: number;
  offset?: number;
}

export interface SignalCreateRequest {
  symbol: string;
  decision: SignalDecision;
  consensus_strength?: number;
  avg_confidence?: number;
  entry_price?: number;
  stop_loss_price?: number;
  take_profit_price?: number;
  risk_reward_ratio?: number;
  suggested_leverage?: number;
  current_price?: number;
  custom_context?: string;
  admin_notes?: string;
  timeframes_analyzed?: string[];
  expires_in_hours?: number;
}

export interface SignalUpdateRequest {
  symbol?: string;
  decision?: SignalDecision;
  consensus_strength?: number;
  avg_confidence?: number;
  entry_price?: number;
  stop_loss_price?: number;
  take_profit_price?: number;
  risk_reward_ratio?: number;
  suggested_leverage?: number;
  current_price?: number;
  custom_context?: string;
  admin_notes?: string;
  reasoning_summary?: string;
  status?: SignalStatus;
  timeframes_analyzed?: string[];
  expires_at?: string;
}

export interface AnalysisTriggerRequest {
  symbols: string[];
  timeframes?: string[];
  custom_context?: string;
  selected_providers?: string[];
  assign_to_user_id?: string;
}

// =============================================================================
// Analysis Request Types
// =============================================================================

export interface AnalysisRequest {
  id: string;
  user_id: string | null;
  symbols: string[];
  timeframes: string[] | null;
  custom_context: string | null;
  selected_providers: string[] | null;
  status: AnalysisRequestStatus;
  progress: number;
  signals_generated: number;
  execution_time_ms: number | null;
  error_message: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

export interface AnalysisResponse {
  status: string;
  request_id?: string;
  symbol?: string;
  symbols?: string[];
  signals_generated?: number;
  execution_time_ms?: number;
  error?: string;
  signal?: SignalDetail | null;
}

// =============================================================================
// Admin Settings Types
// =============================================================================

export interface AdminSettings {
  id: string;
  auto_analysis_enabled: boolean;
  auto_analysis_interval_minutes: number;
  auto_analysis_symbols: string[] | null;
  auto_analysis_timeframes: string[] | null;
  auto_analysis_admin_id: string | null;
  default_signal_expiry_hours: number;
  min_consensus_for_execution: number;
  max_leverage_override: number | null;
  max_position_size_override: number | null;
  active_llm_providers: string[] | null;
  llm_timeout_seconds: number;
  telegram_notifications_enabled: boolean;
  min_consensus_for_notification: number;
  last_auto_analysis_at: string | null;
  updated_at: string | null;
  updated_by: string | null;
}

export interface AdminSettingsUpdate {
  auto_analysis_enabled?: boolean;
  auto_analysis_interval_minutes?: number;
  auto_analysis_symbols?: string[];
  auto_analysis_timeframes?: string[];
  auto_analysis_admin_id?: string;
  default_signal_expiry_hours?: number;
  min_consensus_for_execution?: number;
  max_leverage_override?: number;
  max_position_size_override?: number;
  active_llm_providers?: string[];
  llm_timeout_seconds?: number;
  telegram_notifications_enabled?: boolean;
  min_consensus_for_notification?: number;
}

export interface AutoAnalysisConfig {
  enabled: boolean;
  interval_minutes: number;
  symbols: string[] | null;
  timeframes: string[] | null;
  admin_id: string | null;
  last_run: string | null;
}

// =============================================================================
// API Response Types
// =============================================================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface MessageResponse {
  message: string;
}

export interface ToggleResponse {
  message: string;
  auto_analysis_enabled: boolean;
}

export interface ConfigureResponse {
  message: string;
  config: AutoAnalysisConfig;
}

export interface LLMProvidersConfigureResponse {
  message: string;
  active_providers: string[];
}

// =============================================================================
// UI State Types
// =============================================================================

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface FilterState extends SignalFilterParams {
  isActive: boolean;
}

export interface SortConfig {
  field: string;
  direction: "asc" | "desc";
}

export interface TableState {
  page: number;
  pageSize: number;
  sort: SortConfig;
  filters: FilterState;
}

// =============================================================================
// Chart Types
// =============================================================================

export interface ChartDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface SignalDistribution {
  long: number;
  short: number;
  hold: number;
}

export interface ProviderPerformance {
  provider: string;
  total_signals: number;
  success_rate: number;
  avg_confidence: number;
}

// =============================================================================
// Notification Types
// =============================================================================

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
}

// =============================================================================
// Modal Types
// =============================================================================

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export interface ConfirmModalProps extends ModalProps {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: "danger" | "warning" | "info";
}