import { useQuery } from '@tanstack/react-query';

import { adminQueryKeys } from '@/admin/lib/queryKeys';

import { getCommentReportDetail } from '../api';

export function useCommentReportDetail(commentId: number) {
  return useQuery({
    queryKey: adminQueryKeys.reports.comment(commentId),
    queryFn: () => getCommentReportDetail(commentId),
    enabled: Number.isFinite(commentId),
  });
}
