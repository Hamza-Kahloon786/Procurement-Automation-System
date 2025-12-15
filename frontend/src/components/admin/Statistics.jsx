import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { TrendingUp, Users, FileText, Package, DollarSign, Calendar, Activity, AlertCircle } from 'lucide-react';
import { FadeIn, SlideUp, ScaleIn, CountUp, ScrollReveal } from '../common/AnimatedComponents';
import { cardAnimations, buttonAnimations } from '../../utils/animations';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <FadeIn>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-6"></div>
            <SlideUp delay={200}>
              <p className="text-gray-600 text-lg font-medium">Loading statistics...</p>
              <p className="text-gray-400 text-sm mt-2">Fetching your analytics data</p>
            </SlideUp>
          </div>
        </FadeIn>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <ScaleIn>
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="animate-bounce">
                <AlertCircle className="h-8 w-8" />
              </div>
              <div>
                <p className="font-bold text-lg">Error Loading Statistics</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
            <button 
              onClick={fetchStatistics} 
              className={`px-6 py-2 bg-red-600 text-white rounded-lg font-medium ${buttonAnimations.primary}`}
            >
              Retry
            </button>
          </div>
        </ScaleIn>
      </div>
    );
  }

  // Chart Colors
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  // User Distribution Data for Pie Chart
  const userDistributionData = [
    { name: 'Buyers', value: stats?.users?.total_buyers || 0, color: '#3B82F6' },
    { name: 'Vendors', value: stats?.users?.total_vendors || 0, color: '#10B981' },
    { name: 'Pending Vendors', value: stats?.users?.pending_vendors || 0, color: '#F59E0B' }
  ];

  // Request Status Data for Pie Chart
  const requestStatusData = [
    { name: 'Open', value: stats?.requests?.open || 0, color: '#10B981' },
    { name: 'Closed', value: (stats?.requests?.total || 0) - (stats?.requests?.open || 0), color: '#6B7280' }
  ];

  // Quotation Status Data for Bar Chart
  const quotationStatusData = [
    { name: 'Submitted', count: stats?.quotations?.submitted || 0, fill: '#F59E0B' },
    { name: 'Accepted', count: stats?.quotations?.accepted || 0, fill: '#10B981' },
    { name: 'Total', count: stats?.quotations?.total || 0, fill: '#3B82F6' }
  ];

  // Monthly Activity Data (Mock - would come from backend)
  const monthlyActivityData = [
    { month: 'Jan', requests: 45, quotations: 120, users: 15 },
    { month: 'Feb', requests: 52, quotations: 145, users: 22 },
    { month: 'Mar', requests: 61, quotations: 168, users: 28 },
    { month: 'Apr', requests: 58, quotations: 172, users: 31 },
    { month: 'May', requests: 70, quotations: 195, users: 35 },
    { month: 'Jun', requests: stats?.requests?.total || 75, quotations: stats?.quotations?.total || 210, users: (stats?.users?.total_buyers || 0) + (stats?.users?.total_vendors || 0) }
  ];

  // Performance Metrics
  const performanceMetrics = [
    {
      title: 'Active Users',
      value: (stats?.users?.total_buyers || 0) + (stats?.users?.total_vendors || 0),
      icon: Users,
      color: 'bg-blue-500',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Total Requests',
      value: stats?.requests?.total || 0,
      icon: FileText,
      color: 'bg-purple-500',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Total Quotations',
      value: stats?.quotations?.total || 0,
      icon: Package,
      color: 'bg-orange-500',
      trend: '+15%',
      trendUp: true
    },
    {
      title: 'Acceptance Rate',
      value: stats?.quotations?.total ? `${Math.round((stats?.quotations?.accepted / stats?.quotations?.total) * 100)}%` : '0%',
      icon: TrendingUp,
      color: 'bg-green-500',
      trend: '+5%',
      trendUp: true
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <SlideUp>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-500 via-primary-600 to-primary-800 bg-clip-text text-transparent mb-2">
            📊 Platform Statistics
          </h1>
        </SlideUp>
        <SlideUp delay={100}>
          <p className="text-gray-600 text-lg">
            Comprehensive analytics and insights
          </p>
        </SlideUp>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {performanceMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <ScaleIn key={index} delay={index * 100}>
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 ${cardAnimations.glow}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`${metric.color} p-3 rounded-lg transform transition-transform duration-300 hover:rotate-12 hover:scale-110 flex-shrink-0`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium">{metric.title}</h3>
                  </div>
                  <span className={`text-sm font-bold px-2 py-1 rounded-full flex-shrink-0 ${
                    metric.trendUp 
                      ? 'text-green-600 bg-green-100 animate-pulse-slow' 
                      : 'text-red-600 bg-red-100'
                  }`}>
                    {metric.trend}
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {typeof metric.value === 'number' ? (
                    <CountUp end={metric.value} duration={2000} />
                  ) : (
                    metric.value
                  )}
                </p>
              </div>
            </ScaleIn>
          );
        })}
      </div>

      {/* Charts Row 1: Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Distribution */}
        <ScrollReveal animation="slideLeft">
          <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 ${cardAnimations.subtle}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg animate-float-slow">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                User Distribution
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1200}
                  animationEasing="ease-out"
                >
                  {userDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ScrollReveal>

        {/* Request Status */}
        <ScrollReveal animation="slideRight">
          <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 ${cardAnimations.subtle}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-gray-800 to-black p-2 rounded-lg animate-float-slow">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Request Status
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={requestStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1200}
                  animationEasing="ease-out"
                >
                  {requestStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ScrollReveal>
      </div>

      {/* Charts Row 2: Bar Chart */}
      <ScrollReveal animation="slideUp">
        <div className={`bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100 ${cardAnimations.subtle}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-2 rounded-lg animate-float-slow">
              <Package className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Quotation Performance
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={quotationStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} animationDuration={1500} animationEasing="ease-out">
                {quotationStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ScrollReveal>

      {/* Charts Row 3: Line & Area Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Activity - Line Chart */}
        <ScrollReveal animation="slideLeft">
          <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 ${cardAnimations.subtle}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-2 rounded-lg animate-float-slow">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Monthly Activity
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="#ff0000" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: '#ff0000' }} 
                  activeDot={{ r: 7 }}
                  animationDuration={1500} 
                  animationEasing="ease-out"
                />
                <Line 
                  type="monotone" 
                  dataKey="quotations" 
                  stroke="#000000" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: '#000000' }} 
                  activeDot={{ r: 7 }}
                  animationDuration={1500} 
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ScrollReveal>

        {/* User Growth - Area Chart */}
        <ScrollReveal animation="slideRight">
          <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 ${cardAnimations.subtle}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg animate-float-slow">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                User Growth
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#ff0000" 
                  fill="#ff0000" 
                  fillOpacity={0.3} 
                  strokeWidth={2}
                  animationDuration={1500} 
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ScrollReveal>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ScrollReveal animation="scale">
          <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 rounded-xl shadow-2xl p-6 text-white hover:shadow-primary-500/50 transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="animate-float">
                <Calendar className="h-12 w-12 mb-4 opacity-90" />
              </div>
              <h3 className="text-xl font-bold mb-2">Active This Month</h3>
              <p className="text-4xl font-bold mb-2">
                <CountUp end={stats?.requests?.open || 0} duration={2000} />
              </p>
              <p className="text-red-100 text-sm">Open procurement requests</p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="scale" delay={100}>
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl shadow-2xl p-6 text-white hover:shadow-gray-800/50 transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="animate-float">
                <DollarSign className="h-12 w-12 mb-4 opacity-90" />
              </div>
              <h3 className="text-xl font-bold mb-2">Success Rate</h3>
              <p className="text-4xl font-bold mb-2">
                {stats?.quotations?.total ? `${Math.round((stats?.quotations?.accepted / stats?.quotations?.total) * 100)}%` : '0%'}
              </p>
              <p className="text-gray-300 text-sm">Quotations accepted rate</p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="scale" delay={200}>
          <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 rounded-xl shadow-2xl p-6 text-white hover:shadow-primary-600/50 transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="animate-float">
                <Activity className="h-12 w-12 mb-4 opacity-90" />
              </div>
              <h3 className="text-xl font-bold mb-2">Platform Activity</h3>
              <p className="text-4xl font-bold mb-2 animate-pulse-slow">High</p>
              <p className="text-red-100 text-sm">Based on recent interactions</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Statistics;

