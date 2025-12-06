

// ============================================================================
// FILE: src/hooks/useDynamicAnalysis.ts (CUSTOM HOOK)
// ============================================================================

import { useState, useCallback } from 'react';
import { dynamicAnalysisService } from '../../api/services';
import {
  AnalysisRequest,
  AnalysisRequestResponse,
} from '../../types/dynamicAnalysis.types';

export const useDynamicAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [request, setRequest] = useState<AnalysisRequestResponse | null>(null);

  const startAnalysis = useCallback(async (data: AnalysisRequest) => {
    setLoading(true);
    setError(null);

    const result = await dynamicAnalysisService.createAnalysisRequest(data);

    if (result.success && result.data) {
      setRequest(result.data);
      // Start polling
      pollStatus(result.data.id);
    } else {
      setError(result.error?.message || 'Failed to start analysis');
      setLoading(false);
    }
  }, []);

  const pollStatus = async (requestId: string) => {
    const result = await dynamicAnalysisService.pollAnalysisStatus(requestId);

    if (result.success && result.data) {
      setRequest(result.data);

      if (
        result.data.status === 'completed' ||
        result.data.status === 'failed' ||
        result.data.status === 'cancelled'
      ) {
        setLoading(false);
      }
    } else {
      setError(result.error?.message || 'Failed to get status');
      setLoading(false);
    }
  };

  const quickAnalysis = useCallback(
    async (symbol: string, customContext?: string) => {
      setLoading(true);
      setError(null);

      const result = await dynamicAnalysisService.quickAnalysis(symbol, {
        custom_context: customContext,
      });

      setLoading(false);

      if (result.success) {
        return result.data;
      } else {
        setError(result.error?.message || 'Analysis failed');
        return null;
      }
    },
    []
  );

  return {
    loading,
    error,
    request,
    startAnalysis,
    quickAnalysis,
  };
};
