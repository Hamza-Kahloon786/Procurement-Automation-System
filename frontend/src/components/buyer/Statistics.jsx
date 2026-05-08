import React, { useState, useEffect } from 'react';
import { buyerAPI } from '../../services/api';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { TrendingUp, FileText, Package, DollarSign, Clock, AlertCircle, Award, Target } from 'lucide-react';

const Statistics = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await buyerAPI.getMyRequests();
      setRequests(response.data);
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
        <div className="text-center py-12 animate-fade-in">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg animate-fade-in">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6" />
            <div>
              <p className="font-medium">Error Loading Statistics</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
          <button onClick={fetchStatistics} className="mt-4 btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate Statistics
  const totalRequests = requests.length;
  const openRequests = requests.filter(r => r.status === 'open').length;
  const closedRequests = requests.filter(r => r.status === 'closed').length;
  const awardedRequests = requests.filter(r => r.status === 'awarded').length;
  const totalQuotations = requests.reduce((sum, r) => sum + (r.quotations_received || 0), 0);
  const avgQuotationsPerRequest = totalRequests ? (totalQuotations / totalRequests).toFixed(1) : 0;
  const totalBudget = requests.reduce((sum, r) => sum + (r.budget || 0), 0);

  // Chart Colors
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  // Request Status Distribution
  const statusDistribution = [
    { name: 'Open', value: openRequests, color: '#10B981' },
    { name: 'Closed', value: closedRequests, color: '#6B7280' },
    { name: 'Awarded', value: awardedRequests, color: '#3B82F6' }
  ].filter(item => item.value > 0);

  // Budget Distribution by Status
  const budgetByStatus = [
    { status: 'Open', budget: requests.filter(r => r.status === 'open').reduce((sum, r) => sum + r.budget, 0) },
    { status: 'Closed', budget: requests.filter(r => r.status === 'closed').reduce((sum, r) => sum + r.budget, 0) },
    { status: 'Awarded', budget: requests.filter(r => r.status === 'awarded').reduce((sum, r) => sum + r.budget, 0) }
  ];

  // Quotations received over time (last 6 requests)
  const quotationTrend = requests.slice(-6).map((req, index) => ({
    request: `Req ${index + 1}`,
    quotations: req.quotations_received || 0,
    budget: req.budget / 1000 // in thousands
  }));

  // Monthly Activity (computed from real request data using posted_at)
  const monthlyActivity = (() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthMap = {};

    requests.forEach(r => {
      const date = r.posted_at ? new Date(r.posted_at) : null;
      if (!date || isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthMap[key]) {
        monthMap[key] = { month: monthNames[date.getMonth()], year: date.getFullYear(), requests: 0, quotations: 0 };
      }
      monthMap[key].requests += 1;
      monthMap[key].quotations += (r.quotations_received || 0);
    });

    return Object.values(monthMap)
      .sort((a, b) => a.year - b.year || monthNames.indexOf(a.month) - monthNames.indexOf(b.month))
      .slice(-6);
  })();

  // Performance Metrics
  const metrics = [
    {
      title: 'Total Requests',
      value: totalRequests,
      icon: FileText,
      color: 'bg-blue-500',
      subtext: `${openRequests} currently open`
    },
    {
      title: 'Total Quotations',
      value: totalQuotations,
      icon: Package,
      color: 'bg-green-500',
      subtext: `${avgQuotationsPerRequest} avg per request`
    },
    {
      title: 'Total Budget',
      value: `$${(totalBudget / 1000).toFixed(1)}K`,
      icon: DollarSign,
      color: 'bg-purple-500',
      subtext: 'Across all requests'
    },
    {
      title: 'Success Rate',
      value: totalRequests ? `${Math.round((awardedRequests / totalRequests) * 100)}%` : '0%',
      icon: Award,
      color: 'bg-orange-500',
      subtext: `${awardedRequests} awarded`
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 animate-slide-in-left">
          📊 My Procurement Analytics
        </h1>
        <p className="text-gray-600 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
          Track your procurement performance and insights
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`${metric.color} p-3 rounded-lg flex-shrink-0`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-gray-600 text-sm font-medium">{metric.title}</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</p>
              <p className="text-sm text-gray-500">{metric.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Request Status Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-3 mb-6">
            <Target className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Request Status</h2>
          </div>
          {statusDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>No requests yet</p>
            </div>
          )}
        </div>

        {/* Budget Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Budget by Status</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="budget" fill="#8B5CF6" radius={[8, 8, 0, 0]} animationDuration={1000}>
                {budgetByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Quotations Trend */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center gap-3 mb-6">
            <Package className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Quotations Received</h2>
          </div>
          {quotationTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={quotationTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="request" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quotations" fill="#10B981" radius={[8, 8, 0, 0]} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>No quotations data yet</p>
            </div>
          )}
        </div>

        {/* Monthly Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Activity Trend</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="requests" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} animationDuration={1000} />
              <Area type="monotone" dataKey="quotations" stroke="#10B981" fill="#10B981" fillOpacity={0.4} animationDuration={1000} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <Clock className="h-12 w-12 mb-4 opacity-80" />
          <h3 className="text-xl font-bold mb-2">Active Requests</h3>
          <p className="text-3xl font-bold">{openRequests}</p>
          <p className="text-blue-100 text-sm mt-2">Currently awaiting quotations</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
          <Award className="h-12 w-12 mb-4 opacity-80" />
          <h3 className="text-xl font-bold mb-2">Awarded</h3>
          <p className="text-3xl font-bold">{awardedRequests}</p>
          <p className="text-green-100 text-sm mt-2">Successfully completed requests</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white animate-fade-in-up" style={{ animationDelay: '1s' }}>
          <TrendingUp className="h-12 w-12 mb-4 opacity-80" />
          <h3 className="text-xl font-bold mb-2">Avg Response</h3>
          <p className="text-3xl font-bold">{avgQuotationsPerRequest}</p>
          <p className="text-purple-100 text-sm mt-2">Quotations per request</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;

