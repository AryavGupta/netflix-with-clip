'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';
import NetflixHeader from '@/components/netflix/Header';
import { getContentById, DEMO_CONTENT } from '@/lib/data/content';
import { Play, Plus, ThumbsUp, Share2, Clock, Star, ArrowLeft } from 'lucide-react';
import type { Content } from '@/lib/data/content';

export default function ContentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { isLoggedIn } = useAuthStore();
  const [content, setContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/auth/login');
      return;
    }

    const contentId = params.id as string;
    if (!contentId) {
      setError('Invalid content ID');
      setIsLoading(false);
      return;
    }

    const foundContent = getContentById(contentId);
    if (!foundContent) {
      setError('Content not found');
      setIsLoading(false);
      return;
    }

    setContent(foundContent);
    setIsLoading(false);
  }, [params.id, isLoggedIn, router]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handlePlay = () => {
    if (content) {
      router.push(`/watch/${content.id}`);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // Here you would typically save to user's list
    console.log(isSaved ? 'Removed from list' : 'Added to list');
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Here you would typically save preference
    console.log(isLiked ? 'Unliked' : 'Liked');
  };

  const getSimilarContent = () => {
    if (!content) return [];
    return DEMO_CONTENT
      .filter(item => 
        item.id !== content.id && 
        item.genre.some(g => content.genre.includes(g))
      )
      .slice(0, 6);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-netflix-red border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-white mb-4">
            {error || 'Content Not Found'}
          </h1>
          <p className="text-gray-400 mb-6">
            Sorry, we couldn't find the content you're looking for.
          </p>
          <button
            onClick={() => router.push('/browse')}
            className="bg-netflix-red hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const similarContent = getSimilarContent();

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />
      
      {/* Hero Section */}
      <div className="relative h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${content.backdropImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-20 left-4 md:left-16 z-20 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
          title="Go Back"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>

        {/* Content Details */}
        <div className="relative z-10 flex items-center h-full px-4 md:px-16">
          <div className="max-w-2xl">
            {/* Type badge */}
            <div className="mb-4">
              <span className="bg-netflix-red text-white text-sm font-bold px-3 py-1 rounded">
                {content.type === 'movie' ? 'MOVIE' : 'SERIES'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              {content.title}
            </h1>

            {/* Metadata */}
            <div className="flex items-center space-x-4 mb-6 text-white">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-medium">8.5</span>
              </div>
              <span className="bg-gray-700 px-2 py-1 rounded text-sm font-medium">
                {content.rating}
              </span>
              <span className="text-lg font-medium">{content.year}</span>
              <div className="flex items-center space-x-1">
                <Clock className="h-5 w-5" />
                <span>{formatDuration(content.duration)}</span>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {content.genre.map((genre) => (
                <span 
                  key={genre} 
                  className="bg-gray-800/80 text-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-lg text-gray-200 mb-8 leading-relaxed max-w-xl">
              {content.description}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 mb-8">
              <button 
                onClick={handlePlay}
                className="bg-white text-black font-bold py-3 px-8 rounded hover:bg-gray-200 transition-colors flex items-center space-x-2 text-lg"
              >
                <Play className="h-6 w-6 fill-current" />
                <span>Play</span>
              </button>

              <button 
                onClick={handleSave}
                className={`border-2 font-bold py-3 px-6 rounded transition-colors flex items-center space-x-2 ${
                  isSaved 
                    ? 'border-netflix-red bg-netflix-red text-white' 
                    : 'border-gray-400 text-white hover:border-white'
                }`}
              >
                <Plus className="h-5 w-5" />
                <span>{isSaved ? 'Saved' : 'Save for Later'}</span>
              </button>

              <button 
                onClick={handleLike}
                className={`border-2 border-gray-400 hover:border-white p-3 rounded transition-colors ${
                  isLiked ? 'text-netflix-red' : 'text-white'
                }`}
                title={isLiked ? 'Unlike' : 'Like'}
              >
                <ThumbsUp className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>

              <button 
                className="border-2 border-gray-400 hover:border-white text-white p-3 rounded transition-colors"
                title="Share"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* Cast info */}
            {content.cast.length > 0 && (
              <div className="text-gray-300">
                <span className="text-gray-400">Starring: </span>
                {content.cast.slice(0, 4).join(', ')}
                {content.cast.length > 4 && ', and more'}
              </div>
            )}

            {/* Director */}
            <div className="text-gray-300 mt-2">
              <span className="text-gray-400">Director: </span>
              {content.director}
            </div>
          </div>
        </div>
      </div>

      {/* Similar Content Section */}
      {similarContent.length > 0 && (
        <div className="px-4 md:px-16 py-12">
          <h2 className="text-2xl font-bold mb-8">More Like This</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {similarContent.map((item) => (
              <div 
                key={item.id}
                className="cursor-pointer group"
                onClick={() => router.push(`/content/${item.id}`)}
              >
                <img 
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-32 object-cover rounded group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x225/374151/9CA3AF?text=No+Image';
                  }}
                />
                <h3 className="text-sm font-medium mt-2 line-clamp-2">{item.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{item.year}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}