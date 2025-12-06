// =============================================================================
// FILE: src/hooks/useSignals.ts
// =============================================================================
// Custom hooks for signal management
// =============================================================================

import { useState, useCallback, useEffect } from "react";
import { userSignalsService, adminSignalsService } from "../../api/services";
import type {
  Signal,
  SignalDetail,
  SignalStats,
  SignalFilterParams,
  SignalCreateRequest,
  SignalUpdateRequest,
  LeverageRecommendation,
  SignalStatus,
} from "../../types";

// =============================================================================
// User Signals Hook
// =============================================================================

export function useSignals(initialFilters?: SignalFilterParams) {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SignalFilterParams>(initialFilters || {});

  const fetchSignals = useCallback(async (filterParams?: SignalFilterParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userSignalsService.getSignals(filterParams || filters);
      setSignals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch signals");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<SignalFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  return {
    signals,
    isLoading,
    error,
    filters,
    fetchSignals,
    updateFilters,
    resetFilters,
  };
}

// =============================================================================
// Active Signals Hook
// =============================================================================

export function useActiveSignals(symbol?: string, limit?: number) {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveSignals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userSignalsService.getActiveSignals(symbol, limit);
      setSignals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch active signals");
    } finally {
      setIsLoading(false);
    }
  }, [symbol, limit]);

  useEffect(() => {
    fetchActiveSignals();
  }, [fetchActiveSignals]);

  return { signals, isLoading, error, refetch: fetchActiveSignals };
}

// =============================================================================
// Signal Detail Hook
// =============================================================================

export function useSignalDetail(signalId: string | null) {
  const [signal, setSignal] = useState<SignalDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSignal = useCallback(async () => {
    if (!signalId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await userSignalsService.getSignalById(signalId);
      setSignal(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch signal");
    } finally {
      setIsLoading(false);
    }
  }, [signalId]);

  useEffect(() => {
    fetchSignal();
  }, [fetchSignal]);

  return { signal, isLoading, error, refetch: fetchSignal };
}

// =============================================================================
// Signal Stats Hook
// =============================================================================

export function useSignalStats(
  timeframe: "1h" | "24h" | "7d" | "30d" | "all" = "24h",
  isAdmin: boolean = false
) {
  const [stats, setStats] = useState<SignalStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const service = isAdmin ? adminSignalsService : userSignalsService;
      const data = await service.getStats(timeframe);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
    } finally {
      setIsLoading(false);
    }
  }, [timeframe, isAdmin]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
}

// =============================================================================
// Leverage Recommendations Hook
// =============================================================================

export function useLeverageRecommendations(
  symbol?: string,
  minConsensus?: number,
  limit?: number
) {
  const [recommendations, setRecommendations] = useState<LeverageRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userSignalsService.getLeverageRecommendations(
        symbol,
        minConsensus,
        limit
      );
      setRecommendations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch recommendations");
    } finally {
      setIsLoading(false);
    }
  }, [symbol, minConsensus, limit]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return { recommendations, isLoading, error, refetch: fetchRecommendations };
}

// =============================================================================
// Available Symbols Hook
// =============================================================================

export function useAvailableSymbols() {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSymbols = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userSignalsService.getSymbols();
      setSymbols(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch symbols");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSymbols();
  }, [fetchSymbols]);

  return { symbols, isLoading, error, refetch: fetchSymbols };
}

// =============================================================================
// Admin Signals Hook
// =============================================================================

export function useAdminSignals(initialFilters?: SignalFilterParams) {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SignalFilterParams>(initialFilters || {});

  const fetchSignals = useCallback(async (filterParams?: SignalFilterParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminSignalsService.getAllSignals(filterParams || filters);
      setSignals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch signals");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const createSignal = useCallback(async (data: SignalCreateRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const newSignal = await adminSignalsService.createSignal(data);
      setSignals((prev) => [newSignal, ...prev]);
      return newSignal;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create signal";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSignal = useCallback(async (signalId: string, data: SignalUpdateRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await adminSignalsService.updateSignal(signalId, data);
      setSignals((prev) =>
        prev.map((s) => (s.id === signalId ? { ...s, ...updated } : s))
      );
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update signal";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteSignal = useCallback(async (signalId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await adminSignalsService.deleteSignal(signalId);
      setSignals((prev) => prev.filter((s) => s.id !== signalId));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete signal";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const bulkDelete = useCallback(async (signalIds: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      await adminSignalsService.bulkDeleteSignals(signalIds);
      setSignals((prev) => prev.filter((s) => !signalIds.includes(s.id)));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete signals";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cleanupExpired = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminSignalsService.cleanupExpiredSignals();
      await fetchSignals();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to cleanup signals";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [fetchSignals]);

  const updateFilters = useCallback((newFilters: Partial<SignalFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  return {
    signals,
    isLoading,
    error,
    filters,
    fetchSignals,
    createSignal,
    updateSignal,
    deleteSignal,
    bulkDelete,
    cleanupExpired,
    updateFilters,
  };
}

// =============================================================================
// Signal Status Update Hook
// =============================================================================

export function useSignalStatusUpdate() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = useCallback(async (signalId: string, status: SignalStatus) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await userSignalsService.updateSignalStatus(signalId, status);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update status";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { updateStatus, isLoading, error };
}