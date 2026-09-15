import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/shared/lib/react-query/queryKey';

import { getActivityHistoryDetail } from '../api/activityHistory';

export function useActivityHistoryDetail(historyId: number | null) {
  return useQuery({
    queryKey: queryKeys.activities.historyDetail(historyId ?? -1),
    queryFn: () => getActivityHistoryDetail(historyId as number),
    enabled: historyId !== null,
  });
}
