import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/shared/lib/react-query/queryKey';

import { getNotificationList } from '../api/notification';
import type { NotificationListParams } from './types';

export function useNotificationList(params: NotificationListParams) {
  return useQuery({
    queryKey: queryKeys.notifications.list(params),
    queryFn: () => getNotificationList(params),
  });
}
