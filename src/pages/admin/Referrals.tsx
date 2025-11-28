// src/pages/admin/Referrals.tsx
import React, { useEffect, useState } from 'react';
import { adminService } from '../../api/services/adminService';
import { ReferralManagementStats } from '../../types/admin.types';
import { 
  Gift, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Users, 
  RefreshCw,
  Award,
  Calendar,
  BarChart3,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const Referrals: React.FC = () => {
  const [stats, setStats] = useState<ReferralManagementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadReferralStats();
  }, []);

  const loadReferralStats = async (silent: boolean = false) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    
    try {
      const data = await adminService.getReferralStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load referral stats:', error);
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
          <div className="h-10 bg-gray-700 rounded-lg w-10 animate-pulse"></div>
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
            <div className="space-y-3">
              {Array.from({ length: 1 }).map((_, i) => (
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
        <Gift className="text-red-400" size={48} />
        <h3 className="text-xl font-semibold text-white">Failed to load referral data</h3>
        <p className="text-gray-400 text-center max-w-md">
          Unable to retrieve referral statistics. Please check your connection and try again.
        </p>
        <button
          onClick={() => loadReferralStats()}
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
      title: 'Total Referrals',
      value: stats.total_referrals.toLocaleString(),
      subtitle: `${stats.pending_referrals} pending`,
      trend: stats.total_referrals,
      icon: <Gift className="text-cyan-400" size={20} />,
      gradient: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/20',
    },
    {
      title: 'Completed',
      value: stats.completed_referrals.toLocaleString(),
      subtitle: 'Successful conversions',
      trend: stats.completed_referrals,
      icon: <CheckCircle className="text-green-400" size={20} />,
      gradient: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/20',
    },
    {
      title: 'Pending',
      value: stats.pending_referrals.toLocaleString(),
      subtitle: 'Awaiting completion',
      trend: stats.pending_referrals,
      icon: <Clock className="text-yellow-400" size={20} />,
      gradient: 'from-yellow-500/20 to-orange-500/20',
      border: 'border-yellow-500/20',
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversion_rate.toFixed(1)}%`,
      subtitle: 'Success rate',
      trend: stats.conversion_rate,
      icon: <TrendingUp className="text-purple-400" size={20} />,
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
              <Gift className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Referral Management
              </h1>
              <p className="text-gray-400 text-sm">
                Monitor referral program performance and analytics
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => loadReferralStats(true)}
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
                <h3 className="text-2xl font-bold text-white">{card.value}</h3>
                <p className="text-xs text-gray-400">{card.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referral Codes */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
              <Users size={20} />
              Referral Codes
            </h3>
            <BarChart3 className="text-gray-400" size={16} />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
              <div>
                <span className="text-gray-300 text-sm">Total Codes</span>
                <p className="text-white font-bold text-lg">{stats.total_referral_codes}</p>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-xs">All Time</span>
                <div className="text-cyan-400 text-sm font-medium">Created</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
              <div>
                <span className="text-gray-300 text-sm">Active Codes</span>
                <span className="text-green-400 font-bold text-lg">{stats.active_referral_codes}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-xs">Currently Active</span>
                <div className="text-green-400 text-sm font-medium">Live</div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
              <TrendingUp size={20} />
              Performance Metrics
            </h3>
            <Calendar className="text-gray-400" size={16} />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
              <div>
                <span className="text-gray-300 text-sm">Avg Conversion Time</span>
                <p className="text-cyan-400 font-bold text-lg">
                  {stats.avg_time_to_conversion_days.toFixed(0)} days
                </p>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-xs">Average</span>
                <div className="text-cyan-400 text-sm font-medium">Duration</div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-800/20 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">Program Health</span>
                <span className="text-green-400 text-sm font-medium">
                  {stats.conversion_rate > 20 ? 'Excellent' : stats.conversion_rate > 10 ? 'Good' : 'Needs Attention'}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(stats.conversion_rate, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Referrers */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
            <Award size={20} />
            Top Referrers
          </h3>
          <span className="text-gray-400 text-sm">
            {stats.top_referrers.length} performers
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-cyan-500/20">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Referrer
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Successful Referrals
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {stats.top_referrers.map((referrer, index) => (
                <tr 
                  key={referrer.user_id} 
                  className="hover:bg-gray-800/30 transition-colors duration-200 group"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                        index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                        index === 1 ? 'bg-gray-500/20 text-gray-400' :
                        index === 2 ? 'bg-orange-500/20 text-orange-400' :
                        'bg-cyan-500/20 text-cyan-400'
                      }`}>
                        <span className="text-sm font-bold">#{index + 1}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                        {referrer.email}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        ID: {referrer.user_id.slice(0, 8)}...
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-green-400 font-bold text-lg">
                        {referrer.referral_count}
                      </span>
                      <CheckCircle className="text-green-400" size={16} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {stats.top_referrers.length === 0 && (
          <div className="text-center py-8">
            <Gift className="mx-auto text-gray-400 mb-3" size={48} />
            <p className="text-gray-400">No referral data available yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Referrals;