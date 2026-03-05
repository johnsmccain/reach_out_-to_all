import { create } from 'zustand';
import type { Notification, NotificationPreferences } from '@/types/notifications';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences;
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  setPreferences: (preferences: Partial<NotificationPreferences>) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  preferences: {
    email_notifications: true,
    push_notifications: true,
    sound_enabled: true,
    notification_types: [
      'article_created',
      'event_created',
      'sermon_created',
      'document_uploaded',
      'comment_added',
    ],
  },

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      read: false,
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));

    // Play sound if enabled
    if (notification.priority === 'high' || notification.priority === 'urgent') {
      // You can add sound here
    }
  },

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  deleteNotification: (id) =>
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: notification && !notification.read 
          ? Math.max(0, state.unreadCount - 1) 
          : state.unreadCount,
      };
    }),

  clearAll: () =>
    set({
      notifications: [],
      unreadCount: 0,
    }),

  setPreferences: (preferences) =>
    set((state) => ({
      preferences: { ...state.preferences, ...preferences },
    })),
}));
