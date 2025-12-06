// =============================================================================
// FILE: src/hooks/index.ts
// =============================================================================
// Hooks Index - Export all custom hooks
// =============================================================================

export {
  useSignals,
  useActiveSignals,
  useSignalDetail,
  useSignalStats,
  useLeverageRecommendations,
  useAvailableSymbols,
  useAdminSignals,
  useSignalStatusUpdate,
} from "./useSignals";

export {
  useAdminSettings,
  useAutoAnalysis,
  useAnalysisTrigger,
  useAnalysisRequests,
  useLLMProviders,
  useAdminDashboard,
} from "./useAdminAnalysis";