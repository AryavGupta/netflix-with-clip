'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Plus, Star, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Content } from '@/lib/data/content';

interface ContentRowProps {
  title: string | React.ReactNode;
  items: Content[];
  size?: 'small' | 'medium' | 'large';
  showNumbers?: boolean;
  showProgress?: boolean;
  isTop10?: boolean;
  seeMoreLink?: string;
}

export default function ContentRow({ 
  title, 
  items, 
  // size = 'medium',
  // showNumbers = false,
  showProgress = false,
  isTop10 = false,
  seeMoreLink
}: ContentRowProps) {
  const router = useRouter();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [myList, setMyList] = useState<Set<string>>(new Set()); // Track items in user's list
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
    
    // Scroll amount similar to the reference design
    const scrollAmount = 400;
    
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : scrollPosition + scrollAmount;

    container.scrollTo({ 
      left: newPosition, 
      behavior: 'smooth' 
    });

    setTimeout(() => setIsScrolling(false), 300);
  };

  const getBadgeClass = (badge: string) => {
    switch (badge.toUpperCase()) {
      case "TOP 10":
        return "bg-red-600 text-white"
      case "NEW SERIES":
        return "bg-green-600 text-white"
      case "NEW SEASON":
        return "bg-blue-600 text-white"
      case "AWARD WINNER":
        return "bg-yellow-600 text-black"
      case "LIVE":
        return "bg-red-500 text-white"
      case "UPCOMING":
        return "bg-purple-600 text-white"
      case "NEW":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  };

  const truncateBadgeText = (text: string, maxLength = 11) => {
    const upperText = text.toUpperCase()

    if (upperText === "TOP 10" || upperText === "LIVE" || upperText === "NEW") {
      return upperText
    }

    if (upperText === "NEW SERIES") {
      return "NEW SERIES"
    }

    if (upperText === "NEW SEASON") {
      return "NEW SEASON"
    }

    if (upperText === "AWARD WINNER") {
      return "AWARD"
    }

    if (text.length <= maxLength) return text.toUpperCase()
    return text.substring(0, maxLength - 1).toUpperCase() + "…"
  };

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Handle adding/removing from My List
  const toggleMyList = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking the button
    setMyList(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
        console.log(`Removed "${items.find(item => item.id === itemId)?.title}" from My List`);
      } else {
        newSet.add(itemId);
        console.log(`Added "${items.find(item => item.id === itemId)?.title}" to My List`);
      }
      return newSet;
    });
  };

  // Handle movie tile click - navigate to movie info page
  const handleMovieClick = (itemId: string) => {
    router.push(`/content/${itemId}`);
  };

  // Handle play button click
  const handlePlayClick = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking play
    router.push(`/watch/${itemId}`);
  };

  if (!items || items.length === 0) {
    return null;
  }

  // Top 10 special rendering with large numbers
  if (isTop10) {
    console.log(isHovered);
    console.log(hoveredItem);
    return (
      <div className="mb-12 content-row">
        <div className="flex items-center justify-between px-8 md:px-16 mb-6">
          <h2 className="text-white text-2xl font-bold tracking-tight">{title}</h2>
          {seeMoreLink && (
            <Link
              href={seeMoreLink}
              className="text-[#00A8E1] hover:text-[#1FB6FF] text-sm font-semibold flex items-center group transition-all duration-300"
            >
              See more
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          )}
        </div>
        
        <div 
          className="relative group/row"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {canScrollLeft && (
            <button 
              onClick={() => scroll('left')}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-black/90 text-white p-4 rounded-full opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <div 
            ref={containerRef}
            className="flex space-x-4 overflow-x-auto scrollbar-hide px-8 md:px-16 horizontal-scroll pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {items.slice(0, 10).map((item, index) => (
              <div key={item.id} className="relative flex-shrink-0">
                <div className="absolute -left-4 top-0 z-0 pointer-events-none">
                  <span className="text-8xl font-black text-gray-800 select-none stroke-white stroke-2">
                    {index + 1}
                  </span>
                </div>
                <div className="relative z-10 ml-8">
                  <div
                    className="relative w-[320px] aspect-[16/9] content-card group/item cursor-pointer"
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => handleMovieClick(item.id)}
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover transition-all duration-500 rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/320x180/374151/9CA3AF?text=No+Image';
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {canScrollRight && (
            <button 
              onClick={() => scroll('right')}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-black/90 text-white p-4 rounded-full opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12 content-row">
      {/* Header with title and see more link */}
      <div className="flex items-center justify-between px-8 md:px-16 mb-6">
        <h2 className="text-white text-2xl font-bold tracking-tight">{title}</h2>
        {seeMoreLink && (
          <Link
            href={seeMoreLink}
            className="text-[#00A8E1] hover:text-[#1FB6FF] text-sm font-semibold flex items-center group transition-all duration-300"
          >
            See more
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        )}
      </div>
      
      <div 
        className="relative group/row"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left scroll button */}
        {canScrollLeft && (
          <button 
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-black/90 text-white p-4 rounded-full opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Content container */}
        <div 
          ref={containerRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide px-8 md:px-16 horizontal-scroll pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item, index) => (
            <div key={item.id} className="flex-shrink-0" style={{ animationDelay: `${index * 0.1}s` }}>
              <div
                className="relative w-[320px] aspect-[16/9] content-card group/item cursor-pointer"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => handleMovieClick(item.id)}
              >
                {/* Badge */}
                {item.genre && item.genre.length > 0 && (
                  <div
                    className={`absolute top-2 left-2 z-10 px-2 py-1 rounded text-xs font-bold ${getBadgeClass(item.genre[0])}`}
                    title={item.genre[0].toUpperCase()}
                  >
                    {truncateBadgeText(item.genre[0])}
                  </div>
                )}

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

                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover transition-all duration-500 rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/320x180/374151/9CA3AF?text=No+Image';
                  }}
                />

                {/* Hover overlay with content details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-all duration-300 rounded-lg">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-bold text-lg leading-tight truncate pr-2">{item.title}</h3>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white text-sm font-semibold">8.1</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 mb-3 text-sm text-gray-300">
                      <span>{item.year}</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span>{formatDuration(item.duration)}</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span className="truncate">{item.genre?.[0] || "Drama"}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => handlePlayClick(item.id, e)}
                        className="flex items-center space-x-2 bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Play</span>
                      </button>
                      <button 
                        onClick={(e) => toggleMyList(item.id, e)}
                        className={`flex items-center justify-center w-8 h-8 text-white rounded-full transition-all duration-300 backdrop-blur-sm ${
                          myList.has(item.id) 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-white/20 hover:bg-white/30'
                        }`}
                        title={myList.has(item.id) ? 'Remove from My List' : 'Add to My List'}
                      >
                        {myList.has(item.id) ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* HD/Quality indicator if applicable */}
                {item.type === 'movie' && (
                  <div className="absolute top-2 right-2 z-10">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#00A8E1] to-[#1FB6FF] rounded-lg flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-bold">HD</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right scroll button */}
        {canScrollRight && (
          <button 
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-black/90 text-white p-4 rounded-full opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
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
        .content-card {
          transition: transform 0.3s ease;
        }
        .content-card:hover {
          transform: scale(1.05);
        }
        .horizontal-scroll {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}