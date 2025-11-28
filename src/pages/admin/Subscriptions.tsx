// src/pages/admin/Subscriptions.tsx
import React, { useEffect, useState } from 'react';
import { adminService } from '../../api/services/adminService';
import { SubscriptionStats, SubscriptionManualUpdate } from '../../types/admin.types';
import {
  Activity,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Edit2,
  Filter,
  X,
  RefreshCw,
  Download,
  Plus,
  AlertTriangle,
  CheckCircle,
  Calendar,
  BarChart3,
  Target,
  Zap,
  ChevronDown,
  Eye,
  Mail,
} from 'lucide-react';

const Subscriptions: React.FC = () => {
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [expiringUsers, setExpiringUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showManualUpdate, setShowManualUpdate] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  
  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [filterDays, setFilterDays] = useState<number | null>(null);
  const [appliedFilterDays, setAppliedFilterDays] = useState<number | null>(null);

  useEffect(() => {
    loadSubscriptionData();
  }, [appliedFilterDays]);

  const loadSubscriptionData = async (silent: boolean = false) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    
    try {
      const [statsData, expiringData] = await Promise.all([
        adminService.getSubscriptionStats(),
        adminService.getExpiringSubscriptions(appliedFilterDays || 7),
      ]);
      setStats(statsData);
      setExpiringUsers(expiringData.users || []);
    } catch (error) {
      console.error('Failed to load subscription data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualUpdate = async (data: SubscriptionManualUpdate) => {
    try {
      await adminService.manualSubscriptionUpdate(data);
      setShowManualUpdate(false);
      loadSubscriptionData(true);
    } catch (error) {
      console.error('Failed to update subscription:', error);
    }
  };

  const handleApplyFilter = () => {
    setAppliedFilterDays(filterDays);
    setShowFilters(false);
  };

  const handleClearFilter = () => {
    setFilterDays(null);
    setAppliedFilterDays(null);
    setShowFilters(false);
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
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
        <Activity className="text-red-400" size={48} />
        <h3 className="text-xl font-semibold text-white">Failed to load subscription data</h3>
        <p className="text-gray-400 text-center max-w-md">
          Unable to retrieve subscription statistics. Please check your connection and try again.
        </p>
        <button
          onClick={() => loadSubscriptionData()}
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
      title: 'Total Subscriptions',
      value: stats.total_subscriptions.toLocaleString(),
      subtitle: 'All time',
      trend: stats.total_subscriptions,
      icon: <Users className="text-cyan-400" size={20} />,
      gradient: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/20',
    },
    {
      title: 'Active Subscriptions',
      value: stats.active_subscriptions.toLocaleString(),
      subtitle: 'Currently active',
      trend: stats.active_subscriptions,
      icon: <Activity className="text-green-400" size={20} />,
      gradient: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/20',
    },
    {
      title: 'Expired',
      value: stats.expired_subscriptions.toLocaleString(),
      subtitle: 'No longer active',
      trend: stats.expired_subscriptions,
      icon: <TrendingDown className="text-red-400" size={20} />,
      gradient: 'from-red-500/20 to-orange-500/20',
      border: 'border-red-500/20',
    },
    {
      title: 'Expiring Soon',
      value: stats.expiring_soon.toLocaleString(),
      subtitle: 'Next 7 days',
      trend: stats.expiring_soon,
      icon: <Clock className="text-yellow-400" size={20} />,
      gradient: 'from-yellow-500/20 to-orange-500/20',
      border: 'border-yellow-500/20',
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthly_recurring_revenue.toLocaleString()}`,
      subtitle: 'Recurring revenue',
      trend: stats.monthly_recurring_revenue,
      icon: <DollarSign className="text-purple-400" size={20} />,
      gradient: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/20',
    },
    {
      title: 'Churn Rate',
      value: `${stats.churn_rate.toFixed(2)}%`,
      subtitle: 'Cancellation rate',
      trend: -stats.churn_rate,
      icon: <TrendingUp className="text-blue-400" size={20} />,
      gradient: 'from-blue-500/20 to-indigo-500/20',
      border: 'border-blue-500/20',
    },
  ];

  const getDaysRemainingColor = (days: number) => {
    if (days <= 2) return 'text-red-400 bg-red-500/20 border-red-500/30';
    if (days <= 5) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
  };

  const getUrgencyLevel = (days: number) => {
    if (days <= 2) return { label: 'Critical', color: 'text-red-400' };
    if (days <= 5) return { label: 'High', color: 'text-yellow-400' };
    if (days <= 14) return { label: 'Medium', color: 'text-blue-400' };
    return { label: 'Low', color: 'text-green-400' };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
              <Activity className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                Subscription Management
              </h1>
              <p className="text-gray-400 text-sm">
                Monitor and manage user subscriptions and revenue
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadSubscriptionData(true)}
            disabled={refreshing}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
          </button>
          
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2">
            <Download size={18} />
            <span>Export</span>
          </button>
          
          <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all duration-200 shadow-lg shadow-cyan-500/25 flex items-center gap-2">
            <Plus size={18} />
            <span>New Plan</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription Health */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
              <BarChart3 size={20} />
              Subscription Health
            </h3>
            <Target className="text-gray-400" size={16} />
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Active Rate</span>
                <span className="text-green-400 font-bold">
                  {((stats.active_subscriptions / Math.max(stats.total_subscriptions, 1)) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(stats.active_subscriptions / Math.max(stats.total_subscriptions, 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="text-blue-400" size={16} />
                  <span className="text-gray-300 text-sm">Avg Duration</span>
                </div>
                <p className="text-blue-400 font-bold text-xl">
                  {stats.avg_subscription_length_days.toFixed(0)} days
                </p>
              </div>
              
              <div className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="text-purple-400" size={16} />
                  <span className="text-gray-300 text-sm">Churn Rate</span>
                </div>
                <p className="text-purple-400 font-bold text-xl">{stats.churn_rate.toFixed(2)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Projection */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
              <DollarSign size={20} />
              Revenue Analytics
            </h3>
            <TrendingUp className="text-gray-400" size={16} />
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-300 text-sm">Current MRR</span>
                  <p className="text-green-400 font-bold text-2xl">
                    ${stats.monthly_recurring_revenue.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 text-xs">Monthly</span>
                  <div className="text-green-400 text-sm font-medium">Recurring</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="text-cyan-400" size={16} />
                  <span className="text-gray-300 text-sm">Projected ARR</span>
                </div>
                <p className="text-cyan-400 font-bold text-xl">
                  ${(stats.monthly_recurring_revenue * 12).toLocaleString()}
                </p>
              </div>
              
              <div className="p-4 bg-gray-800/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="text-yellow-400" size={16} />
                  <span className="text-gray-300 text-sm">Avg. Revenue</span>
                </div>
                <p className="text-yellow-400 font-bold text-xl">
                  ${(stats.monthly_recurring_revenue / Math.max(stats.active_subscriptions, 1)).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expiring Subscriptions */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
              <AlertTriangle size={20} />
              Subscriptions Expiring Soon
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              {expiringUsers.length} subscriptions require attention
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {appliedFilterDays && (
              <span className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-lg">
                Next {appliedFilterDays} days
              </span>
            )}
            
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
              >
                <Filter size={16} />
                <span>Filter</span>
                <ChevronDown size={14} />
              </button>
              
              {showFilters && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-4 z-50">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Days Range</label>
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={filterDays || ''}
                        onChange={(e) => setFilterDays(e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="Enter days (e.g., 30)"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={handleApplyFilter}
                        className="flex-1 px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        Apply
                      </button>
                      <button
                        onClick={handleClearFilter}
                        className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {appliedFilterDays && (
              <button
                onClick={handleClearFilter}
                className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                title="Clear filter"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {expiringUsers.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="mx-auto text-green-400 mb-3" size={48} />
            <p className="text-gray-400 text-lg">All clear!</p>
            <p className="text-gray-500 text-sm">
              No subscriptions expiring in the {appliedFilterDays || 'default'} timeframe
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50 border-b border-cyan-500/20">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Expiration Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {expiringUsers.map((user) => {
                  const urgency = getUrgencyLevel(user.days_remaining);
                  return (
                    <tr 
                      key={user.user_id} 
                      className="hover:bg-gray-800/30 transition-colors duration-200 group"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
                            {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                              {user.full_name || 'Unnamed User'}
                            </p>
                            <p className="text-gray-400 text-xs">
                              ID: {user.user_id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-gray-300">{user.email}</p>
                          {user.phone && (
                            <p className="text-gray-400 text-xs">{user.phone}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="text-gray-400" size={14} />
                          <span className="text-gray-300 text-sm">
                            {new Date(user.subscription_end).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getDaysRemainingColor(user.days_remaining)}`}>
                            {user.days_remaining} days left
                          </span>
                          <div className={`text-xs ${urgency.color}`}>
                            {urgency.label} priority
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedUserId(user.user_id);
                              setShowManualUpdate(true);
                            }}
                            className="p-2 hover:bg-cyan-500/10 text-cyan-400 rounded-lg transition-colors duration-200 hover:scale-110"
                            title="Extend subscription"
                          >
                            <Edit2 size={16} />
                          </button>
                          
                          <button className="p-2 hover:bg-blue-500/10 text-blue-400 rounded-lg transition-colors duration-200 hover:scale-110">
                            <Mail size={16} />
                          </button>
                          
                          <button className="p-2 hover:bg-gray-600 text-gray-400 rounded-lg transition-colors duration-200">
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Update Modal */}
      {showManualUpdate && (
        <ManualUpdateModal
          userId={selectedUserId}
          onClose={() => setShowManualUpdate(false)}
          onSave={handleManualUpdate}
        />
      )}
    </div>
  );
};

// Enhanced Manual Update Modal
interface ManualUpdateModalProps {
  userId: string;
  onClose: () => void;
  onSave: (data: SubscriptionManualUpdate) => void;
}

const ManualUpdateModal: React.FC<ManualUpdateModalProps> = ({ userId, onClose, onSave }) => {
  const [months, setMonths] = useState(1);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.length < 10) {
      alert('Please provide a detailed reason (minimum 10 characters)');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        user_id: userId,
        subscription_months: months,
        reason,
      });
    } finally {
      setLoading(false);
    }
  };

  const subscriptionOptions = [
    { value: 1, label: '1 Month', price: '$29.00' },
    { value: 3, label: '3 Months', price: '$75.00', discount: 'Save 15%' },
    { value: 6, label: '6 Months', price: '$135.00', discount: 'Save 25%' },
    { value: 12, label: '1 Year', price: '$240.00', discount: 'Save 35%' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-cyan-500/20 rounded-2xl p-6 max-w-2xl w-full mx-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-cyan-400">Manual Subscription Update</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* User Summary */}
        <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
            {userId.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-medium">User ID: {userId.slice(0, 8)}...</p>
            <p className="text-gray-400 text-sm">Manual subscription extension</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subscription Options */}
          <div>
            <label className="block text-gray-400 text-sm mb-3 font-medium">
              Subscription Duration
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {subscriptionOptions.map((option) => (
                <label
                  key={option.value}
                  className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                    months === option.value
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="duration"
                    value={option.value}
                    checked={months === option.value}
                    onChange={(e) => setMonths(parseInt(e.target.value))}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-white font-bold mb-1">{option.label}</div>
                    <div className="text-cyan-400 font-semibold">{option.price}</div>
                    {option.discount && (
                      <div className="text-green-400 text-xs mt-1">{option.discount}</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Duration */}
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">
              Custom Duration (Months)
            </label>
            <input
              type="number"
              min="1"
              max="36"
              value={months}
              onChange={(e) => setMonths(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">
              Reason for Manual Update <span className="text-red-400">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="Please provide a detailed reason for this manual subscription update (minimum 10 characters)..."
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all resize-none"
            />
            <div className={`text-xs mt-1 ${reason.length < 10 ? 'text-red-400' : 'text-green-400'}`}>
              {reason.length}/10 characters minimum
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700">
            <h4 className="text-gray-300 font-medium mb-2">Update Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Duration:</span>
                <span className="text-white">{months} month{months !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cost:</span>
                <span className="text-green-400">${(months * 29).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">New Expiry:</span>
                <span className="text-cyan-400">
                  {new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all duration-200 font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={reason.length < 10 || loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                `Extend Subscription`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Subscriptions;