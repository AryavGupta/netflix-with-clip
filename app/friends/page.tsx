'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';
import { useClipsStore, type SharedClip } from '@/lib/stores/clips';
import { DEMO_USERS } from '@/lib/data/users';
import NetflixHeader from '@/components/netflix/Header';
import { Play, Clock, MessageSquare, Users, Share2, Trash2 } from 'lucide-react';

export default function FriendsPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuthStore();
  const { clips, getClipsForUser, getClipsSharedByUser, deleteClip } = useClipsStore();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/auth/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  const receivedClips = getClipsForUser(user.id).filter(clip => clip.sharedBy.id !== user.id);
  const sentClips = getClipsSharedByUser(user.id);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: SharedClip['status']) => {
    switch (status) {
      case 'ready': return 'text-green-400';
      case 'processing': return 'text-yellow-400';
      case 'pending': return 'text-gray-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (status: SharedClip['status']) => {
    switch (status) {
      case 'ready': return 'Ready';
      case 'processing': return 'Processing...';
      case 'pending': return 'Uploading...';
      case 'failed': return 'Failed';
      default: return 'Unknown';
    }
  };

  const ClipCard = ({ clip, showDelete = false }: { clip: SharedClip; showDelete?: boolean }) => (
    <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
      <div className="flex space-x-4">
        {/* Thumbnail */}
        <div className="relative flex-shrink-0">
          <img 
            src={clip.contentThumbnail} 
            alt={clip.contentTitle}
            className="w-24 h-16 object-cover rounded"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/96x64/374151/9CA3AF?text=No+Image';
            }}
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded">
            <Play className="h-6 w-6 text-white fill-current" />
          </div>
          
          {/* Status indicator */}
          <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
            clip.status === 'ready' ? 'bg-green-400' :
            clip.status === 'processing' ? 'bg-yellow-400' :
            clip.status === 'pending' ? 'bg-gray-400' : 'bg-red-400'
          }`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-white truncate">{clip.contentTitle}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
                <Clock className="h-4 w-4" />
                <span>{formatTime(clip.startTime)} - {formatTime(clip.endTime)}</span>
                <span>•</span>
                <span>{clip.duration}s clip</span>
              </div>
            </div>
            
            {showDelete && (
              <button
                onClick={() => deleteClip(clip.id)}
                className="p-1 hover:bg-gray-600 rounded transition-colors"
                title="Delete clip"
              >
                <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-400" />
              </button>
            )}
          </div>

          {/* Shared by/with */}
          <div className="flex items-center space-x-2 mt-2">
            <img 
              src={clip.sharedBy.avatar} 
              alt={clip.sharedBy.name}
              className="w-6 h-6 rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/24x24/374151/9CA3AF?text=' + clip.sharedBy.name.charAt(0);
              }}
            />
            <span className="text-sm text-gray-300">
              {activeTab === 'received' ? `From ${clip.sharedBy.name}` : `To ${clip.sharedWith.length} friend${clip.sharedWith.length !== 1 ? 's' : ''}`}
            </span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">{formatDate(clip.createdAt)}</span>
          </div>

          {/* Reaction */}
          {clip.reaction && (
            <div className="mt-2 p-2 bg-gray-700 rounded text-sm">
              <div className="flex items-center space-x-1 text-gray-400 mb-1">
                <MessageSquare className="h-3 w-3" />
                <span className="text-xs uppercase">{clip.reaction.type} Reaction</span>
              </div>
              <p className="text-white">{clip.reaction.content}</p>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center justify-between mt-2">
            <span className={`text-xs font-medium ${getStatusColor(clip.status)}`}>
              {getStatusText(clip.status)}
            </span>
            
            {clip.status === 'ready' && (
              <button 
                onClick={() => router.push(`/watch/${clip.contentId}?t=${Math.floor(clip.startTime)}`)}
                className="text-xs text-netflix-red hover:text-red-400 font-medium flex items-center space-x-1"
              >
                <Play className="h-3 w-3" />
                <span>Watch Scene →</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />
      
      <main className="pt-20 px-4 md:px-16 pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Friends & Clips</h1>
          <p className="text-gray-400">Share your favorite moments and see what your friends are watching</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-800 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab('received')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'received' 
                ? 'bg-netflix-red text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Received ({receivedClips.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'sent' 
                ? 'bg-netflix-red text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sent ({sentClips.length})
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'received' && (
            <>
              {receivedClips.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-300 mb-2">No clips received yet</h3>
                  <p className="text-gray-500">When friends share clips with you, they&apos;ll appear here</p>
                </div>
              ) : (
                receivedClips.map(clip => (
                  <ClipCard key={clip.id} clip={clip} />
                ))
              )}
            </>
          )}

          {activeTab === 'sent' && (
            <>
              {sentClips.length === 0 ? (
                <div className="text-center py-12">
                  <Share2 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-300 mb-2">No clips shared yet</h3>
                  <p className="text-gray-500 mb-4">Start watching shows and share your favorite moments!</p>
                  <button 
                    onClick={() => router.push('/browse')}
                    className="bg-netflix-red hover:bg-red-700 px-6 py-2 rounded font-medium transition-colors"
                  >
                    Browse Content
                  </button>
                </div>
              ) : (
                sentClips.map(clip => (
                  <ClipCard key={clip.id} clip={clip} showDelete={true} />
                ))
              )}
            </>
          )}
        </div>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-12 p-4 bg-gray-900 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-yellow-400">🔧 Debug Info</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Total Clips in Store:</strong> {clips.length}</p>
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>User Friends:</strong> {user.friends?.join(', ') || 'None'}</p>
              <p><strong>Received Clips:</strong> {receivedClips.length}</p>
              <p><strong>Sent Clips:</strong> {sentClips.length}</p>
            </div>
            
            {clips.length > 0 && (
              <details className="mt-4">
                <summary className="cursor-pointer text-yellow-400">View All Clips Data</summary>
                <pre className="mt-2 p-2 bg-black rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(clips, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}
      </main>
    </div>
  );
}