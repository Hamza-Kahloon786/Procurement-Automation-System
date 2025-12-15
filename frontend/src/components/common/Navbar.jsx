import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  User, 
  Bell, 
  Search, 
  Settings, 
  ChevronDown,
  Shield,
  Briefcase,
  ShoppingBag,
  Sparkles,
  X,
  FileText,
  Package,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { logout, getUser, getUserRole } from '../../utils/auth';
import { buttonAnimations } from '../../utils/animations';
import { useNotifications } from '../../context/NotificationContext';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUser();
  const role = getUserRole();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  
  // Use notifications from context
  const { notifications: notificationsList, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.navbar-dropdown')) {
        setShowUserMenu(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or filter current view
      alert(`Search functionality: "${searchQuery}"\n\nThis would search across requests, quotations, and users based on your role.`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  // Handle Escape key to close search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowSearch(false);
      }
    };
    if (showSearch) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSearch]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'quotation': return Package;
      case 'request': return FileText;
      case 'success': return CheckCircle;
      case 'pending': return Clock;
      default: return AlertCircle;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getBasePath = () => {
    if (role === 'admin') return '/admin';
    if (role === 'buyer') return '/buyer';
    if (role === 'vendor') return '/vendor';
    return '';
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return Shield;
      case 'buyer': return ShoppingBag;
      case 'vendor': return Briefcase;
      default: return User;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'from-purple-500 to-purple-700';
      case 'buyer': return 'from-primary-500 to-primary-700';
      case 'vendor': return 'from-gray-700 to-gray-900';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const RoleIcon = user ? getRoleIcon(user.role) : User;

  return (
    <nav className="bg-white/80 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-600/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent group-hover:from-primary-600 group-hover:to-primary-800 transition-all duration-300">
                ProcureHub
              </span>
              <p className="text-xs text-gray-500 font-medium">Procurement Portal</p>
            </div>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {user && (
              <>
                {/* Search Button */}
                <button 
                  onClick={() => setShowSearch(true)}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-110 group relative"
                >
                  <Search className="h-5 w-5 text-gray-600 group-hover:text-primary-600 transition-colors duration-300" />
                </button>

                {/* Notifications */}
                <div className="relative navbar-dropdown">
                  <button 
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserMenu(false);
                    }}
                    className="relative p-3 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-110 group"
                  >
                    <Bell className="h-5 w-5 text-gray-600 group-hover:text-primary-600 transition-colors duration-300" />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 w-5 h-5 bg-gradient-to-br from-primary-500 to-primary-700 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-scaleIn origin-top-right z-50">
                      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 text-white">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-lg">Notifications</h3>
                          <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAllAsRead();
                                }}
                                className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs font-semibold transition-colors"
                                title="Mark all as read"
                              >
                                ✓ Read all
                              </button>
                            )}
                            <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-semibold">
                              {unreadCount} new
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="max-h-80 overflow-y-auto">
                        {notificationsList.length > 0 ? (
                          notificationsList.slice(0, 5).map((notification) => {
                            const Icon = getNotificationIcon(notification.type);
                            return (
                              <div 
                                key={notification.id}
                                onClick={() => {
                                  if (!notification.read) {
                                    markAsRead(notification.id);
                                  }
                                }}
                                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? 'bg-primary-50/50' : ''}`}
                              >
                                <div className="flex gap-3">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                    notification.type === 'alert' ? 'bg-yellow-100' : 'bg-primary-100'
                                  }`}>
                                    <Icon className={`h-5 w-5 ${notification.type === 'alert' ? 'text-yellow-600' : 'text-primary-600'}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 text-sm">{notification.title}</p>
                                    <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{notification.message}</p>
                                    <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                                  </div>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2"></div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-8 text-center text-gray-500">
                            <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p className="font-medium">No notifications</p>
                            <p className="text-sm">You're all caught up!</p>
                          </div>
                        )}
                      </div>

                      <div className="p-3 bg-gray-50 border-t border-gray-100">
                        <button 
                          onClick={() => {
                            setShowNotifications(false);
                            navigate(`${getBasePath()}/notifications`);
                          }}
                          className="w-full py-2 text-primary-600 hover:text-primary-700 font-semibold text-sm transition-colors"
                        >
                          View All Notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative navbar-dropdown">
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      setShowNotifications(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-2 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl transition-all duration-300 border border-gray-200 hover:border-primary-300 ${buttonAnimations.subtle}`}
                  >
                    <div className={`w-10 h-10 bg-gradient-to-br ${getRoleBadgeColor(user.role)} rounded-xl flex items-center justify-center text-white font-bold shadow-lg transform hover:rotate-6 transition-transform duration-300`}>
                      <RoleIcon className="h-5 w-5" />
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-sm font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-scaleIn origin-top-right">
                      <div className={`bg-gradient-to-br ${getRoleBadgeColor(user.role)} p-4 text-white`}>
                        <p className="font-bold text-lg">{user.name}</p>
                        <p className="text-sm opacity-90">{user.email}</p>
                        <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm">
                          <RoleIcon className="h-3 w-3" />
                          {user.role.toUpperCase()}
                        </div>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            navigate(`${getBasePath()}/profile`);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300 group"
                        >
                          <User className="h-5 w-5 text-gray-500 group-hover:text-primary-600 transition-colors duration-300" />
                          <span className="font-medium">My Profile</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            navigate(`${getBasePath()}/settings`);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300 group"
                        >
                          <Settings className="h-5 w-5 text-gray-500 group-hover:text-primary-600 transition-colors duration-300" />
                          <span className="font-medium">Settings</span>
                        </button>

                        <div className="border-t border-gray-100 my-2"></div>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 group"
                        >
                          <LogOut className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSearch(false)}
          ></div>
          
          {/* Search Box */}
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
            <form onSubmit={handleSearch}>
              <div className="flex items-center gap-4 p-4 border-b border-gray-100">
                <Search className="h-6 w-6 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search requests, quotations, users..."
                  className="flex-1 text-lg text-gray-900 placeholder-gray-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowSearch(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </form>

            {/* Quick Links */}
            <div className="p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Quick Actions</p>
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    setShowSearch(false);
                    navigate(`${getBasePath()}/requests`);
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Browse Requests</p>
                    <p className="text-sm text-gray-500">View all procurement requests</p>
                  </div>
                </button>
                <button 
                  onClick={() => {
                    setShowSearch(false);
                    navigate(`${getBasePath()}/quotations`);
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">My Quotations</p>
                    <p className="text-sm text-gray-500">Check your submitted quotations</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Search Tips */}
            <div className="px-4 pb-4">
              <p className="text-xs text-gray-400">
                Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">Enter</kbd> to search or <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">Esc</kbd> to close
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// Search Modal Component (kept for reference)
const SearchModal = ({ isOpen, onClose, searchQuery, setSearchQuery, onSearch, inputRef }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Search Box */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
        <form onSubmit={onSearch}>
          <div className="flex items-center gap-4 p-4 border-b border-gray-100">
            <Search className="h-6 w-6 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search requests, quotations, users..."
              className="flex-1 text-lg text-gray-900 placeholder-gray-400 outline-none"
            />
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </form>

        {/* Quick Links */}
        <div className="p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Quick Actions</p>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Browse Requests</p>
                <p className="text-sm text-gray-500">View all procurement requests</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">My Quotations</p>
                <p className="text-sm text-gray-500">Check your submitted quotations</p>
              </div>
            </button>
          </div>
        </div>

        {/* Search Tips */}
        <div className="px-4 pb-4">
          <p className="text-xs text-gray-400">
            Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">Enter</kbd> to search or <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
};

// Main export with search modal
const NavbarWithSearch = () => {
  return <Navbar />;
};

export default Navbar;
