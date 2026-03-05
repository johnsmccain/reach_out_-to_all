// Notification types and interfaces

export type NotificationType = 
  | 'article_created'
  | 'article_updated'
  | 'event_created'
  | 'event_updated'
  | 'sermon_created'
  | 'sermon_updated'
  | 'document_uploaded'
  | 'quote_uploaded'
  | 'comment_added'
  | 'system_alert'
  | 'user_activity';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  read: boolean;
  created_at: string;
  action_url?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  sound_enabled: boolean;
  notification_types: NotificationType[];
}
