/**
 * ============================================================================
 * REUSABLE ANIMATED COMPONENTS
 * ============================================================================
 * 
 * A collection of pre-built animated wrapper components for easy integration
 * across the application. All components respect accessibility preferences.
 * 
 * Usage:
 * <FadeIn delay={200}>
 *   <YourComponent />
 * </FadeIn>
 */

import { useEffect, useRef, useState } from 'react';
import {
  prefersReducedMotion,
  staggerDelay,
  observeElementVisibility,
  gpuAcceleration,
  removeGpuAcceleration,
  DURATION,
  EASING,
} from '../../utils/animations';

// ============================================================================
// FADE IN COMPONENT
// ============================================================================

/**
 * FadeIn - Animates opacity from 0 to 1
 * @param {Object} props
 * @param {ReactNode} props.children - Content to animate
 * @param {number} props.delay - Delay before animation starts (ms)
 * @param {number} props.duration - Animation duration (ms)
 * @param {string} props.className - Additional CSS classes
 */
export const FadeIn = ({ 
  children, 
  delay = 0, 
  duration = DURATION.normal,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  const shouldAnimate = !prefersReducedMotion();
  
  return (
    <div
      className={`transition-opacity ${className}`}
      style={{
        opacity: shouldAnimate ? (isVisible ? 1 : 0) : 1,
        transitionDuration: shouldAnimate ? `${duration}ms` : '0ms',
        transitionTimingFunction: EASING.smooth,
        ...gpuAcceleration(shouldAnimate),
      }}
    >
      {children}
    </div>
  );
};

// ============================================================================
// SLIDE UP COMPONENT
// ============================================================================

/**
 * SlideUp - Animates element sliding up with fade
 * @param {Object} props
 */
export const SlideUp = ({ 
  children, 
  delay = 0, 
  duration = DURATION.normal,
  distance = 50,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  const shouldAnimate = !prefersReducedMotion();
  
  return (
    <div
      className={`transition-all ${className}`}
      style={{
        opacity: shouldAnimate ? (isVisible ? 1 : 0) : 1,
        transform: shouldAnimate 
          ? `translateY(${isVisible ? 0 : distance}px)` 
          : 'none',
        transitionDuration: shouldAnimate ? `${duration}ms` : '0ms',
        transitionTimingFunction: EASING.smooth,
        ...gpuAcceleration(shouldAnimate),
      }}
    >
      {children}
    </div>
  );
};

// ============================================================================
// SLIDE DOWN COMPONENT
// ============================================================================

export const SlideDown = ({ 
  children, 
  delay = 0, 
  duration = DURATION.normal,
  distance = 50,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  const shouldAnimate = !prefersReducedMotion();
  
  return (
    <div
      className={`transition-all ${className}`}
      style={{
        opacity: shouldAnimate ? (isVisible ? 1 : 0) : 1,
        transform: shouldAnimate 
          ? `translateY(${isVisible ? 0 : -distance}px)` 
          : 'none',
        transitionDuration: shouldAnimate ? `${duration}ms` : '0ms',
        transitionTimingFunction: EASING.smooth,
        ...gpuAcceleration(shouldAnimate),
      }}
    >
      {children}
    </div>
  );
};

// ============================================================================
// SLIDE LEFT COMPONENT
// ============================================================================

export const SlideLeft = ({ 
  children, 
  delay = 0, 
  duration = DURATION.normal,
  distance = 50,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  const shouldAnimate = !prefersReducedMotion();
  
  return (
    <div
      className={`transition-all ${className}`}
      style={{
        opacity: shouldAnimate ? (isVisible ? 1 : 0) : 1,
        transform: shouldAnimate 
          ? `translateX(${isVisible ? 0 : distance}px)` 
          : 'none',
        transitionDuration: shouldAnimate ? `${duration}ms` : '0ms',
        transitionTimingFunction: EASING.smooth,
        ...gpuAcceleration(shouldAnimate),
      }}
    >
      {children}
    </div>
  );
};

// ============================================================================
// SLIDE RIGHT COMPONENT
// ============================================================================

export const SlideRight = ({ 
  children, 
  delay = 0, 
  duration = DURATION.normal,
  distance = 50,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  const shouldAnimate = !prefersReducedMotion();
  
  return (
    <div
      className={`transition-all ${className}`}
      style={{
        opacity: shouldAnimate ? (isVisible ? 1 : 0) : 1,
        transform: shouldAnimate 
          ? `translateX(${isVisible ? 0 : -distance}px)` 
          : 'none',
        transitionDuration: shouldAnimate ? `${duration}ms` : '0ms',
        transitionTimingFunction: EASING.smooth,
        ...gpuAcceleration(shouldAnimate),
      }}
    >
      {children}
    </div>
  );
};

// ============================================================================
// SCALE IN COMPONENT (ZOOM)
// ============================================================================

export const ScaleIn = ({ 
  children, 
  delay = 0, 
  duration = DURATION.normal,
  from = 0.8,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  const shouldAnimate = !prefersReducedMotion();
  
  return (
    <div
      className={`transition-all ${className}`}
      style={{
        opacity: shouldAnimate ? (isVisible ? 1 : 0) : 1,
        transform: shouldAnimate 
          ? `scale(${isVisible ? 1 : from})` 
          : 'none',
        transitionDuration: shouldAnimate ? `${duration}ms` : '0ms',
        transitionTimingFunction: EASING.spring,
        ...gpuAcceleration(shouldAnimate),
      }}
    >
      {children}
    </div>
  );
};

// ============================================================================
// BOUNCE IN COMPONENT
// ============================================================================

export const BounceIn = ({ 
  children, 
  delay = 0, 
  duration = DURATION.slow,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  const shouldAnimate = !prefersReducedMotion();
  
  return (
    <div
      className={`transition-all ${className}`}
      style={{
        opacity: shouldAnimate ? (isVisible ? 1 : 0) : 1,
        transform: shouldAnimate 
          ? `scale(${isVisible ? 1 : 0})` 
          : 'none',
        transitionDuration: shouldAnimate ? `${duration}ms` : '0ms',
        transitionTimingFunction: EASING.bounce,
        ...gpuAcceleration(shouldAnimate),
      }}
    >
      {children}
    </div>
  );
};

// ============================================================================
// ROTATE IN COMPONENT
// ============================================================================

export const RotateIn = ({ 
  children, 
  delay = 0, 
  duration = DURATION.slow,
  from = -180,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  const shouldAnimate = !prefersReducedMotion();
  
  return (
    <div
      className={`transition-all ${className}`}
      style={{
        opacity: shouldAnimate ? (isVisible ? 1 : 0) : 1,
        transform: shouldAnimate 
          ? `rotate(${isVisible ? 0 : from}deg) scale(${isVisible ? 1 : 0.5})` 
          : 'none',
        transitionDuration: shouldAnimate ? `${duration}ms` : '0ms',
        transitionTimingFunction: EASING.smooth,
        ...gpuAcceleration(shouldAnimate),
      }}
    >
      {children}
    </div>
  );
};

// ============================================================================
// SCROLL REVEAL COMPONENT
// ============================================================================

/**
 * ScrollReveal - Animates element when it enters viewport
 * Uses Intersection Observer for performance
 */
export const ScrollReveal = ({ 
  children, 
  animation = 'slideUp',
  duration = DURATION.normal,
  threshold = 0.1,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  const shouldAnimate = !prefersReducedMotion();
  
  useEffect(() => {
    if (!shouldAnimate) {
      setIsVisible(true);
      return;
    }
    
    const observer = observeElementVisibility(() => {
      setIsVisible(true);
    });
    
    if (observer && ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [shouldAnimate]);
  
  const getAnimationStyle = () => {
    const baseStyle = {
      opacity: isVisible ? 1 : 0,
      transitionDuration: shouldAnimate ? `${duration}ms` : '0ms',
      transitionTimingFunction: EASING.smooth,
      transitionProperty: 'all',
    };
    
    if (!shouldAnimate) return baseStyle;
    
    switch (animation) {
      case 'slideUp':
        return {
          ...baseStyle,
          transform: `translateY(${isVisible ? 0 : 50}px)`,
        };
      case 'slideDown':
        return {
          ...baseStyle,
          transform: `translateY(${isVisible ? 0 : -50}px)`,
        };
      case 'slideLeft':
        return {
          ...baseStyle,
          transform: `translateX(${isVisible ? 0 : 50}px)`,
        };
      case 'slideRight':
        return {
          ...baseStyle,
          transform: `translateX(${isVisible ? 0 : -50}px)`,
        };
      case 'scale':
        return {
          ...baseStyle,
          transform: `scale(${isVisible ? 1 : 0.8})`,
        };
      case 'fade':
      default:
        return baseStyle;
    }
  };
  
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...getAnimationStyle(),
        ...gpuAcceleration(shouldAnimate && !isVisible),
      }}
    >
      {children}
    </div>
  );
};

// ============================================================================
// STAGGER CONTAINER COMPONENT
// ============================================================================

/**
 * StaggerContainer - Container for staggered child animations
 * Children animate sequentially with delay between each
 */
export const StaggerContainer = ({ 
  children, 
  staggerDelay = 100,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
    <div className={className}>
      {Array.isArray(children) 
        ? children.map((child, index) => (
            <SlideUp 
              key={index} 
              delay={staggerDelay * index}
            >
              {child}
            </SlideUp>
          ))
        : children
      }
    </div>
  );
};

// ============================================================================
// COUNT UP ANIMATION COMPONENT
// ============================================================================

/**
 * CountUp - Animates number counting from 0 to target value
 */
export const CountUp = ({ 
  end, 
  duration = 2000,
  start = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = ''
}) => {
  const [count, setCount] = useState(start);
  const shouldAnimate = !prefersReducedMotion();
  
  useEffect(() => {
    if (!shouldAnimate) {
      setCount(end);
      return;
    }
    
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function for smooth counting
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * (end - start) + start));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [end, start, duration, shouldAnimate]);
  
  return (
    <span className={className}>
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  );
};

// ============================================================================
// TYPING TEXT ANIMATION COMPONENT
// ============================================================================

/**
 * TypingText - Simulates typing effect for text
 */
export const TypingText = ({ 
  text, 
  speed = 50,
  delay = 0,
  cursor = true,
  className = ''
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(cursor);
  const shouldAnimate = !prefersReducedMotion();
  
  useEffect(() => {
    if (!shouldAnimate) {
      setDisplayedText(text);
      setShowCursor(false);
      return;
    }
    
    const startTimer = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.substring(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          if (cursor) {
            setTimeout(() => setShowCursor(false), 500);
          }
        }
      }, speed);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(startTimer);
  }, [text, speed, delay, cursor, shouldAnimate]);
  
  return (
    <span className={className}>
      {displayedText}
      {showCursor && <span className="animate-pulse">|</span>}
    </span>
  );
};

// ============================================================================
// SHIMMER EFFECT COMPONENT
// ============================================================================

/**
 * Shimmer - Adds shimmer loading effect
 */
export const Shimmer = ({ className = '', height = '20px' }) => {
  const shouldAnimate = !prefersReducedMotion();
  
  return (
    <div 
      className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded ${className}`}
      style={{
        height,
        backgroundSize: shouldAnimate ? '200% 100%' : '100% 100%',
        animation: shouldAnimate ? 'shimmer 1.5s infinite' : 'none',
      }}
    />
  );
};

// ============================================================================
// PULSE GLOW COMPONENT
// ============================================================================

/**
 * PulseGlow - Continuous pulsing glow effect
 */
export const PulseGlow = ({ children, color = 'blue', className = '' }) => {
  const shouldAnimate = !prefersReducedMotion();
  
  return (
    <div 
      className={`${className} ${shouldAnimate ? 'animate-pulse-glow' : ''}`}
      style={{
        '--glow-color': color,
      }}
    >
      {children}
    </div>
  );
};

// ============================================================================
// FLOAT ANIMATION COMPONENT
// ============================================================================

/**
 * Float - Continuous floating up/down motion
 */
export const Float = ({ children, className = '' }) => {
  const shouldAnimate = !prefersReducedMotion();
  
  return (
    <div className={`${className} ${shouldAnimate ? 'animate-float' : ''}`}>
      {children}
    </div>
  );
};

// Export all components
export default {
  FadeIn,
  SlideUp,
  SlideDown,
  SlideLeft,
  SlideRight,
  ScaleIn,
  BounceIn,
  RotateIn,
  ScrollReveal,
  StaggerContainer,
  CountUp,
  TypingText,
  Shimmer,
  PulseGlow,
  Float,
};

