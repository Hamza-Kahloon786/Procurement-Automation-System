import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendorAPI } from '../../services/api';
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  Building2, 
  Package,
  Search,
  Filter,
  Send,
  Upload,
  X,
  Clock,
  Eye,
  Bookmark,
  AlertCircle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { FadeIn, SlideUp, ScaleIn, CountUp } from '../common/AnimatedComponents';
import { cardAnimations, buttonAnimations } from '../../utils/animations';

const BrowseRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await vendorAPI.getOpenRequests();
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleSubmitQuotation = async () => {
    if (!pdfFile) {
      alert('Please select a PDF file');
      return;
    }

    setUploading(true);
    try {
      await vendorAPI.submitQuotation(selectedRequest.id, pdfFile);
      setShowUpload(false);
      setPdfFile(null);
      setSelectedRequest(null);
      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to submit quotation');
    } finally {
      setUploading(false);
    }
  };

  const filteredRequests = requests.filter(request =>
    request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <p className="text-xl font-semibold text-gray-900 mb-2">Loading Opportunities</p>
              <p className="text-gray-500">Finding procurement requests...</p>
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
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-600/20 rounded-xl blur-lg"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
                  <Search className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black text-gray-900">
                  Browse{' '}
                  <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    Opportunities
                  </span>
                </h1>
                <p className="text-gray-600 mt-1">Find and bid on procurement requests</p>
              </div>
            </div>
          </SlideUp>

          <SlideUp delay={100}>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                />
              </div>
            </div>
          </SlideUp>
        </div>

        {filteredRequests.length === 0 ? (
          <ScaleIn delay={200}>
            <div className="bg-white rounded-3xl shadow-xl p-16 text-center border border-gray-100">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">No Requests Available</h3>
              <p className="text-gray-600 text-lg">Check back soon for new opportunities</p>
            </div>
          </ScaleIn>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredRequests.map((request, index) => (
              <ScaleIn key={request.id} delay={index * 50}>
                <div className={`group bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:border-primary-300 transition-all duration-300 ${cardAnimations.glow}`}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                      {request.title}
                    </h3>
                    <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      OPEN
                    </div>
                  </div>

                  {request.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{request.description}</p>
                  )}

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Building2 className="h-5 w-5 text-primary-600" />
                      <div>
                        <p className="text-xs text-gray-500">Company</p>
                        <p className="font-semibold text-gray-900">{request.buyer_company}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-xs text-gray-500">Budget</p>
                          <p className="font-bold text-gray-900">${request.budget.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-3 bg-primary-50 rounded-xl">
                        <Calendar className="h-5 w-5 text-primary-600" />
                        <div>
                          <p className="text-xs text-gray-500">Deadline</p>
                          <p className="font-bold text-gray-900 text-sm">
                            {new Date(request.deadline).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                      <Package className="h-5 w-5 text-gray-700" />
                      <p className="text-sm text-gray-700">
                        <span className="font-bold">{request.quotations_received}</span> quotations submitted
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200 mb-4">
                    <h4 className="font-bold text-gray-900 mb-2 text-sm">Required Items:</h4>
                    <div className="space-y-1">
                      {request.items_needed.map((item, idx) => (
                        <div key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <div className="w-5 h-5 bg-primary-600 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <span>
                            {item.product} × {item.quantity}
                            {item.specifications && <span className="text-gray-500 ml-1">({item.specifications})</span>}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowUpload(true);
                    }}
                    className={`w-full px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold ${buttonAnimations.primary} flex items-center justify-center gap-2`}
                  >
                    <Send className="h-5 w-5" />
                    Submit Quotation
                  </button>
                </div>
              </ScaleIn>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fadeIn">
          <ScaleIn>
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center">
                    <Upload className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Submit Quotation</h2>
                    <p className="text-gray-500">Upload your proposal PDF</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowUpload(false);
                    setPdfFile(null);
                    setSelectedRequest(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-300"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-2xl border border-primary-200 mb-6">
                <h3 className="font-bold text-gray-900 mb-2">{selectedRequest.title}</h3>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Budget: <strong>${selectedRequest.budget.toLocaleString()}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary-600" />
                    <span className="text-sm text-gray-600">Deadline: <strong>{new Date(selectedRequest.deadline).toLocaleDateString()}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Upload PDF Quotation <span className="text-primary-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label
                    htmlFor="pdf-upload"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all duration-300 group"
                  >
                    <Upload className="h-12 w-12 text-gray-400 group-hover:text-primary-600 mb-3 transition-colors duration-300" />
                    <p className="text-sm font-semibold text-gray-600 group-hover:text-primary-600">
                      {pdfFile ? pdfFile.name : 'Click to upload PDF'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF files only, max 10MB</p>
                  </label>
                </div>
                {pdfFile && (
                  <div className="mt-3 flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-semibold text-green-700">File selected: {pdfFile.name}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSubmitQuotation}
                  disabled={uploading || !pdfFile}
                  className={`flex-1 px-8 py-4 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl font-bold ${uploading || !pdfFile ? 'opacity-50 cursor-not-allowed' : buttonAnimations.primary} flex items-center justify-center gap-2`}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Submit Quotation
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowUpload(false);
                    setPdfFile(null);
                    setSelectedRequest(null);
                  }}
                  className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </ScaleIn>
        </div>
      )}
    </div>
  );
};

export default BrowseRequests;
