// src/pages/admin/Analytics.tsx
import React, { useEffect, useState } from 'react';
import { adminService } from '../../api/services/adminService';
import { PlatformAnalytics } from '../../types/admin.types';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity,
  RefreshCw,
  Calendar,
  Download,
  Target,
  Zap,
  ArrowUp,
  Eye
} from 'lucide-react';

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [timeframe]);

  const loadAnalytics = async (silent: boolean = false) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    
    try {
      const data = await adminService.getPlatformAnalytics(timeframe);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const StatCardSkeleton: React.FC = () => (
    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 animate-pulse">
      <div className="h-4 bg-gray-700 rounded w-20 mb-2"></div>
      <div className="h-8 bg-gray-700 rounded w-3/4"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded w-32 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-700 rounded-lg w-32 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-32 mb-4"></div>
            <div className="h-12 bg-gray-700 rounded-lg"></div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-32 mb-4"></div>
            <div className="h-12 bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <BarChart3 className="text-red-400" size={48} />
        <h3 className="text-xl font-semibold text-white">Failed to load analytics</h3>
        <p className="text-gray-400 text-center max-w-md">
          Unable to retrieve platform analytics. Please check your connection and try again.
        </p>
        <button
          onClick={() => loadAnalytics()}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  const formatNumber = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const statCards = [
    {
      title: 'New Users',
      value: formatNumber(analytics.user_growth.new_users),
      subtitle: 'User acquisition',
      trend: 12.5,
      icon: <Users className="text-cyan-400" size={20} />,
      gradient: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/20',
    },
    {
      title: 'New Subscriptions',
      value: formatNumber(analytics.user_growth.new_subscriptions),
      subtitle: 'Premium conversions',
      trend: 8.3,
      icon: <DollarSign className="text-purple-400" size={20} />,
      gradient: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/20',
    },
    {
      title: 'Total Trades',
      value: formatNumber(analytics.trading_volume.total_trades),
      subtitle: 'Trading activity',
      trend: 15.2,
      icon: <TrendingUp className="text-green-400" size={20} />,
      gradient: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/20',
    },
    {
      title: 'Trading Volume',
      value: formatCurrency(analytics.trading_volume.total_volume_usd),
      subtitle: 'Platform volume',
      trend: 22.7,
      icon: <Activity className="text-yellow-400" size={20} />,
      gradient: 'from-yellow-500/20 to-orange-500/20',
      border: 'border-yellow-500/20',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                Platform Analytics
              </h1>
              <p className="text-gray-400 text-sm">
                Comprehensive performance metrics and business intelligence
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadAnalytics(true)}
            disabled={refreshing}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
          </button>
          
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`relative bg-gray-900/50 backdrop-blur-xl border ${card.border} rounded-xl p-5 overflow-hidden group hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 hover:scale-[1.02]`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm font-medium">{card.title}</span>
                <div className="flex items-center gap-1">
                  <ArrowUp className="text-green-400" size={14} />
                  {card.icon}
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-white">{card.value}</h3>
                <p className="text-xs text-gray-400">{card.subtitle}</p>
                <div className="flex items-center gap-1 text-green-400 text-xs">
                  <ArrowUp size={12} />
                  <span>+{card.trend}% vs previous period</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Metrics */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
              <DollarSign size={20} />
              Revenue Metrics
            </h3>
            <TrendingUp className="text-gray-400" size={16} />
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-300 text-sm">Estimated Revenue</span>
                  <p className="text-green-400 font-bold text-2xl">
                    {formatCurrency(analytics.revenue_metrics.estimated_revenue)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 text-xs">MRR</span>
                  <div className="flex items-center gap-1 text-green-400">
                    <ArrowUp size={14} />
                    <span className="text-sm font-medium">+18.2%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="text-blue-400" size={16} />
                  <span className="text-gray-300 text-sm">Conversion Rate</span>
                </div>
                <p className="text-blue-400 font-bold text-xl">4.2%</p>
              </div>
              
              <div className="p-4 bg-gray-800/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="text-purple-400" size={16} />
                  <span className="text-gray-300 text-sm">Avg. Revenue</span>
                </div>
                <p className="text-purple-400 font-bold text-xl">$89.50</p>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
              <Activity size={20} />
              Engagement Metrics
            </h3>
            <Users className="text-gray-400" size={16} />
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-300 text-sm">Active Traders</span>
                  <p className="text-cyan-400 font-bold text-2xl">
                    {formatNumber(analytics.engagement_metrics.active_traders)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 text-xs">Engagement</span>
                  <div className="flex items-center gap-1 text-green-400">
                    <ArrowUp size={14} />
                    <span className="text-sm font-medium">+12.8%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="text-green-400" size={16} />
                  <span className="text-gray-300 text-sm">Retention Rate</span>
                </div>
                <p className="text-green-400 font-bold text-xl">78.3%</p>
              </div>
              
              <div className="p-4 bg-gray-800/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="text-yellow-400" size={16} />
                  <span className="text-gray-300 text-sm">Avg. Session</span>
                </div>
                <p className="text-yellow-400 font-bold text-xl">12.4m</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Health */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-green-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-green-400 mb-6">Platform Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-800/30 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-white font-medium">System Uptime</span>
            </div>
            <p className="text-green-400 font-bold text-2xl">99.98%</p>
            <p className="text-gray-400 text-xs">Last 30 days</p>
          </div>
          
          <div className="p-4 bg-gray-800/30 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-white font-medium">API Performance</span>
            </div>
            <p className="text-blue-400 font-bold text-2xl">142ms</p>
            <p className="text-gray-400 text-xs">Average response</p>
          </div>
          
          <div className="p-4 bg-gray-800/30 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <span className="text-white font-medium">Error Rate</span>
            </div>
            <p className="text-purple-400 font-bold text-2xl">0.12%</p>
            <p className="text-gray-400 text-xs">Successful requests</p>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-yellow-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-yellow-400 mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-800/30 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-green-400" size={20} />
              <span className="text-white font-medium">Top Performing</span>
            </div>
            <p className="text-gray-400 text-sm">User acquisition increased by 28% month-over-month</p>
          </div>
          
          <div className="p-4 bg-gray-800/30 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Target className="text-cyan-400" size={20} />
              <span className="text-white font-medium">Areas for Improvement</span>
            </div>
            <p className="text-gray-400 text-sm">Subscription conversion rate below target by 2.1%</p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Analytics ;