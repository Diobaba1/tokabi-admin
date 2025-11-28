// src/pages/admin/Affiliates.tsx
import React, { useEffect, useState } from 'react';
import { adminService } from '../../api/services/adminService';
import { AffiliateManagementResponse } from '../../types/admin.types';
import { 
  Users, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  UserCheck,
  RefreshCw,
  Award,
  BarChart3,
  ArrowUp
} from 'lucide-react';

const Affiliates: React.FC = () => {
  const [overview, setOverview] = useState<AffiliateManagementResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAffiliateOverview();
  }, []);

  const loadAffiliateOverview = async (silent: boolean = false) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    
    try {
      const data = await adminService.getAffiliateOverview();
      setOverview(data);
    } catch (error) {
      console.error('Failed to load affiliate overview:', error);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <UserCheck className="text-red-400" size={48} />
        <h3 className="text-xl font-semibold text-white">Failed to load affiliate data</h3>
        <p className="text-gray-400 text-center max-w-md">
          Unable to retrieve affiliate program statistics. Please check your connection and try again.
        </p>
        <button
          onClick={() => loadAffiliateOverview()}
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
      title: 'Active Affiliates',
      value: overview.active_affiliates.toLocaleString(),
      subtitle: `${overview.total_affiliates} total`,
      trend: overview.active_affiliates,
      icon: <UserCheck className="text-cyan-400" size={20} />,
      gradient: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/20',
    },
    {
      title: 'Pending Applications',
      value: overview.pending_applications.toLocaleString(),
      subtitle: 'Awaiting review',
      trend: overview.pending_applications,
      icon: <Clock className="text-yellow-400" size={20} />,
      gradient: 'from-yellow-500/20 to-orange-500/20',
      border: 'border-yellow-500/20',
    },
    {
      title: 'Total Commissions',
      value: formatCurrency(overview.total_commissions_paid),
      subtitle: 'All time paid',
      trend: overview.total_commissions_paid,
      icon: <DollarSign className="text-green-400" size={20} />,
      gradient: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/20',
    },
    {
      title: 'Pending Commissions',
      value: formatCurrency(overview.pending_commissions),
      subtitle: 'Awaiting approval',
      trend: overview.pending_commissions,
      icon: <DollarSign className="text-purple-400" size={20} />,
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
              <Award className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Affiliate Management
              </h1>
              <p className="text-gray-400 text-sm">
                Manage affiliate program and commission tracking
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => loadAffiliateOverview(true)}
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
                  <ArrowUp className="text-green-400" size={14} />
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

      {/* Program Performance */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
            <BarChart3 size={20} />
            Program Performance
          </h3>
          <TrendingUp className="text-gray-400" size={16} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Conversion Metrics */}
          <div className="space-y-4">
            <div className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">Conversion Rate</span>
                <span className="text-cyan-400 text-sm font-medium">
                  {overview.conversion_rate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(overview.conversion_rate, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-300 text-sm">Completed Referrals</span>
                  <p className="text-green-400 font-bold text-lg">{overview.completed_referrals}</p>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 text-xs">Successful</span>
                  <div className="text-green-400 text-sm font-medium">Conversions</div>
                </div>
              </div>
            </div>
          </div>

          {/* Program Health */}
          <div className="space-y-4">
            <div className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">Program Health</span>
                <span className={`text-sm font-medium ${
                  overview.conversion_rate > 15 ? 'text-green-400' :
                  overview.conversion_rate > 8 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {overview.conversion_rate > 15 ? 'Excellent' :
                   overview.conversion_rate > 8 ? 'Good' : 'Needs Attention'}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                    overview.conversion_rate > 15 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                    overview.conversion_rate > 8 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                    'bg-gradient-to-r from-red-500 to-pink-500'
                  }`}
                  style={{ width: `${Math.min(overview.conversion_rate, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-300 text-sm">Total Referrals</span>
                  <p className="text-white font-bold text-lg">{overview.total_referrals}</p>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 text-xs">All Time</span>
                  <div className="text-blue-400 text-sm font-medium">Referrals</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-800/30 rounded-lg border border-cyan-500/20">
          <div className="flex items-center gap-3">
            <Users className="text-cyan-400" size={20} />
            <div>
              <p className="text-gray-400 text-sm">Total Affiliates</p>
              <p className="text-white font-bold text-xl">{overview.total_affiliates}</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gray-800/30 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-3">
            <DollarSign className="text-green-400" size={20} />
            <div>
              <p className="text-gray-400 text-sm">Commission Rate</p>
              <p className="text-white font-bold text-xl">15%</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gray-800/30 rounded-lg border border-purple-500/20">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-purple-400" size={20} />
            <div>
              <p className="text-gray-400 text-sm">Avg Payout</p>
              <p className="text-white font-bold text-xl">{formatCurrency(overview.total_commissions_paid / Math.max(overview.completed_referrals, 1))}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Affiliates;