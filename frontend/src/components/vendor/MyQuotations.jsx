import React, { useState, useEffect } from 'react';
import { vendorAPI } from '../../services/api';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle,
  Package,
  DollarSign,
  Calendar,
  TrendingUp,
  Award,
  Activity,
  Eye,
  Download
} from 'lucide-react';
import { FadeIn, SlideUp, ScaleIn, CountUp, ScrollReveal } from '../common/AnimatedComponents';
import { cardAnimations, buttonAnimations } from '../../utils/animations';

const MyQuotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const response = await vendorAPI.getMyQuotations();
      setQuotations(response.data);
    } catch (error) {
      console.error('Failed to fetch quotations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return CheckCircle;
      case 'rejected': return XCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-600 border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
    }
  };

  const getStatusGradient = (status) => {
    switch (status) {
      case 'accepted': return 'from-green-500 to-green-700';
      case 'rejected': return 'from-red-500 to-red-700';
      default: return 'from-yellow-500 to-yellow-700';
    }
  };

  const filteredQuotations = quotations.filter(q => 
    filter === 'all' || q.status === filter
  );

  const statusCounts = {
    all: quotations.length,
    submitted: quotations.filter(q => q.status === 'submitted').length,
    accepted: quotations.filter(q => q.status === 'accepted').length,
    rejected: quotations.filter(q => q.status === 'rejected').length
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
              <p className="text-xl font-semibold text-gray-900 mb-2">Loading Quotations</p>
              <p className="text-gray-500">Fetching your submissions...</p>
            </SlideUp>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="relative max-w-7xl mx-auto p-6 lg:p-8">
        <div className="mb-10">
          <SlideUp>
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-600/20 rounded-xl blur-lg"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
                  <Package className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-black text-gray-900">
                  My{' '}
                  <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    Quotations
                  </span>
                </h1>
                <p className="text-gray-600 mt-1">Track all your submitted proposals</p>
              </div>
            </div>
          </SlideUp>

          <SlideUp delay={100}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { key: 'all', label: 'All', icon: Package, count: statusCounts.all },
                { key: 'submitted', label: 'Pending', icon: Clock, count: statusCounts.submitted },
                { key: 'accepted', label: 'Accepted', icon: CheckCircle, count: statusCounts.accepted },
                { key: 'rejected', label: 'Rejected', icon: XCircle, count: statusCounts.rejected }
              ].map((btn) => {
                const Icon = btn.icon;
                return (
                  <button
                    key={btn.key}
                    onClick={() => setFilter(btn.key)}
                    className={`p-5 rounded-2xl font-semibold transition-all duration-300 ${
                      filter === btn.key
                        ? 'bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-xl scale-105'
                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-300 hover:scale-105'
                    }`}
                  >
                    <Icon className={`h-6 w-6 mx-auto mb-2 ${filter === btn.key ? 'text-white' : 'text-primary-600'}`} />
                    <p className="text-sm mb-1">{btn.label}</p>
                    <p className="text-2xl font-black">
                      <CountUp end={btn.count} duration={1500} />
                    </p>
                  </button>
                );
              })}
            </div>
          </SlideUp>
        </div>

        {filteredQuotations.length === 0 ? (
          <ScaleIn delay={200}>
            <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-16 text-center border border-gray-100">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4">No Quotations Yet</h3>
              <p className="text-gray-600 text-lg">Start browsing requests to submit your first quotation</p>
            </div>
          </ScaleIn>
        ) : (
          <div className="space-y-6">
            {filteredQuotations.map((quotation, index) => {
              const StatusIcon = getStatusIcon(quotation.status);
              return (
                <ScaleIn key={quotation.id} delay={index * 50}>
                  <div className={`bg-white rounded-2xl shadow-lg p-4 sm:p-8 border-2 border-gray-100 ${cardAnimations.glow}`}>
                    <div className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-2xl font-bold text-gray-900">
                            Request #{quotation.request_id}
                          </h3>
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(quotation.status)}`}>
                            <StatusIcon className="h-4 w-4" />
                            {quotation.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Submitted: {new Date(quotation.submitted_at).toLocaleString()}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                        <p className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                          ${quotation.total_amount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="h-5 w-5 text-primary-600" />
                          <span className="text-xs text-gray-500">Items</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{quotation.items.length}</p>
                      </div>

                      <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <span className="text-xs text-gray-500">Delivery</span>
                        </div>
                        <p className="text-xl font-bold text-gray-900">
                          {quotation.delivery_time_days ? `${quotation.delivery_time_days} days` : 'N/A'}
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          <span className="text-xs text-gray-500">Payment</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">{quotation.payment_terms || 'N/A'}</p>
                      </div>
                    </div>

                    {quotation.items && quotation.items.length > 0 && (
                      <div className="bg-gradient-to-br from-primary-50 to-white p-5 rounded-2xl border border-primary-200">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary-600" />
                          Items Details
                        </h4>
                        <div className="space-y-2">
                          {quotation.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-xl">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-primary-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                                  {idx + 1}
                                </div>
                                <span className="font-medium text-gray-900">
                                  {item.product_name} × {item.quantity}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">Unit: ${item.unit_price}</p>
                                <p className="font-bold text-gray-900">${item.total_price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScaleIn>
              );
            })}
          </div>
        )}

        {quotations.length > 0 && (
          <ScrollReveal animation="slideUp">
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Revenue', value: quotations.filter(q => q.status === 'accepted').reduce((sum, q) => sum + q.total_amount, 0), icon: DollarSign, color: 'from-green-500 to-green-700', prefix: '$' },
                { label: 'Success Rate', value: quotations.length ? Math.round((statusCounts.accepted / quotations.length) * 100) : 0, icon: TrendingUp, color: 'from-primary-600 to-primary-800', suffix: '%' },
                { label: 'Win Rate', value: quotations.length ? Math.round((statusCounts.accepted / quotations.length) * 100) : 0, icon: Award, color: 'from-yellow-500 to-yellow-700', suffix: '%' }
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-xl`}>
                    <Icon className="h-8 w-8 mb-3 opacity-90" />
                    <p className="text-white/80 text-sm font-semibold mb-1">{stat.label}</p>
                    <p className="text-2xl sm:text-4xl font-black">
                      {stat.prefix}
                      <CountUp end={stat.value} duration={2000} />
                      {stat.suffix}
                    </p>
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

export default MyQuotations;
