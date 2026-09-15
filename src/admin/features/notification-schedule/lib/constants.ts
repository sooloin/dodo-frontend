import type {
  NotificationScheduleRepeatType,
  NotificationScheduleTargetType,
  NotificationScheduleType,
} from '../model/types';

export const NOTIFICATION_TYPE_OPTIONS: NotificationScheduleType[] = [
  'SYSTEM',
  'BOARD',
  'COMMENT',
  'REACTION',
  'PET',
  'HEALTH',
];

export const NOTIFICATION_TYPE_LABELS: Record<NotificationScheduleType, string> = {
  SYSTEM: '시스템',
  BOARD: '게시글',
  COMMENT: '댓글',
  REACTION: '반응',
  PET: '반려동물',
  HEALTH: '건강',
};

export const TARGET_TYPE_OPTIONS: NotificationScheduleTargetType[] = ['ALL', 'USERS'];

export const TARGET_TYPE_LABELS: Record<NotificationScheduleTargetType, string> = {
  ALL: '전체 유저',
  USERS: '특정 유저',
};

export const REPEAT_TYPE_OPTIONS: NotificationScheduleRepeatType[] = ['NONE', 'DAILY', 'WEEKLY'];

export const REPEAT_TYPE_LABELS: Record<NotificationScheduleRepeatType, string> = {
  NONE: '반복 안 함',
  DAILY: '매일',
  WEEKLY: '매주',
};
