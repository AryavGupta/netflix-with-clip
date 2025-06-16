'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';
import VideoPlayer from '@/components/video/VideoPlayer';
import { getContentById } from '@/lib/data/content';
import type { Content } from '@/lib/data/content';

export default function WatchPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { isLoggedIn } = useAuthStore();
  const [content, setContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    // Check authentication
    if (!isLoggedIn) {
      router.push('/auth/login');
      return;
    }

    // Get content ID from params
    const contentId = params.id as string;
    if (!contentId) {
      setError('Invalid content ID');
      setIsLoading(false);
      return;
    }

    // Get timestamp from URL (e.g., ?t=39 for 39 seconds)
    const timeParam = searchParams.get('t');
    if (timeParam) {
      const time = parseFloat(timeParam);
      if (!isNaN(time) && time >= 0) {
        setStartTime(time);
      }
    }

    // Fetch content
    const foundContent = getContentById(contentId);
    if (!foundContent) {
      setError('Content not found');
      setIsLoading(false);
      return;
    }

    setContent(foundContent);
    setIsLoading(false);
  }, [params.id, searchParams, isLoggedIn, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-netflix-red border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading video...</p>
          {startTime !== null && (
            <p className="text-gray-400 text-sm mt-2">
              Starting at {Math.floor(startTime / 60)}:{(startTime % 60).toString().padStart(2, '0')}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Error state
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

  // Main video player
  return (
    <div className="bg-black">
      <VideoPlayer 
        content={content} 
        startTime={startTime}
      />
    </div>
  );
}