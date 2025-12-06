// ============================================================================
// FILE: src/pages/admin/LLMProvidersPage.tsx
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Switch,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Tooltip,
  Stack,
  MenuItem,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Key as KeyIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { llmProvidersService } from '../../api/services/LLMProvidersService';
import { llmKeysService } from '../../api/services/LLMKeysService';
import {
  LLMProviderResponse,
  LLMProviderCreate,
  LLMAPIKeyCreate,
  ProviderType,
} from '../../types/llmProvider.types';

const LLMProvidersPage: React.FC = () => {
  const [providers, setProviders] = useState<LLMProviderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [openKeysDialog, setOpenKeysDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<LLMProviderResponse | null>(null);
  
  const [formData, setFormData] = useState<Partial<LLMProviderCreate>>({
    name: '',
    display_name: '',
    provider_type: 'openai_compatible',
    default_model: '',
    max_tokens: 3000,
    temperature: 0.2,
    requests_per_minute: 60,
    tokens_per_minute: 100000,
    api_keys: [{ api_key: '', key_name: 'Primary Key', is_primary: true }],
  });

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    setLoading(true);
    setError(null);

    const result = await llmProvidersService.listProviders(true);

    if (result.success && result.data) {
      setProviders(result.data);
    } else {
      setError(result.error?.message || 'Failed to load providers');
    }

    setLoading(false);
  };

  const handleCreateProvider = async () => {
    if (!formData.name || !formData.display_name || !formData.default_model) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await llmProvidersService.createProvider(
      formData as LLMProviderCreate
    );

    if (result.success) {
      setSuccess('Provider created successfully');
      setOpenDialog(false);
      resetForm();
      loadProviders();
    } else {
      setError(result.error?.message || 'Failed to create provider');
    }

    setLoading(false);
  };

  const handleToggleStatus = async (providerId: string, isActive: boolean) => {
    const result = await llmProvidersService.toggleProviderStatus(
      providerId,
      !isActive
    );

    if (result.success) {
      setSuccess(`Provider ${!isActive ? 'enabled' : 'disabled'}`);
      loadProviders();
    } else {
      setError(result.error?.message || 'Failed to update provider');
    }
  };

  const handleDeleteProvider = async (providerId: string) => {
    if (!window.confirm('Are you sure you want to delete this provider?')) {
      return;
    }

    const result = await llmProvidersService.deleteProvider(providerId);

    if (result.success) {
      setSuccess('Provider deleted successfully');
      loadProviders();
    } else {
      setError(result.error?.message || 'Failed to delete provider');
    }
  };

  const handleManageKeys = (provider: LLMProviderResponse) => {
    setSelectedProvider(provider);
    setOpenKeysDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      display_name: '',
      provider_type: 'openai_compatible',
      default_model: '',
      max_tokens: 3000,
      temperature: 0.2,
      requests_per_minute: 60,
      tokens_per_minute: 100000,
      api_keys: [{ api_key: '', key_name: 'Primary Key', is_primary: true }],
    });
  };

  const addApiKeyField = () => {
    setFormData({
      ...formData,
      api_keys: [
        ...(formData.api_keys || []),
        { api_key: '', key_name: `Key ${(formData.api_keys?.length || 0) + 1}`, is_primary: false },
      ],
    });
  };

  const removeApiKeyField = (index: number) => {
    const newKeys = [...(formData.api_keys || [])];
    newKeys.splice(index, 1);
    setFormData({ ...formData, api_keys: newKeys });
  };

  const updateApiKeyField = (index: number, field: keyof LLMAPIKeyCreate, value: any) => {
    const newKeys = [...(formData.api_keys || [])];
    newKeys[index] = { ...newKeys[index], [field]: value };
    setFormData({ ...formData, api_keys: newKeys });
  };

  if (loading && providers.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        bgcolor: '#0a0e1a'
      }}>
        <CircularProgress sx={{ color: '#00d9ff' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#0a0e1a', minHeight: '100vh' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#00d9ff', mb: 1 }}>
            LLM Providers
          </Typography>
          <Typography variant="body2" sx={{ color: '#8b92a7' }}>
            Manage your AI model providers and API keys
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadProviders}
            sx={{
              borderColor: '#1e2837',
              color: '#00d9ff',
              '&:hover': {
                borderColor: '#00d9ff',
                bgcolor: alpha('#00d9ff', 0.05)
              }
            }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              bgcolor: '#00d9ff',
              color: '#0a0e1a',
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#00b8d9'
              }
            }}
          >
            Add Provider
          </Button>
        </Stack>
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

      {success && (
        <Alert 
          severity="success" 
          onClose={() => setSuccess(null)} 
          sx={{ 
            mb: 3,
            bgcolor: alpha('#00d9ff', 0.1),
            border: '1px solid',
            borderColor: alpha('#00d9ff', 0.3),
            color: '#00d9ff',
            '& .MuiAlert-icon': { color: '#00d9ff' }
          }}
        >
          {success}
        </Alert>
      )}

      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: 3 
      }}>
        {providers.map((provider) => (
          <Box 
            key={provider.id}
            sx={{ 
              width: { xs: '100%', sm: 'calc(50% - 12px)', lg: 'calc(33.33% - 16px)' },
              minWidth: { xs: '100%', sm: '300px' }
            }}
          >
            <Card 
              elevation={0}
              sx={{ 
                height: '100%',
                bgcolor: '#151b2b',
                border: '1px solid',
                borderColor: '#1e2837',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: '#00d9ff',
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 24px ${alpha('#00d9ff', 0.2)}`
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ color: '#e4e7ec', mb: 1, fontWeight: 600 }}>
                      {provider.display_name}
                    </Typography>
                    <Chip
                      label={provider.name}
                      size="small"
                      sx={{ 
                        bgcolor: alpha('#00d9ff', 0.1),
                        color: '#00d9ff',
                        border: '1px solid',
                        borderColor: alpha('#00d9ff', 0.2),
                        fontSize: '0.75rem'
                      }}
                    />
                  </Box>
                  <Switch
                    checked={provider.is_active}
                    onChange={() => handleToggleStatus(provider.id, provider.is_active)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#00d9ff',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#00d9ff',
                      }
                    }}
                  />
                </Box>

                <Stack spacing={2} mb={3}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 0.5 }}>
                      MODEL
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#e4e7ec' }}>
                      {provider.default_model}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 0.5 }}>
                        TYPE
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#8b92a7' }}>
                        {provider.provider_type}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 0.5 }}>
                        API KEYS
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#00d9ff', fontWeight: 600 }}>
                        {provider.api_keys_count}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 0.5 }}>
                        PRIORITY
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#8b92a7' }}>
                        {provider.priority}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Tooltip title="Manage API Keys">
                    <IconButton
                      size="small"
                      onClick={() => handleManageKeys(provider)}
                      sx={{ 
                        color: '#00d9ff',
                        bgcolor: alpha('#00d9ff', 0.1),
                        '&:hover': {
                          bgcolor: alpha('#00d9ff', 0.2)
                        }
                      }}
                    >
                      <KeyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Settings">
                    <IconButton 
                      size="small"
                      sx={{ 
                        color: '#8b92a7',
                        bgcolor: alpha('#8b92a7', 0.1),
                        '&:hover': {
                          bgcolor: alpha('#8b92a7', 0.2)
                        }
                      }}
                    >
                      <SettingsIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteProvider(provider.id)}
                      sx={{ 
                        color: '#ff4444',
                        bgcolor: alpha('#ff4444', 0.1),
                        '&:hover': {
                          bgcolor: alpha('#ff4444', 0.2)
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>

                {provider.last_used_at && (
                  <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
                    Last used: {new Date(provider.last_used_at).toLocaleString()}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Create Provider Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#151b2b',
            border: '1px solid #1e2837'
          }
        }}
      >
        <DialogTitle sx={{ color: '#00d9ff', borderBottom: '1px solid #1e2837' }}>
          Add LLM Provider
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <TextField
              label="Provider Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              helperText="Unique identifier (e.g., 'openai', 'anthropic')"
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

            <TextField
              label="Display Name"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              required
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

            <TextField
              select
              label="Provider Type"
              value={formData.provider_type}
              onChange={(e) => setFormData({ ...formData, provider_type: e.target.value as ProviderType })}
              required
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
            >
              <MenuItem value="openai_compatible">OpenAI Compatible</MenuItem>
              <MenuItem value="anthropic">Anthropic</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </TextField>

            <TextField
              label="Base URL"
              value={formData.base_url || ''}
              onChange={(e) => setFormData({ ...formData, base_url: e.target.value })}
              helperText="Optional for OpenAI-compatible APIs"
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

            <TextField
              label="Default Model"
              value={formData.default_model}
              onChange={(e) => setFormData({ ...formData, default_model: e.target.value })}
              required
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

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Max Tokens"
                type="number"
                value={formData.max_tokens}
                onChange={(e) => setFormData({ ...formData, max_tokens: parseInt(e.target.value) })}
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
              <TextField
                label="Temperature"
                type="number"
                inputProps={{ step: 0.1, min: 0, max: 2 }}
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
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
            </Box>

            <Typography variant="subtitle1" sx={{ color: '#00d9ff', fontWeight: 600, mt: 2 }}>
              API Keys
            </Typography>

            {formData.api_keys?.map((key, index) => (
              <Card 
                key={index} 
                sx={{ 
                  bgcolor: '#0a0e1a',
                  border: '1px solid #1e2837'
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <TextField
                      label="Key Name"
                      value={key.key_name}
                      onChange={(e) => updateApiKeyField(index, 'key_name', e.target.value)}
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
                    <TextField
                      label="API Key"
                      type="password"
                      value={key.api_key}
                      onChange={(e) => updateApiKeyField(index, 'api_key', e.target.value)}
                      fullWidth
                      required
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#8b92a7', mr: 1 }}>
                          Primary Key
                        </Typography>
                        <Switch
                          checked={key.is_primary}
                          onChange={(e) => updateApiKeyField(index, 'is_primary', e.target.checked)}
                          size="small"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#00d9ff',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#00d9ff',
                            }
                          }}
                        />
                      </Box>
                      {formData.api_keys && formData.api_keys.length > 1 && (
                        <Button
                          size="small"
                          onClick={() => removeApiKeyField(index)}
                          sx={{ color: '#ff4444' }}
                        >
                          Remove
                        </Button>
                      )}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addApiKeyField}
              sx={{
                borderColor: '#1e2837',
                color: '#00d9ff',
                '&:hover': {
                  borderColor: '#00d9ff',
                  bgcolor: alpha('#00d9ff', 0.05)
                }
              }}
            >
              Add Another Key
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #1e2837', p: 2 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            sx={{ color: '#8b92a7' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateProvider}
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: '#00d9ff',
              color: '#0a0e1a',
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#00b8d9'
              }
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#0a0e1a' }} /> : 'Create Provider'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LLMProvidersPage;