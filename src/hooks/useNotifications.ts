import { useNotificationStore } from '@/store/notificationStore';
import type { NotificationType, NotificationPriority } from '@/types/notifications';

export const useNotifications = () => {
  const { addNotification } = useNotificationStore();

  const notify = {
    articleCreated: (title: string) => {
      addNotification({
        type: 'article_created',
        title: 'New Article Created',
        message: `"${title}" has been published successfully.`,
        priority: 'medium',
      });
    },

    articleUpdated: (title: string) => {
      addNotification({
        type: 'article_updated',
        title: 'Article Updated',
        message: `"${title}" has been updated.`,
        priority: 'low',
      });
    },

    eventCreated: (title: string) => {
      addNotification({
        type: 'event_created',
        title: 'New Event Created',
        message: `Event "${title}" has been added to the calendar.`,
        priority: 'high',
      });
    },

    eventUpdated: (title: string) => {
      addNotification({
        type: 'event_updated',
        title: 'Event Updated',
        message: `Event "${title}" has been modified.`,
        priority: 'medium',
      });
    },

    sermonCreated: (title: string) => {
      addNotification({
        type: 'sermon_created',
        title: 'New Sermon Added',
        message: `Sermon "${title}" is now available.`,
        priority: 'medium',
      });
    },

    sermonUpdated: (title: string) => {
      addNotification({
        type: 'sermon_updated',
        title: 'Sermon Updated',
        message: `Sermon "${title}" has been updated.`,
        priority: 'low',
      });
    },

    documentUploaded: (title: string) => {
      addNotification({
        type: 'document_uploaded',
        title: 'Document Uploaded',
        message: `"${title}" has been uploaded successfully.`,
        priority: 'low',
      });
    },

    quoteUploaded: (date: string) => {
      addNotification({
        type: 'quote_uploaded',
        title: 'Quote Uploaded',
        message: `Daily quote for ${date} has been uploaded.`,
        priority: 'low',
      });
    },

    commentAdded: (articleTitle: string, author: string) => {
      addNotification({
        type: 'comment_added',
        title: 'New Comment',
        message: `${author} commented on "${articleTitle}".`,
        priority: 'medium',
      });
    },

    systemAlert: (message: string, priority: NotificationPriority = 'high') => {
      addNotification({
        type: 'system_alert',
        title: 'System Alert',
        message,
        priority,
      });
    },

    custom: (
      type: NotificationType,
      title: string,
      message: string,
      priority: NotificationPriority = 'medium'
    ) => {
      addNotification({
        type,
        title,
        message,
        priority,
      });
    },
  };

  return notify;
};
