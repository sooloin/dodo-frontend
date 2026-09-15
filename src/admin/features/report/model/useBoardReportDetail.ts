import { useQuery } from '@tanstack/react-query';

import { adminQueryKeys } from '@/admin/lib/queryKeys';

import { getBoardReportDetail } from '../api';

export function useBoardReportDetail(boardId: number) {
  return useQuery({
    queryKey: adminQueryKeys.reports.board(boardId),
    queryFn: () => getBoardReportDetail(boardId),
    enabled: Number.isFinite(boardId),
  });
}
