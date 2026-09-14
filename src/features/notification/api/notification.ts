import { apiClient } from '@/shared/api/axios';

import type {
  NotificationListParams,
  NotificationListResponse,
  NotificationSimpleResponse,
  UnreadNotificationCountResponse,
} from '../model/types';

export async function getNotificationList(params?: NotificationListParams): Promise<NotificationListResponse> {
  const response = await apiClient.get<NotificationListResponse>('/notifications', { params });
  return response.data;
}

export async function getUnreadNotificationCount(): Promise<UnreadNotificationCountResponse> {
  const response = await apiClient.get<UnreadNotificationCountResponse>('/notifications/count/unread');
  return response.data;
}

export async function updateNotificationReadState(
  notificationId: number,
  isRead: boolean,
): Promise<NotificationSimpleResponse> {
  const response = await apiClient.patch<NotificationSimpleResponse>(`/notifications/${notificationId}`, { isRead });
  return response.data;
}

export async function markAllNotificationsRead(): Promise<NotificationSimpleResponse> {
  const response = await apiClient.patch<NotificationSimpleResponse>('/notifications/read-all');
  return response.data;
}

export async function deleteNotification(notificationId: number): Promise<NotificationSimpleResponse> {
  const response = await apiClient.delete<NotificationSimpleResponse>(`/notifications/${notificationId}`);
  return response.data;
}

export async function deleteAllNotifications(): Promise<NotificationSimpleResponse> {
  const response = await apiClient.delete<NotificationSimpleResponse>('/notifications/all');
  return response.data;
}
