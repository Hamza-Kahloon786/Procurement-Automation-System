import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buyerAPI } from '../../services/api';
import { 
  Plus, 
  Trash2,
  FileText,
  DollarSign,
  Calendar,
  Package,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Save,
  Eye,
  AlertCircle,
  Info
} from 'lucide-react';
import { FadeIn, SlideUp, ScaleIn } from '../common/AnimatedComponents';
import { buttonAnimations, cardAnimations } from '../../utils/animations';

const CreateRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
  });
  const [items, setItems] = useState([
    { product: '', quantity: '', specifications: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // Multi-step: 1=Basic Info, 2=Items, 3=Review

  const handleAddItem = () => {
    setItems([...items, { product: '', quantity: '', specifications: '' }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const requestData = {
        ...formData,
        budget: parseFloat(formData.budget),
        deadline: new Date(formData.deadline).toISOString(),
        items_needed: items.map(item => ({
          ...item,
          quantity: parseInt(item.quantity)
        }))
      };

      await buyerAPI.createRequest(requestData);
      navigate('/buyer/requests');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  const canProceedToStep2 = formData.title && formData.budget && formData.deadline;
  const canProceedToStep3 = items.every(item => item.product && item.quantity);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-5xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <SlideUp>
          <div className="mb-10">
            <button
              onClick={() => navigate('/buyer/requests')}
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 font-semibold mb-6 transition-colors duration-300 group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Requests
            </button>

            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-600/20 rounded-xl blur-lg"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center">
                  <FileText className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black text-gray-900">
                  Create{' '}
                  <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    Procurement Request
                  </span>
                </h1>
                <p className="text-gray-600 mt-1">Fill in the details to receive competitive quotations</p>
              </div>
            </div>
          </div>
        </SlideUp>

        {/* Progress Indicator */}
        <SlideUp delay={100}>
          <div className="mb-10">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {[
                { num: 1, label: 'Basic Info', icon: FileText },
                { num: 2, label: 'Items Needed', icon: Package },
                { num: 3, label: 'Review & Submit', icon: CheckCircle }
              ].map((s, index) => {
                const Icon = s.icon;
                const isActive = step === s.num;
                const isCompleted = step > s.num;
                
                return (
                  <div key={s.num} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`
                        relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500
                        ${isCompleted ? 'bg-gradient-to-br from-green-500 to-green-700 text-white scale-110' :
                          isActive ? 'bg-gradient-to-br from-primary-600 to-primary-800 text-white scale-125 shadow-xl shadow-primary-600/50' :
                          'bg-gray-200 text-gray-500'}
                      `}>
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <Icon className="h-6 w-6" />
                        )}
                      </div>
                      <span className={`mt-2 text-xs font-semibold ${isActive ? 'text-primary-600' : 'text-gray-500'}`}>
                        {s.label}
                      </span>
                    </div>
                    {index < 2 && (
                      <div className={`h-1 flex-1 mx-2 rounded-full transition-all duration-500 ${
                        step > s.num ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </SlideUp>

        {/* Error Message */}
        {error && (
          <ScaleIn>
            <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3">
              <AlertCircle className="h-6 w-6" />
              <div>
                <p className="font-bold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </ScaleIn>
        )}

        {/* Form Card */}
        <FadeIn>
          <div className={`bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 ${cardAnimations.subtle}`}>
            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-6">
                  <SlideUp>
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b-2 border-gray-100">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                        <p className="text-gray-500 text-sm">Tell us about your procurement needs</p>
                      </div>
                    </div>
                  </SlideUp>

                  <SlideUp delay={100}>
                    <div className="group">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Request Title <span className="text-primary-600">*</span>
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors duration-300" />
                        <input
                          type="text"
                          required
                          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 hover:border-primary-300"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g., Office Supplies - Printers and Paper"
                        />
                      </div>
                    </div>
                  </SlideUp>

                  <SlideUp delay={150}>
                    <div className="group">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 hover:border-primary-300 resize-none"
                        rows="4"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Provide detailed specifications and requirements for vendors..."
                      />
                    </div>
                  </SlideUp>

                  <div className="grid md:grid-cols-2 gap-6">
                    <SlideUp delay={200}>
                      <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Budget (USD) <span className="text-primary-600">*</span>
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors duration-300" />
                          <input
                            type="number"
                            required
                            step="0.01"
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 hover:border-primary-300"
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            placeholder="10000.00"
                          />
                        </div>
                      </div>
                    </SlideUp>

                    <SlideUp delay={250}>
                      <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Deadline <span className="text-primary-600">*</span>
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors duration-300" />
                          <input
                            type="date"
                            required
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 hover:border-primary-300"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                          />
                        </div>
                      </div>
                    </SlideUp>
                  </div>
                </div>
              )}

              {/* Step 2: Items Needed */}
              {step === 2 && (
                <div className="space-y-6">
                  <SlideUp>
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b-2 border-gray-100">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
                        <Package className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900">Items Needed</h2>
                        <p className="text-gray-500 text-sm">Specify the products you want to procure</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className={`px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold ${buttonAnimations.primary} flex items-center gap-2`}
                      >
                        <Plus className="h-5 w-5" />
                        Add Item
                      </button>
                    </div>
                  </SlideUp>

                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <ScaleIn key={index} delay={index * 50}>
                        <div className={`bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-6 group hover:border-primary-300 transition-all duration-300 ${cardAnimations.subtle}`}>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center text-white font-bold">
                                {index + 1}
                              </div>
                              <h3 className="font-bold text-gray-900">Item #{index + 1}</h3>
                            </div>
                            {items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            )}
                          </div>

                          <div className="grid md:grid-cols-12 gap-4">
                            <div className="md:col-span-5">
                              <label className="block text-sm font-bold text-gray-700 mb-2">
                                Product Name <span className="text-primary-600">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                                value={item.product}
                                onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                                placeholder="e.g., HP LaserJet Printer"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-sm font-bold text-gray-700 mb-2">
                                Quantity <span className="text-primary-600">*</span>
                              </label>
                              <input
                                type="number"
                                required
                                min="1"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                placeholder="5"
                              />
                            </div>

                            <div className="md:col-span-5">
                              <label className="block text-sm font-bold text-gray-700 mb-2">
                                Specifications
                              </label>
                              <input
                                type="text"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                                value={item.specifications}
                                onChange={(e) => handleItemChange(index, 'specifications', e.target.value)}
                                placeholder="Color, Network enabled, Duplex"
                              />
                            </div>
                          </div>
                        </div>
                      </ScaleIn>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="space-y-6">
                  <SlideUp>
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b-2 border-gray-100">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Review Your Request</h2>
                        <p className="text-gray-500 text-sm">Verify all details before submitting</p>
                      </div>
                    </div>
                  </SlideUp>

                  {/* Summary */}
                  <div className="space-y-6">
                    <ScaleIn delay={100}>
                      <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-2xl border-2 border-primary-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{formData.title}</h3>
                        {formData.description && (
                          <p className="text-gray-600 mb-4 leading-relaxed">{formData.description}</p>
                        )}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="text-xs text-gray-500">Budget</p>
                              <p className="text-lg font-bold text-gray-900">${parseFloat(formData.budget).toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                            <Calendar className="h-5 w-5 text-primary-600" />
                            <div>
                              <p className="text-xs text-gray-500">Deadline</p>
                              <p className="text-lg font-bold text-gray-900">{new Date(formData.deadline).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScaleIn>

                    <ScaleIn delay={200}>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Package className="h-5 w-5 text-primary-600" />
                          Items ({items.length})
                        </h3>
                        <div className="space-y-3">
                          {items.map((item, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <p className="font-bold text-gray-900">{item.product}</p>
                                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                  {item.specifications && (
                                    <p className="text-sm text-gray-500 mt-1">Specs: {item.specifications}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </ScaleIn>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-10 pt-8 border-t-2 border-gray-100">
                <button
                  type="button"
                  onClick={() => step > 1 && setStep(step - 1)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    step === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                  }`}
                  disabled={step === 1}
                >
                  <ArrowLeft className="h-5 w-5" />
                  Previous
                </button>

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (step === 1 && canProceedToStep2) setStep(2);
                      else if (step === 2 && canProceedToStep3) setStep(3);
                    }}
                    disabled={(step === 1 && !canProceedToStep2) || (step === 2 && !canProceedToStep3)}
                    className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-2 ${
                      ((step === 1 && canProceedToStep2) || (step === 2 && canProceedToStep3))
                        ? `bg-gradient-to-r from-primary-600 to-primary-700 text-white ${buttonAnimations.primary} shadow-xl shadow-primary-600/30`
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Next Step
                    <ArrowRight className="h-6 w-6" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-8 py-4 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-2 ${
                      loading ? 'opacity-50 cursor-not-allowed' : `${buttonAnimations.primary} shadow-xl shadow-green-600/30`
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-6 w-6" />
                        Create Request
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </FadeIn>

        {/* Help Card */}
        <SlideUp delay={300}>
          <div className="mt-8 bg-gradient-to-br from-blue-50 to-primary-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Info className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Tips for Better Results</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Be specific in your requirements to get accurate quotations</li>
                  <li>• Set a realistic budget to attract quality vendors</li>
                  <li>• Allow sufficient time between deadline and requirement date</li>
                </ul>
              </div>
            </div>
          </div>
        </SlideUp>
      </div>
    </div>
  );
};

export default CreateRequest;
