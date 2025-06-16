'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, isLoggedIn, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push('/browse');
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const success = await login(formData.username, formData.password);
    if (success) {
      router.push('/browse');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const demoCredentials = [
    { username: 'arnav', password: 'demo123', name: 'Arnav' },
    { username: 'divya', password: 'demo123', name: 'Divya' },
    { username: 'demo', password: 'demo123', name: 'Demo User' }
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1489599843714-2c23a5de6238?w=1920&h=1080&fit=crop)',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Netflix Logo - Changed to Image */}
      <div className="absolute top-8 left-8 z-10">
        <button 
          onClick={() => router.push('/')}
          className="hover:opacity-80 transition-opacity"
        >
          <img 
            src="https://firestories.s3.ap-south-1.amazonaws.com/ott_icons/netflix_transparent.png"
            alt="Netflix"
            className="h-10 w-auto"
            onError={(e) => {
              // Fallback to text if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.insertAdjacentHTML('afterend', 
                '<span class="text-3xl font-bold text-netflix-red">NETFLIX</span>'
              );
            }}
          />
        </button>
      </div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-black/75 p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-8 text-white">Sign In</h2>
          
          {error && (
            <div className="bg-red-600/20 border border-red-600 text-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-white focus:bg-gray-600"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-white focus:bg-gray-600 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-netflix-red hover:bg-red-700 text-white py-3 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 pt-6 border-t border-gray-600">
            <p className="text-sm text-gray-400 mb-4">Demo Credentials:</p>
            <div className="space-y-2">
              {demoCredentials.map((cred, index) => (
                <button
                  key={index}
                  onClick={() => setFormData({ username: cred.username, password: cred.password })}
                  className="w-full text-left p-2 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
                >
                  <span className="text-white font-medium">{cred.name}</span>
                  <span className="text-gray-400 ml-2">({cred.username})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}