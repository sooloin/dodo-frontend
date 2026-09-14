import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/shared/lib/react-query/queryKey';

import { updateNotificationReadState } from '../api/notification';

interface UpdateNotificationReadStateVariables {
  notificationId: number;
  isRead: boolean;
}

export function useUpdateNotificationReadState() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ notificationId, isRead }: UpdateNotificationReadStateVariables) =>
      updateNotificationReadState(notificationId, isRead),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications', 'list'] });
      void queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount() });
    },
  });
}
