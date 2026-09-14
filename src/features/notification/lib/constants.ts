import type { NotificationType } from '../model/types';

export const NOTIFICATION_LIST_STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: '알림 조회 요청이 올바르지 않아요.',
  401: '로그인이 필요해요. 다시 로그인해주세요.',
  500: '서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
};

export const NOTIFICATION_MUTATION_STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: '요청을 처리하지 못했어요.',
  401: '로그인이 필요해요. 다시 로그인해주세요.',
  404: '알림을 찾을 수 없어요.',
  500: '서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
};

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  COMMENT: '댓글',
  BOARD: '게시글',
  REACTION: '반응',
  PET: '반려동물',
  HEALTH: '건강',
  SYSTEM: '시스템',
};
