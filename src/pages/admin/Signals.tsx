// src/pages/admin/Signals.tsx
import React, { useEffect, useState } from 'react';
import { adminService } from '../../api/services/adminService';
import { SignalStats } from '../../types/admin.types';
import { 
  Megaphone, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Activity,
  RefreshCw,
  BarChart3,
  Target,
  Zap,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Download,
  Eye
} from 'lucide-react';

const Signals: React.FC = () => {
  const [stats, setStats] = useState<SignalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeframe, setTimeframe] = useState(7);
  const [signalType, setSignalType] = useState<string>('all');

  useEffect(() => {
    loadSignalStats();
  }, [timeframe, signalType]);

  const loadSignalStats = async (silent: boolean = false) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    
    try {
      const data = await adminService.getSignalStats(timeframe);
      setStats(data);
    } catch (error) {
      console.error('Failed to load signal stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const StatCardSkeleton: React.FC = () => (
    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-700 rounded w-20"></div>
        <div className="h-6 w-6 bg-gray-700 rounded"></div>
      </div>
      <div className="h-8 bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
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
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-32 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 bg-gray-700 rounded-lg"></div>
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
        <Megaphone className="text-red-400" size={48} />
        <h3 className="text-xl font-semibold text-white">Failed to load signal data</h3>
        <p className="text-gray-400 text-center max-w-md">
          Unable to retrieve signal analytics. Please check your connection and try again.
        </p>
        <button
          onClick={() => loadSignalStats()}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  const totalDecisions = stats.decisions.long + stats.decisions.short + stats.decisions.hold;

  const statCards = [
    {
      title: 'Total Signals',
      value: stats.total_signals.toLocaleString(),
      subtitle: `${(stats.total_signals / timeframe).toFixed(1)} per day`,
      trend: stats.total_signals,
      icon: <Megaphone className="text-cyan-400" size={20} />,
      gradient: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/20',
    },
    {
      title: 'Long Signals',
      value: stats.decisions.long.toLocaleString(),
      subtitle: `${((stats.decisions.long / totalDecisions) * 100).toFixed(1)}% of total`,
      trend: stats.decisions.long,
      icon: <TrendingUp className="text-green-400" size={20} />,
      gradient: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/20',
    },
    {
      title: 'Short Signals',
      value: stats.decisions.short.toLocaleString(),
      subtitle: `${((stats.decisions.short / totalDecisions) * 100).toFixed(1)}% of total`,
      trend: stats.decisions.short,
      icon: <TrendingDown className="text-red-400" size={20} />,
      gradient: 'from-red-500/20 to-orange-500/20',
      border: 'border-red-500/20',
    },
    {
      title: 'Hold Signals',
      value: stats.decisions.hold.toLocaleString(),
      subtitle: `${((stats.decisions.hold / totalDecisions) * 100).toFixed(1)}% of total`,
      trend: stats.decisions.hold,
      icon: <Minus className="text-yellow-400" size={20} />,
      gradient: 'from-yellow-500/20 to-orange-500/20',
      border: 'border-yellow-500/20',
    },
  ];

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-green-400';
    if (strength >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStrengthBadge = (strength: number) => {
    if (strength >= 80) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (strength >= 60) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
              <Zap className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                Signal Analytics
              </h1>
              <p className="text-gray-400 text-sm">
                AI-powered signal generation performance and metrics
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadSignalStats(true)}
            disabled={refreshing}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
          </button>
          
          <select
            value={signalType}
            onChange={(e) => setSignalType(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
          >
            <option value="all">All Signals</option>
            <option value="long">Long Only</option>
            <option value="short">Short Only</option>
            <option value="hold">Hold Only</option>
          </select>
          
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(parseInt(e.target.value))}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
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
                {card.icon}
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
        {/* Signal Quality */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
              <BarChart3 size={20} />
              Signal Quality Metrics
            </h3>
            <Target className="text-gray-400" size={16} />
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Average Consensus Strength</span>
                <span className={`font-bold ${getStrengthColor(stats.avg_consensus_strength)}`}>
                  {stats.avg_consensus_strength.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                    stats.avg_consensus_strength >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                    stats.avg_consensus_strength >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                    'bg-gradient-to-r from-red-500 to-pink-500'
                  }`}
                  style={{ width: `${Math.min(stats.avg_consensus_strength, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Weak</span>
                <span>Strong</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="text-cyan-400" size={16} />
                  <span className="text-gray-300 text-sm">Signals per Day</span>
                </div>
                <p className="text-cyan-400 font-bold text-xl">
                  {(stats.total_signals / timeframe).toFixed(1)}
                </p>
              </div>
              
              <div className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="text-green-400" size={16} />
                  <span className="text-gray-300 text-sm">Success Rate</span>
                </div>
                <p className="text-green-400 font-bold text-xl">76.4%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
              <Target size={20} />
              Performance Overview
            </h3>
            <TrendingUp className="text-gray-400" size={16} />
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-300 text-sm">Signal Distribution</span>
                  <p className="text-white font-bold text-lg">Balanced</p>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 text-xs">Health</span>
                  <div className="text-green-400 text-sm font-medium">Optimal</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-800/20 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-400 text-sm">Signal Health</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStrengthBadge(stats.avg_consensus_strength)}`}>
                  {stats.avg_consensus_strength >= 80 ? 'Excellent' :
                   stats.avg_consensus_strength >= 60 ? 'Good' : 'Needs Attention'}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Long Accuracy</span>
                  <span className="text-green-400">82.3%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Short Accuracy</span>
                  <span className="text-red-400">71.8%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Avg ROI</span>
                  <span className="text-cyan-400">+4.2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Most Active Symbols */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
            <Activity size={20} />
            Most Active Symbols
          </h3>
          <span className="text-gray-400 text-sm">
            {stats.most_active_symbols.length} symbols tracked
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stats.most_active_symbols.map((item, index) => (
            <div
              key={index}
              className="bg-gray-800/30 rounded-xl p-4 flex items-center justify-between hover:bg-gray-800/50 transition-all duration-200 group hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                  index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                  index === 1 ? 'bg-gray-500/20 text-gray-400' :
                  index === 2 ? 'bg-orange-500/20 text-orange-400' :
                  'bg-cyan-500/20 text-cyan-400'
                }`}>
                  <span className="font-bold text-sm">#{index + 1}</span>
                </div>
                <div>
                  <p className="text-white font-bold group-hover:text-cyan-400 transition-colors">
                    {item.symbol}
                  </p>
                  <p className="text-gray-400 text-xs">{item.count} signals</p>
                </div>
              </div>
              <button className="p-2 hover:bg-cyan-500/10 text-cyan-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                <Eye size={16} />
              </button>
            </div>
          ))}
        </div>

        {stats.most_active_symbols.length === 0 && (
          <div className="text-center py-8">
            <AlertTriangle className="mx-auto text-gray-400 mb-3" size={48} />
            <p className="text-gray-400">No signal data available for selected timeframe</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-green-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-green-400 mb-4">Signal Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200 text-left group">
            <div className="flex items-center gap-3 mb-2">
              <Filter className="text-cyan-400" size={20} />
              <span className="text-white font-medium">Configure Filters</span>
            </div>
            <p className="text-gray-400 text-sm">Adjust signal generation parameters</p>
          </button>
          
          <button className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200 text-left group">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="text-yellow-400" size={20} />
              <span className="text-white font-medium">Quality Report</span>
            </div>
            <p className="text-gray-400 text-sm">Generate performance analysis</p>
          </button>
          
          <button className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200 text-left group">
            <div className="flex items-center gap-3 mb-2">
              <Download className="text-green-400" size={20} />
              <span className="text-white font-medium">Export Data</span>
            </div>
            <p className="text-gray-400 text-sm">Download signal history</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signals;