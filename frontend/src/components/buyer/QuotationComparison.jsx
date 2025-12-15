import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buyerAPI } from '../../services/api';
import { 
  CheckCircle, 
  TrendingDown, 
  Clock, 
  Package,
  Sparkles,
  DollarSign,
  Calendar,
  Truck,
  CreditCard,
  Award,
  ThumbsUp,
  ArrowLeft,
  FileText,
  Building2,
  Download,
  FileSpreadsheet,
  Loader2,
  Upload,
  X,
  Plus,
  AlertCircle
} from 'lucide-react';
import { FadeIn, SlideUp, ScaleIn, CountUp } from '../common/AnimatedComponents';
import { cardAnimations, buttonAnimations } from '../../utils/animations';

const QuotationComparison = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [uploadedQuotations, setUploadedQuotations] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showUploadArea, setShowUploadArea] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [requestId]);

  const fetchData = async () => {
    try {
      const [reqRes, quotRes, compRes] = await Promise.all([
        buyerAPI.getRequestDetail(requestId),
        buyerAPI.getQuotations(requestId),
        buyerAPI.getComparison(requestId),
      ]);

      setRequest(reqRes.data);
      setQuotations(quotRes.data);
      setComparison(compRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuotation = async (quotationId) => {
    if (!window.confirm('Are you sure you want to accept this quotation? This action cannot be undone.')) return;

    try {
      await buyerAPI.acceptQuotation(requestId, quotationId);
      fetchData();
    } catch (error) {
      alert('Failed to accept quotation');
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = [...e.dataTransfer.files].filter(
      file => file.type === 'application/pdf'
    );
    
    if (droppedFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...droppedFiles].slice(0, 10));
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = [...e.target.files].filter(
      file => file.type === 'application/pdf'
    );
    setUploadedFiles(prev => [...prev, ...selectedFiles].slice(0, 10));
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Process uploaded PDFs
  const handleProcessUploads = async () => {
    if (uploadedFiles.length === 0) return;
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      uploadedFiles.forEach(file => {
        formData.append('pdfs', file);
      });
      
      const response = await buyerAPI.quickCompare(formData);
      
      // Add uploaded quotations to the list with a flag
      const newQuotations = response.data.quotations.map(q => ({
        ...q,
        isUploaded: true,
        status: 'external'
      }));
      
      setUploadedQuotations(newQuotations);
      setShowUploadArea(false);
    } catch (error) {
      console.error('Processing failed:', error);
      alert('Failed to process PDFs. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Export all quotations (vendor submitted + uploaded) to Excel
  const handleExportAllExcel = async () => {
    setExporting(true);
    
    try {
      // If we have uploaded files, use quick compare export with all files
      if (uploadedFiles.length > 0) {
        const formData = new FormData();
        uploadedFiles.forEach(file => {
          formData.append('pdfs', file);
        });
        
        // Also export the request-based quotations
        const response = await buyerAPI.exportCombinedExcel(requestId, formData);
        
        const blob = new Blob([response.data], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `full_comparison_${request?.title?.replace(/\s+/g, '_') || 'export'}_${new Date().toISOString().split('T')[0]}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        // Just export the vendor quotations
        const response = await buyerAPI.exportQuotationsExcel(requestId);
        
        const blob = new Blob([response.data], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `quotation_comparison_${request?.title?.replace(/\s+/g, '_') || 'export'}_${new Date().toISOString().split('T')[0]}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export quotations. Please try again.');
    } finally {
      setExporting(false);
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
              <p className="text-xl font-semibold text-gray-900 mb-2">Loading Quotations</p>
              <p className="text-gray-500">Comparing vendor proposals...</p>
            </SlideUp>
          </div>
        </FadeIn>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-6">
        <ScaleIn>
          <div className="text-center bg-white rounded-2xl shadow-xl p-12 border border-gray-200">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Not Found</h3>
            <p className="text-gray-600 mb-6">This procurement request doesn't exist</p>
            <button
              onClick={() => navigate('/buyer/requests')}
              className={`px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold ${buttonAnimations.primary}`}
            >
              Back to Requests
            </button>
          </div>
        </ScaleIn>
      </div>
    );
  }

  // Combine vendor quotations with uploaded quotations
  const allQuotations = [
    ...quotations.map(q => ({ ...q, isUploaded: false })),
    ...uploadedQuotations
  ];

  const lowestPrice = allQuotations.length > 0 
    ? Math.min(...allQuotations.filter(q => q.total_amount > 0).map(q => q.total_amount)) 
    : 0;

  const highestPrice = allQuotations.length > 0 
    ? Math.max(...allQuotations.filter(q => q.total_amount > 0).map(q => q.total_amount)) 
    : 0;

  const sortedQuotations = [...allQuotations].sort((a, b) => a.total_amount - b.total_amount);

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
            <button
              onClick={() => navigate('/buyer/requests')}
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 font-semibold mb-6 transition-colors duration-300 group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Requests
            </button>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-600/20 rounded-xl blur-lg"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center">
                    <Package className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-black text-gray-900">
                    Compare{' '}
                    <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                      Quotations
                    </span>
                  </h1>
                  <p className="text-gray-600 mt-1">Select the best offer for your procurement</p>
                </div>
              </div>
            </div>
          </SlideUp>
        </div>

        {/* Request Info Card */}
        <SlideUp delay={100}>
          <div className={`bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 ${cardAnimations.subtle}`}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">{request.title}</h2>
                {request.description && (
                  <p className="text-gray-600 leading-relaxed">{request.description}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-2xl border border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="h-6 w-6 text-green-600" />
                  <span className="text-sm font-semibold text-gray-600">Budget</span>
                </div>
                <p className="text-2xl font-black text-green-600">${request.budget?.toLocaleString()}</p>
              </div>

              <div className="bg-gradient-to-br from-primary-50 to-white p-5 rounded-2xl border border-primary-200">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="h-6 w-6 text-primary-600" />
                  <span className="text-sm font-semibold text-gray-600">Deadline</span>
                </div>
                <p className="text-xl font-black text-gray-900">
                  {new Date(request.deadline).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="h-6 w-6 text-gray-700" />
                  <span className="text-sm font-semibold text-gray-600">Total Quotations</span>
                </div>
                <p className="text-2xl font-black text-gray-900">
                  <CountUp end={allQuotations.length} duration={1500} />
                </p>
              </div>

              {lowestPrice > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-2xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingDown className="h-6 w-6 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-600">Potential Savings</span>
                  </div>
                  <p className="text-2xl font-black text-blue-600">
                    ${(highestPrice - lowestPrice).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </SlideUp>

        {/* Upload Section */}
        <SlideUp delay={150}>
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Add More Quotations</h3>
                  <p className="text-sm text-gray-500">Upload PDFs from WhatsApp, Email, or other sources</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!showUploadArea && (
                  <button
                    onClick={() => setShowUploadArea(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="h-4 w-4" />
                    Add PDFs
                  </button>
                )}
                <button
                  onClick={handleExportAllExcel}
                  disabled={exporting || allQuotations.length === 0}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold shadow-lg shadow-primary-600/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {exporting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="h-5 w-5" />
                      Export to Excel
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Upload Area */}
            {showUploadArea && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div
                  className={`
                    border-2 border-dashed rounded-xl p-8 transition-all duration-300 mb-4
                    ${dragActive 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 bg-gray-50 hover:border-green-400'
                    }
                  `}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <div className="text-center">
                    <Upload className={`h-10 w-10 mx-auto mb-3 ${dragActive ? 'text-green-600' : 'text-gray-400'}`} />
                    <p className="font-semibold text-gray-700 mb-1">Drop PDF quotations here</p>
                    <p className="text-sm text-gray-500 mb-3">or click to browse (max 10 files)</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Select Files
                    </button>
                  </div>
                </div>

                {/* Selected Files */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {uploadedFiles.map((file, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-red-500" />
                          <span className="font-medium text-gray-900 text-sm">{file.name}</span>
                          <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleProcessUploads}
                    disabled={uploading || uploadedFiles.length === 0}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        Add to Comparison ({uploadedFiles.length})
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowUploadArea(false);
                      setUploadedFiles([]);
                    }}
                    className="px-4 py-2.5 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Uploaded Quotations Count */}
            {uploadedQuotations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">{uploadedQuotations.length} external quotation(s) added to comparison</span>
                </div>
              </div>
            )}
          </div>
        </SlideUp>

        {/* AI Recommendation */}
        {comparison && comparison.summary && (() => {
          // Parse the summary text to extract structured information
          const parseSummary = (summary) => {
            const sections = {
              priceAnalysis: [],
              deliveryAnalysis: [],
              recommendation: ''
            };
            
            const lines = summary.split('\n').filter(line => line.trim());
            let currentSection = null;
            
            lines.forEach(line => {
              if (line.includes('**Price Analysis:**')) {
                currentSection = 'priceAnalysis';
              } else if (line.includes('**Delivery Analysis:**')) {
                currentSection = 'deliveryAnalysis';
              } else if (line.includes('**Recommendation:**')) {
                currentSection = 'recommendation';
              } else if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                const content = line.replace(/^[•\-]\s*/, '').trim();
                if (currentSection === 'priceAnalysis') {
                  sections.priceAnalysis.push(content);
                } else if (currentSection === 'deliveryAnalysis') {
                  sections.deliveryAnalysis.push(content);
                }
              } else if (currentSection === 'recommendation' && line.trim()) {
                sections.recommendation += (sections.recommendation ? ' ' : '') + line.trim();
              }
            });
            
            return sections;
          };
          
          const parsed = parseSummary(comparison.summary);
          
          return (
            <ScaleIn delay={200}>
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-primary-200">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">AI-Powered Recommendation</h3>
                    <p className="text-sm text-gray-500 mt-1">Intelligent analysis of all quotations</p>
                  </div>
                </div>

                {/* Price Analysis */}
                {parsed.priceAnalysis.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary-600" />
                      Price Analysis
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {parsed.priceAnalysis.map((item, idx) => {
                        const isCheapest = item.toLowerCase().includes('cheapest');
                        const isExpensive = item.toLowerCase().includes('expensive');
                        const isDifference = item.toLowerCase().includes('difference');
                        
                        return (
                          <div 
                            key={idx}
                            className={`p-4 rounded-xl border-2 ${
                              isCheapest 
                                ? 'bg-green-50 border-green-200' 
                                : isExpensive 
                                ? 'bg-red-50 border-red-200'
                                : isDifference
                                ? 'bg-blue-50 border-blue-200'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <p className="text-sm font-medium text-gray-700">{item}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Delivery Analysis */}
                {parsed.deliveryAnalysis.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary-600" />
                      Delivery Analysis
                    </h4>
                    <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                      {parsed.deliveryAnalysis.map((item, idx) => (
                        <p key={idx} className="text-sm font-medium text-gray-700">{item}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendation */}
                {parsed.recommendation && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Recommendation</h4>
                        <p className="text-gray-700 leading-relaxed">{parsed.recommendation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fallback if parsing didn't work */}
                {!parsed.recommendation && parsed.priceAnalysis.length === 0 && (
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{comparison.summary}</p>
                  </div>
                )}
              </div>
            </ScaleIn>
          );
        })()}

        {/* Quotations */}
        {allQuotations.length === 0 ? (
          <ScaleIn delay={300}>
            <div className="bg-white rounded-3xl shadow-xl p-16 text-center border border-gray-100">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">No Quotations Yet</h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto mb-6">
                Vendors haven't submitted any quotations. Upload PDFs from other sources to compare!
              </p>
              <button
                onClick={() => setShowUploadArea(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <Upload className="h-5 w-5" />
                Upload PDF Quotations
              </button>
            </div>
          </ScaleIn>
        ) : (
          <div className="space-y-6">
            <SlideUp delay={300}>
              <div className="bg-white rounded-xl shadow-md p-5 mb-6 border border-gray-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">All Quotations</h2>
                      <p className="text-sm text-gray-500 mt-0.5">{allQuotations.length} quotation{allQuotations.length !== 1 ? 's' : ''} received</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                    <TrendingDown className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">Sorted by price (lowest first)</span>
                  </div>
                </div>
              </div>
            </SlideUp>

            {sortedQuotations.map((quotation, index) => {
              const isLowest = quotation.total_amount === lowestPrice && lowestPrice > 0;
              const isRecommended = index === 0;
              
              return (
                <ScaleIn key={quotation.id} delay={index * 100}>
                  <div className={`
                    relative bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 border-2 transition-all duration-300 overflow-hidden
                    ${isLowest ? 'border-green-400 bg-gradient-to-br from-green-50/50 to-white' : 'border-gray-200 hover:border-primary-300'}
                  `}>
                    {/* Top Accent Bar */}
                    {isLowest && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
                    )}
                    
                    {/* Vendor Header */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-14 h-14 bg-gradient-to-br ${
                          isLowest ? 'from-green-500 to-green-700' : 'from-gray-700 to-gray-900'
                        } rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                          <Building2 className="h-7 w-7" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{quotation.vendor_name || 'Unknown Vendor'}</h3>
                          <div className="flex flex-wrap items-center gap-2">
                            {isLowest && (
                              <span className="inline-flex items-center gap-1.5 bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                                <TrendingDown className="h-3.5 w-3.5" />
                                BEST PRICE
                              </span>
                            )}
                            {isRecommended && !quotation.isUploaded && (
                              <span className="inline-flex items-center gap-1.5 bg-primary-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                                <Sparkles className="h-3.5 w-3.5" />
                                RECOMMENDED
                              </span>
                            )}
                            {quotation.isUploaded ? (
                              <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold border border-blue-200">
                                <Upload className="h-3.5 w-3.5" />
                                UPLOADED
                              </span>
                            ) : (
                              <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                                quotation.status === 'accepted' 
                                  ? 'bg-green-100 text-green-700 border-green-300'
                                  : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                              }`}>
                                {quotation.status?.toUpperCase() || 'SUBMITTED'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Total Amount */}
                      <div className="text-right ml-4 flex-shrink-0">
                        <p className="text-xs text-gray-500 mb-1 font-medium">Total Amount</p>
                        <p className={`text-3xl font-black ${isLowest ? 'text-green-600' : 'text-gray-900'}`}>
                          ${quotation.total_amount?.toLocaleString() || '0'}
                        </p>
                        {quotation.isUploaded && quotation.filename && (
                          <p className="text-xs text-gray-400 mt-1 truncate max-w-[150px]">{quotation.filename}</p>
                        )}
                      </div>
                    </div>

                    {/* Quotation Details */}
                    <div className="grid md:grid-cols-4 gap-3 mb-5">
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 text-center">
                        <Package className="h-5 w-5 text-primary-600 mx-auto mb-2" />
                        <p className="text-xs text-gray-500 mb-1 font-medium">Items</p>
                        <p className="text-xl font-bold text-gray-900">{quotation.items?.length || 0}</p>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-200 text-center">
                        <Truck className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                        <p className="text-xs text-gray-500 mb-1 font-medium">Delivery</p>
                        <p className="text-lg font-bold text-gray-900">
                          {quotation.delivery_time_days ? `${quotation.delivery_time_days} days` : 'N/A'}
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-4 border border-purple-200 text-center">
                        <CreditCard className="h-5 w-5 text-purple-600 mx-auto mb-2" />
                        <p className="text-xs text-gray-500 mb-1 font-medium">Payment</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{quotation.payment_terms || 'N/A'}</p>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-4 border border-orange-200 text-center">
                        <Clock className="h-5 w-5 text-orange-600 mx-auto mb-2" />
                        <p className="text-xs text-gray-500 mb-1 font-medium">{quotation.isUploaded ? 'Source' : 'Submitted'}</p>
                        <p className="text-sm font-bold text-gray-900">
                          {quotation.isUploaded 
                            ? 'External PDF' 
                            : new Date(quotation.submitted_at).toLocaleDateString()
                          }
                        </p>
                      </div>
                    </div>

                    {/* Items Breakdown */}
                    {quotation.items && quotation.items.length > 0 && (
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 mb-5 border border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary-600" />
                          Items Breakdown ({quotation.items.length})
                        </h4>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {quotation.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 hover:border-primary-200 transition-colors">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                  {idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-900 truncate">{item.product_name || 'Unnamed Item'}</p>
                                  <p className="text-xs text-gray-500">Qty: {item.quantity || 0} × ${item.unit_price?.toLocaleString() || '0'}</p>
                                </div>
                              </div>
                              <div className="text-right ml-4 flex-shrink-0">
                                <p className="text-xs text-gray-500 mb-0.5">Total</p>
                                <p className="font-bold text-gray-900">${((item.quantity || 0) * (item.unit_price || 0)).toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Accept Button (only for vendor submissions) */}
                    {!quotation.isUploaded && quotation.status === 'submitted' && (
                      <button
                        onClick={() => handleAcceptQuotation(quotation.id)}
                        className="w-full px-6 py-3.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <ThumbsUp className="h-5 w-5" />
                        Accept This Quotation
                      </button>
                    )}

                    {!quotation.isUploaded && quotation.status === 'accepted' && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 flex items-center justify-center gap-3">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <span className="text-base font-bold text-green-700">Quotation Accepted!</span>
                      </div>
                    )}
                  </div>
                </ScaleIn>
              );
            })}
          </div>
        )}

        {/* Bottom Export Button */}
        {allQuotations.length > 0 && (
          <SlideUp delay={500}>
            <div className="mt-10 bg-white rounded-2xl shadow-lg p-8 border border-gray-200 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FileSpreadsheet className="h-6 w-6 text-primary-600" />
                <h3 className="text-xl font-bold text-gray-900">Export Comparison Report</h3>
              </div>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Download a comprehensive Excel file with all {allQuotations.length} quotations, including item-wise breakdown and price comparison
              </p>
              <button
                onClick={handleExportAllExcel}
                disabled={exporting}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold text-base hover:shadow-xl hover:shadow-primary-600/30 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
              >
                {exporting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating Excel...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    Download Excel Report
                  </>
                )}
              </button>
            </div>
          </SlideUp>
        )}
      </div>
    </div>
  );
};

export default QuotationComparison;
