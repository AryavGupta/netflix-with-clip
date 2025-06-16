import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ClipReaction {
  type: 'text' | 'voice' | 'video';
  content: string;
  timestamp: number;
}

export interface SharedClip {
  id: string;
  contentId: string;
  contentTitle: string;
  contentThumbnail: string;
  startTime: number;
  endTime: number;
  duration: number;
  thumbnailUrl?: string;
  clipUrl?: string; // Will be S3 URL when uploaded
  sharedBy: {
    id: number;
    name: string;
    avatar: string;
  };
  sharedWith: number[];
  reaction?: ClipReaction;
  createdAt: Date;
  status: 'pending' | 'processing' | 'ready' | 'failed';
}

interface ClipsState {
  clips: SharedClip[];
  isCreating: boolean;
  isUploading: boolean;
  currentClip: Partial<SharedClip> | null;
  
  // Actions
  createClip: (clipData: Omit<SharedClip, 'id' | 'createdAt' | 'status'>) => string;
  updateClipStatus: (clipId: string, status: SharedClip['status']) => void;
  setClipUrl: (clipId: string, clipUrl: string) => void;
  getClipsForUser: (userId: number) => SharedClip[];
  getClipsSharedByUser: (userId: number) => SharedClip[];
  deleteClip: (clipId: string) => void;
  setCurrentClip: (clip: Partial<SharedClip> | null) => void;
  setIsCreating: (isCreating: boolean) => void;
  setIsUploading: (isUploading: boolean) => void;
}

export const useClipsStore = create<ClipsState>()(
  persist(
    (set, get) => ({
      clips: [],
      isCreating: false,
      isUploading: false,
      currentClip: null,

      createClip: (clipData) => {
        const newClip: SharedClip = {
          ...clipData,
          id: `clip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          status: 'pending'
        };

        set(state => ({
          clips: [...state.clips, newClip]
        }));

        // Simulate processing
        setTimeout(() => {
          get().updateClipStatus(newClip.id, 'processing');
          
          // Simulate upload completion
          setTimeout(() => {
            get().updateClipStatus(newClip.id, 'ready');
            // Simulate setting a clip URL
            get().setClipUrl(newClip.id, `https://demo-clips.s3.amazonaws.com/${newClip.id}.mp4`);
          }, 2000);
        }, 1000);

        return newClip.id; // Return the clip ID
      },

      updateClipStatus: (clipId, status) => {
        set(state => ({
          clips: state.clips.map(clip =>
            clip.id === clipId ? { ...clip, status } : clip
          )
        }));
      },

      setClipUrl: (clipId, clipUrl) => {
        set(state => ({
          clips: state.clips.map(clip =>
            clip.id === clipId ? { ...clip, clipUrl } : clip
          )
        }));
      },

      getClipsForUser: (userId) => {
        const { clips } = get();
        return clips.filter(clip => 
          clip.sharedWith.includes(userId) || clip.sharedBy.id === userId
        );
      },

      getClipsSharedByUser: (userId) => {
        const { clips } = get();
        return clips.filter(clip => clip.sharedBy.id === userId);
      },

      deleteClip: (clipId) => {
        set(state => ({
          clips: state.clips.filter(clip => clip.id !== clipId)
        }));
      },

      setCurrentClip: (clip) => set({ currentClip: clip }),
      setIsCreating: (isCreating) => set({ isCreating }),
      setIsUploading: (isUploading) => set({ isUploading })
    }),
    {
      name: 'netflix-clips',
      partialize: (state) => ({ 
        clips: state.clips 
      })
    }
  )
);