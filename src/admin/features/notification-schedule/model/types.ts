export type NotificationScheduleType = 'COMMENT' | 'BOARD' | 'REACTION' | 'PET' | 'HEALTH' | 'SYSTEM';
export type NotificationScheduleTargetType = 'ALL' | 'USERS';
export type NotificationScheduleRepeatType = 'NONE' | 'DAILY' | 'WEEKLY';
export type NotificationScheduleStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELED';

export interface CreateNotificationScheduleRequest {
  title: string;
  body: string;
  notificationType: NotificationScheduleType;
  targetType: NotificationScheduleTargetType;
  /** targetType이 USERS일 때만 사용, UUID 목록 */
  targetUserIds?: string[];
  scheduledAt: string;
  repeatType?: NotificationScheduleRepeatType;
}

export interface CreateNotificationScheduleResponse {
  message: string;
  scheduleId: number;
  scheduleStatus: NotificationScheduleStatus;
  scheduledAt: string;
}
