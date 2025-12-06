// src/components/admin/AdminLayout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Megaphone,
  Gift,
  UserCheck,
  Key,
  Activity,
  BarChart3,
  LogOut,
  Menu,
  X,
  Settings,
  Shield,
  Bell,
  Search,
  ChevronDown,
  Zap,
  Database,
  Server,
  FileText,
  Bot,
  LineChart,
  Clock,
  Cpu,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
  section?: string;
}

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location]);

  const navSections: { title: string; items: NavItem[] }[] = [
    {
      title: 'DASHBOARD',
      items: [
        { name: 'Overview', path: '/admin', icon: <LayoutDashboard size={20} /> }
      ]
    },

    {
      title: 'TRADING BOT',
      items: [
        { name: 'Control Center', path: '/admin/trading-bot', icon: <Bot size={20} /> },
        { name: 'Signals', path: '/admin/trading-bot/signals', icon: <Megaphone size={20} />, badge: 3 },
        { name: 'Analysis', path: '/admin/trading-bot/analysis', icon: <Zap size={20} /> },
        { name: 'Auto-Analysis Config', path: '/admin/trading-bot/analysis/auto-config', icon: <Settings size={20} /> },
        { name: 'Analysis History', path: '/admin/trading-bot/analysis/requests', icon: <Clock size={20} /> },
      ]
    },

    {
      title: 'LLM MANAGEMENT',
      items: [
        { name: 'LLM Providers', path: '/admin/llm-providers', icon: <Cpu size={20} /> },
      ]
    },

    {
      title: 'USER MANAGEMENT',
      items: [
        { name: 'Users', path: '/admin/users', icon: <Users size={20} />, badge: 12 },
        { name: 'Trades', path: '/admin/trades', icon: <TrendingUp size={20} /> },
      ]
    },

    {
      title: 'CONTENT & SERVICES',
      items: [
        { name: 'Subscriptions', path: '/admin/subscriptions', icon: <Activity size={20} /> },
      ]
    },
    {
      title: 'PARTNERSHIP',
      items: [
        { name: 'Referrals', path: '/admin/referrals', icon: <Gift size={20} /> },
        { name: 'Affiliates', path: '/admin/affiliates', icon: <UserCheck size={20} />, badge: 5 },
      ]
    },
    {
      title: 'ANALYTICS',
      items: [
        { name: 'Portfolios', path: '/admin/portfolios', icon: <BarChart3 size={20} /> },
        { name: 'Platform Analytics', path: '/admin/analytics', icon: <LineChart size={20} /> },
      ]
    },
    {
      title: 'SECURITY',
      items: [
        { name: 'API Keys', path: '/admin/api-keys', icon: <Key size={20} /> },
        { name: 'Audit Logs', path: '/admin/audit', icon: <FileText size={20} /> },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { name: 'System Health', path: '/admin/system', icon: <Server size={20} /> },
      ]
    },
  ];

  const notifications = [
    { id: 1, title: 'New user registration', description: 'John Doe just signed up', time: '2 min ago', unread: true },
    { id: 2, title: 'API Key Limit', description: 'User approaching rate limit', time: '1 hour ago', unread: true },
    { id: 3, title: 'System Backup', description: 'Daily backup completed', time: '2 hours ago', unread: false },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const unreadNotifications = notifications.filter(n => n.unread).length;

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          ${sidebarOpen ? 'w-80' : 'w-20'} 
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          bg-gray-900/95 backdrop-blur-xl border-r border-gray-800 
          transition-all duration-300 flex flex-col
          shadow-2xl shadow-black/50
        `}
      >
        {/* Logo & Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <Zap className="text-white" size={22} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900"></div>
              </div>
              <div>
                <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  QuantumTrade
                </span>
                <p className="text-xs text-gray-400 font-medium">Admin Console</p>
              </div>
            </div>
          )}
          {!sidebarOpen && (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mx-auto">
              <Zap className="text-white" size={22} />
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-all duration-200 hover:scale-110 hidden lg:block"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-all duration-200 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        {sidebarOpen && (
          <div className="p-4 border-b border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6 custom-scrollbar">
          {navSections.map((section, index) => (
            <div key={section.title}>
              {sidebarOpen && (
                <div className="px-3 mb-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {section.title}
                  </span>
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/admin'}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 shadow-lg shadow-cyan-500/10 border border-cyan-500/20'
                          : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                      }`
                    }
                  >
                    <div className={`transition-transform duration-200 ${sidebarOpen ? '' : 'mx-auto'}`}>
                      {item.icon}
                    </div>
                    {sidebarOpen && (
                      <>
                        <span className="font-medium flex-1">{item.name}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full min-w-[20px] text-center">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    
                    {/* Tooltip for collapsed sidebar */}
                    {!sidebarOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 border border-gray-700 shadow-xl">
                        {item.name}
                        {item.badge && (
                          <span className="ml-1 px-1 bg-red-500 text-white text-xs rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-800">
          {sidebarOpen ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl border border-gray-700/50">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                    {user?.full_name?.charAt(0) || 'A'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user?.full_name || 'Administrator'}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email || 'admin@quantumtrade.com'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all duration-200 hover:scale-[1.02] border border-red-500/20"
              >
                <LogOut size={16} />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
                {user?.full_name?.charAt(0) || 'A'}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
          <div className="h-16 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors lg:hidden"
              >
                <Menu size={20} />
              </button>
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-white">
                  {navSections
                    .flatMap(section => section.items)
                    .find(item => item.path === location.pathname)?.name || 'Dashboard'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors relative"
                >
                  <Bell size={20} />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <h3 className="font-semibold text-white">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-700/50 transition-colors ${
                            notification.unread ? 'bg-blue-500/5' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-white text-sm">
                              {notification.title}
                            </span>
                            <span className="text-xs text-gray-400">{notification.time}</span>
                          </div>
                          <p className="text-gray-400 text-sm mt-1">{notification.description}</p>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-700">
                      <button className="w-full text-center text-cyan-400 hover:text-cyan-300 text-sm font-medium py-2">
                        View All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                    {user?.full_name?.charAt(0) || 'A'}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-white">{user?.full_name}</p>
                    <p className="text-xs text-gray-400">Administrator</p>
                  </div>
                  <ChevronDown size={16} className="text-gray-400 hidden md:block" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="font-semibold text-white">{user?.full_name}</p>
                      <p className="text-sm text-gray-400">{user?.email}</p>
                    </div>
                    <div className="py-2">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition-colors flex items-center gap-3">
                        <Settings size={16} />
                        Account Settings
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition-colors flex items-center gap-3">
                        <Shield size={16} />
                        Security
                      </button>
                    </div>
                    <div className="border-t border-gray-700 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* Global Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4B5563;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;