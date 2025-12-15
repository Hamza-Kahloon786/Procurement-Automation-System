/**
 * ============================================================================
 * ANIMATION SHOWCASE COMPONENT
 * ============================================================================
 * 
 * A comprehensive demonstration of all available animations
 * Perfect for testing, documentation, and showcasing animation capabilities
 * 
 * Features:
 * - All entrance animations
 * - Hover effects and interactions
 * - Continuous animations
 * - Text animations
 * - Chart animations
 * - Button animations
 * - Card animations
 * - And more!
 */

import React, { useState } from 'react';
import {
  FadeIn,
  SlideUp,
  SlideDown,
  SlideLeft,
  SlideRight,
  ScaleIn,
  BounceIn,
  RotateIn,
  ScrollReveal,
  CountUp,
  TypingText,
  Shimmer,
  PulseGlow,
  Float,
} from './AnimatedComponents';
import {
  hoverAnimations,
  buttonAnimations,
  cardAnimations,
  EASING,
  DURATION,
} from '../../utils/animations';
import {
  Sparkles,
  Zap,
  Star,
  Heart,
  TrendingUp,
  Activity,
  Award,
  Target,
  Loader,
  RefreshCw,
} from 'lucide-react';

const AnimationShowcase = () => {
  const [activeTab, setActiveTab] = useState('entrance');
  const [showReplayButton, setShowReplayButton] = useState(false);

  // Animation categories
  const tabs = [
    { id: 'entrance', name: 'Entrance Animations', icon: Zap },
    { id: 'hover', name: 'Hover Effects', icon: Sparkles },
    { id: 'continuous', name: 'Continuous Animations', icon: RefreshCw },
    { id: 'text', name: 'Text Animations', icon: Activity },
    { id: 'interactions', name: 'Interactions', icon: Target },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-12 text-center">
        <FadeIn>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            ✨ Animation Showcase
          </h1>
        </FadeIn>
        <SlideUp delay={100}>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A comprehensive demonstration of all available animation types, effects, and interactions.
            All animations respect user accessibility preferences.
          </p>
        </SlideUp>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-3">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <ScaleIn key={tab.id} delay={index * 50}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300
                    ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-100 hover:scale-105'
                    }
                    ${buttonAnimations.primary}
                  `}
                >
                  <Icon className="h-5 w-5" />
                  {tab.name}
                </button>
              </ScaleIn>
            );
          })}
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-12">
        {/* ENTRANCE ANIMATIONS */}
        {activeTab === 'entrance' && (
          <div className="space-y-8">
            <FadeIn>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">🎭 Entrance Animations</h2>
            </FadeIn>

            {/* Fade In */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Fade In</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FadeIn delay={0}>
                  <div className="p-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg text-center">
                    <p className="font-medium text-blue-900">Fade In (0ms)</p>
                  </div>
                </FadeIn>
                <FadeIn delay={200}>
                  <div className="p-6 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg text-center">
                    <p className="font-medium text-purple-900">Fade In (200ms)</p>
                  </div>
                </FadeIn>
                <FadeIn delay={400}>
                  <div className="p-6 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg text-center">
                    <p className="font-medium text-pink-900">Fade In (400ms)</p>
                  </div>
                </FadeIn>
              </div>
            </div>

            {/* Slide Animations */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Slide Animations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SlideUp delay={0}>
                  <div className="p-6 bg-gradient-to-br from-green-100 to-green-200 rounded-lg text-center">
                    <p className="font-medium text-green-900">Slide Up</p>
                  </div>
                </SlideUp>
                <SlideDown delay={100}>
                  <div className="p-6 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg text-center">
                    <p className="font-medium text-yellow-900">Slide Down</p>
                  </div>
                </SlideDown>
                <SlideLeft delay={200}>
                  <div className="p-6 bg-gradient-to-br from-red-100 to-red-200 rounded-lg text-center">
                    <p className="font-medium text-red-900">Slide Left</p>
                  </div>
                </SlideLeft>
                <SlideRight delay={300}>
                  <div className="p-6 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg text-center">
                    <p className="font-medium text-indigo-900">Slide Right</p>
                  </div>
                </SlideRight>
              </div>
            </div>

            {/* Scale & Special Effects */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Scale & Special Effects</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ScaleIn delay={0}>
                  <div className="p-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg text-center text-white shadow-xl">
                    <Star className="h-12 w-12 mx-auto mb-2" />
                    <p className="font-bold text-lg">Scale In</p>
                  </div>
                </ScaleIn>
                <BounceIn delay={200}>
                  <div className="p-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg text-center text-white shadow-xl">
                    <Award className="h-12 w-12 mx-auto mb-2" />
                    <p className="font-bold text-lg">Bounce In</p>
                  </div>
                </BounceIn>
                <RotateIn delay={400}>
                  <div className="p-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg text-center text-white shadow-xl">
                    <RefreshCw className="h-12 w-12 mx-auto mb-2" />
                    <p className="font-bold text-lg">Rotate In</p>
                  </div>
                </RotateIn>
              </div>
            </div>

            {/* Scroll Reveal */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Scroll Reveal (scroll down to see)</h3>
              <div className="space-y-4">
                {['fade', 'slideUp', 'slideDown', 'slideLeft', 'slideRight', 'scale'].map((animation, index) => (
                  <ScrollReveal key={animation} animation={animation}>
                    <div className="p-6 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg">
                      <p className="font-medium text-gray-800">
                        Scroll Reveal - {animation} animation
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* HOVER EFFECTS */}
        {activeTab === 'hover' && (
          <div className="space-y-8">
            <FadeIn>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">🎯 Hover Effects</h2>
            </FadeIn>

            {/* Button Hover Effects */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Button Animations</h3>
              <div className="flex flex-wrap gap-4">
                <button className={`px-6 py-3 bg-blue-600 text-white rounded-lg font-medium ${buttonAnimations.primary}`}>
                  Primary Button
                </button>
                <button className={`px-6 py-3 bg-purple-600 text-white rounded-lg font-medium ${buttonAnimations.primary}`}>
                  Hover Me!
                </button>
                <button className={`px-6 py-3 bg-pink-600 text-white rounded-lg font-medium ${buttonAnimations.secondary}`}>
                  Secondary Style
                </button>
                <button className={`px-6 py-3 border-2 border-gray-600 text-gray-700 rounded-lg font-medium ${buttonAnimations.ghost}`}>
                  Ghost Button
                </button>
              </div>
            </div>

            {/* Card Hover Effects */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Card Animations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white ${cardAnimations.default}`}>
                  <TrendingUp className="h-12 w-12 mb-4" />
                  <h4 className="text-xl font-bold mb-2">Default Lift</h4>
                  <p className="text-blue-100">Hovers up with strong shadow</p>
                </div>
                <div className={`bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white ${cardAnimations.subtle}`}>
                  <Activity className="h-12 w-12 mb-4" />
                  <h4 className="text-xl font-bold mb-2">Subtle Effect</h4>
                  <p className="text-purple-100">Gentle scale and shadow</p>
                </div>
                <div className={`bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white ${cardAnimations.glow}`}>
                  <Star className="h-12 w-12 mb-4" />
                  <h4 className="text-xl font-bold mb-2">Glow Effect</h4>
                  <p className="text-pink-100">Glowing shadow on hover</p>
                </div>
              </div>
            </div>

            {/* Individual Hover Effects */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Individual Hover Effects</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className={`p-6 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-lg text-center ${hoverAnimations.scale}`}>
                  <p className="font-medium text-cyan-900">Scale</p>
                </div>
                <div className={`p-6 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg text-center ${hoverAnimations.lift}`}>
                  <p className="font-medium text-emerald-900">Lift</p>
                </div>
                <div className={`p-6 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg text-center ${hoverAnimations.glow}`}>
                  <p className="font-medium text-amber-900">Glow</p>
                </div>
                <div className={`p-6 bg-gradient-to-br from-rose-100 to-rose-200 rounded-lg text-center ${hoverAnimations.rotate}`}>
                  <p className="font-medium text-rose-900">Rotate</p>
                </div>
                <div className={`p-6 bg-gradient-to-br from-violet-100 to-violet-200 rounded-lg text-center ${hoverAnimations.brighten}`}>
                  <p className="font-medium text-violet-900">Brighten</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTINUOUS ANIMATIONS */}
        {activeTab === 'continuous' && (
          <div className="space-y-8">
            <FadeIn>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">🔄 Continuous Animations</h2>
            </FadeIn>

            {/* Float Animations */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Float Animations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Float>
                  <div className="p-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl text-center text-white shadow-xl">
                    <Zap className="h-16 w-16 mx-auto mb-4" />
                    <p className="font-bold text-xl">Float</p>
                    <p className="text-blue-100 text-sm mt-2">Normal speed</p>
                  </div>
                </Float>
                <div className="animate-float-slow p-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl text-center text-white shadow-xl">
                  <Star className="h-16 w-16 mx-auto mb-4" />
                  <p className="font-bold text-xl">Float Slow</p>
                  <p className="text-purple-100 text-sm mt-2">Slower motion</p>
                </div>
                <div className="animate-float-fast p-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl text-center text-white shadow-xl">
                  <Heart className="h-16 w-16 mx-auto mb-4" />
                  <p className="font-bold text-xl">Float Fast</p>
                  <p className="text-pink-100 text-sm mt-2">Faster motion</p>
                </div>
              </div>
            </div>

            {/* Pulse & Glow */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Pulse & Glow Effects</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 bg-gradient-to-br from-green-400 to-green-600 rounded-xl text-center text-white shadow-xl animate-pulse">
                  <Activity className="h-16 w-16 mx-auto mb-4" />
                  <p className="font-bold text-xl">Pulse</p>
                </div>
                <div className="p-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl text-center text-white shadow-xl animate-pulse-slow">
                  <Sparkles className="h-16 w-16 mx-auto mb-4" />
                  <p className="font-bold text-xl">Pulse Slow</p>
                </div>
                <div className="p-8 bg-gradient-to-br from-red-400 to-red-600 rounded-xl text-center text-white shadow-xl animate-pulse-glow">
                  <Heart className="h-16 w-16 mx-auto mb-4" />
                  <p className="font-bold text-xl">Pulse Glow</p>
                </div>
              </div>
            </div>

            {/* Rotation Animations */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Rotation Animations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl text-center">
                  <div className="animate-spin inline-block">
                    <Loader className="h-16 w-16 text-indigo-600" />
                  </div>
                  <p className="font-bold text-xl mt-4 text-indigo-900">Spin</p>
                </div>
                <div className="p-8 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-xl text-center">
                  <div className="animate-rotate360 inline-block">
                    <RefreshCw className="h-16 w-16 text-cyan-600" />
                  </div>
                  <p className="font-bold text-xl mt-4 text-cyan-900">Rotate 360</p>
                </div>
                <div className="p-8 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl text-center">
                  <div className="animate-rotate360-slow inline-block">
                    <Target className="h-16 w-16 text-teal-600" />
                  </div>
                  <p className="font-bold text-xl mt-4 text-teal-900">Rotate Slow</p>
                </div>
              </div>
            </div>

            {/* Attention Seekers */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Attention Seekers</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 bg-gradient-to-br from-red-100 to-red-200 rounded-xl text-center animate-bounce">
                  <p className="font-bold text-red-900">Bounce</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl text-center animate-wiggle">
                  <p className="font-bold text-orange-900">Wiggle</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl text-center animate-shake">
                  <p className="font-bold text-amber-900">Shake</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-lime-100 to-lime-200 rounded-xl text-center animate-heartbeat">
                  <Heart className="h-8 w-8 mx-auto text-lime-900" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEXT ANIMATIONS */}
        {activeTab === 'text' && (
          <div className="space-y-8">
            <FadeIn>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">📝 Text Animations</h2>
            </FadeIn>

            {/* Typing Text */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Typing Effect</h3>
              <div className="space-y-4">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <TypingText 
                    text="Welcome to the Animation Showcase! This is a typing animation effect." 
                    speed={50}
                    className="text-xl font-medium text-gray-800"
                  />
                </div>
                <div className="p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg">
                  <TypingText 
                    text="You can customize the speed and appearance of the typing effect." 
                    speed={30}
                    delay={2000}
                    className="text-lg text-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Count Up Animation */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Count Up Numbers</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-center text-white">
                  <p className="text-5xl font-bold mb-2">
                    <CountUp end={1234} duration={2000} />
                  </p>
                  <p className="text-blue-100">Total Users</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-center text-white">
                  <p className="text-5xl font-bold mb-2">
                    <CountUp end={5678} duration={2500} />
                  </p>
                  <p className="text-green-100">Total Sales</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-center text-white">
                  <p className="text-5xl font-bold mb-2">
                    $<CountUp end={99} duration={2000} decimals={2} />
                  </p>
                  <p className="text-purple-100">Average Price</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl text-center text-white">
                  <p className="text-5xl font-bold mb-2">
                    <CountUp end={85} duration={1500} suffix="%" />
                  </p>
                  <p className="text-orange-100">Success Rate</p>
                </div>
              </div>
            </div>

            {/* Gradient Text */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Gradient Text Effects</h3>
              <div className="space-y-6">
                <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent text-center">
                  Gradient Text Animation
                </h2>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 bg-clip-text text-transparent text-center animate-gradient-x bg-[length:200%_auto]">
                  Animated Gradient
                </h2>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent text-center">
                  Colorful Gradient
                </h2>
              </div>
            </div>

            {/* Shimmer Effect */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Shimmer Loading Effect</h3>
              <div className="space-y-4">
                <Shimmer height="60px" className="w-full" />
                <Shimmer height="40px" className="w-3/4" />
                <Shimmer height="40px" className="w-1/2" />
                <div className="grid grid-cols-3 gap-4">
                  <Shimmer height="100px" />
                  <Shimmer height="100px" />
                  <Shimmer height="100px" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* INTERACTIONS */}
        {activeTab === 'interactions' && (
          <div className="space-y-8">
            <FadeIn>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">🎮 Interactive Animations</h2>
            </FadeIn>

            {/* Interactive Cards */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Interactive Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div 
                    key={item}
                    className="group relative p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <Star className="h-8 w-8 transform group-hover:rotate-180 transition-transform duration-500" />
                        <span className="text-2xl font-bold group-hover:scale-125 transition-transform duration-300">
                          #{item}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold mb-2">Interactive Card</h4>
                      <p className="text-indigo-100">Hover to see the effect!</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Complex Animation Sequence */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Complex Animation Sequences</h3>
              <div className="relative h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl overflow-hidden">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="absolute inset-0 animate-pulse-glow">
                      <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-50"></div>
                    </div>
                    <div className="relative z-10 w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center animate-float">
                      <Sparkles className="h-16 w-16 text-white animate-rotate360-slow" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-16 text-center">
        <SlideUp>
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Ready to Use These Animations?</h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              All animations are accessible, performant, and respect user preferences.
              Check out the animation utilities and components for easy integration!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className={`px-8 py-3 bg-white text-purple-600 rounded-lg font-bold ${buttonAnimations.primary}`}>
                View Documentation
              </button>
              <button className={`px-8 py-3 bg-purple-700 text-white rounded-lg font-bold border-2 border-white ${buttonAnimations.primary}`}>
                Get Started
              </button>
            </div>
          </div>
        </SlideUp>
      </div>
    </div>
  );
};

export default AnimationShowcase;

