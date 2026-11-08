import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-left' | 'fade-right' | 'fade-scale';
  delay?: number;
  threshold?: number;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  threshold = 0.1,
  once = true
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    const element = ref.current;
    if (element) observer.observe(element);
    return () => { observer.disconnect(); };
  }, [threshold, once]);

  const getAnimationClass = () => {
    switch (animation) {
      case 'fade-left': return 'reveal-left';
      case 'fade-right': return 'reveal-right';
      case 'fade-scale': return 'reveal-scale';
      default: return '';
    }
  };

  const delayClass = delay > 0 ? `reveal-delay-${delay}` : '';

  return (
    <div
      ref={ref}
      className={`reveal ${getAnimationClass()} ${delayClass} ${isVisible ? 'active' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
