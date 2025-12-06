// ============================================================================
// FILE: src/pages/signals/SignalsDashboard.tsx
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  alpha,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as RemoveIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { signalsService } from '../../api/services/SignalService';

interface Signal {
  id: string;
  symbol: string;
  decision: 'long' | 'short' | 'hold';
  consensus_strength: number;
  avg_confidence: number;
  entry_price?: number;
  stop_loss?: number;
  take_profit?: number;
  risk_reward_ratio?: number;
  suggested_leverage?: number;
  stop_loss_percent?: number;
  take_profit_percent?: number;
  provider_decisions: Record<string, string>;
  reasoning_summary?: string;
  active_providers: number;
  timeframes_analyzed?: string[];
  status: 'active' | 'expired' | 'executed';
  created_at: string;
  expires_at?: string;
}

const SignalsDashboard: React.FC = () => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [filterSymbol, setFilterSymbol] = useState('');
  const [filterDecision, setFilterDecision] = useState('');
  const [filterStatus, setFilterStatus] = useState('active');
  
  // Detail dialog
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    loadSignals();
  }, [filterSymbol, filterDecision, filterStatus]);

  const loadSignals = async () => {
    setLoading(true);
    setError(null);

    const result = await signalsService.getSignals({
      symbol: filterSymbol || undefined,
      decision: filterDecision || undefined,
      status: filterStatus || undefined,
      limit: 50,
    });

    if (result.success && result.data) {
      setSignals(result.data);
    } else {
      setError(result.error?.message || 'Failed to load signals');
    }

    setLoading(false);
  };

  const handleViewDetails = (signal: Signal) => {
    setSelectedSignal(signal);
    setDetailOpen(true);
  };

  const handleUpdateStatus = async (signalId: string, newStatus: string) => {
    const result = await signalsService.updateSignalStatus(signalId, newStatus);

    if (result.success) {
      loadSignals();
    } else {
      setError(result.error?.message || 'Failed to update signal');
    }
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'long':
        return '#00ff88';
      case 'short':
        return '#ff4444';
      default:
        return '#8b92a7';
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'long':
        return <TrendingUpIcon sx={{ fontSize: 24 }} />;
      case 'short':
        return <TrendingDownIcon sx={{ fontSize: 24 }} />;
      default:
        return <RemoveIcon sx={{ fontSize: 24 }} />;
    }
  };

  const formatPrice = (price?: number) => {
    return price ? `$${price.toFixed(2)}` : 'N/A';
  };

  const formatPercent = (percent?: number) => {
    return percent ? `${percent.toFixed(2)}%` : 'N/A';
  };

  if (loading && signals.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress sx={{ color: '#00d9ff' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#0a0e1a', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#00d9ff', mb: 1 }}>
              Trading Signals
            </Typography>
            <Typography variant="body2" sx={{ color: '#8b92a7' }}>
              {signals.length} signals found
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadSignals}
            sx={{
              borderColor: '#1e2837',
              color: '#00d9ff',
              '&:hover': {
                borderColor: '#00d9ff',
                bgcolor: alpha('#00d9ff', 0.05),
              },
            }}
          >
            Refresh
          </Button>
        </Box>

        {error && (
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{
              mb: 3,
              bgcolor: alpha('#ff4444', 0.1),
              border: '1px solid',
              borderColor: alpha('#ff4444', 0.3),
              color: '#ff6b6b',
            }}
          >
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Card
          elevation={0}
          sx={{
            bgcolor: '#151b2b',
            border: '1px solid #1e2837',
            mb: 3,
          }}
        >
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              <FilterIcon sx={{ color: '#8b92a7' }} />
              <TextField
                size="small"
                label="Symbol"
                value={filterSymbol}
                onChange={(e) => setFilterSymbol(e.target.value.toUpperCase())}
                placeholder="e.g., BTCUSDT"
                sx={{
                  width: { xs: '100%', sm: 200 },
                  '& .MuiOutlinedInput-root': {
                    color: '#e4e7ec',
                    '& fieldset': { borderColor: '#1e2837' },
                    '&:hover fieldset': { borderColor: '#00d9ff' },
                  },
                  '& .MuiInputLabel-root': { color: '#8b92a7' },
                }}
              />
              <TextField
                select
                size="small"
                label="Decision"
                value={filterDecision}
                onChange={(e) => setFilterDecision(e.target.value)}
                sx={{
                  width: { xs: '100%', sm: 150 },
                  '& .MuiOutlinedInput-root': {
                    color: '#e4e7ec',
                    '& fieldset': { borderColor: '#1e2837' },
                    '&:hover fieldset': { borderColor: '#00d9ff' },
                  },
                  '& .MuiInputLabel-root': { color: '#8b92a7' },
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="long">Long</MenuItem>
                <MenuItem value="short">Short</MenuItem>
                <MenuItem value="hold">Hold</MenuItem>
              </TextField>
              <TextField
                select
                size="small"
                label="Status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                sx={{
                  width: { xs: '100%', sm: 150 },
                  '& .MuiOutlinedInput-root': {
                    color: '#e4e7ec',
                    '& fieldset': { borderColor: '#1e2837' },
                    '&:hover fieldset': { borderColor: '#00d9ff' },
                  },
                  '& .MuiInputLabel-root': { color: '#8b92a7' },
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="executed">Executed</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
              </TextField>
            </Stack>
          </CardContent>
        </Card>

        {/* Signals Container - Flexbox alternative to Grid */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: { xs: 'center', sm: 'flex-start' },
          }}
        >
          {signals.map((signal) => (
            <Box
              key={signal.id}
              sx={{
                flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', lg: '1 1 calc(33.333% - 16px)' },
                maxWidth: { xs: '100%', sm: 'calc(50% - 12px)', lg: 'calc(33.333% - 16px)' },
                minWidth: { xs: '100%', sm: 350, lg: 350 },
              }}
            >
              <Card
                elevation={0}
                sx={{
                  bgcolor: '#151b2b',
                  border: '1px solid #1e2837',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: getDecisionColor(signal.decision),
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 24px ${alpha(getDecisionColor(signal.decision), 0.2)}`,
                  },
                }}
              >
                <CardContent>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          bgcolor: alpha(getDecisionColor(signal.decision), 0.1),
                          color: getDecisionColor(signal.decision),
                        }}
                      >
                        {getDecisionIcon(signal.decision)}
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ color: '#e4e7ec', fontWeight: 600 }}>
                          {signal.symbol}
                        </Typography>
                        <Chip
                          label={signal.decision.toUpperCase()}
                          size="small"
                          sx={{
                            bgcolor: alpha(getDecisionColor(signal.decision), 0.1),
                            color: getDecisionColor(signal.decision),
                            border: '1px solid',
                            borderColor: alpha(getDecisionColor(signal.decision), 0.3),
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    </Box>
                    <Chip
                      label={signal.status.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor:
                          signal.status === 'active'
                            ? alpha('#00d9ff', 0.1)
                            : alpha('#8b92a7', 0.1),
                        color: signal.status === 'active' ? '#00d9ff' : '#8b92a7',
                      }}
                    />
                  </Box>

                  {/* Metrics */}
                  <Stack spacing={2} mb={2}>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                          CONSENSUS
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#00d9ff', fontWeight: 600 }}>
                          {signal.consensus_strength.toFixed(1)}%
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                          CONFIDENCE
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#e4e7ec', fontWeight: 600 }}>
                          {(signal.avg_confidence * 100).toFixed(0)}%
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                          LLMs
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#e4e7ec', fontWeight: 600 }}>
                          {signal.active_providers}
                        </Typography>
                      </Box>
                    </Box>

                    {signal.decision !== 'hold' && (
                      <>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" sx={{ color: '#6b7280' }}>
                              ENTRY
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#e4e7ec', fontWeight: 600 }}>
                              {formatPrice(signal.entry_price)}
                            </Typography>
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" sx={{ color: '#6b7280' }}>
                              STOP LOSS
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#ff4444', fontWeight: 600 }}>
                              {formatPrice(signal.stop_loss)}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" sx={{ color: '#6b7280' }}>
                              TAKE PROFIT
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#00ff88', fontWeight: 600 }}>
                              {formatPrice(signal.take_profit)}
                            </Typography>
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" sx={{ color: '#6b7280' }}>
                              R:R
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#00d9ff', fontWeight: 600 }}>
                              {signal.risk_reward_ratio?.toFixed(2) || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </>
                    )}
                  </Stack>

                  {/* Actions */}
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(signal)}
                        sx={{
                          color: '#00d9ff',
                          bgcolor: alpha('#00d9ff', 0.1),
                          '&:hover': { bgcolor: alpha('#00d9ff', 0.2) },
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {signal.status === 'active' && (
                      <>
                        <Tooltip title="Mark as Executed">
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateStatus(signal.id, 'executed')}
                            sx={{
                              color: '#00ff88',
                              bgcolor: alpha('#00ff88', 0.1),
                              '&:hover': { bgcolor: alpha('#00ff88', 0.2) },
                            }}
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Mark as Expired">
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateStatus(signal.id, 'expired')}
                            sx={{
                              color: '#8b92a7',
                              bgcolor: alpha('#8b92a7', 0.1),
                              '&:hover': { bgcolor: alpha('#8b92a7', 0.2) },
                            }}
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Stack>

                  <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mt: 2 }}>
                    Created: {new Date(signal.created_at).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        {signals.length === 0 && !loading && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              border: '1px dashed #1e2837',
              borderRadius: 2,
              mt: 3,
            }}
          >
            <Typography variant="h6" sx={{ color: '#8b92a7', mb: 1 }}>
              No signals found
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              Try adjusting your filters or refresh the page
            </Typography>
          </Box>
        )}

        {/* Detail Dialog */}
        {selectedSignal && (
          <Dialog
            open={detailOpen}
            onClose={() => setDetailOpen(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                bgcolor: '#151b2b',
                border: '1px solid #1e2837',
              },
            }}
          >
            <DialogTitle sx={{ color: '#00d9ff', borderBottom: '1px solid #1e2837' }}>
              Signal Details - {selectedSignal.symbol}
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#8b92a7', mb: 1 }}>
                    Decision
                  </Typography>
                  <Chip
                    label={selectedSignal.decision.toUpperCase()}
                    sx={{
                      bgcolor: alpha(getDecisionColor(selectedSignal.decision), 0.1),
                      color: getDecisionColor(selectedSignal.decision),
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#8b92a7', mb: 1 }}>
                    Provider Decisions
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {Object.entries(selectedSignal.provider_decisions).map(([provider, decision]) => (
                      <Chip
                        key={provider}
                        label={`${provider}: ${decision}`}
                        size="small"
                        sx={{
                          bgcolor: alpha('#00d9ff', 0.1),
                          color: '#00d9ff',
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {selectedSignal.reasoning_summary && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#8b92a7', mb: 1 }}>
                      Reasoning Summary
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#e4e7ec' }}>
                      {selectedSignal.reasoning_summary}
                    </Typography>
                  </Box>
                )}

                {selectedSignal.timeframes_analyzed && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#8b92a7', mb: 1 }}>
                      Timeframes Analyzed
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedSignal.timeframes_analyzed.map((tf) => (
                        <Chip key={tf} label={tf} size="small" />
                      ))}
                    </Box>
                  </Box>
                )}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ borderTop: '1px solid #1e2837', p: 2 }}>
              <Button onClick={() => setDetailOpen(false)} sx={{ color: '#8b92a7' }}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </Box>
  );
};

export default SignalsDashboard;