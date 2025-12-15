/**
 * ============================================================================
 * ANIMATION UTILITIES & HELPER FUNCTIONS
 * ============================================================================
 * 
 * A comprehensive, modular animation system with:
 * - Performance optimization (GPU acceleration, will-change)
 * - Accessibility support (prefers-reduced-motion)
 * - Reusable animation variants
 * - Custom timing functions and easing curves
 * - Animation sequencing and chaining utilities
 * 
 * @author Procurement Portal
 * @version 1.0.0
 */

// ============================================================================
// ACCESSIBILITY: DETECT REDUCED MOTION PREFERENCE
// ============================================================================

/**
 * Checks if user has reduced motion preference enabled
 * Respects system accessibility settings
 * @returns {boolean} True if reduced motion is preferred
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Returns animation duration based on user's motion preference
 * @param {number} normalDuration - Duration in milliseconds for normal animation
 * @param {number} reducedDuration - Duration in milliseconds for reduced motion (default: 0)
 * @returns {number} Appropriate duration based on user preference
 */
export const getAnimationDuration = (normalDuration, reducedDuration = 0) => {
  return prefersReducedMotion() ? reducedDuration : normalDuration;
};

// ============================================================================
// CUSTOM EASING FUNCTIONS & CUBIC BEZIER CURVES
// ============================================================================

export const EASING = {
  // Standard easing curves
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  
  // Custom cubic-bezier curves for natural motion
  smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)', // Material Design standard
  snappy: 'cubic-bezier(0.4, 0.0, 0.6, 1)', // Quick and responsive
  gentle: 'cubic-bezier(0.25, 0.1, 0.25, 1)', // Soft and elegant
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Playful bounce
  elastic: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)', // Strong elastic effect
  
  // Specialized easing for specific use cases
  smoothOut: 'cubic-bezier(0, 0, 0.2, 1)', // Smooth deceleration
  smoothIn: 'cubic-bezier(0.4, 0, 1, 1)', // Smooth acceleration
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Spring-like motion
};

// ============================================================================
// ANIMATION DURATION CONSTANTS
// ============================================================================

export const DURATION = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 700,
  verySlow: 1000,
};

// ============================================================================
// ANIMATION DELAY CONSTANTS
// ============================================================================

export const DELAY = {
  none: 0,
  short: 100,
  medium: 200,
  long: 300,
  veryLong: 500,
};

// ============================================================================
// REUSABLE ANIMATION VARIANTS (for Framer Motion or similar libraries)
// ============================================================================

/**
 * Fade animation variants
 */
export const fadeVariants = {
  hidden: { 
    opacity: 0,
  },
  visible: { 
    opacity: 1,
    transition: {
      duration: getAnimationDuration(DURATION.normal) / 1000,
      ease: EASING.smooth,
    },
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: getAnimationDuration(DURATION.fast) / 1000,
    },
  },
};

/**
 * Slide up animation variants
 */
export const slideUpVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: getAnimationDuration(DURATION.normal) / 1000,
      ease: EASING.smooth,
    },
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: getAnimationDuration(DURATION.fast) / 1000,
    },
  },
};

/**
 * Slide down animation variants
 */
export const slideDownVariants = {
  hidden: { 
    opacity: 0, 
    y: -50,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: getAnimationDuration(DURATION.normal) / 1000,
      ease: EASING.smooth,
    },
  },
};

/**
 * Slide from left animation variants
 */
export const slideLeftVariants = {
  hidden: { 
    opacity: 0, 
    x: -50,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: getAnimationDuration(DURATION.normal) / 1000,
      ease: EASING.smooth,
    },
  },
};

/**
 * Slide from right animation variants
 */
export const slideRightVariants = {
  hidden: { 
    opacity: 0, 
    x: 50,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: getAnimationDuration(DURATION.normal) / 1000,
      ease: EASING.smooth,
    },
  },
};

/**
 * Scale animation variants (zoom in/out)
 */
export const scaleVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: getAnimationDuration(DURATION.normal) / 1000,
      ease: EASING.spring,
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
  },
};

/**
 * Bounce in animation variants
 */
export const bounceVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: getAnimationDuration(DURATION.slow) / 1000,
      ease: EASING.bounce,
    },
  },
};

/**
 * Rotate and fade animation variants
 */
export const rotateVariants = {
  hidden: { 
    opacity: 0, 
    rotate: -180,
    scale: 0.5,
  },
  visible: { 
    opacity: 1, 
    rotate: 0,
    scale: 1,
    transition: {
      duration: getAnimationDuration(DURATION.slow) / 1000,
      ease: EASING.smooth,
    },
  },
};

/**
 * Stagger container for sequential animations
 */
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: getAnimationDuration(0.1),
      delayChildren: getAnimationDuration(0.1),
    },
  },
};

/**
 * Stagger item for use within stagger containers
 */
export const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: getAnimationDuration(DURATION.normal) / 1000,
      ease: EASING.smooth,
    },
  },
};

// ============================================================================
// CSS CLASS-BASED ANIMATIONS (Tailwind-compatible)
// ============================================================================

/**
 * Returns animation classes based on animation type
 * @param {string} type - Animation type
 * @param {number} delay - Delay in milliseconds
 * @returns {string} CSS classes for animation
 */
export const getAnimationClasses = (type = 'fade', delay = 0) => {
  if (prefersReducedMotion()) return '';
  
  const baseClasses = 'animate-in';
  const delayClass = delay > 0 ? `animation-delay-${delay}` : '';
  
  const typeClasses = {
    fade: 'fade-in',
    slideUp: 'slide-in-from-bottom-4',
    slideDown: 'slide-in-from-top-4',
    slideLeft: 'slide-in-from-left-4',
    slideRight: 'slide-in-from-right-4',
    scale: 'zoom-in',
    bounce: 'bounce-in',
  };
  
  return `${baseClasses} ${typeClasses[type] || typeClasses.fade} ${delayClass}`.trim();
};

// ============================================================================
// SCROLL-TRIGGERED ANIMATIONS
// ============================================================================

/**
 * Intersection Observer options for scroll animations
 */
export const scrollAnimationOptions = {
  threshold: 0.1, // Trigger when 10% of element is visible
  rootMargin: '0px 0px -100px 0px', // Start animation slightly before element enters viewport
};

/**
 * Hook-compatible function to observe element visibility
 * @param {Function} callback - Function to call when element becomes visible
 * @returns {Object} Intersection Observer instance
 */
export const observeElementVisibility = (callback) => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }
  
  return new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry);
      }
    });
  }, scrollAnimationOptions);
};

// ============================================================================
// PERFORMANCE OPTIMIZATION UTILITIES
// ============================================================================

/**
 * Adds GPU acceleration hint to element
 * @param {boolean} enable - Whether to enable GPU acceleration
 * @returns {Object} Style object with GPU acceleration properties
 */
export const gpuAcceleration = (enable = true) => {
  if (!enable || prefersReducedMotion()) return {};
  
  return {
    willChange: 'transform, opacity',
    transform: 'translateZ(0)', // Force GPU acceleration
    backfaceVisibility: 'hidden',
    perspective: 1000,
  };
};

/**
 * Removes GPU acceleration hint (call after animation completes)
 * @returns {Object} Style object to reset GPU acceleration
 */
export const removeGpuAcceleration = () => ({
  willChange: 'auto',
  transform: 'none',
});

// ============================================================================
// ANIMATION SEQUENCING & CHAINING UTILITIES
// ============================================================================

/**
 * Creates a sequence of animations with delays
 * @param {Array} animations - Array of animation functions
 * @param {number} delayBetween - Delay between animations in ms
 * @returns {Promise} Promise that resolves when all animations complete
 */
export const sequenceAnimations = async (animations, delayBetween = 100) => {
  if (prefersReducedMotion()) {
    // Execute all immediately if reduced motion is preferred
    animations.forEach(anim => anim());
    return Promise.resolve();
  }
  
  for (let i = 0; i < animations.length; i++) {
    await new Promise(resolve => {
      setTimeout(() => {
        animations[i]();
        resolve();
      }, i * delayBetween);
    });
  }
};

/**
 * Delays execution by specified milliseconds
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} Promise that resolves after delay
 */
export const delay = (ms) => {
  if (prefersReducedMotion()) return Promise.resolve();
  return new Promise(resolve => setTimeout(resolve, ms));
};

// ============================================================================
// HOVER & INTERACTION ANIMATION UTILITIES
// ============================================================================

/**
 * Standard hover animation classes
 */
export const hoverAnimations = {
  scale: prefersReducedMotion() ? '' : 'transition-transform duration-300 hover:scale-105 active:scale-95',
  lift: prefersReducedMotion() ? '' : 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
  glow: prefersReducedMotion() ? '' : 'transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/50',
  rotate: prefersReducedMotion() ? '' : 'transition-transform duration-300 hover:rotate-3',
  brighten: prefersReducedMotion() ? '' : 'transition-all duration-300 hover:brightness-110',
  shimmer: prefersReducedMotion() ? '' : 'relative overflow-hidden hover-shimmer',
};

/**
 * Button animation presets
 */
export const buttonAnimations = {
  primary: prefersReducedMotion() 
    ? '' 
    : 'transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 active:shadow-sm',
  secondary: prefersReducedMotion() 
    ? '' 
    : 'transition-all duration-200 hover:bg-opacity-90 hover:shadow-md active:scale-98',
  ghost: prefersReducedMotion() 
    ? '' 
    : 'transition-all duration-200 hover:bg-opacity-10 active:bg-opacity-20',
};

/**
 * Card animation presets
 */
export const cardAnimations = {
  default: prefersReducedMotion() 
    ? '' 
    : 'transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl',
  subtle: prefersReducedMotion() 
    ? '' 
    : 'transition-all duration-300 hover:shadow-lg hover:scale-[1.02]',
  glow: prefersReducedMotion() 
    ? '' 
    : 'transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1',
};

// ============================================================================
// LOADING & SKELETON ANIMATIONS
// ============================================================================

/**
 * Pulse animation for loading states
 */
export const pulseAnimation = prefersReducedMotion() 
  ? '' 
  : 'animate-pulse';

/**
 * Shimmer animation for skeleton loaders
 */
export const shimmerAnimation = prefersReducedMotion() 
  ? '' 
  : 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]';

/**
 * Spin animation for loading spinners
 */
export const spinAnimation = prefersReducedMotion() 
  ? '' 
  : 'animate-spin';

/**
 * Bounce animation for loading indicators
 */
export const bounceAnimation = prefersReducedMotion() 
  ? '' 
  : 'animate-bounce';

// ============================================================================
// TEXT & GRADIENT ANIMATIONS
// ============================================================================

/**
 * Gradient animation classes
 */
export const gradientAnimations = {
  flow: prefersReducedMotion() 
    ? '' 
    : 'bg-gradient-to-r animate-gradient-x',
  pulse: prefersReducedMotion() 
    ? '' 
    : 'bg-gradient-to-r animate-gradient-pulse',
  shimmer: prefersReducedMotion() 
    ? '' 
    : 'bg-gradient-to-r animate-shimmer',
};

/**
 * Text reveal animation utility
 * @param {number} index - Character or word index for stagger effect
 * @returns {Object} Style object for text animation
 */
export const textRevealAnimation = (index = 0) => {
  if (prefersReducedMotion()) return {};
  
  return {
    animation: `fadeInUp ${DURATION.normal}ms ${EASING.smooth} ${index * 50}ms both`,
  };
};

// ============================================================================
// PAGE TRANSITION UTILITIES
// ============================================================================

/**
 * Page transition variants
 */
export const pageTransitionVariants = {
  initial: { 
    opacity: 0, 
    y: 20,
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: getAnimationDuration(DURATION.normal) / 1000,
      ease: EASING.smooth,
    },
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: getAnimationDuration(DURATION.fast) / 1000,
    },
  },
};

// ============================================================================
// MICRO-INTERACTIONS
// ============================================================================

/**
 * Ripple effect configuration
 */
export const rippleEffect = {
  duration: DURATION.slow,
  className: prefersReducedMotion() ? '' : 'ripple-effect',
};

/**
 * Success/Error notification animations
 */
export const notificationVariants = {
  success: {
    initial: { opacity: 0, y: -20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: getAnimationDuration(DURATION.normal) / 1000,
        ease: EASING.spring,
      },
    },
    exit: { 
      opacity: 0, 
      x: 100,
      transition: {
        duration: getAnimationDuration(DURATION.fast) / 1000,
      },
    },
  },
  error: {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: getAnimationDuration(DURATION.fast) / 1000,
        ease: EASING.smooth,
      },
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
    },
  },
};

// ============================================================================
// CONTINUOUS ANIMATIONS
// ============================================================================

/**
 * Float animation (continuous up/down motion)
 */
export const floatAnimation = prefersReducedMotion() 
  ? '' 
  : 'animate-float';

/**
 * Pulse glow animation (continuous pulsing)
 */
export const pulseGlowAnimation = prefersReducedMotion() 
  ? '' 
  : 'animate-pulse-glow';

/**
 * Rotation animation (continuous spinning)
 */
export const rotateAnimation = prefersReducedMotion() 
  ? '' 
  : 'animate-rotate';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generates staggered delay for multiple elements
 * @param {number} index - Element index
 * @param {number} baseDelay - Base delay in ms
 * @param {number} increment - Increment per index in ms
 * @returns {number} Calculated delay
 */
export const staggerDelay = (index, baseDelay = 0, increment = 100) => {
  if (prefersReducedMotion()) return 0;
  return baseDelay + (index * increment);
};

/**
 * Creates a custom animation style object
 * @param {Object} config - Animation configuration
 * @returns {Object} Style object for inline styles
 */
export const createAnimation = (config = {}) => {
  const {
    duration = DURATION.normal,
    delay = DELAY.none,
    easing = EASING.smooth,
    property = 'all',
  } = config;
  
  if (prefersReducedMotion()) {
    return { transition: 'none' };
  }
  
  return {
    transition: `${property} ${duration}ms ${easing} ${delay}ms`,
    ...gpuAcceleration(),
  };
};

/**
 * Export all utilities as default object for convenience
 */
export default {
  prefersReducedMotion,
  getAnimationDuration,
  EASING,
  DURATION,
  DELAY,
  fadeVariants,
  slideUpVariants,
  slideDownVariants,
  slideLeftVariants,
  slideRightVariants,
  scaleVariants,
  bounceVariants,
  rotateVariants,
  staggerContainerVariants,
  staggerItemVariants,
  getAnimationClasses,
  scrollAnimationOptions,
  observeElementVisibility,
  gpuAcceleration,
  removeGpuAcceleration,
  sequenceAnimations,
  delay,
  hoverAnimations,
  buttonAnimations,
  cardAnimations,
  pulseAnimation,
  shimmerAnimation,
  spinAnimation,
  bounceAnimation,
  gradientAnimations,
  textRevealAnimation,
  pageTransitionVariants,
  rippleEffect,
  notificationVariants,
  floatAnimation,
  pulseGlowAnimation,
  rotateAnimation,
  staggerDelay,
  createAnimation,
};

