import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateAnnouncement } from '../api';
import type { UpdateAnnouncementRequest } from './types';

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, body }: { boardId: number; body: UpdateAnnouncementRequest }) =>
      updateAnnouncement(boardId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcements'] });
    },
  });
}
