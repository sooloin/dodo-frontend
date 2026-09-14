import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/shared/lib/react-query/queryKey';

import { markAllNotificationsRead } from '../api/notification';

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications', 'list'] });
      void queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount() });
    },
  });
}
