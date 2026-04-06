import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { STUDENT_EMAIL_DOMAIN, STAFF_EMAIL_DOMAIN } from '@/constants/config';
import { getLoyaltyTier } from '@/lib/utils';
import { authService } from '@/services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  loadCurrentUser: () => Promise<void>;
  addLoyaltyPoints: (points: number) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authService.login(email, password);
          if (result.success) {
            const user = await authService.getCurrentUser();
            if (user) {
              set({ user, isAuthenticated: true });
            }
            return { success: true };
          } else {
            set({ error: result.error });
            return { success: false, error: result.error };
          }
        } catch (err) {
          const error = err instanceof Error ? err.message : 'Login failed';
          set({ error });
          return { success: false, error };
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const isStudent = email.endsWith(STUDENT_EMAIL_DOMAIN);
          const isStaff = email.endsWith(STAFF_EMAIL_DOMAIN);
          if (!isStudent && !isStaff) {
            const error = `Only ${STUDENT_EMAIL_DOMAIN} or ${STAFF_EMAIL_DOMAIN} emails are allowed`;
            set({ error });
            return { success: false, error };
          }

          const result = await authService.register(name, email, password);
          if (result.success) {
            const user = await authService.getCurrentUser();
            if (user) {
              set({ user, isAuthenticated: true });
            }
            return { success: true };
          } else {
            set({ error: result.error });
            return { success: false, error: result.error };
          }
        } catch (err) {
          const error = err instanceof Error ? err.message : 'Registration failed';
          set({ error });
          return { success: false, error };
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          const result = await authService.logout();
          if (result.success) {
            set({ user: null, isAuthenticated: false });
          }
          return result;
        } catch (err) {
          const error = err instanceof Error ? err.message : 'Logout failed';
          return { success: false, error };
        } finally {
          set({ isLoading: false });
        }
      },

      loadCurrentUser: async () => {
        try {
          const user = await authService.getCurrentUser();
          if (user) {
            set({ user, isAuthenticated: true });
          }
        } catch (err) {
          console.error('Failed to load current user:', err);
        }
      },

      addLoyaltyPoints: async (points: number) => {
        const { user } = get();
        if (!user) return;

        try {
          await authService.addLoyaltyPoints(user.id, points);
          const newPoints = user.loyaltyPoints + points;
          const updated: User = {
            ...user,
            loyaltyPoints: newPoints,
            loyaltyTier: getLoyaltyTier(newPoints),
          };
          set({ user: updated });
        } catch (err) {
          const error = err instanceof Error ? err.message : 'Failed to add points';
          set({ error });
        }
      },

      clearError: () => set({ error: null }),
    }),
    { name: 'retcom-auth' }
  )
);
