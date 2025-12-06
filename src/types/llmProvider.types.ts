// ============================================================================
// FILE: src/types/llmProvider.types.ts
// ============================================================================

export type ProviderType = 'openai_compatible' | 'anthropic' | 'custom';

export interface LLMAPIKeyCreate {
  api_key: string;
  key_name: string;
  is_primary?: boolean;
}

export interface LLMAPIKeyUpdate {
  key_name?: string;
  is_active?: boolean;
  is_primary?: boolean;
}

export interface LLMAPIKeyResponse {
  id: string;
  key_name: string;
  is_active: boolean;
  is_primary: boolean;
  total_requests: number;
  failed_requests: number;
  last_success_at?: string;
  last_failure_at?: string;
  created_at: string;
}

export interface LLMProviderCreate {
  name: string;
  display_name: string;
  provider_type: ProviderType;
  base_url?: string;
  default_model: string;
  max_tokens?: number;
  temperature?: number;
  requests_per_minute?: number;
  tokens_per_minute?: number;
  description?: string;
  capabilities?: Record<string, any>;
  api_keys: LLMAPIKeyCreate[];
}

export interface LLMProviderUpdate {
  display_name?: string;
  base_url?: string;
  default_model?: string;
  is_active?: boolean;
  priority?: number;
  max_tokens?: number;
  temperature?: number;
  requests_per_minute?: number;
  tokens_per_minute?: number;
  description?: string;
  capabilities?: Record<string, any>;
}

export interface LLMProviderResponse {
  id: string;
  name: string;
  display_name: string;
  provider_type: ProviderType;
  base_url?: string;
  default_model: string;
  is_active: boolean;
  priority: number;
  max_tokens: number;
  temperature: number;
  requests_per_minute: number;
  tokens_per_minute: number;
  description?: string;
  capabilities?: Record<string, any>;
  api_keys_count: number;
  created_at: string;
  updated_at?: string;
  last_used_at?: string;
}

export interface PromptTemplateCreate {
  name: string;
  description?: string;
  system_prompt: string;
  user_prompt_template: string;
  required_variables?: string[];
  optional_variables?: string[];
  is_default?: boolean;
}

export interface PromptTemplateUpdate {
  name?: string;
  description?: string;
  system_prompt?: string;
  user_prompt_template?: string;
  required_variables?: string[];
  optional_variables?: string[];
  is_active?: boolean;
  is_default?: boolean;
}

export interface PromptTemplateResponse {
  id: string;
  name: string;
  description?: string;
  system_prompt: string;
  user_prompt_template: string;
  required_variables?: string[];
  optional_variables?: string[];
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ProviderStats {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  success_rate: number;
  avg_response_time_ms: number;
  total_cost_usd: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  status: number;
}