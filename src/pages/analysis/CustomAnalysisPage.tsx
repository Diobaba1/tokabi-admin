// ============================================================================
// FILE: src/pages/analysis/CustomAnalysisPage.tsx
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  alpha,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { dynamicAnalysisService } from '../../api/services/DynamicAnalysisService';
import { llmProvidersService } from '../../api/services/LLMProvidersService';
import { llmPromptTemplatesService } from '../../api/services/LLMPromptTemplatesService';
import {
  AnalysisRequestResponse,
  AnalysisResult,
} from '../../types/dynamicAnalysis.types';

const COMMON_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT'];
const DEFAULT_TIMEFRAMES = ['5m', '15m', '1h', '4h'];

const CustomAnalysisPage: React.FC = () => {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [timeframes, setTimeframes] = useState<string[]>(DEFAULT_TIMEFRAMES);
  const [customContext, setCustomContext] = useState('');
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  
  const [providers, setProviders] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisRequest, setAnalysisRequest] = useState<AnalysisRequestResponse | null>(null);
  const [results, setResults] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    loadProvidersAndTemplates();
  }, []);

  const loadProvidersAndTemplates = async () => {
    const [providersRes, templatesRes] = await Promise.all([
      llmProvidersService.listProviders(false),
      llmPromptTemplatesService.listTemplates(false),
    ]);

    if (providersRes.success && providersRes.data) {
      setProviders(providersRes.data);
    }

    if (templatesRes.success && templatesRes.data) {
      setTemplates(templatesRes.data);
    }
  };

  const handleStartAnalysis = async () => {
    if (symbols.length === 0) {
      setError('Please select at least one symbol');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    const result = await dynamicAnalysisService.createAnalysisRequest({
      symbols,
      timeframes: timeframes.length > 0 ? timeframes : undefined,
      custom_context: customContext || undefined,
      prompt_template_id: selectedTemplate || undefined,
      selected_providers: selectedProviders.length > 0 ? selectedProviders : undefined,
    });

    if (result.success && result.data) {
      setAnalysisRequest(result.data);
      pollAnalysisStatus(result.data.id);
    } else {
      setError(result.error?.message || 'Failed to start analysis');
      setLoading(false);
    }
  };

  const pollAnalysisStatus = async (requestId: string) => {
    const result = await dynamicAnalysisService.pollAnalysisStatus(requestId);

    if (result.success && result.data) {
      setAnalysisRequest(result.data);

      if (result.data.status === 'completed') {
        setLoading(false);
      } else if (result.data.status === 'failed') {
        setError(result.data.error_message || 'Analysis failed');
        setLoading(false);
      }
    } else {
      setError(result.error?.message || 'Failed to get analysis status');
      setLoading(false);
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'long':
        return <TrendingUpIcon />;
      case 'short':
        return <TrendingDownIcon />;
      default:
        return <RemoveIcon />;
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

  return (
    <Box sx={{ p: 3, bgcolor: '#0a0e1a', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#00d9ff', mb: 1 }}>
            Custom Analysis
          </Typography>
          <Typography variant="body1" sx={{ color: '#8b92a7' }}>
            Analyze any symbols with custom timeframes and context
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
            {error}
          </Alert>
        )}

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 3 
        }}>
          {/* Configuration Card */}
          <Box sx={{ 
            width: { xs: '100%', lg: '50%' },
            minWidth: { xs: '100%', sm: '300px' }
          }}>
            <Card 
              elevation={0}
              sx={{ 
                bgcolor: '#151b2b',
                border: '1px solid #1e2837',
                borderRadius: 2
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: '#00d9ff', mb: 3, fontWeight: 600 }}>
                  Configuration
                </Typography>

                <Stack spacing={3}>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={COMMON_SYMBOLS}
                    value={symbols}
                    onChange={(_, newValue) => setSymbols(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Symbols"
                        placeholder="Add symbols (e.g., BTCUSDT)"
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
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option}
                          {...getTagProps({ index })}
                          sx={{
                            bgcolor: alpha('#00d9ff', 0.1),
                            color: '#00d9ff',
                            border: '1px solid',
                            borderColor: alpha('#00d9ff', 0.2)
                          }}
                        />
                      ))
                    }
                    sx={{
                      '& .MuiAutocomplete-popupIndicator': { color: '#8b92a7' },
                      '& .MuiAutocomplete-clearIndicator': { color: '#8b92a7' }
                    }}
                  />

                  <Autocomplete
                    multiple
                    options={['1m', '5m', '15m', '30m', '1h', '4h', '1d']}
                    value={timeframes}
                    onChange={(_, newValue) => setTimeframes(newValue)}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        label="Timeframes"
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
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option}
                          {...getTagProps({ index })}
                          sx={{
                            bgcolor: alpha('#00d9ff', 0.1),
                            color: '#00d9ff',
                            border: '1px solid',
                            borderColor: alpha('#00d9ff', 0.2)
                          }}
                        />
                      ))
                    }
                    sx={{
                      '& .MuiAutocomplete-popupIndicator': { color: '#8b92a7' },
                      '& .MuiAutocomplete-clearIndicator': { color: '#8b92a7' }
                    }}
                  />

                  <FormControl fullWidth>
                    <InputLabel sx={{ color: '#8b92a7', '&.Mui-focused': { color: '#00d9ff' } }}>
                      LLM Providers (Optional)
                    </InputLabel>
                    <Select
                      multiple
                      value={selectedProviders}
                      onChange={(e) => setSelectedProviders(e.target.value as string[])}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                            const provider = providers.find((p) => p.id === value);
                            return (
                              <Chip
                                key={value}
                                label={provider?.display_name || value}
                                size="small"
                                sx={{
                                  bgcolor: alpha('#00d9ff', 0.1),
                                  color: '#00d9ff',
                                  border: '1px solid',
                                  borderColor: alpha('#00d9ff', 0.2)
                                }}
                              />
                            );
                          })}
                        </Box>
                      )}
                      sx={{
                        color: '#e4e7ec',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1e2837' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00d9ff' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00d9ff' },
                        '& .MuiSvgIcon-root': { color: '#8b92a7' }
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: '#151b2b',
                            border: '1px solid #1e2837',
                            '& .MuiMenuItem-root': {
                              color: '#e4e7ec',
                              '&:hover': {
                                bgcolor: alpha('#00d9ff', 0.1)
                              },
                              '&.Mui-selected': {
                                bgcolor: alpha('#00d9ff', 0.15),
                                '&:hover': {
                                  bgcolor: alpha('#00d9ff', 0.2)
                                }
                              }
                            }
                          }
                        }
                      }}
                    >
                      {providers.map((provider) => (
                        <MenuItem key={provider.id} value={provider.id}>
                          {provider.display_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel sx={{ color: '#8b92a7', '&.Mui-focused': { color: '#00d9ff' } }}>
                      Prompt Template (Optional)
                    </InputLabel>
                    <Select
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      sx={{
                        color: '#e4e7ec',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1e2837' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00d9ff' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00d9ff' },
                        '& .MuiSvgIcon-root': { color: '#8b92a7' }
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: '#151b2b',
                            border: '1px solid #1e2837',
                            '& .MuiMenuItem-root': {
                              color: '#e4e7ec',
                              '&:hover': {
                                bgcolor: alpha('#00d9ff', 0.1)
                              }
                            }
                          }
                        }
                      }}
                    >
                      <MenuItem value="">
                        <em>Default</em>
                      </MenuItem>
                      {templates.map((template) => (
                        <MenuItem key={template.id} value={template.id}>
                          {template.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Custom Context"
                    multiline
                    rows={4}
                    value={customContext}
                    onChange={(e) => setCustomContext(e.target.value)}
                    placeholder="Add specific instructions for the analysis..."
                    helperText="Optional: Add specific focus areas or instructions"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#e4e7ec',
                        '& fieldset': { borderColor: '#1e2837' },
                        '&:hover fieldset': { borderColor: '#00d9ff' },
                        '&.Mui-focused fieldset': { borderColor: '#00d9ff' }
                      },
                      '& .MuiInputLabel-root': { color: '#8b92a7' },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#00d9ff' },
                      '& .MuiFormHelperText-root': { color: '#6b7280' }
                    }}
                  />

                  <Button
                    variant="contained"
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} sx={{ color: '#0a0e1a' }} /> : <PlayArrowIcon />}
                    onClick={handleStartAnalysis}
                    disabled={loading || symbols.length === 0}
                    fullWidth
                    sx={{
                      bgcolor: '#00d9ff',
                      color: '#0a0e1a',
                      fontWeight: 600,
                      py: 1.5,
                      '&:hover': {
                        bgcolor: '#00b8d9'
                      },
                      '&:disabled': {
                        bgcolor: alpha('#00d9ff', 0.3),
                        color: alpha('#0a0e1a', 0.5)
                      }
                    }}
                  >
                    {loading ? 'Analyzing...' : 'Start Analysis'}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Status & Results Card */}
          <Box sx={{ 
            width: { xs: '100%', lg: '50%' },
            minWidth: { xs: '100%', sm: '300px' }
          }}>
            <Card 
              elevation={0}
              sx={{ 
                bgcolor: '#151b2b',
                border: '1px solid #1e2837',
                borderRadius: 2,
                mb: 3
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: '#00d9ff', mb: 3, fontWeight: 600 }}>
                  Analysis Status
                </Typography>

                {analysisRequest ? (
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 1 }}>
                        STATUS
                      </Typography>
                      <Chip
                        label={analysisRequest.status.toUpperCase()}
                        sx={{
                          bgcolor: analysisRequest.status === 'completed'
                            ? alpha('#00ff88', 0.1)
                            : analysisRequest.status === 'failed'
                            ? alpha('#ff4444', 0.1)
                            : alpha('#00d9ff', 0.1),
                          color: analysisRequest.status === 'completed'
                            ? '#00ff88'
                            : analysisRequest.status === 'failed'
                            ? '#ff4444'
                            : '#00d9ff',
                          border: '1px solid',
                          borderColor: analysisRequest.status === 'completed'
                            ? alpha('#00ff88', 0.3)
                            : analysisRequest.status === 'failed'
                            ? alpha('#ff4444', 0.3)
                            : alpha('#00d9ff', 0.3),
                          fontWeight: 600
                        }}
                      />
                    </Box>

                    {analysisRequest.status === 'processing' && (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 1 }}>
                          PROGRESS: {analysisRequest.progress}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={analysisRequest.progress}
                          sx={{
                            height: 8,
                            borderRadius: 1,
                            bgcolor: alpha('#00d9ff', 0.1),
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#00d9ff',
                              borderRadius: 1
                            }
                          }}
                        />
                      </Box>
                    )}

                    <Box>
                      <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 1 }}>
                        SYMBOLS
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {analysisRequest.symbols.map((sym) => (
                          <Chip 
                            key={sym}
                            label={sym}
                            size="small"
                            sx={{
                              bgcolor: alpha('#00d9ff', 0.1),
                              color: '#00d9ff',
                              border: '1px solid',
                              borderColor: alpha('#00d9ff', 0.2)
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    {analysisRequest.signals_generated > 0 && (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 1 }}>
                          SIGNALS GENERATED
                        </Typography>
                        <Typography variant="h3" sx={{ color: '#00d9ff', fontWeight: 700 }}>
                          {analysisRequest.signals_generated}
                        </Typography>
                      </Box>
                    )}

                    {analysisRequest.execution_time_ms && (
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        Execution time: {(analysisRequest.execution_time_ms / 1000).toFixed(2)}s
                      </Typography>
                    )}
                  </Stack>
                ) : (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 4,
                    border: '2px dashed #1e2837',
                    borderRadius: 2
                  }}>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      Configure and start analysis to see results
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {analysisRequest?.status === 'completed' && (
              <Card 
                elevation={0}
                sx={{ 
                  bgcolor: '#151b2b',
                  border: '1px solid #1e2837',
                  borderRadius: 2
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: '#00d9ff', mb: 3, fontWeight: 600 }}>
                    Results
                  </Typography>
                  <Stack spacing={2}>
                    {analysisRequest.symbols.map((symbol) => (
                      <Card 
                        key={symbol}
                        elevation={0}
                        sx={{ 
                          bgcolor: '#0a0e1a',
                          border: '1px solid #1e2837',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: '#00d9ff',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ color: '#e4e7ec', fontWeight: 600 }}>
                              {symbol}
                            </Typography>
                            <Chip
                              icon={<TrendingUpIcon sx={{ color: '#00ff88 !important' }} />}
                              label="LONG"
                              sx={{
                                bgcolor: alpha('#00ff88', 0.1),
                                color: '#00ff88',
                                border: '1px solid',
                                borderColor: alpha('#00ff88', 0.3),
                                fontWeight: 600
                              }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', gap: 3 }}>
                            <Box>
                              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                Consensus
                              </Typography>
                              <Typography variant="body1" sx={{ color: '#00d9ff', fontWeight: 600 }}>
                                85%
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                Leverage
                              </Typography>
                              <Typography variant="body1" sx={{ color: '#e4e7ec', fontWeight: 600 }}>
                                4x
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CustomAnalysisPage;