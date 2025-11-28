// src/pages/admin/Portfolios.tsx
import React, { useEffect, useState } from 'react';
import { adminService } from '../../api/services/adminService';
import { PortfolioOverview } from '../../types/admin.types';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Activity,
  RefreshCw,
  BarChart3,
  ArrowUp,
  ArrowDown,
  PieChart
} from 'lucide-react';

const Portfolios: React.FC = () => {
  const [overview, setOverview] = useState<PortfolioOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPortfolioOverview();
  }, []);

  const loadPortfolioOverview = async (silent: boolean = false) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    
    try {
      const data = await adminService.getPortfolioOverview();
      setOverview(data);
    } catch (error) {
      console.error('Failed to load portfolio overview:', error);
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
          <div className="h-10 bg-gray-700 rounded-lg w-10 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))}
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-32 mb-4"></div>
          <div className="h-12 bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <PieChart className="text-red-400" size={48} />
        <h3 className="text-xl font-semibold text-white">Failed to load portfolio data</h3>
        <p className="text-gray-400 text-center max-w-md">
          Unable to retrieve portfolio analytics. Please check your connection and try again.
        </p>
        <button
          onClick={() => loadPortfolioOverview()}
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

  const statCards = [
    {
      title: 'Total Portfolios',
      value: overview.total_portfolios.toLocaleString(),
      subtitle: 'Active users',
      trend: overview.total_portfolios,
      icon: <Users className="text-cyan-400" size={20} />,
      gradient: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/20',
    },
    {
      title: 'Total Balance',
      value: formatCurrency(overview.total_balance_usd),
      subtitle: 'Platform assets',
      trend: overview.total_balance_usd,
      icon: <DollarSign className="text-green-400" size={20} />,
      gradient: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/20',
    },
    {
      title: 'Total P&L',
      value: formatCurrency(overview.total_unrealized_pnl_usd),
      subtitle: 'Unrealized gains/losses',
      trend: overview.total_unrealized_pnl_usd,
      icon: <TrendingUp className={
        overview.total_unrealized_pnl_usd >= 0 ? 'text-green-400' : 'text-red-400'
      } size={20} />,
      gradient: overview.total_unrealized_pnl_usd >= 0 
        ? 'from-green-500/20 to-emerald-500/20' 
        : 'from-red-500/20 to-pink-500/20',
      border: overview.total_unrealized_pnl_usd >= 0 
        ? 'border-green-500/20' 
        : 'border-red-500/20',
    },
    {
      title: 'Open Positions',
      value: overview.total_open_positions.toLocaleString(),
      subtitle: 'Active trades',
      trend: overview.total_open_positions,
      icon: <Activity className="text-purple-400" size={20} />,
      gradient: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/20',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
              <PieChart className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Portfolio Analytics
              </h1>
              <p className="text-gray-400 text-sm">
                Platform-wide portfolio metrics and performance
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => loadPortfolioOverview(true)}
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
                  {card.trend > 0 ? <ArrowUp className="text-green-400" size={14} /> : <ArrowDown className="text-red-400" size={14} />}
                  {card.icon}
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className={`text-2xl font-bold ${
                  card.title === 'Total P&L' 
                    ? (overview.total_unrealized_pnl_usd >= 0 ? 'text-green-400' : 'text-red-400')
                    : 'text-white'
                }`}>
                  {card.value}
                </h3>
                <p className="text-xs text-gray-400">{card.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Average Metrics */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
              <BarChart3 size={20} />
              Average Metrics
            </h3>
            <TrendingUp className="text-gray-400" size={16} />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
              <div>
                <span className="text-gray-300 text-sm">Avg Portfolio Balance</span>
                <p className="text-white font-bold text-lg">
                  {formatCurrency(overview.avg_portfolio_balance_usd)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-xs">Per User</span>
                <div className="text-cyan-400 text-sm font-medium">Average</div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-800/20 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">Portfolio Health</span>
                <span className={`text-sm font-medium ${
                  overview.total_unrealized_pnl_usd >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {overview.total_unrealized_pnl_usd >= 0 ? 'Profitable' : 'Underwater'}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                    overview.total_unrealized_pnl_usd >= 0 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : 'bg-gradient-to-r from-red-500 to-pink-500'
                  }`}
                  style={{ 
                    width: `${Math.min(Math.abs(overview.total_unrealized_pnl_usd) / overview.total_balance_usd * 100, 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Distribution */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
              <PieChart size={20} />
              Top Assets
            </h3>
            <Activity className="text-gray-400" size={16} />
          </div>
          <div className="space-y-3">
            {overview.most_held_assets.slice(0, 5).map((asset, index) => (
              <div 
                key={asset.symbol}
                className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                    index === 1 ? 'bg-gray-500/20 text-gray-400' :
                    index === 2 ? 'bg-orange-500/20 text-orange-400' :
                    'bg-cyan-500/20 text-cyan-400'
                  }`}>
                    <span className="text-xs font-bold">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium group-hover:text-purple-400 transition-colors">
                      {asset.symbol}
                    </p>
                    <p className="text-gray-400 text-xs">{asset.count} holders</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 text-sm font-medium">
                    {((asset.count / overview.total_portfolios) * 100).toFixed(1)}%
                  </div>
                  <div className="text-gray-400 text-xs">Penetration</div>
                </div>
              </div>
            ))}
            
            {overview.most_held_assets.length === 0 && (
              <div className="text-center py-4">
                <PieChart className="mx-auto text-gray-400 mb-2" size={32} />
                <p className="text-gray-400">No asset data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Platform Performance */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-green-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-green-400 mb-4">Platform Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-800/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Users className="text-cyan-400" size={20} />
              <div>
                <p className="text-gray-400 text-sm">Active Traders</p>
                <p className="text-white font-bold text-xl">{overview.total_portfolios}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-800/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Activity className="text-green-400" size={20} />
              <div>
                <p className="text-gray-400 text-sm">Total Exposure</p>
                <p className="text-white font-bold text-xl">{formatCurrency(overview.total_balance_usd)}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-800/30 rounded-lg">
            <div className="flex items-center gap-3">
              <TrendingUp className={
                overview.total_unrealized_pnl_usd >= 0 ? 'text-green-400' : 'text-red-400'
              } size={20} />
              <div>
                <p className="text-gray-400 text-sm">Platform P&L</p>
                <p className={`font-bold text-xl ${
                  overview.total_unrealized_pnl_usd >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {formatCurrency(overview.total_unrealized_pnl_usd)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolios;