
// ============================================================================
// FILE: src/components/common/AnalysisStatusBadge.tsx
// ============================================================================

import React from 'react';
import { Chip } from '@mui/material';

interface AnalysisStatusBadgeProps {
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
}

export const AnalysisStatusBadge: React.FC<AnalysisStatusBadgeProps> = ({
  status,
}) => {
  const getColor = () => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'failed':
      case 'cancelled':
        return 'error';
      case 'processing':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Chip
      label={status.toUpperCase()}
      color={getColor()}
      size="small"
      variant="filled"
    />
  );
};

