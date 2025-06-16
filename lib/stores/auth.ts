import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { findUserByCredentials, type User } from '@/lib/data/users';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));

          const user = findUserByCredentials(username, password);
          
          if (user) {
            set({ 
              user, 
              isLoggedIn: true, 
              isLoading: false,
              error: null 
            });
            return true;
          } else {
            set({ 
              error: 'Invalid username or password',
              isLoading: false 
            });
            return false;
          }
        } catch (error) {
          console.log(error);
          set({ 
            error: 'Login failed. Please try again.',
            isLoading: false 
          });
          return false;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isLoggedIn: false, 
          error: null 
        });
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'netflix-auth',
      partialize: (state) => ({ 
        user: state.user, 
        isLoggedIn: state.isLoggedIn 
      })
    }
  )
);