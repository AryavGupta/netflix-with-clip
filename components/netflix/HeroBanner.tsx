'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { getFeaturedContent } from '@/lib/data/content';

export default function HeroBanner() {
  const router = useRouter();
  const [featuredContent] = useState(getFeaturedContent());
  const [isMuted, setIsMuted] = useState(true);

  const handlePlay = () => {
    router.push(`/watch/${featuredContent.id}`);
  };

  const handleMoreInfo = () => {
    router.push(`/content/${featuredContent.id}`);
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image with Netflix-style overlays */}
      <div className="absolute inset-0">
        <img 
          src={featuredContent.backdropImage || '/api/placeholder/1920/1080'}
          alt={featuredContent.title}
          className="w-full h-full object-cover"
        />
        {/* Multiple gradient overlays for optimal text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
      </div>

      {/* Main Content - Netflix positioning */}
      <div className="relative z-10 flex items-center h-full px-4 md:px-12">
        <div className="max-w-2xl mt-16">
          {/* Netflix Series Badge */}
          <div className="mb-4">
            <span className="text-red-600 text-sm font-semibold tracking-wider uppercase">
              N SERIES
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {featuredContent.title}
          </h1>

          {/* Language availability */}
          <p className="text-lg text-gray-300 mb-2 font-medium">
            Watch in Hindi, Tamil, Telugu, English
          </p>

          {/* Description */}
          <p className="text-lg text-white mb-8 leading-relaxed max-w-lg opacity-90">
            {featuredContent.description}
          </p>

          {/* Action Buttons - Netflix Style */}
          <div className="flex space-x-4">
            <button 
              onClick={handlePlay}
              className="flex items-center bg-white text-black px-8 py-3 rounded text-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              <Play className="mr-2 fill-current" size={24} />
              Play
            </button>
            
            <button 
              onClick={handleMoreInfo}
              className="flex items-center bg-gray-600 bg-opacity-70 text-white px-8 py-3 rounded text-xl font-semibold hover:bg-opacity-60 transition-colors"
            >
              <Info className="mr-2" size={24} />
              More Info
            </button>
          </div>

          {/* Additional metadata - Netflix style */}
          <div className="mt-8 text-gray-300 text-sm space-y-1">
            <div>
              <span className="text-gray-400">Starring: </span>
              <span>{featuredContent.director}</span>
            </div>
            <div>
              <span className="text-gray-400">Genres: </span>
              <span>{featuredContent.genre?.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom right controls - Netflix positioning */}
      <div className="absolute bottom-8 right-4 md:right-12 flex items-center space-x-4 z-20">
        {/* Age Rating Badge */}
        <div className="bg-gray-900/80 border-l-4 border-gray-400 px-3 py-2 backdrop-blur-sm">
          <div className="text-white text-lg font-bold">{featuredContent.rating}</div>
        </div>

        {/* Volume Control */}
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="bg-black/50 border-2 border-white/30 rounded-full p-3 hover:bg-black/70 hover:border-white/50 transition-all"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="h-6 w-6 text-white" />
          ) : (
            <Volume2 className="h-6 w-6 text-white" />
          )}
        </button>
      </div>

      {/* Fade to content area */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}