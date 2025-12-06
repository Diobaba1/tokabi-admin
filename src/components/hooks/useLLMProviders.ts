// ============================================================================
// FILE: src/hooks/useLLMProviders.ts (CUSTOM HOOK)
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import { llmProvidersService } from '../../api/services';
import { LLMProviderResponse } from '../../types/llmProvider.types';

export const useLLMProviders = (includeInactive: boolean = false) => {
  const [providers, setProviders] = useState<LLMProviderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await llmProvidersService.listProviders(includeInactive);

    if (result.success && result.data) {
      setProviders(result.data);
    } else {
      setError(result.error?.message || 'Failed to load providers');
    }

    setLoading(false);
  }, [includeInactive]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  return { providers, loading, error, refetch: fetchProviders };
};
