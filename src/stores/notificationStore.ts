import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Notification } from '@/types';
import { SEED_NOTIFICATIONS } from '@/constants/mockData';

interface NotificationState {
  notifications: Notification[];
  addNotification: (n: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: SEED_NOTIFICATIONS,
      addNotification: (n) => {
        const newN: Notification = {
          ...n,
          id: `n${Date.now()}`,
          read: false,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set(s => ({ notifications: [newN, ...s.notifications] }));
      },
      markRead: (id) => set(s => ({
        notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n),
      })),
      markAllRead: () => set(s => ({
        notifications: s.notifications.map(n => ({ ...n, read: true })),
      })),
      unreadCount: () => get().notifications.filter(n => !n.read).length,
    }),
    { name: 'retcom-notifications' }
  )
);
