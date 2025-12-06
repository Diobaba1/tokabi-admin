
// ============================================================================
// FILE: src/components/common/ProviderStatusChip.tsx
// ============================================================================

import React from 'react';
import { Chip } from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';

interface ProviderStatusChipProps {
  isActive: boolean;
  size?: 'small' | 'medium';
}

export const ProviderStatusChip: React.FC<ProviderStatusChipProps> = ({
  isActive,
  size = 'small',
}) => {
  return (
    <Chip
      icon={isActive ? <CheckCircle /> : <Error />}
      label={isActive ? 'Active' : 'Inactive'}
      color={isActive ? 'success' : 'default'}
      size={size}
      variant="outlined"
    />
  );
};

