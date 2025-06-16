'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ContentCard from './ContentCard';
import type { Content } from '@/lib/data/content';

interface ContentRowProps {
  title: string | React.ReactNode;
  items: Content[];
  size?: 'small' | 'medium' | 'large';
  showNumbers?: boolean;
  showProgress?: boolean;
  isTop10?: boolean;
}

export default function ContentRow({ 
  title, 
  items, 
  size = 'medium',
  showNumbers = false,
  showProgress = false,
  isTop10 = false
}: ContentRowProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateScrollButtons = () => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    setScrollPosition(scrollLeft);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    updateScrollButtons();
    container.addEventListener('scroll', updateScrollButtons);
    
    const handleResize = () => updateScrollButtons();
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', handleResize);
    };
  }, [items]);

  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container || isScrolling) return;

    setIsScrolling(true);
    
    // Netflix-accurate card dimensions and scrolling
    const cardWidth = size === 'large' ? 300 : size === 'medium' ? 250 : 200;
    const gap = 8;
    const scrollAmount = (cardWidth + gap) * 4; // Scroll 4 cards at a time
    
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : scrollPosition + scrollAmount;

    container.scrollTo({ 
      left: newPosition, 
      behavior: 'smooth' 
    });

    setTimeout(() => setIsScrolling(false), 300);
  };

  if (!items || items.length === 0) {
    return null;
  }

  // Top 10 special rendering with large numbers
  if (isTop10) {
    return (
      <div className="mb-8 relative">
        <h2 className="text-xl font-semibold mb-4 px-4 md:px-12 text-white flex items-center">
          {title}
        </h2>
        
        <div 
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {canScrollLeft && (
            <button 
              onClick={() => scroll('left')}
              className={`absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-black/70 hover:bg-black/90 rounded-full p-3 transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
          )}

          <div 
            ref={containerRef}
            className="flex space-x-2 overflow-x-auto px-4 md:px-12 scrollbar-hide scroll-smooth"
          >
            {items.slice(0, 10).map((item, index) => (
              <div key={item.id} className="relative flex-shrink-0">
                {/* Large number behind card */}
                <div className="absolute -left-4 top-0 z-0 pointer-events-none">
                  <span className="text-8xl font-black text-gray-800 select-none stroke-white stroke-2">
                    {index + 1}
                  </span>
                </div>
                <div className="relative z-10 ml-8">
                  <ContentCard 
                    content={item} 
                    index={index}
                    size={size}
                    showNumbers={true}
                  />
                </div>
              </div>
            ))}
          </div>

          {canScrollRight && (
            <button 
              onClick={() => scroll('right')}
              className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-black/70 hover:bg-black/90 rounded-full p-3 transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 relative" style={{ overflow: 'hidden' }}>
      {/* Row Title */}
      <h2 className="text-xl font-semibold mb-4 px-4 md:px-12 text-white flex items-center">
        {title}
      </h2>
      
      <div 
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ overflow: 'hidden' }}
      >
        {/* Left scroll button */}
        {canScrollLeft && (
          <button 
            onClick={() => scroll('left')}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-black/70 hover:bg-black/90 rounded-full p-3 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
        )}

        {/* Content container */}
        <div 
          ref={containerRef}
          className="flex space-x-2 overflow-x-auto px-4 md:px-12 scrollbar-hide scroll-smooth relative"
          style={{ overflowY: 'hidden' }}
        >
          {items.map((item, index) => (
            <div key={item.id} className="relative flex-shrink-0">
              {/* Progress bar for continue watching */}
              {showProgress && (
                <div className="absolute bottom-0 left-0 right-0 z-20">
                  <div className="bg-gray-600 h-1 rounded-b">
                    <div 
                      className="bg-netflix-red h-full rounded-b transition-all duration-300"
                      style={{ width: `${Math.random() * 70 + 10}%` }}
                    />
                  </div>
                </div>
              )}
              
              <ContentCard 
                content={item} 
                index={showNumbers ? index : undefined}
                size={size}
                showNumbers={showNumbers}
              />
            </div>
          ))}
        </div>

        {/* Right scroll button */}
        {canScrollRight && (
          <button 
            onClick={() => scroll('right')}
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-black/70 hover:bg-black/90 rounded-full p-3 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}