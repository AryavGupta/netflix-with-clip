'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';

export default function NetflixHeader() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll to change header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? 'bg-black' : 'bg-gradient-to-b from-black/70 via-black/40 to-transparent'
    }`}>
      <div className="flex items-center justify-between px-4 py-4 md:px-12">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center space-x-8">
          {/* Netflix Logo - Changed to Image */}
          <button 
            onClick={() => router.push('/browse')}
            className="hover:opacity-80 transition-opacity"
          >
            <img 
              src="https://firestories.s3.ap-south-1.amazonaws.com/ott_icons/netflix_transparent.png"
              alt="Netflix"
              className="h-8 w-auto"
              onError={(e) => {
                // Fallback to text if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.insertAdjacentHTML('afterend', 
                  '<span class="text-netflix-red text-3xl font-black tracking-tight" style="font-family: Netflix Sans, Helvetica Neue, Helvetica, Arial, sans-serif; letter-spacing: -0.5px;">NETFLIX</span>'
                );
              }}
            />
          </button>
          
          {/* Navigation Menu - Exact Netflix layout */}
          <nav className="hidden md:flex space-x-5 text-sm font-medium">
            <button 
              onClick={() => router.push('/browse')}
              className="text-white hover:text-gray-300 transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => router.push('/browse/genre/series')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              TV Shows
            </button>
            <button 
              onClick={() => router.push('/browse/genre/movies')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Movies
            </button>
            <button 
              onClick={() => router.push('/browse/games')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Games
            </button>
            <button 
              onClick={() => router.push('/browse/new')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              New & Popular
            </button>
            <button 
              onClick={() => router.push('/browse/my-list')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              My List
            </button>
            <button 
              onClick={() => router.push('/browse/languages')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Browse by Languages
            </button>
          </nav>
        </div>

        {/* Right side - Search, Children, Notifications, Profile */}
        <div className="flex items-center space-x-4">
          {/* Search - Netflix style expandable */}
          <div className="relative">
            {showSearch ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Titles, people, genres"
                    className="bg-black/80 border border-white/30 rounded pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white focus:bg-black w-64 transition-all"
                    autoFocus
                    onBlur={() => {
                      if (!searchQuery) setShowSearch(false);
                    }}
                  />
                </div>
              </form>
            ) : (
              <button 
                onClick={() => setShowSearch(true)}
                className="p-2 hover:text-gray-300 transition-colors"
              >
                <Search className="h-5 w-5 text-white" />
              </button>
            )}
          </div>

          {/* Children */}
          <button 
            onClick={() => router.push('/browse/kids')}
            className="text-white hover:text-gray-300 transition-colors text-sm font-medium hidden md:block"
          >
            Children
          </button>

          {/* Notifications with red badge */}
          <button className="relative p-2 hover:text-gray-300 transition-colors">
            <Bell className="h-5 w-5 text-white" />
            <span className="absolute -top-1 -right-1 bg-netflix-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              3
            </span>
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 hover:text-gray-300 transition-colors"
              onBlur={() => setTimeout(() => setShowProfileMenu(false), 150)}
            >
              <img 
                src={user?.avatar || '/api/placeholder/32/32'}
                alt="Profile"
                className="h-8 w-8 rounded object-cover"
              />
              <ChevronDown className={`h-4 w-4 text-white transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-black/95 backdrop-blur-sm border border-gray-700 rounded shadow-2xl">
                {/* Profile Header */}
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={user?.avatar || '/api/placeholder/32/32'}
                      alt="Profile"
                      className="h-8 w-8 rounded object-cover"
                    />
                    <div>
                      <p className="text-white font-medium text-sm">{user?.name || 'User'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Menu Items */}
                <div className="py-1">
                  <button 
                    onClick={() => {
                      router.push('/friends');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors text-sm"
                  >
                    Friends & Clips
                  </button>
                  
                  <button 
                    onClick={() => {
                      router.push('/account');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors text-sm"
                  >
                    Account
                  </button>
                  
                  <button 
                    onClick={() => {
                      router.push('/help');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors text-sm"
                  >
                    Help Center
                  </button>
                </div>
                
                <div className="border-t border-gray-700 py-1">
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors text-sm"
                  >
                    Sign out of Netflix
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden px-4 pb-2 border-t border-gray-800/50">
        <nav className="flex space-x-4 text-sm overflow-x-auto py-2">
          <button 
            onClick={() => router.push('/browse')}
            className="text-white whitespace-nowrap"
          >
            Home
          </button>
          <button 
            onClick={() => router.push('/browse/genre/series')}
            className="text-gray-300 whitespace-nowrap"
          >
            TV Shows
          </button>
          <button 
            onClick={() => router.push('/browse/genre/movies')}
            className="text-gray-300 whitespace-nowrap"
          >
            Movies
          </button>
          <button 
            onClick={() => router.push('/browse/games')}
            className="text-gray-300 whitespace-nowrap"
          >
            Games
          </button>
          <button 
            onClick={() => router.push('/browse/new')}
            className="text-gray-300 whitespace-nowrap"
          >
            New & Popular
          </button>
        </nav>
      </div>
    </header>
  );
}