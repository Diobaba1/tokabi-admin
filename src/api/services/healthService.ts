// src/api/services/healthService.ts
import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../endpoints';

export interface BackendHealthResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  services: {
    [key: string]: 'healthy' | 'unhealthy' | 'warning';
  };
  database_error?: string;
  binance_error?: string;
  signal_generation_error?: string;
  trading_error?: string;
}

export interface ServiceStatus {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded' | 'warning';
  lastChecked: string;
  endpoint: string;
  error?: string;
  metrics?: {
    recent_signals_1h?: number;
    open_trades?: number;
    [key: string]: any;
  };
}

export interface HealthOverview {
  overall_status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  services: ServiceStatus[];
}

class HealthService {
  // Get system health status
  async getSystemHealth(): Promise<BackendHealthResponse> {
    try {
      const response = await axiosInstance.get<BackendHealthResponse>(
        API_ENDPOINTS.HEALTH  // Using the correct endpoint
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch system health:', error);
      throw error;
    }
  }

  // Get comprehensive health overview
  async getHealthOverview(): Promise<HealthOverview> {
    try {
      const health = await this.getSystemHealth();
      
      const services: ServiceStatus[] = Object.entries(health.services || {}).map(
        ([name, status]) => {
          const serviceStatus: ServiceStatus = {
            name: this.formatServiceName(name),
            status,
            lastChecked: health.timestamp,
            endpoint: this.getServiceEndpoint(name),
          };

          // Add specific errors
          if (name === 'database' && health.database_error) {
            serviceStatus.error = health.database_error;
          } else if (name === 'binance' && health.binance_error) {
            serviceStatus.error = health.binance_error;
          } else if (name === 'signal_generation' && health.signal_generation_error) {
            serviceStatus.error = health.signal_generation_error;
          } else if (name === 'trading' && health.trading_error) {
            serviceStatus.error = health.trading_error;
          }

          // Add metrics if available (from backend response components)
          const metrics = this.getServiceMetrics(name);
          if (metrics) {
            serviceStatus.metrics = metrics;
          }

          return serviceStatus;
        }
      );

      return {
        overall_status: health.status,
        timestamp: health.timestamp,
        services,
      };
    } catch (error) {
      console.error('Failed to get health overview:', error);
      throw error;
    }
  }

  // Get health history (if backend supports it)
  async getHealthHistory(hours: number = 24): Promise<any[]> {
    try {
      // This endpoint would need to be implemented on backend
      // For now, return mock data or empty array
      return [];
    } catch (error) {
      console.error('Failed to fetch health history:', error);
      return [];
    }
  }

  // Force health check refresh
  async refreshHealthCheck(): Promise<BackendHealthResponse> {
    try {
      const response = await axiosInstance.post<BackendHealthResponse>(
        '/health/refresh'  // You might need to implement this endpoint
      );
      return response.data;
    } catch (error) {
      console.error('Failed to refresh health check:', error);
      throw error;
    }
  }

  // Private helper methods
  private formatServiceName(name: string): string {
    const nameMap: Record<string, string> = {
      database: 'Database',
      binance: 'Binance API',
      signal_generation: 'Signal Generation',
      trading: 'Trading Engine',
      redis: 'Redis Cache',
      rabbitmq: 'Message Queue',
      email: 'Email Service',
      s3: 'File Storage',
    };
    return nameMap[name] || name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' ');
  }

  private getServiceEndpoint(name: string): string {
    const endpointMap: Record<string, string> = {
      database: 'PostgreSQL:5432',
      binance: 'fapi.binance.com:443',
      signal_generation: 'Internal Service',
      trading: 'Trading Engine',
    };
    return endpointMap[name] || 'Internal Service';
  }

  private getServiceMetrics(name: string): any {
    const metricsMap: Record<string, any> = {
      signal_generation: {
        recent_signals_1h: 0,
      },
      trading: {
        open_trades: 0,
      },
    };
    return metricsMap[name];
  }
}

export default new HealthService();