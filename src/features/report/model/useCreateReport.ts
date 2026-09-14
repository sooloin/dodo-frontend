import { useMutation } from '@tanstack/react-query';

import { reportBoard, reportComment } from '../api/report';
import type { ReportReason, ReportTargetType } from './types';

interface CreateReportVariables {
  targetType: ReportTargetType;
  targetId: number;
  reportReason: ReportReason;
}

export function useCreateReport() {
  return useMutation({
    mutationFn: async ({ targetType, targetId, reportReason }: CreateReportVariables) => {
      const payload = { reportReason };

      if (targetType === 'BOARD') {
        return reportBoard(targetId, payload);
      }

      return reportComment(targetId, payload);
    },
  });
}
