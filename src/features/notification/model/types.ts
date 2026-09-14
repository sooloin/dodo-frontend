export type NotificationType = 'COMMENT' | 'BOARD' | 'REACTION' | 'PET' | 'HEALTH' | 'SYSTEM';

export interface NotificationItem {
  notificationId: number;
  notificationTitle: string;
  notificationBody: string;
  notificationType: NotificationType;
  relatedId: number;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPageInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface NotificationListResponse {
  pageInfo: NotificationPageInfo;
  data: NotificationItem[];
}

export interface NotificationListParams {
  page?: number;
  size?: number;
  isRead?: boolean;
  type?: NotificationType;
}

export interface NotificationSimpleResponse {
  message: string;
}

export interface UnreadNotificationCountResponse {
  unreadCount: number;
}
