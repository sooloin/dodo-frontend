import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/shared/lib/react-query/queryKey';

import { deleteNotification } from '../api/notification';

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) => deleteNotification(notificationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications', 'list'] });
      void queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount() });
    },
  });
}
