'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Plus, ThumbsUp, ThumbsDown, ChevronDown, Clock } from 'lucide-react';
import type { Content } from '@/lib/data/content';

interface ContentCardProps {
  content: Content;
  index?: number;
  size?: 'small' | 'medium' | 'large';
  showNumbers?: boolean;
}

export default function ContentCard({ 
  content, 
  index = 0, 
  size = 'medium',
  showNumbers = false 
}: ContentCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState<boolean | null>(null);
  const [isInList, setIsInList] = useState(false);

  // Size configurations for Netflix-accurate dimensions
  const sizeConfig = {
    small: { width: 'w-44', height: 'h-24' },
    medium: { width: 'w-60', height: 'h-32' },
    large: { width: 'w-72', height: 'h-40' }
  };

  const config = sizeConfig[size];

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/watch/${content.id}`);
  };

  const handleMoreInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/content/${content.id}`);
  };

  const handleAddToList = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsInList(!isInList);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(isLiked === true ? null : true);
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(isLiked === false ? null : false);
  };

  const handleCardClick = () => {
    router.push(`/content/${content.id}`);
  };

  // Generate consistent match percentage
  const matchPercentage = Math.floor(Math.random() * 30) + 70;

  return (
    <div 
      className={`relative flex-shrink-0 cursor-pointer group/card ${config.width}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Main Card with Netflix-style scaling */}
      <div className={`relative overflow-hidden rounded-md ${config.width} ${config.height} transform transition-all duration-300 ease-out ${
        isHovered ? 'scale-105 z-40' : 'scale-100 z-10'
      }`}>
        {/* Background Image */}
        <img 
          src={content.thumbnail}
          alt={content.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/api/placeholder/400/225';
          }}
        />
        
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-md" />
        )}

        {/* Ranking number for top content */}
        {showNumbers && index < 10 && (
          <div className="absolute top-2 left-2 z-10">
            <div className="bg-netflix-red text-white text-xs font-bold px-2 py-1 rounded">
              #{index + 1}
            </div>
          </div>
        )}

        {/* Title overlay - always visible */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
          <h3 className="text-white font-medium text-xs leading-tight">{content.title}</h3>
        </div>

        {/* Hover overlay with action buttons at bottom */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/20">
            {/* Large centered play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button 
                onClick={handlePlay}
                className="bg-white/90 text-black rounded-full p-4 hover:bg-white transition-colors shadow-lg"
              >
                <Play size={24} fill="currentColor" />
              </button>
            </div>

            {/* Action buttons row at bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handlePlay}
                    className="bg-white text-black rounded-full p-2 hover:bg-gray-200 transition-colors"
                    title="Play"
                  >
                    <Play size={12} fill="currentColor" />
                  </button>
                  
                  <button 
                    onClick={handleAddToList}
                    className={`rounded-full p-2 border-2 transition-colors ${
                      isInList 
                        ? 'border-white bg-white text-black' 
                        : 'border-gray-400 hover:border-white text-white'
                    }`}
                    title={isInList ? 'Remove from My List' : 'Add to My List'}
                  >
                    <Plus size={12} className={isInList ? 'rotate-45' : ''} />
                  </button>
                  
                  <button 
                    onClick={handleLike}
                    className={`rounded-full p-2 border-2 transition-colors ${
                      isLiked === true
                        ? 'border-white bg-white text-black' 
                        : 'border-gray-400 hover:border-white text-white'
                    }`}
                    title="Like"
                  >
                    <ThumbsUp size={12} />
                  </button>

                  <button 
                    onClick={handleDislike}
                    className={`rounded-full p-2 border-2 transition-colors ${
                      isLiked === false
                        ? 'border-white bg-white text-black' 
                        : 'border-gray-400 hover:border-white text-white'
                    }`}
                    title="Dislike"
                  >
                    <ThumbsDown size={12} />
                  </button>
                </div>
                
                <button 
                  onClick={handleMoreInfo}
                  className="border-2 border-gray-400 hover:border-white rounded-full p-2 transition-colors text-white"
                  title="More Info"
                >
                  <ChevronDown size={12} />
                </button>
              </div>
              
              {/* Quick info on hover */}
              <div className="mt-2 text-xs text-white">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-green-400 font-bold">{matchPercentage}% Match</span>
                  <span className="border border-gray-500 px-1 rounded">{content.rating}</span>
                  <span>{content.year}</span>
                </div>
                <div className="text-gray-300">
                  {content.genre?.slice(0, 2).join(' • ')}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}