







import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import ChatBot from '../components/ChatBot';
import {
  Sparkles,
  Rocket,
  Target,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  CheckCircle2,
  ArrowRight,
  Star,
  BarChart3,
  FileCheck,
  MessageCircle,
  Clock,
  Award,
  Users,
  Package,
  DollarSign,
  ChevronRight,
  ChevronDown,
  Play,
  Layers,
  Lock,
  Bell,
  Brain,
  Infinity,
  Code2,
  Workflow,
  LineChart,
  PieChart,
  Quote,
  Search,
  HelpCircle,
  Minus
} from 'lucide-react';
import { FadeIn, SlideUp, ScaleIn, CountUp, Float, ScrollReveal } from '../components/common/AnimatedComponents';
import { cardAnimations, buttonAnimations } from '../utils/animations';

const Landing = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState({});
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const heroRef = useRef(null);
  const cursorRef = useRef(null);

  // Advanced Mouse Tracking for Parallax & Cursor Effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Intersection Observer for Scroll Animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Parallax effect calculation - disabled on mobile for performance
  const getParallaxStyle = (speed = 20) => {
    if (!heroRef.current || typeof window === 'undefined' || window.innerWidth < 768) return {};
    return {
      transform: `translate(${(mousePosition.x - window.innerWidth / 2) / speed}px, ${(mousePosition.y - window.innerHeight / 2) / speed}px)`,
    };
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Custom Cursor - Hidden on Mobile */}
      <div
        ref={cursorRef}
        className="hidden md:block fixed w-6 h-6 border-2 border-primary-500 rounded-full pointer-events-none z-50 transition-all duration-100 mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      
      <Header />

      {/* Demo Video Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowDemoModal(false)}>
          <div 
            className="relative w-full max-w-4xl bg-gradient-to-br from-gray-900 to-black rounded-xl sm:rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/10">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-600/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Play className="h-4 w-4 sm:h-5 sm:w-5 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm sm:text-base">Platform Demo</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">See ProcureHub in action</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDemoModal(false)}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-white/5 hover:bg-white/10 rounded-lg sm:rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Video Content */}
            <div className="aspect-video bg-black relative">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&rel=0"
                title="ProcureHub Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            {/* Modal Footer */}
            <div className="p-3 sm:p-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
                <span className="flex items-center gap-1 sm:gap-1.5">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  2:30 min
                </span>
                <span className="hidden sm:flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  10k+ views
                </span>
              </div>
              <Link 
                to="/register"
                className="px-4 sm:px-6 py-1.5 sm:py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold text-xs sm:text-sm transition-colors"
                onClick={() => setShowDemoModal(false)}
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ============================================= */}
      {/* HERO SECTION - FULLY MOBILE RESPONSIVE        */}
      {/* ============================================= */}
      <section ref={heroRef} className="relative min-h-[100svh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        
        {/* Dynamic Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ff000008_1px,transparent_1px),linear-gradient(to_bottom,#ff000008_1px,transparent_1px)] bg-[size:40px_40px] sm:bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
        
        {/* Morphing Blobs - Scaled down on mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-1/4 -left-16 sm:-left-32 lg:-left-48 w-[180px] sm:w-[400px] lg:w-[600px] h-[180px] sm:h-[400px] lg:h-[600px] bg-primary-600/20 sm:bg-primary-600/30 rounded-full blur-3xl animate-pulse-slow"
            style={{ ...getParallaxStyle(30), animation: 'morph 8s ease-in-out infinite' }}
          ></div>
          <div 
            className="absolute bottom-1/4 -right-16 sm:-right-32 lg:-right-48 w-[150px] sm:w-[350px] lg:w-[500px] h-[150px] sm:h-[350px] lg:h-[500px] bg-primary-500/15 sm:bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow"
            style={{ ...getParallaxStyle(25), animationDelay: '2s', animation: 'morph 10s ease-in-out infinite' }}
          ></div>
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[220px] sm:w-[500px] lg:w-[700px] h-[220px] sm:h-[500px] lg:h-[700px] bg-primary-600/10 rounded-full blur-3xl animate-float"
            style={{ ...getParallaxStyle(35) }}
          ></div>
        </div>

        {/* Particle Effect Overlay */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(255,0,0,0.03) 100%)' }}></div>

        <div className="max-w-7xl mx-auto relative z-10 py-20 sm:py-16 lg:py-24 w-full">
          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-20 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left space-y-4 sm:space-y-6 lg:space-y-8 lg:pr-4">
              {/* Floating Badge with Glow */}
              <FadeIn>
                <div className="relative inline-flex">
                  <div className="absolute inset-0 bg-primary-600/50 blur-2xl rounded-full"></div>
                  <div className="relative flex items-center gap-1.5 sm:gap-2 lg:gap-3 px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 bg-gradient-to-r from-primary-600/20 to-primary-800/20 border border-primary-500/30 rounded-full text-primary-400 text-[10px] sm:text-xs lg:text-sm font-medium backdrop-blur-xl shadow-2xl">
                    <div className="relative flex items-center gap-1 sm:gap-2">
                      <div className="absolute inset-0 bg-primary-600/30 blur-xl rounded-full animate-pulse"></div>
                      <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 relative z-10 animate-spin-slow" />
                    </div>
                    <span className="bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent font-semibold whitespace-nowrap">
                      AI-Powered Procurement Platform
                    </span>
                    <div className="relative">
                      <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-full w-full bg-primary-500"></span>
                      </span>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Hero Heading - Properly scaled for mobile */}
              <SlideUp delay={100}>
                <h1 className="text-[2rem] leading-[1.1] sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight">
                  <span className="block" style={{ textShadow: '0 0 80px rgba(255,0,0,0.5)' }}>
                    Revolutionize
                  </span>
                  <span className="block mt-1 sm:mt-2 lg:mt-3 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-800 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]" style={{ 
                    textShadow: '0 0 100px rgba(255,0,0,0.8)',
                    transform: 'perspective(1000px) rotateX(5deg)'
                  }}>
                    Procurement
                  </span>
                </h1>
              </SlideUp>

              {/* Subtitle - Better mobile text size */}
              <SlideUp delay={200}>
                <p className="text-[13px] leading-relaxed sm:text-base md:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 font-light">
                  Harness the power of{' '}
                  <span className="text-primary-400 font-semibold relative inline-block">
                    <span className="absolute inset-0 bg-primary-600/20 blur-xl"></span>
                    <span className="relative">AI-driven insights</span>
                  </span>
                  {' '}to streamline vendor management, automate quotation analysis, and unlock unprecedented cost savings
                </p>
              </SlideUp>

              {/* CTA Buttons - Stack on mobile, row on sm+ */}
              <SlideUp delay={300}>
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center pt-2 sm:pt-4 lg:pt-6">
                  {/* Primary CTA */}
                  <Link
                    to="/register"
                    className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 lg:py-4 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 text-white rounded-xl font-bold text-sm sm:text-base overflow-hidden shadow-2xl shadow-primary-600/50 hover:shadow-primary-600/80 transition-all duration-300 bg-[length:200%_auto] hover:bg-right"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      <Rocket className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform duration-300" />
                      Get Started Free
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-xl"></div>
                  </Link>
                  
                  {/* Watch Demo CTA */}
                  <button 
                    onClick={() => setShowDemoModal(true)}
                    className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 lg:py-4 bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white rounded-xl font-bold text-sm sm:text-base border border-white/10 hover:border-primary-500/50 transition-all duration-300 shadow-xl"
                  >
                    <span className="flex items-center justify-center gap-2 sm:gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary-600/30 blur-lg rounded-full group-hover:bg-primary-600/50 transition-all duration-300"></div>
                        <div className="relative w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Play className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 ml-0.5" />
                        </div>
                      </div>
                      <span className="whitespace-nowrap">Watch Demo</span>
                    </span>
                  </button>
                </div>
              </SlideUp>
            </div>

            {/* Right Column - Hero Image (desktop only) */}
            <SlideUp delay={200}>
              <div className="relative hidden lg:block">
                <div className="absolute -inset-6 bg-gradient-to-r from-primary-600/20 via-primary-500/10 to-primary-600/20 blur-3xl rounded-3xl"></div>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/50 via-primary-600/30 to-primary-500/50 rounded-3xl blur-sm"></div>
                  <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-sm">
                    <img 
                      src="/hero.png" 
                      alt="ProcureHub - AI-Powered Procurement Platform" 
                      className="w-full h-[380px] xl:h-[380px] object-cover rounded-2xl opacity-95 hover:opacity-100 transition-all duration-500 hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none rounded-2xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-transparent pointer-events-none rounded-2xl"></div>
                  </div>
                </div>
              </div>
            </SlideUp>
          </div>

          {/* Trust Indicators - Infinite Scroll Marquee */}
          <div className="mt-10 sm:mt-12 lg:mt-16">
            <SlideUp delay={400}>
              <div className="space-y-6">
                <div className="relative w-full overflow-hidden">
                  {/* Gradient fades - narrower on mobile */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-20 lg:w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-20 lg:w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
                  
                  <div className="flex animate-marquee">
                    {[0, 1].map((setIndex) => (
                      <div key={setIndex} className="flex items-center gap-3 sm:gap-6 lg:gap-10 px-2 sm:px-4">
                        {[
                          { name: 'ACME Corp', icon: '🏢' },
                          { name: 'TechFlow', icon: '⚡' },
                          { name: 'GlobalX', icon: '🌍' },
                          { name: 'Nexus AI', icon: '🤖' },
                          { name: 'Vertex', icon: '📊' },
                          { name: 'Quantum', icon: '⚛️' },
                          { name: 'Synergy', icon: '🔗' },
                          { name: 'Apex Inc', icon: '🚀' },
                          { name: 'Fusion', icon: '💫' },
                          { name: 'Nova Tech', icon: '✨' },
                          { name: 'CloudBase', icon: '☁️' },
                          { name: 'DataCore', icon: '💾' },
                        ].map((company, i) => (
                          <div
                            key={`${setIndex}-${i}`}
                            className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 px-2.5 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 bg-white/[0.03] border border-white/10 rounded-lg sm:rounded-xl hover:bg-white/[0.08] hover:border-primary-500/30 transition-all duration-300 cursor-pointer group whitespace-nowrap"
                          >
                            <span className="text-sm sm:text-lg lg:text-xl">{company.icon}</span>
                            <span className="text-white/80 group-hover:text-white font-semibold text-[10px] sm:text-xs lg:text-sm tracking-wide">{company.name}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SlideUp>
          </div>

          {/* 3D Floating Dashboard Preview */}
          <SlideUp delay={500}>
            <div className="relative mt-10 sm:mt-14 lg:mt-24 max-w-6xl mx-auto lg:perspective-[2000px]">
              {/* Glow Effect */}
              <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-primary-600/20 sm:from-primary-600/30 via-primary-500/20 sm:via-primary-500/30 to-primary-600/20 sm:to-primary-600/30 blur-2xl sm:blur-3xl opacity-50 animate-pulse-slow"></div>
              
              {/* 3D Container - Only apply 3D on lg+ */}
              <div 
                className="relative transform-gpu transition-all duration-700 ease-out lg:hover:scale-105"
                style={typeof window !== 'undefined' && window.innerWidth >= 1024 ? { 
                  transform: `perspective(2000px) rotateX(${(mousePosition.y - window.innerHeight / 2) / 100}deg) rotateY(${(mousePosition.x - window.innerWidth / 2) / 100}deg)`,
                  transformStyle: 'preserve-3d'
                } : {}}
              >
                <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-white/10 sm:border-2 rounded-xl sm:rounded-2xl lg:rounded-3xl p-1 sm:p-2 shadow-2xl backdrop-blur-xl overflow-hidden">
                  {/* Browser Chrome */}
                  <div className="flex items-center justify-between px-2 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-4 bg-gradient-to-r from-gray-900 to-black border-b border-white/5">
                    <div className="flex gap-1 sm:gap-1.5 lg:gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-3 lg:h-3 bg-red-500 rounded-full"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-3 lg:h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-3 lg:h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="hidden sm:flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-1 sm:py-2 bg-white/5 rounded-lg sm:rounded-xl border border-white/10">
                        <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                        <span className="text-[10px] sm:text-xs text-gray-400 font-mono">procurement-portal.app</span>
                      </div>
                    </div>
                    <div className="hidden sm:flex gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/5 rounded-lg"></div>
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/5 rounded-lg"></div>
                    </div>
                  </div>
                  
                  {/* Dashboard Image - full width on mobile */}
                  <div className="relative bg-black rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden flex justify-center">
                    <img 
                      src="/admin.png" 
                      alt="ProcureHub Admin Dashboard - Professional Analytics Interface" 
                      className="w-full sm:w-[90%] lg:w-[85%] xl:w-[80%] h-auto object-cover rounded-lg sm:rounded-xl lg:rounded-2xl opacity-95 hover:opacity-100 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-transparent pointer-events-none"></div>
                  </div>
                </div>
              </div>
            </div>
          </SlideUp>
        </div>

        {/* Scroll Indicator - hidden on mobile */}
        <div className="hidden sm:block absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <span className="text-xs font-medium">Scroll to explore</span>
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 rotate-90" />
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* FEATURES SECTION - MOBILE RESPONSIVE CARDS    */}
      {/* ============================================= */}
      <section id="features" className="relative py-16 sm:py-24 lg:py-40 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-gray-900 to-black" data-animate>
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-24">
            <ScrollReveal animation="slideUp">
              <div className="relative inline-flex mb-6">
                <div className="absolute inset-0 bg-primary-600/30 blur-2xl rounded-full"></div>
                <div className="relative flex items-center gap-2 px-5 py-2 bg-primary-600/10 border border-primary-500/20 rounded-full text-primary-400 text-sm font-semibold backdrop-blur-sm">
                  <Zap className="h-4 w-4" />
                  Premium Features
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="slideUp" delay={100}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 leading-tight">
                Everything You Need
                <br />
                <span className="bg-gradient-to-r from-primary-400 via-primary-600 to-primary-800 bg-clip-text text-transparent">
                  And More
                </span>
              </h2>
            </ScrollReveal>
            
            <ScrollReveal animation="slideUp" delay={200}>
              <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Enterprise-grade features powered by cutting-edge AI technology
              </p>
            </ScrollReveal>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                icon: Brain,
                title: 'AI-Powered Intelligence',
                description: 'Advanced ML algorithms analyze vendor proposals and recommend optimal choices based on historical data and market trends',
                gradient: 'from-primary-600 via-primary-700 to-primary-900',
                backGradient: 'from-primary-800 via-primary-900 to-black',
                iconBg: 'from-primary-500 to-primary-700',
                features: ['Smart Recommendations', 'Predictive Analytics', 'Auto-categorization'],
                delay: 0
              },
              {
                icon: Globe,
                title: 'Global Marketplace',
                description: 'Access worldwide network of verified vendors with real-time quotations and instant communication channels',
                gradient: 'from-gray-800 via-gray-900 to-black',
                backGradient: 'from-gray-900 via-black to-gray-900',
                iconBg: 'from-gray-600 to-gray-800',
                features: ['1000+ Vendors', '50+ Countries', '24/7 Support'],
                delay: 100
              },
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                description: 'Real-time dashboards with comprehensive insights into spending patterns, vendor performance metrics, and cost optimization',
                gradient: 'from-primary-700 via-primary-800 to-black',
                backGradient: 'from-primary-900 via-black to-primary-900',
                iconBg: 'from-primary-600 to-primary-800',
                features: ['Real-time Data', 'Custom Reports', 'Export Options'],
                delay: 200
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                description: 'Bank-level encryption with SOC 2 compliance, role-based access controls, and comprehensive audit trails',
                gradient: 'from-gray-900 via-black to-gray-900',
                backGradient: 'from-black via-gray-900 to-black',
                iconBg: 'from-gray-700 to-gray-900',
                features: ['256-bit Encryption', 'SOC 2 Certified', 'GDPR Compliant'],
                delay: 300
              },
              {
                icon: Workflow,
                title: 'Automated Workflows',
                description: 'Streamline approvals and automate routine tasks intelligently with customizable rules and smart routing',
                gradient: 'from-primary-600 via-primary-800 to-black',
                backGradient: 'from-primary-800 via-black to-primary-900',
                iconBg: 'from-primary-500 to-primary-700',
                features: ['Auto-approvals', 'Custom Rules', 'Email Alerts'],
                delay: 400
              },
              {
                icon: Infinity,
                title: 'Unlimited Scale',
                description: 'Enterprise-grade infrastructure that grows seamlessly with your business, handling millions of transactions',
                gradient: 'from-gray-800 via-gray-900 to-black',
                backGradient: 'from-gray-900 via-black to-gray-800',
                iconBg: 'from-gray-700 to-gray-900',
                features: ['No Limits', 'Auto-scaling', '99.9% Uptime'],
                delay: 500
              }
            ].map((feature, index) => (
              <ScrollReveal key={index} animation="scale" delay={feature.delay}>
                <div className="group sm:h-[280px] sm:[perspective:1000px]">
                  
                  {/* ===== MOBILE CARD (no flip) ===== */}
                  <div className="sm:hidden">
                    <div className={`relative bg-gradient-to-br ${feature.gradient} rounded-xl border border-white/10 p-4 overflow-hidden`}>
                      <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl"></div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${feature.iconBg} rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20 flex-shrink-0`}>
                            <feature.icon className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="text-base font-bold text-white leading-tight">
                            {feature.title}
                          </h3>
                        </div>
                        <p className="text-[13px] text-gray-200 leading-relaxed mb-3">
                          {feature.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {feature.features.map((item, i) => (
                            <div key={i} className="flex items-center gap-1 px-2 py-0.5 bg-white/5 rounded-md">
                              <CheckCircle2 className="h-3 w-3 text-primary-400 flex-shrink-0" />
                              <span className="text-[11px] text-gray-300 font-medium">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ===== DESKTOP FLIP CARD ===== */}
                  <div className="hidden sm:block relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    {/* Front Face */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl border border-white/10 p-5 sm:p-6 [backface-visibility:hidden] overflow-hidden`}>
                      <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl"></div>
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-14 h-14 bg-gradient-to-br ${feature.iconBg} rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 flex-shrink-0`}>
                            <feature.icon className="h-7 w-7 text-white" />
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                            {feature.title}
                          </h3>
                        </div>
                        <div className="flex-1 flex flex-col justify-center mb-4">
                          <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-medium">
                            {feature.description}
                          </p>
                        </div>
                        <div className="mb-3 space-y-1.5">
                          {feature.features.slice(0, 2).map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-primary-400 flex-shrink-0" />
                              <span className="text-xs text-gray-300 font-medium">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Back Face */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.backGradient} rounded-2xl border border-primary-500/30 p-5 sm:p-6 [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden`}>
                      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-primary-600/30 rounded-full blur-3xl"></div>
                      <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                          <div className={`w-8 h-8 bg-gradient-to-br ${feature.iconBg} rounded-lg flex items-center justify-center`}>
                            <feature.icon className="h-4 w-4 text-white" />
                          </div>
                          <h4 className="text-base font-bold text-white">{feature.title}</h4>
                        </div>
                        <div className="space-y-2 py-3">
                          {feature.features.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                              <CheckCircle2 className="h-4 w-4 text-primary-400 flex-shrink-0" />
                              <span className="text-sm text-white font-medium">{item}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-center gap-2 text-primary-400 text-xs font-semibold pt-2 border-t border-white/10">
                          <Sparkles className="h-3 w-3" />
                          <span>Premium Feature</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* BELOW SECTIONS WERE ALREADY RESPONSIVE        */}
      {/* ============================================= */}

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 overflow-hidden" data-animate>
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.08),transparent_70%)]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <ScrollReveal animation="slideUp">
              <span className="inline-block px-4 py-1.5 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-xs font-semibold tracking-widest uppercase mb-6">
                How It Works
              </span>
            </ScrollReveal>
            
            <ScrollReveal animation="slideUp" delay={100}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6">
                Four Simple Steps to
                <span className="block mt-2 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                  Smarter Procurement
                </span>
              </h2>
            </ScrollReveal>
            
            <ScrollReveal animation="slideUp" delay={200}>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Our streamlined process gets you from signup to savings in minutes
              </p>
            </ScrollReveal>
          </div>

          {/* Horizontal Timeline - Desktop */}
          <div className="hidden lg:block mb-12">
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-primary-600/0 via-primary-600/50 to-primary-600/0 transform -translate-y-1/2"></div>
              <div className="relative flex justify-between">
                {['01', '02', '03', '04'].map((num, i) => (
                  <div key={i} className="relative flex flex-col items-center">
                    <div className="w-14 h-14 bg-black border-2 border-primary-500/50 rounded-full flex items-center justify-center group hover:border-primary-400 hover:scale-110 transition-all duration-300 cursor-pointer">
                      <span className="text-primary-400 font-black text-lg">{num}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Steps Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
            {[
              { num: '01', title: 'Create Account', desc: 'Quick signup with email or SSO. Your dashboard is ready instantly with all features unlocked from day one.', icon: Users, highlight: 'Free forever', details: 'No credit card required • Instant access • Full features' },
              { num: '02', title: 'Submit Request', desc: 'Use AI-powered to describe exactly what you need. Our system understands your requirements automatically.', icon: FileCheck, highlight: 'AI-assisted', details: 'Smart forms • Auto-categorization • Instant validation' },
              { num: '03', title: 'Get Quotations', desc: 'Receive competitive bids from our network of 1000+ vendors. Real-time notifications keep you updated.', icon: MessageCircle, highlight: 'Real-time bids', details: '1000+ vendors • Live updates • Competitive pricing' },
              { num: '04', title: 'Compare & Award', desc: 'Smart analytics help you pick the best option instantly. Compare prices, delivery times, and vendor ratings.', icon: Target, highlight: 'AI-powered', details: 'Side-by-side comparison • Best price finder • One-click award' }
            ].map((step, i) => (
              <ScrollReveal key={i} animation="slideUp" delay={i * 100}>
                <div className="group relative h-full">
                  <div className="relative h-full bg-gradient-to-b from-gray-900/50 to-gray-950/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 hover:border-primary-500/30 transition-all duration-500 hover:-translate-y-1">
                    <div className="lg:hidden absolute -top-3 left-6">
                      <span className="px-3 py-1 bg-primary-600 rounded-lg text-white text-xs font-bold">Step {step.num}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-4 mt-2 lg:mt-0">
                      <div className="w-14 h-14 bg-primary-500/10 rounded-xl flex items-center justify-center group-hover:bg-primary-500/20 group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                        <step.icon className="h-7 w-7 text-primary-400" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-primary-50 transition-colors leading-tight">{step.title}</h3>
                    </div>
                    <p className="text-gray-300 text-base leading-relaxed mb-4 font-medium">{step.desc}</p>
                    <div className="mb-4 space-y-1.5">
                      {step.details.split(' • ').map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-primary-400 rounded-full"></div>
                          <span className="text-xs text-gray-400">{detail}</span>
                        </div>
                      ))}
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-500/15 border border-primary-500/30 rounded-full">
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
                      <span className="text-primary-300 text-sm font-semibold">{step.highlight}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal animation="slideUp" delay={500}>
            <div className="mt-20 flex flex-wrap justify-center gap-8 lg:gap-16">
              {[
                { value: '2 min', label: 'Average setup time' },
                { value: '40%', label: 'Cost reduction' },
                { value: '1000+', label: 'Active vendors' },
                { value: '24/7', label: 'Support available' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl sm:text-3xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal animation="slideUp" delay={600}>
            <div className="mt-12 text-center">
              <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-primary-600/25">
                Get Started Now
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="benefits" className="relative py-16 sm:py-24 lg:py-40 px-4 sm:px-6 lg:px-8 bg-black" data-animate>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <ScrollReveal animation="slideUp">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary-600/10 border border-primary-500/20 rounded-full text-primary-400 text-sm font-semibold mb-6 backdrop-blur-sm">
                <Star className="h-4 w-4 fill-current" />
                Customer Stories
              </div>
            </ScrollReveal>
            <ScrollReveal animation="slideUp" delay={100}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6">
                Loved by{' '}
                <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">Procurement Teams</span>
              </h2>
            </ScrollReveal>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              { quote: "This platform transformed our procurement process. We've reduced costs by 40% and cut processing time by 70%. Absolutely game-changing!", author: "Sarah Johnson", role: "Procurement Director", company: "TechCorp Inc.", rating: 5, image: "💼" },
              { quote: "The AI-powered insights helped us identify cost savings we never knew existed. The ROI was evident within the first month.", author: "Michael Chen", role: "VP of Operations", company: "Global Solutions Ltd.", rating: 5, image: "🚀" },
              { quote: "Best procurement platform we've used. The vendor network is extensive and the quotation comparison feature is incredibly intuitive.", author: "Emily Rodriguez", role: "Supply Chain Manager", company: "Manufacturing Co.", rating: 5, image: "⚡" }
            ].map((testimonial, index) => (
              <ScrollReveal key={index} animation="scale" delay={index * 100}>
                <div className={`relative bg-gradient-to-br from-gray-900 to-black p-6 sm:p-7 lg:p-8 rounded-2xl sm:rounded-3xl border border-white/10 ${cardAnimations.subtle} hover:border-primary-500/30 transition-all duration-300`}>
                  <div className="absolute top-6 right-6 text-primary-600/20"><Quote className="h-12 w-12" /></div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />))}
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-6 sm:mb-8 relative z-10 text-sm sm:text-base lg:text-lg">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center text-xl sm:text-2xl">{testimonial.image}</div>
                    <div>
                      <div className="text-white font-bold">{testimonial.author}</div>
                      <div className="text-gray-400 text-sm">{testimonial.role}</div>
                      <div className="text-gray-500 text-xs">{testimonial.company}</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-16 sm:py-24 lg:py-40 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-gray-900 to-black" data-animate>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <ScrollReveal animation="slideUp">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary-600/10 border border-primary-500/20 rounded-full text-primary-400 text-sm font-semibold mb-6 backdrop-blur-sm">
                <DollarSign className="h-4 w-4" />
                Simple Pricing
              </div>
            </ScrollReveal>
            <ScrollReveal animation="slideUp" delay={100}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6">
                Choose Your{' '}
                <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">Perfect Plan</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="slideUp" delay={200}>
              <p className="text-sm sm:text-base lg:text-lg text-gray-400 max-w-2xl mx-auto px-4">Start free, scale as you grow. No hidden fees, cancel anytime.</p>
            </ScrollReveal>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {[
              { name: 'Starter', price: 'Free', period: 'forever', description: 'Perfect for small teams getting started', features: ['5 active requests', '10 vendors', 'Basic analytics', 'Email support', '5 GB storage'], cta: 'Start Free', popular: false, gradient: 'from-gray-800 to-gray-900' },
              { name: 'Professional', price: '$49', period: 'per month', description: 'For growing teams with advanced needs', features: ['Unlimited requests', 'Unlimited vendors', 'Advanced analytics', 'Priority support', '100 GB storage', 'API access', 'Custom workflows'], cta: 'Start Free Trial', popular: true, gradient: 'from-primary-600 to-primary-800' },
              { name: 'Enterprise', price: 'Custom', period: 'contact us', description: 'For large organizations with custom requirements', features: ['Everything in Pro', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee', 'Unlimited storage', 'Advanced security', 'Training & onboarding'], cta: 'Contact Sales', popular: false, gradient: 'from-gray-800 to-black' }
            ].map((plan, index) => (
              <ScrollReveal key={index} animation="scale" delay={index * 100}>
                <div className={`relative ${plan.popular ? 'sm:transform sm:scale-110 z-10' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 sm:-top-5 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="px-4 py-1 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full text-white text-xs font-bold shadow-lg">MOST POPULAR</div>
                    </div>
                  )}
                  <div className={`relative bg-gradient-to-br ${plan.gradient} p-6 sm:p-7 lg:p-8 rounded-2xl sm:rounded-3xl border ${plan.popular ? 'border-primary-500/50' : 'border-white/10'} ${cardAnimations.glow} h-full`}>
                    {plan.popular && (<div className="absolute -inset-1 bg-gradient-to-r from-primary-600/30 to-primary-800/30 blur-2xl opacity-50"></div>)}
                    <div className="relative z-10">
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">{plan.description}</p>
                      <div className="mb-6 sm:mb-8">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">{plan.price}</span>
                          <span className="text-gray-400 text-xs sm:text-sm">/ {plan.period}</span>
                        </div>
                      </div>
                      <Link to="/register" className={`block w-full py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base text-center transition-all duration-300 mb-6 sm:mb-8 ${plan.popular ? 'bg-white text-black hover:bg-gray-100' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}>{plan.cta}</Link>
                      <div className="space-y-3 sm:space-y-4">
                        {plan.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-2 sm:gap-3">
                            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300 text-xs sm:text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="relative py-20 sm:py-28 lg:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden" data-animate>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,0,0,0.08)_0%,transparent_70%)]"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <ScrollReveal animation="slideUp">
              <p className="text-primary-400 font-semibold text-sm tracking-wider uppercase mb-3">Trusted Worldwide</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Numbers That <span className="text-primary-400">Speak</span></h2>
            </ScrollReveal>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { icon: Users, value: 500, suffix: '+', label: 'Enterprise Clients', accent: 'primary' },
              { icon: Package, value: 10000, suffix: '+', label: 'Requests Processed', accent: 'white' },
              { icon: Globe, value: 50, suffix: '+', label: 'Countries Served', accent: 'primary' },
              { icon: TrendingUp, value: 99.9, decimals: 1, suffix: '%', label: 'Uptime SLA', accent: 'white' }
            ].map((stat, index) => (
              <ScrollReveal key={index} animation="scale" delay={index * 100}>
                <div className="group relative">
                  <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 text-center transition-all duration-500 hover:bg-white/[0.06] hover:border-white/20 hover:scale-105">
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${stat.accent === 'primary' ? 'bg-primary-500/5' : 'bg-white/5'}`}></div>
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${stat.accent === 'primary' ? 'bg-primary-500/10 text-primary-400' : 'bg-white/10 text-white'}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-2 ${stat.accent === 'primary' ? 'text-primary-400' : 'text-white'}`}>
                      <CountUp end={stat.value} duration={2500} decimals={stat.decimals || 0} />{stat.suffix}
                    </div>
                    <p className="text-gray-400 font-medium text-sm">{stat.label}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="relative py-20 sm:py-28 lg:py-36 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-primary-600/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-primary-500/5 rounded-full blur-[100px]"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <ScrollReveal animation="slideUp">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary-600/10 border border-primary-500/20 rounded-full text-primary-400 text-sm font-semibold mb-6 backdrop-blur-sm">
                <HelpCircle className="h-4 w-4" />
                Frequently Asked Questions
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6">
                Got Questions?<br />
                <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">We've Got Answers</span>
              </h2>
              <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">Everything you need to know about our procurement platform</p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="slideUp" delay={100}>
            <div className="mb-8 sm:mb-12">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="text" placeholder="Search FAQs..." value={faqSearchQuery} onChange={(e) => setFaqSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm" />
              </div>
            </div>
          </ScrollReveal>

          <div className="space-y-4">
            {(() => {
              const allFaqs = [
                { question: 'What is ProcureHub and how does it work?', answer: 'ProcureHub is an AI-powered procurement platform that streamlines your entire procurement process. Buyers can submit requests, receive competitive quotations from verified vendors, and compare options using intelligent analytics. Our platform automates vendor matching, quotation comparison, and provides real-time insights to help you make informed purchasing decisions.', category: 'General' },
                { question: 'How secure is my data on ProcureHub?', answer: 'Security is our top priority. We use bank-level 256-bit encryption, are SOC 2 Type II certified, and fully GDPR compliant. All data is stored in secure, encrypted databases with role-based access controls. We conduct regular security audits and penetration testing to ensure your information remains protected at all times.', category: 'Security' },
                { question: 'What pricing plans are available?', answer: 'We offer flexible pricing plans to suit businesses of all sizes. Our plans include a free tier for small teams, professional plans for growing companies, and enterprise solutions with custom pricing. All plans include core features like request management, vendor network access, and basic analytics. Contact our sales team for detailed pricing information tailored to your needs.', category: 'Pricing' },
                { question: 'How does the AI-powered quotation comparison work?', answer: 'Our advanced AI algorithms analyze multiple factors including price, delivery time, vendor ratings, historical performance, and compliance status. The system automatically extracts data from PDF quotations, normalizes the information, and presents side-by-side comparisons with intelligent recommendations. You can also export detailed comparison reports in Excel format for further analysis.', category: 'Features' },
                { question: 'Can I integrate ProcureHub with my existing ERP system?', answer: 'Yes! ProcureHub offers robust API integrations with major ERP systems including SAP, Oracle, Microsoft Dynamics, and more. Our RESTful API allows seamless data synchronization, automated workflows, and custom integrations. Enterprise customers can work with our integration team for custom connectors and dedicated support.', category: 'Integration' },
                { question: 'How do vendors get verified on the platform?', answer: 'All vendors undergo a comprehensive verification process including business registration checks, financial stability reviews, compliance certifications, and performance history validation. We continuously monitor vendor performance and update verification status based on transaction history, customer feedback, and compliance adherence.', category: 'Vendors' },
                { question: 'What file formats are supported for quotations?', answer: 'Currently, we support PDF quotations with advanced extraction capabilities. Our AI-powered extraction engine can handle various PDF formats including scanned documents, multi-column layouts, and complex tables. We use Google Cloud Vision API for OCR and advanced text extraction to ensure 100% accurate data extraction regardless of PDF format.', category: 'Technical' },
                { question: 'Is there a limit to the number of requests or quotations I can process?', answer: 'Limits vary by plan. Free plans have basic limits, while professional and enterprise plans offer unlimited requests and quotations. Enterprise customers also get priority processing, dedicated support, and custom SLA guarantees. Check our pricing page for specific limits or contact sales for enterprise unlimited options.', category: 'Limits' },
                { question: 'How quickly can I get started with ProcureHub?', answer: 'Getting started is incredibly fast! Sign up takes less than 2 minutes, and your dashboard is ready instantly. No credit card required for the free trial. You can start creating requests immediately and access our vendor network right away. Our onboarding wizard guides you through the setup process, and our support team is available 24/7 to assist.', category: 'Getting Started' },
                { question: 'What kind of support do you provide?', answer: 'We offer comprehensive support across all plans. Free users get email support and access to our knowledge base. Professional plans include priority email support and live chat. Enterprise customers receive dedicated account managers, 24/7 phone support, custom training sessions, and SLA guarantees. All users have access to our extensive documentation and video tutorials.', category: 'Support' },
                { question: 'Can I customize workflows and approval processes?', answer: 'Absolutely! Our automated workflows feature allows you to create custom approval chains, set spending limits, define routing rules, and automate routine tasks. You can configure multi-level approvals, conditional routing based on request type or amount, and integrate with your existing approval systems. Enterprise plans include advanced workflow customization and dedicated configuration support.', category: 'Features' },
                { question: 'How does ProcureHub ensure vendor quality and reliability?', answer: 'We maintain a rigorous vendor management system with continuous monitoring. Vendors are rated based on delivery performance, quality metrics, communication responsiveness, and customer feedback. Our platform tracks on-time delivery rates, quality scores, and compliance adherence. Buyers can see vendor ratings, certifications, and historical performance before making decisions.', category: 'Vendors' }
              ];

              const filteredFaqs = allFaqs.filter(faq => 
                faqSearchQuery === '' || 
                faq.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
                faq.category.toLowerCase().includes(faqSearchQuery.toLowerCase())
              );

              if (filteredFaqs.length === 0) {
                return (
                  <div className="text-center py-12">
                    <HelpCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No FAQs found matching your search.</p>
                    <button onClick={() => setFaqSearchQuery('')} className="mt-4 text-primary-400 hover:text-primary-300 text-sm font-medium">Clear search</button>
                  </div>
                );
              }

              return filteredFaqs.map((faq, index) => {
                const isOpen = openFaqIndex === faq.question;
                return (
                  <ScrollReveal key={faq.question} animation="slideUp" delay={index * 50}>
                    <div className="group">
                      <button onClick={() => setOpenFaqIndex(isOpen ? null : faq.question)} className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary-500/50 rounded-xl p-5 sm:p-6 transition-all duration-300 backdrop-blur-sm">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="px-2.5 py-1 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                                <span className="text-primary-400 text-xs font-semibold">{faq.category}</span>
                              </div>
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-primary-50 transition-colors pr-8">{faq.question}</h3>
                          </div>
                          <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                            {isOpen ? <Minus className="h-5 w-5 text-primary-400" /> : <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-primary-400 transition-colors" />}
                          </div>
                        </div>
                      </button>
                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-5 sm:p-6 backdrop-blur-sm">
                          <p className="text-gray-300 leading-relaxed text-base sm:text-lg">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              });
            })()}
          </div>

          <ScrollReveal animation="slideUp" delay={200}>
            <div className="mt-12 sm:mt-16 text-center">
              <div className="inline-flex flex-col sm:flex-row items-center gap-4 px-6 py-4 bg-primary-500/10 border border-primary-500/20 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 text-primary-400">
                  <HelpCircle className="h-5 w-5" />
                  <span className="font-semibold">Still have questions?</span>
                </div>
                <Link to="/register" className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105">Contact Support</Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20 sm:py-28 lg:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-[100px]"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <ScrollReveal animation="scale">
            <div className="relative bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl p-8 sm:p-12 lg:p-16 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 via-transparent to-transparent"></div>
              <div className="relative z-10 space-y-6 sm:space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-xs font-semibold">
                  <Rocket className="h-4 w-4" />
                  Ready to get started?
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Transform Your<br /><span className="text-primary-400">Procurement Today</span>
                </h2>
                <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">Join hundreds of companies saving time and money with AI-powered procurement automation</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                  <Link to="/register" className="group w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/25 flex items-center justify-center gap-2">
                    <Rocket className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    Start Free Trial
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold text-base border border-white/10 hover:border-white/20 transition-all duration-300">Sign In</Link>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-6 pt-6 text-gray-500 text-sm">
                  {[
                    { icon: CheckCircle2, text: 'No credit card required' },
                    { icon: Shield, text: '30-day guarantee' },
                    { icon: Zap, text: '2 min setup' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-primary-400/60" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />

      {/* Custom Styles */}
      <style>{`
        @keyframes morph {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .perspective-\\[2000px\\] {
          perspective: 2000px;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
      <ChatBot />
    </div>
  );
};

export default Landing;