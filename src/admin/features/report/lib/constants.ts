import { REPORT_REASON_LABELS } from '@/features/report/lib/constants';

import type { AdminReportStatus, AdminReportType } from '../model/types';

export { REPORT_REASON_LABELS };

export const REPORT_TYPE_LABELS: Record<AdminReportType, string> = {
  BOARD: '게시글',
  COMMENT: '댓글',
};

export const REPORT_STATUS_LABELS: Record<AdminReportStatus, string> = {
  PENDING: '처리 대기',
  COMPLETED: '처리 완료',
};
