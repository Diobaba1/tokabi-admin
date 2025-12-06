// =============================================================================
// FILE: src/hooks/useAdminAnalysis.ts
// =============================================================================
// Custom hooks for admin analysis management
// =============================================================================

import { useState, useCallback, useEffect } from "react";
import { adminAnalysisService } from "../../api/services";
import type {
  AdminSettings,
  AdminSettingsUpdate,
  AnalysisRequest,
  AnalysisResponse,
  AnalysisTriggerRequest,
  AutoAnalysisConfig,
  AvailableLLMProviders,
} from "../../types";

// =============================================================================
// Admin Settings Hook
// =============================================================================

export function useAdminSettings() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminAnalysisService.getSettings();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch settings");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (data: AdminSettingsUpdate) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await adminAnalysisService.updateSettings(data);
      setSettings(updated);
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update settings";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, isLoading, error, fetchSettings, updateSettings };
}

// =============================================================================
// Auto Analysis Hook
// =============================================================================

export function useAutoAnalysis() {
  const [config, setConfig] = useState<AutoAnalysisConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminAnalysisService.getAutoAnalysisStatus();
      setConfig(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch status");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggle = useCallback(async (enabled: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminAnalysisService.toggleAutoAnalysis(enabled);
      setConfig((prev) => prev ? { ...prev, enabled: result.auto_analysis_enabled } : null);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to toggle auto analysis";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const configure = useCallback(async (params: {
    symbols?: string[];
    timeframes?: string[];
    interval_minutes?: number;
    admin_id?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminAnalysisService.configureAutoAnalysis(params);
      setConfig(result.config);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to configure auto analysis";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return { config, isLoading, error, fetchStatus, toggle, configure };
}

// =============================================================================
// Analysis Trigger Hook
// =============================================================================

export function useAnalysisTrigger() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<AnalysisResponse | null>(null);

  const triggerAsync = useCallback(async (data: AnalysisTriggerRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminAnalysisService.triggerAnalysis(data);
      setLastResult(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to trigger analysis";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const triggerSync = useCallback(async (data: AnalysisTriggerRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminAnalysisService.triggerSyncAnalysis(data);
      setLastResult(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to trigger analysis";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { triggerAsync, triggerSync, isLoading, error, lastResult };
}

// =============================================================================
// Analysis Requests Hook
// =============================================================================

export function useAnalysisRequests(statusFilter?: string) {
  const [requests, setRequests] = useState<AnalysisRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async (status?: string, limit?: number, offset?: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminAnalysisService.getAnalysisRequests(
        status || statusFilter,
        limit,
        offset
      );
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch requests");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  const getRequestById = useCallback(async (requestId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminAnalysisService.getAnalysisRequestById(requestId);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch request";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { requests, isLoading, error, fetchRequests, getRequestById };
}

// =============================================================================
// LLM Providers Hook
// =============================================================================

export function useLLMProviders() {
  const [providers, setProviders] = useState<AvailableLLMProviders | null>(null);
  const [activeProviders, setActiveProviders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProviders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminAnalysisService.getAvailableLLMProviders();
      setProviders(data);
      // Extract configured providers
      const configured = Object.entries(data.providers)
        .filter(([_, info]) => info.configured)
        .map(([name]) => name);
      setActiveProviders(configured);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch providers");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const configureProviders = useCallback(async (providerList: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminAnalysisService.configureLLMProviders(providerList);
      setActiveProviders(result.active_providers);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to configure providers";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  return {
    providers,
    activeProviders,
    isLoading,
    error,
    fetchProviders,
    configureProviders,
  };
}

// =============================================================================
// Combined Admin Dashboard Hook
// =============================================================================

export function useAdminDashboard() {
  const settings = useAdminSettings();
  const autoAnalysis = useAutoAnalysis();
  const llmProviders = useLLMProviders();
  const analysisRequests = useAnalysisRequests();

  const isLoading =
    settings.isLoading ||
    autoAnalysis.isLoading ||
    llmProviders.isLoading ||
    analysisRequests.isLoading;

  const errors = [
    settings.error,
    autoAnalysis.error,
    llmProviders.error,
    analysisRequests.error,
  ].filter(Boolean);

  const refetchAll = useCallback(async () => {
    await Promise.all([
      settings.fetchSettings(),
      autoAnalysis.fetchStatus(),
      llmProviders.fetchProviders(),
      analysisRequests.fetchRequests(),
    ]);
  }, [settings, autoAnalysis, llmProviders, analysisRequests]);

  return {
    settings: settings.settings,
    autoAnalysisConfig: autoAnalysis.config,
    providers: llmProviders.providers,
    activeProviders: llmProviders.activeProviders,
    recentRequests: analysisRequests.requests,
    isLoading,
    errors,
    actions: {
      updateSettings: settings.updateSettings,
      toggleAutoAnalysis: autoAnalysis.toggle,
      configureAutoAnalysis: autoAnalysis.configure,
      configureProviders: llmProviders.configureProviders,
      refetchAll,
    },
  };
}