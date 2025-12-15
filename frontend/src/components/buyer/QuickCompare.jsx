import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  X, 
  Loader2, 
  FileSpreadsheet,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Package,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Download,
  Trash2,
  Eye,
  Building2
} from 'lucide-react';
import { buyerAPI } from '../../services/api';
import { FadeIn, SlideUp, ScaleIn } from '../common/AnimatedComponents';

const QuickCompare = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [results, setResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

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
      setFiles(prev => [...prev, ...droppedFiles].slice(0, 10));
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = [...e.target.files].filter(
      file => file.type === 'application/pdf'
    );
    setFiles(prev => [...prev, ...selectedFiles].slice(0, 10));
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setResults(null);
  };

  const clearAll = () => {
    setFiles([]);
    setResults(null);
  };

  const handleCompare = async () => {
    if (files.length === 0) return;
    
    setLoading(true);
    setResults(null);
    
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('pdfs', file);
      });
      
      const response = await buyerAPI.quickCompare(formData);
      setResults(response.data);
    } catch (error) {
      console.error('Comparison failed:', error);
      alert('Failed to compare quotations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    if (files.length === 0) return;
    
    setExporting(true);
    
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('pdfs', file);
      });
      
      const response = await buyerAPI.quickCompareExcel(formData);
      
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `quick_comparison_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export comparison. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const lowestPrice = results?.comparison?.lowest_price || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-green-600/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-6xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <SlideUp>
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl mb-4 shadow-xl shadow-primary-600/30">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-3">
              Quick{' '}
              <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Compare
              </span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Upload PDF quotations from WhatsApp, Email, or any source. 
              We'll extract and compare prices instantly.
            </p>
          </div>
        </SlideUp>

        {/* Upload Area */}
        <SlideUp delay={100}>
          <div
            className={`
              relative border-2 border-dashed rounded-3xl p-10 mb-8 transition-all duration-300
              ${dragActive 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-300 bg-white hover:border-primary-400 hover:bg-gray-50'
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
              <div className={`
                w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300
                ${dragActive ? 'bg-primary-100 scale-110' : 'bg-gray-100'}
              `}>
                <Upload className={`h-10 w-10 ${dragActive ? 'text-primary-600' : 'text-gray-400'}`} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Drop PDF quotations here
              </h3>
              <p className="text-gray-500 mb-6">
                or click to browse (max 10 files)
              </p>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-600/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                Select PDF Files
              </button>
            </div>
          </div>
        </SlideUp>

        {/* Selected Files */}
        {files.length > 0 && (
          <SlideUp delay={200}>
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary-600" />
                  Selected Files ({files.length}/10)
                </h3>
                <button
                  onClick={clearAll}
                  className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </button>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {files.map((file, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCompare}
                  disabled={loading || files.length === 0}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-600/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Eye className="h-5 w-5" />
                      Compare Quotations
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleExportExcel}
                  disabled={exporting || files.length === 0}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-600/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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
          </SlideUp>
        )}

        {/* Results */}
        {results && (
          <>
            {/* Stats Cards */}
            <SlideUp delay={300}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <Package className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">PDFs Analyzed</p>
                      <p className="text-2xl font-black text-gray-900">{results.comparison.total_uploaded}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-200 bg-gradient-to-br from-green-50 to-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <TrendingDown className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Lowest Price</p>
                      <p className="text-2xl font-black text-green-600">
                        ${results.comparison.lowest_price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-200 bg-gradient-to-br from-red-50 to-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Highest Price</p>
                      <p className="text-2xl font-black text-red-600">
                        ${results.comparison.highest_price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Potential Savings</p>
                      <p className="text-2xl font-black text-blue-600">
                        ${results.comparison.potential_savings.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SlideUp>

            {/* Quotation Cards */}
            <div className="space-y-4">
              {results.quotations
                .sort((a, b) => a.total_amount - b.total_amount)
                .map((quot, index) => {
                  const isLowest = quot.total_amount === lowestPrice && lowestPrice > 0;
                  
                  return (
                    <ScaleIn key={quot.id} delay={index * 100}>
                      <div className={`
                        bg-white rounded-2xl shadow-lg p-6 border-2 transition-all duration-300
                        ${isLowest ? 'border-green-500 bg-gradient-to-br from-green-50 to-white' : 'border-gray-100'}
                        hover:shadow-xl
                      `}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                              isLowest ? 'bg-green-500' : 'bg-gray-700'
                            } text-white shadow-lg`}>
                              <Building2 className="h-7 w-7" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-bold text-gray-900">{quot.vendor_name}</h3>
                                {isLowest && (
                                  <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                                    <TrendingDown className="h-3 w-3" />
                                    BEST PRICE
                                  </span>
                                )}
                                {quot.extraction_success ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                                )}
                              </div>
                              <p className="text-sm text-gray-500">{quot.filename}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className={`text-3xl font-black ${isLowest ? 'text-green-600' : 'text-gray-900'}`}>
                              ${quot.total_amount.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Items */}
                        {quot.items.length > 0 && (
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <Package className="h-4 w-4 text-primary-600" />
                              Items ({quot.items.length})
                            </h4>
                            <div className="grid gap-2">
                              {quot.items.slice(0, 5).map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                  <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 bg-primary-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                                      {idx + 1}
                                    </span>
                                    <div>
                                      <p className="font-medium text-gray-900 text-sm">{item.product_name}</p>
                                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-gray-900">${item.unit_price?.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500">Total: ${item.total_price?.toLocaleString()}</p>
                                  </div>
                                </div>
                              ))}
                              {quot.items.length > 5 && (
                                <p className="text-sm text-gray-500 text-center py-2">
                                  +{quot.items.length - 5} more items
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Details Grid */}
                        <div className="grid sm:grid-cols-3 gap-4 mt-4">
                          {quot.delivery_time_days && (
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                              <p className="text-xs text-gray-500">Delivery</p>
                              <p className="font-bold text-gray-900">{quot.delivery_time_days} days</p>
                            </div>
                          )}
                          {quot.subtotal && (
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                              <p className="text-xs text-gray-500">Subtotal</p>
                              <p className="font-bold text-gray-900">${quot.subtotal.toLocaleString()}</p>
                            </div>
                          )}
                          {quot.tax_amount && (
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                              <p className="text-xs text-gray-500">Tax</p>
                              <p className="font-bold text-gray-900">${quot.tax_amount.toLocaleString()}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </ScaleIn>
                  );
                })}
            </div>

            {/* Export Button */}
            <SlideUp delay={500}>
              <div className="mt-8 text-center">
                <button
                  onClick={handleExportExcel}
                  disabled={exporting}
                  className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-green-600/30 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
                >
                  {exporting ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      Generating Excel...
                    </>
                  ) : (
                    <>
                      <Download className="h-6 w-6" />
                      Download Full Comparison (Excel)
                    </>
                  )}
                </button>
              </div>
            </SlideUp>
          </>
        )}
      </div>
    </div>
  );
};

export default QuickCompare;

