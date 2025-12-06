import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  Chip,
  alpha,
} from '@mui/material';
import { 
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ShowChart as ShowChartIcon
} from '@mui/icons-material';
import { dynamicAnalysisService } from '../../api/services/DynamicAnalysisService';
import { QuickAnalysisResponse } from '../../types/dynamicAnalysis.types';

const QuickAnalysisPage: React.FC = () => {
  const [symbol, setSymbol] = useState('');
  const [customContext, setCustomContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuickAnalysisResponse | null>(null);

  const handleAnalyze = async () => {
    if (!symbol) {
      setError('Please enter a symbol');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

      try {
      const response = await dynamicAnalysisService.quickAnalysis(
        symbol.toUpperCase(),
        customContext ? { custom_context: customContext } : undefined
      );

      if (response.success && response.data) {
        setResult(response.data);
      } else {
        // Safely extract error message from the response
        const errorMessage =
          typeof response.error === 'string'
            ? response.error
            : response.error?.message ?? (response.error ? JSON.stringify(response.error) : 'Analysis failed');
        setError(errorMessage);
      }
    } catch (err: any) {
      // Handle unexpected errors
      const errorMessage = err?.message || 
                          err?.msg || 
                          (typeof err === 'string' ? err : 
                          'An unexpected error occurred');
      setError(errorMessage);
    }

    setLoading(false);
  };

  const getDecisionColor = (decision?: string) => {
    switch (decision) {
      case 'long':
        return '#00ff88';
      case 'short':
        return '#ff4444';
      default:
        return '#8b92a7';
    }
  };

  const getDecisionIcon = (decision?: string) => {
    switch (decision) {
      case 'long':
        return <TrendingUpIcon sx={{ fontSize: 32 }} />;
      case 'short':
        return <TrendingDownIcon sx={{ fontSize: 32 }} />;
      default:
        return <ShowChartIcon sx={{ fontSize: 32 }} />;
    }
  };

  // Helper function to safely render error messages
  const renderErrorMessage = (error: any): string => {
    if (!error) return 'Unknown error';
    
    if (typeof error === 'string') return error;
    
    if (typeof error === 'object') {
      return error.message || error.msg || JSON.stringify(error);
    }
    
    return String(error);
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#0a0e1a', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#00d9ff', mb: 1 }}>
            Quick Analysis
          </Typography>
          <Typography variant="body1" sx={{ color: '#8b92a7' }}>
            Get instant analysis for any symbol
          </Typography>
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
              '& .MuiAlert-icon': { color: '#ff4444' }
            }}
          >
            {renderErrorMessage(error)}
          </Alert>
        )}

        <Card 
          elevation={0}
          sx={{ 
            bgcolor: '#151b2b',
            border: '1px solid #1e2837',
            borderRadius: 2,
            mb: 3
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              <TextField
                label="Symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="e.g., BTCUSDT"
                fullWidth
                autoFocus
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#e4e7ec',
                    fontSize: '1.1rem',
                    '& fieldset': { borderColor: '#1e2837' },
                    '&:hover fieldset': { borderColor: '#00d9ff' },
                    '&.Mui-focused fieldset': { borderColor: '#00d9ff', borderWidth: 2 }
                  },
                  '& .MuiInputLabel-root': { color: '#8b92a7', fontSize: '1.1rem' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#00d9ff' }
                }}
              />

              <TextField
                label="Custom Context (Optional)"
                multiline
                rows={3}
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
                placeholder="Add specific instructions..."
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#e4e7ec',
                    '& fieldset': { borderColor: '#1e2837' },
                    '&:hover fieldset': { borderColor: '#00d9ff' },
                    '&.Mui-focused fieldset': { borderColor: '#00d9ff' }
                  },
                  '& .MuiInputLabel-root': { color: '#8b92a7' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#00d9ff' }
                }}
              />

              <Button
                variant="contained"
                size="large"
                startIcon={loading ? <CircularProgress size={24} sx={{ color: '#0a0e1a' }} /> : <SearchIcon />}
                onClick={handleAnalyze}
                disabled={loading || !symbol}
                fullWidth
                sx={{
                  bgcolor: '#00d9ff',
                  color: '#0a0e1a',
                  fontWeight: 600,
                  py: 1.8,
                  fontSize: '1.1rem',
                  '&:hover': {
                    bgcolor: '#00b8d9',
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 24px ${alpha('#00d9ff', 0.3)}`
                  },
                  '&:disabled': {
                    bgcolor: alpha('#00d9ff', 0.3),
                    color: alpha('#0a0e1a', 0.5)
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {result && (
          <Card 
            elevation={0}
            sx={{ 
              bgcolor: '#151b2b',
              border: '1px solid #1e2837',
              borderRadius: 2
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ color: '#00d9ff', mb: 4, fontWeight: 600 }}>
                Analysis Result
              </Typography>

              {result.status === 'success' ? (
                <Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2, 
                    mb: 4,
                    pb: 3,
                    borderBottom: '1px solid #1e2837'
                  }}>
                    <Box 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        bgcolor: alpha(getDecisionColor(result.decision), 0.1),
                        color: getDecisionColor(result.decision),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {getDecisionIcon(result.decision)}
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ color: '#e4e7ec', fontWeight: 700, mb: 0.5 }}>
                        {result.symbol}
                      </Typography>
                      <Chip
                        label={result.decision?.toUpperCase() || 'NEUTRAL'}
                        sx={{
                          bgcolor: alpha(getDecisionColor(result.decision), 0.1),
                          color: getDecisionColor(result.decision),
                          border: '1px solid',
                          borderColor: alpha(getDecisionColor(result.decision), 0.3),
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          px: 1
                        }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap',
                    gap: 3 
                  }}>
                    {result.consensus_strength && (
                      <Box 
                        sx={{ 
                          flex: '1 1 200px',
                          p: 3,
                          borderRadius: 2,
                          bgcolor: alpha('#00d9ff', 0.05),
                          border: '1px solid',
                          borderColor: alpha('#00d9ff', 0.2)
                        }}
                      >
                        <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 1 }}>
                          CONSENSUS STRENGTH
                        </Typography>
                        <Typography variant="h4" sx={{ color: '#00d9ff', fontWeight: 700 }}>
                          {result.consensus_strength.toFixed(1)}%
                        </Typography>
                      </Box>
                    )}

                    {result.risk_metrics?.suggested_leverage && (
                      <Box 
                        sx={{ 
                          flex: '1 1 200px',
                          p: 3,
                          borderRadius: 2,
                          bgcolor: alpha('#8b92a7', 0.05),
                          border: '1px solid',
                          borderColor: alpha('#8b92a7', 0.2)
                        }}
                      >
                        <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 1 }}>
                          SUGGESTED LEVERAGE
                        </Typography>
                        <Typography variant="h4" sx={{ color: '#e4e7ec', fontWeight: 700 }}>
                          {result.risk_metrics.suggested_leverage}x
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {result.risk_metrics && (
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="subtitle1" sx={{ color: '#00d9ff', mb: 3, fontWeight: 600 }}>
                        Risk Metrics
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap',
                        gap: 3 
                      }}>
                        {result.risk_metrics.entry_price && (
                          <Box sx={{ flex: '1 1 150px' }}>
                            <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 1 }}>
                              ENTRY PRICE
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#e4e7ec', fontWeight: 600 }}>
                              ${result.risk_metrics.entry_price.toFixed(2)}
                            </Typography>
                          </Box>
                        )}

                        {result.risk_metrics.take_profit_price && (
                          <Box sx={{ flex: '1 1 150px' }}>
                            <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 1 }}>
                              TAKE PROFIT
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#00ff88', fontWeight: 600 }}>
                              ${result.risk_metrics.take_profit_price.toFixed(2)}
                            </Typography>
                          </Box>
                        )}

                        {result.risk_metrics.stop_loss_price && (
                          <Box sx={{ flex: '1 1 150px' }}>
                            <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 1 }}>
                              STOP LOSS
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#ff4444', fontWeight: 600 }}>
                              ${result.risk_metrics.stop_loss_price.toFixed(2)}
                            </Typography>
                          </Box>
                        )}

                        {result.risk_metrics.risk_reward_ratio && (
                          <Box sx={{ flex: '1 1 150px' }}>
                            <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 1 }}>
                              RISK/REWARD RATIO
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#00d9ff', fontWeight: 600 }}>
                              {result.risk_metrics.risk_reward_ratio.toFixed(2)}:1
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )}
                </Box>
              ) : (
                <Alert 
                  severity="error"
                  sx={{
                    bgcolor: alpha('#ff4444', 0.1),
                    border: '1px solid',
                    borderColor: alpha('#ff4444', 0.3),
                    color: '#ff6b6b',
                    '& .MuiAlert-icon': { color: '#ff4444' }
                  }}
                >
                  {renderErrorMessage(result.error)}
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default QuickAnalysisPage;