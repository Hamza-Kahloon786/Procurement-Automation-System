import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { buyerAPI } from '../../services/api';
import { 
  FileText, 
  Package, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Eye,
  ShoppingBag,
  Target,
  Zap,
  TrendingDown,
  Activity,
  ArrowRight,
  Calendar,
  DollarSign
} from 'lucide-react';
import { FadeIn, SlideUp, ScaleIn, CountUp, ScrollReveal } from '../common/AnimatedComponents';
import { cardAnimations, buttonAnimations } from '../../utils/animations';

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const requestsResponse = await buyerAPI.getMyRequests();
      const requests = requestsResponse.data;
      
      setRecentRequests(requests.slice(0, 5));
      
      const totalRequests = requests.length;
      const openRequests = requests.filter(r => r.status === 'open').length;
      const closedRequests = requests.filter(r => r.status === 'closed').length;
      const totalQuotations = requests.reduce((sum, r) => sum + (r.quotations_received || 0), 0);
      
      setStats({
        total_requests: totalRequests,
        open_requests: openRequests,
        closed_requests: closedRequests,
        total_quotations: totalQuotations
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'closed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'awarded': return 'bg-primary-500/20 text-primary-400 border-primary-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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
              <p className="text-xl font-semibold text-gray-900 mb-2">Loading Dashboard</p>
              <p className="text-gray-500">Fetching your procurement data...</p>
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
          <div className={`max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-red-200`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center animate-bounce">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <p className="font-bold text-xl text-red-900">Error Loading Dashboard</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
            <button 
              onClick={fetchDashboardData} 
              className={`w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold ${buttonAnimations.primary}`}
            >
              Retry Loading
            </button>
          </div>
        </ScaleIn>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Requests',
      value: stats?.total_requests || 0,
      icon: FileText,
      iconBg: 'from-primary-500 to-primary-700',
      borderColor: 'border-primary-200',
      bgHover: 'hover:bg-primary-50/50',
      textColor: 'text-primary-600',
      description: 'All procurement requests',
      delay: 0
    },
    {
      title: 'Open Requests',
      value: stats?.open_requests || 0,
      icon: Activity,
      iconBg: 'from-green-500 to-green-600',
      borderColor: 'border-green-200',
      bgHover: 'hover:bg-green-50/50',
      textColor: 'text-green-600',
      description: 'Awaiting quotations',
      delay: 100
    },
    {
      title: 'Total Quotations',
      value: stats?.total_quotations || 0,
      icon: Package,
      iconBg: 'from-gray-600 to-gray-800',
      borderColor: 'border-gray-200',
      bgHover: 'hover:bg-gray-50',
      textColor: 'text-gray-700',
      description: 'Received from vendors',
      delay: 200
    },
    {
      title: 'Completed',
      value: stats?.closed_requests || 0,
      icon: CheckCircle,
      iconBg: 'from-primary-600 to-primary-800',
      borderColor: 'border-primary-200',
      bgHover: 'hover:bg-primary-50/50',
      textColor: 'text-primary-600',
      description: 'Successfully closed',
      delay: 300
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-12">
          <SlideUp>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary-600/20 rounded-xl blur-lg"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900">
                      Buyer{' '}
                      <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                        Dashboard
                      </span>
                    </h1>
                  </div>
                </div>
                <p className="text-lg text-gray-600 sm:ml-15">
                  Manage your procurement requests and quotations
                </p>
              </div>
              
              <button
                onClick={() => navigate('/buyer/create-request')}
                className={`px-4 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold text-sm sm:text-lg ${buttonAnimations.primary} flex items-center gap-2 sm:gap-3 shadow-xl shadow-primary-600/30`}
              >
                <Plus className="h-6 w-6" />
                Create New Request
              </button>
            </div>
          </SlideUp>
        </div>

        {/* Stats Cards - Clean Light Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <ScaleIn key={index} delay={stat.delay}>
                <div 
                  className={`group relative bg-white rounded-2xl p-6 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border ${stat.borderColor} ${stat.bgHover} cursor-pointer`}
                  onClick={() => {
                    if (stat.title.includes('Request')) navigate('/buyer/requests');
                  }}
                >
                  {/* Top accent bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.iconBg}`}></div>

                  <div className="relative z-10">
                    {/* Icon and Title - Side by Side */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${stat.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg flex-shrink-0`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
                        {stat.title}
                      </h3>
                    </div>

                    <div className={`text-2xl sm:text-4xl font-black ${stat.textColor} mb-2`}>
                      <CountUp end={stat.value} duration={2000} />
                    </div>

                    <p className="text-gray-500 text-sm">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </ScaleIn>
            );
          })}
        </div>

        {/* Recent Requests */}
        <ScrollReveal animation="slideUp">
          <div className={`bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-10 ${cardAnimations.subtle}`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-600/20 blur-2xl rounded-2xl"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Recent Requests</h2>
                  <p className="text-gray-500 text-sm">Your latest procurement activities</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/buyer/requests')}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-primary-50 text-primary-600 rounded-xl font-semibold transition-all duration-300 hover:scale-105 group"
              >
                View All
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>

            {recentRequests.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No requests yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Create your first procurement request to start receiving quotations from vendors
                </p>
                <button
                  onClick={() => navigate('/buyer/create-request')}
                  className={`px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold ${buttonAnimations.primary} inline-flex items-center gap-3`}
                >
                  <Plus className="h-5 w-5" />
                  Create Your First Request
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentRequests.map((request, index) => (
                  <div
                    key={request.id}
                    className={`group p-6 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-100 rounded-2xl hover:border-primary-300 hover:shadow-xl transition-all duration-300 cursor-pointer ${cardAnimations.subtle}`}
                    onClick={() => navigate(`/buyer/quotations/${request.id}`)}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                            {request.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(request.status)}`}>
                            {request.status.toUpperCase()}
                          </span>
                        </div>
                        
                        {request.description && (
                          <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                            {request.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Package className="h-4 w-4 text-primary-600" />
                            <span className="font-semibold">{request.quotations_received || 0}</span>
                            <span className="text-gray-500">quotations</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="h-4 w-4 text-primary-600" />
                            <span className="text-gray-500">Deadline:</span>
                            <span className="font-semibold">{new Date(request.deadline).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/buyer/quotations/${request.id}`);
                        }}
                        className={`px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold ${buttonAnimations.primary} flex items-center gap-2`}
                      >
                        <Eye className="h-5 w-5" />
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Quick Actions - Clean Card Design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScrollReveal animation="scale" delay={0}>
            <div
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 cursor-pointer overflow-hidden border border-primary-200 hover:border-primary-400 transition-all duration-300"
              onClick={() => navigate('/buyer/create-request')}
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-700"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Create Request</h3>
                <p className="text-gray-600 leading-relaxed">
                  Start a new procurement request and receive competitive quotations
                </p>
                <div className="mt-6 flex items-center gap-2 text-primary-600 font-semibold group-hover:translate-x-1 transition-transform duration-300">
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="scale" delay={100}>
            <div
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 cursor-pointer overflow-hidden border border-gray-200 hover:border-gray-400 transition-all duration-300"
              onClick={() => navigate('/buyer/requests')}
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-600 to-gray-800"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">All Requests</h3>
                <p className="text-gray-600 leading-relaxed">
                  Browse and manage all your procurement requests in one place
                </p>
                <div className="mt-6 flex items-center gap-2 text-gray-700 font-semibold group-hover:translate-x-1 transition-transform duration-300">
                  View requests
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="scale" delay={200}>
            <div
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 cursor-pointer overflow-hidden border border-primary-200 hover:border-primary-400 transition-all duration-300"
              onClick={() => navigate('/buyer/requests')}
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 to-primary-800"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Compare Quotes</h3>
                <p className="text-gray-600 leading-relaxed">
                  Review and compare quotations using AI-powered insights
                </p>
                <div className="mt-6 flex items-center gap-2 text-primary-600 font-semibold group-hover:translate-x-1 transition-transform duration-300">
                  Start comparing
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
