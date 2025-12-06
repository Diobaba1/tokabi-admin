// src/api/services/index.ts
export { authService } from './authService';


// Stub export for TokenPrice
export type TokenPrice = { symbol: string; price: number; };

//hhh
export { default as DynamicAnalysisService, dynamicAnalysisService } from './DynamicAnalysisService';
export { default as LLMProvidersService, llmProvidersService } from './LLMProvidersService';
export { default as LLMKeysService, llmKeysService } from './LLMKeysService';
export { default as LLMPromptTemplatesService, llmPromptTemplatesService } from './LLMPromptTemplatesService';

// Signal Services
export { userSignalsService } from "./userSignalsService";
export { adminSignalsService } from "./adminSignalsService";
export { adminAnalysisService } from "./adminAnalysisService";

// Re-export types for convenience
export type {
  Signal,
  SignalDetail,
  SignalStats,
  SignalFilterParams,
  SignalCreateRequest,
  SignalUpdateRequest,
  LeverageRecommendation,
  AnalysisRequest,
  AnalysisResponse,
  AnalysisTriggerRequest,
  AdminSettings,
  AdminSettingsUpdate,
  AutoAnalysisConfig,
  AvailableLLMProviders,
} from "../../types";