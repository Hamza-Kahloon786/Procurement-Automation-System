import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { setToken, setUser } from '../utils/auth';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Home, 
  Eye, 
  EyeOff,
  Sparkles,
  Shield,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { FadeIn, SlideUp, ScaleIn } from '../components/common/AnimatedComponents';
import { buttonAnimations } from '../utils/animations';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      setToken(response.data.access_token);

      const userResponse = await authAPI.getMe();
      setUser(userResponse.data);

      const role = userResponse.data.role;
      if (role === 'buyer') navigate('/buyer');
      else if (role === 'vendor') navigate('/vendor');
      else if (role === 'admin') navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Side - Form (White Background) */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-6 lg:p-12 relative z-10">
        {/* Back to Home */}
        <Link
          to="/"
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors duration-300 group"
        >
          <Home className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300" />
          <span className="font-medium text-sm sm:text-base">Back to Home</span>
        </Link>

        <div className="max-w-md w-full">
          <FadeIn>
            {/* Header */}
            <div className="text-center mb-8 sm:mb-10">
              <SlideUp>
                <div className="relative inline-flex mb-4 sm:mb-6">
                  <div className="absolute inset-0 bg-primary-600/20 blur-2xl rounded-full"></div>
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center transform hover:rotate-6 transition-all duration-500 shadow-lg shadow-primary-600/30">
                    <Sparkles className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                  </div>
                </div>
              </SlideUp>

              <SlideUp delay={100}>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Welcome Back
                </h1>
                <p className="text-sm sm:text-base text-gray-500">
                  Login to your <span className="text-primary-600 font-semibold">ProcureHub</span> account
                </p>
              </SlideUp>
            </div>

            {/* Error Message */}
            {error && (
              <ScaleIn>
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
                  <p className="font-semibold">Login Failed</p>
                  <p className="text-sm mt-1 text-red-500">{error}</p>
                </div>
              </ScaleIn>
            )}

            {/* Login Form */}
            <SlideUp delay={200}>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 group-hover:text-primary-500 transition-colors duration-300" />
                    </div>
                    <input
                      type="email"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 hover:border-gray-300 placeholder-gray-400"
                      placeholder="you@example.com"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-hover:text-primary-500 transition-colors duration-300" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 hover:border-gray-300 placeholder-gray-400"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary-500 transition-colors duration-300"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-600 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 accent-primary-600 rounded" />
                    <span className="group-hover:text-gray-900 transition-colors duration-300">Remember me</span>
                  </label>
                  <button type="button" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-300">
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`group relative w-full py-3.5 rounded-xl font-semibold text-base overflow-hidden ${
                    loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'
                  } text-white shadow-lg shadow-primary-600/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary-600/30 disabled:shadow-none`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Logging in...
                    </span>
                  ) : (
                    <span className="relative flex items-center justify-center gap-2">
                      Login to Dashboard
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  )}
                </button>
              </form>
            </SlideUp>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">New to ProcureHub?</span>
              </div>
            </div>

            {/* Register Link */}
            <SlideUp delay={300}>
              <div className="text-center">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-300 group"
                >
                  Don't have an account?
                  <span className="text-primary-600 group-hover:text-primary-700 flex items-center gap-1 font-semibold">
                    Create one now
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>
              </div>
            </SlideUp>
          </FadeIn>
        </div>
      </div>

      {/* Right Side - Premium Dark Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-950 to-black items-center justify-center p-12 relative overflow-hidden">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Accent Glows */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary-600/8 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary-500/8 rounded-full blur-[120px]"></div>

        <div className="relative z-10 max-w-md w-full">
          <SlideUp delay={400}>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-xs font-semibold mb-6">
                <Sparkles className="h-4 w-4" />
                Secure Platform
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
                Access Your
                <span className="text-primary-400"> Procurement Hub</span>
              </h2>
              
              <p className="text-sm text-gray-400 leading-relaxed">
                Manage vendors, compare quotations, and streamline procurement with AI-powered insights.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3 mb-8">
              {[
                { icon: Shield, text: 'Enterprise-grade security', desc: '256-bit encryption' },
                { icon: Zap, text: 'Lightning-fast performance', desc: '99.9% uptime' },
                { icon: CheckCircle2, text: 'AI-powered insights', desc: 'Smart recommendations' }
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-xl border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 group">
                  <div className="w-11 h-11 bg-primary-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-5 w-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{feature.text}</p>
                    <p className="text-gray-500 text-xs">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-white/[0.02] rounded-2xl border border-white/5">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-400">500+</p>
                <p className="text-xs text-gray-500">Companies</p>
              </div>
              <div className="text-center border-x border-white/5">
                <p className="text-2xl font-bold text-white">10K+</p>
                <p className="text-xs text-gray-500">Requests</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-400">99.9%</p>
                <p className="text-xs text-gray-500">Uptime</p>
              </div>
            </div>
          </SlideUp>
        </div>
      </div>
    </div>
  );
};

export default Login;
