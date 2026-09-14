import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/shared/lib/react-query/queryKey';

import { getUnreadNotificationCount } from '../api/notification';

interface UseUnreadNotificationCountOptions {
  enabled?: boolean;
}

export function useUnreadNotificationCount({ enabled = true }: UseUnreadNotificationCountOptions = {}) {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: () => getUnreadNotificationCount(),
    enabled,
    refetchInterval: enabled ? 60_000 : false,
  });
}
