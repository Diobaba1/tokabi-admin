// src/pages/admin/HealthPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  AccessTime as AccessTimeIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  Computer as ComputerIcon,
  Link as LinkIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import healthService, { HealthOverview, ServiceStatus } from '../../api/services/healthService';
import { formatDistance } from 'date-fns/formatDistance';
import { format } from 'date-fns';

const HealthPage: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);

  const fetchHealthData = async () => {
    try {
      setError(null);
      const data = await healthService.getHealthOverview();
      setHealthData(data);
    } catch (err: any) {
      // If backend returns 503 with health data, use it
      if (err.response?.status === 503 && err.response?.data) {
        // Transform error response into health data
        const errorData = err.response.data;
        const services: ServiceStatus[] = Object.entries(errorData.services || {}).map(
          ([name, status]: [string, any]) => ({
            name: formatServiceName(name),
            status,
            lastChecked: errorData.timestamp,
            endpoint: getServiceEndpoint(name),
            error: getServiceError(name, errorData),
          })
        );

        setHealthData({
          overall_status: errorData.status,
          timestamp: errorData.timestamp,
          services,
        });
      } else {
        setError('Failed to load health data. Please try again.');
        console.error(err);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHealthData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchHealthData();
  };

  const handleViewHistory = () => {
    setShowHistoryDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#4caf50';
      case 'degraded': return '#ff9800';
      case 'unhealthy': return '#f44336';
      case 'warning': return '#ff9800';
      default: return '#757575';
    }
  };

  const getStatusIcon = (status: string): React.ReactElement | undefined => {
    switch (status) {
      case 'healthy': return <CheckCircleIcon sx={{ color: '#4caf50' }} />;
      case 'degraded': return <WarningIcon sx={{ color: '#ff9800' }} />;
      case 'unhealthy': return <ErrorIcon sx={{ color: '#f44336' }} />;
      case 'warning': return <WarningIcon sx={{ color: '#ff9800' }} />;
      default: return undefined;
    }
  };

  const formatServiceName = (name: string): string => {
    const nameMap: Record<string, string> = {
      database: 'Database',
      binance: 'Binance API',
      signal_generation: 'Signal Generation',
      trading: 'Trading Engine',
    };
    return nameMap[name] || name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' ');
  };

  const getServiceEndpoint = (name: string): string => {
    const endpointMap: Record<string, string> = {
      database: 'PostgreSQL:5432',
      binance: 'fapi.binance.com:443',
      signal_generation: 'Internal Service',
      trading: 'Trading Engine',
    };
    return endpointMap[name] || 'Internal Service';
  };

  const getServiceError = (name: string, healthData: any): string | undefined => {
    switch (name) {
      case 'database': return healthData.database_error;
      case 'binance': return healthData.binance_error;
      case 'signal_generation': return healthData.signal_generation_error;
      case 'trading': return healthData.trading_error;
      default: return undefined;
    }
  };

  const renderServiceMetrics = (service: ServiceStatus) => {
    if (!service.metrics) return null;

    return (
      <Box sx={{ mt: 2 }}>
        {service.metrics.recent_signals_1h !== undefined && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#b0bec5' }}>
              Recent Signals (1h):
            </Typography>
            <Typography variant="body1" sx={{ color: 'white' }}>
              {service.metrics.recent_signals_1h}
            </Typography>
          </Box>
        )}
        {service.metrics.open_trades !== undefined && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#b0bec5' }}>
              Open Trades:
            </Typography>
            <Typography variant="body1" sx={{ color: 'white' }}>
              {service.metrics.open_trades}
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#0a1929', minHeight: '100vh', p: 3 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', md: 'center' },
        mb: 4,
        gap: 2 
      }}>
        <Box>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
            System Health Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#b0bec5', mt: 1 }}>
            Real-time monitoring of platform services and infrastructure
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={refreshing}
            sx={{
              bgcolor: '#1976d2',
              '&:hover': { bgcolor: '#1565c0' },
            }}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </Box>
      </Box>

      {/* Error Alert - Only for non-health related errors */}
      {error && error !== 'Failed to load health data. Please try again.' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Overall Status Card */}
      <Card sx={{ bgcolor: '#132f4c', mb: 4, border: '1px solid #1e4976' }}>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            alignItems: 'center' 
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              flex: 1,
              minWidth: { xs: '100%', md: '33%' }
            }}>
              {getStatusIcon(healthData?.overall_status || 'unhealthy')}
              <Box sx={{ ml: 2 }}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Overall Status
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color: getStatusColor(healthData?.overall_status || 'unhealthy'),
                    fontWeight: 700,
                  }}
                >
                  {healthData?.overall_status?.toUpperCase() || 'UNKNOWN'}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              flex: 1,
              minWidth: { xs: '100%', md: '33%' }
            }}>
              <AccessTimeIcon sx={{ color: '#90caf9', mr: 1 }} />
              <Box>
                <Typography variant="body2" sx={{ color: '#b0bec5' }}>
                  Last Checked
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  {healthData?.timestamp
                    ? formatDistance(new Date(healthData.timestamp), new Date(), { addSuffix: true })
                    : 'N/A'}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              flex: 1,
              minWidth: { xs: '100%', md: '33%' }
            }}>
              <TimelineIcon sx={{ color: '#90caf9', mr: 1 }} />
              <Box>
                <Typography variant="body2" sx={{ color: '#b0bec5' }}>
                  Services Status
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  {healthData?.services?.filter(s => s.status === 'healthy').length || 0} / {healthData?.services?.length || 0} Healthy
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Services Status */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
          Service Status
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: 3 
        }}>
          {healthData?.services?.map((service, index) => (
            <Box 
              key={index}
              sx={{ 
                width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)' },
                minWidth: { xs: '100%', sm: '300px' }
              }}
            >
              <Card sx={{ 
                bgcolor: '#132f4c', 
                height: '100%',
                border: `1px solid ${getStatusColor(service.status)}20`,
                '&:hover': {
                  borderColor: getStatusColor(service.status),
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s',
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: 'white' }}>
                      {service.name}
                    </Typography>
                    <Chip
                      icon={getStatusIcon(service.status)}
                      label={service.status.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: `${getStatusColor(service.status)}20`,
                        color: getStatusColor(service.status),
                        border: `1px solid ${getStatusColor(service.status)}40`,
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#b0bec5', display: 'flex', alignItems: 'center' }}>
                      <LinkIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      Endpoint:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', ml: 2.5 }}>
                      {service.endpoint}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#b0bec5' }}>
                      Last Checked:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {formatDistance(new Date(service.lastChecked), new Date(), { addSuffix: true })}
                    </Typography>
                  </Box>

                  {/* Service Metrics */}
                  {renderServiceMetrics(service)}

                  {/* Service Error */}
                  {service.error && (
                    <Alert 
                      severity={service.status === 'warning' ? 'warning' : 'error'}
                      sx={{ 
                        mt: 2, 
                        bgcolor: service.status === 'warning' ? '#ff980020' : '#d32f2f20',
                        color: service.status === 'warning' ? '#ffb74d' : '#ff8a80',
                        '& .MuiAlert-icon': { 
                          color: service.status === 'warning' ? '#ffb74d' : '#ff8a80' 
                        }
                      }}
                    >
                      <Typography variant="caption">
                        {service.error.length > 150 
                          ? `${service.error.substring(0, 150)}...` 
                          : service.error}
                      </Typography>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Performance Metrics Placeholder - Remove or keep as mock */}
      <Card sx={{ bgcolor: '#132f4c', mb: 4, border: '1px solid #1e4976' }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
            System Information
          </Typography>
          <Typography variant="body2" sx={{ color: '#b0bec5' }}>
            Detailed performance metrics will be available when implemented in the backend.
          </Typography>
        </CardContent>
      </Card>

      {/* History Dialog - Simplified since we don't have history yet */}
      <Dialog 
        open={showHistoryDialog} 
        onClose={() => setShowHistoryDialog(false)}
        maxWidth="md"
      >
        <DialogTitle sx={{ bgcolor: '#0a1929', color: 'white' }}>
          Health Status History
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#0a1929' }}>
          <Typography variant="body1" sx={{ color: '#b0bec5', p: 3, textAlign: 'center' }}>
            Health history tracking will be implemented in a future update.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ color: '#90caf9' }}>
              Current Status:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {getStatusIcon(healthData?.overall_status || 'unhealthy')}
              <Typography variant="h6" sx={{ color: 'white', ml: 1 }}>
                {healthData?.overall_status?.toUpperCase() || 'UNKNOWN'}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#b0bec5', mt: 2 }}>
              Last Check: {healthData?.timestamp ? format(new Date(healthData.timestamp), 'PPpp') : 'N/A'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#0a1929' }}>
          <Button 
            onClick={() => setShowHistoryDialog(false)}
            sx={{ color: '#90caf9' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HealthPage;