import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Phone, 
  ArrowRight, 
  Home, 
  CheckCircle,
  Sparkles,
  ShoppingBag,
  Briefcase,
  Shield,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';
import { FadeIn, SlideUp, ScaleIn } from '../components/common/AnimatedComponents';
import { buttonAnimations, cardAnimations } from '../utils/animations';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    company: '',
    phone: '',
    role: 'buyer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // Multi-step form
  const [validationErrors, setValidationErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  // Validation rules
  const validateField = (name, value) => {
    const errors = {};

    switch (name) {
      case 'email':
        if (!value.trim()) {
          errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else if (value.length > 254) {
          errors.email = 'Email is too long (max 254 characters)';
        }
        break;

      case 'password':
        if (!value) {
          errors.password = 'Password is required';
        } else if (value.length < 8) {
          errors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])/.test(value)) {
          errors.password = 'Password must contain at least one lowercase letter';
        } else if (!/(?=.*[A-Z])/.test(value)) {
          errors.password = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*\d)/.test(value)) {
          errors.password = 'Password must contain at least one number';
        } else if (!/(?=.*[@$!%*?&])/.test(value)) {
          errors.password = 'Password must contain at least one special character (@$!%*?&)';
        } else if (value.length > 128) {
          errors.password = 'Password is too long (max 128 characters)';
        }
        break;

      case 'name':
        if (!value.trim()) {
          errors.name = 'Full name is required';
        } else if (value.trim().length < 2) {
          errors.name = 'Name must be at least 2 characters';
        } else if (value.trim().length > 100) {
          errors.name = 'Name is too long (max 100 characters)';
        } else if (!/^[a-zA-Z\s\-'\.]+$/.test(value.trim())) {
          errors.name = 'Name can only contain letters, spaces, hyphens, apostrophes, and periods';
        }
        break;

      case 'company':
        if (!value.trim()) {
          errors.company = 'Company name is required';
        } else if (value.trim().length < 2) {
          errors.company = 'Company name must be at least 2 characters';
        } else if (value.trim().length > 200) {
          errors.company = 'Company name is too long (max 200 characters)';
        }
        break;

      case 'phone':
        if (!value.trim()) {
          errors.phone = 'Phone number is required';
        } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
          errors.phone = 'Please enter a valid phone number';
        } else if (value.replace(/[\s\-\(\)]/g, '').length < 10) {
          errors.phone = 'Phone number must be at least 10 digits';
        } else if (value.replace(/[\s\-\(\)]/g, '').length > 15) {
          errors.phone = 'Phone number is too long (max 15 digits)';
        }
        break;

      case 'role':
        if (!value) {
          errors.role = 'Please select your role';
        } else if (!['buyer', 'vendor'].includes(value)) {
          errors.role = 'Please select a valid role';
        }
        break;

      default:
        break;
    }

    return errors;
  };

  const validateForm = () => {
    const errors = {};
    
    Object.keys(formData).forEach(field => {
      const fieldErrors = validateField(field, formData[field]);
      if (fieldErrors[field]) {
        errors[field] = fieldErrors[field];
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear previous error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Mark field as touched
    setTouchedFields(prev => ({ ...prev, [name]: true }));
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    
    const fieldErrors = validateField(name, value);
    setValidationErrors(prev => ({ ...prev, [name]: fieldErrors[name] || '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Mark all fields as touched for validation display
    const allFieldsTouched = Object.keys(formData).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouchedFields(allFieldsTouched);
    
    // Validate form before submission
    if (!validateForm()) {
      setError('Please fix the validation errors below');
      return;
    }

    setLoading(true);

    try {
      // Trim whitespace from all fields
      const cleanedData = {
        ...formData,
        email: formData.email.trim(),
        name: formData.name.trim(),
        company: formData.company.trim(),
        phone: formData.phone.trim(),
      };
      
      await authAPI.register(cleanedData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      // Handle different types of errors
      if (err.response?.status === 409) {
        setError('This email is already registered. Please try logging in or use a different email.');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.detail || 'Invalid data provided. Please check your information.');
      } else if (err.response?.status === 422) {
        // Handle validation errors from server
        const serverErrors = err.response?.data?.detail || [];
        if (Array.isArray(serverErrors)) {
          const fieldErrors = {};
          serverErrors.forEach(error => {
            if (error.loc && error.loc.length > 1) {
              const fieldName = error.loc[1];
              fieldErrors[fieldName] = error.msg;
            }
          });
          setValidationErrors(prev => ({ ...prev, ...fieldErrors }));
          setError('Please fix the validation errors below');
        } else {
          setError(err.response?.data?.detail || 'Validation failed');
        }
      } else {
        setError('Registration failed. Please try again or contact support if the problem persists.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Side - Premium Dark Visual */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-gray-900 via-gray-950 to-black items-center justify-center p-8 xl:p-12 relative overflow-hidden">
        {/* Back to Home - On Dark Side */}
        <Link
          to="/"
          className="absolute top-6 left-6 z-50 flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group"
        >
          <Home className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
          <span className="font-medium text-sm">Back to Home</span>
        </Link>

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Accent Glows */}
        <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-primary-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-[350px] h-[350px] bg-primary-500/10 rounded-full blur-[80px]"></div>

        <div className="relative z-10 max-w-sm w-full">
          <SlideUp delay={300}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-xs font-semibold mb-5">
                <Sparkles className="h-4 w-4" />
                Join ProcureHub
              </div>
              
              <h2 className="text-2xl xl:text-3xl font-bold text-white mb-2 leading-tight">
                Start Your
                <span className="text-primary-400"> Procurement Journey</span>
              </h2>
              
              <p className="text-sm text-gray-400 leading-relaxed">
                Unlock powerful procurement tools with AI-driven insights.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-2.5 mb-6">
              {[
                { icon: Zap, text: 'Setup in 2 minutes', desc: 'Quick onboarding' },
                { icon: Shield, text: 'Enterprise security', desc: 'Bank-level encryption' },
                { icon: CheckCircle, text: 'No credit card needed', desc: 'Start free today' }
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 group">
                  <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="h-5 w-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{benefit.text}</p>
                    <p className="text-gray-500 text-xs">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/5">
              <div className="text-center">
                <p className="text-xl font-bold text-primary-400">500+</p>
                <p className="text-xs text-gray-500">Companies</p>
              </div>
              <div className="text-center border-x border-white/5">
                <p className="text-xl font-bold text-white">50+</p>
                <p className="text-xs text-gray-500">Countries</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-primary-400">Free</p>
                <p className="text-xs text-gray-500">To Start</p>
              </div>
            </div>
          </SlideUp>
        </div>
      </div>

      {/* Right Side - Form (White Background) */}
      <div className="w-full lg:w-[55%] bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 overflow-y-auto min-h-screen">
        {/* Mobile Back to Home */}
        <Link
          to="/"
          className="lg:hidden absolute top-4 left-4 z-50 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors duration-300 group"
        >
          <Home className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
          <span className="font-medium text-sm">Home</span>
        </Link>

        <div className="max-w-md w-full py-6">
          <FadeIn>
            {/* Success Message */}
            {success && (
              <ScaleIn>
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-sm">Account Created!</p>
                      <p className="text-xs text-green-600">Redirecting to login...</p>
                    </div>
                  </div>
                </div>
              </ScaleIn>
            )}

            {/* Header */}
            <div className="mb-5 mt-8 lg:mt-0">
              <SlideUp>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Create Account
                </h1>
                <p className="text-sm text-gray-500">
                  Join <span className="text-primary-600 font-semibold">500+</span> companies on ProcureHub
                </p>
              </SlideUp>
            </div>

            {/* Role Selection Cards */}
            <SlideUp delay={100}>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  I want to register as: <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'buyer' })}
                    className={`
                      relative p-3 rounded-lg border-2 transition-all duration-300
                      ${formData.role === 'buyer' 
                        ? 'bg-primary-50 border-primary-500' 
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <ShoppingBag className={`h-6 w-6 mx-auto mb-1 ${formData.role === 'buyer' ? 'text-primary-600' : 'text-gray-400'}`} />
                    <p className={`font-semibold text-sm ${formData.role === 'buyer' ? 'text-primary-700' : 'text-gray-600'}`}>
                      Buyer
                    </p>
                    <p className={`text-xs ${formData.role === 'buyer' ? 'text-primary-600' : 'text-gray-400'}`}>
                      I want to procure
                    </p>
                    {formData.role === 'buyer' && (
                      <div className="absolute top-1.5 right-1.5">
                        <CheckCircle className="h-4 w-4 text-primary-600" />
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'vendor' })}
                    className={`
                      relative p-3 rounded-lg border-2 transition-all duration-300
                      ${formData.role === 'vendor' 
                        ? 'bg-gray-100 border-gray-500' 
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <Briefcase className={`h-6 w-6 mx-auto mb-1 ${formData.role === 'vendor' ? 'text-gray-700' : 'text-gray-400'}`} />
                    <p className={`font-semibold text-sm ${formData.role === 'vendor' ? 'text-gray-800' : 'text-gray-600'}`}>
                      Vendor
                    </p>
                    <p className={`text-xs ${formData.role === 'vendor' ? 'text-gray-600' : 'text-gray-400'}`}>
                      I want to supply
                    </p>
                    {formData.role === 'vendor' && (
                      <div className="absolute top-1.5 right-1.5">
                        <CheckCircle className="h-4 w-4 text-gray-700" />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </SlideUp>

            {/* Error Message */}
            {error && (
              <ScaleIn>
                <div className="mb-3 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg">
                  <p className="font-semibold text-sm">Registration Failed</p>
                  <p className="text-xs mt-0.5 text-red-500">{error}</p>
                </div>
              </ScaleIn>
            )}

            {/* Registration Form */}
            <SlideUp delay={200}>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {/* Full Name */}
                  <div className="group">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <User className={`h-4 w-4 ${validationErrors.name && touchedFields.name ? 'text-red-400' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="text"
                        name="name"
                        required
                        className={`w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder-gray-400 text-gray-900 ${
                          validationErrors.name && touchedFields.name
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-200 focus:ring-primary-500'
                        }`}
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                      />
                    </div>
                    {validationErrors.name && touchedFields.name && (
                      <p className="mt-0.5 text-xs text-red-500">{validationErrors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="group">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <Mail className={`h-4 w-4 ${validationErrors.email && touchedFields.email ? 'text-red-400' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        required
                        className={`w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder-gray-400 text-gray-900 ${
                          validationErrors.email && touchedFields.email
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-200 focus:ring-primary-500'
                        }`}
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                      />
                    </div>
                    {validationErrors.email && touchedFields.email && (
                      <p className="mt-0.5 text-xs text-red-500">{validationErrors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="group">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <Lock className={`h-4 w-4 ${validationErrors.password && touchedFields.password ? 'text-red-400' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        required
                        className={`w-full pl-8 pr-8 py-2 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder-gray-400 text-gray-900 ${
                          validationErrors.password && touchedFields.password
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-200 focus:ring-primary-500'
                        }`}
                        placeholder="Create password"
                        value={formData.password}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-primary-500"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {validationErrors.password && touchedFields.password && (
                      <p className="mt-0.5 text-xs text-red-500">{validationErrors.password}</p>
                    )}
                  </div>

                  {/* Company */}
                  <div className="group">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Company <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <Building2 className={`h-4 w-4 ${validationErrors.company && touchedFields.company ? 'text-red-400' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="text"
                        name="company"
                        required
                        className={`w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder-gray-400 text-gray-900 ${
                          validationErrors.company && touchedFields.company
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-200 focus:ring-primary-500'
                        }`}
                        placeholder="Company Ltd."
                        value={formData.company}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                      />
                    </div>
                    {validationErrors.company && touchedFields.company && (
                      <p className="mt-0.5 text-xs text-red-500">{validationErrors.company}</p>
                    )}
                  </div>
                </div>

                {/* Password Requirements - Compact */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
                  <span className={formData.password?.length >= 8 ? 'text-green-600' : ''}>• 8+ chars</span>
                  <span className={/(?=.*[A-Z])/.test(formData.password || '') ? 'text-green-600' : ''}>• Uppercase</span>
                  <span className={/(?=.*\d)/.test(formData.password || '') ? 'text-green-600' : ''}>• Number</span>
                  <span className={/(?=.*[@$!%*?&])/.test(formData.password || '') ? 'text-green-600' : ''}>• Special</span>
                </div>

                {/* Phone */}
                <div className="group">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <Phone className={`h-4 w-4 ${validationErrors.phone && touchedFields.phone ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      className={`w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder-gray-400 text-gray-900 ${
                        validationErrors.phone && touchedFields.phone
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-gray-200 focus:ring-primary-500'
                      }`}
                      placeholder="+1 (234) 567-890"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                    />
                  </div>
                  {validationErrors.phone && touchedFields.phone && (
                    <p className="mt-0.5 text-xs text-red-500">{validationErrors.phone}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || success}
                  className={`group w-full py-2.5 rounded-lg font-semibold text-sm ${
                    loading || success ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'
                  } text-white shadow-md shadow-primary-600/20 transition-all duration-300 hover:shadow-lg disabled:shadow-none mt-2`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Creating...
                    </span>
                  ) : success ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Created!
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Create Account
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </form>
            </SlideUp>

            {/* Login Link */}
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-500">Already have an account? </span>
              <Link to="/login" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">
                Login
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default Register;
