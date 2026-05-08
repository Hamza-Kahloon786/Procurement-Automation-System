import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Users, 
  RefreshCw,
  Shield,
  ShoppingBag,
  Briefcase,
  Search,
  Filter,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Building2,
  Calendar,
  Crown,
  AlertCircle,
  Eye,
  MoreVertical,
  Clock
} from 'lucide-react';
import { FadeIn, SlideUp, ScaleIn, ScrollReveal } from '../common/AnimatedComponents';
import { cardAnimations, buttonAnimations } from '../../utils/animations';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated. Please login first.');
      }
      
      const response = await adminAPI.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      
      let errorMessage = 'Failed to fetch users';
      if (error.message === 'Network Error') {
        errorMessage = 'Cannot connect to server. Please ensure the backend is running';
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId) => {
    try {
      await adminAPI.verifyUser(userId);
      fetchUsers();
    } catch (error) {
      alert('Failed to verify user');
    }
  };

  const handleUnverify = async (userId) => {
    try {
      await adminAPI.unverifyUser(userId);
      fetchUsers();
    } catch (error) {
      alert('Failed to unverify user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      await adminAPI.deleteUser(userId);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'buyer' && user.role === 'buyer') ||
      (filter === 'vendor' && user.role === 'vendor') ||
      (filter === 'pending' && user.role === 'vendor' && !user.verified);
    
    if (!searchTerm.trim()) {
      return matchesFilter;
    }
    
    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch = 
      (user.name?.toLowerCase() || '').includes(searchLower) ||
      (user.email?.toLowerCase() || '').includes(searchLower) ||
      (user.company?.toLowerCase() || '').includes(searchLower) ||
      (user.phone?.toLowerCase() || '').includes(searchLower);
    
    return matchesFilter && matchesSearch;
  });

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return Crown;
      case 'buyer': return ShoppingBag;
      case 'vendor': return Briefcase;
      default: return Users;
    }
  };

  const getRoleGradient = (role) => {
    switch (role) {
      case 'admin': return 'from-purple-500 to-purple-700';
      case 'buyer': return 'from-primary-500 to-primary-700';
      case 'vendor': return 'from-gray-700 to-gray-900';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-6">
        <FadeIn>
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-primary-600/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative w-20 h-20 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <SlideUp delay={200}>
              <p className="text-xl font-semibold text-gray-900 mb-2">Loading Users</p>
              <p className="text-gray-500">Fetching user database...</p>
            </SlideUp>
          </div>
        </FadeIn>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-6">
        <ScaleIn>
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-red-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center animate-bounce">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <p className="font-bold text-xl text-red-900">Error Loading Users</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
            <button 
              onClick={fetchUsers} 
              className={`w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold ${buttonAnimations.primary}`}
            >
              Retry Loading
            </button>
          </div>
        </ScaleIn>
      </div>
    );
  }

  const filterCounts = {
    all: users.length,
    buyer: users.filter(u => u.role === 'buyer').length,
    vendor: users.filter(u => u.role === 'vendor').length,
    pending: users.filter(u => u.role === 'vendor' && !u.verified).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-10">
          <SlideUp>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-600/20 rounded-xl blur-lg"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-black text-gray-900">
                    User{' '}
                    <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                      Management
                    </span>
                  </h1>
                  <p className="text-gray-600 mt-1">Manage platform users and permissions</p>
                </div>
              </div>
              
              <button
                onClick={fetchUsers}
                className={`px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-primary-600 hover:text-primary-600 transition-all duration-300 flex items-center gap-2 ${buttonAnimations.subtle}`}
                title="Refresh"
              >
                <RefreshCw className="h-5 w-5" />
                Refresh
              </button>
            </div>
          </SlideUp>
        </div>

        {/* Search and Filters */}
        <SlideUp delay={100}>
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors duration-300" />
                  <input
                    type="text"
                    placeholder="Search by name, email, company, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 hover:border-primary-300"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      title="Clear search"
                    >
                      <XCircle className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: 'all', label: 'All Users', icon: Users },
                  { key: 'buyer', label: 'Buyers', icon: ShoppingBag },
                  { key: 'vendor', label: 'Vendors', icon: Briefcase },
                  { key: 'pending', label: 'Pending', icon: Clock }
                ].map((filterBtn) => {
                  const Icon = filterBtn.icon;
                  return (
                    <button
                      key={filterBtn.key}
                      onClick={() => setFilter(filterBtn.key)}
                      className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                        filter === filterBtn.key
                          ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-600/30 scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {filterBtn.label}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        filter === filterBtn.key ? 'bg-white/20' : 'bg-gray-200'
                      }`}>
                        {filterCounts[filterBtn.key]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </SlideUp>

        {/* User Cards Grid */}
        {filteredUsers.length === 0 ? (
          <ScaleIn delay={200}>
            <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No users found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'Try adjusting your search or filters' : 'No users match the selected filter'}
              </p>
            </div>
          </ScaleIn>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user, index) => {
              const RoleIcon = getRoleIcon(user.role);
              return (
                <ScaleIn key={user.id} delay={index * 50}>
                  <div className={`group relative bg-white rounded-xl shadow-md hover:shadow-xl p-4 border border-gray-200 hover:border-primary-300 transition-all duration-300 overflow-hidden ${cardAnimations.glow}`}>
                    {/* Top accent bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getRoleGradient(user.role)}`}></div>
                    
                    {/* User Header - Compact */}
                    <div className="flex items-start justify-between mb-3 pt-1">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-12 h-12 bg-gradient-to-br ${getRoleGradient(user.role)} rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300 flex-shrink-0`}>
                          <RoleIcon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300 truncate">
                              {user.name}
                            </h3>
                            {user.verified ? (
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-600 flex-shrink-0 animate-pulse" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                              user.role === 'buyer' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              <RoleIcon className="h-3 w-3" />
                              {user.role.toUpperCase()}
                            </div>
                            {user.verified ? (
                              <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-md">Verified</span>
                            ) : (
                              <span className="text-xs font-semibold text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-md">Pending</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* User Info - Compact Grid */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Mail className="h-3.5 w-3.5 text-primary-600 flex-shrink-0" />
                        <span className="truncate text-sm">{user.email}</span>
                      </div>
                      {user.company && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Building2 className="h-3.5 w-3.5 text-primary-600 flex-shrink-0" />
                          <span className="truncate text-sm">{user.company}</span>
                        </div>
                      )}
                      {user.phone && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Phone className="h-3.5 w-3.5 text-primary-600 flex-shrink-0" />
                          <span className="text-sm">{user.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                        <span className="text-sm">Joined {new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Actions - Compact */}
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      {!user.verified && user.role === 'vendor' && (
                        <button
                          onClick={() => handleVerify(user.id)}
                          className={`flex-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 ${buttonAnimations.primary}`}
                          title="Verify User"
                        >
                          <UserCheck className="h-3.5 w-3.5" />
                          Verify
                        </button>
                      )}
                      
                      {user.verified && user.role === 'vendor' && (
                        <button
                          onClick={() => handleUnverify(user.id)}
                          className="flex-1 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5"
                          title="Unverify User"
                        >
                          <UserX className="h-3.5 w-3.5" />
                          Unverify
                        </button>
                      )}
                      
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="flex-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5"
                          title="Delete User"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </ScaleIn>
              );
            })}
          </div>
        )}

        {/* Summary Stats */}
        {filteredUsers.length > 0 && (
          <ScrollReveal animation="slideUp">
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: filterCounts.all, icon: Users, color: 'from-primary-600 to-primary-800' },
                { label: 'Buyers', value: filterCounts.buyer, icon: ShoppingBag, color: 'from-green-600 to-green-800' },
                { label: 'Vendors', value: filterCounts.vendor, icon: Briefcase, color: 'from-gray-700 to-gray-900' },
                { label: 'Pending', value: filterCounts.pending, icon: Clock, color: 'from-yellow-600 to-yellow-800' }
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white`}>
                    <Icon className="h-8 w-8 mb-3 opacity-80" />
                    <div className="text-2xl sm:text-4xl font-black mb-1">{stat.value}</div>
                    <div className="text-white/80 text-sm font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
