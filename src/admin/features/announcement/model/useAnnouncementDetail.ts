import { useQuery } from '@tanstack/react-query';

import { adminQueryKeys } from '@/admin/lib/queryKeys';

import { getAnnouncementDetail } from '../api';

export function useAnnouncementDetail(boardId: number) {
  return useQuery({
    queryKey: adminQueryKeys.announcements.detail(boardId),
    queryFn: () => getAnnouncementDetail(boardId),
    enabled: Number.isFinite(boardId),
  });
}
