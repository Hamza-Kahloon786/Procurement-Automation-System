import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { buyerAPI } from '../../services/api';
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  Package,
  Plus,
  Eye,
  Search,
  Filter,
  Grid,
  List,
  SortAsc,
  Clock,
  CheckCircle,
  Activity,
  ArrowRight
} from 'lucide-react';
import { FadeIn, SlideUp, ScaleIn, CountUp, ScrollReveal } from '../common/AnimatedComponents';
import { cardAnimations, buttonAnimations } from '../../utils/animations';

const RequestList = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await buyerAPI.getMyRequests();
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'closed': return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
      case 'awarded': return 'bg-primary-500/20 text-primary-600 border-primary-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return Activity;
      case 'closed': return CheckCircle;
      case 'awarded': return CheckCircle;
      default: return Clock;
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
              <p className="text-xl font-semibold text-gray-900 mb-2">Loading Requests</p>
              <p className="text-gray-500">Fetching your procurement data...</p>
            </SlideUp>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl animate-float"></div>
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
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black text-gray-900">
                    My{' '}
                    <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                      Requests
                    </span>
                  </h1>
                  <p className="text-gray-600 mt-1">Manage all your procurement requests</p>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/buyer/create-request')}
                className={`px-4 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold text-sm sm:text-lg ${buttonAnimations.primary} flex items-center gap-2 sm:gap-3 shadow-xl shadow-primary-600/30`}
              >
                <Plus className="h-6 w-6" />
                Create Request
              </button>
            </div>
          </SlideUp>
        </div>

        {/* Filters and View Toggle */}
        <SlideUp delay={100}>
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1 w-full">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors duration-300" />
                  <input
                    type="text"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 hover:border-primary-300"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'open', label: 'Open' },
                  { key: 'closed', label: 'Closed' }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setFilterStatus(filter.key)}
                    className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      filterStatus === filter.key
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid' ? 'bg-white shadow-md text-primary-600' : 'text-gray-600'
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    viewMode === 'list' ? 'bg-white shadow-md text-primary-600' : 'text-gray-600'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </SlideUp>

        {/* Requests Display */}
        {filteredRequests.length === 0 ? (
          <ScaleIn delay={200}>
            <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-16 text-center border border-gray-100">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4">
                {searchTerm ? 'No matching requests' : 'No requests yet'}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                {searchTerm 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first procurement request to start receiving quotations from vendors'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => navigate('/buyer/create-request')}
                  className={`px-10 py-5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold text-lg ${buttonAnimations.primary} inline-flex items-center gap-3`}
                >
                  <Plus className="h-6 w-6" />
                  Create Your First Request
                </button>
              )}
            </div>
          </ScaleIn>
        ) : (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredRequests.map((request, index) => {
              const StatusIcon = getStatusIcon(request.status);
              return (
                <ScaleIn key={request.id} delay={index * 50}>
                  <div
                    className={`group bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:border-primary-300 transition-all duration-300 cursor-pointer ${cardAnimations.glow}`}
                    onClick={() => navigate(`/buyer/quotations/${request.id}`)}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300 mb-2">
                          {request.title}
                        </h3>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(request.status)}`}>
                          <StatusIcon className="h-3 w-3" />
                          {request.status.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {request.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                        {request.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <DollarSign className="h-4 w-4 text-green-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Budget</p>
                        <p className="text-sm font-bold text-gray-900">${request.budget.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <Package className="h-4 w-4 text-primary-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Quotes</p>
                        <p className="text-sm font-bold text-gray-900">{request.quotations_received || 0}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <Calendar className="h-4 w-4 text-gray-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Deadline</p>
                        <p className="text-sm font-bold text-gray-900">
                          {new Date(request.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/buyer/quotations/${request.id}`);
                      }}
                      className={`w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold ${buttonAnimations.primary} flex items-center justify-center gap-2`}
                    >
                      <Eye className="h-5 w-5" />
                      View Details
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </ScaleIn>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestList;
