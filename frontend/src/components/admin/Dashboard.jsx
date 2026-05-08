import React, { useState, useEffect, useRef } from 'react';
import { adminAPI } from '../../services/api';
import { 
  Users, 
  FileText, 
  Package, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Shield,
  Activity,
  Zap,
  Award,
  Target,
  BarChart3
} from 'lucide-react';
import { FadeIn, SlideUp, ScaleIn, CountUp, Float, ScrollReveal } from '../common/AnimatedComponents';
import { cardAnimations, buttonAnimations } from '../../utils/animations';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchStats();
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
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
              <p className="text-gray-500">Fetching your analytics...</p>
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
          <div className={`max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-red-200 ${cardAnimations.glow}`}>
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
              onClick={fetchStats} 
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
      title: 'Total Buyers',
      value: stats?.users?.total_buyers || 0,
      icon: Users,
      iconBg: 'from-primary-500 to-primary-700',
      borderColor: 'border-primary-200',
      bgHover: 'hover:bg-primary-50/50',
      textColor: 'text-primary-600',
      description: 'Procurement Teams',
      delay: 0
    },
    {
      title: 'Total Vendors',
      value: stats?.users?.total_vendors || 0,
      icon: Shield,
      iconBg: 'from-gray-700 to-gray-900',
      borderColor: 'border-gray-200',
      bgHover: 'hover:bg-gray-50',
      textColor: 'text-gray-700',
      subtitle: `${stats?.users?.pending_vendors || 0} pending verification`,
      description: 'Verified suppliers',
      delay: 100
    },
    {
      title: 'Total Requests',
      value: stats?.requests?.total || 0,
      icon: FileText,
      iconBg: 'from-primary-600 to-primary-800',
      borderColor: 'border-primary-200',
      bgHover: 'hover:bg-primary-50/50',
      textColor: 'text-primary-600',
      subtitle: `${stats?.requests?.open || 0} open`,
      description: 'Procurement requests',
      delay: 200
    },
    {
      title: 'Total Quotations',
      value: stats?.quotations?.total || 0,
      icon: Package,
      iconBg: 'from-gray-600 to-gray-800',
      borderColor: 'border-gray-200',
      bgHover: 'hover:bg-gray-50',
      textColor: 'text-gray-700',
      subtitle: `${stats?.quotations?.accepted || 0} accepted`,
      description: 'Vendor proposals',
      delay: 300
    },
  ];

  const totalUsers = (stats?.users?.total_buyers || 0) + (stats?.users?.total_vendors || 0);
  const acceptanceRate = stats?.quotations?.total
    ? Math.round((stats.quotations.accepted / stats.quotations.total) * 100)
    : 0;
  const openRate = stats?.requests?.total
    ? Math.round((stats.requests.open / stats.requests.total) * 100)
    : 0;
  const awardedCount = stats?.requests?.awarded || 0;

  const performanceMetrics = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Activity,
      color: 'from-green-500 to-green-700',
      description: 'Buyers & Vendors'
    },
    {
      title: 'Open Rate',
      value: `${openRate}%`,
      icon: Zap,
      color: 'from-yellow-500 to-yellow-700',
      description: 'Requests currently open'
    },
    {
      title: 'Acceptance Rate',
      value: `${acceptanceRate}%`,
      icon: Award,
      color: 'from-blue-500 to-blue-700',
      description: 'Quotations accepted'
    },
    {
      title: 'Awarded Requests',
      value: awardedCount,
      icon: Target,
      color: 'from-purple-500 to-purple-700',
      description: 'Successfully completed'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-12">
          <SlideUp>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary-600/20 rounded-xl blur-lg"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900">
                      Admin{' '}
                      <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                        Dashboard
                      </span>
                    </h1>
                  </div>
                </div>
                <p className="text-lg text-gray-600 sm:ml-15">
                  Monitor and manage your procurement platform
                </p>
              </div>
            </div>
          </SlideUp>
        </div>

        {/* Main Stats Cards - Clean Light Design with Red Accents */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <ScaleIn key={index} delay={stat.delay}>
                <div 
                  className={`group relative bg-white rounded-2xl p-6 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border ${stat.borderColor} ${stat.bgHover}`}
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

                    {/* Value */}
                    <div className={`text-2xl sm:text-4xl font-black ${stat.textColor} mb-2`}>
                      <CountUp end={stat.value} duration={2000} />
                    </div>

                    {/* Description */}
                    <p className="text-gray-500 text-sm">
                      {stat.subtitle || stat.description}
                    </p>
                  </div>
                </div>
              </ScaleIn>
            );
          })}
        </div>

        {/* Performance Metrics */}
        <ScrollReveal animation="slideUp">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Performance Metrics</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {performanceMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div 
                    key={index}
                    className={`bg-white rounded-2xl p-6 border border-gray-100 ${cardAnimations.subtle} group`}
                  >
                    {/* Icon and Title - Side by Side */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{metric.title}</p>
                    </div>
                    <div className="text-3xl font-black text-gray-900 mb-1">{metric.value}</div>
                    <p className="text-xs text-gray-500">{metric.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Detailed Stats - Enhanced Design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quotation Status */}
          <ScrollReveal animation="slideLeft">
            <div className={`bg-white rounded-2xl shadow-xl p-8 border border-gray-100 ${cardAnimations.glow}`}>
              <div className="flex items-center gap-4 mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-2xl"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Quotation Status</h2>
                  <p className="text-gray-500 text-sm">Vendor proposal analytics</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className={`flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 ${cardAnimations.subtle} group cursor-pointer`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="text-gray-900 font-bold block">Submitted</span>
                      <span className="text-gray-600 text-sm">Pending review</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-4xl font-black text-yellow-600">
                      <CountUp end={stats?.quotations?.submitted || 0} duration={2000} />
                    </div>
                  </div>
                </div>
                
                <div className={`flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 ${cardAnimations.subtle} group cursor-pointer`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="text-gray-900 font-bold block">Accepted</span>
                      <span className="text-gray-600 text-sm">Successfully closed</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-4xl font-black text-green-600">
                      <CountUp end={stats?.quotations?.accepted || 0} duration={2000} />
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 mt-6 border-t-2 border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total Quotations</span>
                    <span className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      <CountUp end={stats?.quotations?.total || 0} duration={2000} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Request Status */}
          <ScrollReveal animation="slideRight">
            <div className={`bg-white rounded-2xl shadow-xl p-8 border border-gray-100 ${cardAnimations.glow}`}>
              <div className="flex items-center gap-4 mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-600/20 blur-2xl rounded-2xl"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Request Status</h2>
                  <p className="text-gray-500 text-sm">Procurement overview</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className={`flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 ${cardAnimations.subtle} group cursor-pointer`}>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                      <div className="relative w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-900 font-bold block">Open Requests</span>
                      <span className="text-gray-600 text-sm">Currently active</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-4xl font-black text-green-600">
                      <CountUp end={stats?.requests?.open || 0} duration={2000} />
                    </div>
                  </div>
                </div>
                
                <div className={`flex justify-between items-center p-4 rounded-xl bg-gray-50 border border-gray-200 ${cardAnimations.subtle} group cursor-pointer`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="text-gray-900 font-bold block">Closed Requests</span>
                      <span className="text-gray-600 text-sm">Completed deals</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-4xl font-black text-gray-600">
                      <CountUp end={(stats?.requests?.total || 0) - (stats?.requests?.open || 0)} duration={2000} />
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 mt-6 border-t-2 border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total Requests</span>
                    <span className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                      <CountUp end={stats?.requests?.total || 0} duration={2000} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
