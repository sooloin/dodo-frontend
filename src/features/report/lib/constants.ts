import type { ReportReason } from '../model/types';

export const REPORT_REASON_OPTIONS: ReportReason[] = [
  'SPAM',
  'SPAM_ADVERTISING',
  'ABUSE',
  'HATE_SPEECH',
  'HARASSMENT',
  'OBSCENITY',
  'IMPERSONATION',
  'INAPPROPRIATE_PROFILE',
  'PRIVATE_INFO_EXPOSURE',
];

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  SPAM: '스팸/도배',
  SPAM_ADVERTISING: '광고/홍보',
  ABUSE: '욕설/비방',
  HATE_SPEECH: '혐오 발언',
  HARASSMENT: '괴롭힘',
  OBSCENITY: '음란물',
  IMPERSONATION: '사칭',
  INAPPROPRIATE_PROFILE: '부적절한 프로필',
  PRIVATE_INFO_EXPOSURE: '개인정보 노출',
};

export const REPORT_STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: '신고 사유를 다시 확인해주세요.',
  401: '로그인이 필요해요. 다시 로그인해주세요.',
  404: '신고 대상을 찾을 수 없어요.',
  409: '이미 신고한 대상이에요.',
  500: '서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
};
