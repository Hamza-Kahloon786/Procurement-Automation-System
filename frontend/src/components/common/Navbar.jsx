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
  AlertCircle,
  Menu
} from 'lucide-react';
import { logout, getUser, getUserRole } from '../../utils/auth';
import { buttonAnimations } from '../../utils/animations';
import { useNotifications } from '../../context/NotificationContext';

const Navbar = ({ onMobileMenuToggle }) => {
  const navigate = useNavigate();
  const user = getUser();
  const role = getUserRole();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Search functionality: "${searchQuery}"\n\nThis would search across requests, quotations, and users based on your role.`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowSearch(false);
    };
    if (showSearch) document.addEventListener('keydown', handleKeyDown);
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
      <div className="max-w-full mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Left: Mobile menu + Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Hamburger - triggers sidebar */}
            {onMobileMenuToggle && (
              <button
                onClick={onMobileMenuToggle}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5 text-gray-700" />
              </button>
            )}

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-600/30 rounded-xl lg:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl lg:rounded-2xl flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-lg sm:text-xl lg:text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent group-hover:from-primary-600 group-hover:to-primary-800 transition-all duration-300">
                  ProcureHub
                </span>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Procurement Portal</p>
              </div>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-4">
            {user && (
              <>
                {/* Search Button - hidden on very small screens */}
                <button 
                  onClick={() => setShowSearch(true)}
                  className="hidden sm:flex p-2 sm:p-3 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-110 group relative"
                >
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 group-hover:text-primary-600 transition-colors duration-300" />
                </button>

                {/* Notifications */}
                <div className="relative navbar-dropdown">
                  <button 
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserMenu(false);
                    }}
                    className="relative p-2 sm:p-3 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-110 group"
                  >
                    <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 group-hover:text-primary-600 transition-colors duration-300" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 sm:top-2 sm:right-2 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-primary-500 to-primary-700 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown - responsive width */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-scaleIn origin-top-right z-50 -right-2 sm:right-0">
                      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-3 sm:p-4 text-white">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-base sm:text-lg">Notifications</h3>
                          <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                              <button
                                onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
                                className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs font-semibold transition-colors"
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

                      <div className="max-h-72 sm:max-h-80 overflow-y-auto">
                        {notificationsList.length > 0 ? (
                          notificationsList.slice(0, 5).map((notification) => {
                            const Icon = getNotificationIcon(notification.type);
                            return (
                              <div 
                                key={notification.id}
                                onClick={() => { if (!notification.read) markAsRead(notification.id); }}
                                className={`p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? 'bg-primary-50/50' : ''}`}
                              >
                                <div className="flex gap-2.5 sm:gap-3">
                                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                    notification.type === 'alert' ? 'bg-yellow-100' : 'bg-primary-100'
                                  }`}>
                                    <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${notification.type === 'alert' ? 'text-yellow-600' : 'text-primary-600'}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 text-xs sm:text-sm">{notification.title}</p>
                                    <p className="text-gray-500 text-[11px] sm:text-xs mt-0.5 line-clamp-2">{notification.message}</p>
                                    <p className="text-gray-400 text-[10px] sm:text-xs mt-1">{notification.time}</p>
                                  </div>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2"></div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-6 sm:p-8 text-center text-gray-500">
                            <Bell className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 text-gray-300" />
                            <p className="font-medium text-sm sm:text-base">No notifications</p>
                            <p className="text-xs sm:text-sm">You're all caught up!</p>
                          </div>
                        )}
                      </div>

                      <div className="p-2 sm:p-3 bg-gray-50 border-t border-gray-100">
                        <button 
                          onClick={() => { setShowNotifications(false); navigate(`${getBasePath()}/notifications`); }}
                          className="w-full py-2 text-primary-600 hover:text-primary-700 font-semibold text-xs sm:text-sm transition-colors"
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
                    onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
                    className={`flex items-center gap-1.5 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl transition-all duration-300 border border-gray-200 hover:border-primary-300 ${buttonAnimations.subtle}`}
                  >
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${getRoleBadgeColor(user.role)} rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold shadow-lg`}>
                      <RoleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="text-left hidden md:block">
                      <p className="text-sm font-bold text-gray-900 truncate max-w-[120px]">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 text-gray-600 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-scaleIn origin-top-right z-50">
                      <div className={`bg-gradient-to-br ${getRoleBadgeColor(user.role)} p-4 text-white`}>
                        <p className="font-bold text-base sm:text-lg truncate">{user.name}</p>
                        <p className="text-sm opacity-90 truncate">{user.email}</p>
                        <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm">
                          <RoleIcon className="h-3 w-3" />
                          {user.role.toUpperCase()}
                        </div>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={() => { setShowUserMenu(false); navigate(`${getBasePath()}/profile`); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300 group"
                        >
                          <User className="h-5 w-5 text-gray-500 group-hover:text-primary-600 transition-colors duration-300" />
                          <span className="font-medium">My Profile</span>
                        </button>

                        <button
                          onClick={() => { setShowUserMenu(false); navigate(`${getBasePath()}/settings`); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300 group"
                        >
                          <Settings className="h-5 w-5 text-gray-500 group-hover:text-primary-600 transition-colors duration-300" />
                          <span className="font-medium">Settings</span>
                        </button>

                        <div className="border-t border-gray-100 my-2"></div>

                        <button
                          onClick={() => { setShowUserMenu(false); handleLogout(); }}
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
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-20 px-3 sm:px-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSearch(false)}
          ></div>
          
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
            <form onSubmit={handleSearch}>
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-b border-gray-100">
                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search requests, quotations..."
                  className="flex-1 text-base sm:text-lg text-gray-900 placeholder-gray-400 outline-none min-w-0"
                />
                <button
                  type="button"
                  onClick={() => setShowSearch(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </form>

            <div className="p-3 sm:p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2 sm:mb-3">Quick Actions</p>
              <div className="space-y-2">
                <button 
                  onClick={() => { setShowSearch(false); navigate(`${getBasePath()}/requests`); }}
                  className="w-full flex items-center gap-3 p-2.5 sm:p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Browse Requests</p>
                    <p className="text-xs sm:text-sm text-gray-500">View all procurement requests</p>
                  </div>
                </button>
                <button 
                  onClick={() => { setShowSearch(false); navigate(`${getBasePath()}/quotations`); }}
                  className="w-full flex items-center gap-3 p-2.5 sm:p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">My Quotations</p>
                    <p className="text-xs sm:text-sm text-gray-500">Check your submitted quotations</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="px-3 sm:px-4 pb-3 sm:pb-4">
              <p className="text-xs text-gray-400">
                Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono text-[10px]">Enter</kbd> to search · <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono text-[10px]">Esc</kbd> to close
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;