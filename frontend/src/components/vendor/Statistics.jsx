import React, { useState, useEffect } from 'react';
import { vendorAPI } from '../../services/api';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { TrendingUp, Package, CheckCircle, Clock, DollarSign, AlertCircle, Award, Target, FileText } from 'lucide-react';

const Statistics = () => {
  const [quotations, setQuotations] = useState([]);
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
      
      const [quotationsResponse, requestsResponse] = await Promise.all([
        vendorAPI.getMyQuotations(),
        vendorAPI.getOpenRequests()
      ]);
      
      setQuotations(quotationsResponse.data);
      setRequests(requestsResponse.data);
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
  const totalQuotations = quotations.length;
  const submittedQuotations = quotations.filter(q => q.status === 'submitted').length;
  const acceptedQuotations = quotations.filter(q => q.status === 'accepted').length;
  const rejectedQuotations = quotations.filter(q => q.status === 'rejected').length;
  const availableRequests = requests.length;
  const successRate = totalQuotations ? ((acceptedQuotations / totalQuotations) * 100).toFixed(1) : 0;

  // Chart Colors
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  // Quotation Status Distribution
  const statusDistribution = [
    { name: 'Submitted', value: submittedQuotations, color: '#F59E0B' },
    { name: 'Accepted', value: acceptedQuotations, color: '#10B981' },
    { name: 'Rejected', value: rejectedQuotations, color: '#EF4444' }
  ].filter(item => item.value > 0);

  // Performance over time (last 6 quotations)
  const performanceTrend = quotations.slice(-6).map((quot, index) => ({
    quotation: `Q${index + 1}`,
    status: quot.status === 'accepted' ? 1 : quot.status === 'rejected' ? 0 : 0.5
  }));

  // Monthly Activity (computed from real quotation data using submitted_at)
  const monthlyActivity = (() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthMap = {};

    quotations.forEach(q => {
      const date = q.submitted_at ? new Date(q.submitted_at) : null;
      if (!date || isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthMap[key]) {
        monthMap[key] = { month: monthNames[date.getMonth()], year: date.getFullYear(), submitted: 0, accepted: 0 };
      }
      monthMap[key].submitted += 1;
      if (q.status === 'accepted') {
        monthMap[key].accepted += 1;
      }
    });

    return Object.values(monthMap)
      .sort((a, b) => a.year - b.year || monthNames.indexOf(a.month) - monthNames.indexOf(b.month))
      .slice(-6);
  })();

  // Opportunity Analysis
  const opportunityData = [
    { category: 'Available', count: availableRequests },
    { category: 'Quoted', count: totalQuotations },
    { category: 'Won', count: acceptedQuotations }
  ];

  // Performance Metrics
  const metrics = [
    {
      title: 'Total Quotations',
      value: totalQuotations,
      icon: Package,
      color: 'bg-blue-500',
      subtext: `${submittedQuotations} pending review`
    },
    {
      title: 'Success Rate',
      value: `${successRate}%`,
      icon: TrendingUp,
      color: 'bg-green-500',
      subtext: `${acceptedQuotations} won deals`
    },
    {
      title: 'Available Requests',
      value: availableRequests,
      icon: FileText,
      color: 'bg-purple-500',
      subtext: 'New opportunities'
    },
    {
      title: 'Win Rate',
      value: availableRequests ? `${((acceptedQuotations / availableRequests) * 100).toFixed(0)}%` : '0%',
      icon: Award,
      color: 'bg-orange-500',
      subtext: 'Conversion rate'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 animate-slide-in-left">
          📊 My Performance Analytics
        </h1>
        <p className="text-gray-600 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
          Track your quotation performance and success rate
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
        {/* Quotation Status Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-3 mb-6">
            <Target className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Quotation Status</h2>
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
              <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>No quotations yet</p>
            </div>
          )}
        </div>

        {/* Opportunity Pipeline */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Opportunity Pipeline</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={opportunityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} animationDuration={1000}>
                {opportunityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Submission Trend */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Monthly Performance</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="submitted" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} animationDuration={1000} />
              <Line type="monotone" dataKey="accepted" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} animationDuration={1000} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Trend */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <div className="flex items-center gap-3 mb-6">
            <Award className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Success Trend</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="submitted" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} animationDuration={1000} />
              <Area type="monotone" dataKey="accepted" stroke="#10B981" fill="#10B981" fillOpacity={0.8} animationDuration={1000} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <Clock className="h-12 w-12 mb-4 opacity-80" />
          <h3 className="text-xl font-bold mb-2">Pending Review</h3>
          <p className="text-3xl font-bold">{submittedQuotations}</p>
          <p className="text-blue-100 text-sm mt-2">Awaiting buyer decision</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
          <CheckCircle className="h-12 w-12 mb-4 opacity-80" />
          <h3 className="text-xl font-bold mb-2">Won Deals</h3>
          <p className="text-3xl font-bold">{acceptedQuotations}</p>
          <p className="text-green-100 text-sm mt-2">Successfully accepted quotations</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white animate-fade-in-up" style={{ animationDelay: '1s' }}>
          <Target className="h-12 w-12 mb-4 opacity-80" />
          <h3 className="text-xl font-bold mb-2">Success Rate</h3>
          <p className="text-3xl font-bold">{successRate}%</p>
          <p className="text-purple-100 text-sm mt-2">Overall win percentage</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;

