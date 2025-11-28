// src/pages/admin/Users.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { adminService } from '../../api/services/adminService';
import { UserManagementResponse, UserUpdateRequest, BulkUserAction } from '../../types/admin.types';
import {
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Crown,
  Mail,
  Calendar,
  TrendingUp,
  DollarSign,
  Users as UsersIcon,
  RefreshCw,
  Download,
  MoreVertical,
  Shield,
  Eye,
  Ban,
  UserPlus,
  UserCheck,
  UserX,
  ChevronDown,
  AlertTriangle,
  BarChart3,
  Target,
  Zap,
} from 'lucide-react';

const Users: React.FC = () => {
  const [users, setUsers] = useState<UserManagementResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<UserManagementResponse | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<string>('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    subscribed: 0,
    admins: 0,
  });

  useEffect(() => {
    loadUsers();
  }, [statusFilter]);

  const loadUsers = async (silent: boolean = false) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    
    try {
      const data = await adminService.getUsers({
        status: statusFilter || undefined,
        search: searchTerm || undefined,
      });
      setUsers(data);
      
      // Calculate stats
      setStats({
        total: data.length,
        active: data.filter(u => u.is_active).length,
        subscribed: data.filter(u => u.is_subscribed).length,
        admins: data.filter(u => u.is_admin).length,
      });
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers();
  };

  const handleEditUser = (user: UserManagementResponse) => {
    setSelectedUser(user);
    setShowEditModal(true);
    setShowActionsMenu(null);
  };

  const handleUpdateUser = async (updates: UserUpdateRequest) => {
    if (!selectedUser) return;

    try {
      await adminService.updateUser(selectedUser.id, updates);
      setShowEditModal(false);
      loadUsers(true);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to deactivate this user? They will lose access to the platform.')) return;

    try {
      await adminService.updateUser(userId, { is_active: false });
      setShowActionsMenu(null);
      loadUsers(true);
    } catch (error) {
      console.error('Failed to deactivate user:', error);
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      await adminService.updateUser(userId, { is_active: true });
      setShowActionsMenu(null);
      loadUsers(true);
    } catch (error) {
      console.error('Failed to activate user:', error);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedUsers.size === 0) return;

    const actionData: BulkUserAction = {
      user_ids: Array.from(selectedUsers),
      action: bulkAction as any,
    };

    try {
      await adminService.bulkUserAction(actionData);
      setSelectedUsers(new Set());
      setBulkAction('');
      loadUsers(true);
    } catch (error) {
      console.error('Failed to perform bulk action:', error);
    }
  };

  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const selectAllUsers = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const StatCard = ({ title, value, subtitle, icon, color }: any) => (
    <div className={`bg-gray-900/50 backdrop-blur-xl border ${color.border} rounded-xl p-6 group hover:scale-[1.02] transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg ${color.bg}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const UserStatusBadge = ({ user }: { user: UserManagementResponse }) => (
    <div className="flex flex-wrap gap-1">
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        user.is_active
          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
          : 'bg-red-500/20 text-red-400 border border-red-500/30'
      }`}>
        {user.is_active ? <CheckCircle size={12} /> : <XCircle size={12} />}
        {user.is_active ? 'Active' : 'Inactive'}
      </span>
      
      {user.is_verified && (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
          <Mail size={12} /> Verified
        </span>
      )}
      
      {user.is_admin && (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
          <Shield size={12} /> Admin
        </span>
      )}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
              <UsersIcon className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                User Management
              </h1>
              <p className="text-gray-400 text-sm">
                Manage platform users, permissions, and access controls
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadUsers(true)}
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
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.total.toLocaleString()}
          subtitle="All platform users"
          icon={<UsersIcon className="text-cyan-400" size={20} />}
          color={{ border: 'border-cyan-500/20', bg: 'bg-cyan-500/10' }}
        />
        <StatCard
          title="Active Users"
          value={stats.active.toLocaleString()}
          subtitle="Currently active"
          icon={<UserCheck className="text-green-400" size={20} />}
          color={{ border: 'border-green-500/20', bg: 'bg-green-500/10' }}
        />
        <StatCard
          title="Subscribed"
          value={stats.subscribed.toLocaleString()}
          subtitle="Premium members"
          icon={<Crown className="text-purple-400" size={20} />}
          color={{ border: 'border-purple-500/20', bg: 'bg-purple-500/10' }}
        />
        <StatCard
          title="Administrators"
          value={stats.admins.toLocaleString()}
          subtitle="Admin users"
          icon={<Shield className="text-yellow-400" size={20} />}
          color={{ border: 'border-yellow-500/20', bg: 'bg-yellow-500/10' }}
        />
      </div>

      {/* Search & Filters */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search users by email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all appearance-none"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="subscribed">Subscribed</option>
                <option value="unsubscribed">Unsubscribed</option>
                <option value="admin">Administrators</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02]"
            >
              Apply Filters
            </button>
          </div>
        </form>

        {/* Bulk Actions */}
        {selectedUsers.size > 0 && (
          <div className="mt-4 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex items-center gap-2">
                <Target className="text-cyan-400" size={18} />
                <span className="text-white font-medium">{selectedUsers.size} users selected</span>
              </div>
              
              <div className="flex-1 flex flex-col lg:flex-row gap-2">
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  <option value="">Choose action...</option>
                  <option value="activate">Activate Users</option>
                  <option value="deactivate">Deactivate Users</option>
                  <option value="subscribe">Subscribe Users</option>
                  <option value="unsubscribe">Unsubscribe Users</option>
                </select>
                
                <button
                  onClick={handleBulkAction}
                  disabled={!bulkAction}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  Apply to Selected
                </button>
                
                <button
                  onClick={() => setSelectedUsers(new Set())}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-400"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <UsersIcon size={48} className="mb-4 opacity-50" />
            <p className="text-lg">No users found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50 border-b border-cyan-500/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                        onChange={selectAllUsers}
                        className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
                      />
                      User
                    </label>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Subscription
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Trading Activity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Portfolio
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-800/30 transition-colors duration-200 group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedUsers.has(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
                        />
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                              {user.full_name?.charAt(0) || 'U'}
                            </div>
                            {user.is_admin && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                                <Crown size={10} className="text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                                {user.full_name || 'Unnamed User'}
                              </p>
                            </div>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <UserStatusBadge user={user} />
                    </td>
                    <td className="px-6 py-4">
                      {user.is_subscribed ? (
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30">
                            <Crown size={12} /> Premium
                          </span>
                          {user.subscription_end && (
                            <span className="text-xs text-gray-400">
                              Renews: {new Date(user.subscription_end).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
                          Free Tier
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="text-cyan-400" size={16} />
                            <span className="text-white font-bold">{user.total_trades}</span>
                          </div>
                          <span className="text-gray-400 text-xs">Total</span>
                        </div>
                        <div className="h-8 w-px bg-gray-700"></div>
                        <div className="text-center">
                          <div className="text-green-400 font-bold">{user.open_trades}</div>
                          <span className="text-gray-400 text-xs">Open</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="text-green-400" size={16} />
                        <span className="text-white font-medium">
                          ${user.portfolio_balance?.toLocaleString() || '0'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar size={14} />
                        <span className="text-sm">{new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 hover:bg-cyan-500/10 text-cyan-400 rounded-lg transition-colors duration-200 hover:scale-110"
                          title="Edit user"
                        >
                          <Edit2 size={16} />
                        </button>
                        
                        <div className="relative">
                          <button
                            onClick={() => setShowActionsMenu(showActionsMenu === user.id ? null : user.id)}
                            className="p-2 hover:bg-gray-600 text-gray-400 rounded-lg transition-colors duration-200"
                          >
                            <MoreVertical size={16} />
                          </button>
                          
                          {showActionsMenu === user.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl py-1 z-50">
                              {user.is_active ? (
                                <button
                                  onClick={() => handleDeactivateUser(user.id)}
                                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                >
                                  <Ban size={14} />
                                  Deactivate
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleActivateUser(user.id)}
                                  className="w-full text-left px-4 py-2 text-sm text-green-400 hover:bg-green-500/10 transition-colors flex items-center gap-2"
                                >
                                  <UserCheck size={14} />
                                  Activate
                                </button>
                              )}
                              <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition-colors flex items-center gap-2">
                                <Eye size={14} />
                                View Details
                              </button>
                              <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition-colors flex items-center gap-2">
                                <Mail size={14} />
                                Send Email
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <UserEditModal
          user={selectedUser}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateUser}
        />
      )}
    </div>
  );
};

// Enhanced Edit Modal Component
interface UserEditModalProps {
  user: UserManagementResponse;
  onClose: () => void;
  onSave: (updates: UserUpdateRequest) => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState<UserUpdateRequest>({
    is_active: user.is_active,
    is_verified: user.is_verified,
    is_subscribed: user.is_subscribed,
    is_admin: user.is_admin,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-cyan-500/20 rounded-2xl p-6 max-w-md w-full mx-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-cyan-400">Edit User</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <XCircle size={20} className="text-gray-400" />
          </button>
        </div>
        
        {/* User Summary */}
        <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
            {user.full_name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="text-white font-medium">{user.full_name || 'Unnamed User'}</p>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${formData.is_active ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                <span className="text-white font-medium">Active Account</span>
              </div>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${formData.is_verified ? 'bg-blue-400' : 'bg-gray-600'}`}></div>
                <span className="text-white font-medium">Email Verified</span>
              </div>
              <input
                type="checkbox"
                checked={formData.is_verified}
                onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })}
                className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${formData.is_subscribed ? 'bg-purple-400' : 'bg-gray-600'}`}></div>
                <span className="text-white font-medium">Premium Subscription</span>
              </div>
              <input
                type="checkbox"
                checked={formData.is_subscribed}
                onChange={(e) => setFormData({ ...formData, is_subscribed: e.target.checked })}
                className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${formData.is_admin ? 'bg-yellow-400' : 'bg-gray-600'}`}></div>
                <span className="text-white font-medium">Administrator Access</span>
              </div>
              <input
                type="checkbox"
                checked={formData.is_admin}
                onChange={(e) => setFormData({ ...formData, is_admin: e.target.checked })}
                className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
              />
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Users;