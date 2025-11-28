// src/components/Layout/AdminHeader.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X,
  BarChart3, 
  User, 
  LogOut, 
  Settings,
  Shield,
  ChevronDown,
  Zap,
  Lock,
  Activity,
  Database,
  Server,
  Bell,
  Search
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserResponse } from '../../../types';

const AdminHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isHoveringUser, setIsHoveringUser] = useState(false);
  const [notifications, setNotifications] = useState(3); // Mock notification count
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Enhanced scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 5);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enhanced click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setIsMobileMenuOpen(false);
      }
      
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Keyboard navigation
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      navigate('/admin/login');
    } catch (error) {
      console.error('Admin logout failed:', error);
    }
  };

  const adminNavigation = [
    { 
      name: 'Dashboard', 
      href: '/admin/dashboard', 
      icon: BarChart3,
      description: 'System overview'
    },
    { 
      name: 'Users', 
      href: '/admin/users', 
      icon: User,
      description: 'Manage users'
    },
    { 
      name: 'Systems', 
      href: '/admin/systems', 
      icon: Server,
      description: 'Server status'
    },
    { 
      name: 'Security', 
      href: '/admin/security', 
      icon: Shield,
      description: 'Security logs'
    }
  ];

  const adminMenuItems = [
    { name: 'Admin Dashboard', href: '/admin/dashboard', icon: BarChart3, description: 'System overview' },
    { name: 'System Settings', href: '/admin/settings', icon: Settings, description: 'Configure system' },
    { name: 'Security Center', href: '/admin/security', icon: Shield, description: 'Security & logs' },
    { name: 'Database Management', href: '/admin/database', icon: Database, description: 'Database operations' },
  ];

  const getAdminLevel = (user: UserResponse | null): string => {
    if (!user) return 'Administrator';
    if (user.is_admin) return 'Super Admin';
    if (user.is_admin) return 'System Admin';
    return 'Administrator';
  };

  const getAdminColor = (user: UserResponse | null): string => {
    if (!user) return 'from-blue-600 to-indigo-600';
    if (user.is_admin) return 'from-purple-600 to-purple-700';
    if (user.is_admin) return 'from-blue-600 to-indigo-600';
    return 'from-blue-600 to-indigo-600';
  };

  const getAdminIcon = (user: UserResponse | null) => {
    if (!user) return Shield;
    if (user.is_admin) return Zap;
    if (user.is_admin) return Shield;
    return Shield;
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-gray-950/98 backdrop-blur-2xl border-b border-blue-500/30 shadow-2xl shadow-blue-500/20'
            : 'bg-gray-950/95 backdrop-blur-xl border-b border-blue-500/20'
        }`}
      >
        {/* Enhanced security gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-purple-500/10 pointer-events-none" />
        
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center h-16">
            {/* Admin Logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex-shrink-0 flex items-center relative z-10"
            >
              <Link 
                to="/admin/dashboard" 
                className="flex items-center space-x-3 group"
                aria-label="Admin Portal"
              >
                <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:shadow-blue-500/70 transition-all duration-300 backdrop-blur-xl border border-blue-400/30 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  <Shield className="w-5 h-5 text-white relative z-10 drop-shadow-lg" />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent"
                    initial={{ y: '-100%' }}
                    whileHover={{ y: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-lg tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text">
                    ADMIN
                  </span>
                  <span className="text-blue-400 text-xs font-medium tracking-wider flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Control Panel
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 relative z-10">
              {adminNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <motion.div 
                    key={item.name} 
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative"
                  >
                    <Link
                      to={item.href}
                      className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 backdrop-blur-xl group overflow-hidden ${
                        isActive
                          ? 'text-white bg-gradient-to-r from-blue-500/20 via-blue-600/20 to-indigo-600/20 border border-blue-400/40 shadow-lg shadow-blue-500/20'
                          : 'text-gray-300 hover:text-white hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20'
                      }`}
                    >
                      <motion.div 
                        className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent ${
                          isActive ? 'opacity-100' : 'opacity-0'
                        }`}
                        whileHover={{ x: ['0%', '200%'] }}
                        transition={{ duration: 0.8 }}
                      />
                      <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
                      <span className="relative z-10">{item.name}</span>
                      
                      {isActive && (
                        <motion.div
                          layoutId="adminActiveIndicator"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Enhanced Admin Controls */}
            <div className="hidden lg:flex items-center space-x-3 relative z-10">
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-2 rounded-lg bg-gray-800/50 border border-blue-500/20 text-gray-300 hover:text-white hover:border-blue-400/40 transition-all duration-300 backdrop-blur-xl shadow-lg shadow-blue-500/10"
                title="Search Admin Panel"
              >
                <Search className="w-4 h-4" />
              </motion.button>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative p-2 rounded-lg bg-gray-800/50 border border-blue-500/20 text-gray-300 hover:text-white hover:border-blue-400/40 transition-all duration-300 backdrop-blur-xl shadow-lg shadow-blue-500/10"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {notifications > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-gray-950"
                  >
                    {notifications}
                  </motion.span>
                )}
              </motion.button>

              {/* System Status */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium backdrop-blur-xl"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>System Online</span>
              </motion.div>

              {/* Enhanced Admin User Menu */}
              {isAuthenticated && (
                <div 
                  className="relative" 
                  ref={userMenuRef}
                  onMouseEnter={() => setIsHoveringUser(true)}
                  onMouseLeave={() => setIsHoveringUser(false)}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-800/50 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 backdrop-blur-xl group shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br ${getAdminColor(user)} rounded-lg flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-lg relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                      <Shield className="w-4 h-4 text-white relative z-10" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-white text-sm font-semibold">
                        {user?.full_name?.split(' ')[0] || user?.email.split('@')[0]}
                      </span>
                      <span className="text-blue-400 text-xs font-light flex items-center gap-1">
                        {getAdminLevel(user)}
                        {React.createElement(getAdminIcon(user), { className: "w-3 h-3" })}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-blue-400" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {(isUserMenuOpen || isHoveringUser) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-80 bg-gray-900/95 backdrop-blur-2xl border border-blue-500/20 rounded-xl shadow-2xl shadow-blue-500/20 py-2 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 pointer-events-none" />
                        
                        {/* Admin Info Section */}
                        <div className="px-4 py-3 border-b border-blue-500/20 relative">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-gradient-to-br ${getAdminColor(user)} rounded-lg flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-lg relative overflow-hidden`}>
                              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                              <Shield className="w-5 h-5 text-white relative z-10" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-semibold truncate">
                                {user?.full_name || user?.email.split('@')[0]}
                              </p>
                              <p className="text-blue-400 text-xs font-medium flex items-center gap-1">
                                {getAdminLevel(user)}
                                {React.createElement(getAdminIcon(user), { className: "w-3 h-3" })}
                              </p>
                              <p className="text-gray-400 text-xs truncate mt-0.5">
                                {user?.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Admin Menu Items */}
                        <div className="py-2">
                          {adminMenuItems.map((item, index) => {
                            const Icon = item.icon;
                            return (
                              <motion.div
                                key={item.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <Link
                                  to={item.href}
                                  onClick={() => setIsUserMenuOpen(false)}
                                  className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-blue-500/10 transition-all duration-200 group"
                                >
                                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-all">
                                    <Icon className="w-4 h-4 text-blue-400" />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-medium text-sm">{item.name}</span>
                                    <span className="text-gray-400 text-xs">{item.description}</span>
                                  </div>
                                </Link>
                              </motion.div>
                            );
                          })}
                        </div>
                        
                        {/* Logout Section */}
                        <div className="border-t border-blue-500/20 pt-2">
                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            onClick={handleLogout}
                            disabled={isLoading}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50 group"
                          >
                            <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                              <LogOut className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm text-left">
                                {isLoading ? 'Securing...' : 'Secure Logout'}
                              </span>
                              <span className="text-red-400/70 text-xs">End admin session</span>
                            </div>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Enhanced Mobile menu button */}
            <div className="lg:hidden flex items-center gap-2 relative z-10" ref={mobileMenuRef}>
              {/* System Status Mobile */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span>Online</span>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg bg-gray-800/50 border border-blue-500/20 text-gray-300 hover:text-white hover:border-blue-400/40 transition-all duration-300 backdrop-blur-xl shadow-lg shadow-blue-500/10"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle admin menu"
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </motion.div>
              </motion.button>

              {/* Enhanced Mobile Dropdown Menu */}
              <AnimatePresence>
                {isMobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-2xl border border-blue-500/20 rounded-xl shadow-2xl shadow-blue-500/20 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 pointer-events-none" />
                    
                    {/* Admin Navigation Items */}
                    <div className="py-2">
                      {adminNavigation.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;
                        return (
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Link
                              to={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-blue-500/10 transition-all duration-200 group ${
                                isActive ? 'bg-blue-500/10 text-white' : ''
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                isActive 
                                  ? 'bg-blue-500/20 text-blue-400' 
                                  : 'bg-blue-500/10 group-hover:bg-blue-500/20 text-blue-400/70'
                              }`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-sm">{item.name}</span>
                                <span className="text-gray-400 text-xs">{item.description}</span>
                              </div>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Admin Auth Section */}
                    <div className="border-t border-blue-500/20 pt-2">
                      {isAuthenticated ? (
                        <>
                          {/* Admin User Info */}
                          <div className="px-4 py-3 border-b border-blue-500/20">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 bg-gradient-to-br ${getAdminColor(user)} rounded-lg flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-lg`}>
                                <Shield className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-semibold truncate">
                                  {user?.full_name?.split(' ')[0] || user?.email.split('@')[0]}
                                </p>
                                <p className="text-blue-400 text-xs flex items-center gap-1">
                                  {getAdminLevel(user)}
                                  {React.createElement(getAdminIcon(user), { className: "w-3 h-3" })}
                                </p>
                              </div>
                            </div>
                          </div>

                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            onClick={handleLogout}
                            disabled={isLoading}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50 group"
                          >
                            <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                              <LogOut className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm text-left">
                                {isLoading ? 'Securing...' : 'Secure Logout'}
                              </span>
                              <span className="text-red-400/70 text-xs">End admin session</span>
                            </div>
                          </motion.button>
                        </>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Link
                            to="/admin/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all duration-200 group"
                          >
                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-all">
                              <Shield className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">Admin Login</span>
                              <span className="text-blue-400/70 text-xs">Access control panel</span>
                            </div>
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Header Spacer */}
      <div className="h-16" />
    </>
  );
};

export default AdminHeader;