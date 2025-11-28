// src/pages/admin/APIKeys.tsx
import React, { useEffect, useState } from 'react';
import { adminService } from '../../api/services/adminService';
import { APIKeyOverview } from '../../types/admin.types';
import { 
  Key, 
  Users, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Shield,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

const APIKeys: React.FC = () => {
  const [overview, setOverview] = useState<APIKeyOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [revokingKey, setRevokingKey] = useState<string | null>(null);

  useEffect(() => {
    loadAPIKeysOverview();
  }, []);

  const loadAPIKeysOverview = async (silent: boolean = false) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    
    try {
      const data = await adminService.getAPIKeysOverview();
      setOverview(data);
    } catch (error) {
      console.error('Failed to load API keys overview:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRevokeKey = async (keyId: string, userEmail: string) => {
    if (!window.confirm(`Are you sure you want to revoke API keys for ${userEmail}? This action cannot be undone.`)) return;

    setRevokingKey(keyId);
    try {
      await adminService.revokeAPIKey(keyId);
      await loadAPIKeysOverview(true);
    } catch (error) {
      console.error('Failed to revoke API key:', error);
      alert('Failed to revoke API key. Please try again.');
    } finally {
      setRevokingKey(null);
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))}
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Key className="text-red-400" size={48} />
        <h3 className="text-xl font-semibold text-white">Failed to load API key data</h3>
        <p className="text-gray-400 text-center max-w-md">
          Unable to retrieve API key information. Please check your connection and try again.
        </p>
        <button
          onClick={() => loadAPIKeysOverview()}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  const totalKeys = overview.api_keys.reduce((sum, item) => sum + item.total_api_keys, 0);
  const totalActiveKeys = overview.api_keys.reduce((sum, item) => sum + item.active_keys, 0);

  const statCards = [
    {
      title: 'Users with Keys',
      value: overview.total_users_with_keys.toLocaleString(),
      subtitle: `${overview.api_keys.length} total`,
      icon: <Users className="text-cyan-400" size={20} />,
      gradient: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/20',
    },
    {
      title: 'Total API Keys',
      value: totalKeys.toLocaleString(),
      subtitle: `${totalActiveKeys} active`,
      icon: <Key className="text-green-400" size={20} />,
      gradient: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/20',
    },
    {
      title: 'Security Status',
      value: 'Protected',
      subtitle: 'All keys encrypted',
      icon: <Shield className="text-purple-400" size={20} />,
      gradient: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/20',
    },
  ];

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                API Key Management
              </h1>
              <p className="text-gray-400 text-sm">
                Monitor and manage user API keys and security
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => loadAPIKeysOverview(true)}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* API Keys Table */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
            <Key size={20} />
            User API Keys
          </h3>
          <span className="text-gray-400 text-sm">
            {overview.api_keys.length} users
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-cyan-500/20">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Keys
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Last Validated
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {overview.api_keys.map((item) => (
                <tr 
                  key={item.user_id} 
                  className="hover:bg-gray-800/30 transition-colors duration-200 group"
                >
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                        {item.user_email}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        ID: {item.user_id.slice(0, 8)}...
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-white font-bold">{item.total_api_keys}</p>
                        <p className="text-gray-400 text-xs">Total</p>
                      </div>
                      <div className="text-center">
                        <p className="text-green-400 font-bold">{item.active_keys}</p>
                        <p className="text-gray-400 text-xs">Active</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400 font-bold">{item.inactive_keys}</p>
                        <p className="text-gray-400 text-xs">Inactive</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {item.active_keys > 0 ? (
                        <>
                          <CheckCircle className="text-green-400" size={16} />
                          <span className="text-green-400 text-sm font-medium">Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="text-gray-400" size={16} />
                          <span className="text-gray-400 text-sm">Inactive</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-gray-400" size={14} />
                      <span className="text-gray-400 text-sm">
                        {formatDate(item.last_validated)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleRevokeKey(item.user_id, item.user_email)}
                        disabled={revokingKey === item.user_id || item.active_keys === 0}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                        title="Revoke all API keys for this user"
                      >
                        {revokingKey === item.user_id ? (
                          <RefreshCw className="animate-spin" size={16} />
                        ) : (
                          <XCircle size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {overview.api_keys.length === 0 && (
          <div className="text-center py-8">
            <Key className="mx-auto text-gray-400 mb-3" size={48} />
            <p className="text-gray-400">No API keys found in the system</p>
          </div>
        )}
      </div>

      {/* Security Notes */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-yellow-500/20 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-yellow-400 mt-0.5 flex-shrink-0" size={20} />
          <div>
            <h4 className="text-yellow-400 font-semibold mb-2">Security Guidelines</h4>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• API keys are automatically encrypted and never stored in plain text</li>
              <li>• Revoking keys will immediately disable all API access for the user</li>
              <li>• Users will need to generate new keys after revocation</li>
              <li>• Monitor last validation dates for suspicious activity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};


export {  APIKeys };