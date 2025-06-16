'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';
import NetflixHeader from '@/components/netflix/Header';
import HeroBanner from '@/components/netflix/HeroBanner';
import ContentRow from '@/components/netflix/ContentRow';
import { CONTENT_ROWS } from '@/lib/data/content';

export default function BrowsePage() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/auth/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red mx-auto mb-4"></div>
          <p className="text-white">Loading Netflix...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <NetflixHeader />
      
      {/* Main Content */}
      <main className="relative">
        {/* Hero Banner */}
        <HeroBanner />
        
        {/* Content Rows */}
        <div className="relative -mt-40 z-20 pb-12">
          {/* Gradient overlay for smooth transition */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-transparent h-40"></div>
          
          {/* Content starts here */}
          <div className="relative pt-16">
            {/* Popular mobile games for you */}
            <div className="mb-8">
              <ContentRow 
                title="Popular mobile games for you"
                items={CONTENT_ROWS[0].items}
                size="medium"
              />
            </div>

            {/* Trending Now */}
            <div className="mb-8">
              <ContentRow 
                title="Trending Now"
                items={CONTENT_ROWS[1].items}
                size="medium"
              />
            </div>

            {/* Only on Netflix */}
            <div className="mb-8">
              <ContentRow 
                title={
                  <div className="flex items-center space-x-2">
                    <span className="text-netflix-red text-2xl font-black">N</span>
                    <span>Only on Netflix</span>
                  </div>
                }
                items={CONTENT_ROWS[2].items}
                size="large"
              />
            </div>

            {/* Continue Watching */}
            <div className="mb-8">
              <ContentRow 
                title="Continue Watching for Arnav"
                items={CONTENT_ROWS[3].items.slice(0, 6)}
                showProgress={true}
                size="medium"
              />
            </div>

            {/* Action Movies */}
            <div className="mb-8">
              <ContentRow 
                title="Action Movies"
                items={CONTENT_ROWS[0].items}
                size="medium"
              />
            </div>

            {/* Comedy Series */}
            <div className="mb-8">
              <ContentRow 
                title="Comedy Series"
                items={CONTENT_ROWS[1].items}
                size="medium"
              />
            </div>

            {/* Top 10 in India Today */}
            <div className="mb-8">
              <ContentRow 
                title="Top 10 in India Today"
                items={CONTENT_ROWS[0].items.slice(0, 10)}
                showNumbers={true}
                isTop10={true}
                size="medium"
              />
            </div>

            {/* Because you watched... */}
            <div className="mb-8">
              <ContentRow 
                title="Because you watched Big Buck Bunny"
                items={CONTENT_ROWS[2].items}
                size="medium"
              />
            </div>

            {/* New Releases */}
            <div className="mb-8">
              <ContentRow 
                title="New Releases"
                items={CONTENT_ROWS[3].items}
                size="medium"
              />
            </div>

            {/* My List */}
            <div className="mb-8">
              <ContentRow 
                title="My List"
                items={CONTENT_ROWS[1].items.slice(0, 4)}
                size="large"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Netflix Footer */}
      <footer className="bg-black border-t border-gray-800 py-12 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <p className="text-gray-400 text-sm mb-4">Questions? Call 000-800-040-1843</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-400 mb-8">
            <div className="space-y-3">
              <a href="#" className="block hover:underline transition-colors">FAQ</a>
              <a href="#" className="block hover:underline transition-colors">Investor Relations</a>
              <a href="#" className="block hover:underline transition-colors">Privacy</a>
              <a href="#" className="block hover:underline transition-colors">Speed Test</a>
            </div>
            <div className="space-y-3">
              <a href="#" className="block hover:underline transition-colors">Help Centre</a>
              <a href="#" className="block hover:underline transition-colors">Jobs</a>
              <a href="#" className="block hover:underline transition-colors">Cookie Preferences</a>
              <a href="#" className="block hover:underline transition-colors">Legal Notices</a>
            </div>
            <div className="space-y-3">
              <a href="#" className="block hover:underline transition-colors">Account</a>
              <a href="#" className="block hover:underline transition-colors">Ways to Watch</a>
              <a href="#" className="block hover:underline transition-colors">Corporate Information</a>
              <a href="#" className="block hover:underline transition-colors">Only on Netflix</a>
            </div>
            <div className="space-y-3">
              <a href="#" className="block hover:underline transition-colors">Media Centre</a>
              <a href="#" className="block hover:underline transition-colors">Terms of Use</a>
              <a href="#" className="block hover:underline transition-colors">Contact Us</a>
            </div>
          </div>

          <div className="mb-6">
            <button className="border border-gray-600 px-4 py-2 text-gray-400 text-sm hover:border-gray-400 transition-colors">
              Service Code
            </button>
          </div>
          
          <div className="text-gray-500 text-sm">
            <p>&copy; 1997-2024 Netflix, Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}