import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Role } from '@/types';
import { SEED_USERS } from '@/constants/mockData';
import { STUDENT_EMAIL_DOMAIN, STAFF_EMAIL_DOMAIN } from '@/constants/config';
import { getLoyaltyTier } from '@/lib/utils';

interface AuthState {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  addLoyaltyPoints: (points: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: SEED_USERS,
      isAuthenticated: false,

      login: (email: string, password: string) => {
        const encoded = btoa(password);
        const found = get().users.find(u => u.email === email && u.password === encoded);
        if (!found) return { success: false, error: 'Invalid email or password' };
        set({ user: found, isAuthenticated: true });
        return { success: true };
      },

      register: (name: string, email: string, password: string) => {
        const isStudent = email.endsWith(STUDENT_EMAIL_DOMAIN);
        const isStaff = email.endsWith(STAFF_EMAIL_DOMAIN);
        if (!isStudent && !isStaff) {
          return { success: false, error: `Only ${STUDENT_EMAIL_DOMAIN} or ${STAFF_EMAIL_DOMAIN} emails are allowed` };
        }
        if (get().users.find(u => u.email === email)) {
          return { success: false, error: 'Email already registered' };
        }
        const role: Role = isStudent ? 'student' : 'manager';
        const newUser: User = {
          id: `u${Date.now()}`,
          name,
          email,
          password: btoa(password),
          role,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=D4A843&color=0B0B0F&size=80`,
          loyaltyPoints: 0,
          loyaltyTier: role === 'student' ? 'Bronze Archivist' : 'Manager',
          joinedAt: new Date().toISOString().split('T')[0],
        };
        set(s => ({ users: [...s.users, newUser], user: newUser, isAuthenticated: true }));
        return { success: true };
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      addLoyaltyPoints: (points: number) => {
        const { user } = get();
        if (!user) return;
        const newPoints = user.loyaltyPoints + points;
        const updated = { ...user, loyaltyPoints: newPoints, loyaltyTier: getLoyaltyTier(newPoints) };
        set(s => ({
          user: updated,
          users: s.users.map(u => u.id === updated.id ? updated : u),
        }));
      },
    }),
    { name: 'retcom-auth' }
  )
);
