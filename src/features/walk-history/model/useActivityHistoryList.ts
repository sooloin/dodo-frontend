import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/shared/lib/react-query/queryKey';

import { getActivityHistoryList } from '../api/activityHistory';
import type { GetActivityHistoryListParams } from './types';

export function useActivityHistoryList(params?: GetActivityHistoryListParams) {
  return useQuery({
    queryKey: queryKeys.activities.history(params),
    queryFn: () => getActivityHistoryList(params),
  });
}
