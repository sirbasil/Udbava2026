import { supabase } from '@/lib/supabase';
import type { User } from '@/types';

export const authService = {
  async login(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      // Fetch full user profile
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileError) throw profileError;
        return { success: true, user: profile as User };
      }
      
      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    }
  },

  async register(name: string, email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;

      // Insert user profile in database
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              name,
              email,
              role: email.endsWith('@sru.edu.in') ? 'student' : 'manager',
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=D4A843&color=0B0B0F&size=80`,
              loyaltyPoints: 0,
              loyaltyTier: 'Bronze',
              joinedAt: new Date().toISOString(),
            },
          ]);
        if (profileError) throw profileError;
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Registration failed' };
    }
  },

  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Logout failed' };
    }
  },

  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!data.user) return null;

      // Fetch user profile from database
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;
      return profile as User;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async updateUserProfile(userId: string, updates: Partial<User>) {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Update failed' };
    }
  },

  async addLoyaltyPoints(userId: string, points: number) {
    try {
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('loyaltyPoints')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from('users')
        .update({ loyaltyPoints: user.loyaltyPoints + points })
        .eq('id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to add points' };
    }
  },
};
