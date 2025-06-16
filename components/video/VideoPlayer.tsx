'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  SkipBack, 
  SkipForward,
  ArrowLeft,
  Share2
} from 'lucide-react';
import SocialOverlay from '@/components/social/SocialOverlay';
import type { Content } from '@/lib/data/content';

interface VideoPlayerProps {
  content: Content;
  startTime?: number | null;
}

export default function VideoPlayer({ content, startTime = null }: VideoPlayerProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  // Video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  
  // Timeline preview
  const [showTimelinePreview, setShowTimelinePreview] = useState(false);
  const [previewTime, setPreviewTime] = useState(0);
  const [previewPosition, setPreviewPosition] = useState(0);
  
  // Social features
  const [showSocialOverlay, setShowSocialOverlay] = useState(false);
  const [wasPlayingBeforeClip, setWasPlayingBeforeClip] = useState(false);
  const [showTimestampNotification, setShowTimestampNotification] = useState(false);
  const [clipStartTime, setClipStartTime] = useState<number>(0);
  
  // Control visibility timer
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Enhanced back navigation handler with immediate browser fallback
  const handleBackNavigation = () => {
    console.log('🔙 Back button clicked');
    
    // Pause video before navigating
    const video = videoRef.current;
    if (video && isPlaying) {
      video.pause();
      setIsPlaying(false);
    }
    
    // Use browser's native history first (most reliable)
    try {
      console.log('📊 History length:', window.history.length);
      
      if (window.history.length > 1) {
        // Use native browser back
        window.history.back();
        console.log('✅ Used window.history.back()');
        return;
      }
    } catch (error) {
      console.error('❌ window.history.back() failed:', error);
    }
    
    // Try Next.js router as secondary option
    try {
      router.push('/');
      console.log('✅ Used router.push to home');
      return;
    } catch (routerError) {
      console.error('❌ Router navigation failed:', routerError);
    }
    
    // Final fallback: hard redirect
    try {
      window.location.href = '/';
      console.log('✅ Used window.location redirect');
    } catch (locationError) {
      console.error('❌ All navigation methods failed:', locationError);
      // At this point, try to at least close/refresh
      window.location.reload();
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);
    const handleLoadStart = () => setIsBuffering(true);
    
    // Handle seeking to start time when video loads
    const handleLoadedData = () => {
      if (startTime !== null && startTime >= 0) {
        video.currentTime = startTime;
        setCurrentTime(startTime);
        setShowTimestampNotification(true);
        console.log(`🎯 Seeking to timestamp: ${startTime}s`);
        
        // Hide notification after 3 seconds
        setTimeout(() => setShowTimestampNotification(false), 3000);
      }
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadstart', handleLoadStart);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, [startTime]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard controls
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't handle keyboard if social overlay is open or if user is typing
    if (showSocialOverlay || (e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') {
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowRight':
        e.preventDefault();
        seekRelative(10);
        setShowControls(true);
        resetControlsTimer();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        seekRelative(-10);
        setShowControls(true);
        resetControlsTimer();
        break;
      case 'KeyM':
        e.preventDefault();
        toggleMute();
        break;
      case 'KeyF':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 'KeyC':
        e.preventDefault();
        handleClipButtonClick();
        break;
      case 'Escape':
        e.preventDefault();
        handleBackNavigation();
        break;
    }
  }, [showSocialOverlay, currentTime]);

  // Add keyboard event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Auto-hide controls
  const resetControlsTimer = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    setShowControls(true);
    
    if (isPlaying && !showSocialOverlay) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, showSocialOverlay]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    video.currentTime = newTime;
    
    console.log(`🎯 Seeked to: ${formatTime(newTime)}`);
  };

  // Handle timeline hover
  const handleTimelineMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const hoverTime = Math.max(0, Math.min(duration, percent * duration));
    
    setPreviewTime(hoverTime);
    setPreviewPosition(e.clientX - rect.left);
    setShowTimelinePreview(true);
  };

  const handleTimelineMouseLeave = () => {
    setShowTimelinePreview(false);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;

    setVolume(newVolume);
    video.volume = newVolume;
    
    if (newVolume === 0) {
      setIsMuted(true);
      video.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      video.muted = false;
    }
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!isFullscreen) {
        await container.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  // Fixed relative seeking function
  const seekRelative = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    video.currentTime = newTime;
    
    const direction = seconds > 0 ? 'forward' : 'backward';
    console.log(`⏭️ Seeked ${Math.abs(seconds)}s ${direction}: ${formatTime(currentTime)} → ${formatTime(newTime)}`);
  };

  // Deprecated skipTime function (kept for backward compatibility)
  // const skipTime = (seconds: number) => {
  //   seekRelative(seconds);

  // };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercent = () => {
    if (!duration) return 0;
    return (currentTime / duration) * 100;
  };

  // Enhanced clip button click handler - works for both buttons
  const handleClipButtonClick = () => {
    const video = videoRef.current;
    if (!video) return;

    // Capture the EXACT current timestamp when clip button is pressed
    const exactTimestamp = video.currentTime;
    setClipStartTime(exactTimestamp);
    
    console.log(`🎬 Clip button pressed at: ${formatTime(exactTimestamp)}`);
    console.log(`📹 Video was ${isPlaying ? 'playing' : 'paused'}`);

    // Remember if video was playing
    setWasPlayingBeforeClip(isPlaying);
    
    // Always pause when opening clip overlay (regardless of current state)
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      console.log(`⏸️ Video paused for clipping`);
    }
    
    // Show controls and overlay
    setShowControls(true);
    setShowSocialOverlay(true);
  };

  // Handle closing social overlay
  const handleCloseSocialOverlay = () => {
    setShowSocialOverlay(false);
    
    // Resume playing if it was playing before
    const video = videoRef.current;
    if (video && wasPlayingBeforeClip) {
      video.play();
      setIsPlaying(true);
      console.log(`▶️ Resumed playing after clip creation`);
    }
    
    setWasPlayingBeforeClip(false);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen bg-black group"
      onMouseMove={resetControlsTimer}
      onMouseLeave={() => setShowControls(false)}
      style={{ cursor: showControls ? 'default' : 'none' }}
      tabIndex={0} // Make div focusable for keyboard events
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={content.videoUrl}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
        </div>
      )}

      {/* Timestamp notification */}
      {showTimestampNotification && startTime !== null && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-40 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg">
          <p className="text-white text-sm font-medium">
            🎯 Jumped to {formatTime(startTime)}
          </p>
        </div>
      )}

      {/* Keyboard shortcuts help */}
      <div className="absolute top-4 right-4 z-40 opacity-0 hover:opacity-100 transition-opacity">
        <div className="bg-black/80 backdrop-blur-sm px-3 py-2 rounded text-xs text-white">
          <div className="text-gray-300 mb-1">Shortcuts:</div>
          <div>Space: Play/Pause</div>
          <div>← →: Seek ±10s</div>
          <div>C: Clip moment</div>
          <div>M: Mute</div>
          <div>F: Fullscreen</div>
          <div>Esc: Back</div>
        </div>
      </div>

      {/* Social Overlay */}
      {showSocialOverlay && (
        <SocialOverlay
          content={content}
          currentTime={clipStartTime} // Use the captured timestamp
          onClose={handleCloseSocialOverlay}
        />
      )}

      {/* Video Controls */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300 ${
          showControls || showSocialOverlay ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top controls */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleBackNavigation();
              }}
              className="p-2 hover:bg-white/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 active:bg-white/30"
              title="Back (Esc)"
              type="button"
              style={{ zIndex: 50 }}
            >
              <ArrowLeft className="h-6 w-6 text-white" />
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-white">{content.title}</h1>
              <p className="text-gray-300 text-sm">{content.year} • {content.rating}</p>
            </div>
          </div>
          
          {/* Removed non-functional buttons - keeping only back button and title */}
        </div>

        {/* Center play button (when paused) */}
        {!isPlaying && !isBuffering && !showSocialOverlay && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button 
              onClick={togglePlay}
              className="bg-white/20 hover:bg-white/30 rounded-full p-6 transition-all duration-200 transform hover:scale-110"
            >
              <Play className="h-12 w-12 text-white fill-current ml-1" />
            </button>
          </div>
        )}

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Enhanced Progress bar with preview */}
          <div className="mb-4 relative">
            <div 
              ref={progressBarRef}
              className="w-full h-1 bg-gray-600 rounded cursor-pointer hover:h-2 transition-all duration-200 relative"
              onClick={handleSeek}
              onMouseMove={handleTimelineMouseMove}
              onMouseLeave={handleTimelineMouseLeave}
            >
              {/* Background (unwatched) */}
              <div className="absolute inset-0 bg-gray-600 rounded" />
              
              {/* Progress (watched) */}
              <div 
                className="absolute top-0 left-0 h-full bg-netflix-red rounded transition-all duration-100"
                style={{ width: `${getProgressPercent()}%` }}
              />
              
              {/* Progress handle */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-netflix-red rounded-full opacity-0 hover:opacity-100 transition-opacity"
                style={{ left: `${getProgressPercent()}%`, transform: 'translateX(-50%) translateY(-50%)' }}
              />
            </div>

            {/* Timeline preview tooltip */}
            {showTimelinePreview && (
              <div 
                className="absolute bottom-full mb-2 bg-black/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-white whitespace-nowrap"
                style={{ 
                  left: `${previewPosition}px`, 
                  transform: 'translateX(-50%)',
                  pointerEvents: 'none'
                }}
              >
                {formatTime(previewTime)}
              </div>
            )}
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Play/Pause */}
              <button 
                onClick={togglePlay}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                title="Play/Pause (Space)"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8 text-white" />
                ) : (
                  <Play className="h-8 w-8 text-white fill-current" />
                )}
              </button>

              {/* Skip buttons */}
              <button 
                onClick={() => seekRelative(-10)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                title="Skip back 10 seconds (←)"
              >
                <SkipBack className="h-6 w-6 text-white" />
              </button>

              <button 
                onClick={() => seekRelative(10)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                title="Skip forward 10 seconds (→)"
              >
                <SkipForward className="h-6 w-6 text-white" />
              </button>

              {/* Volume control */}
              <div className="flex items-center space-x-2 group/volume">
                <button 
                  onClick={toggleMute} 
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  title="Mute/Unmute (M)"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-6 w-6 text-white" />
                  ) : (
                    <Volume2 className="h-6 w-6 text-white" />
                  )}
                </button>
                
                <div className="w-0 group-hover/volume:w-24 overflow-hidden transition-all duration-300">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* Time display */}
              <span className="text-sm text-white font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Main Clip button - only functional clip button */}
              <button
                onClick={handleClipButtonClick}
                className="bg-netflix-red hover:bg-red-700 px-4 py-2 rounded text-sm flex items-center space-x-2 transition-colors font-medium"
                title="Clip this moment (C)"
              >
                <Share2 className="h-4 w-4" />
                <span>Clip This Moment</span>
              </button>

              {/* Fullscreen */}
              <button 
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                title="Fullscreen (F)"
              >
                {isFullscreen ? (
                  <Minimize className="h-6 w-6 text-white" />
                ) : (
                  <Maximize className="h-6 w-6 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles for volume slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          background: #e50914;
          border-radius: 50%;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          background: #e50914;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}