// src/pages/admin/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { adminService } from '../../api/services/adminService';
import { AdminDashboardStats, SystemHealthResponse } from '../../types/admin.types';
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  Megaphone,
  Gift,
  UserCheck,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Calendar,
  BarChart3,
  Shield,
  Cpu
} from 'lucide-react';

// Skeleton loader component
const StatCardSkeleton: React.FC = () => (
  <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-4 bg-gray-700 rounded w-24"></div>
      <div className="h-6 w-6 bg-gray-700 rounded"></div>
    </div>
    <div className="space-y-2">
      <div className="h-8 bg-gray-700 rounded w-3/4"></div>
      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [health, setHealth] = useState<SystemHealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    loadDashboard();
    
    // Set up auto-refresh every 2 minutes
    const interval = setInterval(() => {
      loadDashboard(true);
    }, 120000);
    
    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async (silent: boolean = false) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    
    try {
      const [dashStats, healthData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getSystemHealth(),
      ]);
      setStats(dashStats);
      setHealth(healthData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

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

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'degraded': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'unhealthy': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getTrendIcon = (value: number) => {
    return value >= 0 ? 
      <ArrowUp className="text-green-400" size={16} /> : 
      <ArrowDown className="text-red-400" size={16} />;
  };

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
          {Array.from({ length: 8 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-32 mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-32 mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <AlertCircle className="text-red-400" size={48} />
        <h3 className="text-xl font-semibold text-white">Failed to load dashboard</h3>
        <p className="text-gray-400 text-center max-w-md">
          Unable to retrieve dashboard data. Please check your connection and try again.
        </p>
        <button
          onClick={() => loadDashboard()}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: formatNumber(stats.total_users),
      subtitle: `${stats.new_users_24h} new today`,
      trend: stats.new_users_24h,
      icon: <Users className="text-cyan-400" size={20} />,
      gradient: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/20',
    },
    {
      title: 'Active Subscriptions',
      value: formatNumber(stats.subscribed_users),
      subtitle: `${stats.subscription_rate.toFixed(1)}% conversion rate`,
      trend: stats.subscription_rate,
      icon: <Activity className="text-green-400" size={20} />,
      gradient: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/20',
    },
    {
      title: 'Total Trades',
      value: formatNumber(stats.total_trades),
      subtitle: `${stats.open_trades} open positions`,
      trend: stats.closed_trades_24h,
      icon: <TrendingUp className="text-purple-400" size={20} />,
      gradient: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/20',
    },
    {
      title: 'Total P&L',
      value: formatCurrency(stats.total_pnl_usd),
      subtitle: `${formatCurrency(stats.pnl_24h_usd)} today`,
      trend: stats.pnl_24h_usd,
      icon: <DollarSign className="text-yellow-400" size={20} />,
      gradient: 'from-yellow-500/20 to-orange-500/20',
      border: 'border-yellow-500/20',
    },
    {
      title: 'Signals Generated',
      value: formatNumber(stats.total_signals),
      subtitle: `${stats.signals_24h} today`,
      trend: stats.signals_24h,
      icon: <Megaphone className="text-blue-400" size={20} />,
      gradient: 'from-blue-500/20 to-indigo-500/20',
      border: 'border-blue-500/20',
    },
    {
      title: 'Referrals',
      value: formatNumber(stats.total_referrals),
      subtitle: `${stats.referral_conversion_rate.toFixed(1)}% conversion`,
      trend: stats.referral_conversion_rate,
      icon: <Gift className="text-pink-400" size={20} />,
      gradient: 'from-pink-500/20 to-rose-500/20',
      border: 'border-pink-500/20',
    },
    {
      title: 'Active Affiliates',
      value: formatNumber(stats.active_affiliates),
      subtitle: `${stats.pending_affiliate_applications} pending`,
      trend: stats.active_affiliates,
      icon: <UserCheck className="text-indigo-400" size={20} />,
      gradient: 'from-indigo-500/20 to-purple-500/20',
      border: 'border-indigo-500/20',
    },
    {
      title: 'Monthly Revenue',
      value: formatCurrency(stats.estimated_revenue_30d),
      subtitle: '30-day estimate',
      trend: stats.estimated_revenue_30d,
      icon: <DollarSign className="text-emerald-400" size={20} />,
      gradient: 'from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-500/20',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 text-sm">
                Real-time platform overview and analytics
                {lastUpdated && (
                  <span className="text-gray-500">
                    {' '}• Updated {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* System Health Indicator */}
          {health && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border backdrop-blur-sm ${getHealthStatusColor(health.status)}`}>
              {health.status === 'healthy' ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span className="text-sm font-medium capitalize">{health.status}</span>
            </div>
          )}
          
          <button
            onClick={() => loadDashboard()}
            disabled={refreshing}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            title="Refresh data"
          >
            <RefreshCw 
              size={16} 
              className={`text-gray-300 group-hover:text-white transition-colors ${refreshing ? 'animate-spin' : ''}`} 
            />
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
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm font-medium">{card.title}</span>
                <div className="flex items-center gap-1">
                  {getTrendIcon(card.trend)}
                  {card.icon}
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-white">{card.value}</h3>
                <p className="text-xs text-gray-400">{card.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
              <Users size={20} />
              User Growth Analytics
            </h3>
            <Calendar className="text-gray-400" size={16} />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
              <div>
                <span className="text-gray-300 text-sm">New Users (24h)</span>
                <p className="text-white font-bold text-lg">{stats.new_users_24h}</p>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-xs">Daily</span>
                <div className="flex items-center gap-1 text-green-400">
                  <ArrowUp size={14} />
                  <span className="text-sm font-medium">+{stats.new_users_24h}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
              <div>
                <span className="text-gray-300 text-sm">New Users (7d)</span>
                <p className="text-white font-bold text-lg">{stats.new_users_7d}</p>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-xs">Weekly</span>
                <div className="flex items-center gap-1 text-blue-400">
                  <TrendingUp size={14} />
                  <span className="text-sm font-medium">Trending</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
              <div>
                <span className="text-gray-300 text-sm">Active Users</span>
                <p className="text-green-400 font-bold text-lg">{formatNumber(stats.active_users)}</p>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-xs">Current</span>
                <div className="text-green-400 text-sm font-medium">Online</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trading Activity */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
              <TrendingUp size={20} />
              Trading Activity
            </h3>
            <Activity className="text-gray-400" size={16} />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
              <div>
                <span className="text-gray-300 text-sm">Open Trades</span>
                <p className="text-purple-400 font-bold text-lg">{stats.open_trades}</p>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-xs">Live</span>
                <div className="text-purple-400 text-sm font-medium">Active</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
              <div>
                <span className="text-gray-300 text-sm">Closed (24h)</span>
                <p className="text-white font-bold text-lg">{stats.closed_trades_24h}</p>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-xs">Today</span>
                <div className="flex items-center gap-1 text-blue-400">
                  <BarChart3 size={14} />
                  <span className="text-sm font-medium">Volume</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
              <div>
                <span className="text-gray-300 text-sm">P&L (24h)</span>
                <p className={`font-bold text-lg ${stats.pnl_24h_usd >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(stats.pnl_24h_usd)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-xs">Daily</span>
                <div className={`flex items-center gap-1 ${stats.pnl_24h_usd >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.pnl_24h_usd >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  <span className="text-sm font-medium">
                    {stats.pnl_24h_usd >= 0 ? 'Profit' : 'Loss'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Affiliate & Referral Performance */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-indigo-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-indigo-400 flex items-center gap-2">
            <Shield size={20} />
            Affiliate & Referral Performance
          </h3>
          <Gift className="text-gray-400" size={16} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200 group">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <DollarSign className="text-green-400" size={16} />
              </div>
              <span className="text-gray-400 text-sm">Total Commissions</span>
            </div>
            <p className="text-2xl font-bold text-green-400">{formatCurrency(stats.total_commissions_paid)}</p>
            <p className="text-gray-500 text-xs mt-1">All time paid</p>
          </div>
          
          <div className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200 group">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Activity className="text-yellow-400" size={16} />
              </div>
              <span className="text-gray-400 text-sm">Pending Commissions</span>
            </div>
            <p className="text-2xl font-bold text-yellow-400">{formatCurrency(stats.pending_commissions)}</p>
            <p className="text-gray-500 text-xs mt-1">Awaiting approval</p>
          </div>
          
          <div className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200 group">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <UserCheck className="text-blue-400" size={16} />
              </div>
              <span className="text-gray-400 text-sm">Completed Referrals</span>
            </div>
            <p className="text-2xl font-bold text-blue-400">{stats.completed_referrals}</p>
            <p className="text-gray-500 text-xs mt-1">Successful conversions</p>
          </div>
        </div>
        
        {/* Performance metrics row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-4 bg-gray-800/20 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Referral Conversion Rate</span>
              <span className="text-green-400 text-sm font-medium">
                {stats.referral_conversion_rate.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(stats.referral_conversion_rate, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-800/20 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Subscription Rate</span>
              <span className="text-cyan-400 text-sm font-medium">
                {stats.subscription_rate.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-cyan-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(stats.subscription_rate, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4 border-t border-gray-700/50">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Cpu size={14} />
          <span>System monitoring active • Auto-refresh every 2 minutes</span>
        </div>
        <button
          onClick={() => loadDashboard()}
          disabled={refreshing}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;